// As rotas públicas (indexáveis quando seo.indexar = true): base do sitemap e do llms.txt.
import { getCollection } from 'astro:content';

export interface Rota {
  caminho: string;
  nome: string;
  prioridade: number;
}

export async function rotasPublicas(): Promise<Rota[]> {
  const servicos = (await getCollection('servicos'))
    .map((s) => s.data)
    .filter((s) => s.publicado && s.midia.length > 0)
    .sort((a, b) => a.ordem - b.ordem);
  const equipe = (await getCollection('equipe'))
    .map((m) => m.data)
    .sort((a, b) => a.ordem - b.ordem);
  return [
    { caminho: '/', nome: 'Capa', prioridade: 1 },
    { caminho: '/agendar', nome: 'Agendar', prioridade: 0.9 },
    ...servicos.map((s) => ({ caminho: `/servicos/${s.id}`, nome: s.nome, prioridade: 0.9 })),
    { caminho: '/trabalhos', nome: 'Trabalhos', prioridade: 0.8 },
    { caminho: '/como-chegar', nome: 'Como chegar', prioridade: 0.8 },
    { caminho: '/equipe', nome: 'Equipe', prioridade: 0.7 },
    ...equipe.map((m) => ({ caminho: `/equipe/${m.slug}`, nome: m.nome, prioridade: 0.6 })),
    { caminho: '/tratamentos', nome: 'Tratamentos: o fio explicado', prioridade: 0.6 },
    { caminho: '/perguntas-frequentes', nome: 'Perguntas frequentes', prioridade: 0.7 },
    { caminho: '/a-casa', nome: 'A casa', prioridade: 0.6 },
    { caminho: '/nossa-historia', nome: 'Nossa história', prioridade: 0.6 },
    { caminho: '/dois-reais-ou-um-cabelo', nome: 'Dois Reais ou um Cabelo', prioridade: 0.5 },
    { caminho: '/revista', nome: 'A revista', prioridade: 0.4 },
    { caminho: '/privacidade', nome: 'Privacidade', prioridade: 0.2 },
  ];
}
