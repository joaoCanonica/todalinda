import { aviso, confirmado, opcional } from './tipos.ts';

const FONTE_JOAO = 'João (WAXLO), 17/11/2026';

export const marca = {
  nome: confirmado('Todalinda', 'Google e Instagram; decisão do João'),
  nomeLegal: confirmado('Cordova Antoniolli Serviços de Estéticas LTDA', FONTE_JOAO),
  fantasia: confirmado('Ateliê de Beleza Toda Linda', FONTE_JOAO),
  cnpj: confirmado('25.337.323/0001-04', FONTE_JOAO),
  fundacao: {
    ano: confirmado(2017, FONTE_JOAO),
    mes: opcional<number>(),
  },
  fundadora: confirmado('Edna Antoniolli', FONTE_JOAO),
  /** Ids do media.manifest.json (originais em media-originais/marca/). Nunca redesenhar. */
  logos: {
    completo: 'marca-logo',
    mono: 'marca-logo-mono',
    selo: 'marca-selo',
    seloMono: 'marca-selo-mono',
    palavra: 'marca-palavra',
    filigrana: 'marca-filigrana',
  },
  ouro: aviso('#AE8C55', 'medido no logo; confirmar o oficial'),
  ouroClaro: aviso('#E2C88C', 'medido no logo (realce da folha); confirmar o oficial'),
  hashtags: confirmado(
    ['#TalentoTodalinda', '#MomentoTodalinda', '#EquipeTodalinda', '#TodaMake'],
    'Instagram @somostodalinda',
  ),
} as const;
