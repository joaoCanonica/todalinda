# A casa em 3D: como entregar a planta e a captura

O tour de `/a-casa` já está pronto para receber a casa real. Hoje ele mostra uma **maquete esquemática** (volume do sobrado com as proporções tiradas das fotos da fachada e os ambientes como blocos com nome), sempre com o selo "Representação esquemática — em breve, a casa real". **Nenhum layout interno é inventado:** a posição dos ambientes na esquemática é só uma grade de leitura, e cada registro em `src/content/ambientes/*.json` está com `fonteLayout: "pendente"` (a fachada usa `"foto"`).

Em produção, a esquemática só aparece com a aprovação do João (`src/config/casa3d.ts` → `maqueteEsquematica.aprovadaPeloJoao`). Sem aprovação e sem planta, `/a-casa` mostra fotos e a lista de ambientes, e `pnpm validate-config` avisa.

## 1. O que precisamos receber

| Entrega | Para quê | Formato |
|---|---|---|
| **Planta baixa** dos dois andares | maquete com as medidas certas | PDF, DWG ou foto da planta com cotas (o arquiteto ou a prefeitura costumam ter) |
| **Medidas de pé-direito** e altura do mezanino | volume correto | anotação simples, em metros |
| **Captura dos ambientes** (opcional, para "Ver de verdade") | ver a casa como ela é | vídeo do celular (roteiro abaixo) ou arquivo pronto `.spz`/`.ply` |
| **Quais ambientes ficam em qual andar** | campo `andar` | lista |

Quem modelar (nós ou um parceiro) entrega um **GLB** seguindo as regras da seção 2.

## 2. Regras do GLB (maquete)

- **Unidade:** metro (1 unidade = 1 m).
- **Eixos:** Y para cima (padrão glTF). A fachada da Rua Lauro Müller fica voltada para **+Z**; o chão do térreo em **Y = 0**; o centro da fachada perto de **X = 0**.
- **Um nó por ambiente**, com o nome exato `ambiente:<id>` (o nó pode ser um grupo com as malhas do ambiente). É por esse nome que o contorno em Ouro acende e o hotspot aparece. Ids:

  | id | ambiente |
  |---|---|
  | `fachada-e-gramado` | Fachada e gramado |
  | `recepcao` | Recepção |
  | `salao-de-cabelo` | Salão de cabelo |
  | `lavatorios` | Lavatórios |
  | `esmalteria` | Esmalteria |
  | `estetica` | Sala de estética |
  | `parede-todalinda` | Parede TODALINDA |
  | `lounge-mezanino` | Lounge e mezanino |

- **Materiais:** cores lisas (papel fosco, madeira, pedra). Sem texturas de foto; se houver, no máximo 2048 px.
- **Peso:** o pipeline comprime, mas mire em até 150 mil triângulos antes da compressão. Orçamento final: **GLB ≤ 3 MB**.
- Sem pessoas, sem objetos pessoais de clientes, sem crianças.

## 3. Roteiro de captura com celular (para o "Ver de verdade")

Captura de Gaussian Splatting: um vídeo lento por ambiente, processado depois (Polycam, Luma, Scaniverse, Postshot ou similar) e exportado em `.spz` (preferido) ou `.ply`.

**Antes:** salão **vazio** (sem clientes nem equipe no quadro), **todas as luzes acesas**, cortinas como no dia a dia, espelhos limpos, cadeiras no lugar, nada de bolsas ou celulares à vista. Nenhuma criança no ambiente.

**Como filmar (cada ambiente, 1 a 2 min):**
1. Celular na horizontal, 4K/30 fps se possível, foco e exposição travados (toque longo na tela).
2. Ande devagar em volta do ambiente, a passos curtos, sem girar o celular parado no lugar.
3. Faça **três voltas**: uma na altura do peito, uma mais alta apontando um pouco para baixo, uma mais baixa apontando um pouco para cima.
4. Espelhos: evite ficar de frente para eles (o reflexo confunde a captura); passe de lado.
5. Termine onde começou. Um vídeo por ambiente, com o id no nome do arquivo (`esmalteria.mp4`).

**Ordem sugerida:** fachada e gramado (de dia, de manhã) → recepção → salão de cabelo → lavatórios → esmalteria → sala de estética → parede TODALINDA → lounge e mezanino.

## 4. Como entra no site

1. Coloque o GLB em `modelos-originais/maquete.glb` e as capturas em `modelos-originais/<id>.spz`.
2. Rode `pnpm model:prepare`. Ele faz dedup, prune, weld, simplificação controlada (Meshopt), compressão Meshopt (ou `--draco`), texturas em KTX2 quando o `toktx` estiver instalado (senão WebP), copia os splats e escreve o relatório de peso e triângulos em `docs/3d/RELATORIO_MODELOS.md`. Sai com erro se algo passar do orçamento (GLB 3 MB, splat 40 MB).
3. Em cada `src/content/ambientes/<id>.json`: `fonteLayout` vira `"planta"` (ou `"captura"`), `andar` recebe o andar real, `camera` recebe a pose boa, e `splat` recebe `"/modelos/splats/<id>.spz"` quando houver captura.
4. Com `public/modelos/maquete.glb` presente, o tour troca a esquemática pelo GLB sozinho (sem selo). `pnpm validate-config` trava a produção se algum ambiente exibido continuar sem fonte de layout.

## 5. Técnica (resumo)

- Three.js 0.187, ilha carregada só depois do LCP e quando o palco entra na tela (`client` próprio + `requestIdleCallback`); `setAnimationLoop(null)` fora da tela ou com a aba oculta; `dispose()` + `forceContextLoss()` ao sair.
- Decodificadores (Meshopt, Draco, Basis/KTX2) só são baixados se o GLB usar a extensão correspondente.
- "Ver de verdade" carrega o splat com [Spark](https://github.com/sparkjsdev/spark) (MIT), só ao clicar, com progresso e cancelamento. Formatos aceitos: `.spz`, `.ply`, `.splat`, `.ksplat`, `.sog`.
- Fallback (sem WebGL, Economia de dados, 2G, movimento reduzido ou erro): foto da fachada + lista HTML dos ambientes, com os mesmos painéis e links de agendamento.
