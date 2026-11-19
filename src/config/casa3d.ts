// Ambientes do 3D (sessão 6B): os registros ficam em src/content/ambientes (fonteLayout).
// Trava de produção: ambiente exibido no 3D com layout sem fonte (inventado) só publica com
// aprovação expressa do João (ver checar3D em src/lib/travas.ts).
export interface Ambiente3D {
  id: string;
  nome: string;
  /** Fonte do layout: planta, captura ou foto. null = sem fonte (pendente). */
  fonte: string | null;
  aprovadoPeloJoao: boolean;
}

/**
 * Maquete esquemática (sem planta): volume simples do sobrado, proporções a partir das capturas
 * da fachada, ambientes como blocos rotulados. No preview aparece sempre (com selo);
 * em produção, só com aprovação expressa do João. Sem aprovação, /a-casa mostra fotos + lista.
 */
export const maqueteEsquematica = {
  /** Aprovada pelo João em 19/11/2026: vai à produção com o selo, até chegar a planta. */
  aprovadaPeloJoao: true,
  selo: 'Representação esquemática — em breve, a casa real',
} as const;
