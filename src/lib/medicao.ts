// Medição do funil, sem invadir (CLAUDE.md §3 e docs/FUNIL.md).
// - Nada de terceiro carrega antes do "Aceitar" no aviso de privacidade.
// - Ferramenta: PUBLIC_MEDICAO = "plausible" (recomendada: sem cookie, sem dado pessoal, script de ~1 KB)
//   | "umami" | "ga4" (só com aceite; usa cookie) | vazio (desligada: eventos só no console do preview).
// - Nenhum evento leva nome, telefone ou o texto da mensagem: só ids de serviço/profissional e a origem.
import { EVENTO, aceito, quandoAceitar } from '../components/consentimento/consentimento.ts';

export type Evento =
  | { nome: 'clique_agendar'; props: { servico: string; profissional: string; origem: string } }
  | { nome: 'agendador_enviado'; props: { servico: string; passo: string } }
  | { nome: 'clique_avaliar'; props: { origem: string } }
  | { nome: 'tour_3d_aberto'; props: { ambiente: string } }
  | { nome: 'clique_como_chegar'; props: { destino: string } }
  | { nome: 'clique_instagram'; props: { origem: string } }
  | { nome: 'clique_telefone'; props: { origem: string } };

type Ferramenta = 'plausible' | 'umami' | 'ga4' | null;
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const FERRAMENTA: Ferramenta =
  (['plausible', 'umami', 'ga4'] as const).find((f) => f === env.PUBLIC_MEDICAO) ?? null;
/** plausible: domínio do site; umami: website id; ga4: G-XXXX. */
const ID = env.PUBLIC_MEDICAO_ID ?? '';
/** Endereço do script (permite servir pelo próprio domínio, via proxy). */
const SCRIPT = env.PUBLIC_MEDICAO_SCRIPT ?? '';

type Janela = Window & {
  plausible?: (n: string, o?: { props?: Record<string, string> }) => void;
  umami?: { track: (n: string, p?: Record<string, string>) => void };
  gtag?: (...a: unknown[]) => void;
  dataLayer?: unknown[];
  __medicao?: { nome: string; props: Record<string, string>; enviado: boolean }[];
};
const w = window as Janela;
w.__medicao ??= []; // registro local (e2e e conferência); nunca sai do aparelho

let carregada = false;
function carregar(): void {
  if (carregada || !FERRAMENTA || !ID) return;
  carregada = true;
  const s = document.createElement('script');
  s.defer = true;
  if (FERRAMENTA === 'plausible') {
    s.src = SCRIPT || 'https://plausible.io/js/script.manual.js';
    s.dataset.domain = ID;
    // fila padrão do Plausible: eventos chamados antes de o script terminar de carregar
    const fila: unknown[][] = [];
    w.plausible ??= Object.assign((...a: unknown[]) => void fila.push(a), { q: fila });
  } else if (FERRAMENTA === 'umami') {
    s.src = SCRIPT || 'https://cloud.umami.is/script.js';
    s.dataset.websiteId = ID;
    s.dataset.autoTrack = 'false';
  } else {
    s.src = SCRIPT || `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    s.async = true;
    w.dataLayer ??= [];
    w.gtag = (...a: unknown[]) => void w.dataLayer?.push(a);
    w.gtag('js', new Date());
    w.gtag('config', ID, { anonymize_ip: true });
  }
  document.head.append(s);
  // a página vista conta a partir do aceite
  if (FERRAMENTA === 'plausible') w.plausible?.('pageview');
  else if (FERRAMENTA === 'umami') s.addEventListener('load', () => w.umami?.track?.('pageview'));
}

function enviar(nome: string, props: Record<string, string>): boolean {
  if (!aceito() || !FERRAMENTA) return false;
  carregar();
  if (FERRAMENTA === 'plausible') w.plausible?.(nome, { props });
  else if (FERRAMENTA === 'umami') w.umami?.track(nome, props);
  else w.gtag?.('event', nome, props);
  return true;
}

export function medir<E extends Evento>(nome: E['nome'], props: E['props']): void {
  const p = Object.fromEntries(
    Object.entries(props).map(([k, v]) => [k, String(v ?? '').slice(0, 60)]),
  );
  const enviado = enviar(nome, p);
  w.__medicao?.push({ nome, props: p, enviado });
  if (!enviado && env.PUBLIC_MODO !== 'producao')
    console.debug('[medição]', nome, p, '(não enviado: sem aceite ou sem ferramenta)');
}

/** Origem de um clique: data-origem do link, ou a seção/página onde ele está. */
const origemDe = (el: Element) =>
  (el.closest<HTMLElement>('[data-origem]')?.dataset.origem ??
    el.closest('section[id]')?.id ??
    location.pathname) ||
  '/';

/** Cliques medidos automaticamente (delegação, sem tocar nos componentes). */
export function iniciarMedicao(): void {
  quandoAceitar(carregar);
  window.addEventListener(EVENTO, () => aceito() && carregar());
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement | HTMLButtonElement>(
        'a, button',
      );
      if (!a) return;
      const href = a instanceof HTMLAnchorElement ? a.href : '';
      if (a.dataset.agendar !== undefined)
        medir('clique_agendar', {
          servico: a.dataset.agendarServico ?? '',
          profissional: a.dataset.agendarProfissional ?? '',
          origem: origemDe(a),
        });
      else if (href.startsWith('tel:')) medir('clique_telefone', { origem: origemDe(a) });
      else if (/instagram\.com/.test(href)) medir('clique_instagram', { origem: origemDe(a) });
      else if (/google\.com\/maps|waze\.com|maps\.apple\.com/.test(href))
        medir('clique_como_chegar', {
          destino: /waze/.test(href) ? 'waze' : /apple/.test(href) ? 'apple' : 'google',
        });
      else if (/\/como-chegar\/?$/.test(new URL(href || location.href).pathname) && href)
        medir('clique_como_chegar', { destino: 'pagina' });
    },
    { capture: true },
  );
}
