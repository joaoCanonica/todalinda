// Utilitários das seções da home.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EM_PREVIEW } from '../../config/ambiente.ts';

interface ItemM {
  id: string;
  naoUsar: boolean;
  crianca: 'nao' | 'verificar' | 'sim';
  trechos: { nome: string; crianca?: 'nao' | 'verificar' | 'sim' }[];
  parAntesDepois: { confirmado: boolean } | null;
  confirmarIdentidade?: boolean;
}
let cache: Map<string, ItemM> | null = null;
const manifesto = () =>
  (cache ??= new Map(
    (
      JSON.parse(readFileSync(join(process.cwd(), 'media.manifest.json'), 'utf8')) as {
        itens: ItemM[];
      }
    ).itens.map((i) => [i.id, i]),
  ));

/**
 * A mídia pode aparecer nesta build? Nunca naoUsar nem criança. "Idade a confirmar" só no preview
 * (com selo); em produção a seção usa o fallback, em vez de travar o build.
 */
export function liberada(id: string, trecho?: string): boolean {
  const i = manifesto().get(id);
  if (!i || i.naoUsar || i.crianca === 'sim') return false;
  const t = trecho ? i.trechos.find((x) => x.nome === trecho) : null;
  const crianca = t?.crianca && t.crianca !== 'nao' ? t.crianca : i.crianca;
  if (crianca === 'sim') return false;
  if (crianca === 'verificar') return EM_PREVIEW;
  return true;
}

/** Precisa de selo PROVISÓRIO (idade a confirmar, par não confirmado, identidade provável)? */
export function provisoria(id: string, trecho?: string): string | null {
  const i = manifesto().get(id);
  if (!i) return null;
  const t = trecho ? i.trechos.find((x) => x.nome === trecho) : null;
  if ((t?.crianca ?? i.crianca) === 'verificar')
    return 'idade da cliente a confirmar: não publica em produção';
  if (i.parAntesDepois && !i.parAntesDepois.confirmado)
    return 'par antes e depois provável: confirmar com a casa';
  if (i.confirmarIdentidade) return 'identidade provável: confirmar com a casa';
  return null;
}

export const doisDigitos = (n: number) => String(n).padStart(2, '0');
