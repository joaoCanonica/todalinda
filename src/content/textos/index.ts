// Todos os textos do site (sessão 5). Cada página exporta meta (title ≤ 60, description ≤ 155).
import * as equipe from './equipe.ts';
import * as geral from './geral.ts';
import * as home from './home.ts';
import * as midia from './midia.ts';
import * as historia from './nossa-historia.ts';
import * as paginas from './paginas.ts';
import { servicos } from './servicos.ts';
import * as tratamentos from './tratamentos.ts';

export { equipe, geral, historia, home, midia, paginas, servicos, tratamentos };

/** Rota → meta, para o <head> de cada página (e para o teste de limites). */
export const metas: Record<string, { title: string; description: string }> = {
  '/': home.meta,
  '/tratamentos': tratamentos.meta,
  '/nossa-historia': historia.meta,
  '/equipe': equipe.meta,
  '/dois-reais-ou-um-cabelo': paginas.doisReais.meta,
  '/revista': paginas.revista.meta,
  '/a-casa': paginas.aCasa.meta,
  '/agendar': paginas.agendar.meta,
  '/avaliar/qr': paginas.avaliarQr.meta,
  '/como-chegar': paginas.comoChegar.meta,
  '/perguntas-frequentes': paginas.faq.meta,
  '/privacidade': paginas.privacidade.meta,
  '/trabalhos': paginas.trabalhos.meta,
  '/servicos': paginas.servicosIndice.meta,
  '/404': geral.pagina404.meta,
  ...Object.fromEntries(Object.entries(servicos).map(([id, s]) => [`/servicos/${id}`, s.meta])),
  ...Object.fromEntries(
    Object.entries(equipe.perfis).map(([slug, p]) => [`/equipe/${slug}`, p.meta]),
  ),
};

/** Todas as strings de um valor (recursivo), para auditoria de termos e revisão. */
export function todasAsStrings(v: unknown, saida: string[] = []): string[] {
  if (typeof v === 'string') saida.push(v);
  else if (typeof v === 'function') return saida;
  else if (Array.isArray(v)) for (const x of v) todasAsStrings(x, saida);
  else if (v && typeof v === 'object')
    for (const [k, x] of Object.entries(v))
      if (k !== 'fonte' && k !== 'href' && k !== 'id') todasAsStrings(x, saida);
  return saida;
}
