// Auditoria de SEO e GEO do build (sessão 8). Lê dist/ e falha (saída 1) quando:
//  - o NAP diverge em qualquer página (nome, endereço, CEP 88501-000, telefones), no JSON-LD ou no llms.txt;
//  - falta lang pt-BR, título, descrição, h1 único, og:image 1200×630, ou o robots não segue seo.indexar;
//  - o JSON-LD tem AggregateRating/Review, tipo ou propriedade fora do vocabulário schema.org (v30.1, offline),
//    valor no tipo errado, ou falta campo obrigatório do Google (LocalBusiness, VideoObject, Breadcrumb, FAQ);
//  - robots.txt / sitemap.xml não batem com seo.indexar; llms.txt sem o essencial;
//  - um termo citável da lista (CLAUDE.md / prompt 8) some do site.
// Uso: node scripts/audit-seo.mjs   (roda no postbuild)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { Parser } from 'n3';
import sharp from 'sharp';
import { contato } from '../src/config/contato.ts';
import { encontrarTermos } from '../src/config/termos.ts';
import { seo } from '../src/config/seo.ts';
import { valorDe } from '../src/config/tipos.ts';

const RAIZ = new URL('..', import.meta.url).pathname;
const DIST = process.env.DIST ? join(RAIZ, process.env.DIST) : join(RAIZ, 'dist');
const erros = [];
const avisos = [];
const erro = (pagina, msg) => erros.push(`${pagina}: ${msg}`);
const aviso = (pagina, msg) => avisos.push(`${pagina}: ${msg}`);
if (!existsSync(DIST)) {
  console.error('[audit-seo] dist/ ausente: rode `pnpm build`');
  process.exit(1);
}
const site = valorDe(seo.siteUrl);

// ---------- NAP canônico ----------
const e = contato.endereco.valor;
const NAP = {
  endereco: `${e.logradouro}, ${e.numero}`,
  cep: e.cep, // 88501-000 (o Facebook mostra 88502-110, errado)
  telefones: new Set([contato.telefone.valor.exibir, '(49) 99177-2089']),
  digitos: new Set(['554930180082', '5549991772089']),
};

// ---------- vocabulário schema.org (offline) ----------
const S = 'http://schema.org/';
const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const SUB = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';
const quads = new Parser().parse(
  gunzipSync(readFileSync(join(RAIZ, 'scripts/dados/schemaorg/schemaorg-30.1.ttl.gz'))).toString(
    'utf8',
  ),
);
const classes = new Set();
const props = new Set();
const pais = new Map();
const dominios = new Map();
const faixas = new Map();
const tipoDe = new Map(); // membro de enumeração → classe
for (const q of quads) {
  const [s, p, o] = [q.subject.value, q.predicate.value, q.object.value];
  if (!s.startsWith(S)) continue;
  const n = s.slice(S.length);
  const on = o.startsWith(S) ? o.slice(S.length) : o;
  if (p === RDF_TYPE && o === 'http://www.w3.org/2000/01/rdf-schema#Class') classes.add(n);
  else if (p === RDF_TYPE && o === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property')
    props.add(n);
  else if (p === RDF_TYPE && o.startsWith(S)) {
    tipoDe.set(n, on);
    if (on === 'DataType') classes.add(n);
  } else if (p === SUB) pais.set(n, [...(pais.get(n) ?? []), on]);
  else if (p === `${S}domainIncludes`) dominios.set(n, [...(dominios.get(n) ?? []), on]);
  else if (p === `${S}rangeIncludes`) faixas.set(n, [...(faixas.get(n) ?? []), on]);
}
const ancestrais = (t, vistos = new Set()) => {
  if (vistos.has(t)) return vistos;
  vistos.add(t);
  for (const p of pais.get(t) ?? []) ancestrais(p, vistos);
  return vistos;
};
const ehSub = (t, alvo) => ancestrais(t).has(alvo);
const DATATYPES = new Set([
  'Text',
  'URL',
  'Date',
  'DateTime',
  'Time',
  'Number',
  'Integer',
  'Float',
  'Boolean',
  'PronounceableText',
  'CssSelectorType',
  'XPathType',
]);
const ehUrl = (v) => /^(https?:\/\/|\/)/.test(v);
const ehData = (v) => /^\d{4}(-\d{2}(-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?)?)?$/.test(v);

function validarNo(no, pagina, caminho) {
  if (Array.isArray(no)) return no.forEach((x, i) => validarNo(x, pagina, `${caminho}[${i}]`));
  if (!no || typeof no !== 'object') return;
  const tipos = [no['@type'] ?? []].flat();
  if (!tipos.length && !no['@id']) aviso(pagina, `${caminho}: nó sem @type`);
  for (const t of tipos) {
    if (!classes.has(t)) erro(pagina, `${caminho}: tipo "${t}" não existe no schema.org`);
    if (['AggregateRating', 'Review'].includes(t))
      erro(pagina, `${caminho}: ${t} é proibido (CLAUDE.md §8)`);
  }
  for (const [k, v] of Object.entries(no)) {
    if (k.startsWith('@')) continue;
    if (['aggregateRating', 'review', 'reviews'].includes(k))
      erro(pagina, `${caminho}.${k}: proibido (sem nota/avaliação no JSON-LD)`);
    if (!props.has(k)) {
      erro(pagina, `${caminho}.${k}: propriedade não existe no schema.org`);
      continue;
    }
    const dom = dominios.get(k) ?? [];
    if (tipos.length && !tipos.some((t) => dom.some((d) => ehSub(t, d))))
      erro(
        pagina,
        `${caminho}.${k}: não vale para ${tipos.join('/')} (domínio: ${dom.join(', ')})`,
      );
    const faixa = faixas.get(k) ?? [];
    for (const x of [v].flat()) {
      if (x && typeof x === 'object') {
        const tx = [x['@type'] ?? []].flat();
        if (tx.length && !tx.some((t) => faixa.some((f) => ehSub(t, f))))
          erro(pagina, `${caminho}.${k}: ${tx.join('/')} fora do esperado (${faixa.join(', ')})`);
        validarNo(x, pagina, `${caminho}.${k}`);
      } else if (typeof x === 'string') {
        const temTexto = faixa.some(
          (f) => DATATYPES.has(f) && !['Number', 'Integer', 'Float', 'Boolean'].includes(f),
        );
        const enumMembro =
          x.startsWith('https://schema.org/') &&
          faixa.some((f) => ehSub(tipoDe.get(x.slice(19)) ?? '', f));
        const data = faixa.some((f) => ['Date', 'DateTime'].includes(f)) && ehData(x);
        // Duration aceita o texto ISO 8601 (PT45S), como no exemplo do próprio schema.org
        const duracao =
          faixa.includes('Duration') && /^P(?:\d+[YMWD])*(?:T(?:\d+[HMS])+)?$/.test(x);
        if (!temTexto && !enumMembro && !data && !duracao && !ehUrl(x))
          erro(
            pagina,
            `${caminho}.${k}: texto "${x.slice(0, 40)}" onde se espera ${faixa.join(', ')}`,
          );
        if (faixa.every((f) => f === 'URL') && !ehUrl(x))
          erro(pagina, `${caminho}.${k}: esperava URL`);
      } else if (typeof x === 'number') {
        if (
          !faixa.some((f) =>
            ['Number', 'Integer', 'Float', 'Text', 'QuantitativeValue'].includes(f),
          )
        )
          erro(pagina, `${caminho}.${k}: número onde se espera ${faixa.join(', ')}`);
      }
    }
  }
}

// regras do Google (campos obrigatórios dos resultados ricos) — Search Central
function regrasGoogle(no, pagina, html, texto) {
  const tipos = [no['@type'] ?? []].flat();
  if (tipos.some((t) => ehSub(t, 'LocalBusiness'))) {
    for (const k of [
      'name',
      'address',
      'telephone',
      'url',
      'geo',
      'openingHoursSpecification',
      'image',
    ])
      if (!no[k])
        (['name', 'address'].includes(k) ? erro : aviso)(pagina, `LocalBusiness sem ${k}`);
    const a = no.address ?? {};
    if (a.postalCode !== NAP.cep) erro(pagina, `JSON-LD postalCode ${a.postalCode} ≠ ${NAP.cep}`);
    if (a.streetAddress !== NAP.endereco)
      erro(pagina, `JSON-LD streetAddress "${a.streetAddress}" ≠ "${NAP.endereco}"`);
    if (String(no.telephone).replace(/\D/g, '') !== '554930180082')
      erro(pagina, `JSON-LD telephone ${no.telephone} diverge`);
  }
  if (tipos.includes('VideoObject'))
    for (const k of ['name', 'thumbnailUrl', 'uploadDate'])
      if (!no[k]) erro(pagina, `VideoObject sem ${k} (obrigatório no Google)`);
  if (tipos.includes('BreadcrumbList')) {
    const l = no.itemListElement ?? [];
    if (l.length < 2) aviso(pagina, 'BreadcrumbList com menos de 2 itens');
    l.forEach((x, i) => {
      if (x.position !== i + 1 || !x.name)
        erro(pagina, `BreadcrumbList item ${i + 1} sem position/name`);
      if (!x.item && i < l.length - 1) erro(pagina, `BreadcrumbList item ${i + 1} sem item`);
    });
  }
  if (tipos.includes('FAQPage'))
    for (const q of no.mainEntity ?? []) {
      if (q['@type'] !== 'Question' || !q.name || !q.acceptedAnswer?.text)
        erro(pagina, 'FAQPage: Question incompleta');
      else if (!texto.includes(q.name))
        erro(pagina, `FAQPage: pergunta fora do conteúdo visível: "${q.name}"`);
    }
  if (tipos.includes('ImageObject') && !no.contentUrl) erro(pagina, 'ImageObject sem contentUrl');
  if (tipos.includes('Service') && !no.provider) aviso(pagina, 'Service sem provider');
}

// ---------- páginas ----------
const paginas = [];
const listar = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) listar(p);
    else if (f.endsWith('.html')) paginas.push(p);
  }
};
listar(DIST);
const textoDe = (html) =>
  html
    .replace(/<(script|style|template)[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, ' ');
let textoSite = '';
const ogConferidas = new Map();
const tiposVistos = new Set();

for (const arq of paginas) {
  const rota = `/${relative(DIST, arq)}`
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/(.)\/$/, '$1');
  const html = readFileSync(arq, 'utf8');
  const interna = rota.startsWith('/_');
  const redireciona = /http-equiv="refresh"/.test(html);
  const texto = textoDe(html);
  const meta = (n) =>
    html.match(new RegExp(`<meta (?:name|property)="${n}" content="([^"]*)"`))?.[1];
  const robots = meta('robots') ?? '';

  if (!/<html lang="pt-BR"/.test(html)) erro(rota, 'sem lang="pt-BR"');
  if (!/<title>[^<]+<\/title>/.test(html)) erro(rota, 'sem <title>');
  // robots: preview e páginas internas sempre noindex; com indexar=true, as públicas indexam
  if (interna && !/noindex/.test(robots)) erro(rota, 'página interna sem noindex');
  if (!seo.indexar && !/noindex/.test(robots)) erro(rota, `indexar=false e robots "${robots}"`);
  if (
    seo.indexar &&
    !interna &&
    !redireciona &&
    rota !== '/404' &&
    /noindex/.test(robots) &&
    !rota.startsWith('/avaliar')
  )
    erro(rota, 'indexar=true mas a página está noindex');
  // páginas de revisão, o redirecionamento e o cartão de impressão (/avaliar/qr): só o robots importa
  if (interna || redireciona || rota === '/avaliar/qr') continue;

  textoSite += ` ${texto} ${meta('description') ?? ''} ${html.match(/<title>([^<]*)/)?.[1] ?? ''}`;
  const desc = meta('description');
  if (!desc) erro(rota, 'sem meta description');
  else if (desc.length > 160) aviso(rota, `description com ${desc.length} caracteres`);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (rota !== '/avaliar/qr' && h1 !== 1) erro(rota, `${h1} <h1> (esperado 1)`);
  if (site && !/<link rel="canonical" href="https:\/\//.test(html))
    erro(rota, 'sem canonical absoluto');

  // Open Graph: a imagem existe e é 1200×630
  const og = meta('og:image');
  if (!og) erro(rota, 'sem og:image');
  else {
    const local = join(RAIZ, 'public', og.replace(/^https?:\/\/[^/]+/, ''));
    if (!ogConferidas.has(local)) {
      const m = existsSync(local) ? await sharp(local).metadata() : null;
      ogConferidas.set(local, m ? `${m.width}x${m.height}` : 'ausente');
    }
    if (ogConferidas.get(local) !== '1200x630')
      erro(rota, `og:image ${og}: ${ogConferidas.get(local)}`);
  }

  // NAP: todo CEP é 88501-000; todo telefone é um dos dois da casa; endereço com grafia única
  // o HTML inteiro (texto, atributos, JSON-LD, botão de copiar endereço), não só o texto visível
  for (const cep of html.match(/\b\d{5}-\d{3}\b/g) ?? [])
    if (cep !== NAP.cep) erro(rota, `CEP divergente: ${cep}`);
  for (const t of texto.match(/\(\d{2}\)\s?\d{4,5}-\d{4}/g) ?? [])
    if (!NAP.telefones.has(t.replace(/\)\s?/, ') '))) erro(rota, `telefone divergente: ${t}`);
  for (const t of html.match(/href="tel:([^"]+)"/g) ?? [])
    if (!NAP.digitos.has(t.replace(/\D/g, ''))) erro(rota, `tel: divergente: ${t}`);
  for (const t of html.match(/wa\.me\/(\d+)/g) ?? [])
    if (!NAP.digitos.has(t.replace(/\D/g, ''))) erro(rota, `WhatsApp divergente: ${t}`);
  if (/Lauro Muller|Lauro M[uü]ller,?\s*(?!574)\d+/i.test(texto))
    erro(rota, 'endereço com grafia/número diferente de "Rua Lauro Müller, 574"');
  if (rota !== '/avaliar/qr') {
    if (!texto.includes('Rua Lauro Müller, 574')) erro(rota, 'NAP: endereço ausente (rodapé)');
    if (!texto.includes(NAP.cep)) erro(rota, 'NAP: CEP ausente (rodapé)');
    if (!texto.includes('(49) 3018-0082')) erro(rota, 'NAP: telefone fixo ausente (rodapé)');
  }

  // JSON-LD
  for (const bloco of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ??
    []) {
    let dados;
    try {
      dados = JSON.parse(bloco.replace(/^<script[^>]*>|<\/script>$/g, ''));
    } catch (x) {
      erro(rota, `JSON-LD inválido: ${x.message}`);
      continue;
    }
    for (const no of [dados].flat()) {
      if (no['@context'] !== 'https://schema.org')
        erro(rota, 'JSON-LD sem @context https://schema.org');
      for (const t of [no['@type']].flat()) tiposVistos.add(t);
      validarNo(no, rota, no['@type']);
      regrasGoogle(no, rota, html, texto);
    }
  }
}

// cobertura: o que o prompt pede no JSON-LD do site
for (const t of [
  'HairSalon',
  'Service',
  'FAQPage',
  'BreadcrumbList',
  'VideoObject',
  'ImageGallery',
])
  if (!tiposVistos.has(t)) erro('site', `nenhum JSON-LD do tipo ${t}`);

// termos citáveis (GEO): cada um aparece pelo menos uma vez no conteúdo/metas
const baixo = textoSite.toLowerCase();
for (const termo of [
  'salão de beleza em Lages',
  'salão no Centro de Lages',
  'morena iluminada em Lages',
  'mechas em Lages',
  'loiro perolado',
  'ruivo cobre',
  'colorista em Lages',
  'esmalteria em Lages',
  'unha em gel em Lages',
  'penteado e maquiagem em Lages',
])
  if (!baixo.includes(termo.toLowerCase())) erro('site', `termo citável ausente: "${termo}"`);

// robots.txt, sitemap.xml, llms.txt
const robotsTxt = existsSync(join(DIST, 'robots.txt'))
  ? readFileSync(join(DIST, 'robots.txt'), 'utf8')
  : '';
const sitemap = existsSync(join(DIST, 'sitemap.xml'))
  ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  : '';
if (!robotsTxt) erro('robots.txt', 'ausente');
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt))
  erro('robots.txt', 'bloqueia o site inteiro (o Google não veria o noindex)');
const locs = sitemap.match(/<loc>[^<]+<\/loc>/g) ?? [];
if (seo.indexar) {
  if (!site) erro('sitemap', 'indexar=true sem PUBLIC_SITE_URL');
  if (!/Sitemap: https:\/\//.test(robotsTxt)) erro('robots.txt', 'indexar=true e sem Sitemap');
  if (locs.length < 10) erro('sitemap.xml', `só ${locs.length} URLs`);
  if (locs.some((l) => /\/_|\/avaliar|\/404/.test(l)))
    erro('sitemap.xml', 'URL interna/redirecionamento no sitemap');
} else {
  if (/^Sitemap:/m.test(robotsTxt)) erro('robots.txt', 'indexar=false mas anuncia o sitemap');
  if (locs.length) erro('sitemap.xml', 'indexar=false mas o sitemap lista URLs');
}
const llms = existsSync(join(DIST, 'llms.txt')) ? readFileSync(join(DIST, 'llms.txt'), 'utf8') : '';
if (!llms.startsWith('# Todalinda')) erro('llms.txt', 'ausente ou sem o título');
for (const k of [
  'Rua Lauro Müller, 574',
  NAP.cep,
  '(49) 3018-0082',
  '(49) 99177-2089',
  'terça a sábado, das 9h às 19h',
  '2017',
  '/avaliar',
  '/agendar',
  'Edna Antoniolli',
])
  if (!llms.includes(k)) erro('llms.txt', `sem "${k}"`);
// termos vetados (CLAUDE.md §8) valem também para o llms.txt e o robots.txt
for (const [nome, txt] of [
  ['llms.txt', llms],
  ['robots.txt', robotsTxt],
])
  for (const o of encontrarTermos(txt)) erro(nome, `termo vetado "${o.termo}": …${o.trecho}…`);
for (const cep of llms.match(/\b\d{5}-\d{3}\b/g) ?? [])
  if (cep !== NAP.cep) erro('llms.txt', `CEP divergente ${cep}`);
if (!site)
  aviso(
    'site',
    'sem PUBLIC_SITE_URL: sem canonical/og:url absolutos e sem sitemap (ok no preview)',
  );

// relatório
console.log(
  `[audit-seo] ${paginas.length} páginas · vocabulário schema.org 30.1 (${classes.size} tipos, ${props.size} propriedades) · indexar=${seo.indexar}`,
);
for (const a of [...new Set(avisos)]) console.log(`  AVISO ${a}`);
for (const x of [...new Set(erros)]) console.log(`  ERRO  ${x}`);
console.log(
  erros.length
    ? `  ✗ ${new Set(erros).size} erro(s)`
    : '  ✓ SEO/GEO ok: NAP idêntico, JSON-LD válido, robots e sitemap coerentes',
);
process.exit(erros.length ? 1 : 0);
