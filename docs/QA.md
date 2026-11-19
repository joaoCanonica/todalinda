# QA final (sessão 9)

Medido em 18/11/2026, sobre o build final, servido por `scripts/qa/servir.mjs`. Esse servidor imita a Vercel: `cleanUrls`, sem barra no fim, os cabeçalhos do `vercel.json` (CSP inclusive) e brotli no texto. Os dados brutos estão em `docs/qa/*.json` e as capturas em `docs/capturas/2026-11-18/qa/`. Para refazer:

```bash
pnpm build
```

```bash
pnpm qa:servir
```

E, com o servidor no ar, em outro terminal:

```bash
BASE=http://127.0.0.1:4370 pnpm qa:lighthouse
```

```bash
pnpm qa:a11y
```

```bash
node scripts/qa/desempenho.mjs
```

```bash
node scripts/qa/pesos.mjs
```

```bash
node scripts/qa/navegadores.mjs
```

```bash
pnpm test:e2e
```

**Limites deste ambiente** (ditos uma vez, valem para tudo abaixo):

- só há Chromium: WebKit (Safari) e Firefox não podem ser instalados aqui;
- não há GPU: o WebGL roda por software (SwiftShader);
- não há rede externa: os validadores do Google e do schema.org, o Plausible e o OpenStreetMap ficam para o preview publicado.

---

## 1. Desempenho

### Lighthouse mobile, todas as rotas

Configuração: Moto G Power emulado, 4G simulada (Lantern). O build é o "como produção": domínio de exemplo e `PUBLIC_INDEXAR=sim`, para o SEO contar.

| Rota | Perf. | Acess. | Boas pr. | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 2,18 s | 0,001 | 22 ms |
| `/404` | 100 | 100 | 100 | 69 | 0,77 s | 0 | 22 ms |
| `/a-casa` | 98 | 100 | 100 | 100 | 0,8 s | 0,008 | 169 ms |
| `/agendar` | 100 | 100 | 100 | 100 | 0,8 s | 0,015 | 4 ms |
| `/avaliar/qr` | 100 | 100 | 100 | 63 | 0,66 s | 0,005 | 0 ms |
| `/como-chegar` | 100 | 100 | 100 | 100 | 0,79 s | 0,006 | 16 ms |
| `/dois-reais-ou-um-cabelo` | 100 | 100 | 100 | 100 | 0,79 s | 0 | 0 ms |
| `/equipe` | 100 | 100 | 100 | 100 | 0,8 s | 0,007 | 0 ms |
| `/equipe/andressa-savaris` | 99 | 100 | 100 | 100 | 2,03 s | 0 | 0 ms |
| `/equipe/dido-rodrigues` | 100 | 100 | 100 | 100 | 0,78 s | 0 | 0 ms |
| `/equipe/edna-antoniolli` | 99 | 100 | 100 | 100 | 2,03 s | 0 | 40 ms |
| `/equipe/isabela-cristina` | 99 | 100 | 100 | 100 | 2,03 s | 0 | 0 ms |
| `/equipe/karine` | 100 | 100 | 100 | 100 | 0,8 s | 0 | 51 ms |
| `/equipe/marina-schpanski` | 100 | 100 | 100 | 100 | 0,78 s | 0 | 0 ms |
| `/equipe/thaynara-colombo` | 99 | 100 | 100 | 100 | 0,78 s | 0 | 99 ms |
| `/nossa-historia` | 100 | 100 | 100 | 100 | 0,84 s | 0 | 0 ms |
| `/perguntas-frequentes` | 100 | 100 | 100 | 100 | 1,88 s | 0,007 | 0 ms |
| `/privacidade` | 100 | 100 | 100 | 100 | 0,83 s | 0,007 | 0 ms |
| `/revista` | 100 | 100 | 100 | 100 | 1,88 s | 0,007 | 0 ms |
| `/servicos/castanho-e-mocha` | 100 | 100 | 100 | 100 | 0,8 s | 0,007 | 0 ms |
| `/servicos/corte` | 97 | 100 | 100 | 100 | 2,25 s | 0,007 | 128 ms |
| `/servicos/esmalteria` | 99 | 100 | 100 | 100 | 2,18 s | 0,007 | 2 ms |
| `/servicos/loiros` | 96 | 100 | 100 | 100 | 2,25 s | 0,007 | 187 ms |
| `/servicos/mechas` | 100 | 100 | 100 | 100 | 0,8 s | 0,007 | 0 ms |
| `/servicos/morena-iluminada` | 100 | 100 | 100 | 100 | 0,83 s | 0,007 | 0 ms |
| `/servicos/penteado-e-make` | 100 | 100 | 100 | 100 | 0,79 s | 0,007 | 0 ms |
| `/servicos/ruivo-e-cobre` | 98 | 100 | 100 | 100 | 0,81 s | 0,007 | 178 ms |
| `/trabalhos` | 100 | 100 | 100 | 100 | 0,83 s | 0,007 | 0 ms |
| `/tratamentos` | 100 | 100 | 100 | 100 | 0,79 s | 0,006 | 0 ms |

- **Meta (≥ 95 / 100) cumprida em todas as 29 rotas:** Performance 96–100; Acessibilidade e Boas práticas 100.
- **SEO 100** em todas, menos `/404` e `/avaliar/qr`, que são `noindex` de propósito.
- **No começo da sessão** (`lighthouse-inicio-sessao.json`): capa 84 na primeira execução, a frio; Loiros e Corte 97, com LCP de 2,55–2,63 s.
- **Sem compressão** (`lighthouse-sem-compressao.json`): sem brotli, o LCP simulado sobe 0,3–1 s. Por isso o servidor de teste comprime, como a Vercel.

### LCP com 4G aplicada de verdade

Throttling por DevTools (não simulado), mediana de 3 rodadas:

| Página | LCP |
|---|---|
| Capa **com** abertura | **1,60 s** (1,59 · 1,60 · 1,61) |
| Capa **sem** abertura | **1,61 s** (1,60 · 1,61 · 1,61) |
| `/servicos/loiros` | 1,90 s |
| `/servicos/corte` | 1,84 s |
| `/equipe/dido-rodrigues`, `/equipe/karine`, `/404` | 0,83 s |

Antes das correções, perfis e 404 estavam em 3,5 s; a capa, em 1,9 s.

Tudo abaixo da meta de 2,0 s. A abertura não atrasa o LCP: o pôster da capa é o LCP desde o primeiro quadro.

### O que mudou para chegar aqui

1. **Aviso de privacidade:** aparecia tarde e virava o maior elemento da tela (LCP de 3,5 s nos perfis). Agora é desenhado no primeiro quadro, por um script inline mínimo com hash na CSP, e o comportamento continua carregando depois do LCP.
2. **Cabeçalhos de documento (CSP etc.):** iam em toda resposta, inclusive JS, fontes e imagens. Agora só vão nas páginas, uma economia de ~5,6 KB por arquivo.
3. **Nova variante de 640 px** nas fotos, e `sizes` de 85vw na capa das matérias: o celular deixou de baixar a de 800 px.
4. **Itálico pré-carregado** nas páginas cujo LCP é texto em itálico pesado (perfis e 404).

### Pesos (`docs/qa/pesos.json`, gzip)

| Item | Medido | Orçamento |
|---|---|---|
| JS inicial (máx., na capa) | **9,2 KB** | ≤ 40 KB |
| Ilha 3D (maquete esquemática) | **141,2 KB** | ≤ 180 KB |
| Ilha 3D com GLB (GLTFLoader + Meshopt) | 162,4 KB | ≤ 180 KB |
| Spark ("Ver de verdade", só sob demanda) | 920,7 KB | fora da ilha |
| GLB · splats | nenhum ainda | ≤ 3 MB · ≤ 40 MB |
| Fontes (Manrope · Playfair · Playfair itálico) | 24,3 + 37,9 + 37,5 KB | — |
| Imagens Open Graph | 9, a maior com 96 KB | — |
| Vídeos derivados | 78 arquivos, 154 MB no total | sob demanda / quando visíveis |

O maior vídeo é a fala do Dido em 720p (13,5 MB). O player sob demanda usa a versão 540p (8,7 MB MP4 / 6,5 MB WebM), que só baixa quando a pessoa toca em "Ouvir".

JS inicial por página (as maiores): capa 9,2 KB · `/a-casa` 6,2 KB · `/como-chegar` 6,2 KB · `/trabalhos` 4,9 KB · perfis 2,9 KB. O HTML da capa tem 33,5 KB gzip.

### Tour 3D: fps e memória (`docs/qa/desempenho.json`)

| Cenário | fps médio | mínimo (inclui os voos) |
|---|---|---|
| Desktop 1440 px | 46 (outra rodada: 55) | 42 |
| "Android intermediário" (390 px, toque, DPR 2,6, CPU 4× mais lenta) | 60 | 56 |

As medidas são por software (SwiftShader), então são o piso, não o de uma GPU real. A meta é 60 desktop / ≥ 30 Android. No desktop a média ficou entre 46 e 55: o SwiftShader renderiza 1440 px com DPR 2 na CPU, sem GPU. Falta confirmar num computador e num Android reais.

**Memória ao abrir e fechar o tour 3 vezes:**

- o heap JS do documento vai a ~4,6–6,3 MB com o tour aberto e volta a ~3,3–4,9 MB ao sair;
- `destruir()` perde o contexto WebGL (`isContextLost: true`).

A métrica do Chromium sobe ~0,8 MB por ciclo. Investigado:

- num ciclo de controle sem 3D, a métrica fica parada em 0,9 MB;
- **os snapshots de heap (só objetos vivos, depois de coleta) não crescem**: 4,88 MB após 2 ciclos e 4,85 MB após 6.

Portanto não há vazamento de objetos. O que sobe é memória já descartada que o V8 ainda não devolveu.

Na mesma investigação apareceu um defeito real: ao voltar pelo histórico (bfcache), o tour ficava morto, porque fora destruído no `pagehide`. **Corrigido:** o `pageshow` recria a cena num canvas novo. O Chromium automatizado daqui não usa o bfcache, então esse caminho está coberto pelo código, não por teste.

---

## 2. Acessibilidade (`docs/qa/acessibilidade.json`)

- **axe-core 4.14** (WCAG 2.0/2.1/2.2 A e AA + boas práticas), 32 rotas × 2 larguras (390 e 1440):
  - **0 violações nas páginas públicas.** No começo da sessão eram três: `label-content-name-mismatch` em `/equipe`, `aria-allowed-role` no painel do tour e `region` na faixa de preview e no cartão QR. As três foram corrigidas.
  - Sobram 3 tipos de aviso só nas páginas internas de revisão (`/_estilo`, `/_textos`, `/_capa-b`), que são `noindex` e não fazem parte do site.
- **Teclado do início ao fim** (capa, 1440 px):
  - o 1º Tab cai em "Pular" na abertura; Enter pula;
  - o resto do caminho: capa → sumário → antes e depois (o comparador responde às setas) → agendador (serviço, dia e período pelas setas) → "Enviar pelo WhatsApp", com o link `wa.me` montado;
  - **62 Tabs, foco visível em 100% das paradas**;
  - o e2e cobre o agendador completo e a gaveta.
- **Leitor de tela:** a árvore de acessibilidade do agendador e do tour está em `docs/qa/arvore-agendador.txt` e `arvore-tour.txt`.
  - Agendador: grupos com legenda (`Qual serviço?`, `Quando?`), radios com nome, dias indisponíveis anunciados com o motivo, prévia em `output` com `aria-live`.
  - Tour: `tablist` com 8 abas, painéis `tabpanel`, canvas como `img` com descrição.
- **Contraste:** 0 violações de contraste do axe nas páginas públicas; a paleta foi validada por script na sessão 3.
- **Movimento reduzido:** 0 animações em curso e 0 vídeos tocando na capa, em Mechas e em `/a-casa`. A abertura não toca, e o tour cai no fallback (fotos + lista).
- **Zoom 200%** (viewport de 640 px CSS): **0 rotas com rolagem horizontal**, de 32.
- **Pausar vídeo (WCAG 2.2.2):** a capa já tinha o botão. Os vídeos mudos em loop das matérias (galeria e capa de Mechas) tocavam sem controle: **corrigido**, cada um ganhou o botão "Pausar vídeo / Reproduzir vídeo". Na grade de `/trabalhos` os vídeos não tocam sozinhos (abrem no lightbox).
- **Legendas WebVTT:** as três falas com som (Edna "sonho", Edna "clientes", Dido "loiro") têm `.vtt` em pt-BR, ligado no player sob demanda.

## 3. Navegadores e ambientes (`docs/qa/navegadores.json`)

| Ambiente | Resultado |
|---|---|
| Chrome (Chromium 1243), 390 e 1440 | tudo acima |
| Android 390 px (toque, DPR 2,6) | e2e 13/13; tour a 60 fps (CPU 4×) |
| **WebGL desligado** | `/a-casa` cai no fallback (`sem-webgl`): foto da fachada + as 8 abas com os painéis |
| **JS desligado** | todas as páginas com conteúdo; o agendador mostra a mensagem e o link gerais do WhatsApp, e os CTAs "Agendar" seguem para o WhatsApp. Em `/a-casa`, o palco 3D ficava vazio ("Carregando a maquete…" para sempre). **Corrigido** com `<noscript>`: aparecem a foto e a lista |
| Safari iOS (WebKit) e Firefox | **não testados aqui**. Roteiro manual abaixo |

**Roteiro manual (Safari iOS e Firefox):**

1. Capa: abertura, "Pular", vídeo pausa/reproduz.
2. Agendador: escolher serviço, dia e período; conferir a prévia; abrir o WhatsApp.
3. `/servicos/loiros`: CTA fixo abre a gaveta preenchida.
4. `/a-casa`: o tour carrega, as abas trocam, "Ver de verdade" abre as fotos.
5. `/trabalhos`: filtro e lightbox (setas, fechar).
6. `/como-chegar`: copiar endereço; aceitar no aviso e carregar o mapa.
7. `/avaliar/qr`: imprimir em A6.

## 4. Acabamento ("cliente exigente")

Revisão página a página em 390 e 1440 px. As capturas antes e depois estão em `docs/capturas/2026-11-18/qa/antes|depois/`, e as comparações recortadas em `qa/comparacao-*.png`.

| Achado | Correção |
|---|---|
| "·" órfão no fim da linha na faixa da capa (celular) | dois grupos que não quebram por dentro; no celular, um por linha |
| "Privacidade ·Preferências de privacidade·" no rodapé | itens espaçados, sem separador desenhado |
| Hashtag em caixa alta no perfil ("#TALENTOTODALINDA") | etiqueta com a grafia real (#TalentoTodalinda) |
| Coordenadas com ponto decimal ("27.8168° S") | vírgula, como em pt-BR ("27,8168° S") |
| "Feriados: fechado" na seção Visite, contradizendo "confirme pelo WhatsApp" | "Em feriados, confirme o horário pelo WhatsApp antes de vir." |
| Aspas retas no texto publicado ("somos TODALINDA", "Aceitar", Karine "Kah") | aspas tipográficas “ ” em todo o texto |
| Link duplicado no retrato da grade da equipe (o nome logo abaixo já é link) | o retrato saiu do teclado e do leitor de tela |

Também conferido, sem correção necessária:

- **Sem viúvas e órfãs:** `text-wrap: balance` nos títulos e `pretty` nos parágrafos.
- **Capitulares** de 3 linhas pela linha de base (`initial-letter`, com float no Firefox).
- **Fólio** sequencial em todas as páginas.
- **Cortes de foto:** nenhum corta rosto nem as pontas do cabelo do resultado; a foto da equipe tem o recorte 3:2 no desktop centrado nos rostos.
- **Travessões e acentos:** nenhum hífen no lugar de travessão nem intervalo com hífen.
- **Nenhum texto cortado em 390 px.**

## 5. Normas e deploy

Detalhados em `docs/CONFERENCIA_FINAL.md`. Os testes que provam:

- **e2e 13/13:** os 8 cenários do agendador, `/avaliar`, PDF A6/A5 e nenhum request de terceiro antes do consentimento;
- **93 testes de unidade;**
- **`astro check` com 0 erros;**
- ESLint e Prettier limpos;
- `audit-compliance` e `audit-seo` verdes;
- `vercel.json` em dia com o build;
- CSP sem violação em 64 páginas.
