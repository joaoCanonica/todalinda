// Captura rotas do site em 390 e 1440 px, com e sem prefers-reduced-motion.
// Uso: pnpm capturar [rota ...]   (padrão: "/")
// Variáveis: PORTA (padrão 4322), SEM_BUILD=1 para pular o build.
// Saída: docs/capturas/<AAAA-MM-DD>/<rota>__<largura>[__reduzido].png
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('..', import.meta.url).pathname;
const PORTA = Number(process.env.PORTA ?? 4322);
const BASE = `http://127.0.0.1:${PORTA}`;
const rotas = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const larguras = [
  { largura: 390, altura: 844 },
  { largura: 1440, altura: 900 },
];
const movimentos = [
  { sufixo: '', reducedMotion: 'no-preference' },
  { sufixo: '__reduzido', reducedMotion: 'reduce' },
];

const hoje = new Date().toISOString().slice(0, 10);
const destino = join(RAIZ, 'docs', 'capturas', hoje);
mkdirSync(destino, { recursive: true });

const nomeDaRota = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '_'));

async function esperarServidor(url, ms = 30_000) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 404) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise((ok) => setTimeout(ok, 300));
  }
  throw new Error(`preview não respondeu em ${ms} ms (${url})`);
}

// Espera a ilha 3D estabilizar, se existir na página.
// Contrato da ilha (sessão 6B): elemento [data-ilha-3d] que ganha
// data-estado="pronto" (ou "fallback"/"erro") quando a cena para de mudar.
async function esperarIlha3D(pagina) {
  const ilha = await pagina.$('[data-ilha-3d]');
  if (!ilha) return 'ausente';
  await ilha.scrollIntoViewIfNeeded();
  try {
    await pagina.waitForFunction(
      () => {
        const el = document.querySelector('[data-ilha-3d]');
        return ['pronto', 'fallback', 'erro'].includes(el?.getAttribute('data-estado') ?? '');
      },
      undefined,
      { timeout: 20_000 },
    );
  } catch {
    console.warn('  ilha 3D não sinalizou "pronto" em 20 s; capturando assim mesmo');
  }
  // dois quadros extras para o canvas assentar
  await pagina.evaluate(
    () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))),
  );
  await pagina.evaluate(() => window.scrollTo(0, 0));
  return 'presente';
}

if (!process.env.SEM_BUILD || !existsSync(join(RAIZ, 'dist'))) {
  const b = spawnSync('pnpm', ['build'], { cwd: RAIZ, stdio: 'inherit' });
  if (b.status !== 0) process.exit(b.status ?? 1);
}

// O Astro 7 mantém um preview em segundo plano e recusa abrir outro: pare o anterior antes e depois.
const pararPreview = () =>
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { cwd: RAIZ, stdio: 'ignore' });
pararPreview();
const preview = spawn(
  'pnpm',
  ['exec', 'astro', 'preview', '--port', String(PORTA), '--host', '127.0.0.1'],
  {
    cwd: RAIZ,
    stdio: ['ignore', 'pipe', 'inherit'],
    detached: true,
  },
);
const encerrar = () => {
  pararPreview();
  try {
    process.kill(-preview.pid, 'SIGTERM');
  } catch {
    /* já saiu */
  }
};
process.on('exit', encerrar);

let falhas = 0;
try {
  await esperarServidor(BASE);
  const navegador = await chromium.launch();
  for (const rota of rotas) {
    for (const { largura, altura } of larguras) {
      for (const { sufixo, reducedMotion } of movimentos) {
        const contexto = await navegador.newContext({
          viewport: { width: largura, height: altura },
          deviceScaleFactor: 2,
          reducedMotion,
          locale: 'pt-BR',
        });
        const pagina = await contexto.newPage();
        const arquivo = join(destino, `${nomeDaRota(rota)}__${largura}${sufixo}.png`);
        try {
          // a abertura tem captura própria (scripts/capturar-abertura.mjs): aqui, sempre o estado final
          const resp = await pagina.goto(
            `${BASE}${rota}${rota.includes('?') ? '&' : '?'}abertura=0`,
            { waitUntil: 'networkidle' },
          );
          if (!resp || resp.status() >= 400) throw new Error(`HTTP ${resp?.status()}`);
          await pagina.evaluate(() => document.fonts.ready);
          // rola até o fim (dispara lazy-load e as entradas animadas) e volta ao topo
          await pagina.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.8)) {
              scrollTo(0, y);
              await new Promise((ok) => setTimeout(ok, 120));
            }
            scrollTo(0, 0);
            await Promise.all(
              [...document.images]
                .filter((i) => !i.complete)
                .map(
                  (i) =>
                    new Promise(
                      (ok) =>
                        i.addEventListener('load', ok, { once: true }) || setTimeout(ok, 3000),
                    ),
                ),
            );
          });
          await pagina.waitForTimeout(800);
          const ilha = await esperarIlha3D(pagina);
          await pagina.screenshot({ path: arquivo, fullPage: true });
          console.log(
            `ok  ${rota} ${largura}px${sufixo} (HTTP ${resp?.status()}, 3D ${ilha}) → ${arquivo}`,
          );
        } catch (e) {
          falhas++;
          console.error(`ERRO ${rota} ${largura}px${sufixo}: ${e.message}`);
        }
        await contexto.close();
      }
    }
  }
  await navegador.close();
} finally {
  encerrar();
}
process.exit(falhas ? 1 : 0);
