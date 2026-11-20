// Cabeçalhos de deploy (sessão 9): gera vercel.json a partir do dist/ — a CSP leva o hash SHA-256 de
// cada <script> e <style> inline e de cada atributo style="" do build (nada de 'unsafe-inline').
// Uso: node scripts/gerar-headers.mjs            → escreve vercel.json
//      node scripts/gerar-headers.mjs --conferir → falha se o vercel.json estiver desatualizado (postbuild)
//
// Exceções da CSP (documentadas em docs/CONFERENCIA_FINAL.md §Deploy):
//  - script-src 'wasm-unsafe-eval': os decodificadores do 3D (Meshopt, Draco, Basis/KTX2) e o Spark
//    (splat) compilam WebAssembly; só baixam sob demanda, no /a-casa.
//  - worker-src blob: — esses decodificadores rodam em Web Workers criados de um Blob.
//  - connect-src data: blob: — o WASM embutido em base64 é lido por fetch(data:).
//  - frame-src www.google.com — o mapa do Google, só depois do clique ou do aceite.
//  - script-src/connect-src plausible.io — a medição, só depois do aceite.
//  - style-src 'unsafe-hashes' — os atributos style="" (proporção das fotos, LQIP) vão por hash.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname;
const DIST = join(RAIZ, 'dist');
const ARQ = join(RAIZ, 'vercel.json');
const conferir = process.argv.includes('--conferir');
if (!existsSync(DIST)) {
  console.error('[headers] dist/ ausente: rode `pnpm build`');
  process.exit(1);
}
const html = [];
const listar = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) listar(p);
    else if (f.endsWith('.html')) html.push(readFileSync(p, 'utf8'));
  }
};
listar(DIST);

const hash = (t) => `'sha256-${createHash('sha256').update(t, 'utf8').digest('base64')}'`;
const scripts = new Set();
const estilos = new Set();
const atributos = new Set();
const desescapar = (v) =>
  v
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
for (const h of html) {
  for (const [, attrs, corpo] of h.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(attrs ?? '') || /application\/ld\+json/.test(attrs ?? '')) continue; // JSON-LD não executa
    if (corpo.trim()) scripts.add(hash(corpo));
  }
  for (const [, corpo] of h.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g))
    estilos.add(hash(corpo));
  for (const [, v] of h.matchAll(/\sstyle="([^"]*)"/g)) atributos.add(hash(desescapar(v)));
}
// O vercel.json serve aos dois modos (preview e produção têm um ou outro estilo diferente, como o
// selo PROVISÓRIO): ao gerar, somam-se os hashes que já estavam na CSP com os do build atual.
const anterior = existsSync(ARQ) ? readFileSync(ARQ, 'utf8') : '';
const cspAnterior = anterior.match(/"Content-Security-Policy",\s*"value":\s*"([^"]+)"/)?.[1] ?? '';
const hashesDe = (diretiva) =>
  new Set(
    cspAnterior
      .split(';')
      .find((d) => d.trim().startsWith(diretiva))
      ?.match(/'sha256-[^']+'/g) ?? [],
  );
const scriptsAntes = hashesDe('script-src');
const estilosAntes = hashesDe('style-src');
const ord = (s) => [...s].sort();

const csp = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' https://plausible.io ${ord(new Set([...scripts, ...(conferir ? [] : scriptsAntes)])).join(' ')}`,
  `style-src 'self' 'unsafe-hashes' ${ord(new Set([...estilos, ...atributos, ...(conferir ? [] : estilosAntes)])).join(' ')}`,
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self'",
  "connect-src 'self' data: blob: https://plausible.io",
  "worker-src 'self' blob:",
  'frame-src https://www.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const ano = 'public, max-age=31536000, immutable';
const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  installCommand: 'pnpm install --frozen-lockfile',
  buildCommand: 'pnpm build',
  outputDirectory: 'dist',
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    // cabeçalhos de documento só nas páginas: nos arquivos estáticos (JS, fontes, imagens, vídeos)
    // a CSP não serve para nada e custaria ~5,6 KB por resposta
    {
      source: '/(.*)',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
    {
      source: '/((?!_astro/|media/|fonts/|og/|modelos/|marca/).*)',
      headers: [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value:
            'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=(), fullscreen=(self)',
        },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ],
    },
    // arquivos com hash no nome (_astro) ou na URL (?v= em /media e /modelos): 1 ano, imutável
    { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: ano }] },
    { source: '/media/(.*)', headers: [{ key: 'Cache-Control', value: ano }] },
    { source: '/modelos/(.*)', headers: [{ key: 'Cache-Control', value: ano }] },
    {
      source: '/modelos/(.*)\\.glb',
      headers: [{ key: 'Content-Type', value: 'model/gltf-binary' }],
    },
    {
      source: '/fonts/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
    },
    { source: '/og/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    // a rota curta de avaliação: sem cache (mede cada passagem) e fora do índice
    {
      source: '/avaliar',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    },
    { source: '/avaliar/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/_(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    {
      source: '/llms.txt',
      headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }],
    },
  ],
};
const texto = `${JSON.stringify(config, null, 2)}\n`;
const resumo = `${scripts.size} scripts, ${estilos.size} estilos, ${atributos.size} atributos style por hash`;
if (conferir) {
  // tudo o que este build precisa tem de estar na CSP do vercel.json (o resto da config, idêntico)
  const faltam = [
    ...[...scripts].filter((h) => !scriptsAntes.has(h)),
    ...[...estilos, ...atributos].filter((h) => !estilosAntes.has(h)),
  ];
  // compara o conteúdo (JSON, chave a chave), não o texto: na Vercel o arquivo pode chegar
  // com outra formatação; a CSP já foi conferida acima pelos hashes
  const semCsp = (o) =>
    JSON.stringify(o, (_k, v) =>
      v && typeof v === 'object' && v.key === 'Content-Security-Policy' ? { key: v.key } : v,
    );
  let lido = {};
  try {
    lido = JSON.parse(anterior);
  } catch {
    // ilegível: todas as chaves contam como diferentes
  }
  // só as chaves que este script gera (a plataforma pode acrescentar as dela)
  const diferentes = Object.keys(config).filter((k) => semCsp(lido[k]) !== semCsp(config[k]));
  for (const k of diferentes)
    console.error(
      `[headers] ${k}: lido ${semCsp(lido[k])?.slice(0, 300)} · esperado ${semCsp(config[k]).slice(0, 300)}`,
    );
  if (faltam.length || diferentes.length) {
    console.error(
      `[headers] vercel.json desatualizado em relação ao build (${faltam.length} hash(es) faltando na CSP; chaves diferentes: ${diferentes.join(', ') || 'nenhuma'}; ${resumo}): rode \`pnpm deploy:headers\``,
    );
    process.exit(1);
  }
  console.log(`[headers] vercel.json cobre este build (${resumo})`);
} else {
  writeFileSync(ARQ, texto);
  console.log(`[headers] vercel.json escrito (${resumo}; CSP com ${csp.length} caracteres)`);
}
