# Deploy na Vercel

O build gera os vídeos (ffmpeg) e as imagens de compartilhamento (Chromium), e a Vercel não tem nenhum dos dois. Por isso:

- **quem constrói é o GitHub Actions** (`.github/workflows/deploy.yml`);
- o Actions envia o site pronto para a Vercel (`vercel deploy --prebuilt`);
- o build automático da Vercel pelo Git fica **desligado** no `vercel.json` (`git.deploymentEnabled: false`). Ligado, ele falharia a cada push.

## Uma vez só (≈ 10 min)

1. **Projeto na Vercel.** Crie o projeto: "Add New → Project", importando `joaoCanonica/todalinda`, ou pela CLI com `vercel link`. Framework: Astro. As demais configurações vêm do `vercel.json`.
2. **IDs do projeto.** Em *Settings → General* do projeto, copie o **Project ID**. Em *Settings* do time (ou da conta), copie o **Team ID**.
3. **Token.** Crie um em vercel.com/account/tokens.
4. **Segredos no GitHub.** Em *Settings → Secrets and variables → Actions* do repositório, crie:
   - `VERCEL_TOKEN`: o token;
   - `VERCEL_ORG_ID`: o Team ID;
   - `VERCEL_PROJECT_ID`: o Project ID.
5. **Variáveis na Vercel** (*Settings → Environment Variables*):

   | Variável | Preview | Production |
   |---|---|---|
   | `PUBLIC_MODO` | `preview` | `producao` |
   | `PUBLIC_GOOGLE_REVIEW_URL` | — | o link "Pedir avaliações" (abaixo) |
   | `PUBLIC_INDEXAR` | — | `sim`, **só quando o domínio estiver no ar** |

   O domínio `https://todalinda.com.br` já está na config (`src/config/seo.ts`). `PUBLIC_SITE_URL` só é preciso para testar noutro endereço.
6. **Domínio.** Depois de registrar `todalinda.com.br`, adicione-o em *Settings → Domains* e aponte o DNS como a Vercel indicar. A Vercel emite o certificado sozinha.

## Publicar

- **Produção:** todo push na branch `main` constrói e publica (as travas rodam no build; se alguma falhar, nada é publicado).
- **Preview:** em *Actions → deploy → Run workflow*, escolha `preview`. O preview sai com `noindex`.

Para levar este trabalho à `main`, faça o merge da branch `claude/festive-ramanujan-bnqqrw`.

## O link "Pedir avaliações" (Google)

1. Abra o **Perfil da Empresa** da Todalinda no Google (busque "Todalinda Lages" logado na conta dona da ficha, ou acesse business.google.com).
2. Clique em **"Pedir avaliações"** (ou "Receber mais avaliações").
3. Copie o link (`https://g.page/r/…/review`).
4. Cole em `PUBLIC_GOOGLE_REVIEW_URL` (Production) e publique de novo.

Até lá, `/avaliar` abre a ficha do Google, de onde também dá para avaliar.

## Antes de imprimir o cartão QR

O QR de `/avaliar/qr` aponta para `todalinda.com.br/avaliar?o=qr`. **Só imprima depois que o domínio estiver no ar.** Antes disso, o QR não abre.
