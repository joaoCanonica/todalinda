// Pesos do build (sessão 9), medidos em gzip: JS inicial por página (scripts e o que eles importam
// estaticamente, sem os import() dinâmicos), a ilha 3D, GLB e splats, vídeos, fontes, imagens OG.
// Falha se passar do orçamento do CLAUDE.md §4. Saída: docs/qa/pesos.json
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const RAIZ = new URL('../..', import.meta.url).pathname;
const DIST = join(RAIZ, 'dist');
const gz = (p) => gzipSync(readFileSync(p)).length;
const kb = (b) => Math.round((b / 1024) * 10) / 10;
const listar = (d, filtro) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? listar(p, filtro) : filtro(f) ? [p] : [];
  });

// JS inicial: <script src> + importações estáticas (from"./x.js" / import"./x.js"), sem import()
const estaticas = (arq) => {
  const c = readFileSync(arq, 'utf8');
  return [...c.matchAll(/(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g)].map((m) =>
    join(DIST, '_astro', m[1].slice(2)),
  );
};
const jsInicial = (html) => {
  const vistos = new Set();
  const fila = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => join(DIST, m[1]));
  let total = 0;
  while (fila.length) {
    const a = fila.pop();
    if (vistos.has(a) || !existsSync(a)) continue;
    vistos.add(a);
    total += gz(a);
    fila.push(...estaticas(a));
  }
  for (const m of html.matchAll(
    /<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  ))
    total += gzipSync(m[1]).length;
  return total;
};
const paginas = listar(DIST, (f) => f === 'index.html' || f === '404.html').map((p) => {
  const html = readFileSync(p, 'utf8');
  return {
    rota: `/${relative(DIST, p)}`
      .replace(/index\.html$/, '')
      .replace(/(.)\/$/, '$1')
      .replace('404.html', '404'),
    jsKb: kb(jsInicial(html)),
    htmlKb: kb(gzipSync(html).length),
  };
});

// ilha 3D: o que o tour baixa ao carregar a maquete (cena + three.core); GLTFLoader/meshopt só com GLB
const astro = readdirSync(join(DIST, '_astro'));
const pega = (prefixo) =>
  astro
    .filter((f) => f.startsWith(prefixo) && f.endsWith('.js'))
    .map((f) => join(DIST, '_astro', f));
const ilha = [...pega('cena.'), ...pega('three.core.')].reduce((n, a) => n + gz(a), 0);
const ilhaGlb =
  ilha +
  [...pega('glb.'), ...pega('GLTFLoader.'), ...pega('meshopt_decoder')].reduce(
    (n, a) => n + gz(a),
    0,
  );
const spark = pega('spark.module.').reduce((n, a) => n + gz(a), 0);
const pastaModelos = join(RAIZ, 'public/modelos');
const glbs = existsSync(pastaModelos) ? listar(pastaModelos, (f) => f.endsWith('.glb')) : [];
const splats = existsSync(pastaModelos)
  ? listar(pastaModelos, (f) => /\.(spz|ply|splat|ksplat|sog)$/.test(f))
  : [];
const media = join(RAIZ, 'public/media');
const videos = listar(media, (f) => /\.(mp4|webm)$/.test(f));
const maiorVideo = videos
  .map((v) => ({ v: relative(media, v), b: statSync(v).size }))
  .sort((a, b) => b.b - a.b)[0];
const fontes = listar(join(RAIZ, 'public/fonts'), (f) => f.endsWith('.woff2')).map((f) => ({
  arquivo: relative(RAIZ, f),
  kb: kb(statSync(f).size),
}));
const og = listar(join(RAIZ, 'public/og'), (f) => f.endsWith('.jpg')).map((f) => statSync(f).size);

const r = {
  orcamento: { jsInicialKb: 40, ilhaKb: 180, glbMb: 3, splatMb: 40 },
  jsInicial: {
    maximoKb: Math.max(...paginas.map((p) => p.jsKb)),
    paginas: paginas.sort((a, b) => b.jsKb - a.jsKb),
  },
  ilha3d: { maqueteKb: kb(ilha), comGlbKb: kb(ilhaGlb), sparkSobDemandaKb: kb(spark) },
  glb: glbs.map((g) => ({
    arquivo: relative(RAIZ, g),
    mb: Math.round((statSync(g).size / 1048576) * 100) / 100,
  })),
  splats: splats.map((g) => ({
    arquivo: relative(RAIZ, g),
    mb: Math.round((statSync(g).size / 1048576) * 100) / 100,
  })),
  videos: {
    arquivos: videos.length,
    totalMb: Math.round((videos.reduce((n, v) => n + statSync(v).size, 0) / 1048576) * 10) / 10,
    maior: maiorVideo ? { arquivo: maiorVideo.v, kb: kb(maiorVideo.b) } : null,
  },
  fontes,
  og: { imagens: og.length, maiorKb: kb(Math.max(...og)) },
};
writeFileSync(join(RAIZ, 'docs/qa/pesos.json'), JSON.stringify(r, null, 2));
const falhas = [];
if (r.jsInicial.maximoKb > 40) falhas.push(`JS inicial ${r.jsInicial.maximoKb} KB > 40 KB`);
if (r.ilha3d.comGlbKb > 180) falhas.push(`ilha 3D ${r.ilha3d.comGlbKb} KB > 180 KB`);
for (const g of r.glb) if (g.mb > 3) falhas.push(`${g.arquivo} ${g.mb} MB > 3 MB`);
for (const s of r.splats) if (s.mb > 40) falhas.push(`${s.arquivo} ${s.mb} MB > 40 MB`);
console.log(
  `[pesos] JS inicial máx ${r.jsInicial.maximoKb} KB (${r.jsInicial.paginas[0]?.rota}) · ilha 3D ${r.ilha3d.maqueteKb} KB (com GLB ${r.ilha3d.comGlbKb}) · Spark sob demanda ${r.ilha3d.sparkSobDemandaKb} KB · GLB ${r.glb.length} · splats ${r.splats.length} · vídeos ${r.videos.arquivos} (${r.videos.totalMb} MB) · fontes ${fontes.map((f) => f.kb).join('+')} KB`,
);
for (const f of falhas) console.log(`  ✗ ${f}`);
process.exit(falhas.length ? 1 : 0);
