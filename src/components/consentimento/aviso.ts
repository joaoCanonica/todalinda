// Comportamento do aviso de privacidade (carregado depois do LCP por Consentimento.astro).
import { iniciarMedicao } from '../../lib/medicao.ts';
import { gravarConsentimento, lerConsentimento, type Escolha } from './consentimento.ts';

const aviso = document.querySelector<HTMLElement>('[data-consentimento]');
if (aviso) {
  const mostrar = (focar = false) => {
    aviso.hidden = false;
    if (focar) aviso.querySelector<HTMLButtonElement>('[data-consentir]')?.focus();
  };
  if (!lerConsentimento()) mostrar();
  for (const b of aviso.querySelectorAll<HTMLButtonElement>('[data-consentir]'))
    b.addEventListener('click', () => {
      gravarConsentimento(b.dataset.consentir as Escolha);
      document.documentElement.removeAttribute('data-consentir');
      aviso.hidden = true;
    });
  window.addEventListener('todalinda:abrir-consentimento', () => mostrar(true));
  for (const b of document.querySelectorAll('[data-consentimento-abrir]'))
    b.addEventListener('click', () => mostrar(true));
}
iniciarMedicao();
