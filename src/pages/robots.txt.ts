// robots.txt. Enquanto seo.indexar = false, as páginas levam "noindex" e o rastreio fica liberado
// (bloquear aqui impediria o Google de ver o noindex). Com indexar = true, entra o sitemap.
import type { APIRoute } from 'astro';
import { seo } from '../config/seo.ts';
import { valorDe } from '../config/tipos.ts';

export const GET: APIRoute = () => {
  const site = valorDe(seo.siteUrl);
  const linhas = [
    '# Todalinda · salão de beleza no Centro de Lages/SC',
    'User-agent: *',
    'Allow: /',
    // páginas de revisão interna e a rota curta de avaliação não são conteúdo
    'Disallow: /_',
    'Disallow: /avaliar',
  ];
  if (seo.indexar && site) linhas.push('', `Sitemap: ${site}/sitemap.xml`);
  else linhas.push('', '# indexação desligada (preview): sem sitemap; as páginas levam noindex');
  return new Response(`${linhas.join('\n')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
