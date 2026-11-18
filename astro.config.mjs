// @ts-check
import { defineConfig } from 'astro/config';

// Site estático. O domínio definitivo é pendente (docs/PENDENCIAS.md).
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  // CSS embutido no HTML: elimina as idas e voltas de CSS que bloqueiam a 1ª pintura (LCP no 4G)
  build: { format: 'directory', inlineStylesheets: 'always' },
  server: { host: true },
});
