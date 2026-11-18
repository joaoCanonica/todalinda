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
- **Node:** o ambiente tem Node 22.23.5 (LTS em manutenção até abr/2027). O LTS ativo é o 26. `engines` aceita ≥ 22.23.4 (mínimo do Astro 7.4). Subir para 26 quando o deploy for definido.

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
