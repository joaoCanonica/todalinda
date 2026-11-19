import { INDEXAR_ENV, SITE_URL_ENV } from './ambiente.ts';
import { confirmado } from './tipos.ts';

export const seo = {
  /** Domínio definitivo: todalinda.com.br (João, 19/11/2026; ainda não registrado/apontado).
   *  PUBLIC_SITE_URL sobrescreve (ex.: testar num endereço provisório da Vercel). */
  siteUrl: confirmado(
    (SITE_URL_ENV ?? 'https://todalinda.com.br').replace(/\/$/, ''),
    SITE_URL_ENV ? 'variável de ambiente PUBLIC_SITE_URL' : 'João (WAXLO), 19/11/2026',
  ),
  /** Indexação: só com PUBLIC_INDEXAR=sim (no ambiente de produção da Vercel, quando o domínio estiver no ar). */
  indexar: INDEXAR_ENV,
  idioma: 'pt-BR',
  titulo: 'Todalinda',
  sufixoTitulo: ' · Todalinda · Lages/SC',
} as const;

export const robotsMeta = (): string => (seo.indexar ? 'index, follow' : 'noindex, nofollow');
