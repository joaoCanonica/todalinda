# Pendências

Lista viva. Cada item: o que falta · quem resolve · o que trava.

## Sessão 0 — Fundação (17/11/2026)

### Repositório
- **Arquivos-base:** os 4 existiam e foram movidos para `docs/` (avaliações → `docs/dados/avaliacoes-google.json`). Nada faltou.
- **SVG da marca:** estavam soltos em `assets/`; movidos (git mv) para `assets/marca/`, como o contexto e o pacote preveem.
- **`todalinda-logo-comparacao.jpg`** na raiz: o pacote diz que é "só para o João". Ficou onde está; o João decide se sai do repositório.
- **Bloco de contexto:** no `TODALINDA_PACOTE_PROMPTS_CODE.md` a última linha ("Relatório no fim…") aparece duplicada. O CLAUDE.md segue o bloco colado na sessão 0, sem a duplicata.

### Ferramentas
- **Transcrição local:** resolvido na sessão 1 (ambiente "todalinda" com os hosts do Hugging Face; modelo large-v3-turbo em `.ferramentas/hf`).
- **Git LFS para `modelos-originais/`:** não configurado. Só com autorização do João.
- **Node:** 22.x fixado (`engines` e projeto na Vercel). Com o intervalo aberto (`>=22.23.4`), a Vercel escolheu o Node 26 no primeiro deploy. Subir para o 26 é decisão futura, testando o build inteiro.

### Dados do cliente (vindos do pacote, seção C)
- Mês de abertura, estacionamento, pagamentos, cartão-presente, noiva fora do salão, acessibilidade: PENDENTE.
- Link oficial "Pedir avaliações" do Google: PENDENTE (fallback: ficha pelo cid).
- Ouro oficial / manual da marca e versão horizontal do logo: PENDENTE.
- Domínio definitivo (necessário para `site` no `astro.config.mjs`, sitemap e canonical): PENDENTE.

## Sessão 1 — Mídia (18/11/2026)

### Bloqueia publicação até confirmar (João / casa)
- **Idade das clientes** (regra "crianças: fora"): `f-859140964` e `f-860153001` (moça com aparelho nos dentes; 859140964 é ★ da morena iluminada) e a cliente de `v-transformacao` e do trecho `v-filme/iluminada` (+ `q-iluminada`), que é a mesma pessoa. Marcadas `crianca: "verificar"`; os derivados existem, mas o índice leva `bloqueio`. Se alguma for menor: trocar para `"sim"` (o schema força `naoUsar`).
- **Identidade provável:** Isabela (Captura 12-51-36) e Andressa (Captura 12-52-34): `confirmarIdentidade`.
- **Antes e depois:** os três pares são prováveis (`parAntesDepois.confirmado: false`).
- **Limpeza de pele:** a arte é assinada por Marianne Turossi (biomédica, terceira). Confirmar se ela atende na casa antes de criar o serviço.
- **Música do filme institucional:** direitos desconhecidos; os loops são mudos.

### Divergências do mapa (medido quadro a quadro)
- Transformação: o "antes" vai até **4,8 s** (mapa: 3 s).
- Unhas: desfoque em **2,9–4,1 s** (mapa: 5–6 s). Trechos usados: 0,0–2,8 e 4,3–9,1.
- Filigrana: o plano vai de **5,43 a 6,47 s**; o quadro foi tirado em 6,0 s (mapa: 5 s).
- Revelação no espelho começa em **11,4 s** (corte em 11,37 s); logo final entra em **36,3 s**.
- `801555796` não consta no mapa (iluminado bege; técnica a confirmar).

### Limites técnicos
- **16:9 dos loops do hero: não gerado.** O original é 720×1280; um recorte 16:9 daria 720×405 e corta o rosto ou o cabelo (o plano das ondas tem dois sujeitos empilhados). Precisa do original do filme em resolução maior. 4:5 foi gerado (720×900 e 544×680).
- Vídeos limitados a 720×1280 (Instagram). Nada foi ampliado.
- `v-mechas` foi gravado a 9 quadros/s: movimento entrecortado.

### Transcrições a revisar ouvindo
- `v-edna-depoimento-1` e `-2` têm trechos [revisar] em `docs/dados/falas.md` (nome do cartão "Obrigada por ser Toda Pontual", "a Ginei saiu", "hoje a Toda Linda é minha responsabilidade").
- `audioLiberado` dos dois depoimentos novos: decidir depois de ler o texto (hoje `false`, sem trechos).

### Compliance do texto das artes (para a sessão 5)
- O texto das artes tem promessa ("garanto", "menos frizz e mais duradouro", "reduz a quebra"), superlativo ("melhor abordagem", "o melhor") e "procedimentos faciais". Marcado com ⚠ em `docs/dados/textos-das-artes.md`; reescrever antes de publicar.

## Sessão 2 — Config e travas (18/11/2026)

Lista viva gerada pela config: `pnpm validate-config --tudo`. Resumo do que depende do João / da casa:

### Bloqueiam um recurso (o site usa fallback honesto)
- **Quem faz cada serviço** (`servicos[].profissionais` = bloqueante): até a casa confirmar, o agendador mostra só "Sem preferência"; a página do serviço pode mostrar a sugestão pelas especialidades com selo PROVISÓRIO (só no preview). Sugestão atual: cor e mechas → Isabela; corte → Dido, Andressa; tratamentos → Andressa; penteado e make → Dido, Andressa, Marina; esmalteria → Karine, Thaynara.
- **Link "Pedir avaliações"** do Perfil da Empresa (`PUBLIC_GOOGLE_REVIEW_URL`): até lá, /avaliar abre a ficha do Google (cid) e o preview avisa.
- **Domínio definitivo** (`PUBLIC_SITE_URL`): necessário para canonical e sitemap (sessão 8). Indexação segue desligada.

### Derrubam a produção hoje
- **Idade a confirmar** (regra "crianças: fora"): `f-859140964`, `f-860153001` e `v-transformacao` estão referenciadas por serviços e trabalhos. Em `MODO=producao` isso é trava. Resolver: confirmar maioridade (vira `crianca: "nao"`) ou tirar as referências.

### Dados opcionais (o site omite enquanto faltar)
- Mês de abertura, estacionamento, formas de pagamento, acessibilidade, cartão-presente, noiva fora do salão.

### Provisórios (selo PROVISÓRIO no preview)
- Ouro e ouro claro (medidos no logo).
- **Feriados:** presumido que a casa fecha nos feriados nacionais + Sexta-feira da Paixão + **22/11, Aniversário de Lages** (municipal). A data municipal veio de calendários de feriados (fontes secundárias); a lei municipal não foi localizada. Confirmar com a casa: fecha em quais? abre em véspera (24/12, 31/12)? Carnaval e Corpus Christi (pontos facultativos) foram tratados como dias normais. Data magna de SC (agosto) não incluída: confirmar.

### Decisões tomadas nesta sessão (revisar)
- **Avaliações:** além da do Dido (id 1, profissional da casa), excluí a **id 10** (cita massagem, serviço fora do site, e custo-benefício). Emojis são removidos das citações (a voz do site não usa emoji); o campo `editado` marca quais foram tocadas. "A V." e "Mandyshow" viram "Cliente no Google".
- **Tratamentos** não publica: não há foto/vídeo de tratamento no repositório (regra: serviço só com mídia). Precisa de uma imagem real ou de autorização para usar uma textura de fio.
- **Limpeza de pele** fica `opcional` e não publicada (arte de terceira; confirmar se a Marianne Turossi atende na casa).
- Textos de `resumo`, `processo` e `faq` dos serviços são rascunho funcional (`textoRevisado: false`); a sessão 5 reescreve.
- `especialidades` da equipe vêm da função informada pelo João; `servicos[]` de cada pessoa ficou vazio até a casa confirmar.

## Sessão 3 — Design system (18/11/2026)
- **Fonte da revista:** não foi possível abrir o Linktree/Flipsnack deste ambiente. Playfair Display segue como hipótese; João, confirmar no PDF da revista (se for outra, troca só `--fonte-titulo`).
- **Mapa estático:** sem imagem de mapa por ora (rede restrita, e nada de iframe de terceiros). O "Como chegar" mostra o cartão tipográfico com coordenadas, plus code e os três apps. Gerar uma imagem estática (OpenStreetMap, com atribuição) quando houver acesso.
- **Ouro oficial:** tokens Ouro e Ouro claro continuam PROVISÓRIOS.
- **Pedra recalibrada** para #756B64 (AA sobre Papel); o tom original virou "Pedra clara" (só sobre Noite). Ajuste do CLAUDE.md fica a critério do João.
- **Aspas da citação na página clara** usam Mocha, não Ouro (ouro sobre Papel reprova o contraste).

## Sessão 4 — Abertura e capa (18/11/2026)
- **Alternativa B** (loop "iluminada") usa a cliente com **idade a confirmar**: /_capa-b avisa e a auditoria trava em produção. A home usa a A ("ondas"), liberada. A marcação de idade agora é por trecho de vídeo (só "iluminada" e "logo-final").
- **Links das chamadas** (/trabalhos, /dois-reais-ou-um-cabelo, /a-casa) apontam para páginas das sessões 6A–6C; até lá dão 404 no preview.
- **"Agendar horário"** abre o WhatsApp geral; o agendador entra na sessão 7 (o botão fica igual, troca só o destino).
- **Meta description** da home: sessão 8 (SEO). Hoje o Lighthouse SEO dá 54 só por noindex + falta de description (esperado no preview).
- O quadro "revelação no espelho" e o loop "ondas" são do filme institucional com música de direitos desconhecidos: usados mudos.

## Sessão 5 — Textos (18/11/2026)

Todos os textos estão em `src/content/textos/` (revisão em **/_textos**). Frases reais vão com fonte (`real()`); o resto é redação.

### Para a Edna/casa confirmar ou autorizar
- **Manifesto "Não é sobre luxo. É sobre merecimento."** (legenda de 22/08/2026 no perfil pessoal da Edna): a investigação pede "usar com autorização e crédito". Usado em valores e na história; **confirmar a autorização**.
- **"Hoje sim temos fila de espera"**: atribuída à revista dos 5 anos (investigação §3). Conferir a edição exata.
- **Isabela na casa desde março de 2020** (revista 2023): confirmar.
- **Explicações técnicas** (blindagem nas unhas, mechas finas na morena iluminada, perolado/bege/manteiga): revisar com Isabela, Andressa e Thaynara.
- **Quem faz cada serviço:** os campos "quem faz" ficam vazios até a casa confirmar (o teste garante).
- **Duração dos atendimentos:** omitida em todas as páginas; a FAQ diz que "a recepção informa a estimativa".
- **Estacionamento, formas de pagamento, cartão-presente, noiva fora do salão, acessibilidade:** fora dos textos até confirmar (o teste barra essas palavras).
- **Feriados:** os textos dizem "em feriados, confirme pelo WhatsApp" (não afirmam que a casa fecha).
- **Domínio:** o cartão do QR monta "ou acesse <domínio>/avaliar" só quando `PUBLIC_SITE_URL` existir.
- **Links das 3 revistas (Flipsnack):** pegar os endereços no Linktree.
- **Regras do Dois Reais ou um Cabelo:** o site não fala de regras nem de prêmio; manda para o Instagram.

### Decisões de texto
- **"Revista nº 1" virou "Edição 01" / "a primeira revista":** "nº 1" está na lista de termos vetados (seção 8).
- **Fala da Thaynara sem "na durabilidade eu garanto"** (promessa). Fala da Kah sem "oferecer o melhor" (termo vetado).
- **Página do vídeo "Toda Pontual":** a descrição fala do cartão, sem sorteio (o site não divulga sorteio).
- **Tratamentos**: o texto avisa que tratamento capilar é técnica de salão, não de saúde, e que queda pede dermatologista.
- **Coleção `servicos`**: processo, FAQ e resumo agora vêm de `src/content/textos/servicos.ts` (teste de sincronia).

## Sessão 6A — Home (18/11/2026)
- **Idade a confirmar:** o vídeo "transformação" aparece em Antes e depois **só no preview** (com PROVISÓRIO). Em produção, as seções escondem sozinhas a mídia "verificar" (`src/components/secoes/util.ts`) em vez de travar o build; com a confirmação, ela volta.
- **Pares de foto antes/depois:** prováveis, com PROVISÓRIO até a casa confirmar.
- **Revista:** capas tipográficas. A captura do flip (Flipsnack) não foi possível daqui (rede) e os links ainda não estão no repositório.
- **3D:** o bloco "A casa" mostra a fachada em traço Ouro (desenhada a partir da captura) e leva a /a-casa; a ilha 3D entra na sessão 6B.
- **Agendar:** botões por serviço → WhatsApp, até o agendador da sessão 7 (id #agendar reservado).
- **Rodapé:** o logo mono oficial (em Ouro) entra como arquivo carregado tarde (`public/marca/`), não inline: inline somava 84 KB ao HTML de toda visita.
- **Tabela de horário** ainda diz "Feriados: fechado" (PROVISÓRIO, componente da sessão 3); alinhar com o texto "confirme pelo WhatsApp" quando a casa responder.
- **LCP simulado** do Lighthouse: 2,03–2,10 s (a simulação espera o HTML inteiro, 26 KB comprimidos); medido com 4G real: 1,58–1,64 s.

## Sessão 6B — A casa 3D (18/11/2026)
- **Depende do João — maquete esquemática em produção:** `/a-casa` mostra no preview uma maquete esquemática (volume do sobrado com proporções das fotos da fachada; ambientes como blocos com nome) **sempre com o selo** "Representação esquemática — em breve, a casa real". Em produção ela só aparece com `maqueteEsquematica.aprovadaPeloJoao = true` (`src/config/casa3d.ts`); sem isso, a página mostra foto da fachada + lista de ambientes, e o `validate-config` avisa (`3d-esquematica`).
- **Planta e medidas:** nenhum layout interno foi inventado. Os 8 ambientes estão com `fonteLayout: "pendente"` (fachada: `"foto"`); a disposição dos blocos é só uma grade de leitura. Com o GLB da planta em `public/modelos/maquete.glb`, a trava `3d-inventado` exige fonte para cada ambiente. Como entregar: `docs/3d/README.md`.
- **Andares:** só fachada (fora) e lounge/mezanino (andar de cima) são conhecidos; os outros 6 aparecem como "Andar a confirmar".
- **Lavatórios:** sem foto no repositório (painel diz "Fotos deste ambiente em breve").
- **Captura real ("Ver de verdade"):** nenhuma ainda; o botão abre as fotos do ambiente. Roteiro de captura com celular em `docs/3d/README.md`. Spark (2.4.0, MIT) pesa ~0,95 MB gzip e só baixa ao clicar num ambiente que tenha splat.
- **KTX2:** `toktx` não está instalado neste ambiente; o `model:prepare` comprime texturas em WebP e anota no relatório. Instalar KTX-Software antes de processar um GLB com texturas.
- **FPS medidos em renderização por software** (SwiftShader, sem GPU): 53–58 fps em 1440 px e 44–60 fps em 390 px com CPU 4× mais lenta. Falta medir num Android intermediário de verdade.
- **Abertura:** o botão "Pular" agora some sem fade (o Lighthouse media o contraste no meio do fade e dava 97 em acessibilidade de forma intermitente).

## Sessão 6C — Páginas internas (18/11/2026)
- **Agendador com o serviço escolhido:** o CTA fixo "Agendar {serviço}" de cada matéria abre hoje o WhatsApp com a mensagem do serviço e carrega `data-agendar-servico="<id>"`; o agendador da sessão 7 intercepta esse atributo e abre já com o serviço marcado. O 404 aponta "Agendar" para `/#agendar` até existir `/agendar`.
- **Quem faz:** nenhum serviço tem profissional confirmado. As matérias mostram a sugestão pelas especialidades **só no preview** (PROVISÓRIO); em produção o bloco some.
- **Antes e depois:** nenhum par confirmado. Os pares prováveis aparecem só no preview; em produção a seção não existe.
- **Trabalhos assinados:** nenhuma foto tem autoria confirmada; os perfis da equipe dizem que os trabalhos aparecem quando a casa confirmar.
- **Tratamentos e limpeza de pele:** sem mídia/publicação, não geram matéria (`/servicos/tratamentos` e `/servicos/limpeza-de-pele` dão 404). O glossário do fio fica em `/tratamentos`.
- **Retratos:** Dido, Karine, Thaynara e Marina sem retrato em alta: grade com cartão tipográfico; no perfil, monograma com "Retrato em breve".
- **Revista:** links do Flipsnack pendentes (estão no Linktree). Capas tipográficas até lá.
- **Mapa:** a imagem estática de mapa não foi gerada (tile.openstreetmap.org bloqueado neste ambiente); no lugar, um cartão com coordenadas e Plus Code. O mapa interativo é o embed do OpenStreetMap, carregado só depois do clique, com aviso de privacidade (texto novo em `/privacidade`). **Não testado aqui** (rede bloqueada): conferir no preview publicado.
- **Estacionamento:** opcional e não confirmado: `/como-chegar` não fala de estacionamento.
- **Feriados:** a lista de próximos feriados sai do calendário em `src/config/horario.ts`; a frase "confirme pelo WhatsApp" continua com PROVISÓRIO até a casa dizer se fecha nos feriados. Aniversário de Lages (22/11) com lei municipal a confirmar.
- **/a-casa** mantém o cabeçalho próprio da sessão 6B; as demais internas usam `src/layouts/Interna.astro` (sumário no desktop, menu nativo `<details>` no celular).

## Sessão 7 — Agendar e avaliar (18/11/2026)
- **Depende do João — ferramenta de medição:** proposta em `docs/FUNIL.md` §4: **Plausible** (sem cookie, sem dado pessoal, ~1 KB). Definir `PUBLIC_MEDICAO=plausible` e `PUBLIC_MEDICAO_ID=<domínio>` (ou Umami). Sem isso, a medição fica desligada (eventos só em `window.__medicao` no preview). Não testado contra o serviço real (rede bloqueada aqui).
- **Domínio definitivo:** o QR de `/avaliar/qr` aponta para `{SITE}/avaliar?o=qr` só com `PUBLIC_SITE_URL`; até lá, aponta direto para a ficha do Google (sem medir a origem). **Reimprimir o cartão quando o domínio existir.** A mensagem pós-atendimento também usa `{SITE}`.
- **Link "Pedir avaliações":** `/avaliar` usa a ficha (cid) até chegar `PUBLIC_GOOGLE_REVIEW_URL`.
- **Quem faz:** com nenhuma profissional confirmada, o passo "Com quem?" some em produção. No preview aparece a sugestão (selo provisório). A pessoa escolhida no perfil (`?profissional=`) sempre aparece: é pedido da cliente, não afirmação da casa.
- **Feriados:** o agendador desabilita os feriados porque `horario.fechaNosFeriados` está presumido como `true` (aviso). Se a casa abrir em algum, mudar a config.
- **Edna:** "Falar com a Edna" vai direto ao WhatsApp; a fundadora não aparece como opção de horário. Confirmar se ela atende.
- **LCP da home:** com a 4G aplicada (Lighthouse/devtools), segue em 1,6 s. Na simulação (Lantern), passou de 2,0–2,1 s para 2,2 s, pelo HTML do agendador na seção Agendar. Os scripts do agendador e do aviso já carregam depois do LCP.

## Sessão 8 — SEO e GEO (18/11/2026)
- **Domínio definitivo (`PUBLIC_SITE_URL`):** sem ele não há canonical/og:url absolutos, sitemap nem medição (o Plausible usa o domínio como "site"). Com ele + `PUBLIC_INDEXAR=sim` (sessão 9), o site indexa: testado com domínio de exemplo, audit-seo verde, sitemap com 27 URLs. O servidor precisa servir as páginas **sem barra no fim** (as canônicas são `/servicos/loiros`).
- **Validadores online:** Rich Results Test e validator.schema.org não abrem neste ambiente (rede). A validação é local (vocabulário schema.org 30.1 + campos obrigatórios do Google, `pnpm audit-seo`). Os JSON-LD prontos para colar estão em `docs/capturas/2026-11-18/jsonld/`; **fazer as capturas no preview publicado.**
- **Facebook:** o endereço da página não está no repositório; entra em `contato.facebook` (sameAs) quando o João mandar. Corrigir lá o CEP 88502-110 → 88501-000.
- **Vídeos (`uploadDate`):** usa a data em que o arquivo entrou no site (1º commit), conforme o schema.org; a data do post no Instagram não está no repositório.
- **FAQ:** o Google retirou os resultados ricos de FAQ em 2026; o `FAQPage` fica pelo schema.org e pelas IAs.
- **Plausible:** padrão do site (decisão do João). Liga sozinho com o domínio; só depois do "Aceitar".
- **LCP simulado das matérias:** oscila entre ~0,9 e ~2,9 s (em /servicos/loiros e /corte) porque o elemento LCP alterna entre o parágrafo-resposta e a foto da capa; a versão anterior oscila igual (A/B no mesmo servidor). Rever na sessão 9 (ex.: `sizes` menor na capa do celular).
- **Checklist fora do site** (ficha do Google, 57 respostas, NAP no Facebook/Instagram/WhatsApp Business/Apple/Bing, teste mensal no Modo IA): `docs/SEO_GEO.md` §2.

## Sessão 9 — QA, conferência e deploy (18/11/2026)
- **Produção bloqueada (correto):** 5 travas `midia-crianca`. São as mídias com idade a confirmar: `f-859140964`, `f-860153001`, `v-transformacao` (e o trecho `iluminada` do `v-filme`, só na capa B de revisão). O João confirma ou a mídia sai. Detalhes em `docs/CONFERENCIA_FINAL.md`.
- **Deploy:** `vercel.json` gerado do build (`pnpm deploy:headers`, conferido no pós-build) e `.github/workflows/deploy.yml` (build com ffmpeg e Chromium no GitHub, `vercel deploy --prebuilt`). Faltam a conta e o projeto na Vercel, os segredos `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` no GitHub e as variáveis por ambiente. Nada foi publicado.
- **Safari iOS e Firefox:** este ambiente só tem Chromium. Roteiro manual em `docs/QA.md` §3.
- **fps do 3D medidos com WebGL por software** (SwiftShader). Falta medir num Android intermediário real.
- **Volta pelo histórico (bfcache):** o tour recria a cena ao voltar (`pageshow`). O Chromium automatizado daqui não usa o bfcache, então esse caminho está coberto pelo código, não por teste.

## Atualização de 19/11/2026 (decisões do João)
- **Idades:** "são todos maiores de idade, até que se saiba". As 6 marcações `crianca: verificar` viraram `nao`, com a origem anotada no manifesto e na curadoria:
  - `f-859140964`, `f-860153001`, `v-transformacao` e `q-iluminada`;
  - os trechos `iluminada` e `logo-final` do `v-filme`.

  **A produção está liberada (0 travas).** A trava de criança continua ativa: se alguma for menor, basta marcar `sim`.
- **Maquete esquemática aprovada:** vai à produção com o selo "Representação esquemática — em breve, a casa real", até chegar a planta.
- **Domínio `todalinda.com.br`:** fixado na config. Ainda não está registrado nem apontado. **Não imprimir o cartão QR antes de o domínio estar no ar.**
- **Link "Pedir avaliações":** pendente. A rede deste ambiente não lê o Google Maps, e a extensão do Chrome não estava conectada nesta sessão. Passo a passo em `docs/DEPLOY.md`. Até lá, `/avaliar` abre a ficha do Google.
- **Deploy (atualizado em 19/11):** o primeiro build na Vercel falhou (sem ffmpeg, sem Chromium, Node 26). Corrigido: o build agora roda na própria Vercel (ffmpeg do pacote `ffmpeg-static`, OG sem navegador, Node 22.x, derivados no cache de build). O GitHub Actions ficou só manual. Ver `docs/DEPLOY.md`.
- **Link de avaliação (19/11, 2ª tentativa):** o João mandou um link de busca do Google (`google.com/search?…q=toda+linda+lages&si=…&uds=…`). Ele **não serve** como `PUBLIC_GOOGLE_REVIEW_URL`:
  - é o link da página de resultados, não do formulário de avaliação;
  - carrega parâmetros de sessão (`sxsrf`, `si`, `uds`, `ved`, `biw`) que expiram ou mudam de pessoa para pessoa;
  - não traz o identificador da ficha (Place ID, `ChIJ…`).

  `/avaliar` segue na ficha estável (`maps?cid=14959576611857227956`). O link certo começa com `https://g.page/r/` e termina em `/review`: Perfil da Empresa → "Pedir avaliações" (`docs/DEPLOY.md`).
