// QA de desempenho (sessão 9), contra o servidor que imita a Vercel (:4370):
//  1. LCP da capa com e sem a abertura (4G aplicada: Lighthouse/devtools), 3 rodadas cada;
//  2. fps do tour 3D: desktop (1440) e "Android intermediário" (390, toque, CPU 4× mais lenta);
//  3. memória: abrir e fechar o tour 3 vezes (navegar /a-casa ↔ /), heap JS e contextos WebGL vivos.
// WebGL por software (SwiftShader): números de fps são o piso, não o de uma GPU real.
// Saída: docs/qa/desempenho.json
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('../..', import.meta.url).pathname;
const BASE = 'http://127.0.0.1:4370';
const pnpm = join(RAIZ, 'node_modules/.pnpm');
const LH = readdirSync(pnpm).find((d) => d.startsWith('lighthouse@'));
const CL = readdirSync(pnpm).find((d) => d.startsWith('chrome-launcher@'));
const { default: lighthouse } = await import(
  join(pnpm, LH, 'node_modules/lighthouse/core/index.js')
);
const cl = await import(join(pnpm, CL, 'node_modules/chrome-launcher/dist/index.js'));
const r = { lcp: {}, fps: {}, memoria: [] };

// 1. LCP com e sem abertura (Lighthouse com throttling aplicado de verdade: devtools)
const chrome = await cl.launch({
  chromePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
  chromeFlags: ['--headless=new', '--no-sandbox'],
});
for (const [rotulo, url] of [
  ['comAbertura', `${BASE}/?abertura=1`],
  ['semAbertura', `${BASE}/?abertura=0`],
]) {
  const v = [];
  for (let i = 0; i < 3; i++) {
    const x = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      throttlingMethod: 'devtools',
    });
    v.push(Math.round(x.lhr.audits['largest-contentful-paint'].numericValue));
  }
  r.lcp[rotulo] = { rodadasMs: v, medianaMs: v.sort((a, b) => a - b)[1] };
  console.log('LCP', rotulo, v);
}
await chrome.kill();

// 2 e 3. tour 3D
const nav = await chromium.launch({
  args: [
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-precise-memory-info',
    '--js-flags=--expose-gc',
  ],
});
async function fps(rotulo, opts, cpu) {
  const ctx = await nav.newContext(opts);
  await ctx.addInitScript(() =>
    localStorage.setItem('todalinda:consentimento', JSON.stringify({ v: 'recusado' })),
  );
  const p = await ctx.newPage();
  if (cpu) await (await ctx.newCDPSession(p)).send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await p.goto(`${BASE}/a-casa?ambiente=salao-de-cabelo`, { waitUntil: 'networkidle' });
  await p.locator('[data-palco]').scrollIntoViewIfNeeded();
  await p.waitForFunction(
    () =>
      ['pronto', 'fallback'].includes(document.querySelector('[data-palco]')?.dataset.estado ?? ''),
    null,
    { timeout: 30000 },
  );
  const amostras = [];
  for (let i = 0; i < 6; i++) {
    await p.waitForTimeout(1000);
    amostras.push(await p.evaluate(() => window.__tour3d?.fps() ?? 0));
  }
  // durante os voos entre ambientes
  const voo = [];
  for (const id of ['esmalteria', 'lounge-mezanino']) {
    await p.locator(`[data-aba="${id}"]`).click();
    await p.waitForTimeout(1000);
    voo.push(await p.evaluate(() => window.__tour3d?.fps() ?? 0));
  }
  const estavel = amostras.slice(1);
  r.fps[rotulo] = {
    amostras,
    voo,
    media: Math.round(estavel.reduce((a, b) => a + b, 0) / estavel.length),
    minimo: Math.min(...estavel, ...voo),
  };
  console.log('fps', rotulo, r.fps[rotulo]);
  await ctx.close();
}
await fps('desktop-1440', { viewport: { width: 1440, height: 900 } });
await fps(
  'android-390-cpu4x',
  { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6 },
  4,
);

{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() =>
    localStorage.setItem('todalinda:consentimento', JSON.stringify({ v: 'recusado' })),
  );
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Performance.enable');
  const medir = async (fase) => {
    await p.evaluate(() => window.gc?.());
    await p.waitForTimeout(300);
    const m = Object.fromEntries(
      (await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]),
    );
    const linha = {
      fase,
      heapMb: Math.round((m.JSHeapUsedSize / 1048576) * 10) / 10,
      nos: m.Nodes,
      ouvintes: m.JSEventListeners,
    };
    r.memoria.push(linha);
    console.log('memória', JSON.stringify(linha));
  };
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await medir('capa (antes)');
  for (let i = 1; i <= 3; i++) {
    await p.goto(`${BASE}/a-casa`, { waitUntil: 'networkidle' });
    await p.locator('[data-palco]').scrollIntoViewIfNeeded();
    await p.waitForFunction(
      () => document.querySelector('[data-palco]')?.dataset.estado === 'pronto',
      null,
      { timeout: 30000 },
    );
    await p.waitForTimeout(1500);
    await medir(`tour aberto (${i})`);
    await p.goto(`${BASE}/?abertura=0`, { waitUntil: 'networkidle' }); // sair: pagehide → destruir()
    await medir(`tour fechado (${i})`);
  }
  // dentro da mesma página: destruir e verificar o contexto WebGL
  await p.goto(`${BASE}/a-casa`, { waitUntil: 'networkidle' });
  await p.locator('[data-palco]').scrollIntoViewIfNeeded();
  await p.waitForFunction(
    () => document.querySelector('[data-palco]')?.dataset.estado === 'pronto',
    null,
    { timeout: 30000 },
  );
  r.contextoAposDestruir = await p.evaluate(() => {
    window.__tour3d?.destruir();
    const c = document.querySelector('[data-palco] canvas');
    const gl = c?.getContext('webgl2');
    return { contextoPerdido: gl ? gl.isContextLost() : 'sem contexto' };
  });
  console.log('após destruir()', JSON.stringify(r.contextoAposDestruir));
  await ctx.close();
}
await nav.close();
writeFileSync(join(RAIZ, 'docs/qa/desempenho.json'), JSON.stringify(r, null, 2));
