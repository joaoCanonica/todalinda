# Conferência final (sessão 9)

A única passada de normas do projeto (CLAUDE.md §1): CDC/CONAR, LGPD, direito de imagem, regras do Google, procedimentos invasivos e termos vetados. **Nenhuma trava foi afrouxada.** Toda conferência abaixo foi feita no build de 18/11/2026 e é refeita sozinha a cada `pnpm build` (validate-config no pré-build; audit-compliance, audit-seo e conferência do `vercel.json` no pós-build).

---

## 1. O que foi conferido

### CDC e CONAR (publicidade)

| Regra | Como foi conferida | Resultado |
|---|---|---|
| Sem superlativo comparativo na voz da casa ("melhor salão", "o melhor", "a melhor", "número 1", "nº 1", "a maior", "o maior") | `audit-compliance` (lista de `src/config/termos.ts`, com fronteira de palavra) em todo o HTML. Mais uma varredura manual por "melhor/maior/nº 1/líder/único/referência em/mais procurado" no texto publicado e no `llms.txt` | 0 ocorrências na voz da casa. A única ocorrência de "melhor" é "a luz reflete melhor" (a cutícula, em `/tratamentos`), que não é comparação com concorrentes. Elogio forte só aparece em avaliação literal (`data-avaliacao-literal`). |
| Sem preço, promoção, desconto, sorteio, "grátis", brinde | `audit-compliance` + varredura por `R$`, preço, promo, desconto, grát, sorteio, brinde, cupom | 0 ocorrências. "Preço" só aparece como tema da FAQ ("o valor depende do comprimento e do histórico do fio; na avaliação a gente te passa"). O `llms.txt` falava "sem brinde nem desconto" e virou "sem nenhuma recompensa em troca" (sessão 8). Agora o `audit-seo` passa os termos vetados também no `llms.txt` e no `robots.txt`. |
| Sem promessa de resultado ou de saúde (cura, trata queda, alopecia, rejuvenesce, "para sempre", garantia) | `audit-compliance` + varredura manual | 0 promessas. "Para sempre" aparece só na fala literal da Edna ("momentos que vão ficar para sempre na memória"). `/tratamentos` traz o aviso "técnica de salão, não tratamento de saúde; queda pede dermatologista". |
| Frases-clichê vetadas ("sua melhor versão", "transforme seu visual", "realce sua beleza", "Toda Linda Lages") | `audit-compliance` | 0 ocorrências |

### Procedimentos invasivos

Varredura por botox, toxina, preenchimento, agulha, microagulhamento, escleroterapia, harmonização, bioestimulador, injetável, laser e peeling químico: **0 ocorrências**. "Limpeza de pele" segue despublicada (`publicado: false`, sem mídia) e não gera página.

### LGPD

- **Agendador sem coleta.** A mensagem é montada no aparelho; nenhum `fetch` ou `form` envia dados ao site. O destino da fase 1 é só um link `wa.me`. O e2e e a leitura do código (`src/components/agendador/agendador.ts`) confirmam. O nome opcional só entra no texto do WhatsApp.
- **Consentimento real.**
  - "Aceitar" e "Recusar" têm o mesmo tamanho, cor e borda (o e2e mede).
  - Antes do aceite, nenhum request de terceiro: e2e em 8 rotas. Medição (Plausible), mapa (OpenStreetMap) e embeds só carregam depois do aceite.
  - A escolha fica no aparelho e muda em "Preferências de privacidade", no rodapé.
  - Sem JS, nada de terceiro carrega.
- **Medição sem dado pessoal.** Os eventos levam só ids de serviço/profissional e a página de origem. O Plausible não usa cookie.
- **Página `/privacidade`** com a responsável (razão social e CNPJ), agendamento, fotos e vídeos, medição, mapa, links externos e direitos do titular (Lei 13.709/2018).

### Direito de imagem

Autorizado pelo João: clientes do repositório, equipe e influenciadoras.

- **Crianças: nenhuma imagem.**
  - A trava `midia-crianca` (validate-config) e o `audit-compliance` bloqueiam a produção.
  - A mídia com **idade a confirmar** (`crianca: "verificar"`) só aparece no preview, com selo PROVISÓRIO. Em produção as seções escondem essa mídia e a trava impede o build. Hoje são 5 referências: `f-859140964`, `f-860153001` e `v-transformacao`, nas coleções `servicos/morena-iluminada` e `trabalhos`, além do trecho `iluminada` do `v-filme`, usado na capa B de revisão.
- `naoUsar` (retratos de 150 px, duplicatas) nunca é referenciado: trava `midia-naoUsar`.
- Capturas de tela nunca acima de 480 px: trava `captura-480`.
- Edição só global (cor, recorte, rotação, corte de trecho); nenhuma IA generativa (manifesto, campo `edicoes`).

### Google (avaliações e dados estruturados)

- **Sem `AggregateRating` e sem `Review`.** Barrado pelo `audit-compliance` e pelo `audit-seo`, que também valida o JSON-LD contra o vocabulário schema.org 30.1.
- **A nota não aparece no site** (`exibirNota = false`).
- **Avaliação de funcionário fora:** a de "DIDO Rodrigues" (id 1) está excluída e não aparece no HTML.
- **Sem incentivo a avaliar.** O bloco "Sua opinião ajuda outra mulher a nos encontrar" não tem estrelas, nota nem recompensa. `/avaliar` só redireciona. A mensagem pós-atendimento é para **todas** as clientes.
- As citações de avaliações são **literais**, sem emoji, com o primeiro nome e a inicial, selo "Avaliação no Google" e link para a ficha.

### Travas de produção (CLAUDE.md §9): todas ativas

Cada trava foi provada com `--simular`, e cada simulação acrescentou exatamente a trava esperada.

| Trava | Simulação | Disparou |
|---|---|---|
| WhatsApp ausente | `validate-config --simular=whatsapp` | ✓ |
| Mídia `naoUsar` referenciada | `--simular=naoUsar` (config) e `audit-compliance --simular=naoUsar` (HTML) | ✓ ✓ |
| Mídia com criança | `--simular=crianca` | ✓ |
| Captura acima de 480 px | `--simular=captura` (config) e `audit-compliance --simular=captura` | ✓ ✓ |
| Ambiente 3D com layout inventado sem aprovação | `--simular=3d` | ✓ |
| Serviço publicado sem mídia | `--simular=servico` | ✓ |
| Termo vetado no HTML | `audit-compliance --simular=termo` | ✓ |
| AggregateRating | `audit-compliance --simular=nota` | ✓ |

**Atualização de 19/11/2026:** o João informou que as clientes são maiores de idade (vale até que se saiba o contrário). As 6 marcações de "idade a confirmar" viraram `nao`, com essa origem anotada no manifesto e em `scripts/dados/curadoria.mjs`. **Em `MODO=producao`, a produção está liberada: 0 travas.** Todas as simulações continuam disparando. No mesmo dia, ele também aprovou a maquete esquemática (`maqueteEsquematica.aprovadaPeloJoao = true`) e definiu o domínio `todalinda.com.br`.

*Estado em 18/11 (antes da atualização): BLOQUEADO por 5 travas `midia-crianca`* (as mídias com idade a confirmar). O bloqueio está certo: a produção só sai depois que o João confirmar as idades, ou com essas mídias tiradas das coleções.

---

## 2. Deploy

- **Hospedagem:** Vercel, estática.
  - O `vercel.json` é **gerado do build** (`pnpm deploy:headers`) e conferido no pós-build: se ficar desatualizado, o build falha.
  - `cleanUrls` liga e `trailingSlash` desliga, para casar com as URLs canônicas sem barra.
- **Por que o build não roda na Vercel:** o build precisa de ffmpeg (vídeos) e de Chromium (imagens Open Graph). O workflow `.github/workflows/deploy.yml` constrói no GitHub Actions e envia pronto (`vercel build` + `vercel deploy --prebuilt`, CLI 65.9.0 fixada).
  - Segredos no GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
  - Variáveis por ambiente, na Vercel:

| Variável | Preview | Produção |
|---|---|---|
| `PUBLIC_MODO` | `preview` | `producao` |
| `PUBLIC_SITE_URL` | — | o domínio |
| `PUBLIC_INDEXAR` | — | `sim` (só depois da aprovação final) |
| `PUBLIC_GOOGLE_REVIEW_URL` | — | o link "Pedir avaliações" |

- **Preview com noindex**, em três camadas:
  - meta `noindex` (`PUBLIC_MODO=preview`, `indexar` desligado);
  - `X-Robots-Tag` automático da Vercel nas URLs de preview;
  - `robots.txt` sem sitemap.
- **Cabeçalhos:** HSTS e `nosniff` em tudo. Os de documento (CSP e o resto) só nas páginas: nos arquivos estáticos a CSP não serve para nada e custava ~5,6 KB por resposta, o que pesava no LCP.
  - `Content-Security-Policy` **por hash**: 10 scripts inline, 20 blocos de estilo e 68 atributos `style` com SHA-256. Nada de `'unsafe-inline'` e nada de `'unsafe-eval'`. Testada com o servidor local que aplica o `vercel.json` (`scripts/qa/servir.mjs`): **0 violações** em 34 páginas × 2 larguras, incluindo o tour 3D carregado.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains`, em todas as respostas. Sem `preload` até o domínio estar definido.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy`: câmera, microfone, geolocalização, pagamento, sensores e topics desligados; tela cheia só no próprio site.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`.
- **Exceções da CSP (documentadas):**
  - `script-src 'wasm-unsafe-eval'`: os decodificadores do 3D (Meshopt, Draco, Basis/KTX2) e o Spark compilam WebAssembly. Só baixam no `/a-casa`, sob demanda.
  - `worker-src blob:` e `connect-src data: blob:`: esses decodificadores rodam em Workers criados de Blob e leem o WASM embutido.
  - `frame-src https://www.openstreetmap.org`: o mapa, só depois do aceite.
  - `https://plausible.io` em `script-src`/`connect-src`: a medição, só depois do aceite.
  - `style-src 'unsafe-hashes'`: os atributos `style=""` (proporção das fotos e LQIP) entram por hash, não liberados.
- **Cache:**

| Caminho | Política |
|---|---|
| `/_astro/*` (hash no nome) | 1 ano, `immutable` |
| `/media/*` e `/modelos/*` | 1 ano, `immutable`; toda URL leva `?v=<hash do conteúdo>` (gerado pelo `prepare-media` e pelo tour) |
| `/fonts/*` | 30 dias |
| `/og/*` | 1 dia |
| `/avaliar` | `no-store` + `X-Robots-Tag: noindex` |
| `/avaliar/qr` e `/_*` | `noindex` |

- **Brotli para GLB e splat:** a Vercel comprime texto, mas não modelos binários. O GLB sai do `model:prepare` já comprimido em Meshopt (`Content-Type: model/gltf-binary`), e o formato recomendado para splat (`.spz`) já é comprimido por dentro. Brotli por cima rende pouco nesses dois casos. Hoje ainda não há GLB nem splat.

---

## 3. O que depende do João

> Atualizado em 19/11/2026: os itens 1 e 6 estão resolvidos (idades e maquete). Do item 2, o domínio está definido, mas ainda não registrado. O item 3, o link de avaliação, segue pendente: este ambiente não consegue ler o Google Maps. O passo a passo está em `docs/DEPLOY.md`.

1. **Confirmar a idade** das clientes em `f-859140964`, `f-860153001`, `v-transformacao` (e no trecho `iluminada` do filme). Sem isso, a produção não sai, e é assim que deve ser. Se alguma for menor de idade, a mídia sai do manifesto.
2. **Domínio definitivo** (`PUBLIC_SITE_URL`). Libera canonical, sitemap, Plausible e o QR medindo a origem; depois disso, reimprimir os cartões de `/avaliar/qr`.
3. **Link "Pedir avaliações"** do Perfil da Empresa (`PUBLIC_GOOGLE_REVIEW_URL`).
4. **Conta Vercel:**
   - criar o projeto;
   - pôr os 3 segredos no GitHub e as variáveis por ambiente;
   - dizer em qual time publicar. O primeiro deploy de preview pode sair daqui pelo conector, com a sua confirmação.
5. **Teste manual em Safari iOS e Firefox.** Este ambiente só tem Chromium; o roteiro está em `docs/QA.md` §3.
6. **Aprovar a maquete esquemática** do 3D para produção, ou mandar a planta (`docs/3d/README.md`).
7. As pendências que não bloqueiam, com o que o site faz enquanto isso, estão em `docs/PENDENCIAS.md`. As principais:
   - quem faz cada serviço;
   - pares antes e depois;
   - feriados;
   - estacionamento;
   - links do Flipsnack;
   - endereço do Facebook;
   - retratos em alta.
