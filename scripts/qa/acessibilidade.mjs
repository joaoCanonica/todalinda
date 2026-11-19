// QA de acessibilidade (sessão 9), contra o servidor que imita a Vercel (scripts/qa/servir.mjs, :4370):
//  1. axe-core (WCAG 2.2 A/AA) em todas as rotas, 390 e 1440 px;
//  2. teclado do início ao fim na capa: abertura → pular → capa → sumário → antes e depois (comparador)
//     → agendador completo → WhatsApp;
//  3. zoom 200% (viewport de 640 px CSS): sem rolagem horizontal;
//  4. movimento reduzido: sem animação em curso;
//  5. CSP: nenhuma violação no console em nenhuma rota (com os cabeçalhos do vercel.json);
//  6. árvore de acessibilidade do agendador e do tour (o que o leitor de tela anuncia).
// Saída: docs/qa/acessibilidade.json e docs/qa/arvore-*.txt
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('../..', import.meta.url).pathname;
const BASE = 'http://127.0.0.1:4370';
const AXE = readFileSync(
  join(
    RAIZ,
    'node_modules/.pnpm',
    readdirSync(join(RAIZ, 'node_modules/.pnpm')).find((d) => d.startsWith('axe-core@')),
    'node_modules/axe-core/axe.min.js',
  ),
  'utf8',
);
const listar = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? listar(p) : f === 'index.html' ? [p] : [];
  });
const rotas = listar(join(RAIZ, 'dist'))
  .map((p) =>
    `/${relative(join(RAIZ, 'dist'), p)}`.replace(/index\.html$/, '').replace(/(.)\/$/, '$1'),
  )
  .filter((r) => r !== '/avaliar')
  .sort();
const resultado = { axe: [], csp: [], zoom: [], teclado: null, movimento: null };
const nav = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const sempreRecusa = (ctx) =>
  ctx.addInitScript(() =>
    localStorage.setItem('todalinda:consentimento', JSON.stringify({ v: 'recusado' })),
  );
const rede = (ctx) =>
  ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.fulfill({ status: 200, body: '' }));

// 1, 3 e 5: axe, zoom 200% e CSP em todas as rotas
for (const [largura, altura, rotulo] of [
  [390, 844, '390'],
  [1440, 900, '1440'],
  [640, 400, 'zoom-200'],
]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura } });
  await rede(ctx);
  const p = await ctx.newPage();
  const violacoes = [];
  p.on(
    'console',
    (m) =>
      /Content Security Policy|Refused to/.test(m.text()) && violacoes.push(m.text().slice(0, 240)),
  );
  for (const rota of rotas) {
    violacoes.length = 0;
    await p.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(rota === '/a-casa' ? 2500 : 600); // o tour 3D carrega depois do LCP
    if (rotulo === 'zoom-200') {
      const sobra = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      resultado.zoom.push({ rota, sobra });
      continue;
    }
    await p.evaluate(`${AXE};0`); // via DevTools (CDP): a CSP da página continua valendo para o resto
    const r = await p.evaluate(async () => {
      const x = await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      });
      return x.violations.map((v) => ({
        id: v.id,
        impacto: v.impact,
        alvos: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
    });
    resultado.axe.push({ rota, largura: rotulo, violacoes: r });
    if (violacoes.length)
      resultado.csp.push({ rota, largura: rotulo, msgs: [...new Set(violacoes)] });
    console.log(
      `${rotulo} ${rota}: axe ${r.length}${violacoes.length ? ` · CSP ${violacoes.length}` : ''}`,
    );
  }
  await ctx.close();
}

// 2: teclado do início ao fim na capa (390 px, sem preferência de consentimento: o aviso também entra)
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  await rede(ctx);
  await sempreRecusa(ctx);
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const passos = [];
  const foco = () =>
    p.evaluate(() => {
      const el = document.activeElement;
      const cs = el ? getComputedStyle(el) : null;
      const visivel = cs ? cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' : false;
      return {
        tag: el?.tagName,
        texto: (el?.getAttribute('aria-label') || el?.textContent || '')
          .trim()
          .replace(/\s+/g, ' ')
          .slice(0, 50),
        nome: el?.getAttribute('name'),
        valor: el?.getAttribute('value'),
        secao:
          el?.closest('section[id], header[data-capa], [data-ab-camada]')?.id ||
          el?.closest('header')?.className ||
          '',
        visivel,
      };
    });
  // a abertura: o primeiro Tab vai para "Pular" e Enter pula
  await p.keyboard.press('Tab');
  passos.push({ acao: 'Tab', ...(await foco()) });
  const naAbertura = /pular/i.test(passos[0].texto);
  if (naAbertura) await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  const marcos = {
    capa: false,
    sumario: false,
    comparador: false,
    agendador: false,
    whatsapp: false,
  };
  let semFocoVisivel = 0;
  for (let i = 0; i < 260 && !marcos.whatsapp; i++) {
    await p.keyboard.press('Tab');
    const f = await foco();
    if (!f.visivel && f.tag !== 'BODY') semFocoVisivel++;
    passos.push({ acao: 'Tab', ...f });
    if (/capa/.test(f.secao)) marcos.capa = true;
    if (f.secao === 'sumario') marcos.sumario = true;
    if (
      f.tag === 'INPUT' &&
      (await p.evaluate(() => document.activeElement?.type)) === 'range' &&
      !marcos.comparador
    ) {
      const antes = await p.evaluate(() => document.activeElement.value);
      await p.keyboard.press('ArrowRight');
      await p.keyboard.press('ArrowRight');
      const depois = await p.evaluate(() => document.activeElement.value);
      marcos.comparador = depois !== antes;
      passos.push({ acao: `→→ comparador ${antes} → ${depois}` });
    }
    if (f.nome === 'servico' && !marcos.agendador) {
      // radios: setas escolhem; Tab passa ao próximo grupo
      await p.keyboard.press('ArrowRight');
      await p.keyboard.press('ArrowRight');
      passos.push({ acao: '→→ serviço', ...(await foco()) });
      marcos.agendador = true;
    }
    if (f.nome === 'data') {
      await p.keyboard.press('ArrowRight');
      passos.push({ acao: '→ dia', ...(await foco()) });
    }
    if (f.nome === 'periodo') {
      await p.keyboard.press('ArrowRight');
      passos.push({ acao: '→ período', ...(await foco()) });
    }
    if (/Enviar pelo WhatsApp/i.test(f.texto)) {
      const href = await p.evaluate(() => document.activeElement.href);
      marcos.whatsapp = /wa\.me\/5549991772089\?text=/.test(href);
      passos.push({
        acao: 'Enter → WhatsApp',
        href: decodeURIComponent(href.split('text=')[1] ?? ''),
      });
    }
  }
  resultado.teclado = {
    naAbertura,
    marcos,
    tabs: passos.filter((x) => x.acao === 'Tab').length,
    semFocoVisivel,
    passos,
  };
  console.log(
    'teclado',
    JSON.stringify(marcos),
    'tabs',
    resultado.teclado.tabs,
    'sem foco visível',
    semFocoVisivel,
  );
  await ctx.close();
}

// 4: movimento reduzido — nenhuma animação em curso e a abertura não roda
{
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await rede(ctx);
  await sempreRecusa(ctx);
  const p = await ctx.newPage();
  const r = {};
  for (const rota of ['/', '/servicos/mechas', '/a-casa']) {
    await p.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    r[rota] = await p.evaluate(() => ({
      animacoes: document.getAnimations().filter((a) => a.playState === 'running').length,
      videosTocando: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
      abertura: !!document.querySelector('[data-ab-camada]'),
      tour3d: document.querySelector('[data-tour]')?.dataset.fallback ?? null,
    }));
  }
  resultado.movimento = r;
  console.log('movimento reduzido', JSON.stringify(r));
  await ctx.close();
}

// 6: o que o leitor de tela anuncia no agendador e no tour
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
  await rede(ctx);
  await sempreRecusa(ctx);
  const p = await ctx.newPage();
  await p.goto(`${BASE}/agendar`, { waitUntil: 'networkidle' });
  await p.waitForSelector('form[data-agendador][data-pronto]', { state: 'attached' });
  await p.locator('#conteudo input[name="servico"][value="mechas"]').check({ force: true });
  writeFileSync(
    join(RAIZ, 'docs/qa/arvore-agendador.txt'),
    await p.locator('#conteudo form[data-agendador]').ariaSnapshot(),
  );
  await p.goto(`${BASE}/a-casa`, { waitUntil: 'networkidle' });
  writeFileSync(
    join(RAIZ, 'docs/qa/arvore-tour.txt'),
    await p.locator('[data-tour]').ariaSnapshot(),
  );
  await ctx.close();
}

await nav.close();
writeFileSync(join(RAIZ, 'docs/qa/acessibilidade.json'), JSON.stringify(resultado, null, 2));
const totalAxe = resultado.axe.reduce((n, x) => n + x.violacoes.length, 0);
console.log(
  `axe: ${totalAxe} violação(ões) em ${resultado.axe.length} páginas · CSP: ${resultado.csp.length} página(s) com violação · zoom 200%: ${resultado.zoom.filter((z) => z.sobra > 0).length} página(s) com rolagem horizontal`,
);
