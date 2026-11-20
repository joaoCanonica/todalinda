import { aviso, confirmado } from './tipos.ts';

// Dias: 0 = domingo … 6 = sábado.
export interface Turno {
  abre: string; // "09:00"
  fecha: string; // "19:00"
}

export const horario = {
  fuso: 'America/Sao_Paulo',
  semana: confirmado<Record<number, Turno | null>>(
    {
      0: null,
      1: null,
      2: { abre: '09:00', fecha: '19:00' },
      3: { abre: '09:00', fecha: '19:00' },
      4: { abre: '09:00', fecha: '19:00' },
      5: { abre: '09:00', fecha: '19:00' },
      6: { abre: '09:00', fecha: '19:00' },
    },
    'João (WAXLO), 17/11/2026; a ficha do Google também fecha às 19:00',
  ),
  /** Se a casa fecha nos feriados abaixo. Presumido até a casa confirmar. */
  fechaNosFeriados: aviso(
    true,
    'João, 20/11/2026: a casa costuma fechar nos feriados, mas pode abrir com alta demanda; o site manda conferir pelo WhatsApp',
  ),
  /** Avisa "Fecha em N min" quando faltar isso ou menos. */
  avisoFechamentoMin: 30,
} as const;

export type Esfera = 'nacional' | 'estadual' | 'municipal';
export interface Feriado {
  data: string; // AAAA-MM-DD
  nome: string;
  esfera: Esfera;
  fonte: string;
}

const FIXOS: { md: string; nome: string; esfera: Esfera; fonte: string }[] = [
  { md: '01-01', nome: 'Confraternização Universal', esfera: 'nacional', fonte: 'Lei 662/1949' },
  { md: '04-21', nome: 'Tiradentes', esfera: 'nacional', fonte: 'Lei 662/1949' },
  { md: '05-01', nome: 'Dia do Trabalho', esfera: 'nacional', fonte: 'Lei 662/1949' },
  { md: '09-07', nome: 'Independência do Brasil', esfera: 'nacional', fonte: 'Lei 662/1949' },
  { md: '10-12', nome: 'Nossa Senhora Aparecida', esfera: 'nacional', fonte: 'Lei 6.802/1980' },
  {
    md: '11-02',
    nome: 'Finados',
    esfera: 'nacional',
    fonte: 'Lei 662/1949 (red. Lei 10.607/2002)',
  },
  { md: '11-15', nome: 'Proclamação da República', esfera: 'nacional', fonte: 'Lei 662/1949' },
  {
    md: '11-20',
    nome: 'Dia Nacional de Zumbi e da Consciência Negra',
    esfera: 'nacional',
    fonte: 'Lei 14.759/2023',
  },
  {
    md: '11-22',
    nome: 'Aniversário de Lages',
    esfera: 'municipal',
    fonte:
      'calendários de feriados de Lages (proximoferiado.net, consultado em 18/11/2026); lei municipal não localizada: confirmar',
  },
  { md: '12-25', nome: 'Natal', esfera: 'nacional', fonte: 'Lei 662/1949' },
];

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher), como AAAA-MM-DD. */
export function pascoa(ano: number): string {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

const somarDias = (iso: string, n: number): string => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function feriadosDoAno(ano: number): Feriado[] {
  const lista: Feriado[] = FIXOS.map((f) => ({
    data: `${ano}-${f.md}`,
    nome: f.nome,
    esfera: f.esfera,
    fonte: f.fonte,
  }));
  lista.push({
    data: somarDias(pascoa(ano), -2),
    nome: 'Sexta-feira da Paixão',
    esfera: 'nacional',
    fonte: 'feriado religioso (Lei 9.093/1995); data pela Páscoa',
  });
  return lista.sort((x, y) => x.data.localeCompare(y.data));
}

/** Feriados em que a casa (presumidamente) fecha. Pontos facultativos (Carnaval, Corpus Christi) não fecham. */
export const feriados: Feriado[] = [2026, 2027, 2028].flatMap(feriadosDoAno);
