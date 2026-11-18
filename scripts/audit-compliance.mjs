// Varre o dist/ (HTML gerado) atrás de: termos vetados, AggregateRating, mídia naoUsar,
// mídia com criança e capturas acima de 480 px. Rodar depois do build.
// Uso: node scripts/audit-compliance.mjs [--dist=dist] [--simular=termo|naoUsar|captura|nota]
//   Qualquer trava derruba (preview ou produção); idade a confirmar só derruba em MODO=producao.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { MODO } from '../src/config/ambiente.ts';
import { checarHtml } from '../src/lib/travas.ts';

const RAIZ = new URL('..', import.meta.url).pathname;
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1] ?? null;
const DIST = join(RAIZ, arg('dist') ?? 'dist');
const simular = arg('simular');
const manifesto = JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8')).itens;

if (!existsSync(DIST)) {
  console.error(`[audit-compliance] ${relative(RAIZ, DIST)}/ não existe: rode o build antes.`);
  process.exit(1);
}

const htmls = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'));

const SIMULACOES = {
  termo: '<p>Aproveite a promoção: o melhor salão de Lages.</p>',
  naoUsar: '<img src="/media/img/eq-dido-150-150.webp" alt="">',
  captura: '<img src="/media/img/cap-12-24-16-800.webp" alt="">',
  nota: '<script type="application/ld+json">{"@type":"AggregateRating","ratingValue":4.6}</script>',
};

const achados = [];
for (const f of htmls) {
  let html = readFileSync(join(DIST, f), 'utf8');
  if (simular && SIMULACOES[simular] && f === htmls[0]) html += SIMULACOES[simular];
  achados.push(...checarHtml(html, f, manifesto, MODO));
}

console.log(
  `[audit-compliance] modo ${MODO} · ${htmls.length} página(s)${simular ? ` · simulando "${simular}"` : ''}`,
);
for (const a of achados)
  console.log(`  ${a.nivel.toUpperCase().padEnd(5)} ${a.regra}: ${a.mensagem}`);
const travas = achados.filter((a) => a.nivel === 'trava' || a.nivel === 'erro');
console.log(travas.length ? `  ✗ ${travas.length} violação(ões)` : '  ✓ nenhuma violação');
process.exit(travas.length ? 1 : 0);
