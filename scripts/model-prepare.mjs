// Pipeline do 3D (sessão 6B): modelos-originais/ → public/modelos/ (fora do git) + relatório.
// GLB/GLTF: dedup → prune → weld → simplify controlado (Meshopt) → texturas (KTX2 se houver
// `toktx`; senão WebP com sharp) → compressão Meshopt (padrão) ou Draco (--draco).
// Splats (.spz .ply .splat .ksplat .sog): copiados para public/modelos/splats/ com checagem de
// orçamento (≤ 40 MB). Os nós "ambiente:<id>" nunca são fundidos nem renomeados.
// Uso: node scripts/model-prepare.mjs [--draco] [--razao=0.5] [--erro=0.001]
// Orçamento: GLB ≤ 3 MB (CLAUDE.md, seção 4). Relatório: docs/3d/RELATORIO_MODELOS.md.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  draco,
  getSceneVertexCount,
  meshopt,
  prune,
  simplify,
  textureCompress,
  weld,
} from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url).pathname;
const ENTRADA = join(RAIZ, 'modelos-originais');
const SAIDA = join(RAIZ, 'public/modelos');
const RELATORIO = join(RAIZ, 'docs/3d/RELATORIO_MODELOS.md');
const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1] ?? d;
const USAR_DRACO = process.argv.includes('--draco');
const RAZAO = Number(arg('razao', '0.5'));
const ERRO = Number(arg('erro', '0.001'));
const LIMITE_GLB = 3 * 1024 * 1024;
const LIMITE_SPLAT = 40 * 1024 * 1024;
const EXT_SPLAT = new Set(['.spz', '.ply', '.splat', '.ksplat', '.sog']);

const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;
const temToktx = (() => {
  try {
    execFileSync('toktx', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

// decodificadores que o navegador baixa só se o GLB pedir (ver src/tres/glb.ts)
function copiarDecodificadores() {
  const libs = join(RAIZ, 'node_modules/three/examples/jsm/libs');
  for (const [pasta, arquivos] of [
    ['draco/gltf', ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']],
    ['basis', ['basis_transcoder.js', 'basis_transcoder.wasm']],
  ]) {
    const destino = join(SAIDA, pasta.startsWith('draco') ? 'draco' : 'basis');
    mkdirSync(destino, { recursive: true });
    for (const a of arquivos) copyFileSync(join(libs, pasta, a), join(destino, a));
  }
}

function contarTriangulos(doc) {
  let t = 0;
  for (const malha of doc.getRoot().listMeshes())
    for (const p of malha.listPrimitives()) {
      const n = p.getIndices()?.getCount() ?? p.getAttribute('POSITION')?.getCount() ?? 0;
      if (p.getMode() === 4) t += n / 3;
    }
  return Math.round(t);
}

async function prepararGlb(io, arquivo) {
  const entrada = join(ENTRADA, arquivo);
  const doc = await io.read(entrada);
  const antes = {
    bytes: statSync(entrada).size,
    tri: contarTriangulos(doc),
    vert: getSceneVertexCount(
      doc.getRoot().listScenes()[0] ?? doc.getRoot().getDefaultScene(),
      'render',
    ),
  };
  const ambientes = doc
    .getRoot()
    .listNodes()
    .map((n) => n.getName())
    .filter((n) => n.startsWith('ambiente:'));
  const notas = [];
  await doc.transform(
    dedup(),
    prune({ keepLeaves: true }), // mantém nós vazios "ambiente:<id>" (marcadores)
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: RAZAO, error: ERRO }),
  );
  if (doc.getRoot().listTextures().length) {
    if (temToktx)
      notas.push(
        'texturas: KTX2 via toktx (rode `gltf-transform uastc/etc1s` no CLI; ver docs/3d/README.md)',
      );
    else notas.push('texturas: `toktx` ausente → KTX2 pulado; WebP (sharp) no lugar');
    await doc.transform(
      textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048] }),
    );
  }
  if (USAR_DRACO) {
    io.registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule() });
    await doc.transform(draco());
    notas.push('geometria: Draco');
  } else {
    await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    notas.push('geometria: Meshopt');
  }
  const nome = basename(arquivo, extname(arquivo)) + '.glb';
  const saida = join(SAIDA, nome);
  await io.write(saida, doc);
  const depois = { bytes: statSync(saida).size, tri: contarTriangulos(doc) };
  const faltam = ambientes.length === 0 ? ['nenhum nó "ambiente:<id>" (hotspots não acendem)'] : [];
  return {
    nome,
    antes,
    depois,
    ambientes,
    notas: [...notas, ...faltam],
    ok: depois.bytes <= LIMITE_GLB,
  };
}

function prepararSplat(arquivo) {
  const entrada = join(ENTRADA, arquivo);
  const destino = join(SAIDA, 'splats');
  mkdirSync(destino, { recursive: true });
  copyFileSync(entrada, join(destino, arquivo));
  const bytes = statSync(entrada).size;
  const notas = [];
  if (extname(arquivo) === '.ply')
    notas.push('PLY é o maior formato: converter para .spz antes de publicar');
  return { nome: `splats/${arquivo}`, bytes, ok: bytes <= LIMITE_SPLAT, notas };
}

async function main() {
  mkdirSync(ENTRADA, { recursive: true });
  mkdirSync(SAIDA, { recursive: true });
  copiarDecodificadores();
  const arquivos = readdirSync(ENTRADA).filter((f) => !f.startsWith('.'));
  const glbs = arquivos.filter((f) => ['.glb', '.gltf'].includes(extname(f).toLowerCase()));
  const splats = arquivos.filter((f) => EXT_SPLAT.has(extname(f).toLowerCase()));

  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;
  await MeshoptSimplifier.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder,
  });

  const rGlb = [];
  for (const f of glbs) rGlb.push(await prepararGlb(io, f));
  const rSplat = splats.map(prepararSplat);

  const linhas = [
    '# Relatório dos modelos 3D',
    '',
    `Gerado por \`pnpm model:prepare\` em ${new Date().toISOString().slice(0, 10)}. Entrada: \`modelos-originais/\`; saída: \`public/modelos/\` (fora do git).`,
    `Orçamento: GLB ≤ 3 MB; splat ≤ 40 MB (sob demanda). KTX2: ${temToktx ? 'toktx disponível' : '`toktx` não instalado (texturas em WebP)'}.`,
    '',
  ];
  if (!rGlb.length && !rSplat.length)
    linhas.push(
      'Nada a processar: `modelos-originais/` está vazio. O tour usa a maquete esquemática (com selo) até chegar a planta (GLB) ou a captura (splat). Ver `docs/3d/README.md`.',
      '',
    );
  if (rGlb.length) {
    linhas.push(
      '## Maquete (GLB)',
      '',
      '| arquivo | antes | depois | triângulos | ambientes | orçamento | notas |',
      '|---|---|---|---|---|---|---|',
    );
    for (const r of rGlb)
      linhas.push(
        `| ${r.nome} | ${mb(r.antes.bytes)} | ${mb(r.depois.bytes)} | ${r.antes.tri} → ${r.depois.tri} | ${r.ambientes.map((a) => a.slice(9)).join(', ') || '—'} | ${r.ok ? 'ok' : '**acima de 3 MB**'} | ${r.notas.join('; ')} |`,
      );
    linhas.push('');
  }
  if (rSplat.length) {
    linhas.push(
      '## Capturas (splat)',
      '',
      '| arquivo | tamanho | orçamento | notas |',
      '|---|---|---|---|',
    );
    for (const r of rSplat)
      linhas.push(
        `| ${r.nome} | ${mb(r.bytes)} | ${r.ok ? 'ok' : '**acima de 40 MB**'} | ${r.notas.join('; ') || '—'} |`,
      );
    linhas.push('');
  }
  mkdirSync(join(RAIZ, 'docs/3d'), { recursive: true });
  writeFileSync(RELATORIO, linhas.join('\n'));
  console.log(
    `[model-prepare] ${rGlb.length} GLB, ${rSplat.length} splat → ${RELATORIO.replace(RAIZ, '')}`,
  );
  for (const r of rGlb)
    console.log(
      `  ${r.nome}: ${mb(r.antes.bytes)} → ${mb(r.depois.bytes)} · ${r.depois.tri} tri ${r.ok ? '' : '(ACIMA DO ORÇAMENTO)'}`,
    );
  for (const r of rSplat)
    console.log(`  ${r.nome}: ${mb(r.bytes)} ${r.ok ? '' : '(ACIMA DO ORÇAMENTO)'}`);
  if ([...rGlb, ...rSplat].some((r) => !r.ok)) process.exitCode = 1;
}

await main();
