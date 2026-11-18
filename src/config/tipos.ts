// Estados de um dado do cliente. Dado nunca é inventado: ou tem fonte, ou está pendente.
//  - confirmado: valor com fonte (quem/onde confirmou).
//  - opcional: pode faltar; o site simplesmente não mostra.
//  - bloqueante: falta e bloqueia o RECURSO que depende dele (o código usa um fallback
//    honesto ou esconde o recurso). Só derruba a produção quando é uma trava da seção 9.
//  - aviso: há um valor provisório em uso (selo PROVISÓRIO no preview).

export interface Confirmado<T> {
  readonly estado: 'confirmado';
  readonly valor: T;
  readonly fonte: string;
}
export interface Opcional<T> {
  readonly estado: 'opcional';
  readonly valor: T | null;
}
export interface Bloqueante {
  readonly estado: 'bloqueante';
  readonly valor: null;
  readonly rotulo: string;
}
export interface Aviso<T> {
  readonly estado: 'aviso';
  readonly valor: T;
  readonly motivo: string;
}
export type Campo<T> = Confirmado<T> | Opcional<T> | Bloqueante | Aviso<T>;

export const confirmado = <T>(valor: T, fonte: string): Confirmado<T> => ({
  estado: 'confirmado',
  valor,
  fonte,
});
export const opcional = <T = never>(valor: T | null = null): Opcional<T> => ({
  estado: 'opcional',
  valor,
});
export const bloqueante = (rotulo: string): Bloqueante => ({
  estado: 'bloqueante',
  valor: null,
  rotulo,
});
export const aviso = <T>(valor: T, motivo: string): Aviso<T> => ({
  estado: 'aviso',
  valor,
  motivo,
});

export const ehCampo = (v: unknown): v is Campo<unknown> =>
  typeof v === 'object' &&
  v !== null &&
  'estado' in v &&
  ['confirmado', 'opcional', 'bloqueante', 'aviso'].includes((v as { estado: string }).estado);

/** Valor utilizável agora (confirmado, aviso ou opcional preenchido); null se pendente. */
export const valorDe = <T>(c: Campo<T>): T | null => (c.estado === 'bloqueante' ? null : c.valor);
export const temValor = <T>(c: Campo<T>): boolean => valorDe(c) !== null;

export interface Pendencia {
  caminho: string;
  estado: 'opcional' | 'bloqueante' | 'aviso';
  descricao: string;
}

/** Percorre um objeto de config e lista tudo que não está confirmado. */
export function coletarPendencias(obj: unknown, prefixo = ''): Pendencia[] {
  if (ehCampo(obj)) {
    if (obj.estado === 'confirmado') return [];
    if (obj.estado === 'opcional')
      return obj.valor === null
        ? [{ caminho: prefixo, estado: 'opcional', descricao: 'não informado (o site omite)' }]
        : [];
    if (obj.estado === 'bloqueante')
      return [{ caminho: prefixo, estado: 'bloqueante', descricao: obj.rotulo }];
    return [{ caminho: prefixo, estado: 'aviso', descricao: obj.motivo }];
  }
  if (Array.isArray(obj)) return obj.flatMap((v, i) => coletarPendencias(v, `${prefixo}[${i}]`));
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).flatMap(([k, v]) =>
      coletarPendencias(v, prefixo ? `${prefixo}.${k}` : k),
    );
  }
  return [];
}
