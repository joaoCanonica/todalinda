// Texto alternativo (alt) de cada imagem publicável e descrição de cada vídeo.
// Regra: técnica + contexto, sem nome de cliente. Profissional da casa só pelo nome confirmado.
// Teste: tests/textos.test.ts confere que todo item publicável do media.manifest.json tem alt aqui.

export const alt: Record<string, string> = {
  // morena iluminada
  'f-749143529':
    'Morena iluminada em tons de mel e caramelo, cabelo longo e ondulado visto de costas, diante da parede de letras douradas do salão.',
  'f-751623903': 'Close de ondas castanhas com mechas mel e caramelo.',
  'f-859140964':
    'Morena iluminada caramelo em cabelo longo, cliente sorrindo diante da parede de letras do salão.',
  'f-859866649': 'Close de ondas escuras com reflexos caramelo.',
  'f-860153001':
    'Perfil de cliente com morena iluminada caramelo, a profissional segurando uma mecha.',
  'f-876662670': 'Morena iluminada mel em cabelo longo ondulado, de costas, em luz de janela.',
  'f-876794026': 'Morena iluminada mel em cabelo longo ondulado, de costas, em outra luz.',
  'f-887849578': 'Detalhe horizontal de fios castanhos com luz mel.',
  'f-902591720': 'Ondas mel e caramelo em cabelo longo, cliente sorrindo com blusa terracota.',
  'f-862434060':
    'Castanho iluminado com corte na altura dos ombros, visto de costas, a profissional ajeitando as pontas.',
  'f-862550598': 'Cliente sorrindo com castanho iluminado e corte na altura dos ombros.',
  'f-862620147': 'Castanho iluminado com corte na altura dos ombros, visto de costas no salão.',
  // loiros
  'f-751726770': 'Loiro dourado ondulado, a mão da profissional erguendo uma mecha.',
  'f-751939719': 'Loiro ondulado de perfil, diante das letras douradas da parede do salão.',
  'f-753362068': 'Loiro bege ondulado em cabelo longo, de costas, em luz de janela.',
  'f-753471488': 'Loiro com mechas em cabelo longo, de costas, a mão da profissional no fio.',
  'f-753546098': 'Loiro em cabelo longo, de costas, com jardim ao fundo.',
  'f-861280514': 'Loiro bege ondulado, visto de costas.',
  'f-862082658-b': 'Loiro ondulado em cabelo longo, de costas, no salão.',
  'f-862831173': 'Loiro ondulado de costas, com a mão da cliente no cabelo.',
  'f-894460956': 'Loiro claro liso e longo, visto de costas.',
  'f-902547672': 'Loiro claro liso e longo, de costas, em outra vista.',
  'f-900352710': 'Close de mechas loiras sobre base escura.',
  'f-900637927': 'Cliente sorrindo com loiro ondulado, as mãos no cabelo.',
  'f-901881314': 'Loiro ondulado visto de lado.',
  'f-936040292': 'Loiro platinado liso e longo, visto de costas.',
  'f-801555796': 'Ondas castanho-claras com reflexo bege, vistas de costas.',
  // ruivo e cobre
  'f-754970697': 'Ruivo cobre com franja cortina e ondas, retrato de cliente.',
  'f-756641555': 'Ruivo cobre com ondas volumosas, retrato de cliente.',
  'f-765855000': 'Close de cachos em ruivo intenso.',
  'f-862082658-a': 'Cabelo longo acobreado, visto de costas, antes da nova técnica.',
  'f-887153455': 'Detalhe horizontal de fios cor de cobre.',
  // castanho
  'f-753672680': 'Castanho longo e ondulado, visto de costas no salão.',
  'f-756143696': 'Cliente de cabelo castanho, de roupão, antes da coloração.',
  'f-801582372': 'Castanho liso com corte reto nas pontas, visto de costas.',
  'f-885931508': 'Detalhe horizontal de cabelo escuro e liso.',
  // corte
  'f-902586035': 'Loiro em camadas longas, retrato de cliente em luz de janela.',
  'f-902586330': 'Loiro em camadas longas, a cliente de capa preta em luz de janela.',
  // penteado
  'f-846320909': 'Penteado em coque baixo com ondas soltas, visto de perfil.',
  'f-899604807': 'Dido Rodrigues finaliza um penteado ondulado em luz de janela.',
  // detalhe
  'f-849098130': 'Detalhe de fios cor de mel em movimento.',
  // esmalteria
  'f-887750884': 'Unhas longas esmaltadas em vermelho sobre as páginas de um livro.',
  'f-849272130': 'Unhas em esmaltação nude sobre as páginas de um livro.',
  'f-850007933': 'Unhas em esmaltação nude, outra vista, sobre um livro aberto.',
  'f-901840667': 'Unhas em esmaltação cinza, a mão sobre o jeans.',
  // casa e equipe
  'f-883558643':
    'Recepção da Todalinda: painel preto com filigrana dourada e o nome TODA LINDA, lírio-da-paz e lounge.',
  'f-851041550':
    'A equipe Todalinda reunida no salão; Edna Antoniolli ao centro, com uma orquídea.',
  'cap-12-24-16':
    'Fachada da Todalinda: sobrado claro com porta de madeira cor de laranja, gramado e a placa "somos TODALINDA".',
  'cap-12-25-23': 'Fachada da Todalinda vista de outro ângulo, com a escada lateral.',
  'cap-12-24-33': 'Esmalteria: prateleiras de esmaltes com espelhos e uma planta pendente.',
  'cap-12-24-52': 'Salão: bancadas brancas, espelhos iluminados e cadeiras pretas.',
  'cap-12-25-07': 'Sala de estética com maca, mandala dourada e jardim vertical.',
  'cap-12-25-37': 'Lounge no andar de cima, com sofá caramelo e piso de taco.',
  'cap-12-49-24': 'Retrato de Edna Antoniolli, fundadora da Todalinda.',
  'cap-12-51-36': 'Retrato da colorista Isabela Cristina.',
  'cap-12-52-34': 'Retrato da cabeleireira Andressa Savaris.',
  // quadros de vídeo
  'q-revelacao-espelho':
    'Cliente se vê no espelho depois da transformação e leva as mãos ao rosto.',
  'q-ondas': 'A profissional ajeita as ondas escuras com reflexo de uma cliente sorridente.',
  'q-dido-sorrindo': 'Dido Rodrigues sorri com uma cliente depois de um penteado de rabo alto.',
  'q-iluminada': 'Cliente sorrindo com morena iluminada mel.',
  'q-filigrana': 'Escova com secador diante do painel de filigrana da casa.',
};

/** Descrições de vídeo (para leitor de tela, legenda e JSON-LD VideoObject). */
export const videos: Record<string, { titulo: string; descricao: string }> = {
  'v-filme': {
    titulo: 'Um dia na Todalinda',
    descricao: 'Escova, revelação no espelho, ondas e penteados: um dia no salão, em vídeo.',
  },
  'v-transformacao': {
    titulo: 'Transformação: morena iluminada com corte',
    descricao: 'Antes, cabelo longo e escuro; depois, morena iluminada mel com corte.',
  },
  'v-morena-iluminada': {
    titulo: 'Morena iluminada',
    descricao: 'Morena iluminada em cabelo longo, em luz natural.',
  },
  'v-castanho-acobreado': {
    titulo: 'Castanho acobreado em camadas',
    descricao: 'Castanho acobreado com corte em camadas, em luz de janela.',
  },
  'v-mechas': {
    titulo: 'Mechas com contraste',
    descricao: 'Resultado de mechas com contraste, em movimento.',
  },
  'v-mechas-costas': {
    titulo: 'Mechas vistas de costas',
    descricao: 'Mechas em cabelo longo, vistas de costas.',
  },
  'v-unhas': {
    titulo: 'Esmaltação em gel',
    descricao: 'Esmaltação em gel em tom nude na esmalteria.',
  },
  'v-edna-sonho': {
    titulo: 'Edna Antoniolli: ver um sonho se tornar um lugar',
    descricao:
      'A fundadora fala sobre ver o salão cheio e o que um dia foi um sonho. Com som e legenda.',
  },
  'v-edna-clientes': {
    titulo: 'Edna Antoniolli: clientes que viram história',
    descricao:
      'A fundadora fala sobre as clientes que acompanham a casa há anos. Com som e legenda.',
  },
  'v-dido-loiro': {
    titulo: 'Dido Rodrigues: loiro em cabelo branco',
    descricao:
      'Dido explica como chegar ao loiro perolado em cabelo com fios brancos. Com som e legenda.',
  },
  'v-edna-depoimento-1': {
    titulo: 'Edna Antoniolli: o cartão Toda Pontual',
    descricao: 'A fundadora conta como nasceu o cartão para quem chega no horário.',
  },
  'v-edna-depoimento-2': {
    titulo: 'Edna Antoniolli: o dia em que me tornei empreendedora',
    descricao: 'A fundadora conta o dia em que entendeu a própria responsabilidade na casa.',
  },
};
