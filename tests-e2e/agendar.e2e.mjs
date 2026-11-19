// E2E do agendador, de /avaliar, de /avaliar/qr e do consentimento (sessão 7).
// Uso: pnpm build && pnpm test:e2e   (sobe o preview em 127.0.0.1:4360; 390 px; relógio fixo em 18/11/2026)
// O relógio fixo deixa as datas previsíveis: 19/11 qui · 20/11 sex (feriado) · 21/11 sáb · 22 dom · 23 seg · 24 ter.
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const PORTA = 4360;
const BASE = `http://127.0.0.1:${PORTA}`;
const RAIZ = new URL('..', import.meta.url).pathname;
const SAIDA = `${RAIZ}docs/capturas/${new Date().toISOString().slice(0, 10)}`;
const HOJE = new Date('2026-11-18T12:00:00-03:00');
const GERAL = 'Olá! Vim pelo site da Todalinda e quero agendar um horário.';
const resultados = [];
mkdirSync(SAIDA, { recursive: true });

execFileSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { cwd: RAIZ, stdio: 'ignore' });
const servidor = spawn(
  'pnpm',
  ['exec', 'astro', 'preview', '--port', String(PORTA), '--host', '127.0.0.1'],
  {
    cwd: RAIZ,
    stdio: 'ignore',
  },
);
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 250));
}

const nav = await chromium.launch();
async function pagina({ js = true, consentimento = 'recusado' } = {}) {
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: js,
  });
  if (consentimento)
    await ctx.addInitScript(
      (v) => localStorage.setItem('todalinda:consentimento', JSON.stringify({ v })),
      consentimento,
    );
  // nenhuma ida à rede de verdade: WhatsApp, Google e OSM respondem localmente
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) =>
    r.fulfill({ status: 200, body: 'ok', contentType: 'text/plain' }),
  );
  const p = await ctx.newPage();
  await p.clock.setFixedTime(HOJE);
  p.on('pageerror', (e) => console.log('  ERRO NA PÁGINA', e.message));
  // o agendador carrega depois do LCP: espera ficar pronto antes de interagir
  const goto = p.goto.bind(p);
  p.goto = async (url, o) => {
    const r = await goto(url, o);
    if (js && /\/(agendar|servicos|equipe)/.test(url))
      await p.waitForSelector('form[data-agendador][data-pronto]', {
        state: 'attached',
        timeout: 8000,
      });
    return r;
  };
  return p;
}
/** A mensagem que o botão Enviar vai mandar (decodificada do link) e a prévia na tela. */
async function mensagem(p, raiz = 'body') {
  const form = p.locator(`${raiz} form[data-agendador]`).first();
  const href = await form.locator('[data-enviar]').getAttribute('href');
  const texto = decodeURIComponent(new URL(href).searchParams.get('text') ?? '');
  const previa = (await form.locator('[data-previa]').textContent())?.trim();
  return { texto, previa, href };
}
const escolher = (p, raiz, nome, valor) =>
  p.locator(`${raiz} input[name="${nome}"][value="${valor}"]`).first().check({ force: true });

async function cenario(nome, fn) {
  try {
    await fn();
    resultados.push({ nome, ok: true });
    console.log(`ok   ${nome}`);
  } catch (e) {
    resultados.push({ nome, ok: false, erro: e.message });
    console.log(`FALHA ${nome}\n     ${e.message.split('\n').slice(0, 6).join('\n     ')}`);
  }
}
const confere = async (p, esperado, raiz = 'body') => {
  const m = await mensagem(p, raiz);
  assert.equal(m.texto, esperado);
  assert.equal(m.previa, esperado);
  assert.match(m.href, /^https:\/\/wa\.me\/5549991772089\?text=/);
  return m;
};

const F = '#conteudo'; // o agendador da página /agendar (a gaveta também existe)

await cenario('1. só o serviço', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar`);
  await escolher(p, F, 'servico', 'corte');
  await confere(p, 'Olá! Vim pelo site e quero agendar Corte.', F);
  await p.screenshot({ path: `${SAIDA}/e2e-agendar-1-servico__390.png`, fullPage: true });
});

await cenario('2. serviço + profissional + dia e período', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar`);
  await escolher(p, F, 'servico', 'morena-iluminada');
  assert.equal(
    await p.locator(`${F} [data-passo-profissional]`).isVisible(),
    true,
    'passo 2 deveria aparecer',
  );
  await escolher(p, F, 'profissional', 'isabela-cristina');
  await escolher(p, F, 'data', '2026-11-21');
  await escolher(p, F, 'periodo', 'tarde');
  await confere(
    p,
    'Olá! Vim pelo site e quero agendar Morena iluminada com Isabela Cristina, de preferência sábado, 21/11, à tarde.',
    F,
  );
  await p.screenshot({ path: `${SAIDA}/e2e-agendar-2-profissional__390.png`, fullPage: true });
});

await cenario('3. mechas com química', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar`);
  await escolher(p, F, 'servico', 'esmalteria');
  assert.equal(
    await p.locator(`${F} [data-pergunta-quimica]`).isVisible(),
    false,
    'química não vale para esmalteria',
  );
  await escolher(p, F, 'servico', 'mechas');
  assert.equal(await p.locator(`${F} [data-pergunta-quimica]`).isVisible(), true);
  await escolher(p, F, 'quimica', 'sim');
  await escolher(p, F, 'data', '2026-11-24');
  await escolher(p, F, 'periodo', 'qualquer');
  await confere(
    p,
    'Olá! Vim pelo site e quero agendar Mechas, de preferência terça, 24/11, em qualquer horário. Já fiz química nos últimos 6 meses: sim.',
    F,
  );
});

await cenario('4. primeira vez, com nome', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar`);
  await escolher(p, F, 'servico', 'loiros');
  await escolher(p, F, 'primeira', 'sim');
  assert.equal(
    await p.locator(`${F} [data-primeira-cor]`).isVisible(),
    true,
    'aviso de teste de mecha',
  );
  await p.locator(`${F} input[name="nome"]`).fill('Ana  Paula');
  await confere(
    p,
    'Olá! Vim pelo site e quero agendar Loiros. É minha primeira vez na Todalinda. Meu nome é Ana Paula.',
    F,
  );
});

await cenario('5. dia desabilitado (domingo, segunda e feriado)', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar`);
  await escolher(p, F, 'servico', 'corte');
  for (const [data, motivo] of [
    ['2026-11-22', /domingo/],
    ['2026-11-23', /segunda/],
    ['2026-11-20', /feriado/],
  ]) {
    const r = p.locator(`${F} input[name="data"][value="${data}"]`);
    assert.equal(await r.isDisabled(), true, `${data} deveria estar desabilitado`);
    assert.match((await r.locator('xpath=..').textContent()) ?? '', motivo);
    await r.click({ force: true }).catch(() => undefined);
    assert.equal(await r.isChecked(), false);
  }
  await confere(p, 'Olá! Vim pelo site e quero agendar Corte.', F);
  await p.locator(`${F} [data-dias]`).screenshot({ path: `${SAIDA}/e2e-agendar-5-dias__390.png` });
});

await cenario('6. sem JS: cai no link geral', async () => {
  const p = await pagina({ js: false, consentimento: null });
  await p.goto(`${BASE}/agendar`);
  const href = await p.locator(`${F} [data-enviar]`).getAttribute('href');
  assert.equal(decodeURIComponent(new URL(href).searchParams.get('text') ?? ''), GERAL);
  assert.equal((await p.locator(`${F} [data-previa]`).textContent())?.trim(), GERAL);
  assert.equal(
    await p.locator('[data-consentimento]').isVisible(),
    false,
    'sem JS, sem aviso (e nada de terceiro)',
  );
});

await cenario('7. abrindo de /servicos/loiros (gaveta já preenchida)', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/servicos/loiros`);
  await p.locator('.materia-capa a[data-agendar]').click();
  const g = 'dialog[data-gaveta-agendar]';
  assert.equal(await p.locator(g).isVisible(), true, 'a gaveta abre');
  await p.waitForTimeout(700); // a gaveta entra deslizando
  assert.equal(await p.locator(`${g} input[name="servico"][value="loiros"]`).isChecked(), true);
  await escolher(p, g, 'data', '2026-11-19');
  await escolher(p, g, 'periodo', 'manha');
  await confere(
    p,
    'Olá! Vim pelo site e quero agendar Loiros, de preferência quinta, 19/11, de manhã.',
    g,
  );
  await p.screenshot({ path: `${SAIDA}/e2e-agendar-7-gaveta-loiros__390.png` });
  const eventos = await p.evaluate(() => window.__medicao);
  assert.ok(
    eventos.some((e) => e.nome === 'clique_agendar' && e.props.servico === 'loiros' && !e.enviado),
  );
});

await cenario('8. abrindo de /equipe/dido-rodrigues', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/equipe/dido-rodrigues`);
  await p.locator('.perfil a[data-agendar]').click();
  const g = 'dialog[data-gaveta-agendar]';
  assert.equal(await p.locator(g).isVisible(), true);
  await p.waitForTimeout(700);
  await escolher(p, g, 'servico', 'corte');
  assert.equal(
    await p.locator(`${g} input[name="profissional"][value="dido-rodrigues"]`).isChecked(),
    true,
  );
  await confere(p, 'Olá! Vim pelo site e quero agendar Corte com Dido Rodrigues.', g);
  await p.screenshot({ path: `${SAIDA}/e2e-agendar-8-gaveta-dido__390.png` });
});

await cenario('/agendar?servico=&profissional= (links de fora)', async () => {
  const p = await pagina();
  await p.goto(`${BASE}/agendar?servico=avaliacao-capilar&profissional=andressa-savaris`);
  await confere(p, 'Olá! Vim pelo site e quero agendar Avaliação capilar com Andressa Savaris.', F);
});

await cenario('/avaliar redireciona para o Google (o=qr)', async () => {
  const p = await pagina();
  const pedido = p.waitForRequest(
    (r) => /google\.|g\.page/.test(r.url()) && r.isNavigationRequest(),
    { timeout: 5000 },
  );
  await p.goto(`${BASE}/avaliar?o=qr`);
  const r = await pedido;
  console.log('     →', r.url());
  await p.waitForURL(/google\.|g\.page/, { timeout: 5000 });
});

await cenario('/avaliar sem JS: meta refresh + link visível + noindex', async () => {
  const p = await pagina({ js: false, consentimento: null });
  const resp = await p.request.get(`${BASE}/avaliar?o=site`);
  const html = await resp.text();
  assert.match(html, /<meta http-equiv="refresh" content="1;url=https:\/\//);
  assert.match(html, /noindex/);
  assert.match(html, /toque aqui para avaliar/);
});

await cenario('/avaliar/qr imprime em A6 e A5 (uma página cada)', async () => {
  const ctx = await nav.newContext({ viewport: { width: 800, height: 1000 } });
  const p = await ctx.newPage();
  for (const [formato, mm] of [
    ['a6', [105, 148]],
    ['a5', [148, 210]],
  ]) {
    await p.goto(`${BASE}/avaliar/qr?formato=${formato}`);
    await p.emulateMedia({ media: 'print' });
    const pdf = await p.pdf({ preferCSSPageSize: true, printBackground: true });
    const caminho = `${SAIDA}/avaliar-qr-${formato}.pdf`;
    writeFileSync(caminho, pdf);
    const txt = pdf.toString('latin1');
    const paginas = (txt.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    const caixa = txt.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/);
    const [w, h] = [Number(caixa?.[1]), Number(caixa?.[2])].map((pt) =>
      Math.round((pt / 72) * 25.4),
    );
    console.log(
      `     ${formato}: ${paginas} página(s), ${w} × ${h} mm → ${caminho.replace(RAIZ, '')}`,
    );
    assert.equal(paginas, 1);
    assert.ok(Math.abs(w - mm[0]) <= 1 && Math.abs(h - mm[1]) <= 1, `${w}×${h} mm`);
    await p.emulateMedia({ media: 'screen' });
  }
  await p.goto(`${BASE}/avaliar/qr`);
  await p.screenshot({ path: `${SAIDA}/avaliar-qr__tela.png`, fullPage: true });
  await ctx.close();
});

await cenario('nenhum request de terceiro antes do consentimento', async () => {
  const ctx = await nav.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const terceiros = [];
  ctx.on('request', (r) => {
    const u = new URL(r.url());
    if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data'))
      terceiros.push(r.url());
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.fulfill({ status: 200, body: '' }));
  const p = await ctx.newPage();
  for (const rota of [
    '/',
    '/agendar',
    '/servicos/loiros',
    '/trabalhos',
    '/como-chegar',
    '/equipe',
    '/a-casa',
    '/nossa-historia',
  ]) {
    await p.goto(`${BASE}${rota}`, { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await p.waitForTimeout(400);
  }
  assert.deepEqual(terceiros, [], `requests de terceiros: ${terceiros.join(', ')}`);
  // o aviso aparece; "Carregar o mapa" sem aceite não carrega nada e pede o aceite
  await p.goto(`${BASE}/como-chegar`);
  await p.waitForSelector('[data-consentimento]:not([hidden])', { timeout: 5000 }); // carrega depois do LCP
  assert.equal(
    await p.locator('[data-consentimento]').isVisible(),
    true,
    'o aviso aparece na primeira visita',
  );
  await p.screenshot({ path: `${SAIDA}/e2e-consentimento__390.png` });
  await p.locator('[data-mapa-carregar]').click();
  await p.waitForTimeout(300);
  assert.deepEqual(terceiros, [], 'mapa não pode carregar sem aceite');
  // pesos iguais: mesmo tamanho e mesma cor
  const [rec, ace] = await Promise.all(
    ['recusado', 'aceito'].map((v) =>
      p.locator(`[data-consentir="${v}"]`).evaluate((b) => {
        const c = getComputedStyle(b);
        const r = b.getBoundingClientRect();
        return [
          Math.round(r.width),
          Math.round(r.height),
          c.color,
          c.backgroundColor,
          c.borderColor,
          c.fontSize,
        ].join('|');
      }),
    ),
  );
  assert.equal(rec, ace, 'Aceitar e Recusar com o mesmo peso');
  await p.locator('[data-consentir="aceito"]').click();
  await p.waitForTimeout(500);
  assert.ok(
    terceiros.some((u) => u.includes('openstreetmap.org')),
    'depois do aceite, o mapa carrega',
  );
  await ctx.close();
});

await nav.close();
servidor.kill();
execFileSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { cwd: RAIZ, stdio: 'ignore' });
const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} cenários ok`);
process.exit(falhas.length ? 1 : 0);
