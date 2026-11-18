import {
  feriados as feriadosConfig,
  horario,
  type Feriado,
  type Turno,
} from '../config/horario.ts';

export interface Status {
  aberto: boolean;
  texto: string;
  /** minutos até fechar (aberto) ou até abrir (fechado) */
  minutos: number;
  feriado?: Feriado;
}

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

interface Local {
  iso: string; // AAAA-MM-DD
  diaSemana: number;
  minuto: number; // minutos desde 00:00
}

/** Data/hora de parede no fuso da casa. */
export function local(data: Date, fuso = horario.fuso): Local {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: fuso,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      weekday: 'short',
    })
      .formatToParts(data)
      .map((x) => [x.type, x.value]),
  );
  const dias: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    iso: `${p.year}-${p.month}-${p.day}`,
    diaSemana: dias[p.weekday ?? ''] ?? 0,
    minuto: Number(p.hour) * 60 + Number(p.minute),
  };
}

const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
const fmtHora = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};
const proximoDia = (iso: string, n = 1) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return { iso: d.toISOString().slice(0, 10), diaSemana: d.getUTCDay() };
};

export interface Opcoes {
  semana?: Record<number, Turno | null>;
  feriados?: Feriado[];
  fechaNosFeriados?: boolean;
}

export function turnoDoDia(
  iso: string,
  diaSemana: number,
  o: Required<Opcoes>,
): { turno: Turno | null; feriado?: Feriado } {
  const feriado = o.feriados.find((f) => f.data === iso);
  if (feriado && o.fechaNosFeriados) return { turno: null, feriado };
  return { turno: o.semana[diaSemana] ?? null };
}

/** Status de funcionamento num instante. Textos curtos, prontos para a interface. */
export function statusEm(data: Date, opcoes: Opcoes = {}): Status {
  const o: Required<Opcoes> = {
    semana: opcoes.semana ?? horario.semana.valor,
    feriados: opcoes.feriados ?? feriadosConfig,
    fechaNosFeriados: opcoes.fechaNosFeriados ?? horario.fechaNosFeriados.valor,
  };
  const agora = local(data);
  const hoje = turnoDoDia(agora.iso, agora.diaSemana, o);

  if (hoje.turno) {
    const abre = paraMin(hoje.turno.abre);
    const fecha = paraMin(hoje.turno.fecha);
    if (agora.minuto >= abre && agora.minuto < fecha) {
      const resta = fecha - agora.minuto;
      return resta <= horario.avisoFechamentoMin
        ? { aberto: true, texto: `Fecha em ${resta} min`, minutos: resta }
        : {
            aberto: true,
            texto: `Aberto agora · até ${fmtHora(hoje.turno.fecha)}`,
            minutos: resta,
          };
    }
    if (agora.minuto < abre) {
      return {
        aberto: false,
        texto: `Fechado · abre hoje às ${fmtHora(hoje.turno.abre)}`,
        minutos: abre - agora.minuto,
      };
    }
  }

  const prefixo = hoje.feriado ? `Fechado · feriado (${hoje.feriado.nome})` : 'Fechado';
  for (let n = 1; n <= 14; n++) {
    const dia = proximoDia(agora.iso, n);
    const { turno } = turnoDoDia(dia.iso, dia.diaSemana, o);
    if (!turno) continue;
    const quando =
      n === 1
        ? 'amanhã'
        : n <= 6
          ? DIAS[dia.diaSemana]
          : `dia ${dia.iso.slice(8, 10)}/${dia.iso.slice(5, 7)}`;
    const minutos = n * 1440 - agora.minuto + paraMin(turno.abre);
    return {
      aberto: false,
      texto: `${prefixo} · abre ${quando} às ${fmtHora(turno.abre)}`,
      minutos,
      ...(hoje.feriado ? { feriado: hoje.feriado } : {}),
    };
  }
  return { aberto: false, texto: prefixo, minutos: Infinity };
}

/** Texto fixo do horário ("ter–sáb · 9h–19h"), para rodapé e páginas. */
export function horarioResumo(semana = horario.semana.valor): string {
  const abertos = [0, 1, 2, 3, 4, 5, 6].filter((d) => semana[d]);
  const curto = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const t = semana[abertos[0] ?? 2];
  if (!t || !abertos.length) return '';
  return `${curto[abertos[0] ?? 0]}–${curto[abertos.at(-1) ?? 0]} · ${fmtHora(t.abre)}–${fmtHora(t.fecha)}`;
}
