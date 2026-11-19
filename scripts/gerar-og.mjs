// Imagens Open Graph 1200×630 (sessão 8), geradas no build: a foto ★ da técnica + a palavra TODALINDA
// (logo oficial, sem redesenho) + "Lages/SC · desde 2017". Também gera o logo em PNG 512 (JSON-LD).
// Sem navegador: o texto vira vetor pelas fontes da casa (fontkit) e o sharp compõe (roda na Vercel).
// Saída: public/og/<nome>.jpg e public/marca/todalinda-logo-512.png (fora do git). Cache por conteúdo.
// Uso: node scripts/gerar-og.mjs  (roda no prebuild, depois do prepare-media)
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { create as createFont } from 'fontkit';
import { decompress } from 'wawoff2';
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url).pathname;
const OG = join(RAIZ, 'public/og');
const CACHE = join(OG, '.cache.json');
mkdirSync(OG, { recursive: true });
const ler = (p) => JSON.parse(readFileSync(join(RAIZ, p), 'utf8'));
const indice = ler('public/media/midia.json').itens;
const manifesto = new Map(ler('media.manifest.json').itens.map((i) => [i.id, i]));
const publicavel = (id) => {
  const m = manifesto.get(id);
  return m && !m.naoUsar && m.crianca === 'nao' && indice[id];
};
/** Maior derivado de uma imagem, ou o pôster do vídeo. */
function arquivoDe(id) {
  const i = indice[id];
  const sem = (src) => src.replace(/\?v=.*$/, ''); // a URL leva ?v=<hash>; o arquivo, não
  if (i.tipo === 'imagem') return sem(i.variantes.webp.at(-1).src);
  const t = Object.values(i.trechos)[0];
  return sem(t.variantes[0].poster.src);
}

// as artes: capa (home e páginas gerais) e uma por serviço publicado
const servicos = readdirSync(join(RAIZ, 'src/content/servicos'))
  .map((f) => ler(`src/content/servicos/${f}`))
  .filter((s) => s.publicado);
const trabalhos = readdirSync(join(RAIZ, 'src/content/trabalhos')).map((f) =>
  ler(`src/content/trabalhos/${f}`),
);
const fotoDe = (s) => {
  const destaques = trabalhos.filter((t) => t.tecnica === s.id && t.destaque).map((t) => t.midia);
  const lista = [...destaques, ...s.midia].filter(publicavel);
  return lista.find((id) => indice[id].tipo === 'imagem') ?? lista[0];
};
const artes = [
  { nome: 'capa', foto: 'f-749143529', titulo: 'Cor, corte e cuidado com o fio' },
  ...servicos.map((s) => ({ nome: `servico-${s.id}`, foto: fotoDe(s), titulo: s.nome })),
].filter((a) => a.foto && publicavel(a.foto));

const palavra = readFileSync(join(RAIZ, 'src/components/marca/svg/todalinda-palavra.svg'), 'utf8');

// ---------- texto em vetor (sem navegador) ----------
// As fontes da casa (woff2 variáveis) viram contornos SVG pelo fontkit; o sharp (librsvg) só desenha
// caminhos, então o resultado não depende de fontes instaladas na máquina do build.
// o fontkit não aplica o peso variável em WOFF2: descomprime para TTF (wawoff2) e aplica o eixo wght
const carregar = async (arq, eixos) =>
  createFont(
    Buffer.from(await decompress(readFileSync(join(RAIZ, 'public/fonts', arq)))),
  ).getVariation(eixos);
const FONTES = {
  versalete: await carregar('manrope-wght.woff2', { wght: 600 }),
  titulo: await carregar('playfair-display-wght-italico.woff2', { wght: 800 }),
};
/** Uma linha de texto como <path>, a partir da linha de base (x, y). Devolve o SVG e a largura. */
function linha(fonte, str, tamanho, { x, y, cor, espaco = 0 }) {
  const run = fonte.layout(str);
  const k = tamanho / fonte.unitsPerEm;
  let cx = 0;
  const d = [];
  run.glyphs.forEach((g, i) => {
    const pos = run.positions[i];
    d.push(
      g.path
        .scale(k, -k)
        .translate(x + cx + pos.xOffset * k, y - pos.yOffset * k)
        .toSVG(),
    );
    cx += pos.xAdvance * k + espaco;
  });
  return { svg: `<path fill="${cor}" d="${d.join(' ')}"/>`, largura: cx - espaco };
}
const largura = (fonte, str, tamanho, espaco = 0) =>
  linha(fonte, str, tamanho, { x: 0, y: 0, cor: '#000', espaco }).largura;
/** Quebra o título em linhas de até `max` px (como o max-width do CSS). */
function quebrar(fonte, str, tamanho, max, espaco) {
  const linhas = [];
  let atual = '';
  for (const p of str.split(' ')) {
    const teste = atual ? `${atual} ${p}` : p;
    if (atual && largura(fonte, teste, tamanho, espaco) > max) {
      linhas.push(atual);
      atual = p;
    } else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// medidas da arte (1200×630): foto à esquerda (560 px); painel Noite com 64 px de respiro
const X = 624;
const LARG_TEXTO = 1200 - X - 64;
const PAPEL = '#F7F3EC';
const OURO = '#AE8C55';
const OURO_CLARO = '#E2C88C';
function painel(titulo) {
  const vb = palavra.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 1161 170';
  const [, , vw, vh] = vb.split(/\s+/).map(Number);
  const altLogo = (400 * vh) / vw;
  const corpoLogo = palavra
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/currentColor/g, PAPEL);
  const num = linha(FONTES.versalete, 'EDIÇÃO TODALINDA · Nº 10', 18, {
    x: X,
    y: 64 + altLogo + 22 + 14,
    cor: OURO,
    espaco: 18 * 0.28,
  });
  const pe = linha(FONTES.versalete, 'LAGES/SC · DESDE 2017', 22, {
    x: X,
    y: 630 - 56 - 5,
    cor: OURO_CLARO,
    espaco: 22 * 0.24,
  });
  const yLinha = 630 - 56 - 22 - 24;
  // título: itálico 800, 64 px, entrelinha 1,02, centrado entre o bloco de cima e o fio de baixo
  const esp = -0.02 * 64;
  const linhas = quebrar(FONTES.titulo, titulo, 64, LARG_TEXTO, esp);
  const topo = 64 + altLogo + 22 + 18;
  const altura = linhas.length * 64 * 1.02;
  const y0 = (topo + yLinha) / 2 - altura / 2 + 64 * 0.8;
  const tit = linhas.map(
    (l, i) =>
      linha(FONTES.titulo, l, 64, { x: X, y: y0 + i * 64 * 1.02, cor: PAPEL, espaco: esp }).svg,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<svg x="${X}" y="64" width="400" height="${altLogo}" viewBox="${vb}">${corpoLogo}</svg>
${num.svg}
${tit.join('\n')}
<rect x="${X}" y="${yLinha}" width="${LARG_TEXTO}" height="1" fill="${PAPEL}" fill-opacity="0.22"/>
${pe.svg}
</svg>`;
}

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const pendentes = artes
  .map((a) => {
    const arq = join(RAIZ, 'public', arquivoDe(a.foto));
    const hash = createHash('sha1')
      .update('v2-vetor') // muda quando o desenho da arte muda
      .update(JSON.stringify(a))
      .update(readFileSync(arq))
      .update(palavra)
      .digest('hex');
    return { ...a, arq, hash, saida: join(OG, `${a.nome}.jpg`) };
  })
  .filter((a) => cache[a.nome] !== a.hash || !existsSync(a.saida));

for (const a of pendentes) {
  const foto = await sharp(a.arq).resize(560, 630, { fit: 'cover', position: 'centre' }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#121013' } })
    .composite([
      { input: foto, left: 0, top: 0 },
      { input: Buffer.from(painel(a.titulo)), left: 0, top: 0 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(a.saida);
  cache[a.nome] = a.hash;
}
if (pendentes.length) writeFileSync(CACHE, JSON.stringify(cache, null, 2));

// logo em PNG (JSON-LD "logo": o Google pede imagem rastreável, ≥ 112 px)
const logoPng = join(RAIZ, 'public/marca/todalinda-logo-512.png');
if (!existsSync(logoPng))
  await sharp(join(RAIZ, 'src/components/marca/svg/todalinda-logo.svg'), { density: 300 })
    .resize(512, 512, { fit: 'contain', background: '#00000000' })
    .png()
    .toFile(logoPng);

console.log(`[og] ${artes.length} imagens (${pendentes.length} novas) em public/og/; logo 512 px`);
