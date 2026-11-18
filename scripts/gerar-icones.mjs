// Favicon (SVG + PNG 32) e apple-touch-icon (180) a partir do selo oficial.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url).pathname;
const selo = readFileSync(join(RAIZ, 'src/components/marca/svg/todalinda-selo.svg'), 'utf8');
writeFileSync(join(RAIZ, 'public/favicon.svg'), selo);
const NOITE = '#121013';
await sharp(Buffer.from(selo), { density: 300 })
  .resize(32, 32, { fit: 'contain', background: NOITE })
  .flatten({ background: NOITE })
  .png()
  .toFile(join(RAIZ, 'public/favicon-32.png'));
// apple-touch: selo sobre Noite com respiro (o iOS arredonda os cantos)
const interno = await sharp(Buffer.from(selo), { density: 600 }).resize(132, 132).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: NOITE } })
  .composite([{ input: interno, gravity: 'center' }])
  .png()
  .toFile(join(RAIZ, 'public/apple-touch-icon.png'));
console.log('ícones: favicon.svg, favicon-32.png, apple-touch-icon.png');
