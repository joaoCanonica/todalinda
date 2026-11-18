// Travas de produção (CLAUDE.md, seção 9) e verificações da config. Funções puras:
// recebem os dados e devolvem achados; scripts/validate-config.mjs e audit-compliance.mjs decidem a saída.
import { encontrarTermos } from '../config/termos.ts';
import type { Ambiente3D } from '../config/casa3d.ts';

export type Nivel = 'trava' | 'erro' | 'aviso' | 'info';
export interface Achado {
  nivel: Nivel;
  regra: string;
  mensagem: string;
}

export interface ItemManifesto {
  id: string;
  natureza: string;
  naoUsar: boolean;
  crianca: 'nao' | 'verificar' | 'sim';
  resolucaoMax: number | null;
  confirmarIdentidade?: boolean;
  parAntesDepois: { confirmado: boolean } | null;
}

export interface Referencia {
  id: string;
  onde: string;
}

/** Referências de mídia: não existe, naoUsar, criança, identidade a confirmar. */
export function checarMidias(
  refs: Referencia[],
  manifesto: ItemManifesto[],
  modo: 'preview' | 'producao',
): Achado[] {
  const porId = new Map(manifesto.map((i) => [i.id, i]));
  const achados: Achado[] = [];
  for (const r of refs) {
    const i = porId.get(r.id);
    if (!i) {
      achados.push({
        nivel: 'erro',
        regra: 'midia-inexistente',
        mensagem: `${r.onde}: mídia "${r.id}" não existe no manifesto`,
      });
      continue;
    }
    if (i.naoUsar)
      achados.push({
        nivel: 'trava',
        regra: 'midia-naoUsar',
        mensagem: `${r.onde}: mídia "${r.id}" está marcada naoUsar`,
      });
    if (i.crianca === 'sim')
      achados.push({
        nivel: 'trava',
        regra: 'midia-crianca',
        mensagem: `${r.onde}: mídia "${r.id}" tem criança`,
      });
    if (i.crianca === 'verificar') {
      achados.push({
        nivel: modo === 'producao' ? 'trava' : 'aviso',
        regra: 'midia-crianca',
        mensagem: `${r.onde}: mídia "${r.id}" com idade a confirmar (pode ser menor)`,
      });
    }
    if (i.confirmarIdentidade)
      achados.push({
        nivel: 'aviso',
        regra: 'identidade',
        mensagem: `${r.onde}: identidade em "${r.id}" é PROVÁVEL; confirmar`,
      });
  }
  return achados;
}

/** Capturas de tela nunca acima de 480 px. */
export function checarCapturas(manifesto: ItemManifesto[]): Achado[] {
  return manifesto
    .filter(
      (i) => i.natureza === 'captura-de-tela' && !i.naoUsar && (i.resolucaoMax ?? Infinity) > 480,
    )
    .map((i) => ({
      nivel: 'trava' as const,
      regra: 'captura-480',
      mensagem: `captura "${i.id}" com resolucaoMax ${i.resolucaoMax} (> 480 px)`,
    }));
}

/** Ambientes do 3D sem fonte só com aprovação do João. */
export function checar3D(ambientes: Ambiente3D[]): Achado[] {
  return ambientes
    .filter((a) => !a.fonte && !a.aprovadoPeloJoao)
    .map((a) => ({
      nivel: 'trava' as const,
      regra: '3d-inventado',
      mensagem: `ambiente 3D "${a.id}" sem fonte de layout e sem aprovação do João`,
    }));
}

export interface ServicoMin {
  id: string;
  publicado: boolean;
  midia: string[];
  profissionais: { estado: string; valor: string[] | null; sugestao?: string[] };
}

export function checarServicos(servicos: ServicoMin[], slugsEquipe: string[]): Achado[] {
  const achados: Achado[] = [];
  for (const s of servicos) {
    if (s.publicado && s.midia.length === 0)
      achados.push({
        nivel: 'trava',
        regra: 'servico-sem-midia',
        mensagem: `serviço "${s.id}" publicado sem mídia`,
      });
    if (!s.publicado)
      achados.push({
        nivel: 'info',
        regra: 'servico-nao-publicado',
        mensagem: `serviço "${s.id}" não publicado`,
      });
    const citados = [...(s.profissionais.valor ?? []), ...(s.profissionais.sugestao ?? [])];
    for (const p of citados)
      if (!slugsEquipe.includes(p))
        achados.push({
          nivel: 'erro',
          regra: 'profissional-inexistente',
          mensagem: `serviço "${s.id}" cita "${p}", que não está na equipe`,
        });
    if (s.profissionais.estado !== 'confirmado' && s.publicado) {
      achados.push({
        nivel: 'aviso',
        regra: 'quem-faz',
        mensagem: `serviço "${s.id}": quem faz ainda não confirmado (agendador mostra só "Sem preferência")`,
      });
    }
  }
  return achados;
}

export function checarWhatsApp(numero: string | null): Achado[] {
  return numero && /^\d{12,13}$/.test(numero)
    ? []
    : [
        {
          nivel: 'trava',
          regra: 'whatsapp',
          mensagem: 'WhatsApp ausente ou inválido em src/config/contato.ts',
        },
      ];
}

// ---------- HTML (dist) ----------
const decodificar = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)));

/** Texto visível + atributos lidos por gente/robôs (alt, title, aria-label, content). */
export function textoDoHtml(html: string): string {
  const semCodigo = html
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const atributos = [
    ...semCodigo.matchAll(/\s(?:alt|title|aria-label|content|placeholder)="([^"]*)"/gi),
  ]
    .map((m) => m[1])
    .join(' \n ');
  const texto = semCodigo.replace(/<[^>]+>/g, ' ');
  return decodificar(`${texto}\n${atributos}`);
}

const BLOCO_LITERAL =
  /<(blockquote|figure|q|p|div|li)\b[^>]*data-avaliacao-literal[^>]*>[\s\S]*?<\/\1>/gi;

export function checarHtml(
  html: string,
  arquivo: string,
  manifesto: ItemManifesto[],
  modo: 'preview' | 'producao',
): Achado[] {
  const achados: Achado[] = [];
  // termos: superlativo só é tolerado dentro de avaliação literal
  const literais = [...html.matchAll(BLOCO_LITERAL)].map((m) => m[0]);
  const resto = html.replace(BLOCO_LITERAL, ' ');
  const termos = [
    ...encontrarTermos(textoDoHtml(resto)),
    ...literais.flatMap((b) => encontrarTermos(textoDoHtml(b), ['superlativo'])),
  ];
  for (const t of termos)
    achados.push({
      nivel: 'trava',
      regra: 'termo-vetado',
      mensagem: `${arquivo}: "${t.termo}" em "…${t.trecho}…"`,
    });
  if (/AggregateRating/i.test(html))
    achados.push({
      nivel: 'trava',
      regra: 'aggregate-rating',
      mensagem: `${arquivo}: AggregateRating (nota agregada) é proibido`,
    });

  // mídia referenciada no HTML
  const refs = new Map<string, Referencia>();
  for (const m of html.matchAll(/\/media\/img\/([a-z0-9-]+?)-(\d+)\.(?:avif|webp)/g)) {
    const [, id = '', w = '0'] = m;
    refs.set(id, { id, onde: arquivo });
    const item = manifesto.find((i) => i.id === id);
    if (item?.natureza === 'captura-de-tela' && Number(w) > 480)
      achados.push({
        nivel: 'trava',
        regra: 'captura-480',
        mensagem: `${arquivo}: captura "${id}" em ${w} px`,
      });
  }
  for (const m of html.matchAll(/\/media\/video\/([a-z0-9-]+?)--/g))
    refs.set(m[1] ?? '', { id: m[1] ?? '', onde: arquivo });
  achados.push(...checarMidias([...refs.values()], manifesto, modo));
  return achados;
}

/** Saída: em produção, travas e erros derrubam; no preview, só erros (dados inválidos). */
export function deveFalhar(
  achados: Achado[],
  modo: 'preview' | 'producao',
  estrito = false,
): boolean {
  if (achados.some((a) => a.nivel === 'erro')) return true;
  if (modo === 'producao' && achados.some((a) => a.nivel === 'trava')) return true;
  return estrito && achados.some((a) => a.nivel === 'aviso');
}
