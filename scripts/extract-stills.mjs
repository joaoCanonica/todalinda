// Extrai quadros (stills) dos vídeos, sem upscale, e gera folhas de contato.
// Uso: node scripts/extract-stills.mjs [--folhas]
//  - quadros: media-originais/quadros/<id>.jpg (qualidade 95, resolução nativa do vídeo)
//  - --folhas: docs/capturas/midia/*.jpg (folhas de contato de fotos e vídeos)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url).pathname;
const manifesto = JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8'));
const porId = new Map(manifesto.itens.map((i) => [i.id, i]));
const ff = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args]);

// 1. quadros
mkdirSync(join(RAIZ, 'media-originais/quadros'), { recursive: true });
for (const q of manifesto.itens.filter((i) => i.natureza === 'quadro-de-video')) {
  const destino = join(RAIZ, q.arquivo);
  if (existsSync(destino) && !process.env.FORCAR) continue;
  const video = porId.get(q.origem.video);
  ff([
    '-ss',
    String(q.origem.tempo),
    '-i',
    join(RAIZ, video.arquivo),
    '-frames:v',
    '1',
    '-q:v',
    '1',
    destino,
  ]);
  // regrava com sharp para qualidade previsível (sem redimensionar)
  const buf = await sharp(destino).jpeg({ quality: 95, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(destino);
  console.log(`quadro ${q.id} ← ${video.id} @ ${q.origem.tempo}s`);
}

if (!process.argv.includes('--folhas')) process.exit(0);

// 2. folhas de contato
const PASTA = join(RAIZ, 'docs/capturas/midia');
mkdirSync(PASTA, { recursive: true });
const esc = (s) => s.replace(/[&<>"]/g, '');

async function folha(arquivo, itens, colunas = 8, cel = 220) {
  const alt = Math.round(cel * 1.33) + 34;
  const comp = [];
  for (const [n, it] of itens.entries()) {
    const x = (n % colunas) * cel;
    const y = Math.floor(n / colunas) * alt;
    let img = sharp(join(RAIZ, it.arquivo)).rotate();
    if (it.rotacao) img = img.rotate(it.rotacao);
    const buf = await img
      .resize(cel, alt - 34, { fit: 'contain', background: '#1b1715' })
      .toBuffer();
    comp.push({ input: buf, left: x, top: y });
    const cor = it.naoUsar ? '#b33' : it.escolha ? '#ae8c55' : '#333';
    const rotulo = `${it.naoUsar ? '✕ ' : it.escolha ? '★ ' : ''}${it.id}`;
    const sub = it.naoUsar
      ? 'naoUsar'
      : (it.tecnica ?? it.pessoa ?? it.natureza ?? '').slice(0, 30);
    comp.push({
      input: Buffer.from(
        `<svg width="${cel}" height="34"><rect width="100%" height="100%" fill="${cor}"/><text x="4" y="14" font-size="12" fill="#fff" font-family="sans-serif">${esc(rotulo)}</text><text x="4" y="29" font-size="11" fill="#ddd" font-family="sans-serif">${esc(sub)}</text></svg>`,
      ),
      left: x,
      top: y + alt - 34,
    });
  }
  const linhas = Math.ceil(itens.length / colunas);
  await sharp({
    create: { width: colunas * cel, height: linhas * alt, channels: 3, background: '#111' },
  })
    .composite(comp)
    .jpeg({ quality: 78 })
    .toFile(join(PASTA, arquivo));
  console.log(`folha ${arquivo} (${itens.length})`);
}

const imgs = manifesto.itens.filter((i) => i.tipo === 'imagem');
const grupo = (f) => imgs.filter(f);
await folha(
  '01-resultados.jpg',
  grupo((i) => i.natureza === 'foto' && i.tecnica && !i.naoUsar),
);
await folha(
  '02-espaco-equipe-quadros.jpg',
  grupo((i) => !i.naoUsar && (!i.tecnica || i.natureza !== 'foto')),
);
await folha(
  '03-nao-usar.jpg',
  grupo((i) => i.naoUsar),
);

// vídeos: 16 quadros cada, com tempo
for (const v of manifesto.itens.filter((i) => i.tipo === 'video')) {
  const saida = join(PASTA, `video-${v.id}.jpg`);
  ff([
    '-i',
    join(RAIZ, v.arquivo),
    '-vf',
    `fps=16/${v.duracao},scale=180:-1,drawtext=text='%{pts\\:hms}':x=4:y=4:fontsize=16:fontcolor=white:box=1:boxcolor=black,tile=8x2`,
    '-frames:v',
    '1',
    '-q:v',
    '4',
    saida,
  ]);
  console.log(`folha ${basename(saida)}`);
}
