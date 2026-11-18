// Otimiza os SVG oficiais (media-originais/marca) para uso inline em src/components/marca/svg/.
// SVGO com precisão de 1 casa e sem converter em arcos: render idêntico a 1200 px (conferido na sessão 3).
// Uso: node scripts/otimizar-logos.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
