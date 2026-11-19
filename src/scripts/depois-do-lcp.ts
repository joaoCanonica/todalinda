// Resolve quando o navegador registra o primeiro LCP (o pôster da capa pintado), ou após um teto.
// Tudo que não é o LCP (vídeo, abertura) só começa a baixar depois disso.
export function depoisDoLcp(teto = 2500): Promise<void> {
  return new Promise((ok) => {
    let feito = false;
    const fim = () => {
      if (feito) return;
      feito = true;
      ok();
    };
    try {
      new PerformanceObserver((lista, obs) => {
        if (lista.getEntries().length) {
          obs.disconnect();
          requestAnimationFrame(() => setTimeout(fim, 0));
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* sem suporte (Safari antigo/Firefox): cai no teto */
      addEventListener('load', () => setTimeout(fim, 0), { once: true });
    }
    setTimeout(fim, teto);
  });
}
