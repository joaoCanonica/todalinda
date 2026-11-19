# Funil da Todalinda: agendar, avaliar, medir

Ordem do projeto (CLAUDE.md §1): **agendamento** primeiro, depois exposição, depois **avaliações no Google**. Este documento junta os caminhos do site, as mensagens exatas, a medição e o roteiro que acontece **fora do site**.

---

## 1. Agendar

### Por onde a cliente entra

| Entrada | O que acontece (com JS) | Sem JS |
|---|---|---|
| "Agendar" no cabeçalho de qualquer página interna | abre a **gaveta** do agendador; numa matéria de serviço ou num perfil, já vem preenchida | WhatsApp com a mensagem geral (ou a do serviço/pessoa) |
| "Agendar {serviço}" na matéria (`/servicos/<id>`), botão da capa e CTA fixo | gaveta com o serviço marcado | WhatsApp com a mensagem do serviço |
| "Agendar com {nome}" (`/equipe`, `/equipe/<slug>`, seção Equipe da capa) | gaveta com a pessoa marcada (escolha da cliente; não afirma que a pessoa faz todo serviço) | WhatsApp com a mensagem da pessoa |
| Seção "Agendar" da capa (`/#agendar`) | o agendador direto na página; os CTAs da capa rolam até ele já preenchidos | link geral |
| `/agendar?servico=<id>&profissional=<slug>` (Instagram, QR, links de fora) | agendador em página inteira, preenchido pela URL | link geral |
| "Falar com a Edna" | vai direto ao WhatsApp (a fundadora não é opção de horário) | idem |

### Os três passos (uma tela, sem recarregar)

1. **Serviço:** os publicados + "Avaliação capilar" + "Não sei ainda".
2. **Com quem:** "Sem preferência" + as profissionais **confirmadas** para o serviço. Sem confirmação, o passo some. No preview aparece a sugestão pelas especialidades, com selo "provisório". A pessoa escolhida no perfil sempre aparece.
3. **Quando:** os próximos 14 dias (a partir de amanhã). Domingo, segunda e feriados ficam desabilitados, com o motivo escrito ("fechado às segundas", "feriado: Natal"). Depois, o período: manhã (9h–12h) | tarde (13h–19h) | qualquer horário.

Perguntas condicionais: "Fez química nos últimos 6 meses?" (só cor e mechas) e "É a sua primeira vez na Todalinda?". O nome é opcional. A **prévia da mensagem exata** aparece antes do botão **"Enviar pelo WhatsApp"**. Nada é guardado: a mensagem é montada no aparelho.

O destino vem de `src/config/agenda.ts` (`agenda.destino`). Hoje: WhatsApp 5549991772089. Fase 2: trocar para `{ tipo: 'link-externo', url }` ou `{ tipo: 'api', endpoint }`, sem mexer na UI.

### Mensagens exatas (geradas por `src/lib/agenda.ts`)

| Cenário | Mensagem |
|---|---|
| Geral (sem JS, ou sem serviço escolhido) | Olá! Vim pelo site da Todalinda e quero agendar um horário. |
| Só o serviço | Olá! Vim pelo site e quero agendar Corte. |
| Serviço + profissional + dia + período | Olá! Vim pelo site e quero agendar Morena iluminada com Isabela Cristina, de preferência sábado, 21/11, à tarde. |
| Mechas com química, qualquer horário | Olá! Vim pelo site e quero agendar Mechas, de preferência terça, 24/11, em qualquer horário. Já fiz química nos últimos 6 meses: sim. |
| Primeira vez, com nome | Olá! Vim pelo site e quero agendar Loiros. É minha primeira vez na Todalinda. Meu nome é Ana Paula. |
| Cliente da casa | … Já sou cliente da Todalinda. |
| Não sei ainda | Olá! Vim pelo site e quero agendar um horário (ainda não sei qual serviço). |
| Avaliação capilar com uma pessoa | Olá! Vim pelo site e quero agendar Avaliação capilar com Andressa Savaris. |

Todas começam por "Vim pelo site": a recepção sabe a origem sem nenhuma ferramenta.

---

## 2. Avaliar no Google

### Caminhos

- **Site:** bloco "Sua opinião ajuda outra mulher a nos encontrar." (capa) e "Avaliar no Google" no rodapé → `/avaliar?o=site`.
- **QR no balcão e no espelho:** `/avaliar/qr` (cartão A6 ou A5 para imprimir; o QR aponta para `/avaliar?o=qr`).
- **WhatsApp depois do atendimento:** `/avaliar?o=whatsapp` (mensagem abaixo).
- **`/avaliar`:** redireciona na hora para o link oficial do Google (meta refresh + link visível, noindex). Até chegar o link "Pedir avaliações", usa a ficha do Google (cid).

Sem estrelas, sem nota, sem incentivo. Pedir **a todas** as clientes, não só às satisfeitas.

### Mensagem pós-atendimento (para a recepção copiar)

Mandar no fim do atendimento, pelo WhatsApp da casa, **para toda cliente atendida no dia**:

```
Que bom ter você aqui hoje! Se puder contar como foi, isso ajuda muito outras mulheres a nos encontrarem: {SITE}/avaliar?o=whatsapp
```

`{SITE}` é o domínio definitivo (pendente). Até lá, a recepção usa o link "Pedir avaliações" do Perfil da Empresa direto.

Nunca acrescentar: "avalie com 5 estrelas", brinde, desconto, sorteio, "só se gostou". Também não pedir avaliação à equipe nem à família da equipe.

### O cartão QR

`/avaliar/qr` → "Imprimir A6" (105 × 148 mm, balcão e espelho) ou "Imprimir A5" (148 × 210 mm, parede). Papel fosco, 250 g ou mais, impressão em cor (o selo é em folha de ouro). O QR é gerado no build, sem serviço externo. **Sem o domínio definitivo, o QR aponta direto para o Google**, sem medir a origem: reimprimir quando o domínio existir.

---

## 3. Roteiro fora do site (investigação §8)

O problema é conversão, não satisfação: 57 avaliações e 16 mil seguidores. A meta é **100 avaliações em 6 meses (~8 por mês)**.

1. **Responder todas as 57**, começando pelas duas de 1★, com tom calmo, convite para conversar e sem discutir. Daqui para a frente, responder cada nova avaliação em até 48 h.
2. **Gerar o link curto oficial** em Perfil da Empresa → "Pedir avaliações" e mandar para o João (vira `PUBLIC_GOOGLE_REVIEW_URL`).
3. **Mensagem pós-atendimento** (acima), todos os dias, para todas as atendidas.
4. **Cartão QR** no caixa e no espelho (`/avaliar/qr`), no mesmo padrão do cartão "Toda Pontual".
5. **Dois Reais ou um Cabelo:** ao fim do episódio, a modelo pode ser convidada a avaliar como qualquer cliente, sem condicionar nada.
6. **Nada de recompensa:** sem sorteio, desconto, brinde ou "avalie 5★". O Google proíbe e pode penalizar a ficha.
7. **Equipe não avalia a casa.** A avaliação "DIDO Rodrigues · 5★" é de profissional da casa: o ideal é removê-la na própria conta dele.
8. **No lançamento:** cadastrar o site na ficha e subir fotos novas (fachada, recepção, cadeiras).
9. **Acompanhamento mensal:** total de avaliações, quantas com texto, quantas respondidas, e os cliques em `clique_avaliar` por origem (qr | site | whatsapp).

---

## 4. Medição sem invadir

### Eventos (`src/lib/medicao.ts`)

| Evento | Propriedades | Quando |
|---|---|---|
| `clique_agendar` | servico, profissional, origem | clique em qualquer CTA "Agendar" (abre a gaveta) |
| `agendador_enviado` | servico, passo (servico \| profissional \| quando) | clique em "Enviar pelo WhatsApp" |
| `clique_avaliar` | origem (qr \| site \| whatsapp \| direto) | ao passar por `/avaliar` |
| `tour_3d_aberto` | ambiente | quando a maquete 3D termina de carregar |
| `clique_como_chegar` | destino (google \| waze \| apple \| pagina) | links de mapa e para /como-chegar |
| `clique_instagram` | origem | links para o Instagram |
| `clique_telefone` | origem | links `tel:` |

Nenhum evento leva nome, telefone ou o texto da mensagem.

### Ferramenta: Plausible (decidido pelo João na sessão 8)

**Plausible é a padrão.** Liga sozinho quando existir `PUBLIC_SITE_URL` (o domínio vira o "site" do Plausible); `PUBLIC_MEDICAO_ID` sobrescreve, `PUBLIC_MEDICAO=nenhuma` desliga. Por que Plausible:

- **Sem cookie e sem dado pessoal.** Pela própria documentação do Plausible, não usa cookie nem guarda IP. Encaixa no que a página de privacidade promete.
- **Leve.** O script tem cerca de 1 KB e não pesa no LCP. Eventos personalizados com propriedades cobrem os 7 eventos acima.
- **Simples para a casa ler.** Um painel com origem, páginas e os eventos do funil, sem configurar nada.
- Umami é a alternativa equivalente (`PUBLIC_MEDICAO=umami`).

GA4 (`PUBLIC_MEDICAO=ga4`) também funciona, mas usa cookie, pesa bem mais e exige um aviso de cookies de verdade. Não recomendo.

**Mesmo sem cookie, nada de terceiro carrega antes do "Aceitar"** (regra deste site, mais rígida que o mínimo): a ferramenta só é baixada depois do aceite. Sem `PUBLIC_MEDICAO`, a medição fica desligada e os eventos só aparecem no console do preview (`window.__medicao`). Para servir o script pelo próprio domínio (proxy), use `PUBLIC_MEDICAO_SCRIPT`.

### Consentimento

- O aviso aparece na primeira visita, com **"Aceitar" e "Recusar" do mesmo tamanho, cor e borda** (o e2e confere).
- Antes do aceite, nada de terceiro: medição, mapa interativo (OpenStreetMap) e embeds.
- A escolha fica só no aparelho (`localStorage`) e muda em **"Preferências de privacidade"**, no rodapé.
- Sem JS, o aviso não aparece e nada de terceiro carrega.

---

## 5. Testes

`pnpm build && pnpm test:e2e` (Playwright, 390 px, relógio fixo em 18/11/2026). São 13 cenários:

- os 8 do agendador: só o serviço; serviço + profissional; mechas com química; primeira vez; dia desabilitado; sem JS; abrindo de `/servicos/loiros`; abrindo de `/equipe/dido-rodrigues`;
- `/agendar` preenchido pela URL;
- `/avaliar` redireciona;
- `/avaliar` sem JS;
- `/avaliar/qr` em PDF A6 e A5;
- nenhum request de terceiro antes do consentimento.

As capturas e os PDFs ficam em `docs/capturas/<data>/`.
