// Curadoria da mídia (fonte: docs/TODALINDA_MAPA_MIDIA.md + conferência da sessão 1).
// scripts/gerar-manifesto.mjs junta isto com as medidas reais e grava media.manifest.json.
// Chaves: trecho do nome do arquivo que identifica o original.

const T = {
  morena: 'morena iluminada / mel / caramelo',
  loiro: 'loiro (perolado, bege, manteiga)',
  ruivo: 'ruivo e cobre',
  castanho: 'castanho / mocha / natural',
  corte: 'corte e camadas',
  penteado: 'penteado',
  unhas: 'esmalteria',
};

export const fotos = {
  // morena iluminada
  749143529: {
    tecnica: T.morena,
    escolha: true,
    descricao: 'De costas, parede com letras "TO LI" douradas.',
    uso: ['galeria', 'servico-morena-iluminada'],
  },
  751623903: { tecnica: T.morena, descricao: 'Close das ondas.', uso: ['galeria'] },
  859140964: {
    tecnica: T.morena,
    escolha: true,
    descricao: 'Retrato sorrindo, parede de letras.',
    uso: ['galeria', 'servico-morena-iluminada'],
    crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
    problemas: [
      'Maioridade: o João (WAXLO) informou em 19/11/2026 que as clientes são maiores de idade (vale até que se saiba o contrário).',
    ],
  },
  859866649: {
    tecnica: T.morena,
    descricao: 'Close das ondas (mesma cliente de 859140964, sem rosto).',
    uso: ['galeria', 'faixa'],
  },
  860153001: {
    tecnica: T.morena,
    descricao: 'Perfil (mesma cliente de 859140964).',
    uso: ['galeria'],
    crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
    problemas: [
      'Maioridade: o João (WAXLO) informou em 19/11/2026 que as clientes são maiores de idade (vale até que se saiba o contrário).',
    ],
  },
  876662670: {
    tecnica: T.morena,
    escolha: true,
    descricao: 'De costas, luz de janela.',
    uso: ['galeria', 'servico-morena-iluminada', 'hero-alternativa'],
  },
  876794026: { tecnica: T.morena, descricao: 'Variação de 876662670.', uso: ['reserva'] },
  862434060: {
    tecnica: `${T.morena} + corte`,
    descricao: 'Castanho iluminado com corte, cliente de óculos (vista de costas).',
    uso: ['antes-depois', 'galeria'],
    par: { papel: 'depois', com: ['f-862082658-a'] },
  },
  862550598: {
    tecnica: `${T.morena} + corte`,
    descricao: 'Retrato sorrindo, mesma cliente de 862434060.',
    uso: ['antes-depois'],
    par: { papel: 'depois', com: ['f-862082658-a'] },
  },
  862620147: {
    tecnica: `${T.morena} + corte`,
    descricao: 'De costas, mesma cliente de 862434060.',
    uso: ['antes-depois'],
    par: { papel: 'depois', com: ['f-862082658-a'] },
  },
  887849578: { tecnica: T.morena, descricao: 'Close horizontal mel (1918×1180).', uso: ['faixa'] },
  902591720: {
    tecnica: T.morena,
    descricao: 'Ondas mel, retrato com blusa terracota.',
    uso: ['galeria'],
    rotacao: 90,
    edicoes: ['rotação 90° horário'],
  },
  // loiro
  751726770: { tecnica: T.loiro, descricao: 'Mão no fio, loiro ondulado.', uso: ['galeria'] },
  751939719: { tecnica: T.loiro, descricao: 'Perfil, parede com "LI" dourado.', uso: ['galeria'] },
  753362068: {
    tecnica: T.loiro,
    escolha: true,
    descricao: 'De costas, luz de janela.',
    uso: ['galeria', 'servico-loiro'],
  },
  753471488: {
    tecnica: T.loiro,
    descricao: 'Loiro com mechas, de costas, mão no fio.',
    uso: ['galeria'],
  },
  753546098: { tecnica: T.loiro, descricao: 'Loiro de costas, jardim ao fundo.', uso: ['galeria'] },
  861280514: {
    tecnica: T.loiro,
    escolha: true,
    descricao: 'Beige blonde ondulado.',
    uso: ['galeria', 'servico-loiro'],
  },
  '862082658_18436003447': {
    id: 'f-862082658-b',
    tecnica: T.loiro,
    descricao: 'Loiro ondulado de costas.',
    uso: ['galeria'],
  },
  862831173: { tecnica: T.loiro, descricao: 'Loiro ondulado de costas.', uso: ['galeria'] },
  894460956: { tecnica: T.loiro, descricao: 'Loiro liso longo (vista 1).', uso: ['galeria'] },
  902547672: { tecnica: T.loiro, descricao: 'Loiro liso longo (vista 2).', uso: ['galeria'] },
  'snapinsta-1794936040292': {
    id: 'f-936040292',
    tecnica: T.loiro,
    descricao: 'Platinado liso, espelho com LED ao fundo.',
    uso: ['galeria'],
    problemas: [
      'Espelho com LED ao fundo: evitar como destaque (molduras de luz são vetadas na identidade).',
    ],
  },
  900352710: { tecnica: T.loiro, descricao: 'Mechas loiras, close.', uso: ['galeria'] },
  901881314: {
    tecnica: T.loiro,
    escolha: true,
    descricao: 'Lateral ondulado.',
    uso: ['galeria', 'servico-loiro'],
    problemas: ['Original pequeno (912×1008).'],
  },
  900637927: {
    tecnica: T.loiro,
    descricao: 'Loira sorrindo, mãos no cabelo.',
    uso: ['galeria'],
    rotacao: 90,
    edicoes: ['rotação 90° horário'],
  },
  801555796: {
    tecnica: 'iluminado bege (a confirmar)',
    descricao: 'Ondas castanho-claro com reflexo bege, de costas. Não consta no mapa.',
    uso: ['reserva'],
    problemas: ['Ausente do mapa de mídia: técnica a confirmar com a casa.'],
  },
  // ruivo e cobre
  754970697: {
    tecnica: T.ruivo,
    escolha: true,
    descricao: 'Retrato ruivo cobre, franja cortina.',
    uso: ['galeria', 'servico-ruivo'],
    par: { papel: 'depois', com: ['f-756143696'] },
  },
  756641555: {
    tecnica: T.ruivo,
    descricao: 'Mesma cliente de 754970697, outra pose.',
    uso: ['galeria'],
    par: { papel: 'depois', com: ['f-756143696'] },
  },
  765855000: {
    tecnica: T.ruivo,
    escolha: true,
    descricao: 'Close ruivo intenso, cachos.',
    uso: ['galeria', 'servico-ruivo'],
  },
  '862082658_18253668139': {
    id: 'f-862082658-a',
    tecnica: T.ruivo,
    descricao: 'Cobre longo de costas (possível antes).',
    uso: ['antes-depois'],
    par: { papel: 'antes', com: ['f-862434060', 'f-862550598', 'f-862620147'] },
  },
  887153455: { tecnica: T.ruivo, descricao: 'Close horizontal cobre (1918×1180).', uso: ['faixa'] },
  // castanho
  753672680: {
    tecnica: T.castanho,
    escolha: true,
    descricao: 'Castanho longo de costas.',
    uso: ['galeria', 'servico-castanho'],
  },
  756143696: {
    tecnica: T.castanho,
    descricao: 'Retrato castanho, roupão Truss (possível antes do ruivo).',
    uso: ['antes-depois'],
    par: { papel: 'antes', com: ['f-754970697', 'f-756641555'] },
  },
  801582372: {
    tecnica: `${T.castanho} + ${T.corte}`,
    descricao: 'Castanho liso, corte reto.',
    uso: ['galeria', 'servico-corte'],
  },
  885931508: {
    tecnica: T.castanho,
    descricao: 'Close liso escuro horizontal (1918×1180).',
    uso: ['faixa'],
  },
  // corte
  902586035: {
    tecnica: T.corte,
    escolha: true,
    descricao: 'Retrato loiro com camadas, janela, capa preta.',
    uso: ['galeria', 'servico-corte', 'capa-retrato'],
  },
  902586330: {
    tecnica: T.corte,
    escolha: true,
    descricao: 'Mesma cliente, outra pose.',
    uso: ['galeria', 'servico-corte'],
  },
  // penteado
  846320909: {
    tecnica: T.penteado,
    escolha: true,
    descricao: 'Coque baixo com ondas, perfil.',
    uso: ['galeria', 'servico-penteado'],
  },
  899604807: {
    tecnica: T.penteado,
    pessoa: 'Dido Rodrigues (com cliente)',
    escolha: true,
    descricao: 'Dido com cliente, penteado ondulado, luz de janela.',
    uso: ['equipe', 'servico-penteado'],
  },
  // detalhe
  849098130: {
    tecnica: 'textura (cobre/mel)',
    descricao: 'Close de fio com texto queimado "Gold…".',
    uso: ['faixa'],
    recorte: { left: 0, top: 0, width: 1184, height: 1040 },
    edicoes: [
      'recorte para tirar o texto queimado "Gold…" (texto em y ≈ 1095–1150; corte em 1040)',
    ],
  },
  // unhas
  887750884: {
    tecnica: T.unhas,
    escolha: true,
    descricao: 'Unhas vermelhas sobre livro.',
    uso: ['servico-esmalteria'],
  },
  849272130: {
    tecnica: T.unhas,
    descricao: 'Unhas nude sobre livro.',
    uso: ['servico-esmalteria'],
  },
  850007933: {
    tecnica: T.unhas,
    descricao: 'Unhas nude sobre livro (vista 2).',
    uso: ['servico-esmalteria'],
  },
  901840667: {
    tecnica: T.unhas,
    escolha: true,
    descricao: 'Unhas cinza, mão no jeans com anel.',
    uso: ['servico-esmalteria'],
  },
  // espaço e equipe
  883558643: {
    id: 'f-883558643',
    pessoa: null,
    tecnica: null,
    descricao: 'Recepção: painel preto com filigrana dourada e "TODA LINDA", lírio-da-paz, lounge.',
    uso: ['referencia-3d', 'a-casa', 'open-graph'],
  },
  851041550: {
    pessoa: 'Equipe reunida (Dido, Edna e mais 7)',
    descricao: 'Time no interior, pendentes pretos; Edna com orquídea.',
    uso: ['equipe', 'nossa-historia'],
    escolha: true,
  },
};

const arteEdu = (desc) => ({
  natureza: 'arte',
  naoUsar: true,
  motivoNaoUsar:
    'Arte educativa com ilustração de aparência gerada e texto queimado. Só o texto vira conteúdo.',
  textoEm: 'docs/dados/textos-das-artes.md',
  descricao: desc,
  uso: ['texto'],
});
export const artes = {
  839179616: arteEdu('"Você sabe o que é reconstrução?" (marca TODA LINDA).'),
  844977298: arteEdu('"Função de cada camada do fio".'),
  845100676: arteEdu('"Como fica um fio danificado?".'),
  845432365: arteEdu('"O que a reconstrução faz no fio de cabelo?".'),
  846156826: arteEdu('"O que a hidratação faz no fio de cabelo?".'),
  846612203: arteEdu('"O que a cauterização faz no fio de cabelo?".'),
  847386926: arteEdu('"O que a nutrição faz no fio de cabelo?".'),
  847939100: arteEdu('"Entenda as camadas do fio de cabelo" (capa).'),
  849575432: arteEdu('"A estrutura do fio de cabelo".'),
  890716602: {
    ...arteEdu('Limpeza de pele: "Sua pele precisa estar preparada."'),
    motivoNaoUsar: 'Arte de terceira (biomédica) com foto de banco ou gerada.',
  },
  890716713: {
    ...arteEdu('Limpeza de pele: "Por que essa etapa é importante?"'),
    motivoNaoUsar: 'Arte de terceira (biomédica) com foto de banco ou gerada.',
  },
  890716867: {
    ...arteEdu('Limpeza de pele: "Cuidar da pele começa antes do procedimento."'),
    motivoNaoUsar: 'Arte de terceira (biomédica) com foto de banco ou gerada.',
  },
  890853837: {
    ...arteEdu('Limpeza de pele: "Você sabia que a limpeza de pele…"'),
    motivoNaoUsar: 'Arte de terceira (biomédica) com foto de banco ou gerada.',
  },
  850583628: {
    ...arteEdu('Carrossel Thaynara 1/4: unhas nude com luva lilás e texto.'),
    pessoa: 'Thaynara Colombo (autora)',
    tecnica: T.unhas,
    motivoNaoUsar: 'Texto queimado sobre a foto; não há versão sem texto.',
  },
  850806782: {
    ...arteEdu('Carrossel Thaynara 2/4: retrato da Thaynara com texto.'),
    pessoa: 'Thaynara Colombo',
    tecnica: T.unhas,
    motivoNaoUsar: 'Texto queimado sobre a foto; não há versão sem texto.',
  },
  850999160: {
    ...arteEdu('Carrossel Thaynara 3/4: unhas com texto.'),
    pessoa: 'Thaynara Colombo (autora)',
    tecnica: T.unhas,
    motivoNaoUsar: 'Texto queimado sobre a foto; não há versão sem texto.',
  },
  852414910: {
    ...arteEdu('Carrossel Thaynara 4/4: unhas com texto.'),
    pessoa: 'Thaynara Colombo (autora)',
    tecnica: T.unhas,
    motivoNaoUsar: 'Texto queimado sobre a foto; não há versão sem texto.',
  },
};

export const pequenas = {
  'dido.jpg': {
    id: 'eq-dido-150',
    pessoa: 'Dido Rodrigues',
    motivo: 'Retrato de 150 px (capa de destaque).',
  },
  'marina.jpg': {
    id: 'eq-marina-150',
    pessoa: 'Marina Schpanski',
    motivo: 'Retrato de 150 px (capa de destaque).',
  },
  'thaynara.jpg': {
    id: 'eq-thaynara-150',
    pessoa: 'Thaynara Colombo',
    motivo: 'Retrato de 150 px (capa de destaque).',
  },
  'cabelos.jpg': { id: 'capa-cabelos' },
  'coloracao.jpg': { id: 'capa-coloracao' },
  'esmalteria.jpg': { id: 'capa-esmalteria' },
  'localizacao.jpg': { id: 'capa-localizacao' },
  'make.jpg': { id: 'capa-make' },
  'mechas.jpg': { id: 'capa-mechas' },
  'penteados.jpg': { id: 'capa-penteados' },
  'unha.jpg': { id: 'capa-unha' },
};

export const capturas = {
  '12-24-16': {
    descricao: 'Fachada: sobrado cinza-claro, porta laranja, gramado, placa "somos TODALINDA".',
    uso: ['referencia-3d', 'pequena', 'como-chegar'],
  },
  '12-24-33': {
    descricao: 'Esmalteria: prateleiras de esmaltes com espelhos, planta pendente.',
    uso: ['referencia-3d', 'pequena'],
  },
  '12-24-52': {
    descricao: 'Salão: bancadas brancas, espelhos com luz, cadeiras pretas, trilho de spots.',
    uso: ['referencia-3d', 'pequena'],
  },
  '12-25-07': {
    descricao: 'Sala de estética: maca, mandala dourada, jardim vertical.',
    uso: ['referencia-3d', 'pequena'],
  },
  '12-25-23': {
    descricao: 'Fachada em outro ângulo (prédios ao fundo, escada lateral).',
    uso: ['referencia-3d', 'pequena'],
  },
  '12-25-37': {
    descricao: 'Lounge / mezanino: sofá caramelo, almofada com logo, piso de taco.',
    uso: ['referencia-3d', 'pequena'],
  },
  '12-49-24': {
    pessoa: 'Edna Antoniolli',
    descricao: 'Edna, blusa branca, cabelo curto acobreado (confirmada pelos vídeos).',
    uso: ['equipe', 'nossa-historia', 'pequena'],
  },
  '12-51-36': {
    pessoa: 'Isabela Cristina (PROVÁVEL)',
    confirmarIdentidade: true,
    descricao: 'Provável Isabela Cristina.',
    uso: ['equipe', 'pequena'],
  },
  '12-52-34': {
    pessoa: 'Andressa Savaris (PROVÁVEL)',
    confirmarIdentidade: true,
    descricao: 'Selfie; provável Andressa (a mesma do filme, 9–21 s).',
    uso: ['equipe', 'pequena'],
  },
  '13-12-39': {
    pessoa: 'Karine "Kah"',
    natureza: 'arte',
    naoUsar: true,
    motivoNaoUsar: 'Arte com texto; só o texto entra. Pedir foto da Karine.',
    textoEm: 'docs/dados/textos-das-artes.md',
    descricao: 'Arte "Mais que unhas, é autoestima" (5 tópicos).',
    uso: ['texto'],
  },
};

export const marca = {
  'todalinda-logo.svg': 'Logo completo, folha de ouro.',
  'todalinda-logo-mono.svg': 'Logo monocromático (currentColor), texto vazado.',
  'todalinda-selo.svg': 'Só o quadro (favicon, cabeçalho compacto).',
  'todalinda-selo-mono.svg': 'Só o quadro, monocromático.',
  'todalinda-palavra.svg': '"TODALINDA" em uma linha (cabeçalho).',
  'todalinda-filigrana.svg': 'Só a moldura de filigrana (abertura).',
};

// Vídeos. Tempos conferidos quadro a quadro (detecção de corte do ffmpeg + inspeção).
const H = ['720x1280', '540x960'];
export const videos = {
  933068881: {
    id: 'v-filme',
    descricao: 'Filme institucional cinematográfico, com música, sem legenda.',
    pessoa: 'Andressa (provável), Dido, clientes',
    tecnica: 'institucional',
    uso: ['abertura', 'hero', 'a-casa', 'equipe'],
    // a idade a confirmar vale só para os trechos com a cliente de 29–37 s (iluminada, logo-final)
    problemas: [
      'Cliente de 29–36 s (a mesma do vídeo 936752395): Maioridade: o João (WAXLO) informou em 19/11/2026 que as clientes são maiores de idade (vale até que se saiba o contrário).',
      'Música de fundo: direitos desconhecidos; usar só mudo.',
    ],
    trechos: [
      { nome: 'escova', in: 0.0, out: 4.5, loop: true, sizes: H },
      {
        nome: 'revelacao-espelho',
        in: 11.4,
        out: 12.9,
        sizes: H,
        nota: 'Corte de cena em 11,37 s e 12,93 s (mapa: 11,0).',
      },
      {
        nome: 'ondas',
        in: 13.0,
        out: 19.8,
        loop: true,
        hero: true,
        sizes: H,
        nota: 'Dois planos (corte em 16,77 s). Fim no corte de 19,87 s (mapa: 19,5).',
      },
      {
        nome: 'dido',
        in: 22.0,
        out: 29.0,
        sizes: H,
        nota: 'Plano começa em 21,83 s; termina no corte de 29,13 s.',
      },
      {
        nome: 'iluminada',
        crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
        in: 29.2,
        out: 35.9,
        loop: true,
        hero: true,
        sizes: H,
        nota: 'Corte em 29,13 s; flare em 31,9 s; logo entra em 36,3 s.',
      },
      {
        nome: 'logo-final',
        crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
        in: 36.3,
        out: 37.2,
        sizes: ['720x1280'],
        referencia: true,
        nota: 'Logo horizontal sobre a imagem (entra em 36,3 s, mapa: 36,0). Só referência.',
      },
    ],
  },
  936752395: {
    id: 'v-transformacao',
    descricao:
      'Transformação: antes (longo escuro, roupão Truss) → depois (iluminado mel com corte).',
    tecnica: `${T.morena} + corte`,
    uso: ['antes-depois', 'home', 'servico-morena-iluminada'],
    crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
    par: { papel: 'ambos', com: [] },
    problemas: [
      'Maioridade: o João (WAXLO) informou em 19/11/2026 que as clientes são maiores de idade (vale até que se saiba o contrário).',
      'O "antes" vai até 4,8 s (corte medido), não 3 s como no mapa.',
    ],
    trechos: [
      { nome: 'inteiro', in: 0, out: null, sizes: H },
      { nome: 'antes', in: 0.0, out: 4.7, sizes: H, nota: 'Corte de cena medido em 4,8 s.' },
      { nome: 'depois', in: 4.8, out: 22.6, loop: true, sizes: H },
    ],
  },
  933531180: {
    id: 'v-morena-iluminada',
    tecnica: T.morena,
    descricao: 'Resultado de morena iluminada, cabelo longo, luz natural.',
    uso: ['servico-morena-iluminada', 'galeria'],
    trechos: [{ nome: 'inteiro', in: 0, out: null, loop: true, sizes: H }],
  },
  933147675: {
    id: 'v-castanho-acobreado',
    tecnica: `${T.ruivo} + ${T.corte}`,
    descricao:
      'Castanho acobreado com corte em camadas, luz de janela (mesma modelo de 754970697).',
    uso: ['servico-ruivo', 'servico-corte'],
    trechos: [{ nome: 'inteiro', in: 0, out: null, loop: true, sizes: H }],
  },
  937077868: {
    id: 'v-mechas',
    tecnica: 'mechas / morena iluminada com contraste',
    descricao: 'Resultado de mechas com giro e movimento.',
    uso: ['servico-mechas', 'galeria'],
    problemas: ['Gravado a 9 quadros/s: movimento entrecortado.'],
    trechos: [{ nome: 'inteiro', in: 0, out: null, loop: true, sizes: H }],
  },
  932399083: {
    id: 'v-mechas-costas',
    tecnica: 'mechas',
    descricao: 'Mechas vistas de costas, várias viradas.',
    uso: ['galeria', 'loop-curto'],
    trechos: [{ nome: 'inteiro', in: 0, out: null, loop: true, sizes: H }],
  },
  933048763: {
    id: 'v-unhas',
    tecnica: T.unhas,
    descricao: 'Esmaltação em gel nude; mão com luva verde.',
    uso: ['servico-esmalteria'],
    problemas: ['Desfoque medido em 2,9–4,1 s (mapa: 5–6 s); escurece no fim (9,2 s).'],
    trechos: [
      {
        nome: 'unhas-1',
        in: 0.0,
        out: 2.8,
        loop: true,
        sizes: H,
        nota: 'Pedido: 0,0–4,0; o desfoque começa em 2,9 s.',
      },
      {
        nome: 'unhas-2',
        in: 4.3,
        out: 9.1,
        loop: true,
        sizes: H,
        nota: 'Pedido: 7,0–9,5; nítido de 4,2 a 9,1 s, escurece depois.',
      },
    ],
  },
  936089171: {
    id: 'v-edna-sonho',
    pessoa: 'Edna Antoniolli',
    tecnica: 'fala',
    descricao: 'Edna sentada no escritório, legenda queimada ("ver um sonho se tornar um lugar").',
    uso: ['nossa-historia', 'manifesto'],
    audioLiberado: true,
    transcrever: true,
    trechos: [{ nome: 'inteiro', in: 0, out: null, audio: true, legenda: true, sizes: H }],
  },
  AQNLG2: {
    id: 'v-edna-clientes',
    pessoa: 'Edna Antoniolli',
    tecnica: 'fala',
    descricao:
      'Edna em pé, casaco caramelo, legenda queimada ("algumas clientes deixam de ser apenas clientes").',
    uso: ['nossa-historia', 'manifesto'],
    audioLiberado: true,
    transcrever: true,
    trechos: [{ nome: 'inteiro', in: 0, out: null, audio: true, legenda: true, sizes: H }],
  },
  936180983: {
    id: 'v-dido-loiro',
    pessoa: 'Dido Rodrigues (e Edna, fora da câmera)',
    tecnica: T.loiro,
    descricao: 'Dido explica loiro perolado em cabelo 100% branco; legenda queimada.',
    uso: ['servico-loiro', 'equipe'],
    audioLiberado: true,
    transcrever: true,
    problemas: ['A cliente é chamada pelo nome no áudio: na legenda HTML vira "a cliente".'],
    trechos: [{ nome: 'inteiro', in: 0, out: null, audio: true, legenda: true, sizes: H }],
  },
  932334383: {
    id: 'v-edna-depoimento-1',
    pessoa: 'Edna Antoniolli',
    tecnica: 'fala',
    descricao: 'Edna sentada, terno caramelo, poltrona branca, luz de estúdio. Sem legenda.',
    uso: ['nossa-historia'],
    transcrever: true,
    problemas: ['Sem legenda queimada; trechos e áudio a decidir depois de ler a transcrição.'],
    trechos: [],
  },
  933027692: {
    id: 'v-edna-depoimento-2',
    pessoa: 'Edna Antoniolli',
    tecnica: 'fala',
    descricao: 'Edna em pé, terno azul, poltrona. Sem legenda.',
    uso: ['nossa-historia'],
    transcrever: true,
    problemas: ['Sem legenda queimada; trechos e áudio a decidir depois de ler a transcrição.'],
    trechos: [],
  },
  934239313: {
    id: 'v-dup-933531180',
    naoUsar: true,
    motivoNaoUsar: 'Duplicado de snapinsta-1794933531180.mp4.',
  },
  936414495: {
    id: 'v-dup-936180983',
    naoUsar: true,
    motivoNaoUsar: 'Duplicado de snapinsta-1794936180983.mp4.',
  },
};

// Quadros (stills) extraídos sem upscale por scripts/extract-stills.mjs.
export const quadros = [
  {
    id: 'q-revelacao-espelho',
    video: 'v-filme',
    tempo: 12.0,
    descricao: 'Cliente se vê no espelho e leva as mãos ao rosto.',
    uso: ['abertura', 'momento-todalinda'],
  },
  {
    id: 'q-ondas',
    video: 'v-filme',
    tempo: 16.0,
    descricao: 'Profissional loira atrás da cliente, ondas escuras com reflexo.',
    uso: ['hero-pôster'],
  },
  {
    id: 'q-dido-sorrindo',
    video: 'v-filme',
    tempo: 28.0,
    pessoa: 'Dido Rodrigues',
    descricao: 'Dido sorrindo com a cliente (rabo alto).',
    uso: ['equipe'],
  },
  {
    id: 'q-iluminada',
    video: 'v-filme',
    tempo: 33.0,
    descricao: 'Cliente com morena iluminada mel, sorrindo.',
    uso: ['hero-pôster-alternativo'],
    crianca: 'nao' /* maioridade informada pelo João em 19/11/2026 */,
  },
  {
    id: 'q-filigrana',
    video: 'v-filme',
    tempo: 6.0,
    nota: 'Mapa: 5 s; o plano da filigrana vai de 5,43 a 6,47 s.',
    descricao: 'Parede com painel de filigrana atrás da escova.',
    uso: ['abertura', 'referencia-3d'],
  },
];

// Correções aplicadas à transcrição antes de gravar (scripts/transcrever.mjs).
// Só o que é certo (confirmado pela legenda queimada ou óbvio). Nome de cliente → "a cliente".
export const correcoesTranscricao = {
  'v-dido-loiro': [
    [/^Dito,/, 'Dido,'],
    [/\ba Andr[eé]a\b/gi, 'a cliente'],
    [/\bAndr[eé]a\b/gi, 'a cliente'],
    [/louro pelo lado/gi, 'loiro perolado'],
    [/^Ele foi feito mechas/, 'Foi feito mechas'],
  ],
};
