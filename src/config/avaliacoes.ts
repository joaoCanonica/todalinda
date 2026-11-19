import dados from '../../docs/dados/avaliacoes-google.json' with { type: 'json' };
import { GOOGLE_REVIEW_URL_ENV } from './ambiente.ts';
import { contato } from './contato.ts';
import { bloqueante, confirmado } from './tipos.ts';

// Regras (CLAUDE.md, seção 8): sem nota agregada, sem AggregateRating, sem incentivo,
// só citações literais escolhidas, nunca a avaliação de alguém da casa.
export const exibirNota = false as const;

/** Link "Pedir avaliações" do Perfil da Empresa (g.page/r/…/review). Até chegar, /avaliar usa a ficha (cid). */
export const googleReviewUrl = GOOGLE_REVIEW_URL_ENV
  ? confirmado(GOOGLE_REVIEW_URL_ENV, 'variável PUBLIC_GOOGLE_REVIEW_URL')
  : bloqueante("link 'Pedir avaliações' do Perfil da Empresa");

/** Ids que nunca aparecem, com o motivo. */
export const EXCLUIDAS: Record<number, string> = {
  1: 'autor é profissional da casa (Dido Rodrigues)',
  10: 'cita massagem (serviço fora do site) e custo-benefício (preço)',
};

const NOME_INICIAL = /^\p{Lu}[\p{Ll}\p{M}]+ \p{Lu}\.$/u;
// Pictogramas e seletores de variação (emoji); a voz do site não usa emoji.
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

export interface Citacao {
  id: number;
  autor: string; // "Fernanda B." ou "Cliente no Google"
  texto: string; // literal, só sem emoji
  editado: boolean; // true quando algum emoji foi removido
  selo: 'Avaliação no Google';
  link: string; // ficha do Google
}

interface Bruta {
  id: number;
  exibirComo: string;
  texto: string;
}

export function formatarAutor(exibirComo: string): string {
  return NOME_INICIAL.test(exibirComo.trim()) ? exibirComo.trim() : 'Cliente no Google';
}

export function prepararCitacoes(
  brutas: Bruta[],
  excluir: Record<number, string> = EXCLUIDAS,
): Citacao[] {
  return brutas
    .filter((c) => !(c.id in excluir))
    .map((c) => {
      const limpo = c.texto
        .replace(EMOJI, '')
        .replace(/\s+([!.,?])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
      return {
        id: c.id,
        autor: formatarAutor(c.exibirComo),
        texto: limpo,
        editado: limpo !== c.texto.trim(),
        selo: 'Avaliação no Google' as const,
        link: contato.mapas.google.valor,
      };
    });
}

export const citacoes: Citacao[] = prepararCitacoes(dados.citacoesSugeridasParaOSite as Bruta[]);
export const fonteAvaliacoes = {
  coletadoEm: dados.fonte.coletadoEm,
  total: dados.resumo.total,
} as const;
