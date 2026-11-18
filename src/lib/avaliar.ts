import { googleReviewUrl } from '../config/avaliacoes.ts';
import { contato } from '../config/contato.ts';
import { valorDe, type Campo } from '../config/tipos.ts';

export interface LinkAvaliar {
  url: string;
  origem: 'perfil' | 'ficha';
  aviso?: string;
}

/** Link para avaliar no Google. Sem o link oficial "Pedir avaliações", cai na ficha (cid) e avisa. */
export function linkAvaliar(config: Campo<string> = googleReviewUrl): LinkAvaliar {
  const oficial = valorDe(config);
  if (oficial && /^https:\/\//.test(oficial)) return { url: oficial, origem: 'perfil' };
  return {
    url: contato.mapas.google.valor,
    origem: 'ficha',
    aviso: "usando a ficha do Google (cid): falta o link 'Pedir avaliações' do Perfil da Empresa",
  };
}
