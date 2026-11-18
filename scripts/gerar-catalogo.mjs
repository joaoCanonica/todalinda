// Gera docs/MIDIA_CATALOGO.md a partir de media.manifest.json + public/media/midia.json (pesos medidos).
// Uso: node scripts/gerar-catalogo.mjs   (depois de media:prepare)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname;
const { itens } = JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8'));
const idx = existsSync(join(RAIZ, 'public/media/midia.json'))
  ? JSON.parse(readFileSync(join(RAIZ, 'public/media/midia.json'), 'utf8')).itens
  : {};

const cel = (s) =>
  String(s ?? '—')
    .replace(/\|/g, '/')
    .replace(/\n/g, ' ');
const curto = (a) => {
  const b = basename(a);
  return b.length > 34 ? `${b.slice(0, 20)}…${b.slice(-10)}` : b;
};
const pesoImg = (id) => {
  const d = idx[id];
  if (!d) return '—';
  const a = d.variantes.avif;
  return `${a.map((v) => v.w).join('/')} px · AVIF ${a[0].kb}–${a.at(-1).kb} KB`;
};
const pesoVid = (id, nome) => {
  const t = idx[id]?.trechos?.[nome];
  if (!t) return '—';
  return t.variantes
    .sort((x, y) => y.w - x.w)
    .map((v) => `${v.rotulo}: mp4 ${v.mp4.kb} / webm ${v.webm.kb} KB`)
    .join('<br>');
};
const linhaImg = (i) =>
  `| ${i.escolha ? '★ ' : ''}\`${i.id}\` | ${cel(curto(i.arquivo))} | ${cel(i.pessoa ?? i.tecnica)} | ${cel(i.uso.join(', '))} | ${i.largura}×${i.altura}${i.rotacao ? ` (gira ${i.rotacao}°)` : ''} | ${pesoImg(i.id)} | ${cel([...i.problemas, ...(i.crianca !== 'nao' ? ['⚠ idade a confirmar'] : []), ...(i.confirmarIdentidade ? ['identidade PROVÁVEL'] : []), ...(i.parAntesDepois ? [`par ${i.parAntesDepois.papel} (a confirmar)`] : [])].join(' · ') || '—')} |`;

const grupos = [
  [
    'Resultados de cabelo',
    (i) => i.natureza === 'foto' && i.tecnica && i.tecnica !== T_UNHAS && !i.naoUsar,
  ],
  ['Esmalteria', (i) => i.tecnica === T_UNHAS && i.tipo === 'imagem' && !i.naoUsar],
  [
    'Espaço e equipe',
    (i) => i.tipo === 'imagem' && !i.tecnica && !i.naoUsar && i.natureza !== 'quadro-de-video',
  ],
  ['Quadros de vídeo (stills)', (i) => i.natureza === 'quadro-de-video'],
];
const T_UNHAS = 'esmalteria';

let md = `# Catálogo de mídia

Gerado por \`scripts/gerar-catalogo.mjs\` em ${new Date().toISOString().slice(0, 10)} a partir de \`media.manifest.json\` e dos derivados medidos em \`public/media/midia.json\`.
Folhas de contato: \`docs/capturas/midia/\` (\`01-resultados.jpg\`, \`02-espaco-equipe-quadros.jpg\`, \`03-nao-usar.jpg\`, \`video-*.jpg\`).

- **Itens:** ${itens.length} · publicáveis ${itens.filter((i) => !i.naoUsar).length} · **naoUsar ${itens.filter((i) => i.naoUsar).length}**.
- **Derivados:** imagens em AVIF e WebP nas larguras 480/800/1200/1600/2400 (nunca acima do original), LQIP de 20 px; vídeos mudos em MP4 H.264 + WebM VP9 (720×1280 e 540×960), pôster AVIF, WebVTT nas falas.
- ★ = escolha da curadoria. Pesos: menor–maior variante AVIF.

`;

for (const [titulo, f] of grupos) {
  const lista = itens.filter(f);
  md += `## ${titulo} (${lista.length})\n\n| id | arquivo | pessoa / técnica | uso | original | derivados | problemas |\n|---|---|---|---|---|---|---|\n`;
  md += lista.map(linhaImg).join('\n') + '\n\n';
}

md += `## Vídeos e trechos\n\n| id | arquivo | pessoa / técnica | trecho (s) | uso | pesos | problemas |\n|---|---|---|---|---|---|---|\n`;
for (const v of itens.filter((i) => i.tipo === 'video' && !i.naoUsar)) {
  if (!v.trechos.length) {
    md += `| \`${v.id}\` | ${cel(curto(v.arquivo))} | ${cel(v.pessoa ?? v.tecnica)} | — (só transcrição) | ${cel(v.uso.join(', '))} | — | ${cel(v.problemas.join(' · '))} |\n`;
    continue;
  }
  for (const t of v.trechos) {
    const flags = [
      t.hero && 'loop do hero',
      t.loop && 'loop',
      t.audio && 'com áudio + WebVTT',
      t.referencia && 'referência',
    ]
      .filter(Boolean)
      .join(', ');
    md += `| \`${v.id}\` | ${cel(curto(v.arquivo))} | ${cel(v.pessoa ?? v.tecnica)} | **${t.nome}** ${t.in.toFixed(1)}–${t.out.toFixed(1)}${flags ? ` (${flags})` : ''}${t.nota ? `<br>${cel(t.nota)}` : ''} | ${cel(v.uso.join(', '))} | ${pesoVid(v.id, t.nome)} | ${cel([...v.problemas, ...(v.crianca !== 'nao' ? ['⚠ idade a confirmar'] : [])].join(' · ') || '—')} |\n`;
  }
}

md += `\n## Não usar (${itens.filter((i) => i.naoUsar).length})\n\n| id | arquivo | motivo | texto aproveitado |\n|---|---|---|---|\n`;
md += itens
  .filter((i) => i.naoUsar)
  .map(
    (i) =>
      `| \`${i.id}\` | ${cel(curto(i.arquivo))} | ${cel(i.motivoNaoUsar)} | ${i.textoEm ? `\`${i.textoEm}\`` : '—'} |`,
  )
  .join('\n');

md += `\n\n## Marca (vetores)\n\n${itens
  .filter((i) => i.tipo === 'vetor')
  .map((i) => `- \`${i.arquivo}\`: ${i.descricao}`)
  .join('\n')}\n\nOuro PROVISÓRIO até o manual oficial.\n`;

md += `
## O que pedir à casa (por prioridade)

1. **Fotos do espaço em alta** (manhã com o salão vazio e luz acesa): fachada de dia e no fim da tarde, gramado; recepção (painel de filigrana); bancadas de cabelo; lavatórios; esmalteria; sala de estética; lounge/mezanino; parede de letras "TODALINDA"; detalhes (Truss na prateleira, café). Hoje o espaço só existe em capturas de ~680 px (máx. 480 px no site).
2. **Retratos em alta da equipe**, mesmo fundo e mesma luz: Edna, Dido, Andressa, Isabela, Karine, Thaynara, Marina. Dido, Marina e Thaynara só existem em 150 px; Karine só numa arte com texto.
3. **Originais do filme institucional** (sem música, em resolução maior que 720×1280) e dos vídeos da Edna. Com os originais, dá para tirar loops 16:9 para o hero no desktop.
4. **Planta baixa** (ou medidas) dos dois andares, para o 3D.
5. **Versão horizontal do logo** (a do fim do filme e da fachada) e o manual com o ouro oficial.
6. **Antes e depois confirmados**: par de arquivos e nome da técnica.
7. **Confirmar maioridade** da cliente de 859140964/860153001 (aparelho nos dentes) e da cliente do vídeo de transformação / "iluminada" do filme.
8. **Confirmar identidade** de Isabela (Captura 12-51-36) e Andressa (Captura 12-52-34).
`;

writeFileSync(join(RAIZ, 'docs/MIDIA_CATALOGO.md'), md);
console.log(`catálogo: ${md.split('\n').length} linhas`);
