// Páginas internas: Dois Reais, revista, a casa, agendar, avaliar/qr, como chegar, perguntas frequentes,
// privacidade, trabalhos. Nada de estacionamento, pagamento ou duração enquanto a casa não confirmar.
import { F, real, type Meta } from './fontes.ts';
import { resposta } from './geral.ts';

export const doisReais = {
  meta: {
    title: 'Dois Reais ou um Cabelo: o quadro da Todalinda, Lages',
    description:
      'O quadro de transformações da Todalinda, salão em Lages, no Centro: episódios em vídeo, da avaliação do fio ao resultado. Assista no Instagram.',
  } satisfies Meta,
  rotulo: 'O quadro',
  titulo: { antes: 'Dois Reais ou um ', destaque: 'Cabelo', depois: '' },
  resposta:
    'Dois Reais ou um Cabelo Todalinda é o quadro de transformações em vídeo da Todalinda, salão no Centro de Lages/SC. Os episódios são publicados no Instagram da casa, @somostodalinda.',
  oQueE: [
    'Cada episódio mostra a transformação de uma modelo na casa, do antes ao depois, com o nome da técnica.',
    'É o jeito da casa mostrar, sem filtro de estúdio, como o trabalho acontece na cadeira.',
  ],
  temporadas: [
    {
      nome: '1ª temporada',
      texto: 'Encerrada em 27 de fevereiro de 2026, com quatro modelos.',
      fonte: F.doisReais,
    },
    { nome: '2ª temporada', texto: 'No ar desde 1º de março de 2026.', fonte: F.doisReais },
  ],
  participar: 'Como participar e as regras de cada temporada ficam no Instagram da casa.',
  botao: 'Assista no Instagram',
};

export const revista = {
  meta: {
    title: 'A revista Todalinda: as três edições · salão em Lages',
    description:
      'As três edições da revista da Todalinda, salão em Lages, no Centro: a primeira, a dos 5 anos e a Equipe dos Sonhos. Leia online.',
  } satisfies Meta,
  rotulo: 'Arquivo',
  titulo: { antes: 'A ', destaque: 'revista', depois: '' },
  resposta:
    'A Todalinda, salão no Centro de Lages/SC, publica a própria revista desde 2021. São três edições, que contam a história da casa, da equipe e das clientes.',
  edicoes: [
    {
      nome: 'Edição 01',
      data: 'dez/2021 – fev/2022',
      paginas: 24,
      linha: 'A equipe, as clientes e um ensaio de Dia da Noiva na estrutura completa da casa.',
      fonte: F.revista1,
    },
    {
      nome: '5 anos: do sonho à realização',
      data: 'jul/2022',
      paginas: 20,
      linha: 'A festa de cinco anos, depoimentos e a fala da Edna sobre o começo.',
      fonte: F.revista5anos,
    },
    {
      nome: 'Equipe dos Sonhos',
      data: 'set/2023',
      paginas: 20,
      linha: 'Treinamentos, o primeiro Sunset Todalinda no gramado e a matéria Momento Todalinda.',
      fonte: F.revista2023,
    },
  ],
  botao: 'Ler a edição',
};

/** /a-casa: só o que está nas fotos e capturas do repositório (layout do 3D: sessão 6B). */
export const aCasa = {
  meta: {
    title: 'A casa da Todalinda em 3D · salão no Centro de Lages',
    description:
      'Passeie pela Todalinda antes de vir: fachada, recepção, salão, esmalteria e lounge do salão em Lages, no Centro, na Rua Lauro Müller, 574.',
  } satisfies Meta,
  rotulo: 'A casa',
  titulo: { antes: 'Por dentro da ', destaque: 'casa', depois: '' },
  resposta:
    'A Todalinda fica num sobrado claro no Centro de Lages/SC, na Rua Lauro Müller, 574, com gramado na frente e dois andares por dentro. Aqui você conhece os ambientes antes de vir.',
  ambientes: [
    {
      id: 'fachada',
      nome: 'Fachada',
      texto:
        'Sobrado cinza-claro, porta de madeira cor de laranja e um gramado com mureta. A placa diz "somos TODALINDA".',
      fonte: 'captura de tela do Instagram (media-originais/fotos/capturas, 12-24-16)',
    },
    {
      id: 'recepcao',
      nome: 'Recepção',
      texto:
        'Um painel preto com a filigrana dourada da marca e o nome TODA LINDA. Ao lado, um lírio-da-paz e o lounge, com luz de janela.',
      fonte: 'foto 883558643 (media-originais/fotos)',
    },
    {
      id: 'salao',
      nome: 'Salão',
      texto:
        'Bancadas brancas com espelhos iluminados, cadeiras pretas e trilho de spots. É onde a cor e o corte acontecem.',
      fonte: 'captura de tela do Instagram (12-24-52)',
    },
    {
      id: 'esmalteria',
      nome: 'Esmalteria',
      texto: 'Prateleiras de esmaltes com espelhos e uma planta pendente.',
      fonte: 'captura de tela do Instagram (12-24-33)',
    },
    {
      id: 'estetica',
      nome: 'Sala de estética',
      texto: 'Uma sala reservada, com maca, mandala dourada na parede e jardim vertical.',
      fonte: 'captura de tela do Instagram (12-25-07)',
    },
    {
      id: 'lounge',
      nome: 'Lounge',
      texto: 'No andar de cima, um sofá caramelo, almofada com o logo e piso de taco.',
      fonte: 'captura de tela do Instagram (12-25-37)',
    },
  ],
  aviso3d: 'A maquete segue as fotos da casa; as medidas exatas chegam com a planta.',
  botao3d: 'Carregar o tour 3D',
  botaoVerdade: 'Ver de verdade',
  listaTexto: 'Os ambientes, em texto',
  cta: {
    titulo: 'Quer ver pessoalmente?',
    botao: 'Agendar horário',
    whatsapp: 'Olá! Vi o espaço no site e quero agendar uma visita/horário.',
  },
};

export const agendar = {
  meta: {
    title: 'Agendar horário na Todalinda · salão em Lages, Centro',
    description:
      'Agende cor, mechas, corte, penteado, make ou esmalteria na Todalinda, salão em Lages, no Centro. Escolha o serviço e envie pelo WhatsApp.',
  } satisfies Meta,
  rotulo: 'Agendar',
  titulo: { antes: 'Escolha. A gente ', destaque: 'confirma', depois: '.' },
  resposta:
    'Para agendar na Todalinda, salão no Centro de Lages/SC, escolha o serviço, a profissional (ou "sem preferência"), o dia e o período. A mensagem chega pronta no WhatsApp da recepção, que confirma o horário. A casa atende de terça a sábado, das 9h às 19h.',
  passos: [
    {
      titulo: 'O serviço',
      texto: 'O que você quer fazer. Em dúvida entre dois? Escolha um e conte na mensagem.',
    },
    {
      titulo: 'A profissional',
      texto: 'Se tem alguém de preferência, escolha. Se não, a casa indica quem atende o seu caso.',
    },
    {
      titulo: 'O dia e o período',
      texto:
        'Terça a sábado, de manhã (9h–12h) ou à tarde (13h–19h). A recepção confirma o horário exato.',
    },
  ],
  perguntas: {
    servico: 'Qual serviço?',
    profissional: 'Com quem?',
    dia: 'Que dia?',
    periodo: 'Que período?',
    quimica: 'Fez química (coloração, mechas, alisamento) nos últimos 6 meses?',
    primeiraVez: 'É a sua primeira vez na Todalinda?',
    nome: 'Seu nome (opcional)',
  },
  primeiraVezCor: 'Primeira vez em cor? Começamos com avaliação e teste de mecha.',
  preco: 'O valor depende do comprimento e do histórico do fio; na avaliação a gente te passa.',
  privacidade:
    'Nada do que você escolhe aqui fica guardado no site: a mensagem é montada no seu aparelho e enviada por você no WhatsApp.',
  botao: 'Enviar pelo WhatsApp',
  semWhatsApp: 'Prefere ligar? Recepção (49) 3018-0082.',
};

export const avaliarQr = {
  meta: {
    title: 'Avaliar a Todalinda no Google',
    description: 'Cartão com QR para avaliar a Todalinda no Google.',
  } satisfies Meta,
  titulo: 'Sua opinião ajuda outra mulher a nos encontrar.',
  linha: 'Aponte a câmera para o código e conte como foi, do jeito que foi.',
  rodape: 'Todalinda · Rua Lauro Müller, 574 · Centro · Lages/SC',
  /** "ou acesse <domínio>/avaliar": o domínio é PENDENTE; a página monta a linha com seo.siteUrl quando existir. */
  link: (dominio: string) => `ou acesse ${dominio}/avaliar`,
  imprimir: 'Imprimir cartão',
};

export const comoChegar = {
  meta: {
    title: 'Como chegar à Todalinda · salão no Centro de Lages',
    description:
      'Todalinda, salão em Lages, no Centro: Rua Lauro Müller, 574, CEP 88501-000. Abra no Google Maps, Waze ou Apple Mapas. Ter–sáb, 9h às 19h.',
  } satisfies Meta,
  rotulo: 'Visite',
  titulo: { antes: 'Rua Lauro Müller, ', destaque: '574', depois: '' },
  resposta:
    'A Todalinda fica na Rua Lauro Müller, 574, no Centro de Lages/SC (CEP 88501-000), num sobrado claro com gramado na frente. Atende de terça a sábado, das 9h às 19h.',
  referencia: 'Procure a placa "somos TODALINDA" e a porta de madeira cor de laranja.',
  apps: 'Abrir no aplicativo de mapas',
  horario: 'Horário',
  feriados: 'Em feriados, confirme o horário pelo WhatsApp antes de vir.',
  contato: 'Dúvida no caminho? Fale com a recepção.',
  proximosFeriados: 'Próximos feriados',
  /** Mapa interativo: só carrega depois do clique (e do aviso de privacidade). */
  mapa: {
    titulo: 'O mapa',
    aviso:
      'O mapa interativo vem do OpenStreetMap. Ao carregar, o seu navegador se conecta a ele, que recebe o seu endereço IP. Nada é carregado antes do clique e do seu aceite no aviso de privacidade.',
    botao: 'Carregar o mapa interativo',
    moldura: 'Mapa interativo da região da Todalinda, no Centro de Lages (OpenStreetMap)',
  },
  // estacionamento: PENDENTE (só entra quando a casa confirmar)
};

export interface Pergunta {
  pergunta: string;
  resposta: string;
}
export const faq = {
  meta: {
    title: 'Perguntas frequentes · Todalinda, salão em Lages',
    description:
      'Preço, teste de mecha, química recente, manutenção, horários e como chegar à Todalinda, salão em Lages, no Centro. Respostas diretas.',
  } satisfies Meta,
  rotulo: 'Dúvidas',
  titulo: { antes: 'Perguntas ', destaque: 'frequentes', depois: '' },
  resposta,
  grupos: [
    {
      titulo: 'Valores e agendamento',
      itens: [
        {
          pergunta: 'Quanto custa?',
          resposta:
            'O valor depende do comprimento e do histórico do fio; na avaliação a gente te passa. Em unhas, penteado e make, a recepção informa no agendamento.',
        },
        {
          pergunta: 'Como agendo?',
          resposta:
            'Pelo agendador do site, que monta a mensagem e abre o WhatsApp da recepção, ou pelo telefone (49) 3018-0082.',
        },
        {
          pergunta: 'Posso escolher a profissional?',
          resposta: 'Pode. Se não tiver preferência, a casa indica quem atende o seu caso.',
        },
      ],
    },
    {
      titulo: 'Cor e química',
      itens: [
        {
          pergunta: 'Precisa fazer teste de mecha?',
          resposta:
            'Sim, em qualquer química (coloração, mechas, clareamento). O teste mostra como o seu fio reage antes do procedimento completo.',
        },
        {
          pergunta: 'Fiz química recentemente. Posso fazer cor ou mechas?',
          resposta:
            'Conte isso ao agendar. O histórico muda a técnica e, às vezes, o tempo entre um procedimento e outro; a decisão é tomada com você na avaliação.',
        },
        {
          pergunta: 'Quanto tempo dura a cor?',
          resposta:
            'Depende do fio, da técnica, da rotina e dos cuidados em casa. Na avaliação, a profissional indica de quanto em quanto tempo voltar para a manutenção.',
        },
        {
          pergunta: 'Quanto tempo leva o atendimento?',
          resposta:
            'Varia com a técnica e o comprimento do cabelo. A recepção informa a estimativa quando confirma o horário.',
        },
      ],
    },
    {
      titulo: 'Manutenção',
      itens: [
        {
          pergunta: 'De quanto em quanto tempo volto?',
          resposta:
            'A profissional indica na avaliação: depende da técnica (raiz, tonalização, corte) e do seu fio.',
        },
        {
          pergunta: 'Que produto devo usar em casa?',
          resposta:
            'Os indicados na sua avaliação. Eles são escolhidos para o seu fio e para a técnica feita.',
        },
      ],
    },
    {
      titulo: 'Horário e endereço',
      itens: [
        {
          pergunta: 'Qual o horário?',
          resposta:
            'Terça a sábado, das 9h às 19h. Domingo e segunda, fechado. Em feriados, confirme pelo WhatsApp.',
        },
        {
          pergunta: 'Onde fica?',
          resposta:
            'Rua Lauro Müller, 574, Centro, Lages/SC, CEP 88501-000. Um sobrado claro, com gramado na frente.',
        },
      ],
    },
  ] as { titulo: string; itens: Pergunta[] }[],
  // estacionamento e formas de pagamento: PENDENTES (entram quando a casa confirmar)
};

export const privacidade = {
  meta: {
    title: 'Privacidade · Todalinda, salão em Lages',
    description:
      'Como o site da Todalinda, salão em Lages, no Centro, trata seus dados: o agendador não guarda nada; a conversa acontece no WhatsApp.',
  } satisfies Meta,
  titulo: 'Privacidade',
  resposta:
    'Este site não pede cadastro e não guarda os dados que você escolhe no agendador. Abaixo, o que acontece em cada parte.',
  secoes: [
    {
      titulo: 'Quem é a responsável',
      texto:
        'Cordova Antoniolli Serviços de Estéticas LTDA (Ateliê de Beleza Toda Linda), CNPJ 25.337.323/0001-04, Rua Lauro Müller, 574, Centro, Lages/SC, CEP 88501-000.',
    },
    {
      titulo: 'Agendamento',
      texto:
        'O agendador monta a mensagem no seu próprio aparelho. Nada é enviado ao site nem guardado nele: você decide se envia a mensagem pelo WhatsApp. A conversa no WhatsApp segue as regras do próprio WhatsApp e é usada pela recepção só para marcar o seu horário.',
    },
    {
      titulo: 'Fotos e vídeos',
      texto:
        'As fotos e os vídeos de clientes publicados aqui foram autorizados pelas pessoas que aparecem neles. Se você aparece em alguma imagem e quer que ela saia, fale com a recepção.',
    },
    {
      titulo: 'Cookies e medição',
      texto:
        'A medição de visitas só liga se você tocar em "Aceitar" no aviso de privacidade. Ela conta cliques (agendar, avaliar, como chegar, Instagram, telefone) e a página de origem, sem nome, sem telefone e sem a sua mensagem. O site não usa ferramentas de publicidade. Você muda a escolha quando quiser em "Preferências de privacidade", no rodapé; a escolha fica guardada só no seu aparelho.',
    },
    {
      titulo: 'Mapa',
      texto:
        'Na página Como chegar, o mapa interativo do OpenStreetMap só carrega se você aceitar no aviso de privacidade e clicar para carregá-lo. A partir daí, o seu navegador se conecta ao OpenStreetMap, que recebe o seu endereço IP, conforme a política de privacidade dele.',
    },
    {
      titulo: 'Links para outros sites',
      texto:
        'Google Maps, Waze, Apple Mapas, Instagram, WhatsApp e a revista online abrem fora deste site, com as políticas de cada serviço.',
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir informação, correção ou exclusão dos seus dados. Fale com a recepção pelo WhatsApp (49) 99177-2089 ou pelo telefone (49) 3018-0082.',
    },
  ],
  atualizado: 'Atualizada em novembro de 2026.',
};

export const trabalhos = {
  meta: {
    title: 'Trabalhos: morena iluminada, loiros e ruivos em Lages',
    description:
      'Fotos reais de morena iluminada, loiros, ruivo e cobre, mechas, corte e esmalteria feitos na Todalinda, salão em Lages, no Centro.',
  } satisfies Meta,
  rotulo: 'Trabalhos',
  titulo: { antes: 'Técnica + ', destaque: 'cor', depois: '' },
  resposta:
    'Estes são trabalhos feitos na Todalinda, salão no Centro de Lages/SC: morena iluminada, loiros, ruivo e cobre, castanho, mechas, corte, penteado e esmalteria. Fotos reais de clientes, em luz de janela.',
  filtro: 'Filtrar por técnica',
  todas: 'Todas',
  cta: 'Quero algo assim',
};

/** Página índice /servicos (se existir) e o sumário reaproveitam home.sumario. */
export const servicosIndice = {
  meta: {
    title: 'Serviços: cor, mechas, corte e esmalteria em Lages',
    description:
      'Morena iluminada, loiros, ruivo, castanho, mechas com teste de mecha, corte, penteado, make e esmalteria na Todalinda, salão em Lages, no Centro.',
  } satisfies Meta,
};

/** Fala da Thaynara para a esmalteria (história de caso, sem a promessa de "garanto"). */
export const casoEsmalteria = real(
  'Eu tenho uma cliente que chegou até a minha mesa acreditando que as unhas fracas e quebradiças não teriam solução. Ela tentou resolver de várias formas, com esmaltação tradicional, fortalecedores. Aceitou a minha proposta, e aplicamos a blindagem com a esmaltação em gel.',
  F.thaynara,
);
