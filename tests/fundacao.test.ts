import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ler = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

describe('fundação', () => {
  it('CLAUDE.md, AGENTS.md e docs/CONTEXTO.md são idênticos', () => {
    const claude = ler('CLAUDE.md');
    expect(claude.startsWith('CONTEXTO DO PROJETO — Todalinda')).toBe(true);
    expect(ler('AGENTS.md')).toBe(claude);
    expect(ler('docs/CONTEXTO.md')).toBe(claude);
  });

  it('página temporária tem h1 e noindex', () => {
    const pagina = ler('src/pages/index.astro');
    expect(pagina).toContain('<h1>Todalinda</h1>');
    expect(pagina).toContain('robotsMeta()');
  });

  it('three e astro estão com versão fixada', () => {
    const pkg = JSON.parse(ler('package.json')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies['three']).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.dependencies['astro']).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
