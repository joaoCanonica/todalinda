// QA (sessão 9): Lighthouse mobile em todas as rotas públicas do build (preview em :4350).
// Saída: docs/qa/lighthouse.json. Uso: node scripts/qa/lighthouse.mjs [rota ...]
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = new URL('../..', import.meta.url).pathname;
const LH = readdirSync(join(RAIZ, 'node_modules/.pnpm')).find((d) => d.startsWith('lighthouse@'));
const CL = readdirSync(join(RAIZ, 'node_modules/.pnpm')).find((d) =>
  d.startsWith('chrome-launcher@'),
);
const { default: lighthouse } = await import(
  join(RAIZ, 'node_modules/.pnpm', LH, 'node_modules/lighthouse/core/index.js')
);
const cl = await import(
  join(RAIZ, 'node_modules/.pnpm', CL, 'node_modules/chrome-launcher/dist/index.js')
);

const rotas = process.argv.slice(2);
if (!rotas.length) {
  const listar = (d) =>
    readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? listar(p) : f === 'index.html' ? [p] : [];
    });
  for (const p of listar(join(RAIZ, 'dist'))) {
    const r = `/${relative(join(RAIZ, 'dist'), p)}`
      .replace(/index\.html$/, '')
      .replace(/(.)\/$/, '$1');
    if (!r.startsWith('/_') && r !== '/avaliar') rotas.push(r);
  }
  rotas.push('/404');
}
const chrome = await cl.launch({
  chromePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
  chromeFlags: ['--headless=new', '--no-sandbox'],
});
const saida = [];
for (const rota of rotas.sort()) {
  const r = await lighthouse(`${process.env.BASE ?? 'http://127.0.0.1:4350'}${rota}`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  const a = r.lhr.audits;
  const c = r.lhr.categories;
  const falhas = Object.values(a)
    .filter(
      (x) =>
        x.score !== null &&
        x.score < 0.9 &&
        x.scoreDisplayMode !== 'informative' &&
        x.scoreDisplayMode !== 'manual',
    )
    .map((x) => x.id);
  const linha = {
    rota,
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: Math.round(a['largest-contentful-paint'].numericValue),
    cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    tbt: Math.round(a['total-blocking-time'].numericValue),
    falhas,
  };
  saida.push(linha);
  console.log(JSON.stringify(linha));
}
await chrome.kill();
writeFileSync(join(RAIZ, 'docs/qa/lighthouse.json'), JSON.stringify(saida, null, 2));
