# SEO e GEO: Todalinda legível e citável por Google e IAs

Sessão 8. O site faz a parte técnica, descrita no item 1. O resto depende da casa e do João, **fora do site**: a lista dos itens 2 a 6. A referência é a investigação, §8 (avaliações) e §9 (como as IAs veem a casa).

---

## 1. O que o site já faz

### Dados estruturados (JSON-LD, gerado da config)

| Página | JSON-LD |
|---|---|
| Capa e Como chegar | `HairSalon` com `additionalType` BeautySalon e NailSalon. Leva: nome, razão social, CNPJ (`taxID`), endereço, `geo`, telefone fixo, WhatsApp (`contactPoint`), `sameAs` (Instagram e ficha do Google), `openingHoursSpecification` (ter–sáb, 9h–19h), `foundingDate` 2017, `founder` Edna Antoniolli, `employee` (equipe confirmada, com `jobTitle`), `knowsAbout`, `hasOfferCatalog` (serviços publicados, **sem preço**) |
| `/servicos/<id>` | `Service` (com `provider` → o salão) + `FAQPage` (as perguntas da matéria) + `BreadcrumbList`; em Loiros, também o `VideoObject` do Dido com transcrição |
| `/perguntas-frequentes` | `FAQPage` (as perguntas reais, que também são os títulos h3 da página) + `BreadcrumbList` |
| `/equipe/<slug>` | `Person` (função, especialidades, `worksFor` → o salão) + `BreadcrumbList`; Edna e Dido com `VideoObject` |
| `/nossa-historia` | `VideoObject` das falas da Edna, com a transcrição |
| `/trabalhos` | `ImageGallery` com um `ImageObject` por foto (legenda técnica · profissional, `creditText` Todalinda, `copyrightNotice`) |
| demais | `BreadcrumbList` |

**Sem `AggregateRating` e sem `Review`**, em lugar nenhum:

- o Google não mostra avaliações que o próprio negócio publica sobre si ("self-serving");
- o site não mostra a nota.

O `uploadDate` dos vídeos é a data em que o arquivo entrou **neste site** (1º commit do original), como o schema.org define. A data do post no Instagram não está no repositório.

### Metas, Open Graph, idioma

- Todas as páginas têm `lang="pt-BR"`, título, descrição e um único `h1`.
- O Open Graph é uma imagem **1200×630 gerada no build** (`scripts/gerar-og.mjs`): a foto ★ da técnica, a palavra TODALINDA do logo oficial e "Lages/SC · desde 2017". São uma por serviço mais a da capa.
- Com `PUBLIC_SITE_URL` definido, o site ganha `canonical` e `og:url` absolutos. As URLs canônicas não têm barra no fim (`/servicos/loiros`): configure o servidor para servir assim, sem redirecionar.

### NAP idêntico

Nome, endereço e telefone vêm de `src/config/contato.ts`. O CEP é **88501-000**. `pnpm audit-seo` falha se alguma página, o JSON-LD ou o `llms.txt` tiverem:

- outro CEP, inclusive dentro de atributos e do JSON;
- outro telefone, `tel:` ou número de WhatsApp;
- outra grafia de "Rua Lauro Müller, 574".

### Indexação

- **Hoje: `indexar = false`.** Todas as páginas levam `noindex`. O `robots.txt` libera o rastreio, para o Google conseguir ver o `noindex`, e não anuncia sitemap. O `sitemap.xml` sai vazio.
- **Na sessão 9**, depois da conferência final, com `PUBLIC_SITE_URL=https://<domínio>` e `PUBLIC_INDEXAR=sim`:
  - as páginas públicas passam a `index, follow`;
  - o `robots.txt` anuncia `Sitemap: <domínio>/sitemap.xml`;
  - o sitemap lista 27 URLs.

  Testado com um domínio de exemplo: auditoria verde.
- `/_*` (revisão interna) e `/avaliar*` ficam sempre fora: noindex e `Disallow`.

### llms.txt

`/llms.txt` é gerado no build, no formato proposto em llmstxt.org: título, resumo, listas de links. Traz o que é a casa, o endereço com CEP, o horário, "desde 2017", as especialidades, a equipe com a função de cada uma, como agendar e o link de avaliação. É uma proposta e não um padrão: o Google disse que não usa. Custa pouco e ajuda IAs que leem o arquivo.

### Conteúdo citável

- Toda página abre com o **parágrafo-resposta** (quê + onde + como).
- A auditoria exige que estes termos apareçam no site:
  - salão de beleza em Lages · salão no Centro de Lages · morena iluminada em Lages · mechas em Lages;
  - loiro perolado · ruivo cobre · colorista em Lages;
  - esmalteria em Lages · unha em gel em Lages · penteado e maquiagem em Lages.

### Validação

O Rich Results Test e o validator.schema.org não abrem neste ambiente: a rede é bloqueada. No lugar, o `pnpm audit-seo` confere cada bloco JSON-LD contra o **vocabulário oficial do schema.org (v30.1, offline)**, em `scripts/dados/schemaorg/`:

- os tipos existem;
- cada propriedade vale para o tipo;
- cada valor está no tipo esperado;
- os campos obrigatórios do Google estão presentes (LocalBusiness, VideoObject, BreadcrumbList, FAQPage).

Os construtores também são tipados pelo `schema-dts`, então um erro de tipo quebra o `astro check`. Para provar que a auditoria pega erro de verdade, injetei numa cópia do build um CEP 88502-110, um telefone diferente, um `aggregateRating`, uma propriedade inventada e um tipo errado: as cinco falhas foram apontadas.

**Pendente (preview publicado):** rodar as páginas `/`, `/servicos/loiros`, `/perguntas-frequentes`, `/equipe/dido-rodrigues` e `/nossa-historia` no Rich Results Test e no validator.schema.org, e guardar as capturas em `docs/capturas/`.

---

## 2. Checklist fora do site (para o João e a casa)

### Ficha do Google (Perfil da Empresa)

- [ ] **Site:** colocar o domínio definitivo quando o site for ao ar.
- [ ] **Descrição** (até 750 caracteres), sem preço e sem superlativo. Sugestão:
  > Salão de beleza no Centro de Lages/SC desde 2017. Coloração (morena iluminada, loiros perolados e manteiga, ruivo e cobre), mechas com teste de mecha antes, corte, penteado e maquiagem e esmalteria (unha em gel com blindagem). Todo procedimento começa pela avaliação do fio. Rua Lauro Müller, 574. Terça a sábado, das 9h às 19h.
- [ ] **Categorias:** principal "Salão de beleza"; adicionais "Cabeleireiro", "Colorista" (se existir), "Manicure", "Maquiador(a)".
- [ ] **Serviços:** cadastrar os mesmos 8 do site, **sem preço**: Morena iluminada, Loiros, Ruivo e cobre, Castanho e mocha, Mechas, Corte, Penteado e make, Esmalteria.
- [ ] **Atributos:** só os verdadeiros (Wi-Fi, acessibilidade, formas de pagamento), quando a casa confirmar.
- [ ] **30+ fotos novas**, em luz do dia, sem criança: fachada com a placa, recepção, salão, lavatórios, esmalteria, lounge, equipe e trabalhos.
- [ ] **Responder TODAS as 57 avaliações**, começando pelas de 1 e 3 estrelas, com tom calmo, convite para conversar e sem discutir. Depois, responder cada nova em até 48 h.
- [ ] **Link "Pedir avaliações"**: gerar no Perfil e mandar para o João (vira `PUBLIC_GOOGLE_REVIEW_URL`).
- [ ] A avaliação "DIDO Rodrigues · 5★" é de um profissional da casa. O ideal é removê-la na conta dele.

### Plano de avaliações (sem incentivo)

- [ ] **QR na recepção e no espelho:** imprimir `/avaliar/qr` (A6 no balcão, A5 na parede). Reimprimir quando o domínio existir.
- [ ] **Mensagem pós-atendimento** pelo WhatsApp, para **todas** as clientes do dia (texto pronto em `docs/FUNIL.md`):
  > Que bom ter você aqui hoje! Se puder contar como foi, isso ajuda muito outras mulheres a nos encontrarem: {SITE}/avaliar?o=whatsapp
- [ ] **Meta: 8 avaliações por mês** (100 em 6 meses).
- [ ] Nunca brinde, desconto, sorteio, "avalie 5★" nem pedir só às satisfeitas. A equipe não avalia a casa.

### NAP igual em toda parte

O NAP certo é **Todalinda · Rua Lauro Müller, 574 · Centro · Lages/SC · CEP 88501-000 · (49) 3018-0082 · WhatsApp (49) 99177-2089**.

- [ ] **Facebook:**
  - corrigir o CEP de **88502-110 → 88501-000**;
  - conferir horário e telefones;
  - mandar ao João o endereço exato da página, que entra no `sameAs` (`contato.facebook`).
- [ ] **Instagram** (@somostodalinda): endereço, telefone e link do site na bio iguais aos de cima.
- [ ] **WhatsApp Business:** endereço, horário, site e descrição iguais.
- [ ] **Apple Business Connect:** reivindicar o local com o mesmo NAP, as mesmas fotos e o mesmo horário.
- [ ] **Bing Places:** importar do Google ou cadastrar com o mesmo NAP.

### Teste mensal no Modo IA do Google (sem login, aba anônima)

Uma vez por mês, anotar em quem aparece, em que posição e o que a IA diz da Todalinda:

1. "melhor salão para morena iluminada em Lages"
2. "salão de beleza Centro Lages"
3. "colorista em Lages"
4. "unha em gel Lages"

A primeira pergunta usa "melhor" porque é assim que as clientes buscam; o site não usa a palavra. A meta é a IA citar a colorimetria, a equipe e o agendamento pelo site/WhatsApp, e não mais "pela página no Facebook".

---

## 3. Fontes (pesquisadas em 18/11/2026)

- Google Search Central, dados estruturados de [negócio local (LocalBusiness)](https://developers.google.com/search/docs/appearance/structured-data/local-business?hl=es) e [versão pt-BR](https://developers.google.com/webmasters/business-location-pages?hl=pt-br): campos, `openingHoursSpecification` dia a dia, horários especiais com `validFrom`/`validThrough`.
- Google, [avaliações autosservidas não aparecem para LocalBusiness/Organization (2019)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful), e a atualização de 2026 sobre avaliações com incentivo ([Search Engine Roundtable](https://seroundtable.com/google-updates-rules-reviews-rich-results-28232.html), [Whitespark](https://whitespark.ca/blog/local-businesses-say-goodbye-to-review-snippets-in-google/)).
- Google, [dados estruturados de vídeo](https://developers.google.com/search/docs/appearance/structured-data/video?hl=th) e [boas práticas de vídeo](https://developers.google.com/webmasters/videosearch/intro): `name`, `thumbnailUrl` e `uploadDate` obrigatórios.
- Google, [metadados de imagem](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata?hl=pt-br): `creator`, `creditText`, `copyrightNotice`, `license` ([SEJ](https://www.searchenginejournal.com/google-updates-image-structured-data/467881/)).
- FAQ: [desde 2023 os resultados ricos de FAQ ficaram restritos](https://searchengineland.com/google-reduces-the-visibility-of-howto-and-faq-rich-results-in-search-430452) e [em 2026 foram retirados](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/). O `FAQPage` continua válido no schema.org e legível por IAs, mas não dá destaque visual no Google.
- schema.org: [HairSalon](https://schema.org/HairSalon) (subtipo de HealthAndBeautyBusiness ← LocalBusiness; irmãos BeautySalon e NailSalon; [hierarquia](https://hackage.haskell.org/package/metadata-0.4.3.0/docs/src/Text-HTML5-MetaData-Schema-HealthAndBeautyBusiness.html)), [OfferCatalog](https://alt112012.schema.org/OfferCatalog) (exemplos com `Offer` → `Service` sem preço), [Service](https://schema.org/Service). O vocabulário usado na validação é o 30.1 (`scripts/dados/schemaorg/LEIA.md`).
- llms.txt: [resumo da proposta (Jeremy Howard, set/2024)](https://www.mdskills.ai/specs/llms-txt) e [análise de adoção](https://llmrefs.com/blog/what-is-llms-txt-file). O llmstxt.org não abriu daqui.
