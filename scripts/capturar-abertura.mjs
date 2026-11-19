// Captura a abertura da home em instantes fixos (?abertura-t=<ms> congela a linha do tempo),
// em 390 e 1440 px, + o estado final com movimento reduzido. Saída: docs/capturas/<data>/abertura/.
// Uso: node scripts/capturar-abertura.mjs [rota=/]   (precisa de dist/; rode o build antes)
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('..', import.meta.url).pathname;
const rota = process.argv[2] ?? '/';
const PORTA = 4333;
const BASE = `http://127.0.0.1:${PORTA}`;
const TEMPOS = [0, 800, 1500, 2200, 3000];
const destino = join(RAIZ, 'docs/capturas', new Date().toISOString().slice(0, 10), 'abertura');
mkdirSync(destino, { recursive: true });

const parar = () =>
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { cwd: RAIZ, stdio: 'ignore' });
parar();
const prev = spawn(
  'pnpm',
  ['exec', 'astro', 'preview', '--port', String(PORTA), '--host', '127.0.0.1'],
  { cwd: RAIZ, stdio: 'ignore', detached: true },
);
const fim = () => {
  parar();
  try {
    process.kill(-prev.pid, 'SIGTERM');
  } catch {
    /* já saiu */
  }
};
process.on('exit', fim);
for (let i = 0; i < 100; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((ok) => setTimeout(ok, 300));
}

const nav = await chromium.launch();
const nome = rota === '/' ? 'home' : rota.replace(/\//g, '');
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  for (const t of TEMPOS) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto(`${BASE}${rota}?abertura-t=${t}`, { waitUntil: 'networkidle' });
    await p.waitForSelector(`html[data-abertura-congelada="${t}"]`, { timeout: 15000 });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({
      path: join(destino, `${nome}__${w}__t${String(t).padStart(4, '0')}.png`),
    });
    console.log(`ok ${w}px t=${t}ms`);
    await ctx.close();
  }
  const ctx = await nav.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
  const abertura = await p.evaluate(() => document.documentElement.dataset.abertura ?? 'nenhuma');
  await p.screenshot({ path: join(destino, `${nome}__${w}__reduzido.png`) });
  console.log(`ok ${w}px reduzido (abertura: ${abertura})`);
  await ctx.close();
}
await nav.close();
fim();
process.exit(0);
