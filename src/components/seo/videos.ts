// VideoObject dos vídeos com fala (som liberado), com a transcrição do manifesto.
// uploadDate = quando o arquivo entrou neste site (1º commit do original no git): é o que o
// schema.org define ("uploaded to this site"); a data do post no Instagram não está no repositório.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { liberada } from '../secoes/util.ts';
import { videos as textos } from '../../content/textos/midia.ts';
import { video as derivado } from '../../lib/midia.ts';
import { video } from './jsonld.ts';

interface ItemVideo {
  id: string;
  arquivo: string;
  duracao: number;
  texto?: string | null;
  pessoa?: string | null;
  audioLiberado?: boolean;
}
const itens = new Map(
  (
    JSON.parse(readFileSync(join(process.cwd(), 'media.manifest.json'), 'utf8'))
      .itens as ItemVideo[]
  ).map((i) => [i.id, i]),
);
const datas = new Map<string, string>();
function enviadoEm(arquivo: string): string {
  if (!datas.has(arquivo)) {
    let d = '';
    try {
      d =
        execFileSync('git', ['log', '--diff-filter=A', '--format=%cI', '--', arquivo], {
          encoding: 'utf8',
        })
          .trim()
          .split('\n')
          .at(-1) ?? '';
    } catch {
      /* sem git: cai na data do build */
    }
    datas.set(arquivo, d || new Date().toISOString());
  }
  return datas.get(arquivo) as string;
}

export function videoLd(id: string, trecho = 'inteiro') {
  const i = itens.get(id);
  const t = textos[id];
  if (!i || !t || !liberada(id, trecho)) return null;
  const v = derivado(id, trecho, '540x960');
  return video({
    nome: t.titulo,
    descricao: t.descricao,
    thumbnail: v.poster,
    conteudo: v.mp4,
    duracaoS: i.duracao,
    enviadoEm: enviadoEm(i.arquivo),
    ...(i.audioLiberado && i.texto ? { transcricao: i.texto } : {}),
    ...(i.pessoa ? { pessoa: i.pessoa.replace(/\s*\(.*$/, '') } : {}),
  });
}
