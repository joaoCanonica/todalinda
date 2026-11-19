// JSON-LD gerado da config (sessão 8). Fonte única: src/config/** e as coleções.
// Regras (CLAUDE.md §8 e investigação §8): SEM AggregateRating e SEM Review (avaliações
// autosservidas não são elegíveis e a nota não aparece no site); sem preço no OfferCatalog.
// Tipos do schema-dts (vocabulário schema.org); scripts/audit-seo.mjs confere contra o vocabulário 30.1.
import type {
  BreadcrumbList,
  FAQPage,
  HairSalon,
  ImageObject,
  OpeningHoursSpecification,
  Person,
  Service,
  VideoObject,
  WithContext,
} from 'schema-dts';
import { contato } from '../../config/contato.ts';
import { horario } from '../../config/horario.ts';
import { seo } from '../../config/seo.ts';
import { valorDe } from '../../config/tipos.ts';

type Grafo =
  | WithContext<HairSalon | Service | FAQPage | BreadcrumbList | VideoObject>
  | Record<string, unknown>;

/** Base absoluta quando o domínio existe; sem ele, URLs relativas (resolvem pela página). */
export const base = (): string => valorDe(seo.siteUrl) ?? '';
export const abs = (caminho: string): string =>
  /^https?:\/\//.test(caminho)
    ? caminho
    : `${base()}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
export const ID_SALAO = () => abs('/#salao');

const DIAS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
const e = contato.endereco.valor;
const tel = (n: string) => `+${n.replace(/\D/g, '').replace(/^(\d{2})(\d{2})(\d+)$/, '$1-$2-$3')}`;

/** NAP canônico (nome, endereço, telefone): o audit-seo compara cada página com isto. */
export const NAP = {
  nome: 'Todalinda',
  endereco: `${e.logradouro}, ${e.numero}`,
  bairro: e.bairro,
  cidade: e.cidade,
  uf: e.uf,
  cep: e.cep,
  telefone: contato.telefone.valor.exibir,
  whatsapp: '(49) 99177-2089',
} as const;

export function horarios(): OpeningHoursSpecification[] {
  const s = horario.semana.valor;
  // agrupa os dias com o mesmo turno (ter–sáb, 9h–19h)
  const grupos = new Map<string, number[]>();
  for (let d = 0; d < 7; d++) {
    const t = s[d];
    if (!t) continue;
    const k = `${t.abre}-${t.fecha}`;
    grupos.set(k, [...(grupos.get(k) ?? []), d]);
  }
  return [...grupos].map(([k, dias]) => {
    const [opens = '', closes = ''] = k.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dias.map(
        (d) =>
          `https://schema.org/${DIAS[d] ?? 'Sunday'}` as `https://schema.org/${(typeof DIAS)[number]}`,
      ),
      opens,
      closes,
    };
  });
}

export interface MembroLd {
  slug: string;
  nome: string;
  funcao: string;
  anos?: number;
  sameAs?: string;
}
export interface ServicoLd {
  id: string;
  nome: string;
  resumo: string;
  url: string;
}

const pessoa = (m: MembroLd, emprego = true): Person => ({
  '@type': 'Person',
  '@id': abs(`/equipe/${m.slug}#pessoa`),
  name: m.nome.replace(/\s*[“"][^”"]*[”"]/, ''),
  jobTitle: m.funcao,
  url: abs(`/equipe/${m.slug}`),
  ...(m.sameAs ? { sameAs: m.sameAs } : {}),
  ...(emprego ? { worksFor: { '@id': ID_SALAO() } } : {}),
});

/** O salão: HairSalon + BeautySalon + NailSalon (additionalType), com tudo que é confirmado. */
export function salao(o: {
  equipe: MembroLd[];
  fundadora: MembroLd;
  servicos: ServicoLd[];
  imagem: string;
  logo: string;
  descricao: string;
}): WithContext<HairSalon> {
  const sameAs = [
    contato.instagram.valor.url,
    contato.mapas.google.valor,
    ...(contato.facebook && valorDe(contato.facebook) ? [valorDe(contato.facebook) as string] : []),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': ID_SALAO(),
    additionalType: ['https://schema.org/BeautySalon', 'https://schema.org/NailSalon'],
    name: NAP.nome,
    alternateName: 'Ateliê de Beleza Toda Linda',
    legalName: 'Cordova Antoniolli Serviços de Estéticas LTDA',
    taxID: '25.337.323/0001-04',
    description: o.descricao,
    url: abs('/'),
    image: abs(o.imagem),
    logo: abs(o.logo),
    telephone: tel(contato.telefone.valor.tel),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'agendamento',
        telephone: tel(valorDe(contato.whatsapp) ?? ''),
        availableLanguage: 'pt-BR',
        description: 'WhatsApp da recepção',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'recepção',
        telephone: tel(contato.telefone.valor.tel),
        availableLanguage: 'pt-BR',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP.endereco,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: e.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contato.geo.valor.lat,
      longitude: contato.geo.valor.lng,
    },
    hasMap: contato.mapas.google.valor,
    areaServed: {
      '@type': 'City',
      name: 'Lages',
      containedInPlace: { '@type': 'State', name: 'Santa Catarina' },
    },
    sameAs,
    openingHoursSpecification: horarios(),
    foundingDate: '2017',
    founder: pessoa(o.fundadora, false),
    employee: o.equipe.map((m) => pessoa(m)),
    knowsAbout: [
      'colorimetria',
      'morena iluminada',
      'loiro perolado',
      'ruivo e cobre',
      'mechas com teste de mecha',
      'corte',
      'penteado',
      'maquiagem',
      'esmaltação em gel',
      'manicure e pedicure',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços da Todalinda',
      itemListElement: o.servicos.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': abs(`${s.url}#servico`),
          name: s.nome,
          url: abs(s.url),
        },
      })),
    },
  };
}

/** Uma página de serviço: o Service, ligado ao salão. Sem preço. */
export function servico(
  s: ServicoLd & { descricao: string; imagem?: string; tipo: string },
): WithContext<Service> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(`${s.url}#servico`),
    name: s.nome,
    serviceType: s.tipo,
    description: s.descricao,
    url: abs(s.url),
    ...(s.imagem ? { image: abs(s.imagem) } : {}),
    provider: { '@id': ID_SALAO() },
    areaServed: { '@type': 'City', name: 'Lages' },
  };
}

export function faq(itens: { pergunta: string; resposta: string }[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: itens.map((q) => ({
      '@type': 'Question',
      name: q.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: q.resposta },
    })),
  };
}

export function migalhas(itens: { nome: string; url: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((x, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: x.nome,
      item: abs(x.url),
    })),
  };
}

export function video(v: {
  nome: string;
  descricao: string;
  thumbnail: string;
  conteudo: string;
  duracaoS: number;
  enviadoEm: string;
  transcricao?: string;
  pessoa?: string;
}): WithContext<VideoObject> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.nome,
    description: v.descricao,
    thumbnailUrl: abs(v.thumbnail),
    contentUrl: abs(v.conteudo),
    uploadDate: v.enviadoEm,
    duration: `PT${Math.round(v.duracaoS)}S`,
    inLanguage: 'pt-BR',
    ...(v.transcricao ? { transcript: v.transcricao } : {}),
    ...(v.pessoa ? { actor: { '@type': 'Person', name: v.pessoa } } : {}),
    publisher: { '@id': ID_SALAO() },
  };
}

export function imagem(i: {
  url: string;
  legenda: string;
  largura?: number;
  altura?: number;
}): ImageObject {
  return {
    '@type': 'ImageObject',
    contentUrl: abs(i.url),
    caption: i.legenda,
    ...(i.largura
      ? { width: { '@type': 'QuantitativeValue', value: i.largura, unitCode: 'E37' } }
      : {}),
    ...(i.altura
      ? { height: { '@type': 'QuantitativeValue', value: i.altura, unitCode: 'E37' } }
      : {}),
    creditText: 'Todalinda',
    creator: { '@id': ID_SALAO() },
    copyrightNotice: 'Todalinda · Cordova Antoniolli Serviços de Estéticas LTDA',
  };
}

/** Serializa para <script type="application/ld+json"> (sem "</" quebrando o script). */
export const serializar = (g: Grafo | Grafo[]) => JSON.stringify(g).replace(/</g, '\\u003c');
