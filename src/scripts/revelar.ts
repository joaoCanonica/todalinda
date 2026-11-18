// Entrada editorial: elementos [data-revelar] sobem e aparecem uma vez ao entrar na tela.
// Sem JS ou com movimento reduzido, tudo já está no estado final (o CSS só esconde com .js-revelar).
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-revelar');
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('revelado');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  for (const el of document.querySelectorAll('[data-revelar]')) io.observe(el);
}
