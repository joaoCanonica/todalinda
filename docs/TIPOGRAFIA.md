# Tipografia e design system (sessão 3)

## Decisão: Playfair Display (títulos) + Manrope (texto)

Provas em `docs/capturas/tipografia/provas-1440.jpg` e `provas-390.jpg`: capa ("Cor, corte e cuidado com quem entende de fio."), capitular com a fala da Edna e ficha de serviço, nas 4 combinações.

| | Playfair Display | Prata | Manrope | Onest |
|---|---|---|---|---|
| Eixos (subconjunto latino, fontsource v40) | wght 400–900 | só 400 | wght 200–800 | wght 100–900 |
| Itálico | **verdadeiro** (arquivo próprio, 400–900) | **não tem** (o navegador inclina e engrossa à força) | não | não |
| Números tabulares (`tnum`) | não (só `lnum`) | não | **sim** | sim |
| Versalete real (`smcp`) | não | não | não | não |
| Peso (woff2) | 38 + 38 KB | 19 KB | **24 KB** | 33 KB |
| Licença | OFL 1.1 | OFL 1.1 | OFL 1.1 | OFL 1.1 |

- **Títulos: Playfair.** O briefing pede "itálico pesado numa palavra por título". A Prata não tem itálico: nas provas C e D, "entende" sai sintético e deformado. O itálico 800 da Playfair é caligráfico e de revista.
- **Texto: Manrope.** Na prova, ela e a Onest quase empatam. Escolhi a Manrope por três motivos: pesa 24 KB contra 33 KB, compõe um pouco mais estreita (mais caracteres por linha a 17–18 px) e tem `tnum` para horários e anos.
- **Versalete:** nenhuma das quatro tem versalete real. Fólio e rótulos usam caixa alta espaçada (`.versalete`), e `font-synthesis-small-caps: none` impede versalete falso.
- **Fonte da revista: não confirmada.** O Linktree e o Flipsnack não respondem a partir deste ambiente (rede restrita), e a investigação não registrou a fonte. Playfair segue como hipótese do briefing. **João: confirmar no PDF/flip.**

## Escala (390 → 1440 px, `clamp`)
Capa 56→152 · H1 44→96 · H2 34→64 · H3 24→36 · lead 19→23 · texto 17→18 · rótulo 12 (caixa alta, +0,18em).

## Cores (calibradas nos stills; AA em `pnpm audit-contraste`)
- Noite #121013 (sombra profunda dos stills, ~#101113) · Café #2A1E19 (sombra quente, ~#2B1C1C).
- **Pedra mudou para #756B64:** o #8A817A dava 3,45:1 sobre Papel e reprovava o AA. O tom original virou **Pedra clara**, usada só sobre Noite (4,96:1).
- **Ouro sobre Papel é proibido** (2,84:1). Na página clara, o foco, os links e as aspas grandes usam Mocha (7,12:1); o ouro fica nos fundos escuros.

## Logo
SVG otimizado com SVGO (`scripts/otimizar-logos.mjs`): o render a 1200 px fica idêntico ao original, sem nenhum pixel diferente. Precisão de 1 casa só nos caminhos; o degradê da folha de ouro fica intacto.
- **Logo completo:** 224 → 84 KB, 25 KB comprimido.
- **Selo:** 6,5 KB.
- **Tamanhos mínimos:** selo ≥ 24 px (ideal ≥ 32); logo completo e mono ≥ 96 px, porque a filigrana some abaixo disso.
- **Ícones:** favicon e apple-touch saem do selo (`scripts/gerar-icones.mjs`).

## Notas de compatibilidade (MDN / caniuse, nov/2026)
- **`initial-letter`:** Chrome/Edge 110+, Safari com `-webkit-`; Firefox não tem. Por isso o fallback usa `float` em `::first-letter`.
- **`text-wrap: balance`:** amplo (Firefox 121+). **`pretty`:** só melhoria progressiva.
- **`@property`:** Baseline desde jul/2024. Ele anima a máscara da filigrana; sem ele, a filigrana aparece direto no estado final.
- **`mask-image`:** sem prefixo nos atuais; mantido `-webkit-mask-image`.
- **View Transitions entre documentos:** Chrome 126+ e Safari 18.2+; no Firefox é parcial. Usado só como melhoria e desligado com movimento reduzido.
- **`prefers-reduced-motion`:** amplo. Tokens de duração vão a 0 e os elementos animados nascem no estado final.

## Peças
- **Assinatura (`src/components/edicao`):** Capa, Capitular, Etiqueta (só hashtags da casa), Fólio (contador CSS, sem JS), Página (tom capa/página, troca seca entre eles) e Filigrana (só abertura e selo).
- **Base (`src/components/base`):** Botão primário e secundário, Link, Rótulo, Citação (`data-avaliacao-literal`), StatusHorario, TabelaHorario, MolduraFoto, Poster (LQIP, proporção reservada), CartaoTipografico, MapaEstatico, ComparadorAntesDepois.
- **JS desta sessão:** 5,6 KB bruto (~3,1 KB gzip). É o horário ao vivo, o comparador, o play dos vídeos e as entradas animadas.
