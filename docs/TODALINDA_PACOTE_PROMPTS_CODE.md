# Todalinda: pacote de prompts para o Claude Code (Opus)

Versão 1 · 17/11/2026 · WAXLO

Base:
- `TODALINDA_INVESTIGACAO_CLIENTE.md`: investigação, história, equipe, agendamento, plano de avaliações, GEO, compliance.
- `TODALINDA_MAPA_MIDIA.md`: cada arquivo avaliado, trechos com tempo, falas transcritas e curadoria.
- `TODALINDA_AVALIACOES_GOOGLE.json`: as 57 avaliações.
- Logos: `todalinda-logo.svg`, `-logo-mono.svg`, `-selo.svg`, `-selo-mono.svg`, `-palavra.svg`, `-filigrana.svg`.

Repositório: `github.com/joaoCanonica/todalinda`.

---

## Como usar (ordem exata)

1. **Antes da sessão 0**, arrume o repositório:
   - Na raiz, **substitua** `TODALINDA_INVESTIGACAO_CLIENTE.md` e `TODALINDA_AVALIACOES_GOOGLE.json` pelas versões novas. As que estão lá são de antes das suas respostas.
   - Também na raiz, adicione `TODALINDA_MAPA_MIDIA.md` e `TODALINDA_PACOTE_PROMPTS_CODE.md`.
   - Crie `assets/marca/` e coloque nela os 6 SVG. O JPG de comparação é só para você.
2. Abra o Claude Code (Opus) **na pasta do repositório**.
3. **Sessão 0:** cole o bloco da seção B e, logo abaixo, o Prompt 0. **Sem anexos.**
4. **Sessões seguintes:** uma sessão nova para cada, colando **só o prompt**. Não junte prompts. Cada sessão termina em commit.
5. Quando chegar material novo:
   - fotos do espaço em alta, retratos da equipe, vídeos originais, antes e depois confirmados → **Prompt L**;
   - **planta ou medidas** → **Prompt 3D**;
   - escolha da agenda online (fase 2) → **Prompt A**;
   - dado novo (link "Pedir avaliações", mês de abertura, ouro oficial, estacionamento, pagamentos, domínio) → **Prompt D**.
6. Depois das sessões **1, 3, 4, 6A, 6B, 7 e 9**, me traga o relatório e as capturas (390 e 1440 px). Eu audito antes de você seguir.
7. **Ordem:** 0 Fundação · 1 Mídia · 2 Config · 3 Design system · 4 Abertura e capa · 5 Textos · 6A Home · 6B A Casa (3D) · 6C Serviços e páginas · 7 Agendar e avaliar · 8 SEO e GEO · 9 QA e deploy.

---

## A. Dados fixos (a sessão 2 transforma em config)

| Campo | Valor | Estado |
|---|---|---|
| Nome de exibição | **Todalinda** (como no Google e no Instagram; o logo escreve TODA LINDA) | CONFIRMADO para uso. "Ateliê de Beleza Toda Linda" só no rodapé legal |
| Razão social / CNPJ | Cordova Antoniolli Serviços de Estéticas LTDA · **25.337.323/0001-04** | CONFIRMADO (João) |
| Endereço | **Rua Lauro Müller, 574, Centro, Lages/SC, CEP 88501-000** | CONFIRMADO (João + Google) |
| Coordenadas | -27.8168249, -50.3245096 · plus code 5MMG+75 · Maps cid 14959576611857227956 | VISTO (Google) |
| WhatsApp (agendamento) | +55 49 99177-2089 · wa.me/5549991772089 | CONFIRMADO |
| Telefone fixo | (49) 3018-0082 | CONFIRMADO (Google) |
| Instagram | @somostodalinda | CONFIRMADO |
| Horário | ter–sáb 09:00–19:00 · dom e seg fechado | CONFIRMADO (João) |
| Fundação | 2017 (mês PENDENTE) · fundadora **Edna Antoniolli** | CONFIRMADO o ano |
| Equipe | Edna (fundadora) · **Dido Rodrigues** (cabeleireiro, 26 anos de profissão) · **Andressa Savaris** (cabeleireira e cosmetóloga, 9 anos) · **Isabela Cristina** (colorista: colorimetria avançada, mechas, "técnica + cor") · **Karine (Kah)** (manicure e pedicure) · **Thaynara Colombo** (educadora e nail designer) · **Marina Schpanski** (maquiadora) | CONFIRMADO (João). Imagem autorizada |
| Serviços no site | **Só com mídia no repositório:** morena iluminada, loiros, ruivo e cobre, castanho/mocha, mechas, corte, tratamentos (texto educativo), penteado e make, esmalteria (gel, blindagem, manicure e pedicure) | CONFIRMADO (regra do João). Limpeza de pele: opcional() até a casa confirmar |
| Marcas | Truss (visível em fotos e vídeos), Wella, L'Oréal Inoa (conteúdo) | Só nome, sem logo |
| Google | 4,6 · 57 avaliações · 17/11/2026 | VISTO. **Não exibir nota** |
| Link "Pedir avaliações" | — | PENDENTE. Fallback: link da ficha (cid) |
| Ouro | traço ≈ #AE8C55 · realce #E2C88C · base #A2824D · sombra #7E5C32 (medido no logo) | PROVISÓRIO |
| Revistas | dez/2021 · 5 anos (jul/2022) · set/2023 (Flipsnack, links no Linktree) | VISTO |
| Cursos | Já ofereceu (último há ~5 anos) | Só uma menção na história |
| Estacionamento, pagamentos, cartão-presente, noiva fora do salão, acessibilidade | — | PENDENTE (João vai perguntar). Fora do site até lá |

**Decisões do João:**
- site super premium, focado em **agendamento** e **exposição** (o local, onde fica, os trabalhos);
- bonito e **sem cara de IA**;
- **3D como o da Prime House**;
- agenda em **dois canais aos poucos** (WhatsApp agora, agenda online depois);
- bloco forte de **"Avaliar no Google"**;
- crianças fora;
- cursos só como menção.

---

## B. BLOCO "CONTEXTO DO PROJETO" (colar só na sessão 0)

````text
CONTEXTO DO PROJETO — Todalinda (salão e estética, Lages/SC; site premium com agendamento e 3D)
Idioma de tudo (código, comentários curtos, textos, relatórios): português do Brasil.

1. QUEM E O QUÊ
- Cliente: Todalinda (razão social Cordova Antoniolli Serviços de Estéticas LTDA, nome fantasia Ateliê de Beleza Toda Linda, CNPJ 25.337.323/0001-04), salão de beleza grande no Centro de Lages/SC (Rua Lauro Müller, 574), aberto em 2017 pela fundadora Edna Antoniolli. Em 2027 completa 10 anos.
- Força: colorimetria (morena iluminada, loiros perolados e manteiga, ruivos e cobre, castanhos/mocha), mechas com teste de mecha antes, corte ("A Arte do Corte"), tratamentos (Truss), penteado e make, esmalteria (gel com blindagem, manicure e pedicure). Discurso da casa: saúde do fio antes de qualquer procedimento; avaliação individual.
- Equipe (autorizada): Edna Antoniolli (fundadora); Dido Rodrigues (cabeleireiro, 26 anos de profissão); Andressa Savaris (cabeleireira e cosmetóloga, 9 anos); Isabela Cristina (colorista: colorimetria avançada, mechas, técnica + cor); Karine "Kah" (manicure e pedicure); Thaynara Colombo (educadora e nail designer); Marina Schpanski (maquiadora).
- Rituais reais: quadro "Dois Reais ou um Cabelo Todalinda" (transformações em vídeo no Instagram, o conteúdo de maior alcance da casa); "Momento Todalinda" (clientes que viram história); revista própria (3 edições, 2021–2023); treinamentos da equipe.
- Voz (frases reais da Edna): "Ver um sonho se tornar um lugar." · "Algumas clientes deixam de ser apenas clientes. Começam a fazer parte da nossa história." · "Não é sobre luxo. É sobre merecimento." · "Hoje somos fortes porque temos pessoas." · "Excelência não é um destino. É uma decisão diária." (Instagram e vídeos; fontes no mapa de mídia.)
- OBJETIVO (nesta ordem): (1) AGENDAMENTO: a visitante escolhe o serviço e agenda em menos de 30 s; (2) EXPOSIÇÃO: mostrar os trabalhos, o lugar (3D), onde fica e quem faz; (3) AVALIAÇÕES: converter clientes em avaliações no Google (hoje 57, contra 150–257 dos concorrentes); (4) Google e IAs passarem a descrever a Todalinda como referência em cor e mechas em Lages.
- Meta do João (CEO da WAXLO): super premium, editorial, zero "cara de IA", zero visual "salão genérico rosa". Cliente grande e exigente.
- Regra do projeto: o site primeiro. A conferência de normas (CDC/CONAR, LGPD, direito de imagem, regras do Google) é UMA passada no final (sessão 9), mas as proibições da seção 8 valem desde já. O que o João mandou está autorizado (clientes do repositório, equipe, influenciadoras). Crianças: fora. Não corte conteúdo por falta de papel: sinalize em docs/PENDENCIAS.md.
- Dado do cliente (preço, mês de abertura, estacionamento, pagamentos, quem faz o quê) NUNCA é inventado. Faltou: campo pendente.

2. FONTES DE VERDADE NO REPOSITÓRIO
TODALINDA_INVESTIGACAO_CLIENTE.md (história, equipe, serviços, agendamento, avaliações, GEO, compliance), TODALINDA_MAPA_MIDIA.md (cada arquivo, trechos com tempo, falas, curadoria, duplicados, rotações), TODALINDA_AVALIACOES_GOOGLE.json, assets/marca/todalinda-*.svg.

3. FUNIL
- Ação principal: "Agendar". Fase 1: o agendador (serviço → profissional opcional → dia e período, ter–sáb) monta a mensagem e abre o WhatsApp 5549991772089. Fase 2 (depois): agenda online. O agendador nasce com um adaptador de destino (whatsapp | link-externo | api) para a fase 2 trocar só o destino.
- Sem preço no site: "o valor depende do comprimento e do histórico do fio; na avaliação a gente te passa".
- Secundários: Ver trabalhos, Como chegar, Instagram, telefone fixo (49) 3018-0082.
- Avaliar no Google: bloco próprio + rota curta /avaliar (redireciona ao link oficial) + página imprimível /avaliar/qr. Sem incentivo, sem nota agregada.

4. STACK
- Astro (estável atual; conferir e fixar), TypeScript strict, estático, pnpm, Node LTS, engines e packageManager fixados.
- Movimento: CSS + IntersectionObserver + Web Animations API; View Transitions e scroll-driven só como melhoria progressiva. Sem GSAP, Lenis, Motion, Swiper, jQuery. Nunca sequestrar o scroll.
- 3D: Three.js numa ilha isolada, carregada SÓ depois do LCP e só quando a seção entra na tela (client:visible + requestIdleCallback). Sem React Three Fiber. Splat (Gaussian Splatting) só sob demanda (botão "Ver de verdade"), biblioteca mais estável no momento (pesquisar e justificar). Sempre com fallback em vídeo/imagem e lista de ambientes em HTML.
- Orçamento (medir): JS inicial ≤ 40 KB gzip por página (sem a ilha 3D); ilha 3D ≤ 180 KB gzip + GLB ≤ 3 MB (Draco/Meshopt + KTX2); splat ≤ 40 MB sob demanda; LCP < 2,0 s em 4G mobile; CLS ≈ 0; INP < 200 ms; Lighthouse mobile ≥ 95 (Performance/BP/SEO) e 100 (Acessibilidade) na home com o 3D ainda não carregado.
- Fontes self-hosted (subset latino).

5. IDENTIDADE
- Marca: assets/marca/todalinda-logo.svg (completo, folha de ouro), -logo-mono.svg (currentColor, texto vazado), -selo.svg e -selo-mono.svg (só o quadro: favicon, cabeçalho compacto), -palavra.svg ("TODALINDA" em uma linha: cabeçalho), -filigrana.svg (só a moldura: abertura). Nunca redesenhar o logo nem trocar a letra Λ.
- Assinatura: "EDIÇÃO TODALINDA". A casa tem revista própria; o site é desenhado como uma edição dela:
  (a) CAPA: o hero é uma capa (logo como cabeçalho da revista, manchete, chamadas de capa, número da edição "Nº 10 · desde 2017");
  (b) CAPITULAR: textos de abertura começam com letra capitular grande (como nas matérias da revista);
  (c) ETIQUETA: pílulas de contorno fino com hashtag real da casa (#TalentoTodalinda, #MomentoTodalinda, #EquipeTodalinda, #TodaMake);
  (d) FÓLIO: no canto de cada seção, "TODALINDA · 07 · COR" em versalete pequeno, numeração sequencial da home;
  (e) CAPA ESCURA × PÁGINA CLARA: seções alternam fundo Noite (capa) e Papel (página), como virar a página;
  (f) FILIGRANA: só na abertura (a moldura se desenha) e no selo; nunca como enfeite repetido nas seções.
- PROIBIDO repetir (usado em outros sites nossos): vinho + coluna de pontos, linha da vida, curva dourada (linha dourada ondulada), oval verde, arco como assinatura, navy + areia, molduras de luz/LED, "Luz de Treino", "Leão de Aço", "A Contraforma", "A Fresta", "O Degradê", "O Florescer"; fontes Cormorant, Bodoni Moda (e família Bodoni), Marcellus, Instrument Serif, Hanken Grotesk, Fraunces, Lato, Figtree, Jost, Gloock, Urbanist, Spectral, Newsreader, Albert Sans, Libre Caslon, Schibsted Grotesk, Bellefair, Gilda Display, Mulish, Red Hat Text, EB Garamond, Josefin Sans, Archivo, Barlow Condensed, Inter Tight, Geist, Source Serif 4, Literata, Sora, Michroma, DM Serif Display.
- Paleta (tokens; validar AA por script):
  Noite ≈ #121013 (capa);
  Café ≈ #2A1E19 (superfícies quentes);
  Papel ≈ #F7F3EC (página clara; fundo do texto longo);
  Tinta ≈ #1B1715 (texto sobre Papel);
  Pedra ≈ #8A817A (texto secundário, fios);
  Ouro ≈ #AE8C55 e Ouro claro ≈ #E2C88C (PROVISÓRIO até o oficial): logo, fólio, etiquetas, foco, números; texto em ouro só grande e sobre Noite; nunca bloco grande de ouro chapado (a folha de ouro existe só no logo);
  Mocha ≈ #6B4A3A (acento raro, conversa com as morenas iluminadas).
- Tipografia (testar e decidir na sessão 3; OFL; self-host): títulos em serifa de alto contraste com itálico pesado, como a revista da casa: Playfair Display (o que a revista usa; confirmar no PDF/flip) × Prata; texto em Manrope × Onest; versalete do fólio e rótulos no próprio texto em caixa alta espaçada.
- Fotografia real de cabelo em luz de janela, quente; muito respiro; retrato de cliente como capa de revista.

6. ANTI "CARA DE IA" E ANTI "SALÃO GENÉRICO"
Proibido: rosa bebê/lilás, glitter, degradê dourado em fundo, ícone de tesoura/secador/batom, foto de banco, mulher de costas genérica em todo lugar, cards arredondados iguais, "realce sua beleza", "transforme seu visual", "sua melhor versão", emoji, depoimento inventado, contador inventado, ilustração 3D do fio (artes do Instagram) como imagem.
Usar: tipografia editorial grande, capitulares, fólio, etiquetas reais, fotos reais de resultado com nome da técnica, antes e depois reais, a voz da Edna, números verificáveis (desde 2017 · 26 anos de profissão do Dido · 7 profissionais · ter–sáb 9h–19h).

7. MÍDIA
- Originais em media-originais/ (git mv de assets/ e videos/). Derivados no build em public/media/ (fora do git): AVIF/WebP com srcset, LQIP, pôster por vídeo, MP4 H.264 + WebM, loops mudos.
- Manifesto media.manifest.json: id, arquivo, tipo, pessoa/técnica, texto/fala transcrita, uso, trechos (in/out em s), resolucaoMax, rotacao, consentimento (autorizado | pendente | nao-precisa), audioLiberado, problemas, edicoes, naoUsar, parAntesDepois.
- Capturas de tela (~680 px) NÃO viram imagem grande: no máximo 480 px ou referência do 3D. Retratos de 150 px: naoUsar.
- Edição permitida: cor/exposição GLOBAIS, recorte, rotação, corte de trechos. Proibido: IA generativa, apagar texto queimado por IA, upscaling por IA, retoque em pessoas.
- Vídeos mudos por padrão; som só em audioLiberado (as falas da Edna podem ter som com legenda HTML).

8. REGRAS DE TEXTO (CDC, CONAR, LGPD, Google)
- Sem superlativo comparativo na voz da casa ("melhor salão", "o melhor", "a melhor", "número 1", "a maior"). Elogio forte só em avaliação literal.
- Sem preço, promoção, desconto, sorteio, "grátis" no site.
- Sem promessa de resultado ou de saúde ("cura", "trata queda", "acaba com o frizz para sempre"); cuidado com o fio é "avaliação e técnica", não tratamento médico.
- Procedimentos estéticos invasivos (agulha, injetáveis, escleroterapia) NÃO entram.
- Avaliações: sem incentivo, sem pedir só às satisfeitas, sem AggregateRating; a avaliação do próprio funcionário (DIDO Rodrigues) não aparece.
- Crianças: nenhuma imagem.
- Termos vetados (src/config/termos.ts): "melhor salão", "o melhor", "a melhor", "número 1", "nº 1", "a maior", "o maior", "promoção", "desconto", "grátis", "sorteio", "cura", "curar", "trata queda", "alopecia", "rejuvenesce", "sua melhor versão", "transforme seu visual", "realce sua beleza", "Toda Linda Lages". O Code NUNCA afrouxa listas nem travas sem ordem expressa.

9. CONFIG E TRAVAS
- Fonte única em src/config/ tipada com confirmado(), opcional(), bloqueante(), aviso(). Preview sempre funciona (faixa "em revisão", selo PROVISÓRIO, noindex).
- Produção trava só em: WhatsApp ausente; termo vetado no HTML; mídia naoUsar referenciada; mídia com criança; imagem de captura acima de 480 px; ambiente do 3D com layout inventado (sem fonte) sem aprovação do João; serviço sem mídia publicado.

10. CONDUTA DO CODE
- Um prompt = uma sessão = um commit, mensagem curta em português.
- Plano curto antes de tarefa grande. Capturas e métricas no lugar de "ficou ótimo". Se não conseguir, diga.
- Capturas em 390 e 1440 px e com prefers-reduced-motion.
- Relatório no fim: o que mudou · o que falhou · o que depende do João · números medidos.
````

---

## PROMPT 0 — Fundação

````text
[COLE AQUI O BLOCO "CONTEXTO DO PROJETO" INTEIRO, ANTES DESTE TEXTO]

Tarefa: criar a fundação do projeto Astro no repositório todalinda e gravar o contexto como CLAUDE.md.
Escopo: estrutura e configuração. NÃO escreva páginas, textos ou componentes visuais. NÃO apague mídia.
Leia primeiro: git ls-files; TODALINDA_MAPA_MIDIA.md.

Passos:
1. Salve o bloco de contexto, sem alterar, como CLAUDE.md na raiz, como AGENTS.md (cópia, para outros agentes) e como docs/CONTEXTO.md.
2. Crie docs/ e mova para lá (git mv): TODALINDA_INVESTIGACAO_CLIENTE.md, TODALINDA_MAPA_MIDIA.md, TODALINDA_PACOTE_PROMPTS_CODE.md; TODALINDA_AVALIACOES_GOOGLE.json → docs/dados/avaliacoes-google.json. Se faltar algum, anote em docs/PENDENCIAS.md e siga.
3. Verifique: node, pnpm, git, ffmpeg, ffprobe, sharp, Chromium do Playwright, e uma forma local de transcrever áudio (whisper.cpp ou faster-whisper; instalar só se seguro, sem global, e me dizer). Nada global sem me dizer.
4. Astro (estável atual, TS strict, estático) na raiz, preservando assets/ e videos/. Adicione three (versão estável fixada) como dependência, ainda sem uso. package.json: name "todalinda-site", engines, packageManager, scripts: dev, build, preview, check, test, validate-config, audit-compliance, audit-a11y, audit-lighthouse, audit-seo, audit-contraste, audit-pesos, media:prepare, model:prepare, capturar.
5. Estrutura: src/{config,components,layouts,pages,styles,scripts,content,lib,tres}, scripts/, docs/{capturas,dados,3d}, media-originais/, modelos-originais/ (Git LFS só se o João autorizar), public/. .gitignore: node_modules, dist, .astro, public/media, public/modelos, docs/capturas/**/*.png, .env*.
6. tsconfig strict, ESLint + Prettier, .editorconfig, .nvmrc, Vitest.
7. scripts/capturar.mjs: sobe o preview e captura rotas em 390 e 1440 px e com prefers-reduced-motion em docs/capturas/<data>/; espera a ilha 3D estabilizar quando presente.
8. Página temporária "/" com <h1>Todalinda</h1> e noindex. README.md curto.

Critério de aceite: install, build, check e test verdes; capturar funciona; CLAUDE.md idêntico ao bloco; commit "fundação".
````

---

## PROMPT 1 — Mídia

````text
Leia CLAUDE.md e docs/TODALINDA_MAPA_MIDIA.md. Esta sessão só trata mídia. NADA vai para páginas.

Tarefa: mover originais, gerar manifesto, transcrever falas, cortar trechos e loops, recortar o aproveitável, gerar derivados.
Escopo: media-originais/, media.manifest.json (+ JSON Schema), scripts/prepare-media.mjs, scripts/extract-stills.mjs, scripts/transcrever.mjs, docs/MIDIA_CATALOGO.md. Originais intactos (só git mv).

Passos:
1. git mv: assets/marca/*.svg → media-originais/marca/; assets/Captura*.png → media-originais/fotos/capturas/; assets/*.jpg|jpeg → media-originais/fotos/; videos/*.mp4 → media-originais/videos/.
2. Manifesto com os campos do CLAUDE.md, seção 7, preenchido a partir do mapa de mídia. Marque:
   - naoUsar: "SaveClip.App_883558643… (1).jpg" (duplicado); snapinsta-1794934239313.mp4 e snapinsta-1794936414495.mp4 (duplicados); dido.jpg, marina.jpg, thaynara.jpg e as capas de destaque de 150 px (cabelos, coloracao, esmalteria, localizacao, make, mechas, penteados, unha); logo.jpeg (substituído pelos SVG); artes educativas (839179616, 844977298, 845100676, 845432365, 846156826, 846612203, 847386926, 847939100, 849575432) e artes de limpeza de pele (890716602, 890716713, 890716867, 890853837): naoUsar como imagem, mas transcreva o TEXTO de cada uma para docs/dados/textos-das-artes.md (fonte da sessão 5); carrossel da Thaynara (850583628, 850806782, 850999160, 852414910): texto transcrito, imagem naoUsar.
   - rotacao 90: 900637927 e 902591720 (confira o sentido certo).
   - capturas de tela: resolucaoMax 480, uso "referencia-3d" e "pequena".
   - equipe: Captura 12-49-24 = Edna (confirmada); 12-51-36 = Isabela (PROVÁVEL); 12-52-34 = Andressa (PROVÁVEL); 13-12-39 = arte da Karine (só texto); 899604807 = Dido com cliente; 851041550 = equipe reunida. Campo "confirmarIdentidade" nas prováveis.
   - parAntesDepois (prováveis, a confirmar): 862082658_18253668139 → 862434060/862550598/862620147; 756143696 → 754970697/756641555; vídeo 936752395 (antes e depois no próprio vídeo).
   - técnica de cada foto de resultado (tabela do mapa) e a escolha ★ da curadoria.
   - consentimento "autorizado" em tudo, exceto naoUsar.
3. TRANSCRIÇÃO (scripts/transcrever.mjs com Whisper local, pt): transcreva os 4 vídeos da Edna e o do Dido. Os dois sem legenda (snapinsta-1794932334383 e snapinsta-1794933027692) são novos: entregue o texto completo em docs/dados/falas.md, com tempo, e me diga em 5 linhas do que tratam. Complete os trechos "[…]" do mapa. Nomes de clientes citados viram "a cliente".
4. VÍDEOS — trechos (confira quadro a quadro, ajuste ±0,5 s), mudos, MP4 + WebM, 720×1280 e 540×960, pôster AVIF:
   - Filme institucional (snapinsta-1794933068881): escova 0,0–4,5 · revelacao-espelho 11,0–12,9 · ondas 13,0–19,5 (loop do hero) · dido 22,0–28,9 · iluminada 29,0–35,9 (loop alternativo) · logo-final 36,0–37,2 (referência).
   - transformacao (936752395): inteiro, e antes 0–3 s / depois 3–22 s.
   - resultados: 933531180 (morena iluminada), 933147675 (castanho acobreado), 937077868 (mechas), 932399083 (mechas, loop curto).
   - unhas (933048763): 0,0–4,0 e 7,0–9,5 (pular o desfoque).
   - edna-sonho (936089171) e edna-clientes (SaveClip.App_AQNLG2…): inteiros, com áudio liberado (fala dela) + legenda WebVTT gerada da transcrição (a legenda queimada continua; a WebVTT é para acessibilidade).
   - dido-loiro (936180983): inteiro, com áudio + WebVTT.
   Gere versões 4:5 e 16:9 dos loops do hero se o recorte vertical permitir (relate se não permitir; nada de preencher com IA).
5. STILLS sem upscale: revelação no espelho (12 s), ondas (16 s), Dido sorrindo (28 s), iluminada (33 s), parede de filigrana (5 s). Natureza "quadro de vídeo"; resolucaoMax registrada.
6. scripts/prepare-media.mjs (predev/prebuild, idempotente, cache por hash): AVIF/WebP 480/800/1200/1600/2400 (nunca acima do original), LQIP, rotação aplicada, vídeos acima.
7. docs/MIDIA_CATALOGO.md: tabela (arquivo, pessoa/técnica, uso, trecho, pesos, problemas), folhas de contato em docs/capturas/midia/ e a lista do que pedir (fotos do espaço em alta, retratos da equipe, originais do filme, planta).

Critério de aceite: media:prepare idempotente; manifesto válido; loop do hero ≤ 1,2 MB; transcrições entregues; nada naoUsar publicável; build verde; commit "midia".
````

---

## PROMPT 2 — Config, horário, conteúdo e travas

````text
Leia CLAUDE.md, docs/MIDIA_CATALOGO.md, docs/dados/falas.md e docs/dados/avaliacoes-google.json.

Tarefa: config tipada, coleções, motor de horário, WhatsApp, agendador (lógica) e travas.
Escopo: src/config/**, src/content/** (schemas), src/lib/{horario,whatsapp,agenda,avaliar}.ts, scripts/{validate-config,audit-compliance}.mjs, docs/PENDENCIAS.md, componentes PreviewBanner e Provisorio.

Passos:
1. tipos.ts: confirmado(v, fonte), opcional(v), bloqueante(rotulo), aviso(rotulo, motivo).
2. marca.ts: nome "Todalinda", nomeLegal "Cordova Antoniolli Serviços de Estéticas LTDA", fantasia "Ateliê de Beleza Toda Linda", cnpj "25.337.323/0001-04", fundacao { ano: 2017, mes: opcional() }, fundadora "Edna Antoniolli", logos, ouro = aviso("#AE8C55", "medido no logo; confirmar o oficial").
3. contato.ts: whatsapp 5549991772089; telefone (49) 3018-0082; instagram somostodalinda; endereço completo com CEP 88501-000; geo; plusCode; links Google Maps (cid 14959576611857227956), Waze, Apple Mapas; estacionamento, pagamentos, acessibilidade, cartaoPresente, noivaForaDoSalao = opcional().
4. horario.ts: ter–sáb 09:00–19:00; dom e seg fechado; feriados[] (datas, inclusive os municipais de Lages: pesquisar e citar); fuso America/Sao_Paulo. src/lib/horario.ts: statusEm(data) → "Aberto agora · até 19h", "Fecha em 30 min", "Fechado · abre terça às 9h", "Fechado · abre amanhã às 9h". Testes: segunda 10h, terça 8h50, sábado 18h40, sábado 19h01, domingo, feriado numa quarta, virada de ano.
5. Coleção "equipe" (Zod): slug, nome, funcao, anosDeProfissao (opcional), especialidades[], servicos[] (ids), foto (id de mídia ou null), instagram (opcional), ordem, confirmado. Registros: edna-antoniolli (fundadora), dido-rodrigues (cabeleireiro, 26), andressa-savaris (cabeleireira e cosmetóloga, 9), isabela-cristina (colorista: colorimetria avançada, mechas, técnica + cor), karine (manicure e pedicure), thaynara-colombo (educadora e nail designer), marina-schpanski (maquiadora). Foto null para quem só tem 150 px (componente mostra o "cartão tipográfico" da sessão 3 até chegar o retrato).
6. Coleção "servicos": id, nome, grupo (cor | corte | tratamento | festa | unhas | estetica), resumo, processo[] (avaliação → teste de mecha quando for química → técnica → tratamento → finalização), profissionais[] = bloqueante("confirmar com a casa quem faz") (em preview: sugestão pelas especialidades com selo PROVISÓRIO; no agendador, sem confirmação, mostrar só "Sem preferência"), midia[] (≥ 1 obrigatório), faq[], publicado (só se midia ≥ 1). Registros: morena-iluminada, loiros, ruivo-e-cobre, castanho-e-mocha, mechas, corte, tratamentos, penteado-e-make, esmalteria; limpeza-de-pele = opcional (publicado=false até confirmação).
7. Coleção "trabalhos": mídia, tecnica (id do serviço), profissional (opcional, só se confirmado), destaque (★), parAntesDepois.
8. avaliacoes.ts: do JSON; exibirNota=false; só as de citacoesSugeridasParaOSite; nunca a do id 1 (DIDO Rodrigues, profissional da casa); formato "Primeiro nome + inicial" (A V. vira "Cliente no Google").
9. src/lib/avaliar.ts: linkAvaliar() = config.googleReviewUrl (bloqueante: "link 'Pedir avaliações' do Perfil da Empresa") com fallback para a ficha (cid) e aviso.
10. src/lib/whatsapp.ts: linkWhatsApp(texto) com "Vim pelo site" no início. Mensagens: geral "Olá! Vim pelo site da Todalinda e quero agendar um horário."; servico "Olá! Vim pelo site e quero agendar {servico}."; trabalho "Olá! Vi no site o trabalho de {tecnica} e quero algo assim."; profissional "Olá! Vim pelo site e quero agendar com {nome}."; ambiente "Olá! Vi o espaço no site e quero agendar uma visita/horário."; duvida "Olá! Vim pelo site e tenho uma dúvida."
11. src/lib/agenda.ts (lógica do agendador, sem UI): montarPedido({servico, profissional?, dia?, periodo?, quimicaRecente?, primeiraVez?, nome?}) → texto exato, ex.: "Olá! Vim pelo site e quero agendar Mechas com Isabela Cristina, de preferência sábado à tarde. Já fiz química nos últimos 6 meses: sim. É minha primeira vez na Todalinda." Dias só ter–sáb; período manhã (9h–12h) | tarde (13h–19h) | "qualquer horário"; a pergunta de química só aparece para grupo "cor" e "mechas". Destinos: { tipo: "whatsapp" } (fase 1) | { tipo: "link-externo", url } | { tipo: "api", endpoint } (fase 2, stubs com teste). Nada é guardado. Testes de todos os ramos.
12. termos.ts (lista do CLAUDE.md, seção 8), seo.ts (SITE_URL por env; indexar=false), tema.ts.
13. validate-config e audit-compliance com as travas da seção 9 + varredura de termos vetados no dist/.

Critério de aceite: testes verdes; preview passa com pendências; travas simuladas derrubam a produção; commit "config".
````

---

## PROMPT 3 — Design system e "Edição Todalinda"

````text
Leia CLAUDE.md, docs/MIDIA_CATALOGO.md e src/config/tema.ts. Pesquise antes (MDN): initial-letter e alternativa com float para a capitular, text-wrap: balance/pretty, font-variant-caps, @property, mask-image, View Transitions, prefers-reduced-motion; e as fontes candidatas (eixos, itálico, licença). Confirme a fonte de títulos da revista da casa (os PDFs/flip estão no Linktree) antes de decidir.

Tarefa: tokens, tipografia, logo, componentes base e a assinatura. Página /_estilo (noindex).
Escopo: src/styles/**, src/components/base/**, src/components/marca/**, src/components/edicao/**, src/pages/_estilo.astro, scripts/audit-contraste.mjs.

Passos:
1. Tokens (Noite, Café, Papel, Tinta, Pedra, Ouro, Ouro claro, Mocha): calibre com os stills (luz de janela, o caramelo das morenas, o ouro do logo). audit-contraste valida AA de cada par (inclusive Ouro sobre Noite em tamanho grande e Pedra sobre Papel).
2. Tipografia: teste Playfair Display (com itálico 800–900) × Prata (títulos) e Manrope × Onest (texto), em 3 provas: capa ("Cor, corte e cuidado com quem entende de fio."), capitular de abertura de matéria (parágrafo da Edna) e ficha de serviço (lista e FAQ). Escolha com capturas e justifique. Escala fluida com display muito grande; itálico pesado só numa palavra por título; texto 17–18 px; números em tabular.
3. Logo: <Logo variante="completo|mono|selo|palavra"> a partir dos SVG (inline, otimizados com SVGO sem destruir as curvas); nitidez em 24/32/48/96 px; favicon e apple-touch a partir do selo; currentColor nas versões mono.
4. Assinatura "Edição Todalinda" (src/components/edicao):
   (a) <Capa>: grade de capa de revista (cabeçalho com <Logo variante="palavra">, faixa fina "Nº 10 · desde 2017 · Lages/SC", manchete, 3 chamadas de capa curtas, foto/vídeo de capa). No desktop a foto vertical fica como capa à direita e as chamadas à esquerda; no mobile, sangra.
   (b) <Capitular>: primeira letra em Playfair grande ocupando 3 linhas (initial-letter com fallback), em Ouro sobre Noite e em Tinta sobre Papel.
   (c) <Etiqueta>: pílula de contorno 1 px, versalete pequeno, hashtag real (#TalentoTodalinda etc.).
   (d) <Folio>: "TODALINDA · 07 · COR" no canto superior da seção, numeração automática por ordem na página.
   (e) <Pagina tom="capa|pagina">: alterna Noite/Papel; a transição entre tons ao rolar é um corte seco (como virar a página), sem degradê.
   (f) <Filigrana>: a moldura do logo como SVG animável (reveal por máscara do centro para fora, ≤ 1,2 s), usada SÓ na abertura e no selo.
5. Componentes base: Botão primário "Agendar" (Noite com texto Papel e fio Ouro; no tom capa: Papel com texto Noite), botão secundário (sublinhado editorial), Link, Rótulo, Citação (aspas tipográficas grandes em Ouro), StatusHorario (ao vivo), MolduraFoto (borda fina Papel de 1 px com legenda em versalete: técnica · profissional), Pôster com LQIP, CartaoTipografico (para profissional sem retrato: nome em Playfair grande, função e anos), MapaEstatico, Tabela de horário (hoje destacado), ComparadorAntesDepois (input range nativo acessível; teclado; rótulos "Antes"/"Depois"; sem JS mostra lado a lado).
6. Movimento: durações 150–700 ms; curva editorial suave na entrada e precisa na saída; nada de bounce; reduced-motion: estados finais.
7. /_estilo com tudo.

Critério de aceite: AA verde; capturas de /_estilo em 390/1440 e reduced-motion; JS desta sessão ≤ 6 KB; commit "design system".
````

---

## PROMPT 4 — Abertura e capa

````text
Leia CLAUDE.md e os componentes da sessão 3. Use os trechos escova, revelacao-espelho, ondas e iluminada e os stills.

Tarefa: a abertura e o hero (capa) da home. Só isso.
Escopo: src/components/abertura/**, src/components/capa/**, src/pages/index.astro (só a capa).

A ABERTURA, "A CAPA SE ABRE" (≤ 3,0 s, uma vez por sessão):
- 0–0,3 s: tela Noite.
- 0,3–1,3 s: a <Filigrana> se desenha do centro para fora, em Ouro, em volta de um quadrado vazio.
- 1,3–1,9 s: o quadrado se preenche com a folha de ouro e surge TODA LINDA (o logo completo, idêntico ao SVG).
- 1,9–2,6 s: o quadrado dourado cresce até virar a área da foto de capa, e dentro dele aparece o quadro "revelacao-espelho" (a cliente se vendo no espelho); a filigrana sai.
- 2,6–3,0 s: o logo vai para o cabeçalho como <Logo variante="palavra"> (FLIP com WAAPI; View Transition se suportado); o loop "ondas" começa no lugar do pôster; entram a manchete, as chamadas e os botões.
- Botão "Pular" acessível desde o primeiro quadro; toque, clique, tecla ou rolagem pulam. Uma vez por sessão (sessionStorage com try/catch). Reduced-motion e sem JS: estado final direto.
- O pôster da capa é o LCP, está no HTML desde o início com fetchpriority="high". Meça Lighthouse com e sem a abertura; se piorar, a abertura vira camada transparente sobre o pôster já pintado.

A CAPA (hero):
- <Capa> com o vídeo "ondas" (mudo, loop, botão pausar visível).
- Cabeçalho da capa: <Logo variante="palavra"> + faixa "Nº 10 · desde 2017 · Rua Lauro Müller, 574 · Lages/SC".
- Manchete (H1; a sessão 5 refina): "Cor, corte e cuidado com quem entende de fio." (itálico pesado em "fio").
- Chamadas de capa (3, curtas, cada uma é link): "Morena iluminada, loiros e ruivos: técnica + cor" → /trabalhos; "Dois Reais ou um Cabelo: o quadro da casa" → /dois-reais-ou-um-cabelo; "Por dentro da casa, em 3D" → /a-casa.
- Botões: "Agendar horário" (abre o agendador da sessão 7; até lá, WhatsApp geral) e "Ver trabalhos".
- StatusHorario ao vivo ("Aberto agora · até 19h") no rodapé da capa.
- Alternativa B (para eu comparar): capa com o loop "iluminada". Entregue /_capa-a e /_capa-b (noindex) com capturas.

Critério de aceite: sequência de capturas da abertura (0; 0,8; 1,5; 2,2; 3,0 s) em 390 e 1440; LCP < 2,0 s mobile com e sem abertura; Pular no teclado; reduced-motion; commit "abertura e capa".
````

---

## PROMPT 5 — Textos

````text
Leia CLAUDE.md, docs/TODALINDA_INVESTIGACAO_CLIENTE.md (seções 3–8), docs/dados/falas.md, docs/dados/textos-das-artes.md e src/config.

Tarefa: escrever TODOS os textos do site em src/content, com fonte de cada frase real.
Escopo: só texto.

Regras de voz:
- Editorial, quente, segura, frases curtas, segunda pessoa ("você"). Sem emoji, sem "diva", sem "maravilhosa", sem clichê de salão.
- Use as falas reais da Edna (transcritas) e as legendas técnicas da equipe como espinha, editadas só no ritmo; cite a fonte (vídeo ou post) no arquivo de conteúdo.
- Parágrafo-resposta no topo de cada página (2–3 frases com o quê + onde + como): "A Todalinda é um salão de beleza no Centro de Lages/SC, na Rua Lauro Müller, 574, aberto desde 2017. A casa é especializada em coloração — morena iluminada, loiros, ruivos — mechas com teste de mecha, corte, penteado, make e esmalteria, e atende de terça a sábado, das 9h às 19h."
- Seção 8 do CLAUDE.md inteira.

Textos a entregar:
1. Home (ordem do Prompt 6A): capa (manchete e chamadas); editorial da Edna (com capitular; "ver um sonho se tornar um lugar"); sumário (os serviços como índice de revista, com número de página); antes e depois (legenda de técnica em cada par); trabalhos; Dois Reais ou um Cabelo (o que é, como funciona, sem regras de promoção: "assista no Instagram"); equipe (#TalentoTodalinda: uma linha por pessoa, com função e anos de profissão quando houver); a casa (3D); Momento Todalinda (fala da Edna sobre clientes que viram história); o que dizem (citações literais); avaliar no Google; a revista (3 edições); agendar; visite.
2. /servicos/<id>: para cada serviço publicado: o que é, para quem, como é feito na casa (processo), quanto tempo leva (só se a casa confirmar: senão omitir), cuidados em casa (do conteúdo educativo da Andressa e das artes, sem promessa), quem faz (só confirmado), FAQ (3–5 perguntas reais), CTA "Agendar {serviço}".
3. /tratamentos: o glossário do fio (medula, córtex, cutícula; reconstrução, hidratação, nutrição, cauterização) reescrito das artes, em linguagem clara, sem promessa.
4. /nossa-historia: 2017 → 2020 (Isabela chega) → 2021 (revista nº 1, Dia da Noiva) → 2022 (5 anos: "do sonho à realização") → 2023 (treinamento com Romeu Felipe, Sunset no gramado) → 2026 (Dois Reais ou um Cabelo) → 2027 (10 anos); "a casa já formou profissionais em cursos próprios" (uma linha); valores ("excelência é uma decisão diária"; "não é sobre luxo, é sobre merecimento").
5. /equipe e /equipe/<slug> (uma página por profissional: função, anos, especialidades, trabalhos dela/dele quando confirmados, "Agendar com {nome}").
6. /dois-reais-ou-um-cabelo, /revista, /a-casa (introdução e um texto curto por ambiente, só o confirmado), /agendar (instruções do agendador + "primeira vez em cor? começamos com avaliação e teste de mecha"), /avaliar/qr (texto do cartão: "Sua opinião ajuda outra mulher a nos encontrar."), /como-chegar, /perguntas-frequentes (preço, tempo, teste de mecha, química recente, manutenção, horários, como chegar; estacionamento e pagamento só quando confirmados), /privacidade, 404.
7. Bloco "Avaliar no Google": título, uma linha, botão "Avaliar no Google". Sem estrelas, sem nota, sem "5 estrelas".
8. Microtextos: botões, mensagens do WhatsApp por contexto, alt de cada imagem (técnica + contexto, sem nome de cliente), descrições de vídeo, rodapé (com razão social e CNPJ).
9. Metas: title (≤ 60) e description (≤ 155) por página, com "salão em Lages", "Centro" e a técnica.

Critério de aceite: audit-compliance sem termo vetado; toda frase real com fonte; pendências listadas; commit "textos".
````

---

## PROMPT 6A — Home

````text
Leia CLAUDE.md, src/content e os componentes das sessões 3 e 4.

Tarefa: montar a home inteira abaixo da capa. Cada seção com um gesto próprio e o <Folio> numerado.
Escopo: src/pages/index.astro, src/components/secoes/**.

Seções (nesta ordem; tom capa/página indicado):
1. EDITORIAL (página): retrato da Edna (até 480 px) à esquerda, texto com <Capitular> à direita e a frase "Ver um sonho se tornar um lugar." em citação grande; botão "Ouvir a Edna" abre o vídeo edna-sonho com som e legenda (sob demanda).
2. SUMÁRIO (capa): os serviços como índice de revista — número de página em Ouro tabular, nome do serviço em Playfair, uma linha de descrição, link para /servicos/<id>. Hover: a linha ganha um fio Ouro e o número desliza 4 px.
3. ANTES E DEPOIS (página): 2–3 <ComparadorAntesDepois> com os pares confirmados (até confirmar, só o vídeo "transformacao" com antes e depois marcados no tempo e a etiqueta PROVISÓRIO nos pares de foto); legenda: técnica · profissional (se confirmado).
4. TRABALHOS (capa): grade editorial assimétrica (não masonry genérico): uma foto grande de capa por técnica (★) + duas menores; filtro por técnica com botões nativos; link "Ver todos" → /trabalhos.
5. DOIS REAIS OU UM CABELO (página): o quadro explicado em 3 linhas, a foto/still de uma transformação, link "Assista no Instagram" (sem embed de terceiros antes do consentimento).
6. EQUIPE #TalentoTodalinda (capa): fileira horizontal com retratos (ou CartaoTipografico), nome, função, anos; "Agendar com {nome}"; Dido com o trecho "dido" em loop mudo ao passar o mouse/foco.
7. A CASA EM 3D (página → capa): teaser da ilha 3D da sessão 6B (maquete + 3 ambientes) com "Abrir o tour completo" → /a-casa. Antes de carregar: pôster com a fachada desenhada em traço Ouro e o botão "Carregar o tour 3D" (não carrega sozinho em Save-Data/2g).
8. MOMENTO TODALINDA (página): fala da Edna sobre clientes que viram história (vídeo edna-clientes sob demanda, legenda HTML) + foto da equipe reunida.
9. O QUE DIZEM (capa): 3 avaliações literais em citação grande, "Cliente no Google" + selo + link da ficha. Sem nota agregada.
10. AVALIAR NO GOOGLE (página, bloco cheio): "Sua opinião ajuda outra mulher a nos encontrar." + botão "Avaliar no Google" (linkAvaliar) + linha pequena "Leva 1 minuto. Conte como foi, do jeito que foi." Sem estrelas.
11. A REVISTA (capa): as 3 edições como capas (imagem capturada do flip com Playwright, uso próprio da casa; se falhar, capa tipográfica) com link para o Flipsnack.
12. AGENDAR (página): o agendador embutido (sessão 7; até lá, botões por serviço com WhatsApp).
13. VISITE (capa): fachada (captura pequena com moldura fina), endereço grande com botão copiar, tabela de horário com hoje destacado e status ao vivo, mapa estático, botões Google Maps / Waze / Apple Mapas, telefone fixo, Instagram.
14. RODAPÉ: <Logo variante="mono">, endereço, WhatsApp e telefone escritos, horário, Instagram, razão social e CNPJ, privacidade, "Avaliar no Google".
- Botão flutuante "Agendar" no mobile, que some quando a seção 12 ou 13 está na tela.

Critério de aceite: capturas 390/1440 e reduced-motion da home inteira; Lighthouse mobile ≥ 95/100 (3D ainda não carregado); JS inicial ≤ 40 KB gzip; sem rolagem horizontal; commit "home".
````

---

## PROMPT 6B — A Casa em 3D

````text
Leia CLAUDE.md, docs/TODALINDA_MAPA_MIDIA.md (seção Espaço) e as capturas de tela. Pesquise e cite antes: Three.js (versão atual: GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder, renderer.setAnimationLoop, disposal), performance web 3D em celular, e as bibliotecas atuais de Gaussian Splatting para Three.js (estabilidade, licença, peso).

Tarefa: construir o tour 3D da casa, pronto para receber a planta e a captura real, sem inventar o layout.
Escopo: src/tres/**, src/components/casa3d/**, src/content/ambientes (schema e registros), src/pages/a-casa.astro, scripts/model-prepare.mjs, docs/3d/README.md.

Coleção "ambientes" (Zod): id, nome, andar (terreo | superior | externo | pendente), descricao, servicos[], midia[], camera {posicao, alvo}, fonteLayout (planta | captura | foto | pendente). Registros: fachada-e-gramado, recepcao (painel de filigrana), salao-de-cabelo (bancadas e espelhos com luz), lavatorios (sem foto: pendente), esmalteria, estetica, lounge-mezanino, parede-todalinda (as letras douradas que aparecem nas fotos de resultado). Todos "pendente" de layout até a planta; mídia a partir das capturas.

Arquitetura (três camadas):
A) MAQUETE (editorial): cena Three.js com material "papel" (Papel fosco) sobre fundo Noite, luz suave de janela, e os contornos dos ambientes em linhas Ouro finas (a moldura do logo vira o desenho do piso de cada ambiente, discreto). Carrega public/modelos/maquete.glb.
   - ENQUANTO NÃO HOUVER PLANTA: MAQUETE ESQUEMÁTICA honesta: o sobrado como volume simples de 2 andares com o gramado na frente e a porta marcada (proporções a partir das capturas da fachada, sem medidas reais) e os ambientes como blocos rotulados, com o selo visível "Representação esquemática — em breve, a casa real". Em produção, só aparece se o João aprovar (aviso no validate-config).
   - COM PLANTA (Prompt 3D): substitui pelo GLB feito a partir dela.
B) REALISMO: botão "Ver de verdade" carrega o splat do ambiente ativo sob demanda, com progresso e cancelamento; até existir, abre as fotos/vídeo do ambiente.
C) FALLBACK: sem WebGL, Save-Data/2g, reduced-motion ou erro: fotos do ambiente + lista de ambientes em HTML.

Interação:
- Ambientes viram botões em HTML (role=tablist) E hotspots na cena, sincronizados. Teclado: setas trocam, Enter abre o painel.
- Ao escolher: a câmera voa até a pose do ambiente (900–1200 ms, easing suave); o contorno Ouro daquele piso acende; painel lateral (mobile: gaveta inferior) com nome, texto, serviços feitos ali, mídia e o botão "Agendar {serviço}".
- Câmera limitada (órbita pequena, sem zoom infinito, sem atravessar paredes); arrastar no mobile não trava a rolagem fora da área do 3D.
- Pausa (setAnimationLoop(null)) fora da tela ou com aba oculta; libera memória ao sair.
- URL compartilhável: /a-casa?ambiente=esmalteria.

Pipeline:
- scripts/model-prepare.mjs: GLB/splat bruto de modelos-originais/ → otimizado (gltf-transform: dedupe, weld, simplify controlado, Draco ou Meshopt, KTX2; splat comprimido), relatório de peso e polígonos em docs/3d/.
- docs/3d/README.md: como a WAXLO entrega planta e captura (formato, escala, eixo, nomes dos ambientes, roteiro de captura por ambiente com celular: luz acesa, salão vazio, 1–2 min por ambiente).

Critério de aceite: /a-casa funciona com a maquete esquemática (com o selo), o fallback e a lista HTML; ilha 3D ≤ 180 KB gzip; 60 fps em desktop médio e ≥ 30 fps num Android intermediário (medir, capturas); home sem regressão de LCP; teclado e leitor de tela percorrem todos os ambientes; commit "a casa 3d".
````

---

## PROMPT 6C — Serviços e páginas internas

````text
Leia CLAUDE.md e src/content.

Tarefa: páginas internas com templates próprios (gesto de revista em cada uma).
Escopo: src/pages/{servicos/[id],tratamentos,trabalhos,equipe/index,equipe/[slug],nossa-historia,dois-reais-ou-um-cabelo,revista,como-chegar,perguntas-frequentes,privacidade,404}.astro.

- /servicos/<id> ("matéria"): capa da matéria com a foto ★ da técnica e a etiqueta; parágrafo-resposta; processo em passos numerados em Ouro tabular; galeria curta (3); antes e depois (se houver par confirmado); quem faz (se confirmado); FAQ (<details>); CTA fixo "Agendar {serviço}" que abre o agendador já com o serviço escolhido. Serviço sem mídia não gera página (trava).
- /tratamentos: glossário do fio em layout de "ficha técnica" (diagrama SVG próprio do fio em traço fino, desenhado em código, sem imitar as artes geradas).
- /trabalhos: galeria completa filtrável por técnica (botões nativos, URL ?tecnica=), lightbox acessível (dialog nativo, setas, Esc), legenda técnica · profissional.
- /equipe: grade de retratos/CartaoTipografico; /equipe/<slug>: perfil com função, anos, especialidades, trabalhos e "Agendar com {nome}".
- /nossa-historia: linha do tempo editorial (2017 → 2027) em colunas de revista, com as falas da Edna em vídeo sob demanda e a foto da equipe.
- /dois-reais-ou-um-cabelo: o quadro, temporadas (1ª encerrada em 27/02/2026; 2ª desde 01/03/2026), link para os episódios no Instagram; sem regras de promoção no site.
- /revista: as 3 edições (capas e link).
- /como-chegar: endereço grande com copiar; fachada; tabela de horário com status ao vivo e feriados; mapa estático e, após clique e consentimento, interativo; Google Maps / Waze / Apple Mapas; estacionamento (quando confirmado).
- /perguntas-frequentes: <details> nativos, agrupados.
- /privacidade (LGPD simples), 404 (curta, com uma capitular e três caminhos).

Critério de aceite: capturas 390/1440 de todas; nenhuma página vazia em produção; commit "paginas".
````

---

## PROMPT 7 — Agendar, avaliar, funil e LGPD

````text
Leia CLAUDE.md, src/lib/{agenda,whatsapp,avaliar}.ts.

Tarefa: o agendador (UI), as rotas de avaliação, o funil e a medição sem invadir.
Escopo: src/components/agendador/**, src/pages/{agendar,avaliar/index,avaliar/qr}.astro, src/components/consentimento/**, src/lib/medicao.ts, docs/FUNIL.md.

1. AGENDADOR (fase 1, WhatsApp), em 3 passos numa só tela (sem recarregar):
   (1) Serviço: chips com os serviços publicados + "Avaliação capilar" + "Não sei ainda";
   (2) Profissional: "Sem preferência" + profissionais confirmados para o serviço (se nenhum confirmado, o passo some);
   (3) Quando: dias ter–sáb dos próximos 14 dias (dom/seg e feriados desabilitados com motivo) + período (manhã | tarde | qualquer horário);
   + perguntas condicionais: "Química nos últimos 6 meses?" (cor/mechas) e "Primeira vez na Todalinda?"; nome opcional.
   Prévia da mensagem exata antes de enviar; botão "Enviar pelo WhatsApp". Nada é guardado. Funciona como formulário nativo (radios/selects) e sem JS cai no link geral. Pode abrir em gaveta a partir de qualquer CTA "Agendar {serviço}" já preenchido (?servico=, ?profissional=).
   Destino vem de config.agenda.destino (whatsapp agora); a UI não conhece o destino.
2. /avaliar: redirecionamento imediato para linkAvaliar() (meta refresh + link visível, noindex) e evento clique_avaliar(origem=qr|site|whatsapp via ?o=).
3. /avaliar/qr: página para imprimir (A6 e A5), QR gerado no build (SVG, sem serviço externo) apontando para /avaliar?o=qr, com o selo do logo, a frase e as instruções; @media print impecável.
4. Mensagem pós-atendimento para a recepção (docs/FUNIL.md, texto pronto para copiar): "Que bom ter você aqui hoje! Se puder contar como foi, isso ajuda muito outras mulheres a nos encontrarem: {SITE}/avaliar?o=whatsapp". Sem incentivo.
5. Medição: clique_agendar (servico, profissional, origem), agendador_enviado (servico, passo), clique_avaliar (origem), tour_3d_aberto (ambiente), clique_como_chegar, clique_instagram, clique_telefone. Ferramenta sem cookie (Plausible/Umami) OU GA4 só após consentimento; proponha e justifique.
6. Banner de consentimento com Aceitar e Recusar do mesmo peso; mapa interativo, embeds e medição com cookie só após aceitar; preferência alterável no rodapé.
7. docs/FUNIL.md: caminhos, mensagens exatas, e o roteiro "fora do site" do plano de avaliações (investigação §8).

Critério de aceite: e2e (Playwright, 390 px) gerando a mensagem exata em 8 cenários (serviço só; serviço + profissional; mechas com química; primeira vez; dia desabilitado; sem JS; abrindo de /servicos/loiros; abrindo de /equipe/dido-rodrigues); /avaliar redireciona; /avaliar/qr imprime em A6 (PDF de captura); nenhum request de terceiro antes do consentimento; commit "agendar e avaliar".
````

---

## PROMPT 8 — SEO local e GEO

````text
Leia CLAUDE.md e as seções 8 e 9 de docs/TODALINDA_INVESTIGACAO_CLIENTE.md. Pesquise e cite antes: schema.org (HairSalon, BeautySalon, NailSalon, OpeningHoursSpecification, Service, OfferCatalog sem preço, Person, FAQPage, VideoObject, ImageObject), Google Search Central (negócio local, avaliações autosservidas, vídeo, imagens), llms.txt.

Tarefa: deixar o site legível e citável por Google e IAs.
Escopo: src/components/seo/**, robots, sitemap, public/llms.txt (gerado), scripts/audit-seo.mjs, docs/SEO_GEO.md.

1. JSON-LD gerado da config: HairSalon (com additionalType BeautySalon e NailSalon) com name, legalName, taxID (CNPJ), address, geo, telephone (WhatsApp e fixo), url, sameAs (Instagram, ficha Google, Facebook), openingHoursSpecification, foundingDate 2017, founder Person "Edna Antoniolli", employee Person (equipe confirmada, com jobTitle), hasOfferCatalog (serviços publicados, sem preço); Service por página de serviço; FAQPage; BreadcrumbList; VideoObject com transcrição; ImageObject nas fotos de trabalho. SEM AggregateRating e sem Review.
2. Metas, canonical, Open Graph (imagem 1200×630 gerada no build: foto ★ + <Logo palavra> + "Lages/SC · desde 2017"), lang pt-BR.
3. NAP idêntico em todas as páginas; audit-seo falha se divergir (atenção: CEP 88501-000).
4. llms.txt: o que é, endereço, horário, desde quando, especialidades (cor, mechas, corte, penteado, make, esmalteria), equipe, como agendar, link de avaliação.
5. Conteúdo citável: parágrafo-resposta no topo; perguntas reais como títulos na FAQ; termos: salão de beleza em Lages, salão no Centro de Lages, morena iluminada em Lages, mechas em Lages, loiro perolado, ruivo cobre, colorista em Lages, esmalteria em Lages, unha em gel Lages, penteado e maquiagem Lages.
6. noindex enquanto indexar=false; sitemap e robots corretos quando virar true.
7. docs/SEO_GEO.md (checklist fora do site para o João): ficha do Google (site, descrição, serviços, atributos, 30+ fotos novas, responder TODAS as 57 avaliações começando pelas de 1 e 3 estrelas, link "Pedir avaliações"), plano de avaliações sem incentivo (QR na recepção e no espelho, mensagem pós-atendimento, meta de 8 por mês), corrigir o CEP do Facebook (88502-110 → 88501-000), NAP igual no Instagram, WhatsApp Business, Apple Business Connect e Bing; teste mensal sem login no Modo IA do Google: "melhor salão para morena iluminada em Lages", "salão de beleza Centro Lages", "colorista em Lages", "unha em gel Lages".

Critério de aceite: Rich Results Test e validator.schema.org sem erro (capturas); audit-seo verde; commit "seo e geo".
````

---

## PROMPT 9 — QA, conferência final e deploy

````text
Leia CLAUDE.md e docs/PENDENCIAS.md.

Tarefa: auditoria completa, conferência de normas (a única passada) e deploy.
Escopo: correções pontuais, docs/QA.md, docs/CONFERENCIA_FINAL.md, configuração de deploy.

1. Desempenho: Lighthouse mobile em todas as rotas (≥ 95/100); pesos (JS inicial, ilha 3D, GLB, splats, vídeos, fontes); LCP com e sem abertura; fps do 3D em desktop e Android intermediário; memória após abrir e fechar o tour 3 vezes.
2. Acessibilidade: axe; teclado do início ao fim (abertura → pular → capa → sumário → antes e depois (comparador) → agendador completo → WhatsApp); leitor de tela no agendador e no tour; contraste; reduced-motion; zoom 200%; pausar vídeo; legendas WebVTT nas falas.
3. Navegadores: Chrome, Safari iOS (WebKit), Firefox; Android 390 px; WebGL desligado; JS desligado (agendador cai no link).
4. ACABAMENTO "CLIENTE EXIGENTE": revise cada página como diretor de arte de revista: viúvas e órfãs (text-wrap: balance/pretty, &nbsp;), capitulares alinhadas à linha de base, fólio consistente, alinhamentos ópticos, ritmo vertical, cortes de foto (nunca cortar o rosto ou as pontas do cabelo do resultado), estados de foco, textos cortados em 390 px, aspas tipográficas, travessões, acentos, caixa alta consistente. Capturas antes e depois.
5. Conferência de normas: CDC/CONAR (sem superlativo comparativo, sem preço/promoção/sorteio); LGPD (consentimento real; agendador sem coleta); direito de imagem (autorizado pelo João: clientes do repositório, equipe, influenciadoras; nenhuma criança); Google (sem AggregateRating; sem incentivo a avaliação; avaliação de funcionário fora); procedimentos invasivos fora; termos vetados. NÃO afrouxe nenhuma trava.
6. Deploy: hospedagem estática (Vercel por padrão), SITE_URL por env, cabeçalhos (CSP por hash com exceções do WebGL/worker documentadas, HSTS, Referrer-Policy, Permissions-Policy), cache longo para /media e /modelos com hash, brotli para GLB/splat, preview com noindex; /avaliar sem cache.
7. docs/QA.md com números e capturas; docs/CONFERENCIA_FINAL.md com o que foi conferido e o que depende do João.

Critério de aceite: números no relatório; nenhuma trava afrouxada; commit "qa e deploy".
````

---

## PROMPT 3D — Planta e captura reais (usar quando chegarem)

````text
Leia CLAUDE.md, docs/3d/README.md e src/content/ambientes.

Tarefa: substituir a maquete esquemática pela real e ligar o realismo.
[Material: planta ou medidas (arquivo, escala, unidade, andares) · GLB modelado (se houver) · capturas por ambiente (arquivos, app usado) · fotos do espaço em alta]

1. Se vier só a planta/medidas: modele com Three.js procedural OU gere o GLB no Blender por script (paredes, escada, mezanino, aberturas, janelas, fachada com a porta, gramado; bancadas, lavatórios, esmalteria e maca como volumes simples na posição real). Escala real em metros. fonteLayout "planta" em cada ambiente.
2. Se vier GLB pronto: rode model:prepare e confira escala, eixos e nomes.
3. Splats: model:prepare por ambiente; alinhe cada splat com a maquete (matriz salva em ambientes); confira peso e qualidade.
4. Atualize poses de câmera, serviços por ambiente e remova o selo "esquemática".
5. Meça fps, peso e memória de novo; capturas antes e depois.

Critério de aceite: nenhum ambiente com fonteLayout "pendente"; pesos dentro do orçamento; commit "3d: casa real".
````

---

## PROMPT A — Agenda online, fase 2 (usar quando o João escolher)

````text
Leia CLAUDE.md, src/lib/agenda.ts e src/components/agendador.

Tarefa: ligar a agenda online sem trocar a interface do agendador.
[Escolha: (a) Trinks/Avec/Booksy — URL pública de agendamento por serviço/profissional; ou (b) agenda própria WAXLO — endpoint, autenticação, contrato de horários livres e de criação de reserva]

1. (a) link-externo: mapear cada serviço/profissional para a URL do provedor; o agendador mostra "Agendar online" (primário) e "Prefiro pelo WhatsApp" (secundário). Sem embed antes do consentimento se o provedor usar cookie.
   (b) api: buscar horários livres reais (dia → horários), reservar com nome e WhatsApp (consentimento LGPD explícito, finalidade e retenção documentadas), confirmação na tela e mensagem de confirmação pelo WhatsApp da casa; fila e erro com volta para o WhatsApp.
2. Política de privacidade atualizada (dados coletados agora).
3. Medição: agenda_online_iniciada, agenda_online_concluida, fallback_whatsapp.
4. e2e dos caminhos novos + os 8 cenários antigos continuam verdes.

Critério de aceite: fase 1 intacta como fallback; nenhum dado guardado sem consentimento; commit "agenda online".
````

---

## PROMPT L — Nova mídia (reutilizável)

````text
Leia CLAUDE.md e docs/MIDIA_CATALOGO.md.

Tarefa: incorporar a mídia nova de media-novas/ sem quebrar nada.
[Lista: arquivo · o que é · onde entra · pessoa/técnica · par antes-depois · pode ter som? · crédito]

1. Inventário, folha de contato, avaliação (nitidez, luz, texto queimado, música, criança: se houver, naoUsar).
2. git mv para media-originais/; registros no manifesto.
3. Trechos, recortes, pôsteres e derivados (mesma régua da sessão 1).
4. Encaixe por tipo: fotos do espaço em alta → substituem as capturas (Visite, A casa, 3D, Open Graph); retratos da equipe → trocam o CartaoTipografico; originais do filme → abertura e capa sem música; pares de antes e depois confirmados → comparadores (remove PROVISÓRIO); mídia de um serviço novo → o serviço passa a ser publicável (regra do João).
5. Remova selos PROVISÓRIO que deixaram de valer; atualize PENDENCIAS.
6. Capturas antes e depois das páginas afetadas.

Critério de aceite: build verde; LCP não piora; nada naoUsar publicado; commit "midia: <resumo>".
````

---

## PROMPT D — Novo dado (reutilizável)

````text
Leia CLAUDE.md e src/config.

Tarefa: atualizar dados confirmados pelo João, só na config e no conteúdo, e propagar.
[Dados: ex.: link "Pedir avaliações" = https://g.page/r/…/review; mês de abertura 2017; ouro oficial #…; quem faz cada serviço; estacionamento; formas de pagamento; cartão-presente; noiva fora do salão; acessibilidade; limpeza de pele confirmada (sim/não); identidade das fotos prováveis (Isabela, Andressa); domínio; aprovação da maquete esquemática em produção (sim/não)]

Passos: trocar opcional()/bloqueante()/aviso() por confirmado(valor, "João, <data>"); rodar validate-config, testes, audit-seo (NAP) e build; capturas das páginas afetadas; atualizar PENDENCIAS e docs/SEO_GEO.md se for NAP.
Critério de aceite: testes verdes; nenhum texto com o valor antigo (busca no dist/); commit "dados: <resumo>".
````

---

## C. O que falta (não trava o início; trava a produção onde indicado)

**Trava a produção**
1. **Link "Pedir avaliações"** do Perfil da Empresa. Sem ele, `/avaliar` cai na ficha e o validate-config avisa.
2. Aprovação, ou não, da **maquete esquemática** enquanto não houver planta.
3. **Quem faz cada serviço.** Sem isso, o agendador mostra só "Sem preferência".

**Importante**
4. **Fotos do espaço em alta.** Hoje são capturas de ~680 px; a lista de fotos está no mapa de mídia.
5. **Retratos em alta** de Dido, Marina, Thaynara e Karine. Hoje só existem em 150 px ou como arte.
6. **Originais do filme institucional**, sem música.
7. **Planta ou medidas** dos dois andares.
8. Confirmar a identidade das fotos prováveis da Isabela e da Andressa, e os pares de antes e depois.
9. Mês de abertura (10 anos), ouro oficial, logo horizontal, domínio.
10. Estacionamento, pagamentos, cartão-presente, noiva fora do salão, acessibilidade, limpeza de pele.

**Fora do site (já pode começar)**
11. Responder as 57 avaliações, começando pelas negativas.
12. Gerar o link "Pedir avaliações" e começar a mensagem pós-atendimento.
13. Corrigir o CEP no Facebook.
