import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import dados from '../docs/dados/avaliacoes-google.json' with { type: 'json' };
import { encontrarTermos } from '../src/config/termos.ts';
import { ehReal, type Real } from '../src/content/textos/fontes.ts';
import * as T from '../src/content/textos/index.ts';

const modulos = [
  T.geral,
  T.home,
  T.servicos,
  T.tratamentos,
  T.historia,
  T.equipe,
  T.paginas,
  T.midia,
];
const strings = modulos.flatMap((m) => T.todasAsStrings(m));
const reais: Real[] = [];
const coletar = (v: unknown): void => {
  if (ehReal(v)) reais.push(v);
  else if (Array.isArray(v)) v.forEach(coletar);
  else if (v && typeof v === 'object') Object.values(v).forEach(coletar);
};
modulos.forEach(coletar);

describe('textos do site', () => {
  it('title ≤ 60 e description ≤ 155, todas citando Lages', () => {
    for (const [rota, m] of Object.entries(T.metas)) {
      expect(m.title.length, `${rota}: ${m.title}`).toBeLessThanOrEqual(60);
      expect(m.description.length, `${rota}: ${m.description}`).toBeLessThanOrEqual(155);
      if (rota !== '/avaliar/qr') expect(`${m.title} ${m.description}`, rota).toMatch(/Lages/);
    }
  });
  it('descriptions de página pública citam "Centro"', () => {
    for (const [rota, m] of Object.entries(T.metas)) {
      if (['/avaliar/qr'].includes(rota)) continue;
      expect(m.description, rota).toMatch(/Centro/);
    }
  });
  it('toda frase real tem fonte rastreável', () => {
    expect(reais.length).toBeGreaterThan(15);
    for (const r of reais) {
      expect(r.fonte.length, r.texto).toBeGreaterThan(15);
      expect(r.fonte, r.texto).toMatch(/docs\/|media-originais|Instagram|Revista|avaliacoes/);
    }
  });
  it('nenhum termo vetado (seção 8)', () => {
    expect(strings.flatMap((s) => encontrarTermos(s))).toEqual([]);
  });
  it('voz: sem emoji, sem "diva", sem "maravilhosa", sem promessa', () => {
    const proibidas =
      /\p{Extended_Pictographic}|\bdiva\b|maravilhos|garant[oi]|resultado garantido|sem frizz|acaba com/iu;
    for (const s of strings) expect(s, s).not.toMatch(proibidas);
  });
  it('dados pendentes não aparecem (estacionamento, pagamento, duração, preço)', () => {
    for (const s of strings)
      expect(s, s).not.toMatch(
        /estacionamento|\bpix\b|cartão de crédito|parcel|R\$\s?\d|\d+\s?(min|minutos|horas)\b/i,
      );
  });
  it('alt para toda imagem publicável e descrição para todo vídeo publicável', () => {
    const manifesto = JSON.parse(
      readFileSync(new URL('../media.manifest.json', import.meta.url), 'utf8'),
    ) as {
      itens: { id: string; tipo: string; naoUsar: boolean }[];
    };
    for (const i of manifesto.itens.filter((x) => !x.naoUsar && x.tipo === 'imagem'))
      expect(T.midia.alt[i.id], i.id).toBeTruthy();
    for (const i of manifesto.itens.filter((x) => !x.naoUsar && x.tipo === 'video'))
      expect(T.midia.videos[i.id], i.id).toBeTruthy();
  });
  it('alt sem nome de cliente', () => {
    const nomes = dados.avaliacoes
      .map((a) => a.autor.split(' ')[0] ?? '')
      .filter((n) => n.length > 3 && n.toUpperCase() !== 'DIDO');
    for (const a of Object.values(T.midia.alt))
      for (const n of nomes)
        expect(a, `${n} em "${a}"`).not.toMatch(new RegExp(`(^|\\s)${n}(\\s|,|\\.|$)`));
  });
  it('todo serviço publicado tem texto; toda pessoa da equipe tem perfil', () => {
    const pasta = (p: string) =>
      readdirSync(new URL(`../src/content/${p}/`, import.meta.url)).map(
        (f) =>
          JSON.parse(
            readFileSync(new URL(`../src/content/${p}/${f}`, import.meta.url), 'utf8'),
          ) as Record<string, unknown>,
      );
    for (const s of pasta('servicos').filter((x) => x.publicado))
      expect(T.servicos[String(s.id)], String(s.id)).toBeTruthy();
    for (const m of pasta('equipe'))
      expect(T.equipe.perfis[String(m.slug)], String(m.slug)).toBeTruthy();
  });
  it('"quem faz" e duração ficam fora até a casa confirmar', () => {
    for (const s of Object.values(T.servicos)) {
      expect(s.quemFaz).toBeNull();
      expect(s.duracao).toBeNull();
    }
  });
  it('bloco Avaliar no Google sem estrela, sem nota, sem incentivo', () => {
    const t = [...T.todasAsStrings(T.geral.avaliar), ...T.todasAsStrings(T.paginas.avaliarQr)].join(
      ' ',
    );
    expect(t).not.toMatch(/estrela|★|nota|5\/5|brinde|sorteio|desconto|ganhe/i);
  });
  it('rodapé tem razão social e CNPJ', () => {
    expect(T.geral.rodape.legal).toContain('Cordova Antoniolli Serviços de Estéticas LTDA');
    expect(T.geral.rodape.legal).toContain('25.337.323/0001-04');
  });
});

describe('coleção "servicos" sincronizada com os textos', () => {
  it('processo e FAQ do JSON são os de src/content/textos/servicos.ts', () => {
    for (const [id, t] of Object.entries(T.servicos)) {
      const j = JSON.parse(
        readFileSync(new URL(`../src/content/servicos/${id}.json`, import.meta.url), 'utf8'),
      ) as {
        processo: { titulo: string; texto: string }[];
        faq: unknown;
        textoRevisado: boolean;
      };
      expect(
        j.processo.map((p) => [p.titulo, p.texto]),
        id,
      ).toEqual(t.processo.map((p) => [p.titulo, p.texto]));
      expect(j.faq, id).toEqual(t.faq);
      expect(j.textoRevisado, id).toBe(true);
    }
  });
});
