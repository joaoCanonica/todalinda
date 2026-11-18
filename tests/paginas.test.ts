// Páginas internas (sessão 6C): cada serviço publicado tem capa (senão não gera página),
// antes e depois só com par confirmado em produção, legenda e autor das falas.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SERVICOS, servicoSchema, trabalhoSchema } from '../src/content/schemas.ts';
import { F } from '../src/content/textos/fontes.ts';
import { servicos as textos } from '../src/content/textos/servicos.ts';
import { autorDe, midiaDoServico, NOME_TECNICA, paresDe } from '../src/lib/paginas.ts';

const ler = <T>(dir: string, schema: { parse: (x: unknown) => T }) =>
  readdirSync(new URL(`../src/content/${dir}/`, import.meta.url))
    .filter((f) => f.endsWith('.json'))
    .map((f) =>
      schema.parse(
        JSON.parse(readFileSync(new URL(`../src/content/${dir}/${f}`, import.meta.url), 'utf8')),
      ),
    );
const servicos = ler('servicos', servicoSchema);
const trabalhos = ler('trabalhos', trabalhoSchema);

describe('páginas internas', () => {
  it('todo serviço publicado tem texto, capa e galeria sem repetir a capa', () => {
    for (const s of servicos.filter((x) => x.publicado)) {
      expect(textos[s.id], s.id).toBeDefined();
      const { capa, galeria } = midiaDoServico(s, trabalhos);
      expect(capa, s.id).not.toBeNull();
      expect(galeria).not.toContain(capa);
      expect(galeria.length).toBeLessThanOrEqual(3);
    }
  });

  it('em produção, antes e depois só com par confirmado', () => {
    for (const id of SERVICOS)
      expect(paresDe(id, trabalhos, false).every((p) => p.confirmado)).toBe(true);
  });

  it('toda técnica tem nome de legenda', () => {
    for (const id of SERVICOS) expect(NOME_TECNICA[id]).toBeTruthy();
  });

  it('autor das falas vem da fonte', () => {
    expect(autorDe(F.dido)).toBe('Dido Rodrigues');
    expect(autorDe(F.ednaSonho)).toBe('Edna Antoniolli');
    expect(autorDe(F.revista5anos)).toBe('Edna Antoniolli');
    expect(autorDe(F.thaynara)).toBe('Thaynara Colombo');
  });
});
