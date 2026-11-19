// Textos que se repetem no site: parágrafo-resposta, navegação, botões, rodapé, WhatsApp, avaliar, 404.
import { F, real, type Meta } from './fontes.ts';

/** O parágrafo-resposta base (quê + onde + como). Cada página adapta o seu. */
export const resposta =
  'A Todalinda é um salão de beleza no Centro de Lages/SC, na Rua Lauro Müller, 574, aberto desde 2017. A casa é especializada em coloração (morena iluminada, loiros, ruivos), mechas com teste de mecha, corte, penteado, make e esmalteria, e atende de terça a sábado, das 9h às 19h.';

export const assinatura = 'Desde 2017, no Centro de Lages.';

export const navegacao = {
  pular: 'Pular para o conteúdo',
  menu: 'Menu',
  fechar: 'Fechar menu',
  itens: [
    { rotulo: 'Serviços', href: '/#sumario' },
    { rotulo: 'Trabalhos', href: '/trabalhos' },
    { rotulo: 'Equipe', href: '/equipe' },
    { rotulo: 'A casa', href: '/a-casa' },
    { rotulo: 'Nossa história', href: '/nossa-historia' },
    { rotulo: 'Como chegar', href: '/como-chegar' },
  ],
  agendar: 'Agendar',
} as const;

export const botoes = {
  agendar: 'Agendar',
  agendarHorario: 'Agendar horário',
  agendarServico: (servico: string) => `Agendar ${servico.toLowerCase()}`,
  agendarCom: (nome: string) => `Agendar com ${nome.split(' ')[0]}`,
  verTrabalhos: 'Ver trabalhos',
  verTodos: 'Ver todos',
  verServico: 'Ler a matéria',
  assistirInstagram: 'Assista no Instagram',
  abrirTour: 'Abrir o tour completo',
  carregarTour: 'Carregar o tour 3D',
  verDeVerdade: 'Ver de verdade',
  ouvirEdna: 'Ouvir a Edna',
  avaliar: 'Avaliar no Google',
  comoChegar: 'Como chegar',
  copiarEndereco: 'Copiar endereço',
  enderecoCopiado: 'Endereço copiado',
  ligar: 'Ligar para a recepção',
  instagram: 'Instagram',
  lerRevista: 'Ler a edição',
  pausarVideo: 'Pausar vídeo',
  reproduzirVideo: 'Reproduzir vídeo',
  legendas: 'Legendas',
  fechar: 'Fechar',
  anterior: 'Anterior',
  proximo: 'Próximo',
  filtroTodas: 'Todas as técnicas',
  semPreferencia: 'Sem preferência',
  enviarWhatsApp: 'Enviar pelo WhatsApp',
  voltarInicio: 'Voltar ao início',
} as const;

/** Mensagens do WhatsApp por contexto (“Vim pelo site” no início; ver src/lib/whatsapp.ts). */
export const whatsapp = {
  geral: 'Olá! Vim pelo site da Todalinda e quero agendar um horário.',
  servico: (servico: string) => `Olá! Vim pelo site e quero agendar ${servico}.`,
  trabalho: (tecnica: string) => `Olá! Vi no site o trabalho de ${tecnica} e quero algo assim.`,
  profissional: (nome: string) => `Olá! Vim pelo site e quero agendar com ${nome}.`,
  ambiente: 'Olá! Vi o espaço no site e quero agendar uma visita/horário.',
  duvida: 'Olá! Vim pelo site e tenho uma dúvida.',
  avaliacao: 'Olá! Vim pelo site e quero agendar uma avaliação do fio.',
  doisReais: 'Olá! Vim pelo site e quero saber do Dois Reais ou um Cabelo.',
  comoChegar: 'Olá! Vim pelo site e quero confirmar como chegar à Todalinda.',
} as const;

/** Bloco “Avaliar no Google”: sem estrelas, sem nota, sem incentivo. */
export const avaliar = {
  titulo: 'Sua opinião ajuda outra mulher a nos encontrar.',
  linha: 'Leva 1 minuto. Conte como foi, do jeito que foi.',
  botao: 'Avaliar no Google',
  nota: 'Você vai para a página da Todalinda no Google.',
} as const;

export const rodape = {
  titulo: 'Todalinda',
  assinatura,
  endereco: 'Rua Lauro Müller, 574 · Centro · Lages/SC · CEP 88501-000',
  horario: 'Terça a sábado, das 9h às 19h. Domingo e segunda, fechado.',
  whatsapp: 'WhatsApp (49) 99177-2089',
  telefone: 'Telefone (49) 3018-0082',
  instagram: '@somostodalinda',
  legal:
    'Ateliê de Beleza Toda Linda · Cordova Antoniolli Serviços de Estéticas LTDA · CNPJ 25.337.323/0001-04',
  privacidade: 'Privacidade',
  avaliar: 'Avaliar no Google',
  credito: 'Site: WAXLO',
} as const;

export const pagina404 = {
  meta: {
    title: 'Página não encontrada · Todalinda, salão em Lages',
    description:
      'Esta página não existe. Veja os serviços da Todalinda, salão de beleza no Centro de Lages/SC, ou agende pelo WhatsApp.',
  } satisfies Meta,
  titulo: 'Esta página saiu da edição.',
  texto: 'O endereço pode ter mudado ou nunca ter existido. Três caminhos levam de volta à casa:',
  caminhos: [
    { rotulo: 'A capa', href: '/' },
    { rotulo: 'Os trabalhos', href: '/trabalhos' },
    // /agendar nasce com o agendador (sessão 7); até lá, o ponto #agendar da capa
    { rotulo: 'Agendar', href: '/#agendar' },
  ],
} as const;

/** Etiquetas (hashtags reais da casa). */
export const etiquetas = {
  talento: '#TalentoTodalinda',
  momento: '#MomentoTodalinda',
  equipe: '#EquipeTodalinda',
  make: '#TodaMake',
} as const;

/** Frases-guia da casa (valores). */
export const valores = {
  excelencia: real('Excelência não é um destino. É uma decisão diária.', F.parada, 'literal'),
  merecimento: real('Não é sobre luxo. É sobre merecimento.', F.manifesto, 'literal'),
  pessoas: real('Hoje somos fortes porque temos pessoas.', F.revista5anos, 'literal'),
  manifesto: real(
    'Merece estar em lugares bonitos. Merece se cuidar. Merece entrar em um lugar e se sentir pertencente… Não é sobre luxo. É sobre merecimento.',
    F.manifesto,
    'literal',
  ),
} as const;

/** Linha do status de horário quando não há JS. */
export const horarioFixo = 'ter–sáb · 9h–19h';

/** Rótulos de tecnologia/acessibilidade. */
export const acessibilidade = {
  abreNovaAba: '(abre em nova aba)',
  videoMudo: 'Vídeo sem som',
  videoComLegenda: 'Vídeo com som e legenda',
  antes: 'Antes',
  depois: 'Depois',
  comparar: 'Arraste para comparar',
  provisorio: 'Provisório',
  carregando: 'Carregando',
} as const;
