// Tokens de cor (CLAUDE.md, seção 5). Ouro PROVISÓRIO até o oficial.
// Contraste AA é validado por script na sessão 3 (audit-contraste).
export const cores = {
  noite: '#121013',
  cafe: '#2A1E19',
  papel: '#F7F3EC',
  tinta: '#1B1715',
  pedra: '#8A817A',
  ouro: '#AE8C55',
  ouroClaro: '#E2C88C',
  mocha: '#6B4A3A',
} as const;

export type Cor = keyof typeof cores;

/** Pares de uso previstos (texto sobre fundo), para o audit-contraste. */
export const paresDeContraste: readonly { texto: Cor; fundo: Cor; uso: string; minimo: 3 | 4.5 }[] =
  [
    { texto: 'tinta', fundo: 'papel', uso: 'texto corrido', minimo: 4.5 },
    { texto: 'papel', fundo: 'noite', uso: 'texto na capa', minimo: 4.5 },
    { texto: 'pedra', fundo: 'papel', uso: 'texto secundário', minimo: 4.5 },
    { texto: 'ouroClaro', fundo: 'noite', uso: 'texto grande em ouro', minimo: 3 },
    { texto: 'ouro', fundo: 'noite', uso: 'fólio/etiqueta (grande)', minimo: 3 },
  ];

export const cssVariaveis = (): string =>
  Object.entries(cores)
    .map(([k, v]) => `--cor-${k.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`)}: ${v};`)
    .join(' ');
