import { existsSync, readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

const raiz = new URL('../', import.meta.url);
const ler = (p: string) => readFileSync(new URL(p, raiz), 'utf8');

interface Item {
  id: string;
  arquivo: string;
  natureza: string;
  naoUsar: boolean;
  largura: number | null;
  resolucaoMax: number | null;
  consentimento: string;
  crianca: string;
  rotacao: number;
  parAntesDepois: { com: string[] } | null;
  trechos: { nome: string; in: number; out: number; hero: boolean }[];
  duracao?: number;
}
const manifesto = JSON.parse(ler('media.manifest.json')) as { itens: Item[] };
const porId = new Map(manifesto.itens.map((i) => [i.id, i]));

describe('manifesto de mídia', () => {
  it('é válido pelo JSON Schema', () => {
    const ajv = new Ajv2020({ allErrors: true });
    const validar = ajv.compile(JSON.parse(ler('media.manifest.schema.json')));
    const ok = validar(manifesto);
    expect(validar.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });

  it('ids únicos e todo arquivo existe', () => {
    expect(porId.size).toBe(manifesto.itens.length);
    for (const i of manifesto.itens)
      expect(existsSync(new URL(i.arquivo, raiz)), i.arquivo).toBe(true);
  });

  it('cobre todos os originais de media-originais/', () => {
    const arquivos = new Set(manifesto.itens.map((i) => i.arquivo));
    expect(arquivos.size).toBe(115);
  });

  it('naoUsar obrigatórios estão marcados', () => {
    const naoUsar = [
      'f-883558643-dup',
      'v-dup-933531180',
      'v-dup-936180983',
      'eq-dido-150',
      'eq-marina-150',
      'eq-thaynara-150',
      'capa-cabelos',
      'capa-coloracao',
      'capa-esmalteria',
      'capa-localizacao',
      'capa-make',
      'capa-mechas',
      'capa-penteados',
      'capa-unha',
      'logo-jpeg',
      'f-839179616',
      'f-844977298',
      'f-845100676',
      'f-845432365',
      'f-846156826',
      'f-846612203',
      'f-847386926',
      'f-847939100',
      'f-849575432',
      'f-890716602',
      'f-890716713',
      'f-890716867',
      'f-890853837',
      'f-850583628',
      'f-850806782',
      'f-850999160',
      'f-852414910',
      'cap-13-12-39',
    ];
    for (const id of naoUsar) expect(porId.get(id)?.naoUsar, id).toBe(true);
  });

  it('consentimento autorizado em tudo que é publicável (exceto vetores)', () => {
    for (const i of manifesto.itens.filter((x) => !x.naoUsar && x.natureza !== 'logo'))
      expect(i.consentimento, i.id).toBe('autorizado');
  });

  it('capturas de tela no máximo 480 px; retratos de 150 px fora', () => {
    for (const i of manifesto.itens.filter((x) => x.natureza === 'captura-de-tela'))
      expect(i.resolucaoMax).toBeLessThanOrEqual(480);
    for (const i of manifesto.itens.filter((x) => x.largura === 150))
      expect(i.naoUsar, i.id).toBe(true);
  });

  it('rotações 90° e pares antes/depois apontam para ids reais', () => {
    expect(porId.get('f-900637927')?.rotacao).toBe(90);
    expect(porId.get('f-902591720')?.rotacao).toBe(90);
    for (const i of manifesto.itens)
      for (const c of i.parAntesDepois?.com ?? [])
        expect(porId.has(c), `${i.id} → ${c}`).toBe(true);
  });

  it('trechos dentro da duração do vídeo; loops do hero existem', () => {
    for (const i of manifesto.itens.filter((x) => x.duracao)) {
      for (const t of i.trechos) {
        expect(t.in, `${i.id}/${t.nome}`).toBeLessThan(t.out);
        expect(t.out, `${i.id}/${t.nome}`).toBeLessThanOrEqual((i.duracao ?? 0) + 0.01);
      }
    }
    const hero = porId
      .get('v-filme')
      ?.trechos.filter((t) => t.hero)
      .map((t) => t.nome);
    expect(hero).toEqual(['ondas', 'iluminada']);
  });

  it('transcrições não citam nome de cliente', () => {
    const t = ler('docs/dados/transcricoes/v-dido-loiro.json');
    expect(t).not.toMatch(/andr[eé]a/i);
  });
});

describe('derivados (public/media)', () => {
  const indice = new URL('public/media/midia.json', raiz);
  it.skipIf(!existsSync(indice))('nada naoUsar é publicado', async () => {
    const { readdirSync } = await import('node:fs');
    const proibidos = manifesto.itens.filter((i) => i.naoUsar).map((i) => i.id);
    const publicados = JSON.parse(readFileSync(indice, 'utf8')) as {
      itens: Record<string, unknown>;
    };
    for (const id of proibidos) expect(Object.keys(publicados.itens)).not.toContain(id);
    const arquivos = readdirSync(new URL('public/media/', raiz), { recursive: true }).map(String);
    for (const id of proibidos)
      expect(
        arquivos.filter((a) => a.includes(`${id}-`) || a.includes(`${id}--`)),
        id,
      ).toEqual([]);
  });
});
