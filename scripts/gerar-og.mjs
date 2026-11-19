// Imagens Open Graph 1200×630 (sessão 8), geradas no build: a foto ★ da técnica + a palavra TODALINDA
// (logo oficial, sem redesenho) + "Lages/SC · desde 2017". Também gera o logo em PNG 512 (JSON-LD).
// Saída: public/og/<nome>.jpg e public/marca/todalinda-logo-512.png (fora do git). Cache por conteúdo.
// Uso: node scripts/gerar-og.mjs  (roda no prebuild, depois do prepare-media)
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
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
const fonte = (f) =>
  `data:font/woff2;base64,${readFileSync(join(RAIZ, 'public/fonts', f)).toString('base64')}`;
const html = (a, foto) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:P;src:url(${fonte('playfair-display-wght.woff2')});font-weight:400 900}
@font-face{font-family:P;font-style:italic;src:url(${fonte('playfair-display-wght-italico.woff2')});font-weight:400 900}
@font-face{font-family:M;src:url(${fonte('manrope-wght.woff2')});font-weight:200 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;display:grid;grid-template-columns:560px 1fr;background:#121013;color:#F7F3EC;overflow:hidden}
.foto{background:url(${foto}) center/cover}
.texto{display:flex;flex-direction:column;justify-content:space-between;padding:64px 64px 56px}
.palavra{width:400px;color:#F7F3EC}.palavra svg{width:100%;height:auto;display:block}
.num{font:600 18px/1 M;letter-spacing:.28em;text-transform:uppercase;color:#AE8C55;margin-top:22px}
h1{font:italic 800 64px/1.02 P;letter-spacing:-.02em;max-width:9.5em}
.pe{font:600 22px/1 M;letter-spacing:.24em;text-transform:uppercase;color:#E2C88C;border-top:1px solid rgba(247,243,236,.22);padding-top:24px}
</style></head><body><div class="foto"></div><div class="texto">
<div><div class="palavra">${palavra.replace('<svg ', '<svg fill="currentColor" ')}</div><p class="num">Edição Todalinda · Nº 10</p></div>
<h1>${a.titulo}</h1><p class="pe">Lages/SC · desde 2017</p></div></body></html>`;

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const pendentes = artes
  .map((a) => {
    const arq = join(RAIZ, 'public', arquivoDe(a.foto));
    const hash = createHash('sha1')
      .update(JSON.stringify(a))
      .update(readFileSync(arq))
      .update(palavra)
      .digest('hex');
    return { ...a, arq, hash, saida: join(OG, `${a.nome}.jpg`) };
  })
  .filter((a) => cache[a.nome] !== a.hash || !existsSync(a.saida));

if (pendentes.length) {
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const a of pendentes) {
    // a foto entra como data URL (JPEG 1200 px) para o HTML não depender de servidor
    const jpg = await sharp(a.arq)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
    await p.setContent(html(a, `data:image/jpeg;base64,${jpg.toString('base64')}`), {
      waitUntil: 'load',
    });
    await p.evaluate(() => document.fonts.ready);
    const png = await p.screenshot({ type: 'png' });
    await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(a.saida);
    cache[a.nome] = a.hash;
  }
  await nav.close();
  writeFileSync(CACHE, JSON.stringify(cache, null, 2));
}

// logo em PNG (JSON-LD "logo": o Google pede imagem rastreável, ≥ 112 px)
const logoPng = join(RAIZ, 'public/marca/todalinda-logo-512.png');
if (!existsSync(logoPng))
  await sharp(join(RAIZ, 'src/components/marca/svg/todalinda-logo.svg'), { density: 300 })
    .resize(512, 512, { fit: 'contain', background: '#00000000' })
    .png()
    .toFile(logoPng);

console.log(`[og] ${artes.length} imagens (${pendentes.length} novas) em public/og/; logo 512 px`);
