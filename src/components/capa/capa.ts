import { depoisDoLcp } from '../../scripts/depois-do-lcp.ts';

// Loop da capa: entra por cima do pôster quando o movimento é permitido e a abertura terminou.
// Botão sempre visível enquanto há vídeo: pausar/reproduzir (a escolha da pessoa vale até sair da página).
const capa = document.querySelector<HTMLElement>('[data-capa]');
const v = capa?.querySelector<HTMLVideoElement>('[data-capa-video]');
const botao = capa?.querySelector<HTMLButtonElement>('[data-capa-pausa]');
const rotulo = botao?.querySelector('[data-capa-pausa-texto]');

if (capa && v && botao && rotulo) {
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausadoPelaPessoa = reduzir;
  let visivel = true;

  const atualizarBotao = () => {
    botao.hidden = false;
    rotulo.textContent = v.paused ? 'Reproduzir vídeo' : 'Pausar vídeo';
  };
  const tocar = () => {
    if (pausadoPelaPessoa || !visivel) return;
    v.preload = 'auto';
    void v.play().then(
      () => v.classList.add('tocando'),
      () => undefined,
    );
  };
  v.addEventListener('play', atualizarBotao);
  v.addEventListener('pause', atualizarBotao);
  botao.addEventListener('click', () => {
    if (v.paused) {
      pausadoPelaPessoa = false;
      tocar();
    } else {
      pausadoPelaPessoa = true;
      v.pause();
    }
  });
  new IntersectionObserver(([e]) => {
    visivel = Boolean(e?.isIntersecting);
    if (visivel) tocar();
    else v.pause();
  }).observe(v);

  atualizarBotao();
  if (document.documentElement.dataset.abertura === 'tocar') {
    document.addEventListener('abertura:ondas', tocar, { once: true });
    document.addEventListener('abertura:fim', tocar, { once: true });
  } else {
    // o loop só começa a baixar depois que o pôster (LCP) foi pintado
    void depoisDoLcp().then(tocar);
  }
}
