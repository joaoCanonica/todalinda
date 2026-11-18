// Valida contraste WCAG 2.2 de todos os pares de cor do site (src/config/tema.ts).
// Saída 1 se algum par usado reprovar, ou se um par proibido passar a ser seguro (revisar a regra).
import { cores, paresDeContraste, paresProibidos } from '../src/config/tema.ts';

const lum = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let falhas = 0;
console.log('[audit-contraste] WCAG 2.2 AA');
for (const p of paresDeContraste) {
  const r = razao(cores[p.texto], cores[p.fundo]);
  const ok = r >= p.minimo;
  if (!ok) falhas++;
  console.log(
    `  ${ok ? '✓' : '✗'} ${p.texto} sobre ${p.fundo}: ${r.toFixed(2)}:1 (mín. ${p.minimo}) · ${p.uso}`,
  );
}
for (const [t, f] of paresProibidos)
  console.log(`  · proibido: ${t} sobre ${f} (${razao(cores[t], cores[f]).toFixed(2)}:1)`);
console.log(falhas ? `  ✗ ${falhas} par(es) reprovado(s)` : '  ✓ todos os pares aprovados');
process.exit(falhas ? 1 : 0);
