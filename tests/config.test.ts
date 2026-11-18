import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { citacoes, formatarAutor, prepararCitacoes } from '../src/config/avaliacoes.ts';
import { encontrarTermos, TERMOS_VETADOS } from '../src/config/termos.ts';
import { aviso, bloqueante, coletarPendencias, confirmado, opcional } from '../src/config/tipos.ts';
import { equipeSchema, servicoSchema, trabalhoSchema } from '../src/content/schemas.ts';
import { linkAvaliar } from '../src/lib/avaliar.ts';

const ler = (pasta: string) =>
  readdirSync(new URL(`../src/content/${pasta}/`, import.meta.url)).map(
    (f) =>
      JSON.parse(
        readFileSync(new URL(`../src/content/${pasta}/${f}`, import.meta.url), 'utf8'),
      ) as unknown,
  );

describe('tipos', () => {
  it('coleta pendências por estado', () => {
    const p = coletarPendencias({
      a: confirmado(1, 'x'),
      b: opcional(),
      c: bloqueante('falta c'),
      d: { e: aviso('#fff', 'provisório') },
      f: opcional('ok'),
    });
    expect(p).toEqual([
      { caminho: 'b', estado: 'opcional', descricao: 'não informado (o site omite)' },
      { caminho: 'c', estado: 'bloqueante', descricao: 'falta c' },
      { caminho: 'd.e', estado: 'aviso', descricao: 'provisório' },
    ]);
  });
});

describe('termos vetados', () => {
  it('lista idêntica à do CLAUDE.md (20 termos)', () => {
    expect(TERMOS_VETADOS.map((t) => t.termo)).toEqual([
      'melhor salão',
      'o melhor',
      'a melhor',
      'número 1',
      'nº 1',
      'a maior',
      'o maior',
      'promoção',
      'desconto',
      'grátis',
      'sorteio',
      'cura',
      'curar',
      'trata queda',
      'alopecia',
      'rejuvenesce',
      'sua melhor versão',
      'transforme seu visual',
      'realce sua beleza',
      'Toda Linda Lages',
    ]);
  });
  it('palavra inteira, sem diferenciar maiúsculas', () => {
    expect(encontrarTermos('Curadoria e procura não contam')).toEqual([]);
    expect(encontrarTermos('Isso CURA o fio').map((o) => o.termo)).toEqual(['cura']);
    expect(encontrarTermos('Promoção de verão').length).toBe(1);
    expect(encontrarTermos('o  melhor\ncorte').length).toBe(1);
  });
  it('ignora categorias pedidas (superlativo em avaliação literal)', () => {
    expect(encontrarTermos('foi o melhor corte', ['superlativo'])).toEqual([]);
    expect(encontrarTermos('grátis', ['superlativo']).length).toBe(1);
  });
});

describe('avaliações', () => {
  it('nunca a do Dido (id 1); exclui a da massagem (id 10)', () => {
    expect(citacoes.some((c) => c.id === 1 || c.id === 10)).toBe(false);
    expect(citacoes.length).toBe(11);
  });
  it('primeiro nome + inicial; senão "Cliente no Google"', () => {
    expect(formatarAutor('Fernanda B.')).toBe('Fernanda B.');
    expect(formatarAutor('A V.')).toBe('Cliente no Google');
    expect(formatarAutor('Mandyshow')).toBe('Cliente no Google');
    expect(citacoes.find((c) => c.id === 2)?.autor).toBe('Cliente no Google');
  });
  it('remove emoji e marca como editado; nada de nota', () => {
    const [c] = prepararCitacoes([{ id: 99, exibirComo: 'Ana B.', texto: 'Amei! 👏❤️' }], {});
    expect(c).toMatchObject({ texto: 'Amei!', editado: true, selo: 'Avaliação no Google' });
    for (const c of citacoes) expect(Object.keys(c)).not.toContain('estrelas');
  });
});

describe('avaliar', () => {
  it('sem o link oficial: ficha + aviso', () => {
    const l = linkAvaliar(bloqueante('x'));
    expect(l).toMatchObject({
      url: 'https://www.google.com/maps?cid=14959576611857227956',
      origem: 'ficha',
    });
    expect(l.aviso).toBeTruthy();
  });
  it('com o link oficial', () => {
    expect(linkAvaliar(confirmado('https://g.page/r/abc/review', 'teste'))).toEqual({
      url: 'https://g.page/r/abc/review',
      origem: 'perfil',
    });
  });
});

describe('coleções', () => {
  it('equipe: 7 registros válidos, foto null para quem só tem 150 px', () => {
    const eq = ler('equipe').map((e) => equipeSchema.parse(e));
    expect(eq).toHaveLength(7);
    for (const s of ['dido-rodrigues', 'karine', 'thaynara-colombo', 'marina-schpanski'])
      expect(eq.find((m) => m.slug === s)?.foto).toBeNull();
    expect(eq.find((m) => m.slug === 'dido-rodrigues')?.anosDeProfissao).toBe(26);
  });
  it('serviços: válidos, publicados têm mídia, limpeza de pele não publica', () => {
    const sv = ler('servicos').map((s) => servicoSchema.parse(s));
    expect(sv).toHaveLength(10);
    for (const s of sv.filter((x) => x.publicado)) expect(s.midia.length).toBeGreaterThan(0);
    expect(sv.find((s) => s.id === 'limpeza-de-pele')?.publicado).toBe(false);
    expect(sv.every((s) => s.profissionais.estado === 'bloqueante')).toBe(true);
  });
  it('schema recusa serviço publicado sem mídia', () => {
    const base = ler('servicos')[0] as Record<string, unknown>;
    expect(servicoSchema.safeParse({ ...base, midia: [], publicado: true }).success).toBe(false);
  });
  it('trabalhos válidos', () => {
    const tr = ler('trabalhos').map((t) => trabalhoSchema.parse(t));
    expect(tr.length).toBeGreaterThan(40);
    expect(tr.some((t) => t.profissional)).toBe(false);
  });
});
