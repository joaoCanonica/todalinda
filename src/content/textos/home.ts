// Home, na ordem do Prompt 6A. Frases reais com fonte (real()); o resto é redação.
import { F, real, type Meta } from './fontes.ts';
import { resposta, valores } from './geral.ts';

export const meta: Meta = {
  title: 'Todalinda · salão de beleza em Lages, no Centro, desde 2017',
  description:
    'Salão em Lages, no Centro: morena iluminada, loiros, ruivos, mechas com teste de mecha, corte, penteado, make e esmalteria. Agende pelo WhatsApp.',
};

export const capa = {
  numero: 'Nº 10',
  faixa: ['Nº 10', 'desde 2017', 'Rua Lauro Müller, 574', 'Lages/SC'],
  manchete: { antes: 'Cor, corte e cuidado com quem entende de ', destaque: 'fio', depois: '.' },
  chamadas: [
    { texto: 'Morena iluminada, loiros e ruivos: técnica + cor', href: '/trabalhos' },
    { texto: 'Dois Reais ou um Cabelo: o quadro da casa', href: '/dois-reais-ou-um-cabelo' },
    { texto: 'Por dentro da casa, em 3D', href: '/a-casa' },
  ],
  resposta,
};

export const editorial = {
  folio: 'Editorial',
  rotulo: 'Editorial · Edna Antoniolli, fundadora',
  titulo: { antes: 'Ver um sonho se tornar um ', destaque: 'lugar', depois: '.' },
  // a abertura da matéria (com capitular) é a fala da Edna, editada só no ritmo
  paragrafos: [
    real(
      'Tem dias que eu vejo o salão cheio e penso como tudo começou. Hoje foi um dia desses. Porque chega uma hora que o negócio ganha vida própria.',
      F.ednaSonho,
    ),
    real(
      'Tem cliente chegando, tem gente conversando, tem gente rindo, café sendo servido, escova sendo feita. E momentos que vão ficar para sempre na memória de algumas pessoas, e a gente faz parte desses momentos.',
      F.ednaSonho,
    ),
    real(
      'O que um dia foi uma ideia e um sonho hoje faz parte da rotina de muitas pessoas. Talvez uma das partes mais bonitas de empreender seja essa:',
      F.ednaSonho,
    ),
  ],
  citacao: real('Ver um sonho se tornar um lugar.', F.ednaSonho, 'literal'),
  assinatura: 'Edna Antoniolli, fundadora da Todalinda',
  botaoVideo: 'Ouvir a Edna',
  descricaoVideo:
    'Edna, sentada no escritório da casa, fala sobre ver o salão cheio. 41 segundos, com som e legenda.',
};

/** O sumário: os serviços como índice de revista. As páginas são as do fólio da home. */
export const sumario = {
  folio: 'Sumário',
  titulo: { antes: 'Nesta ', destaque: 'edição', depois: '' },
  intro: 'Cada serviço da casa, como uma matéria. Toque para ler.',
  itens: [
    {
      id: 'morena-iluminada',
      pagina: '04',
      nome: 'Morena iluminada',
      linha: 'Luz mel e caramelo desenhada sobre a base morena.',
    },
    {
      id: 'loiros',
      pagina: '06',
      nome: 'Loiros',
      linha: 'Perolado, bege e manteiga, do clareamento gradual ao tom.',
    },
    {
      id: 'ruivo-e-cobre',
      pagina: '08',
      nome: 'Ruivo e cobre',
      linha: 'Do cobre suave ao ruivo intenso.',
    },
    {
      id: 'castanho-e-mocha',
      pagina: '10',
      nome: 'Castanho e mocha',
      linha: 'Profundidade e brilho no castanho.',
    },
    { id: 'mechas', pagina: '12', nome: 'Mechas', linha: 'Sempre com teste de mecha antes.' },
    {
      id: 'corte',
      pagina: '14',
      nome: 'A Arte do Corte',
      linha: 'Camadas, comprimento e forma para o seu rosto e a sua rotina.',
    },
    {
      id: 'penteado-e-make',
      pagina: '16',
      nome: 'Penteado e make',
      linha: 'Para o dia em que tudo precisa estar no lugar.',
    },
    {
      id: 'esmalteria',
      pagina: '18',
      nome: 'Esmalteria',
      linha: 'Manicure, pedicure e esmaltação em gel com blindagem.',
    },
    {
      id: 'tratamentos',
      pagina: '20',
      nome: 'Tratamentos',
      linha: 'O que acontece dentro do fio, explicado.',
    },
  ],
  nota: 'Números de página da edição: decorativos, seguem a ordem das matérias.',
};

export const antesDepois = {
  folio: 'Antes e depois',
  titulo: { antes: 'O mesmo fio, ', destaque: 'depois', depois: '.' },
  intro:
    'Resultados de clientes da casa, com o nome da técnica. Toda transformação começa pela avaliação.',
  // legenda por par (técnica · profissional quando confirmado)
  pares: [
    {
      id: 'v-transformacao',
      legenda: 'Morena iluminada mel com corte',
      marcas: { antes: 'Antes', depois: 'Depois' },
    },
    { id: 'f-756143696→f-754970697', legenda: 'Ruivo e cobre, com franja cortina' },
    { id: 'f-862082658-a→f-862434060', legenda: 'Do cobre longo ao castanho iluminado com corte' },
  ],
  aviso: 'Pares de foto aguardando confirmação da casa.',
};

export const trabalhos = {
  folio: 'Trabalhos',
  titulo: { antes: 'Técnica + ', destaque: 'cor', depois: '' },
  intro:
    'Fotos reais, em luz de janela, de clientes que saíram da cadeira assim. Filtre pela técnica.',
  filtro: 'Filtrar por técnica',
  verTodos: 'Ver todos os trabalhos',
};

export const doisReais = {
  folio: 'Dois Reais ou um Cabelo',
  titulo: { antes: 'Dois Reais ou um ', destaque: 'Cabelo', depois: '' },
  linhas: [
    'É o quadro de transformações da Todalinda, contado em vídeo no Instagram.',
    'Cada episódio mostra a transformação de uma modelo na casa, do antes ao depois.',
    'As temporadas, os episódios e o jeito de participar estão no Instagram da casa.',
  ],
  botao: 'Assista no Instagram',
};

export const equipe = {
  folio: 'Equipe',
  etiqueta: '#TalentoTodalinda',
  titulo: { antes: 'Quem cuida do seu ', destaque: 'fio', depois: '' },
  intro: real('Hoje somos fortes porque temos pessoas.', F.revista5anos, 'literal'),
  // uma linha por pessoa (função e anos quando confirmados: src/content/equipe)
  linhas: {
    'edna-antoniolli': 'Fundadora. Abriu a casa em 2017.',
    'dido-rodrigues': 'Cabeleireiro, 26 anos de profissão.',
    'andressa-savaris': 'Cabeleireira e cosmetóloga, 9 anos de profissão.',
    'isabela-cristina': 'Colorista: colorimetria avançada, mechas, técnica + cor.',
    karine: 'Manicure e pedicure.',
    'thaynara-colombo': 'Educadora e nail designer.',
    'marina-schpanski': 'Maquiadora.',
  } as Record<string, string>,
};

export const casa3d = {
  folio: 'A casa',
  titulo: { antes: 'Por dentro da ', destaque: 'casa', depois: '' },
  intro:
    'Um sobrado no Centro de Lages, com gramado na frente e dois andares por dentro. Passeie antes de vir.',
  botao: 'Carregar o tour 3D',
  botaoTour: 'Abrir o tour completo',
  aviso: 'O tour usa mais dados. Em conexão lenta, ele só carrega quando você pedir.',
};

export const momento = {
  folio: 'Momento Todalinda',
  etiqueta: '#MomentoTodalinda',
  titulo: { antes: 'Clientes que viram ', destaque: 'história', depois: '' },
  fala: [
    real(
      'Tem clientes que eu olho e penso: meu Deus, você está aqui há quanto tempo?',
      F.ednaClientes,
    ),
    real(
      'A gente acompanhou mudança de cabelo, trabalho, namoro, casamento, filhos. E no meio disso tudo, continuou se encontrando aqui.',
      F.ednaClientes,
    ),
    real(
      'Por isso eu digo: salão tem uma coisa muito especial. A gente não cuida só do cabelo de alguém.',
      F.ednaClientes,
    ),
    real(
      'Talvez por isso algumas clientes deixam de ser apenas clientes e começam a fazer parte da nossa história.',
      F.ednaClientes,
    ),
  ],
  assinatura: 'Edna Antoniolli',
  botaoVideo: 'Ouvir a Edna',
  descricaoVideo:
    'Edna fala sobre as clientes que acompanham a casa há anos. 32 segundos, com som e legenda.',
  legendaFoto: 'A equipe Todalinda reunida no salão.',
};

export const oQueDizem = {
  folio: 'O que dizem',
  titulo: { antes: 'O que dizem no ', destaque: 'Google', depois: '' },
  // citações literais: src/config/avaliacoes.ts (escolha das 3 da home abaixo, por id)
  destaques: [4, 2, 13],
  selo: 'Avaliação no Google',
  linkFicha: 'Ver todas no Google',
};

export const revista = {
  folio: 'A revista',
  titulo: { antes: 'A casa tem ', destaque: 'revista', depois: '' },
  intro: 'Desde 2021, a Todalinda conta a própria história em edições impressas e digitais.',
};

export const agendar = {
  folio: 'Agendar',
  titulo: { antes: 'Escolha. A gente ', destaque: 'confirma', depois: '.' },
  intro:
    'Diga o serviço, se tem preferência de profissional e o dia que fica bom para você. A mensagem chega pronta no WhatsApp da recepção.',
  primeiraVez: 'Primeira vez em cor? Começamos com avaliação e teste de mecha.',
  preco: 'O valor depende do comprimento e do histórico do fio; na avaliação a gente te passa.',
};

export const visite = {
  folio: 'Visite',
  titulo: { antes: 'Rua Lauro Müller, ', destaque: '574', depois: '' },
  linha: 'Centro de Lages/SC. Um sobrado claro, com gramado na frente e a placa “somos TODALINDA”.',
  horario: 'Terça a sábado, das 9h às 19h.',
  telefone: 'Recepção (49) 3018-0082',
};

/** Frases de valor usadas ao longo da home. */
export const frases = { excelencia: valores.excelencia, merecimento: valores.merecimento };
