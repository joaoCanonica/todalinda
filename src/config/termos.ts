// Termos vetados (CLAUDE.md, seção 8). NUNCA afrouxar sem ordem expressa do João.
// "superlativo" é tolerado só dentro de avaliação literal ([data-avaliacao-literal]).
export type Categoria = 'superlativo' | 'preco' | 'saude' | 'cliche' | 'nome';

export const TERMOS_VETADOS: readonly { termo: string; categoria: Categoria }[] = [
  { termo: 'melhor salão', categoria: 'superlativo' },
  { termo: 'o melhor', categoria: 'superlativo' },
  { termo: 'a melhor', categoria: 'superlativo' },
  { termo: 'número 1', categoria: 'superlativo' },
  { termo: 'nº 1', categoria: 'superlativo' },
  { termo: 'a maior', categoria: 'superlativo' },
  { termo: 'o maior', categoria: 'superlativo' },
  { termo: 'promoção', categoria: 'preco' },
  { termo: 'desconto', categoria: 'preco' },
  { termo: 'grátis', categoria: 'preco' },
  { termo: 'sorteio', categoria: 'preco' },
  { termo: 'cura', categoria: 'saude' },
  { termo: 'curar', categoria: 'saude' },
  { termo: 'trata queda', categoria: 'saude' },
  { termo: 'alopecia', categoria: 'saude' },
  { termo: 'rejuvenesce', categoria: 'saude' },
  { termo: 'sua melhor versão', categoria: 'cliche' },
  { termo: 'transforme seu visual', categoria: 'cliche' },
  { termo: 'realce sua beleza', categoria: 'cliche' },
  { termo: 'Toda Linda Lages', categoria: 'nome' },
];

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Palavra inteira (não casa "cura" em "curadoria" nem "procura"); espaços flexíveis; sem diferenciar maiúsculas.
const REGEX = TERMOS_VETADOS.map((t) => ({
  ...t,
  re: new RegExp(
    `(?<![\\p{L}\\p{N}])${escapar(t.termo).replace(/\s+/g, '\\s+')}(?![\\p{L}\\p{N}])`,
    'giu',
  ),
}));

export interface Ocorrencia {
  termo: string;
  categoria: Categoria;
  trecho: string;
}

export function encontrarTermos(texto: string, ignorar: Categoria[] = []): Ocorrencia[] {
  const achados: Ocorrencia[] = [];
  for (const t of REGEX) {
    if (ignorar.includes(t.categoria)) continue;
    for (const m of texto.matchAll(t.re)) {
      const i = m.index;
      achados.push({
        termo: t.termo,
        categoria: t.categoria,
        trecho: texto.slice(Math.max(0, i - 30), i + m[0].length + 30).replace(/\s+/g, ' '),
      });
    }
  }
  return achados;
}
