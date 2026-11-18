// sitemap.xml: só com o domínio definitivo e com seo.indexar = true (URLs absolutas e indexáveis).
// Antes disso, um urlset vazio (e o robots.txt não o anuncia).
import type { APIRoute } from 'astro';
import { rotasPublicas } from '../components/seo/rotas.ts';
import { seo } from '../config/seo.ts';
import { valorDe } from '../config/tipos.ts';

export const GET: APIRoute = async () => {
  const site = valorDe(seo.siteUrl);
  const urls =
    seo.indexar && site
      ? (await rotasPublicas()).map(
          (r) =>
            `  <url><loc>${site}${r.caminho === '/' ? '/' : r.caminho}</loc><priority>${r.prioridade.toFixed(1)}</priority></url>`,
        )
      : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}${urls.length ? '\n' : ''}</urlset>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
