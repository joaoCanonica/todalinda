// Lê o índice gerado por scripts/prepare-media.mjs (public/media/midia.json) no build.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Variante {
  w: number;
  src: string;
  kb: number;
}
interface ImagemIdx {
  tipo: 'imagem';
  natureza: string;
  largura: number;
  altura: number;
  proporcao: number;
  lqip: string;
  variantes: { avif: Variante[]; webp: Variante[] };
  bloqueio?: string;
}
interface VarianteVideo {
  rotulo: string;
  w: number;
  h: number;
  mp4: { src: string; kb: number };
  webm: { src: string; kb: number };
  poster: { src: string; kb: number };
}
interface TrechoIdx {
  in: number;
  out: number;
  duracao: number;
  loop: boolean;
  audio: boolean;
  variantes: VarianteVideo[];
  legenda?: string;
}
interface VideoIdx {
  tipo: 'video';
  trechos: Record<string, TrechoIdx>;
  bloqueio?: string;
}

let cache: Record<string, ImagemIdx | VideoIdx> | null = null;
function indice(): Record<string, ImagemIdx | VideoIdx> {
  if (cache) return cache;
  const p = join(process.cwd(), 'public/media/midia.json');
  if (!existsSync(p)) throw new Error('public/media/midia.json ausente: rode `pnpm media:prepare`');
  cache = (JSON.parse(readFileSync(p, 'utf8')) as { itens: Record<string, ImagemIdx | VideoIdx> })
    .itens;
  return cache;
}

export interface Imagem {
  id: string;
  src: string; // maior WebP (fallback)
  srcsetAvif: string;
  srcsetWebp: string;
  largura: number;
  altura: number;
  lqip: string;
  bloqueio?: string;
}

export function imagem(id: string): Imagem {
  const i = indice()[id];
  if (!i || i.tipo !== 'imagem')
    throw new Error(`imagem "${id}" não está nos derivados (naoUsar? id errado?)`);
  const ss = (v: Variante[]) => v.map((x) => `${x.src} ${x.w}w`).join(', ');
  const maior = i.variantes.webp.at(-1);
  return {
    id,
    src: maior?.src ?? '',
    srcsetAvif: ss(i.variantes.avif),
    srcsetWebp: ss(i.variantes.webp),
    largura: i.largura,
    altura: i.altura,
    lqip: i.lqip,
    ...(i.bloqueio ? { bloqueio: i.bloqueio } : {}),
  };
}

export interface Video {
  id: string;
  trecho: string;
  w: number;
  h: number;
  mp4: string;
  webm: string;
  poster: string;
  loop: boolean;
  audio: boolean;
  legenda?: string;
  bloqueio?: string;
}

/** Variante de vídeo: rótulo "720x1280", "540x960", "720x900-4x5"… */
export function video(id: string, trecho: string, rotulo = '720x1280'): Video {
  const v = indice()[id];
  if (!v || v.tipo !== 'video') throw new Error(`vídeo "${id}" não está nos derivados`);
  const t = v.trechos[trecho];
  const varr = t?.variantes.find((x) => x.rotulo === rotulo);
  if (!t || !varr) throw new Error(`vídeo "${id}/${trecho}/${rotulo}" não existe`);
  return {
    id,
    trecho,
    w: varr.w,
    h: varr.h,
    mp4: varr.mp4.src,
    webm: varr.webm.src,
    poster: varr.poster.src,
    loop: t.loop,
    audio: t.audio,
    ...(t.legenda ? { legenda: t.legenda } : {}),
    ...(v.bloqueio ? { bloqueio: v.bloqueio } : {}),
  };
}
