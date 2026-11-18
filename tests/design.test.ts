import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cores, paresDeContraste } from '../src/config/tema.ts';

describe('design system', () => {
  it('audit-contraste aprova todos os pares', () => {
    const r = spawnSync('node', ['scripts/audit-contraste.mjs'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
  });
  it('tokens do CSS batem com tema.ts', () => {
    const css = readFileSync(
      new URL('../src/styles/tokens.css', import.meta.url),
      'utf8',
    ).toLowerCase();
    for (const [nome, hex] of Object.entries(cores)) {
      const v = `--cor-${nome.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`)}: ${hex.toLowerCase()};`;
      expect(css, v).toContain(v);
    }
  });
  it('nenhum par usado põe ouro sobre papel', () => {
    expect(paresDeContraste.some((p) => p.fundo === 'papel' && p.texto.startsWith('ouro'))).toBe(
      false,
    );
  });
  it('logo otimizado preserva o degradê da folha de ouro', () => {
    const svg = readFileSync(
      new URL('../src/components/marca/svg/todalinda-logo.svg', import.meta.url),
      'utf8',
    );
    expect(svg).toContain('offset=".35" stop-color="#e2c88c"');
  });
});
