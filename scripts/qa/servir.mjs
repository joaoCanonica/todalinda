// Servidor estático local que imita a Vercel: cleanUrls, trailingSlash=false e os cabeçalhos do
// vercel.json (CSP, cache, X-Robots-Tag). Para testar a CSP e os cabeçalhos antes do deploy.
// Uso: node scripts/qa/servir.mjs [porta=4370]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { brotliCompressSync, constants } from 'node:zlib';
import { extname, join, normalize } from 'node:path';

const RAIZ = new URL('../..', import.meta.url).pathname;
const DIST = join(RAIZ, 'dist');
const porta = Number(process.argv[2] ?? 4370);
const cfg = JSON.parse(readFileSync(join(RAIZ, 'vercel.json'), 'utf8'));
const regras = cfg.headers.map((h) => ({
  re: new RegExp(`^${h.source.replace(/\(\.\*\)/g, '(.*)')}$`),
  headers: h.headers,
}));
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  let caminho = decodeURIComponent(url.pathname);
  if (caminho.length > 1 && caminho.endsWith('/')) {
    res.writeHead(308, { location: caminho.slice(0, -1) + url.search }).end();
    return;
  }
  const candidatos = [caminho, `${caminho}.html`, join(caminho, 'index.html')];
  let arq = candidatos
    .map((c) => normalize(join(DIST, c)))
    .find((p) => p.startsWith(DIST) && existsSync(p) && statSync(p).isFile());
  let status = 200;
  if (!arq) {
    arq = join(DIST, '404.html');
    status = 404;
  }
  const headers = { 'content-type': TIPOS[extname(arq)] ?? 'application/octet-stream' };
  for (const r of regras)
    if (r.re.test(caminho)) for (const h of r.headers) headers[h.key.toLowerCase()] = h.value;
  // como a Vercel: texto vai comprimido em brotli quando o navegador aceita
  const texto = /^(text\/|application\/(json|xml|javascript)|image\/svg)/.test(
    headers['content-type'],
  );
  if (texto && /\bbr\b/.test(req.headers['accept-encoding'] ?? '')) {
    const corpo = brotliCompressSync(readFileSync(arq), {
      params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
    });
    headers['content-encoding'] = 'br';
    headers.vary = 'Accept-Encoding';
    res.writeHead(status, headers);
    res.end(corpo);
    return;
  }
  res.writeHead(status, headers);
  createReadStream(arq).pipe(res);
}).listen(porta, '127.0.0.1', () =>
  console.log(`[servir] http://127.0.0.1:${porta} (dist/ + vercel.json)`),
);
