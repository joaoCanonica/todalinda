// Destino do agendador (CLAUDE.md, seção 3). Fase 1: WhatsApp. Fase 2: só trocar aqui
// ({ tipo: 'link-externo', url } ou { tipo: 'api', endpoint }); a UI não conhece o destino.
import type { Destino } from '../lib/agenda.ts';
import { confirmado } from './tipos.ts';

export const agenda = {
  destino: confirmado<Destino>({ tipo: 'whatsapp' }, 'fase 1 (CLAUDE.md §3)'),
  /** Quantos dias à frente o agendador oferece. */
  diasAFrente: 14,
} as const;
