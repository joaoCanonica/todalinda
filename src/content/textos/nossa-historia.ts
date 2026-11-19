// /nossa-historia: linha do tempo 2017 → 2027, com as falas da Edna (revistas e vídeos).
import { F, real, type Meta } from './fontes.ts';
import { valores } from './geral.ts';

export const meta: Meta = {
  title: 'Nossa história: desde 2017 no Centro de Lages · Todalinda',
  description:
    'De 2017 aos 10 anos em 2027: a história da Todalinda, salão em Lages, no Centro, contada pela fundadora Edna Antoniolli e pela equipe.',
};

export const pagina = {
  rotulo: 'Nossa história',
  titulo: { antes: 'Do sonho à ', destaque: 'realização', depois: '' },
  resposta:
    'A Todalinda abriu em 2017, no Centro de Lages/SC, pelas mãos de Edna Antoniolli. Hoje é uma casa de cor, corte, penteado, make e esmalteria, com sete profissionais, e em 2027 completa 10 anos.',
  abertura: [
    real(
      'Eu era uma empreendedora que não conseguia falar que era empreendedora. Dava um nó na garganta, eu não conseguia assumir isso, ou me sentir merecedora disso.',
      F.ednaEmpreendedora,
    ),
    real(
      'Foi nesse dia que eu entendi que isso dependia de mim. Hoje eu sei das minhas responsabilidades. É aprender todo dia.',
      F.ednaEmpreendedora,
    ),
  ],
};

export interface Marco {
  ano: string;
  titulo: string;
  texto: string;
  fala?: ReturnType<typeof real>;
  fonte: string;
}

export const linhaDoTempo: Marco[] = [
  {
    ano: '2017',
    titulo: 'A abertura',
    texto:
      'Edna abre a Todalinda no Centro de Lages. A ideia de abrir as portas com fila de clientes não se confirma de cara: vêm a gestão de equipe, a busca por clientes, a administração do espaço.',
    fala: real(
      'Não foi bem assim. As dores já começaram na primeira semana.',
      F.revista5anos,
      'literal',
    ),
    fonte: F.revista5anos,
  },
  {
    ano: '2020',
    titulo: 'Isabela chega',
    texto:
      'Em março de 2020, a colorista Isabela Cristina entra para a equipe. A cor ganha ainda mais espaço na casa.',
    fonte: F.revista2023,
  },
  {
    ano: '2021',
    titulo: 'A primeira revista',
    texto:
      'Sai a primeira edição da revista Todalinda, com 24 páginas: a equipe, as clientes e um ensaio de Dia da Noiva na estrutura completa da casa, para noiva, mãe, madrinhas e convidadas.',
    fonte: F.revista1,
  },
  {
    ano: '2022',
    titulo: '5 anos: do sonho à realização',
    texto: 'A casa completa cinco anos com festa, depoimentos e uma edição especial da revista.',
    fala: real(
      'Hoje sim temos fila de espera. Hoje somos fortes porque temos pessoas.',
      F.revista5anos,
      'literal',
    ),
    fonte: F.revista5anos,
  },
  {
    ano: '2023',
    titulo: 'Equipe dos Sonhos',
    texto:
      'A equipe passa por treinamento com Romeu Felipe, ex-técnico e embaixador Wella, e por um treinamento de atendimento na ACIL. No gramado da casa, o primeiro Sunset Todalinda, com música ao vivo. A revista do ano conta tudo.',
    fonte: F.revista2023,
  },
  {
    ano: '2026',
    titulo: 'Dois Reais ou um Cabelo',
    texto:
      'Estreia no Instagram o quadro de transformações Dois Reais ou um Cabelo Todalinda. A primeira temporada termina em fevereiro; a segunda começa em março. Em julho, numa parada de equipe, a casa escreve a frase que guia o ano.',
    fala: valores.excelencia,
    fonte: F.doisReais,
  },
  {
    ano: '2027',
    titulo: '10 anos',
    texto:
      'A Todalinda completa dez anos no Centro de Lages. Esta edição é o começo da comemoração.',
    fonte: F.joao,
  },
];

export const cursos = 'A casa já formou profissionais em cursos próprios.';

export const valoresDaCasa = {
  titulo: 'O que guia a casa',
  itens: [valores.excelencia, valores.merecimento, valores.pessoas],
  manifesto: valores.manifesto,
};

export const cta = { titulo: 'A próxima página tem você.', botao: 'Agendar horário' };
