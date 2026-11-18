// Vídeos mudos em loop: só tocam com movimento permitido e quando visíveis; pausam fora da tela.
const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
const io = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting && !reduzir.matches) void v.play().catch(() => undefined);
      else v.pause();
    }
  },
  { threshold: 0.25 },
);
for (const v of document.querySelectorAll<HTMLVideoElement>('video[data-video-mudo]'))
  io.observe(v);
