// "Ver de verdade": o splat (Gaussian Splatting) do ambiente, sob demanda, com progresso e cancelamento.
// Biblioteca: Spark (@sparkjsdev/spark 2.4.0, MIT, World Labs) — só é importada quando existe splat
// e a pessoa pede; não entra no orçamento da ilha. Até a captura existir, o painel abre fotos/vídeo.
import type { Scene } from 'three';

export interface Carga {
  promessa: Promise<unknown>;
  cancelar: () => void;
}

/** Baixa o splat com progresso (0–1) e o adiciona à cena. Cancelável. */
export function carregarSplat(url: string, cena: Scene, progresso: (p: number) => void): Carga {
  const ctrl = new AbortController();
  const promessa = (async () => {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok || !r.body) throw new Error(`splat indisponível (${r.status})`);
    const total = Number(r.headers.get('content-length')) || 0;
    const leitor = r.body.getReader();
    const partes: Uint8Array[] = [];
    let lido = 0;
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      partes.push(value);
      lido += value.length;
      if (total) progresso(lido / total);
    }
    const bytes = new Uint8Array(lido);
    let o = 0;
    for (const p of partes) {
      bytes.set(p, o);
      o += p.length;
    }
    const { SplatMesh } = await import('@sparkjsdev/spark');
    const splat = new SplatMesh({ fileBytes: bytes.buffer });
    cena.add(splat);
    progresso(1);
    return splat;
  })();
  return { promessa, cancelar: () => ctrl.abort() };
}
