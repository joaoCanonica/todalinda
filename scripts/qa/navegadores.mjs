// QA de ambientes (sessão 9), contra :4370: WebGL desligado (tour cai nas fotos + lista),
// JS desligado (o conteúdo aparece, o agendador vira o link geral, o tour mostra a lista) e
// Android 390 px (toque). Só há Chromium neste ambiente: WebKit e Firefox ficam para o teste manual.
// Saída: docs/qa/navegadores.json
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('../..', import.meta.url).pathname;
const BASE = 'http://127.0.0.1:4370';
const r = {};
const rede = (ctx) =>
  ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (x) => x.fulfill({ status: 200, body: '' }));

{
  const nav = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await rede(ctx);
  const p = await ctx.newPage();
  await p.goto(`${BASE}/a-casa`, { waitUntil: 'networkidle' });
  await p.locator('[data-tour]').scrollIntoViewIfNeeded();
  await p.waitForTimeout(3000);
  r.semWebgl = await p.evaluate(() => ({
    motivo: document.querySelector('[data-tour]')?.dataset.fallback ?? null,
    fotoVisivel: !document.querySelector('[data-fallback]')?.hidden,
    abas: document.querySelectorAll('[role=tab]').length,
  }));
  await p.screenshot({
    path: join(
      RAIZ,
      'docs/capturas',
      new Date().toISOString().slice(0, 10),
      'qa',
      'sem-webgl__a-casa__390.png',
    ),
  });
  console.log('sem WebGL', JSON.stringify(r.semWebgl));
  await nav.close();
}
{
  const nav = await chromium.launch();
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  await rede(ctx);
  const p = await ctx.newPage();
  r.semJs = {};
  for (const rota of [
    '/',
    '/agendar',
    '/servicos/loiros',
    '/trabalhos',
    '/a-casa',
    '/como-chegar',
    '/equipe/dido-rodrigues',
  ]) {
    await p.goto(`${BASE}${rota}`, { waitUntil: 'load' });
    r.semJs[rota] = await p.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 40) ?? null,
      textoVisivel: document.body.innerText.length,
      enviar: decodeURIComponent(
        (document.querySelector('[data-enviar]')?.getAttribute('href') ?? '').split('text=')[1] ??
          '',
      ),
      ctaAgendar:
        document.querySelector('a[data-agendar]')?.getAttribute('href')?.slice(0, 40) ?? null,
      abas: document.querySelectorAll('[role=tab]').length,
    }));
    console.log('sem JS', rota, JSON.stringify(r.semJs[rota]));
  }
  await p.goto(`${BASE}/`, { waitUntil: 'load' });
  await p.screenshot({
    path: join(
      RAIZ,
      'docs/capturas',
      new Date().toISOString().slice(0, 10),
      'qa',
      'sem-js__capa__390.png',
    ),
  });
  await nav.close();
}
writeFileSync(join(RAIZ, 'docs/qa/navegadores.json'), JSON.stringify(r, null, 2));
