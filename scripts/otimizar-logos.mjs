// Otimiza os SVG oficiais (media-originais/marca) para uso inline em src/components/marca/svg/.
// SVGO com precisão de 1 casa e sem converter em arcos: render idêntico a 1200 px (conferido na sessão 3).
// Uso: node scripts/otimizar-logos.mjs
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { optimize } from 'svgo';

const RAIZ = new URL('..', import.meta.url).pathname;
const ORIG = join(RAIZ, 'media-originais/marca');
const DEST = join(RAIZ, 'src/components/marca/svg');
for (const f of readdirSync(ORIG).filter((x) => x.endsWith('.svg'))) {
  const bruto = readFileSync(join(ORIG, f), 'utf8');
  const { data } = optimize(bruto, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIds: false,
            cleanupNumericValues: { floatPrecision: 3 },
            convertPathData: { floatPrecision: 1, transformPrecision: 3, makeArcs: false },
          },
        },
      },
      { name: 'removeAttrs', params: { attrs: ['xmlns:c2pa', 'role', 'aria-labelledby'] } },
      'removeTitle',
    ],
  });
  writeFileSync(join(DEST, f), data);
  console.log(`${f}: ${bruto.length} → ${data.length} B (gzip ${gzipSync(data).length} B)`);
}

// Cópias para a abertura (buscadas só quando ela toca): filigrana já em Ouro e o logo completo.
mkdirSync(join(RAIZ, 'public/abertura'), { recursive: true });
const limpar = (s) => s.replace(/\sid="(filigrana|moldura|quadro|texto)"/g, '');
writeFileSync(
  join(RAIZ, 'public/abertura/filigrana.svg'),
  limpar(readFileSync(join(DEST, 'todalinda-filigrana.svg'), 'utf8')).replace(
    /currentColor/g,
    '#AE8C55',
  ),
);
writeFileSync(
  join(RAIZ, 'public/abertura/logo.svg'),
  limpar(readFileSync(join(DEST, 'todalinda-logo.svg'), 'utf8')).replace(
    /tl-folha/g,
    'tl-folha-abertura',
  ),
);
console.log('public/abertura/: filigrana.svg, logo.svg');

// Logo mono em Ouro como arquivo (rodapé): carregado tarde, fora do HTML (o inline pesa 84 KB).
mkdirSync(join(RAIZ, 'public/marca'), { recursive: true });
writeFileSync(
  join(RAIZ, 'public/marca/todalinda-logo-mono-ouro.svg'),
  limpar(readFileSync(join(DEST, 'todalinda-logo-mono.svg'), 'utf8')).replace(
    /currentColor/g,
    '#AE8C55',
  ),
);
console.log('public/marca/todalinda-logo-mono-ouro.svg');
