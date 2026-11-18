// Ambientes do 3D (sessão 6B). Trava de produção: ambiente com layout sem fonte
// (inventado) só publica com aprovação expressa do João.
export interface Ambiente3D {
  id: string;
  nome: string;
  /** Fonte do layout: planta, medidas, captura de referência (id de mídia)… null = inventado. */
  fonte: string | null;
  aprovadoPeloJoao: boolean;
}

export const ambientes3d: Ambiente3D[] = [];
