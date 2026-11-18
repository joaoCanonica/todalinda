// Preferência de privacidade (LGPD): "aceito" | "recusado" | null (ainda não escolheu).
// Guardada só no aparelho (localStorage). Mudança avisa a página pelo evento "todalinda:consentimento".
export type Escolha = 'aceito' | 'recusado';
const CHAVE = 'todalinda:consentimento';
export const EVENTO = 'todalinda:consentimento';

export function lerConsentimento(): Escolha | null {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? 'null') as { v?: string } | null;
    return v?.v === 'aceito' || v?.v === 'recusado' ? v.v : null;
  } catch {
    return null;
  }
}

export function gravarConsentimento(v: Escolha): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ v, em: new Date().toISOString().slice(0, 10) }));
  } catch {
    /* sem armazenamento: vale só para esta página */
  }
  window.dispatchEvent(new CustomEvent<Escolha>(EVENTO, { detail: v }));
}

export const aceito = () => lerConsentimento() === 'aceito';

/** Roda `fn` quando (e se) a pessoa aceitar; na hora, se já aceitou. */
export function quandoAceitar(fn: () => void): void {
  if (aceito()) return fn();
  const ouvir = (e: Event) => {
    if ((e as CustomEvent<Escolha>).detail === 'aceito') {
      window.removeEventListener(EVENTO, ouvir);
      fn();
    }
  };
  window.addEventListener(EVENTO, ouvir);
}

/** Abre o aviso de privacidade (rodapé "Preferências de privacidade" e recursos que pedem aceite). */
export function abrirAviso(): void {
  window.dispatchEvent(new Event('todalinda:abrir-consentimento'));
}
