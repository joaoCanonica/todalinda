// Lógica do agendador (sem UI). Monta o pedido e resolve o destino. Nada é guardado.
import { horario } from '../config/horario.ts';
import type { Grupo, IdServico } from '../content/schemas.ts';
import { linkWhatsApp } from './whatsapp.ts';

export type Dia = 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';
export type Periodo = 'manha' | 'tarde' | 'qualquer';

const NUMERO_DIA: Record<Dia | 'domingo' | 'segunda', number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};
const NOME_DIA: Record<Dia, string> = {
  terca: 'terça',
  quarta: 'quarta',
  quinta: 'quinta',
  sexta: 'sexta',
  sabado: 'sábado',
};

/** Dias oferecidos: os dias abertos do horário (ter–sáb). */
export const DIAS: { id: Dia; rotulo: string }[] = (Object.keys(NOME_DIA) as Dia[])
  .filter((d) => horario.semana.valor[NUMERO_DIA[d]])
  .map((d) => ({ id: d, rotulo: NOME_DIA[d] }));

export const PERIODOS: { id: Periodo; rotulo: string; frase: string }[] = [
  { id: 'manha', rotulo: 'Manhã (9h–12h)', frase: 'de manhã' },
  { id: 'tarde', rotulo: 'Tarde (13h–19h)', frase: 'à tarde' },
  { id: 'qualquer', rotulo: 'Qualquer horário', frase: 'em qualquer horário' },
];

export interface ServicoAgenda {
  id: IdServico;
  nome: string;
  grupo: Grupo;
  /** slugs confirmados pela casa; null = pendente (só "Sem preferência") */
  profissionaisConfirmados: string[] | null;
}
export interface ProfissionalAgenda {
  slug: string;
  nome: string;
}
export interface Pedido {
  servico: ServicoAgenda;
  profissional?: ProfissionalAgenda | null;
  dia?: Dia | null;
  periodo?: Periodo | null;
  quimicaRecente?: boolean | null;
  primeiraVez?: boolean | null;
  nome?: string | null;
}

export class ErroAgenda extends Error {}

export const SEM_PREFERENCIA = { slug: null, nome: 'Sem preferência' } as const;

/** Opções de profissional no agendador. Sem confirmação da casa: só "Sem preferência". */
export function opcoesProfissional(
  servico: ServicoAgenda,
  equipe: ProfissionalAgenda[],
): ({ slug: null; nome: string } | ProfissionalAgenda)[] {
  if (!servico.profissionaisConfirmados?.length) return [SEM_PREFERENCIA];
  const confirmados = equipe.filter((m) => servico.profissionaisConfirmados?.includes(m.slug));
  return [SEM_PREFERENCIA, ...confirmados];
}

/** A pergunta sobre química só aparece para cor e mechas. */
export const perguntaQuimica = (s: Pick<ServicoAgenda, 'id' | 'grupo'>): boolean =>
  s.grupo === 'cor' || s.id === 'mechas';

const limparNome = (n: string) =>
  n
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60);

export function montarPedido(p: Pedido): string {
  const { servico } = p;
  if (p.dia && !DIAS.some((d) => d.id === p.dia))
    throw new ErroAgenda(
      `dia indisponível: ${p.dia} (a casa atende ${DIAS.map((d) => d.rotulo).join(', ')})`,
    );
  if (p.periodo && !PERIODOS.some((x) => x.id === p.periodo))
    throw new ErroAgenda(`período inválido: ${p.periodo}`);
  if (p.profissional && !servico.profissionaisConfirmados?.includes(p.profissional.slug)) {
    throw new ErroAgenda(`${p.profissional.nome} não está confirmada(o) para ${servico.nome}`);
  }

  let texto = `Olá! Vim pelo site e quero agendar ${servico.nome}`;
  if (p.profissional) texto += ` com ${p.profissional.nome}`;
  const periodo = PERIODOS.find((x) => x.id === p.periodo);
  if (p.dia && periodo)
    texto +=
      periodo.id === 'qualquer'
        ? `, de preferência ${NOME_DIA[p.dia]}, em qualquer horário`
        : `, de preferência ${NOME_DIA[p.dia]} ${periodo.frase}`;
  else if (p.dia) texto += `, de preferência ${NOME_DIA[p.dia]}`;
  else if (periodo && periodo.id !== 'qualquer') texto += `, de preferência ${periodo.frase}`;
  texto += '.';

  if (perguntaQuimica(servico) && typeof p.quimicaRecente === 'boolean')
    texto += ` Já fiz química nos últimos 6 meses: ${p.quimicaRecente ? 'sim' : 'não'}.`;
  if (p.primeiraVez === true) texto += ' É minha primeira vez na Todalinda.';
  if (p.primeiraVez === false) texto += ' Já sou cliente da Todalinda.';
  const nome = p.nome ? limparNome(p.nome) : '';
  if (nome) texto += ` Meu nome é ${nome}.`;
  return texto;
}

// ---------- destinos (adaptador fase 1 → fase 2) ----------
export type Destino =
  { tipo: 'whatsapp' } | { tipo: 'link-externo'; url: string } | { tipo: 'api'; endpoint: string };

export type Acao =
  | { tipo: 'abrir-url'; url: string }
  | {
      tipo: 'requisicao';
      metodo: 'POST';
      endpoint: string;
      corpo: {
        texto: string;
        servico: IdServico;
        profissional: string | null;
        dia: Dia | null;
        periodo: Periodo | null;
      };
    };

/** Resolve o que fazer com o pedido. Não envia nem guarda nada: quem chama executa a ação. */
export function resolverDestino(p: Pedido, destino: Destino = { tipo: 'whatsapp' }): Acao {
  const texto = montarPedido(p);
  switch (destino.tipo) {
    case 'whatsapp':
      return { tipo: 'abrir-url', url: linkWhatsApp(texto) };
    case 'link-externo': {
      if (!/^https:\/\//.test(destino.url)) throw new ErroAgenda('link externo precisa ser https');
      return { tipo: 'abrir-url', url: destino.url };
    }
    case 'api':
      // Fase 2 (stub): o formato do corpo é o contrato; o envio real nasce com a agenda online.
      if (!/^(https:\/\/|\/)/.test(destino.endpoint)) throw new ErroAgenda('endpoint inválido');
      return {
        tipo: 'requisicao',
        metodo: 'POST',
        endpoint: destino.endpoint,
        corpo: {
          texto,
          servico: p.servico.id,
          profissional: p.profissional?.slug ?? null,
          dia: p.dia ?? null,
          periodo: p.periodo ?? null,
        },
      };
  }
}

/** Converte um registro da coleção "servicos" para o agendador. */
export function paraAgenda(s: {
  id: IdServico;
  nome: string;
  grupo: Grupo;
  profissionais: { estado: string; valor: string[] | null };
}): ServicoAgenda {
  return {
    id: s.id,
    nome: s.nome,
    grupo: s.grupo,
    profissionaisConfirmados:
      s.profissionais.estado === 'confirmado' ? s.profissionais.valor : null,
  };
}
