// Monta o JSON-LD do salão a partir das coleções (equipe confirmada, serviços publicados).
import { getCollection } from 'astro:content';
import { resposta } from '../../content/textos/geral.ts';
import { salao, type MembroLd } from './jsonld.ts';

export async function salaoLd() {
  const equipe = (await getCollection('equipe'))
    .map((m) => m.data)
    .filter((m) => m.confirmado)
    .sort((a, b) => a.ordem - b.ordem);
  const ld = (m: (typeof equipe)[number]): MembroLd => ({
    slug: m.slug,
    nome: m.nome,
    funcao: m.funcao,
    ...(m.anosDeProfissao ? { anos: m.anosDeProfissao } : {}),
    ...(m.instagram ? { sameAs: `https://www.instagram.com/${m.instagram}/` } : {}),
  });
  const fundadora = equipe.find((m) => m.slug === 'edna-antoniolli');
  if (!fundadora) throw new Error('fundadora ausente na coleção equipe');
  const servicos = (await getCollection('servicos'))
    .map((s) => s.data)
    .filter((s) => s.publicado)
    .sort((a, b) => a.ordem - b.ordem)
    .map((s) => ({ id: s.id, nome: s.nome, resumo: s.resumo, url: `/servicos/${s.id}` }));
  return salao({
    equipe: equipe.filter((m) => m.slug !== fundadora.slug).map(ld),
    fundadora: { ...ld(fundadora), funcao: 'Fundadora' },
    servicos,
    imagem: '/og/capa.jpg',
    logo: '/marca/todalinda-logo-512.png',
    descricao: resposta,
  });
}
