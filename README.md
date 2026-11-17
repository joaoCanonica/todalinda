# Todalinda · site

Site da Todalinda (Ateliê de Beleza Toda Linda, Lages/SC). Astro estático, TypeScript strict, pnpm.

Contexto completo do projeto: [`CLAUDE.md`](CLAUDE.md) (cópias em `AGENTS.md` e `docs/CONTEXTO.md`).
Pendências: [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).

## Começar

```bash
pnpm install
pnpm dev
```

Node ≥ 22.23.4 (`.nvmrc`), pnpm 10.28 (`packageManager`). Em máquina nova, para capturas: `pnpm exec playwright install chromium`.

## Scripts

| Script                                                         | O quê                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `dev` / `build` / `preview`                                    | Astro                                                                                            |
| `check`                                                        | `astro check` + ESLint + Prettier                                                                |
| `test`                                                         | Vitest                                                                                           |
| `capturar [rotas…]`                                            | build + preview + capturas 390/1440 px, com e sem movimento reduzido, em `docs/capturas/<data>/` |
| `validate-config`, `audit-*`, `media:prepare`, `model:prepare` | marcadores; cada um nasce na sessão indicada no aviso                                            |

## Pastas

- `src/` — `config` (fonte única de dados), `components`, `layouts`, `pages`, `styles`, `scripts`, `content`, `lib`, `tres` (ilha Three.js).
- `scripts/` — ferramentas de build, auditoria e captura.
- `docs/` — investigação, mapa de mídia, prompts, `dados/`, `3d/`, `capturas/`.
- `assets/marca/` — logos SVG oficiais (não redesenhar).
- `assets/`, `videos/` → `media-originais/` (sessão 1). Derivados vão para `public/media/` (fora do git).
- `modelos-originais/` — fontes do 3D. Derivados em `public/modelos/` (fora do git).
