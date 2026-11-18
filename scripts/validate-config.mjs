// Valida a config, as coleções e as travas de produção (CLAUDE.md, seção 9).
// Uso: node scripts/validate-config.mjs [--simular=<trava>]
//   MODO=producao  → travas derrubam (saída 1). Padrão: preview (só dados inválidos derrubam).
//   ESTRITO=1      → avisos também derrubam.
//   --simular=whatsapp|naoUsar|crianca|captura|3d|servico  → injeta a falha (para provar a trava).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MODO } from '../src/config/ambiente.ts';
import { maqueteEsquematica } from '../src/config/casa3d.ts';
import { contato } from '../src/config/contato.ts';
import { pendencias } from '../src/config/index.ts';
import { marca } from '../src/config/marca.ts';
import { valorDe } from '../src/config/tipos.ts';
import {
  ambienteSchema,
  equipeSchema,
  servicoSchema,
  trabalhoSchema,
} from '../src/content/schemas.ts';
import {
  checar3D,
  checarCapturas,
  checarMidias,
  checarServicos,
  checarWhatsApp,
  deveFalhar,
} from '../src/lib/travas.ts';

const RAIZ = new URL('..', import.meta.url).pathname;
const simular = process.argv.find((a) => a.startsWith('--simular='))?.split('=')[1] ?? null;
const lerJson = (p) => JSON.parse(readFileSync(join(RAIZ, p), 'utf8'));
const lerColecao = (nome) =>
  readdirSync(join(RAIZ, 'src/content', nome))
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      arquivo: `src/content/${nome}/${f}`,
      dados: lerJson(`src/content/${nome}/${f}`),
    }));

const achados = [];
const manifesto = lerJson('media.manifest.json').itens;

// 1. coleções pelo schema
const validar = (nome, schema) =>
  lerColecao(nome).flatMap(({ arquivo, dados }) => {
    const r = schema.safeParse(dados);
    if (!r.success) {
      for (const e of r.error.issues)
        achados.push({
          nivel: 'erro',
          regra: 'schema',
          mensagem: `${arquivo}: ${e.path.join('.')} ${e.message}`,
        });
      return [];
    }
    return [{ arquivo, dados: r.data }];
  });
const equipe = validar('equipe', equipeSchema);
const servicos = validar('servicos', servicoSchema);
const trabalhos = validar('trabalhos', trabalhoSchema);
const ambientesCol = validar('ambientes', ambienteSchema);

// simulações (só em memória)
let numero = valorDe(contato.whatsapp);
// 3D: com GLB, cada ambiente precisa de fonte (planta/captura/foto); sem GLB, a esquemática
// só aparece em produção com a aprovação do João (que cobre os ambientes "pendente").
const temGlb = existsSync(join(RAIZ, 'public/modelos/maquete.glb'));
let exibe3D = temGlb || maqueteEsquematica.aprovadaPeloJoao;
let ambientes = ambientesCol.map(({ dados: a }) => ({
  id: a.id,
  nome: a.nome,
  fonte: a.fonteLayout === 'pendente' ? null : a.fonteLayout,
  aprovadoPeloJoao: !temGlb && maqueteEsquematica.aprovadaPeloJoao,
}));
const manifestoSim = manifesto.map((i) => ({ ...i }));
if (simular === 'whatsapp') numero = null;
if (simular === 'naoUsar')
  trabalhos.push({
    arquivo: '(simulado)',
    dados: { midia: 'eq-dido-150', tecnica: 'corte', destaque: false, parAntesDepois: null },
  });
if (simular === 'crianca') manifestoSim.find((i) => i.id === 'f-749143529').crianca = 'sim';
if (simular === 'captura') manifestoSim.find((i) => i.id === 'cap-12-24-16').resolucaoMax = 682;
if (simular === '3d') {
  exibe3D = true;
  ambientes = [{ id: 'mezanino', nome: 'Mezanino', fonte: null, aprovadoPeloJoao: false }];
}
if (simular === 'servico')
  servicos.push({
    arquivo: '(simulado)',
    dados: {
      id: 'tratamentos',
      publicado: true,
      midia: [],
      profissionais: { estado: 'bloqueante', valor: null, sugestao: [] },
    },
  });

// 2. travas
const slugs = equipe.map((e) => e.dados.slug);
achados.push(...checarWhatsApp(numero));
achados.push(
  ...checarServicos(
    servicos.map((s) => s.dados),
    slugs,
  ),
);
achados.push(...checarCapturas(manifestoSim));
achados.push(...checar3D(ambientes, exibe3D));

// 3. referências de mídia (só do que pode ser publicado)
const refs = [
  ...Object.entries(marca.logos).map(([k, id]) => ({ id, onde: `marca.logos.${k}` })),
  ...equipe.filter((e) => e.dados.foto).map((e) => ({ id: e.dados.foto, onde: e.arquivo })),
  ...servicos
    .filter((s) => s.dados.publicado)
    .flatMap((s) => s.dados.midia.map((id) => ({ id, onde: s.arquivo }))),
  ...trabalhos.flatMap((t) => [
    { id: t.dados.midia, onde: t.arquivo },
    ...(t.dados.parAntesDepois?.com ?? []).map((id) => ({ id, onde: `${t.arquivo} (par)` })),
  ]),
  ...ambientesCol.flatMap((a) => a.dados.midia.map((id) => ({ id, onde: a.arquivo }))),
];
achados.push(...checarMidias(refs, manifestoSim, MODO));
for (const t of trabalhos) {
  if (t.dados.profissional && !slugs.includes(t.dados.profissional))
    achados.push({
      nivel: 'erro',
      regra: 'profissional-inexistente',
      mensagem: `${t.arquivo}: "${t.dados.profissional}"`,
    });
  if (t.dados.parAntesDepois && !t.dados.parAntesDepois.confirmado)
    achados.push({
      nivel: 'aviso',
      regra: 'antes-depois',
      mensagem: `${t.arquivo}: par antes/depois não confirmado`,
    });
}
for (const e of equipe)
  if (!e.dados.foto)
    achados.push({
      nivel: 'info',
      regra: 'retrato',
      mensagem: `${e.dados.nome}: sem retrato (cartão tipográfico)`,
    });

// 4. pendências da config
for (const p of pendencias())
  achados.push({
    nivel: p.estado === 'bloqueante' ? 'aviso' : 'info',
    regra: `pendencia-${p.estado}`,
    mensagem: `${p.caminho}: ${p.descricao}`,
  });

// relatório
const ordem = { trava: 0, erro: 1, aviso: 2, info: 3 };
const contagem = (n) => achados.filter((a) => a.nivel === n).length;
const unicos = [...new Map(achados.map((a) => [`${a.nivel}|${a.mensagem}`, a])).values()].sort(
  (a, b) => ordem[a.nivel] - ordem[b.nivel],
);
const verboso = process.argv.includes('--tudo');
console.log(`[validate-config] modo ${MODO}${simular ? ` · simulando "${simular}"` : ''}`);
for (const a of unicos) {
  if (a.nivel === 'info' && !verboso) continue;
  if (a.nivel === 'aviso' && !verboso && a.regra === 'antes-depois') continue;
  console.log(`  ${a.nivel.toUpperCase().padEnd(5)} ${a.regra}: ${a.mensagem}`);
}
console.log(
  `  → ${contagem('trava')} trava(s), ${contagem('erro')} erro(s), ${contagem('aviso')} aviso(s), ${contagem('info')} info (--tudo mostra todos)`,
);
const falha = deveFalhar(achados, MODO, process.env.ESTRITO === '1');
console.log(
  falha
    ? '  ✗ BLOQUEADO'
    : MODO === 'producao'
      ? '  ✓ produção liberada'
      : '  ✓ preview liberado (com pendências)',
);
process.exit(falha ? 1 : 0);
