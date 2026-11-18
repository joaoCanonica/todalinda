// Gera media.manifest.json a partir de scripts/dados/curadoria.mjs + medidas reais dos arquivos.
// Uso: node scripts/gerar-manifesto.mjs   (re-rodar quando a curadoria ou as transcrições mudarem)
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';
import { artes, capturas, fotos, marca, pequenas, quadros, videos } from './dados/curadoria.mjs';

const RAIZ = new URL('..', import.meta.url).pathname;
const ORIG = 'media-originais';
const lista = (d) =>
  readdirSync(join(RAIZ, d))
    .filter((f) => !f.startsWith('.') && !f.endsWith('.gitkeep'))
    .filter(
      (f) =>
        !readdirSync(join(RAIZ, d), { withFileTypes: true }).find(
          (e) => e.name === f && e.isDirectory(),
        ),
    );

const base = (extra) => ({
  pessoa: null,
  tecnica: null,
  descricao: '',
  uso: [],
  texto: null,
  trechos: [],
  rotacao: 0,
  consentimento: 'autorizado',
  audioLiberado: false,
  problemas: [],
  edicoes: [],
  naoUsar: false,
  parAntesDepois: null,
  escolha: false,
  crianca: 'nao',
  ...extra,
});
const par = (p) => (p ? { papel: p.papel, com: p.com, confirmado: false } : null);

async function medir(rel) {
  const m = await sharp(join(RAIZ, rel)).metadata();
  return { largura: m.width, altura: m.height };
}
const usados = new Set();
const itens = [];

// fotos
for (const f of lista(`${ORIG}/fotos`)) {
  const rel = `${ORIG}/fotos/${f}`;
  const { largura, altura } = await medir(rel);
  if (pequenas[f]) {
    const p = pequenas[f];
    itens.push(
      base({
        id: p.id,
        arquivo: rel,
        tipo: 'imagem',
        natureza: p.pessoa ? 'foto' : 'capa-destaque',
        pessoa: p.pessoa ?? null,
        largura,
        altura,
        resolucaoMax: largura,
        descricao: p.pessoa
          ? `Retrato de ${p.pessoa} em 150 px.`
          : 'Capa de destaque do Instagram (ícone dourado de traço).',
        naoUsar: true,
        consentimento: 'nao-precisa',
        motivoNaoUsar: p.motivo ?? 'Capa de destaque de 150 px; o site tem iconografia própria.',
      }),
    );
    continue;
  }
  if (f === 'logo.jpeg') {
    itens.push(
      base({
        id: 'logo-jpeg',
        arquivo: rel,
        tipo: 'imagem',
        natureza: 'logo',
        largura,
        altura,
        resolucaoMax: largura,
        descricao: 'Logo original em JPEG (textura).',
        naoUsar: true,
        consentimento: 'nao-precisa',
        motivoNaoUsar: 'Substituído pelos SVG em media-originais/marca/.',
      }),
    );
    continue;
  }
  if (f.includes('(1)')) {
    itens.push(
      base({
        id: 'f-883558643-dup',
        arquivo: rel,
        tipo: 'imagem',
        natureza: 'foto',
        largura,
        altura,
        resolucaoMax: largura,
        descricao: 'Duplicado da recepção.',
        naoUsar: true,
        consentimento: 'nao-precisa',
        motivoNaoUsar: 'Duplicado de SaveClip.App_883558643….jpg.',
      }),
    );
    continue;
  }
  const chave = Object.keys({ ...fotos, ...artes })
    .sort((a, b) => b.length - a.length)
    .find((k) => f.includes(k));
  if (!chave) throw new Error(`sem curadoria: ${f}`);
  usados.add(chave);
  const c = fotos[chave] ?? artes[chave];
  const id = c.id ?? `f-${chave}`;
  const rot = c.rotacao ?? 0;
  const [lg, al] = rot % 180 ? [altura, largura] : [largura, altura];
  const lgFinal = c.recorte ? c.recorte.width : lg;
  itens.push(
    base({
      id,
      arquivo: rel,
      tipo: 'imagem',
      natureza: c.natureza ?? 'foto',
      largura,
      altura,
      resolucaoMax: lgFinal,
      pessoa: c.pessoa ?? null,
      tecnica: c.tecnica ?? null,
      descricao: c.descricao,
      uso: c.uso ?? [],
      rotacao: rot,
      recorte: c.recorte ?? null,
      edicoes: c.edicoes ?? [],
      problemas: c.problemas ?? [],
      escolha: !!c.escolha,
      naoUsar: !!c.naoUsar,
      ...(c.naoUsar ? { motivoNaoUsar: c.motivoNaoUsar, consentimento: 'nao-precisa' } : {}),
      ...(c.textoEm ? { textoEm: c.textoEm } : {}),
      parAntesDepois: par(c.par),
      crianca: c.crianca ?? 'nao',
      ...(al ? {} : {}),
    }),
  );
}
for (const k of [...Object.keys(fotos), ...Object.keys(artes)])
  if (!usados.has(k)) throw new Error(`curadoria sem arquivo: ${k}`);

// capturas de tela: no máximo 480 px
for (const f of lista(`${ORIG}/fotos/capturas`)) {
  const rel = `${ORIG}/fotos/capturas/${f}`;
  const hora = f.match(/(\d\d-\d\d-\d\d)\.png$/)[1].slice(0, 8);
  const c = capturas[hora];
  if (!c) throw new Error(`captura sem curadoria: ${f}`);
  const { largura, altura } = await medir(rel);
  itens.push(
    base({
      id: `cap-${hora}`,
      arquivo: rel,
      tipo: 'imagem',
      natureza: c.natureza ?? 'captura-de-tela',
      largura,
      altura,
      resolucaoMax: Math.min(480, largura),
      pessoa: c.pessoa ?? null,
      descricao: c.descricao,
      uso: c.uso,
      problemas: ['Captura de tela (~680 px): no máximo 480 px ou referência do 3D.'],
      ...(c.confirmarIdentidade ? { confirmarIdentidade: true } : {}),
      naoUsar: !!c.naoUsar,
      ...(c.naoUsar ? { motivoNaoUsar: c.motivoNaoUsar } : {}),
      ...(c.textoEm ? { textoEm: c.textoEm } : {}),
    }),
  );
}

// marca
for (const f of lista(`${ORIG}/marca`)) {
  const rel = `${ORIG}/marca/${f}`;
  const vb = readFileSync(join(RAIZ, rel), 'utf8')
    .match(/viewBox="([^"]+)"/)?.[1]
    .split(/[\s,]+/)
    .map(Number);
  itens.push(
    base({
      id: `marca-${basename(f, '.svg').replace('todalinda-', '')}`,
      arquivo: rel,
      tipo: 'vetor',
      natureza: 'logo',
      largura: vb ? Math.round(vb[2]) : null,
      altura: vb ? Math.round(vb[3]) : null,
      resolucaoMax: null,
      descricao: marca[f],
      uso: ['marca'],
      consentimento: 'nao-precisa',
      problemas: ['Ouro PROVISÓRIO até o manual oficial.'],
    }),
  );
}

// vídeos
const transcricao = (id) => {
  const p = join(RAIZ, 'docs/dados/transcricoes', `${id}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
};
for (const f of lista(`${ORIG}/videos`)) {
  const rel = `${ORIG}/videos/${f}`;
  const chave = Object.keys(videos).find((k) => f.includes(k));
  if (!chave) throw new Error(`vídeo sem curadoria: ${f}`);
  const c = videos[chave];
  const [w, h, dur] = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height:format=duration',
      '-of',
      'csv=p=0:s=,',
      join(RAIZ, rel),
    ],
    { encoding: 'utf8' },
  )
    .split(/[\n,]/)
    .filter(Boolean)
    .map(Number);
  const duracao = Math.round(dur * 100) / 100;
  const tr = transcricao(c.id);
  itens.push(
    base({
      id: c.id,
      arquivo: rel,
      tipo: 'video',
      natureza: 'video',
      largura: w,
      altura: h,
      duracao,
      resolucaoMax: w,
      pessoa: c.pessoa ?? null,
      tecnica: c.tecnica ?? null,
      descricao: c.descricao ?? '',
      uso: c.uso ?? [],
      texto: tr ? tr.segmentos.map((s) => s.texto).join(' ') : null,
      trechos: (c.trechos ?? []).map((t) => ({
        nome: t.nome,
        in: t.in,
        out: t.out ?? duracao,
        loop: !!t.loop,
        audio: !!t.audio,
        legenda: !!t.legenda,
        hero: !!t.hero,
        referencia: !!t.referencia,
        tamanhos: t.sizes,
        ...(t.nota ? { nota: t.nota } : {}),
      })),
      audioLiberado: !!c.audioLiberado,
      problemas: c.problemas ?? [],
      edicoes: c.trechos?.length ? ['corte de trechos', 'áudio removido nos loops'] : [],
      naoUsar: !!c.naoUsar,
      ...(c.naoUsar ? { motivoNaoUsar: c.motivoNaoUsar, consentimento: 'nao-precisa' } : {}),
      parAntesDepois: par(c.par),
      crianca: c.crianca ?? 'nao',
      ...(c.transcrever
        ? { transcrever: true, transcricao: tr ? `docs/dados/transcricoes/${c.id}.json` : null }
        : {}),
    }),
  );
}

// quadros de vídeo
for (const q of quadros) {
  const v = itens.find((i) => i.id === q.video);
  itens.push(
    base({
      id: q.id,
      arquivo: `${ORIG}/quadros/${q.id}.jpg`,
      tipo: 'imagem',
      natureza: 'quadro-de-video',
      largura: v.largura,
      altura: v.altura,
      resolucaoMax: v.largura,
      pessoa: q.pessoa ?? null,
      descricao: q.descricao,
      uso: q.uso,
      origem: { video: q.video, tempo: q.tempo },
      edicoes: ['quadro extraído sem upscale'],
      problemas: [
        `Quadro de vídeo: máximo ${v.largura} px de largura.`,
        ...(q.nota ? [q.nota] : []),
      ],
      crianca: q.crianca ?? 'nao',
    }),
  );
}

const manifesto = {
  $schema: './media.manifest.schema.json',
  versao: 1,
  atualizado: new Date().toISOString().slice(0, 10),
  itens,
};
writeFileSync(join(RAIZ, 'media.manifest.json'), JSON.stringify(manifesto, null, 2) + '\n');
console.log(`manifesto: ${itens.length} itens (${itens.filter((i) => i.naoUsar).length} naoUsar)`);
