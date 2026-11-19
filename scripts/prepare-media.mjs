// Gera os derivados de mídia em public/media/ (fora do git) a partir de media.manifest.json.
// Roda em predev/prebuild. Idempotente: cada saída tem uma chave (hash do original + parâmetros);
// se a chave não mudou e o arquivo existe, nada é refeito. Itens naoUsar nunca geram saída,
// e qualquer arquivo em public/media que não pertença ao manifesto atual é apagado.
//
// Uso: node scripts/prepare-media.mjs [--so-imagens | --so-videos] [id ...]
// Variáveis: SEM_MIDIA=1 pula tudo; FORCAR=1 refaz tudo; JOBS=n (padrão 2) vídeos em paralelo.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';

const VERSAO = 3; // muda quando os parâmetros de codificação mudam
const RAIZ = new URL('..', import.meta.url).pathname;
const SAIDA = join(RAIZ, 'public/media');
const CACHE = join(SAIDA, '.cache.json');
const LARGURAS = [480, 640, 800, 1200, 1600, 2400]; // 640: a foto de capa no celular (≈ 350 px CSS × DPR 1,75)
const pexec = promisify(execFile);

if (process.env.SEM_MIDIA) {
  console.log('[midia] SEM_MIDIA=1: pulando.');
  process.exit(0);
}

const args = process.argv.slice(2);
const soImagens = args.includes('--so-imagens');
const soVideos = args.includes('--so-videos');
const filtroIds = args.filter((a) => !a.startsWith('--'));

const manifesto = JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8'));
mkdirSync(SAIDA, { recursive: true });
const cache = existsSync(CACHE)
  ? JSON.parse(readFileSync(CACHE, 'utf8'))
  : { origens: {}, saidas: {} };
const esperados = new Set(['.cache.json', 'midia.json']);
const indice = {};
let feitos = 0;
let pulados = 0;

// hash do original, com cache por tamanho + data de modificação
async function hashOrigem(rel) {
  const st = statSync(join(RAIZ, rel));
  const marca = `${st.size}:${st.mtimeMs}`;
  const c = cache.origens[rel];
  if (c && c.marca === marca) return c.hash;
  const h = createHash('sha1');
  await new Promise((ok, erro) =>
    createReadStream(join(RAIZ, rel))
      .on('data', (d) => h.update(d))
      .on('end', ok)
      .on('error', erro),
  );
  const hash = h.digest('hex');
  cache.origens[rel] = { marca, hash };
  return hash;
}

// executa `gerar` só se a chave mudou ou algum arquivo de saída falta
async function talvez(chave, saidas, gerar) {
  for (const s of saidas) esperados.add(relative(SAIDA, s));
  const k = createHash('sha1')
    .update(JSON.stringify([VERSAO, chave]))
    .digest('hex');
  const ok =
    !process.env.FORCAR &&
    saidas.every((s) => existsSync(s) && cache.saidas[relative(SAIDA, s)] === k);
  if (ok) {
    pulados++;
    return;
  }
  await gerar();
  for (const s of saidas) cache.saidas[relative(SAIDA, s)] = k;
  writeFileSync(CACHE, JSON.stringify(cache)); // salva a cada saída: uma interrupção não perde o trabalho
  feitos++;
}

const kb = (p) => Math.round(statSync(p).size / 1024);

// ---------- imagens ----------
async function imagem(item) {
  const hash = await hashOrigem(item.arquivo);
  const pipeline = () => {
    let p = sharp(join(RAIZ, item.arquivo)).rotate(); // aplica EXIF
    if (item.rotacao) p = p.rotate(item.rotacao);
    if (item.recorte) p = p.extract(item.recorte);
    return p;
  };
  // decodifica o original uma vez só (lazy) e guarda medidas + LQIP no cache
  const chaveImg = JSON.stringify([hash, item.rotacao, item.recorte]);
  let base = null;
  const decodificar = async () => {
    if (!base) {
      const { data, info } = await pipeline().raw().toBuffer({ resolveWithObject: true });
      base = { data, info };
    }
    return base;
  };
  const daBase = async (w) => {
    const { data, info } = await decodificar();
    return sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    }).resize({ width: w, withoutEnlargement: true });
  };
  let infoImg = cache.imagens?.[item.id];
  if (!infoImg || infoImg.chave !== chaveImg) {
    const { info } = await decodificar();
    const lq = await (await daBase(20)).blur(0.6).webp({ quality: 40 }).toBuffer();
    infoImg = {
      chave: chaveImg,
      width: info.width,
      height: info.height,
      lqip: lq.toString('base64'),
    };
    cache.imagens = { ...(cache.imagens ?? {}), [item.id]: infoImg };
  }
  const meta = { width: infoImg.width, height: infoImg.height };
  const max = Math.min(item.resolucaoMax ?? meta.width, meta.width); // nunca acima do original
  const larguras = LARGURAS.filter((w) => w <= max);
  if (!larguras.includes(max) && max < LARGURAS.at(-1)) larguras.push(max);
  const pasta = join(SAIDA, 'img');
  mkdirSync(pasta, { recursive: true });
  const variantes = { avif: [], webp: [] };
  for (const w of larguras) {
    const avif = join(pasta, `${item.id}-${w}.avif`);
    const webp = join(pasta, `${item.id}-${w}.webp`);
    await talvez(
      { hash, id: item.id, w, rot: item.rotacao, rec: item.recorte },
      [avif, webp],
      async () => {
        const buf = await (await daBase(w)).png({ compressionLevel: 0 }).toBuffer();
        await sharp(buf).avif({ quality: 55, effort: 2 }).toFile(avif);
        await sharp(buf).webp({ quality: 78, effort: 4 }).toFile(webp);
      },
    );
    variantes.avif.push({ w, src: `/media/img/${item.id}-${w}.avif`, kb: kb(avif) });
    variantes.webp.push({ w, src: `/media/img/${item.id}-${w}.webp`, kb: kb(webp) });
  }
  const lqipBuf = Buffer.from(infoImg.lqip, 'base64');
  const altura = Math.round((meta.height * max) / meta.width);
  indice[item.id] = {
    tipo: 'imagem',
    natureza: item.natureza,
    largura: max,
    altura,
    proporcao: +(meta.width / meta.height).toFixed(4),
    lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
    variantes,
    ...(item.crianca !== 'nao' ? { bloqueio: `crianca:${item.crianca}` } : {}),
  };
}

// ---------- vídeos ----------
// recortes 4:5 dos loops do hero (y do topo, em px do original 720×1280); conferidos em docs/capturas/midia
const RECORTE_4x5 = { 'v-filme--ondas': 150, 'v-filme--iluminada': 160 };

function argsVideo({ trecho, w, h, crop, formato, audio }) {
  const loop = trecho.loop && !audio;
  const vf = [
    crop ? `crop=720:900:0:${crop}` : null,
    `scale=${w}:${h}:flags=lanczos`,
    'format=yuv420p',
  ]
    .filter(Boolean)
    .join(',');
  const grande = w >= 720;
  const comum = ['-ss', String(trecho.in), '-t', String(+(trecho.out - trecho.in).toFixed(3))];
  if (formato === 'mp4') {
    return [
      ...comum,
      '-vf',
      vf,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-profile:v',
      'high',
      '-crf',
      loop ? '27' : '24',
      '-maxrate',
      loop ? (grande ? '1300k' : '800k') : grande ? '2500k' : '1500k',
      '-bufsize',
      loop ? '2600k' : '5000k',
      ...(audio ? ['-c:a', 'aac', '-b:a', '96k', '-ac', '1'] : ['-an']),
      '-movflags',
      '+faststart',
    ];
  }
  return [
    ...comum,
    '-vf',
    vf,
    '-c:v',
    'libvpx-vp9',
    '-crf',
    loop ? '38' : '34',
    '-b:v',
    loop ? (grande ? '1100k' : '700k') : grande ? '2000k' : '1200k',
    '-row-mt',
    '1',
    '-deadline',
    'good',
    '-cpu-used',
    '3',
    ...(audio ? ['-c:a', 'libopus', '-b:a', '64k', '-ac', '1'] : ['-an']),
  ];
}

function vtt(item, trecho) {
  const p = join(RAIZ, 'docs/dados/transcricoes', `${item.id}.json`);
  if (!existsSync(p)) return null;
  const { segmentos } = JSON.parse(readFileSync(p, 'utf8'));
  const t = (s) => {
    const ms = Math.round(s * 1000);
    const hh = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${hh}:${mm}:${ss}.${String(ms % 1000).padStart(3, '0')}`;
  };
  const linhas = segmentos
    .filter((s) => s.fim > trecho.in && s.inicio < trecho.out)
    .map(
      (s, n) =>
        `${n + 1}\n${t(Math.max(0, s.inicio - trecho.in))} --> ${t(Math.min(trecho.out, s.fim) - trecho.in)}\n${s.texto}\n`,
    );
  return `WEBVTT\nKind: captions\nLanguage: pt-BR\n\n${linhas.join('\n')}`;
}

async function video(item, fila) {
  const hash = await hashOrigem(item.arquivo);
  const pasta = join(SAIDA, 'video');
  mkdirSync(pasta, { recursive: true });
  indice[item.id] = {
    tipo: 'video',
    duracao: item.duracao,
    audioLiberado: item.audioLiberado,
    trechos: {},
    ...(item.crianca !== 'nao' ? { bloqueio: `crianca:${item.crianca}` } : {}),
  };
  for (const trecho of item.trechos) {
    const nome = `${item.id}--${trecho.nome}`;
    const audio = trecho.audio && item.audioLiberado;
    const variantes = [];
    const tamanhos = (trecho.tamanhos ?? ['720x1280']).map((s) => s.split('x').map(Number));
    for (const [w, h] of tamanhos) variantes.push({ rotulo: `${w}x${h}`, w, h, crop: null });
    if (RECORTE_4x5[nome] !== undefined) {
      for (const [w0] of tamanhos) {
        const w = w0 >= 720 ? 720 : 544; // 544×680 mantém 4:5 com lados pares
        variantes.push({
          rotulo: `${w}x${(w * 5) / 4}-4x5`,
          w,
          h: (w * 5) / 4,
          crop: RECORTE_4x5[nome],
        });
      }
    }
    const saidaTrecho = {
      ...(trecho.crianca && trecho.crianca !== 'nao'
        ? { bloqueio: `crianca:${trecho.crianca}` }
        : {}),
      in: trecho.in,
      out: trecho.out,
      duracao: +(trecho.out - trecho.in).toFixed(2),
      loop: trecho.loop,
      audio,
      variantes: [],
    };
    for (const v of variantes) {
      const base = join(pasta, `${nome}-${v.rotulo}`);
      const mp4 = `${base}.mp4`;
      const webm = `${base}.webm`;
      const poster = `${base}.avif`;
      const chave = { hash, nome, v, trecho: [trecho.in, trecho.out], audio };
      fila.push(() =>
        talvez(chave, [mp4, webm, poster], async () => {
          const entrada = ['-loglevel', 'error', '-y'];
          await pexec('ffmpeg', [
            ...entrada,
            '-i',
            join(RAIZ, item.arquivo),
            ...argsVideo({ trecho, ...v, formato: 'mp4', audio }),
            mp4,
          ]);
          await pexec('ffmpeg', [
            ...entrada,
            '-i',
            join(RAIZ, item.arquivo),
            ...argsVideo({ trecho, ...v, formato: 'webm', audio }),
            webm,
          ]);
          // pôster = primeiro quadro do trecho (o loop começa nele)
          const { stdout } = await pexec(
            'ffmpeg',
            [
              ...entrada,
              '-ss',
              String(trecho.in),
              '-i',
              join(RAIZ, item.arquivo),
              '-frames:v',
              '1',
              '-vf',
              [v.crop ? `crop=720:900:0:${v.crop}` : null, `scale=${v.w}:${v.h}:flags=lanczos`]
                .filter(Boolean)
                .join(','),
              '-f',
              'image2pipe',
              '-c:v',
              'png',
              '-',
            ],
            { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 },
          );
          await sharp(stdout).avif({ quality: 55, effort: 4 }).toFile(poster);
          console.log(`  vídeo ${nome} ${v.rotulo}: mp4 ${kb(mp4)} KB · webm ${kb(webm)} KB`);
        }).then(() => {
          saidaTrecho.variantes.push({
            rotulo: v.rotulo,
            w: v.w,
            h: v.h,
            mp4: { src: `/media/video/${nome}-${v.rotulo}.mp4`, kb: kb(mp4) },
            webm: { src: `/media/video/${nome}-${v.rotulo}.webm`, kb: kb(webm) },
            poster: { src: `/media/video/${nome}-${v.rotulo}.avif`, kb: kb(poster) },
          });
        }),
      );
    }
    if (trecho.legenda) {
      const texto = vtt(item, trecho);
      if (texto) {
        const arq = join(SAIDA, 'legendas', `${nome}.vtt`);
        mkdirSync(join(SAIDA, 'legendas'), { recursive: true });
        esperados.add(relative(SAIDA, arq));
        writeFileSync(arq, texto);
        saidaTrecho.legenda = `/media/legendas/${nome}.vtt`;
      } else console.warn(`  sem transcrição para a legenda de ${nome}`);
    }
    indice[item.id].trechos[trecho.nome] = saidaTrecho;
  }
}

async function rodarFila(fila, n) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < fila.length) await fila[i++]();
    }),
  );
}

// ---------- execução ----------
const t0 = Date.now();
const publicaveis = manifesto.itens.filter(
  (i) => !i.naoUsar && (!filtroIds.length || filtroIds.includes(i.id)),
);
let temFfmpeg = true;
try {
  await pexec('ffmpeg', ['-version']);
} catch {
  temFfmpeg = false;
  console.warn('[midia] ffmpeg ausente: vídeos não serão gerados.');
}

if (!soVideos) {
  const imgs = publicaveis.filter((i) => i.tipo === 'imagem');
  console.log(`[midia] imagens: ${imgs.length}`);
  for (const it of imgs) await imagem(it);
}
if (!soImagens && temFfmpeg) {
  const vids = publicaveis.filter((i) => i.tipo === 'video' && i.trechos.length);
  console.log(`[midia] vídeos: ${vids.length}`);
  const fila = [];
  for (const it of vids) await video(it, fila);
  await rodarFila(fila, Number(process.env.JOBS ?? 2));
}

// limpeza: só em execução completa, apaga o que não pertence ao manifesto (inclui naoUsar)
if (!filtroIds.length && !soImagens && !soVideos) {
  let removidos = 0;
  const varrer = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) varrer(p);
      else if (!esperados.has(relative(SAIDA, p))) {
        rmSync(p);
        cache.saidas[relative(SAIDA, p)] = undefined; // some no JSON
        removidos++;
      }
    }
  };
  varrer(SAIDA);
  if (removidos) console.log(`[midia] ${removidos} arquivo(s) órfão(s) removido(s)`);
  // cache longo (1 ano, immutable) no deploy: cada URL leva o hash do conteúdo (?v=), então
  // um arquivo refeito com o mesmo nome nunca fica velho no navegador
  const versoes = new Map();
  const versionar = (no) => {
    if (Array.isArray(no)) return no.forEach(versionar);
    if (!no || typeof no !== 'object') return;
    for (const [k, v] of Object.entries(no)) {
      if ((k === 'src' || k === 'legenda') && typeof v === 'string' && v.startsWith('/media/')) {
        const limpo = v.replace(/\?v=.*$/, '');
        if (!versoes.has(limpo)) {
          const arq = join(SAIDA, limpo.slice('/media/'.length));
          versoes.set(
            limpo,
            existsSync(arq)
              ? createHash('sha1').update(readFileSync(arq)).digest('hex').slice(0, 10)
              : '',
          );
        }
        no[k] = versoes.get(limpo) ? `${limpo}?v=${versoes.get(limpo)}` : limpo;
      } else versionar(v);
    }
  };
  versionar(indice);
  writeFileSync(
    join(SAIDA, 'midia.json'),
    JSON.stringify({ gerado: new Date().toISOString(), versao: VERSAO, itens: indice }, null, 2),
  );
}
writeFileSync(CACHE, JSON.stringify(cache));
console.log(
  `[midia] ${feitos} gerado(s), ${pulados} já em dia, ${((Date.now() - t0) / 1000).toFixed(1)} s`,
);
