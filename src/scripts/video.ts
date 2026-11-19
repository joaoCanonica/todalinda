// Vídeos mudos em loop: só tocam com movimento permitido e quando visíveis; pausam fora da tela.
// WCAG 2.2.2: todo vídeo que toca sozinho ganha um botão "Pausar vídeo" (a escolha vale até sair da
// página). Vídeo dentro de link (grade de /trabalhos) não toca sozinho: abre no lightbox.
const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
const pausadoPelaPessoa = new WeakSet<HTMLVideoElement>();
const io = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting && !reduzir.matches && !pausadoPelaPessoa.has(v))
        void v.play().catch(() => undefined);
      else v.pause();
    }
  },
  { threshold: 0.25 },
);

function botaoPausa(v: HTMLVideoElement) {
  const caixa = v.closest<HTMLElement>('.poster');
  if (!caixa || caixa.querySelector('[data-pausa]')) return;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'video-pausa';
  b.dataset.pausa = '';
  const atualizar = () => {
    const parado = v.paused;
    b.setAttribute('aria-label', parado ? 'Reproduzir vídeo' : 'Pausar vídeo');
    b.dataset.estado = parado ? 'parado' : 'tocando';
  };
  b.addEventListener('click', () => {
    if (v.paused) {
      pausadoPelaPessoa.delete(v);
      void v.play().catch(() => undefined);
    } else {
      pausadoPelaPessoa.add(v);
      v.pause();
    }
  });
  v.addEventListener('play', atualizar);
  v.addEventListener('pause', atualizar);
  atualizar();
  caixa.append(b);
}

for (const v of document.querySelectorAll<HTMLVideoElement>('video[data-video-mudo]')) {
  if (v.closest('a')) continue;
  io.observe(v);
  if (!reduzir.matches) botaoPausa(v);
}
