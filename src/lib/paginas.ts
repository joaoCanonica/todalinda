// Apoio das páginas internas (sessão 6C): mídia de cada serviço, legenda dos trabalhos,
// autor de uma fala real e a etiqueta (hashtag real) de cada grupo.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { liberada, provisoria } from '../components/secoes/util.ts';
import { alt, videos } from '../content/textos/midia.ts';
import { F } from '../content/textos/fontes.ts';
import type { Grupo, Servico, Trabalho } from '../content/schemas.ts';
import { imagem } from './midia.ts';

let trechosCache: Record<string, string[]> | null = null;
function trechosDe(id: string): string[] {
  trechosCache ??= Object.fromEntries(
    Object.entries(
      (
        JSON.parse(readFileSync(join(process.cwd(), 'public/media/midia.json'), 'utf8')) as {
          itens: Record<string, { tipo: string; trechos?: Record<string, unknown> }>;
        }
      ).itens,
    ).map(([k, v]) => [k, Object.keys(v.trechos ?? {})]),
  );
  return trechosCache[id] ?? [];
}

export const ehVideo = (id: string) => id.startsWith('v-');

/** Props do <Poster> para um id (imagem ou primeiro trecho do vídeo), ou null se não publicável. */
export function posterDe(
  id: string,
  rotuloVideo = '540x960',
):
  | { imagem: string; alt: string }
  | { video: string; trecho: string; rotulo: string; alt: string }
  | null {
  if (ehVideo(id)) {
    const trecho = trechosDe(id).find((t) => liberada(id, t));
    if (!trecho) return null;
    return { video: id, trecho, rotulo: rotuloVideo, alt: videos[id]?.titulo ?? '' };
  }
  if (!liberada(id)) return null;
  return { imagem: id, alt: alt[id] ?? '' };
}

/**
 * Mídia da matéria de um serviço: a capa é a foto ★ (trabalho em destaque da técnica) ou a primeira
 * imagem publicável; a galeria, as três seguintes. Sem capa = o serviço não gera página.
 */
export function midiaDoServico(s: Servico, trabalhos: Trabalho[]) {
  const destaques = trabalhos.filter((t) => t.tecnica === s.id && t.destaque).map((t) => t.midia);
  const candidatos = [...new Set([...destaques, ...s.midia])];
  // foto primeiro; serviço só com vídeo (mechas) abre com o vídeo mudo em loop
  const capa =
    candidatos.find((id) => !ehVideo(id) && posterDe(id)) ??
    candidatos.find((id) => posterDe(id)) ??
    null;
  const galeria = candidatos.filter((id) => id !== capa && posterDe(id)).slice(0, 3);
  return { capa, galeria };
}

/** Pares antes/depois de uma técnica. Confirmados sempre; os prováveis só no preview (com selo). */
export function paresDe(tecnica: string, trabalhos: Trabalho[], emPreview: boolean) {
  return trabalhos
    .filter((t) => t.tecnica === tecnica && t.parAntesDepois?.papel === 'depois')
    .filter((t) => t.parAntesDepois?.confirmado || emPreview)
    .flatMap((t) => {
      const antes = t.parAntesDepois?.com.find((c) => !ehVideo(c) && liberada(c));
      if (!antes || ehVideo(t.midia) || !liberada(t.midia)) return [];
      return [
        {
          antes,
          depois: t.midia,
          confirmado: Boolean(t.parAntesDepois?.confirmado),
          motivo: provisoria(t.midia) ?? provisoria(antes),
        },
      ];
    });
}

/** Quem disse: o nome vem da fonte da fala (src/content/textos/fontes.ts). */
export function autorDe(fonte: string): string {
  if (fonte === F.dido) return 'Dido Rodrigues';
  if (fonte === F.thaynara) return 'Thaynara Colombo';
  if (fonte.startsWith('Revista')) return 'Edna Antoniolli';
  if (fonte.includes('Edna')) return 'Edna Antoniolli';
  if (fonte === F.parada) return 'Equipe Todalinda';
  return 'Todalinda';
}
/** Onde foi dito, em poucas palavras (a fonte completa fica no código). */
export function ondeDe(fonte: string): string {
  if (fonte.startsWith('Revista')) return 'na revista da casa';
  if (fonte.includes('vídeo')) return 'em vídeo';
  if (fonte.includes('Carrossel')) return 'no Instagram';
  if (fonte === F.parada) return 'parada de equipe, 2026';
  if (fonte === F.manifesto) return 'no Instagram';
  return '';
}
/** Vídeo da fala, quando existe e tem som liberado. */
export function videoDaFala(fonte: string): string | null {
  if (fonte === F.dido) return 'v-dido-loiro';
  if (fonte === F.ednaSonho) return 'v-edna-sonho';
  if (fonte === F.ednaClientes) return 'v-edna-clientes';
  return null;
}

type Hashtag = '#TalentoTodalinda' | '#MomentoTodalinda' | '#EquipeTodalinda' | '#TodaMake';
export const hashtagDo = (grupo: Grupo): Hashtag =>
  grupo === 'festa' ? '#TodaMake' : '#TalentoTodalinda';

/** Pré-carga da capa (AVIF) para o <head>. */
export function preloadDe(id: string, sizes: string) {
  const i = imagem(id);
  return { srcset: i.srcsetAvif, sizes };
}

/** Nome curto da técnica para legendas (Trabalhos e galeria). */
export const NOME_TECNICA: Record<string, string> = {
  'morena-iluminada': 'Morena iluminada',
  loiros: 'Loiros',
  'ruivo-e-cobre': 'Ruivo e cobre',
  'castanho-e-mocha': 'Castanho e mocha',
  mechas: 'Mechas',
  corte: 'Corte',
  tratamentos: 'Tratamentos',
  'penteado-e-make': 'Penteado e make',
  esmalteria: 'Esmalteria',
  'limpeza-de-pele': 'Limpeza de pele',
};
