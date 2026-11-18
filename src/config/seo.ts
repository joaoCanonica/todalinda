import { SITE_URL_ENV } from './ambiente.ts';
import { bloqueante, confirmado } from './tipos.ts';

export const seo = {
  /** Domínio definitivo: PUBLIC_SITE_URL (ou SITE_URL). Pendente até o João definir. */
  siteUrl: SITE_URL_ENV
    ? confirmado(SITE_URL_ENV.replace(/\/$/, ''), 'variável de ambiente')
    : bloqueante('domínio definitivo do site (PUBLIC_SITE_URL)'),
  /** Indexação desligada até a sessão 8/9 (SEO e conferência final). */
  indexar: false,
  idioma: 'pt-BR',
  titulo: 'Todalinda',
  sufixoTitulo: ' · Todalinda · Lages/SC',
} as const;

export const robotsMeta = (): string => (seo.indexar ? 'index, follow' : 'noindex, nofollow');
