# Deploy na Vercel

O build roda na própria Vercel (integração com o GitHub): todo push na `main` constrói e publica em produção, e as outras branches viram preview.

- **Vídeos:** a Vercel não tem ffmpeg. O build usa o do pacote `ffmpeg-static`, que vem no `pnpm install`.
- **Imagens de compartilhamento (OG):** são compostas sem navegador (fontes da casa em vetor pelo `fontkit` + `sharp`).
- **Node:** 22.x, fixado no `package.json` (`engines`) e no projeto da Vercel.
- **Cache:** os derivados de mídia (AVIF/WebP/MP4/WebM) ficam guardados no cache de build da Vercel (`node_modules/.cache/todalinda/media`). Só o primeiro build gera tudo do zero e é longo (ver PENDENCIAS). Os seguintes reaproveitam o que não mudou.
- **Travas:** rodam no build (validate-config, audit-compliance, audit-seo, conferência do `vercel.json`). Se alguma falhar, o deploy falha e nada é publicado.
- **Ação manual:** o workflow `.github/workflows/deploy.yml` ficou só manual (*Actions → deploy → Run workflow*). É o caminho alternativo, se um dia o build da Vercel não der conta.

## Configuração do projeto na Vercel (já feita em 19/11/2026)

| Item | Valor |
|---|---|
| Framework | Astro (o resto vem do `vercel.json`) |
| Node.js Version | 22.x |
| `PUBLIC_MODO` | `producao` (Production) · `preview` (Preview e Development) |

Ainda falta:

| Variável | Ambiente | Valor |
|---|---|---|
| `PUBLIC_GOOGLE_REVIEW_URL` | Production | o link "Pedir avaliações" (abaixo) |
| `PUBLIC_INDEXAR` | Production | `sim`, **só quando o domínio estiver no ar** |

O domínio `https://todalinda.com.br` já está na config (`src/config/seo.ts`). `PUBLIC_SITE_URL` só é preciso para testar noutro endereço.

**Domínio.** Depois de registrar `todalinda.com.br`, adicione-o em *Settings → Domains* e aponte o DNS como a Vercel indicar. A Vercel emite o certificado sozinha.

**Endereço `.vercel.app`.** O projeto está com *Deployment Protection* (Vercel Authentication): o endereço `.vercel.app` só abre para quem está logado no time. Com o domínio próprio, o site abre para todos. Para mostrar antes disso, desligue a proteção em *Settings → Deployment Protection* ou gere um link de compartilhamento.

## Publicar

- **Produção:** push (ou merge) na `main`. Para levar este trabalho à `main`, faça o merge da branch `claude/festive-ramanujan-bnqqrw`.
- **Preview:** push em qualquer outra branch. O preview sai com `noindex` e a faixa "em revisão".
- **Refazer um deploy que falhou:** *Deployments → … → Redeploy*. Use um commit novo da `main`, não o deploy antigo, que é do código antigo.

## O link "Pedir avaliações" (Google)

1. Abra o **Perfil da Empresa** da Todalinda no Google (busque "Todalinda Lages" logado na conta dona da ficha, ou acesse business.google.com).
2. Clique em **"Pedir avaliações"** (ou "Receber mais avaliações").
3. Copie o link (`https://g.page/r/…/review`).
4. Cole em `PUBLIC_GOOGLE_REVIEW_URL` (Production) e publique de novo.

Até lá, `/avaliar` abre a ficha do Google, de onde também dá para avaliar.

## Antes de imprimir o cartão QR

O QR de `/avaliar/qr` aponta para `todalinda.com.br/avaliar?o=qr`. **Só imprima depois que o domínio estiver no ar.** Antes disso, o QR não abre.
