// Comparador antes/depois: o range nativo controla o recorte. Sem JS, as fotos ficam lado a lado.
for (const el of document.querySelectorAll<HTMLElement>('[data-comparador]')) {
  const range = el.querySelector<HTMLInputElement>('input[type="range"]');
  if (!range) continue;
  el.classList.add('comparador--ativo');
  const aplicar = () => {
    const v = Number(range.value);
    el.style.setProperty('--pos', `${v}%`);
    range.setAttribute('aria-valuetext', `Antes ${v}% · Depois ${100 - v}%`);
  };
  range.addEventListener('input', aplicar);
  aplicar();
}
