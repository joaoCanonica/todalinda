// Frases reais (da Edna, da equipe, das avaliações, das revistas) sempre com fonte.
// Texto sem real() é redação da WAXLO (sessão 5), a partir das fontes do repositório.

export interface Real {
  readonly texto: string;
  readonly fonte: string;
  readonly real: true;
  /** “literal” = palavra por palavra · “ritmo” = só pontuação/corte de muleta (“né”, repetição) */
  readonly edicao: 'literal' | 'ritmo';
}

export const real = (texto: string, fonte: string, edicao: Real['edicao'] = 'ritmo'): Real => ({
  texto,
  fonte,
  real: true,
  edicao,
});

export const ehReal = (v: unknown): v is Real =>
  typeof v === 'object' && v !== null && (v as Real).real === true;

/** Texto exibível de uma frase (real ou redação). */
export const txt = (v: string | Real): string => (typeof v === 'string' ? v : v.texto);

const IG = 'Instagram @somostodalinda';
export const F = {
  ednaSonho: `Edna Antoniolli, vídeo “ver um sonho se tornar um lugar” (${IG}; media-originais/videos/snapinsta-1794936089171.mp4), transcrição em docs/dados/falas.md`,
  ednaClientes: `Edna Antoniolli, vídeo “clientes que viram história” (${IG}; media-originais/videos/SaveClip.App_AQNLG2….mp4), transcrição em docs/dados/falas.md`,
  ednaEmpreendedora: `Edna Antoniolli, vídeo sobre o dia em que se tornou empreendedora (${IG}; media-originais/videos/snapinsta-1794933027692.mp4), transcrição em docs/dados/falas.md`,
  dido: `Dido Rodrigues, vídeo sobre o loiro perolado em cabelo 100% branco (${IG}; media-originais/videos/snapinsta-1794936180983.mp4), transcrição em docs/dados/falas.md`,
  revista5anos:
    'Revista Todalinda “5 anos: do sonho à realização”, jul/2022 (Flipsnack, link no Linktree), fala da Edna; citada em docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3',
  revista1:
    'Revista Todalinda, primeira edição, dez/2021–fev/2022, 24 páginas (Flipsnack); docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3',
  revista2023:
    'Revista Todalinda “Equipe dos Sonhos”, set/2023, 20 páginas (Flipsnack); docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3',
  manifesto:
    'Edna Antoniolli, legenda de 22/08/2026 no Instagram @edna_antoniolli_; docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3',
  parada: `Parada de equipe de 13/07/2026, post no ${IG}; docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3`,
  doisReais: `Quadro “Dois Reais ou um Cabelo Todalinda”, posts e temporadas no ${IG}; docs/TODALINDA_INVESTIGACAO_CLIENTE.md §3 e §6`,
  artes:
    'Artes educativas da casa, série “Camadas do fio” (docs/dados/textos-das-artes.md), reescritas sem promessa',
  thaynara: 'Carrossel de Thaynara Colombo, nail designer (docs/dados/textos-das-artes.md)',
  joao: 'João (WAXLO), confirmação de 17/11/2026',
  google: (id: number) =>
    `Avaliação no Google #${id} (docs/dados/avaliacoes-google.json), coletada em 17/11/2026`,
  investigacao: (secao: string) => `docs/TODALINDA_INVESTIGACAO_CLIENTE.md ${secao}`,
} as const;

export interface Meta {
  title: string; // ≤ 60
  description: string; // ≤ 155
}
