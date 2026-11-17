# Pendências

Lista viva. Cada item: o que falta · quem resolve · o que trava.

## Sessão 0 — Fundação (17/11/2026)

### Repositório
- **Arquivos-base:** os 4 existiam e foram movidos para `docs/` (avaliações → `docs/dados/avaliacoes-google.json`). Nada faltou.
- **SVG da marca:** estavam soltos em `assets/`; movidos (git mv) para `assets/marca/`, como o contexto e o pacote preveem.
- **`todalinda-logo-comparacao.jpg`** na raiz: o pacote diz que é "só para o João". Ficou onde está; o João decide se sai do repositório.
- **Mídia ainda em `assets/` e `videos/`:** a mudança para `media-originais/` é da sessão 1 (Mídia). `media-originais/` já existe, vazia.
- **Bloco de contexto:** no `TODALINDA_PACOTE_PROMPTS_CODE.md` a última linha ("Relatório no fim…") aparece duplicada. O CLAUDE.md segue o bloco colado na sessão 0, sem a duplicata.

### Ferramentas
- **Transcrição local:** `faster-whisper` 1.2.1 instalado num venv local em `.ferramentas/venv` (fora do git, nada global). **O download do modelo falhou:** a política de rede deste ambiente bloqueia `huggingface.co` (403 no proxy). Para a sessão 1 transcrever os vídeos da Edna sem legenda é preciso **liberar `huggingface.co`** no ambiente (ou trazer o modelo `faster-whisper-small`/`medium` por outro meio). Depende do João.
- **Git LFS para `modelos-originais/`:** não configurado. Só com autorização do João.
- **Node:** o ambiente tem Node 22.23.5 (LTS em manutenção até abr/2027). O LTS ativo é o 26. `engines` aceita ≥ 22.23.4 (mínimo do Astro 7.4). Subir para 26 quando o deploy for definido.

### Dados do cliente (vindos do pacote, seção C)
- Mês de abertura, estacionamento, pagamentos, cartão-presente, noiva fora do salão, acessibilidade: PENDENTE.
- Link oficial "Pedir avaliações" do Google: PENDENTE (fallback: ficha pelo cid).
- Ouro oficial / manual da marca e versão horizontal do logo: PENDENTE.
- Domínio definitivo (necessário para `site` no `astro.config.mjs`, sitemap e canonical): PENDENTE.
