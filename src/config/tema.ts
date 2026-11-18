// Tokens de cor (CLAUDE.md, seção 5), calibrados na sessão 3 com os stills e o logo.
// Ouro PROVISÓRIO até o oficial. Contraste validado por scripts/audit-contraste.mjs.
export const cores = {
  noite: '#121013', // sombra profunda dos stills (#101113) · capa
  cafe: '#2A1E19', // sombra quente (#2B1C1C, #211813) · superfícies
  papel: '#F7F3EC', // página clara, luz de janela suavizada
  tinta: '#1B1715', // texto sobre Papel
  pedra: '#756B64', // texto secundário sobre Papel (calibrado: #8A817A dava 3,45:1)
  pedraClara: '#8A817A', // texto secundário e fios sobre Noite/Café (o tom original)
  ouro: '#AE8C55', // traço do logo · fólio, etiquetas, foco sobre Noite
  ouroClaro: '#E2C88C', // realce da folha · texto em ouro grande sobre Noite
  mocha: '#6B4A3A', // meio-tom das morenas (#5F3D30–#955E44) · acento raro, foco sobre Papel
} as const;

export type Cor = keyof typeof cores;

export interface Par {
  texto: Cor;
  fundo: Cor;
  uso: string;
  /** 4,5 = texto normal (AA) · 3 = texto grande (≥ 24 px, ou ≥ 18,66 px negrito) ou elemento de interface */
  minimo: 3 | 4.5;
}

/** Todo par de cor usado no site. Se não está aqui, não pode ser usado. */
export const paresDeContraste: readonly Par[] = [
  { texto: 'tinta', fundo: 'papel', uso: 'texto corrido', minimo: 4.5 },
  { texto: 'pedra', fundo: 'papel', uso: 'texto secundário, legendas', minimo: 4.5 },
  { texto: 'mocha', fundo: 'papel', uso: 'link, foco, acento', minimo: 4.5 },
  { texto: 'noite', fundo: 'papel', uso: 'botão Agendar (tom página), títulos', minimo: 4.5 },
  { texto: 'papel', fundo: 'noite', uso: 'texto na capa, botão Agendar (tom capa)', minimo: 4.5 },
  { texto: 'pedraClara', fundo: 'noite', uso: 'texto secundário na capa', minimo: 4.5 },
  { texto: 'ouro', fundo: 'noite', uso: 'fólio, etiqueta, foco, números (grande)', minimo: 3 },
  { texto: 'ouroClaro', fundo: 'noite', uso: 'texto em ouro grande, capitular, aspas', minimo: 3 },
  { texto: 'papel', fundo: 'cafe', uso: 'texto sobre superfície quente', minimo: 4.5 },
  { texto: 'ouroClaro', fundo: 'cafe', uso: 'destaque sobre superfície quente', minimo: 3 },
  { texto: 'papel', fundo: 'mocha', uso: 'texto em bloco mocha (raro)', minimo: 4.5 },
  { texto: 'ouro', fundo: 'tinta', uso: 'fio do botão primário (interface)', minimo: 3 },
];

/** Proibido: ouro como texto ou foco sobre Papel (2,84:1). */
export const paresProibidos: readonly [Cor, Cor][] = [
  ['ouro', 'papel'],
  ['ouroClaro', 'papel'],
  ['pedraClara', 'papel'],
];

export const cssVariaveis = (): string =>
  Object.entries(cores)
    .map(([k, v]) => `--cor-${k.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`)}: ${v};`)
    .join(' ');
