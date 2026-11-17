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
