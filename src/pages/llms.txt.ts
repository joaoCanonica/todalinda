// /llms.txt (proposta llmstxt.org): um resumo em Markdown, gerado da config e das coleções no build,
// para IAs lerem e citarem a Todalinda com os dados certos. Sem preço, sem superlativo, sem nota.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { rotasPublicas } from '../components/seo/rotas.ts';
import { NAP } from '../components/seo/jsonld.ts';
import { contato } from '../config/contato.ts';
import { seo } from '../config/seo.ts';
import { valorDe } from '../config/tipos.ts';
import { perfis } from '../content/textos/equipe.ts';
import { resposta } from '../content/textos/geral.ts';
import { servicos as textos } from '../content/textos/servicos.ts';

export const GET: APIRoute = async () => {
  const site = valorDe(seo.siteUrl) ?? '';
  const url = (c: string) => `${site}${c}`;
  const equipe = (await getCollection('equipe'))
    .map((m) => m.data)
    .filter((m) => m.confirmado)
    .sort((a, b) => a.ordem - b.ordem);
  const servicos = (await getCollection('servicos'))
    .map((s) => s.data)
    .filter((s) => s.publicado)
    .sort((a, b) => a.ordem - b.ordem);
  const rotas = await rotasPublicas();
  const nomeRota = (c: string) => rotas.find((r) => r.caminho === c)?.nome ?? c;

  const md = `# Todalinda

> ${resposta}

- Nome: Todalinda (Ateliê de Beleza Toda Linda); razão social Cordova Antoniolli Serviços de Estéticas LTDA, CNPJ 25.337.323/0001-04.
- Endereço: ${NAP.endereco}, ${NAP.bairro}, ${NAP.cidade}/${NAP.uf}, CEP ${NAP.cep}, Brasil. Um sobrado claro com gramado na frente; placa "somos TODALINDA".
- Coordenadas: ${contato.geo.valor.lat}, ${contato.geo.valor.lng} (Plus Code ${contato.plusCode.valor}).
- Horário: terça a sábado, das 9h às 19h. Domingo e segunda, fechado. Em feriados, confirmar pelo WhatsApp.
- Desde: 2017, fundada por Edna Antoniolli. Em 2027 completa 10 anos.
- WhatsApp (agendamento): ${NAP.whatsapp} · Telefone fixo: ${NAP.telefone} · Instagram: @${contato.instagram.valor.usuario}
- Especialidades: coloração (morena iluminada, loiros perolados e manteiga, ruivo e cobre, castanho e mocha), mechas com teste de mecha antes, corte, penteado e maquiagem, esmalteria (esmaltação em gel com blindagem, manicure e pedicure).
- Como a casa trabalha: avaliação individual do fio antes de qualquer química; teste de mecha em toda coloração e clareamento.
- Valores: o site não publica preços. O valor depende do comprimento e do histórico do fio e é passado na avaliação.

## Como agendar

- [Agendar](${url('/agendar')}): escolha o serviço, a profissional (ou "sem preferência"), o dia e o período; a mensagem abre pronta no WhatsApp da recepção, que confirma o horário.
- Também pelo telefone ${NAP.telefone}.

## Serviços

${servicos.map((s) => `- [${s.nome}](${url(`/servicos/${s.id}`)}): ${textos[s.id]?.resposta ?? s.resumo}`).join('\n')}
- [Tratamentos: o fio explicado](${url('/tratamentos')}): hidratação, nutrição, reconstrução e cauterização, camada por camada. Técnica de salão, não tratamento de saúde.

## Equipe

${equipe.map((m) => `- [${m.nome.replace(/"/g, '')}](${url(`/equipe/${m.slug}`)}): ${perfis[m.slug]?.linha ?? m.funcao}`).join('\n')}

## Avaliar no Google

- [Avaliar a Todalinda no Google](${url('/avaliar')}): leva à página da casa no Google. A casa pede avaliação a todas as clientes, sem nenhuma recompensa em troca.
- [Ficha no Google Maps](${contato.mapas.google.valor})

## Páginas

${rotas
  .filter((r) => !r.caminho.startsWith('/servicos/') && !r.caminho.startsWith('/equipe/'))
  .map((r) => `- [${nomeRota(r.caminho)}](${url(r.caminho)})`)
  .join('\n')}

## Optional

- [Perguntas frequentes](${url('/perguntas-frequentes')}): preço, teste de mecha, química recente, manutenção, horário e endereço.
- [Dois Reais ou um Cabelo](${url('/dois-reais-ou-um-cabelo')}): o quadro de transformações da casa no Instagram.
`;
  return new Response(md, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
};
