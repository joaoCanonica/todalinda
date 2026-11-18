// Fonte única de dados do site. Tudo que não está confirmado aparece em pendencias().
import { MODO } from './ambiente.ts';
import { exibirNota, googleReviewUrl } from './avaliacoes.ts';
import { maqueteEsquematica } from './casa3d.ts';
import { contato } from './contato.ts';
import { horario } from './horario.ts';
import { marca } from './marca.ts';
import { seo } from './seo.ts';
import { coletarPendencias, type Pendencia } from './tipos.ts';

export const config = {
  marca,
  contato,
  horario,
  seo,
  avaliacoes: { exibirNota, googleReviewUrl },
  maqueteEsquematica,
} as const;
export { MODO };

export const pendencias = (): Pendencia[] =>
  coletarPendencias({ marca, contato, horario, seo, avaliacoes: { googleReviewUrl } });
