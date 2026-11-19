// Páginas /servicos/<id> (só os publicados: os que têm mídia). Sem preço, sem promessa, sem duração
// (a casa não confirmou tempos: o campo fica fora até confirmar). “Quem faz” só quando confirmado.
import { F, real, type Meta, type Real } from './fontes.ts';

export interface Passo {
  titulo: string;
  texto: string;
}
export interface TextoServico {
  meta: Meta;
  rotulo: string; // etiqueta da matéria
  titulo: { antes: string; destaque: string; depois: string };
  resposta: string; // parágrafo-resposta (quê + onde + como)
  oQueE: string[];
  paraQuem: string[];
  processo: Passo[];
  /** Duração: só com confirmação da casa. null = a página omite. */
  duracao: null;
  cuidados: string[];
  /** Quem faz: só confirmado (src/content/servicos/<id>.json). null = a página omite. */
  quemFaz: null;
  fala?: Real;
  faq: { pergunta: string; resposta: string }[];
  cta: string;
  whatsapp: string;
}

const ONDE = 'na Todalinda, salão no Centro de Lages/SC (Rua Lauro Müller, 574)';
const HORARIO = 'de terça a sábado, das 9h às 19h';
const PRECO =
  'O valor depende do comprimento e do histórico do fio; na avaliação a gente te passa.';

const avaliacao: Passo = {
  titulo: 'Avaliação',
  texto:
    'Antes de qualquer química, a profissional olha o seu fio, pergunta o que já foi feito nele e o que você quer. É aqui que a técnica e o valor são definidos.',
};
const testeDeMecha: Passo = {
  titulo: 'Teste de mecha',
  texto:
    'Uma mecha pequena recebe o produto primeiro. Ela mostra como o seu fio reage, e o resultado orienta o resto do trabalho.',
};
const tratamento: Passo = {
  titulo: 'Tratamento',
  texto:
    'O cuidado indicado na avaliação (hidratação, nutrição ou reconstrução) entra antes ou depois da técnica, conforme o fio pede.',
};
const finalizacao: Passo = {
  titulo: 'Finalização',
  texto: 'Escova ou modelagem, e a orientação do que fazer em casa até a próxima visita.',
};

const cuidadosCor = [
  'Use os produtos e a rotina indicados na sua avaliação: eles foram escolhidos para o seu fio.',
  'Proteja do calor. Secador e chapinha sem protetor térmico agridem a cutícula, a camada externa que protege o fio e ajuda a segurar a cor.',
  'Volte para a manutenção no intervalo que a profissional indicar.',
];

const faqCor = (servico: string) => [
  { pergunta: 'Quanto custa?', resposta: PRECO },
  {
    pergunta: 'Precisa fazer teste de mecha?',
    resposta: `Sim. Em ${servico.toLowerCase()} e em qualquer química, a casa começa pela avaliação e pelo teste de mecha. É o que mostra como o seu fio reage antes do procedimento completo.`,
  },
  {
    pergunta: 'Fiz química nos últimos meses. Posso fazer?',
    resposta:
      'Conte isso na hora de agendar. O histórico de química muda a técnica e às vezes o tempo entre um procedimento e outro; a profissional decide com você na avaliação.',
  },
  {
    pergunta: 'Quanto tempo dura?',
    resposta:
      'Depende do seu fio, da rotina e dos cuidados em casa. Na avaliação, a profissional indica de quanto em quanto tempo voltar para a manutenção.',
  },
];

export const servicos: Record<string, TextoServico> = {
  'morena-iluminada': {
    meta: {
      title: 'Morena iluminada em Lages · Todalinda, salão no Centro',
      description:
        'Morena iluminada mel e caramelo em salão em Lages, no Centro: avaliação e teste de mecha antes da técnica. Agende na Todalinda pelo WhatsApp.',
    },
    rotulo: 'Cor',
    titulo: { antes: 'Morena ', destaque: 'iluminada', depois: '' },
    resposta: `A morena iluminada é feita ${ONDE}, ${HORARIO}. A casa desenha pontos de luz mel e caramelo sobre a base morena, sempre depois de avaliação e teste de mecha.`,
    oQueE: [
      'É luz desenhada no cabelo castanho ou escuro: mechas finas, clareadas e tonalizadas em tons de mel, caramelo e avelã, que conversam com a sua base.',
      'O desenho muda de pessoa para pessoa. Pode ser discreto, perto do rosto, ou espalhado pelo comprimento.',
    ],
    paraQuem: [
      'Para quem tem base morena e quer mais luz sem virar loira.',
      'Para quem quer uma cor que cresce com naturalidade entre uma manutenção e outra.',
    ],
    processo: [
      avaliacao,
      testeDeMecha,
      {
        titulo: 'Técnica',
        texto:
          'Clareamento em mechas finas e tonalização nos tons combinados, respeitando a base natural.',
      },
      tratamento,
      finalizacao,
    ],
    duracao: null,
    cuidados: cuidadosCor,
    quemFaz: null,
    faq: faqCor('Morena iluminada'),
    cta: 'Agendar morena iluminada',
    whatsapp: 'Olá! Vim pelo site e quero agendar Morena iluminada.',
  },

  loiros: {
    meta: {
      title: 'Loiro perolado e bege em Lages · Todalinda, Centro',
      description:
        'Loiros perolados, bege e manteiga em salão em Lages, no Centro, com teste de mecha antes da química. Agende na Todalinda pelo WhatsApp.',
    },
    rotulo: 'Cor',
    titulo: { antes: '', destaque: 'Loiros', depois: '' },
    resposta: `Os loiros são feitos ${ONDE}, ${HORARIO}. Perolado, bege ou manteiga: o caminho até o tom começa pela avaliação e pelo teste de mecha.`,
    oQueE: [
      'Loiro é uma família de tons. Perolado é mais frio, bege é neutro, manteiga é mais quente. O tom certo depende da sua pele, da base do fio e do que ele já passou.',
      'Às vezes o loiro vem do clareamento em mechas; às vezes, da coloração. Em cabelo com muitos fios brancos, por exemplo, a coloração pode chegar ao loiro sem mechas.',
    ],
    paraQuem: [
      'Para quem quer clarear aos poucos, com a saúde do fio em primeiro lugar.',
      'Para quem já é loira e quer acertar o tom ou a manutenção da raiz.',
    ],
    processo: [
      avaliacao,
      testeDeMecha,
      {
        titulo: 'Técnica',
        texto:
          'Clareamento em mechas ou coloração, conforme o fio, e tonalização para chegar ao tom combinado.',
      },
      tratamento,
      finalizacao,
    ],
    duracao: null,
    cuidados: [
      ...cuidadosCor,
      'No loiro, a manutenção costuma ser de raiz: o comprimento já clareado só recebe o tom.',
    ],
    quemFaz: null,
    fala: real(
      'A gente consegue fazer um loiro num cabelo 100% branco. Claro que foi feito mechas anteriormente, porque ela tinha uma raiz escura, e a gente foi clareando aos poucos. Mas hoje em dia a gente só retoca a raiz, para manter esse tom de loiro perolado.',
      F.dido,
    ),
    faq: [
      ...faqCor('Loiros'),
      {
        pergunta: 'Dá para fazer loiro em cabelo branco?',
        resposta:
          'Dá, e em alguns casos só com coloração. A avaliação mostra se o seu fio pede mechas, coloração ou as duas coisas.',
      },
    ],
    cta: 'Agendar loiros',
    whatsapp: 'Olá! Vim pelo site e quero agendar Loiros.',
  },

  'ruivo-e-cobre': {
    meta: {
      title: 'Ruivo e cobre em Lages · Todalinda, salão no Centro',
      description:
        'Ruivo cobre e acobreados em salão em Lages, no Centro: do cobre suave ao ruivo intenso, com avaliação e teste de mecha. Agende na Todalinda.',
    },
    rotulo: 'Cor',
    titulo: { antes: 'Ruivo e ', destaque: 'cobre', depois: '' },
    resposta: `Ruivos e acobreados são feitos ${ONDE}, ${HORARIO}. A casa escolhe o tom de cobre na avaliação e confirma no teste de mecha antes da coloração.`,
    oQueE: [
      'Do cobre suave, quase dourado, ao ruivo intenso. O mesmo pigmento muda bastante de uma base para outra, por isso o tom é escolhido olhando o seu fio.',
      'Pode vir em cabelo todo colorido ou combinado com corte em camadas, para o cobre aparecer no movimento.',
    ],
    paraQuem: [
      'Para quem quer mudar de cor com presença.',
      'Para quem já é ruiva e quer renovar o tom ou o brilho.',
    ],
    processo: [
      avaliacao,
      testeDeMecha,
      {
        titulo: 'Técnica',
        texto: 'Coloração e tonalização nos tons de cobre definidos na avaliação.',
      },
      tratamento,
      finalizacao,
    ],
    duracao: null,
    cuidados: [
      ...cuidadosCor,
      'Tons de cobre pedem retorno para renovar o brilho; a profissional indica o intervalo.',
    ],
    quemFaz: null,
    faq: faqCor('Ruivo e cobre'),
    cta: 'Agendar ruivo e cobre',
    whatsapp: 'Olá! Vim pelo site e quero agendar Ruivo e cobre.',
  },

  'castanho-e-mocha': {
    meta: {
      title: 'Castanho e mocha em Lages · Todalinda, salão no Centro',
      description:
        'Castanhos naturais e mocha em salão em Lages, no Centro: cor com profundidade e brilho, com avaliação antes. Agende na Todalinda pelo WhatsApp.',
    },
    rotulo: 'Cor',
    titulo: { antes: 'Castanho e ', destaque: 'mocha', depois: '' },
    resposta: `Castanhos e mocha são feitos ${ONDE}, ${HORARIO}. A cor é escolhida na avaliação e confirmada no teste de mecha, para ter profundidade sem pesar.`,
    oQueE: [
      'Castanho é a cor que mais parece natural, e por isso pede precisão: claro demais desbota, escuro demais apaga o rosto.',
      'Mocha é o castanho com um fundo de café e chocolate, entre o frio e o quente.',
    ],
    paraQuem: [
      'Para quem quer voltar ao natural ou escurecer com elegância.',
      'Para quem quer cobrir brancos num tom de castanho.',
    ],
    processo: [
      avaliacao,
      testeDeMecha,
      { titulo: 'Técnica', texto: 'Coloração e tonalização em tons de castanho.' },
      tratamento,
      finalizacao,
    ],
    duracao: null,
    cuidados: cuidadosCor,
    quemFaz: null,
    faq: faqCor('Castanho e mocha'),
    cta: 'Agendar castanho e mocha',
    whatsapp: 'Olá! Vim pelo site e quero agendar Castanho e mocha.',
  },

  mechas: {
    meta: {
      title: 'Mechas com teste de mecha em Lages · Todalinda, Centro',
      description:
        'Mechas em Lages, no Centro, sempre com teste de mecha antes: com contraste ou sutis, do jeito do seu fio. Agende na Todalinda pelo WhatsApp.',
    },
    rotulo: 'Cor',
    titulo: { antes: '', destaque: 'Mechas', depois: '' },
    resposta: `As mechas são feitas ${ONDE}, ${HORARIO}. Na Todalinda, toda mecha começa por avaliação e teste de mecha: é o que mostra o quanto o seu fio pode clarear.`,
    oQueE: [
      'Mechas são partes do cabelo clareadas para criar luz e movimento. Podem ter contraste, bem visível, ou ser sutis, quase um reflexo.',
      'A largura, o lugar e o tom são decididos com você, a partir do que o fio aguenta.',
    ],
    paraQuem: [
      'Para quem quer luz no cabelo, do reflexo discreto ao contraste.',
      'Para quem já tem mechas e precisa de retoque ou manutenção.',
    ],
    processo: [
      avaliacao,
      testeDeMecha,
      {
        titulo: 'Técnica',
        texto: 'Mechas na técnica escolhida na avaliação, seguidas de tonalização.',
      },
      tratamento,
      finalizacao,
    ],
    duracao: null,
    cuidados: cuidadosCor,
    quemFaz: null,
    faq: [
      ...faqCor('Mechas'),
      {
        pergunta: 'Posso fazer mechas no mesmo dia da avaliação?',
        resposta:
          'Depende do seu fio e da agenda do dia. Pergunte na hora de agendar: a recepção organiza avaliação e teste de mecha antes do procedimento.',
      },
    ],
    cta: 'Agendar mechas',
    whatsapp: 'Olá! Vim pelo site e quero agendar Mechas.',
  },

  corte: {
    meta: {
      title: 'Corte de cabelo feminino em Lages · Todalinda, Centro',
      description:
        'A Arte do Corte em salão em Lages, no Centro: camadas, comprimento e forma pensados para o rosto e a rotina. Agende o corte na Todalinda.',
    },
    rotulo: 'Corte',
    titulo: { antes: 'A Arte do ', destaque: 'Corte', depois: '' },
    resposta: `O corte é feito ${ONDE}, ${HORARIO}. Antes da tesoura, uma conversa sobre o seu rosto, a sua rotina e o que você quer do cabelo.`,
    oQueE: [
      'Corte é forma. Camadas longas para dar movimento, bob para quem quer leveza, corte reto para quem quer peso nas pontas.',
      'Um bom corte também ajuda a cor: as camadas mostram a luz das mechas e o brilho do cobre.',
    ],
    paraQuem: [
      'Para quem quer mudar a forma ou só manter o comprimento saudável.',
      'Para quem fez cor e quer que ela apareça no movimento.',
    ],
    processo: [
      {
        titulo: 'Conversa',
        texto:
          'O que você quer, como arruma o cabelo no dia a dia e o que não abre mão. Fotos de referência ajudam.',
      },
      { titulo: 'Técnica', texto: 'O corte, conforme o fio e o resultado combinado na conversa.' },
      finalizacao,
    ],
    duracao: null,
    cuidados: [
      'Volte para aparar as pontas no intervalo indicado: o corte perde a forma aos poucos.',
      'Proteja do calor ao secar e modelar.',
    ],
    quemFaz: null,
    faq: [
      { pergunta: 'Quanto custa?', resposta: PRECO },
      {
        pergunta: 'Posso levar uma foto de referência?',
        resposta:
          'Pode e ajuda. A profissional mostra o que daquela foto funciona no seu tipo de fio e no seu rosto.',
      },
      {
        pergunta: 'Dá para cortar e fazer cor no mesmo dia?',
        resposta:
          'Em muitos casos, sim. Diga os dois serviços na hora de agendar, para a recepção reservar o tempo certo.',
      },
    ],
    cta: 'Agendar corte',
    whatsapp: 'Olá! Vim pelo site e quero agendar Corte.',
  },

  'penteado-e-make': {
    meta: {
      title: 'Penteado e maquiagem em Lages · Todalinda, Centro',
      description:
        'Penteado e make para eventos em salão em Lages, no Centro: casamento, formatura, aniversário. Agende o seu dia na Todalinda pelo WhatsApp.',
    },
    rotulo: 'Festa',
    titulo: { antes: 'Penteado e ', destaque: 'make', depois: '' },
    resposta: `Penteado e maquiagem para eventos são feitos ${ONDE}, ${HORARIO}. Casamento, formatura ou aniversário: a produção é combinada com antecedência.`,
    oQueE: [
      'Coque baixo com ondas, rabo alto, cabelo solto e modelado. O penteado é pensado com o vestido, o evento e o seu cabelo.',
      'A maquiagem acompanha: da pele leve ao olho marcado.',
    ],
    paraQuem: [
      'Para noivas, madrinhas, formandas e convidadas.',
      'Para quem quer chegar pronta a um dia especial.',
    ],
    processo: [
      {
        titulo: 'Conversa',
        texto:
          'O evento, o horário, o vestido e as referências. Quanto antes, mais fácil reservar a equipe.',
      },
      { titulo: 'Técnica', texto: 'Penteado e maquiagem no dia, na casa.' },
      { titulo: 'Finalização', texto: 'Ajustes finais e fixação.' },
    ],
    duracao: null,
    cuidados: [
      'Chegue com o cabelo lavado e seco, salvo outra orientação da profissional.',
      'Leve fotos do vestido e do acessório de cabelo, se houver.',
    ],
    quemFaz: null,
    faq: [
      {
        pergunta: 'Quanto custa?',
        resposta:
          'O valor depende do penteado, da maquiagem e do número de pessoas; no agendamento a gente te passa.',
      },
      {
        pergunta: 'Com quanto tempo de antecedência devo agendar?',
        resposta:
          'O quanto antes, principalmente em sábados de casamento e formatura. A recepção confirma a disponibilidade da equipe.',
      },
      {
        pergunta: 'Dá para produzir várias pessoas no mesmo dia?',
        resposta: 'Diga quantas pessoas são ao agendar; a casa organiza a agenda e confirma.',
      },
    ],
    cta: 'Agendar penteado e make',
    whatsapp: 'Olá! Vim pelo site e quero agendar Penteado e make.',
  },

  esmalteria: {
    meta: {
      title: 'Esmalteria e unha em gel em Lages · Todalinda, Centro',
      description:
        'Esmalteria em Lages, no Centro: manicure, pedicure e unha em gel com blindagem. Agende a esmalteria da Todalinda pelo WhatsApp.',
    },
    rotulo: 'Unhas',
    titulo: { antes: '', destaque: 'Esmalteria', depois: '' },
    resposta: `A esmalteria funciona ${ONDE}, ${HORARIO}. Manicure, pedicure e esmaltação em gel com blindagem, depois de uma olhada na unha e na sua rotina.`,
    oQueE: [
      'Manicure e pedicure com esmaltação tradicional ou em gel.',
      'A blindagem é uma camada de reforço aplicada antes do gel, indicada para unhas que quebram com facilidade.',
    ],
    paraQuem: [
      'Para quem quer a unha feita com cuidado e acabamento.',
      'Para quem tem unhas frágeis e quer testar a blindagem com gel.',
    ],
    processo: [
      {
        titulo: 'Avaliação',
        texto: 'A profissional olha a unha e pergunta da sua rotina para indicar a esmaltação.',
      },
      {
        titulo: 'Técnica',
        texto: 'Preparo da unha e esmaltação tradicional ou em gel, com blindagem quando indicada.',
      },
      { titulo: 'Finalização', texto: 'Orientação de cuidado até o próximo atendimento.' },
    ],
    duracao: null,
    cuidados: [
      'Use luvas para lavar louça e limpar a casa.',
      'Não puxe o gel: a remoção é feita no salão.',
      'Volte no intervalo indicado para manutenção.',
    ],
    quemFaz: null,
    fala: real('Cada unha tem uma necessidade diferente.', F.thaynara, 'literal'),
    faq: [
      {
        pergunta: 'Quanto custa?',
        resposta: 'O valor depende do serviço escolhido; no agendamento a gente te passa.',
      },
      {
        pergunta: 'O que é a blindagem?',
        resposta:
          'Uma camada de reforço aplicada antes da esmaltação em gel, para unhas que quebram com facilidade. A profissional indica se faz sentido para a sua unha.',
      },
      {
        pergunta: 'Posso tirar o gel em casa?',
        resposta: 'O ideal é tirar no salão, para não arrancar camadas da unha junto.',
      },
    ],
    cta: 'Agendar esmalteria',
    whatsapp: 'Olá! Vim pelo site e quero agendar Esmalteria.',
  },
};
