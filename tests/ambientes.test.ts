// Coleção "ambientes" (tour 3D): schema, ids, layout sem fonte inventada, mídia real e liberada.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ambienteSchema } from '../src/content/schemas.ts';

const dir = new URL('../src/content/ambientes/', import.meta.url);
const ambientes = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ f, a: ambienteSchema.parse(JSON.parse(readFileSync(new URL(f, dir), 'utf8'))) }));
const manifesto: { id: string; naoUsar: boolean; crianca: string }[] = JSON.parse(
  readFileSync(new URL('../media.manifest.json', import.meta.url), 'utf8'),
).itens;

describe('ambientes do tour 3D', () => {
  it('os 8 ambientes da casa, com id = nome do arquivo e ordem única', () => {
    expect(ambientes.map(({ a }) => a.id).sort()).toEqual(
      [
        'esmalteria',
        'estetica',
        'fachada-e-gramado',
        'lavatorios',
        'lounge-mezanino',
        'parede-todalinda',
        'recepcao',
        'salao-de-cabelo',
      ].sort(),
    );
    for (const { f, a } of ambientes) expect(f).toBe(`${a.id}.json`);
    expect(new Set(ambientes.map(({ a }) => a.ordem)).size).toBe(ambientes.length);
  });

  it('nenhum layout interno tem fonte enquanto não chega a planta (só a fachada, por foto)', () => {
    for (const { a } of ambientes)
      expect(a.fonteLayout).toBe(a.id === 'fachada-e-gramado' ? 'foto' : 'pendente');
  });

  it('mídia existe no manifesto, não é naoUsar nem criança', () => {
    for (const { a } of ambientes)
      for (const id of a.midia) {
        const item = manifesto.find((i) => i.id === id);
        expect(item, `${a.id}: ${id}`).toBeDefined();
        expect(item?.naoUsar).toBe(false);
        expect(item?.crianca).not.toBe('sim');
      }
  });

  it('câmera não fica dentro do alvo', () => {
    for (const { a } of ambientes) expect(a.camera.posicao).not.toEqual(a.camera.alvo);
  });
});
