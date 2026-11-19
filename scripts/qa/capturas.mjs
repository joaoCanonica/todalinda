// Capturas de acabamento (sessão 9): página inteira em 390 e 1440 px, do servidor :4370.
// Uso: node scripts/qa/capturas.mjs <antes|depois> [rota ...]
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const RAIZ = new URL('../..', import.meta.url).pathname;
const [fase = 'antes', ...dadas] = process.argv.slice(2);
const rotas = dadas.length
  ? dadas
  : [
      '/',
      '/servicos/morena-iluminada',
      '/servicos/loiros',
      '/servicos/mechas',
      '/trabalhos',
      '/equipe',
      '/equipe/dido-rodrigues',
      '/nossa-historia',
      '/como-chegar',
      '/agendar',
      '/tratamentos',
      '/perguntas-frequentes',
      '/a-casa',
      '/dois-reais-ou-um-cabelo',
      '/revista',
      '/privacidade',
      '/404',
    ];
const pasta = join(RAIZ, 'docs/capturas', new Date().toISOString().slice(0, 10), 'qa', fase);
mkdirSync(pasta, { recursive: true });
const nav = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
for (const largura of [390, 1440]) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: largura < 500 ? 844 : 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() =>
    localStorage.setItem('todalinda:consentimento', JSON.stringify({ v: 'recusado' })),
  );
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.fulfill({ status: 200, body: '' }));
  const p = await ctx.newPage();
  for (const rota of rotas) {
    await p.goto(`http://127.0.0.1:4370${rota}${rota === '/' ? '?abertura=0' : ''}`, {
      waitUntil: 'networkidle',
    });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(rota === '/a-casa' ? 3000 : 700);
    const nome = (rota === '/' ? 'capa' : rota.slice(1).replace(/\//g, '_')) + `__${largura}.png`;
    await p.screenshot({ path: join(pasta, nome), fullPage: true });
  }
  await ctx.close();
}
await nav.close();
console.log(`[capturas] ${rotas.length * 2} em ${pasta}`);
