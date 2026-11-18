// Comportamento do tour: abas (setas/Home/End trocam, Enter abre o painel), URL ?ambiente=,
// gaveta no celular, "Ver de verdade" e a ilha 3D carregada depois do LCP, só quando o palco
// aparece e o aparelho pode (WebGL, sem Save-Data/2g, sem movimento reduzido).
import { medir } from '../../lib/medicao.ts';
import { depoisDoLcp } from '../../scripts/depois-do-lcp.ts';

const tour = document.querySelector<HTMLElement>('[data-tour]');
if (tour) iniciar(tour);

function iniciar(tour: HTMLElement) {
  const abas = [...tour.querySelectorAll<HTMLButtonElement>('[data-aba]')];
  const paineis = new Map(
    [...tour.querySelectorAll<HTMLElement>('[data-painel]')].map((p) => [
      p.dataset.painel ?? '',
      p,
    ]),
  );
  const ids = abas.map((a) => a.dataset.aba ?? '');
  let cena: import('../../tres/cena.ts').Cena | null = null;

  const daUrl = new URLSearchParams(location.search).get('ambiente');
  let atual = daUrl && ids.includes(daUrl) ? daUrl : (tour.dataset.inicial ?? ids[0] ?? '');

  function escolher(id: string, { focar = false, voar = true, url = true } = {}) {
    if (!ids.includes(id)) return;
    atual = id;
    for (const a of abas) {
      const sim = a.dataset.aba === id;
      a.setAttribute('aria-selected', String(sim));
      a.tabIndex = sim ? 0 : -1;
      if (sim && focar) a.focus();
      if (sim) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    for (const [k, p] of paineis) p.hidden = k !== id;
    cena?.selecionar(id, voar);
    if (url) {
      const u = new URL(location.href);
      u.searchParams.set('ambiente', id);
      history.replaceState(null, '', u);
    }
  }
  function abrirPainel() {
    tour.classList.add('tour--gaveta');
    paineis.get(atual)?.focus();
  }
  function fecharPainel() {
    tour.classList.remove('tour--gaveta');
    abas.find((a) => a.dataset.aba === atual)?.focus();
  }

  for (const a of abas) {
    a.addEventListener('click', () => escolher(a.dataset.aba ?? ''));
    a.addEventListener('keydown', (e) => {
      const i = ids.indexOf(atual);
      const ir = (j: number) => {
        e.preventDefault();
        escolher(ids[(j + ids.length) % ids.length] ?? '', { focar: true });
      };
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ir(i + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ir(i - 1);
      else if (e.key === 'Home') ir(0);
      else if (e.key === 'End') ir(ids.length - 1);
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abrirPainel();
      }
    });
  }
  for (const b of tour.querySelectorAll<HTMLButtonElement>('[data-fechar-gaveta]'))
    b.addEventListener('click', fecharPainel);
  tour.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tour.classList.contains('tour--gaveta')) fecharPainel();
  });

  // "Ver de verdade": splat (quando existir) ou as fotos do ambiente num <dialog>
  const dlg = tour.querySelector<HTMLDialogElement>('[data-dialogo]');
  const galerias = tour.querySelector<HTMLTemplateElement>('[data-galerias]');
  for (const b of tour.querySelectorAll<HTMLButtonElement>('[data-verdade]')) {
    b.addEventListener('click', () => {
      if (!dlg || !galerias) return;
      const id = b.dataset.verdade ?? '';
      const alvo = dlg.querySelector('[data-dlg-galeria]');
      const titulo = dlg.querySelector('[data-dlg-titulo]');
      const fonte = galerias.content.querySelector(`[data-galeria="${id}"]`);
      if (alvo) alvo.replaceChildren(...(fonte ? [...fonte.cloneNode(true).childNodes] : []));
      if (titulo)
        titulo.textContent = `${paineis.get(id)?.querySelector('h3')?.textContent ?? ''}: fotos do ambiente`;
      dlg.showModal();
      // com captura real (splat) e a maquete carregada: baixa sob demanda, com progresso e cancelamento
      const splat = b.dataset.splat;
      const prog = dlg.querySelector<HTMLElement>('[data-dlg-progresso]');
      if (splat && cena && prog) {
        prog.hidden = false;
        prog.textContent = 'Carregando a captura… 0%';
        void cena
          .verDeVerdade(
            splat,
            (p) => (prog.textContent = `Carregando a captura… ${Math.round(p * 100)}%`),
          )
          .then((carga) => {
            dlg.addEventListener('close', () => carga.cancelar(), { once: true });
            carga.promessa.then(
              () => dlg.close(),
              () =>
                (prog.textContent = 'Não foi possível carregar a captura. As fotos seguem aqui.'),
            );
          });
      }
    });
  }

  escolher(atual, { voar: false, url: Boolean(daUrl) });

  // ---------- a ilha 3D ----------
  const palco = tour.querySelector<HTMLElement>('[data-palco]');
  const fallback = tour.querySelector<HTMLElement>('[data-fallback]');
  const estado = tour.querySelector<HTMLElement>('[data-estado-3d]');
  const usarFallback = (motivo: string) => {
    if (palco) {
      palco.hidden = true;
      palco.dataset.estado = 'fallback';
    }
    if (fallback) fallback.hidden = false;
    tour.dataset.fallback = motivo;
  };
  if (!palco || !('3d' in tour.dataset)) return;
  const conexao = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  const motivo = !document.createElement('canvas').getContext('webgl2')
    ? 'sem-webgl'
    : conexao?.saveData
      ? 'economia-de-dados'
      : /(^|-)2g$/.test(conexao?.effectiveType ?? '')
        ? 'conexao-lenta'
        : matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'movimento-reduzido'
          : null;
  if (motivo) return usarFallback(motivo);

  const carregar = async () => {
    try {
      const { criarCena } = await import('../../tres/cena.ts');
      let canvas = palco.querySelector<HTMLCanvasElement>('[data-canvas]');
      if (!canvas) throw new Error('sem canvas');
      // canvas cujo contexto já foi destruído (volta pelo histórico): troca por um novo
      if (canvas.dataset.usado) {
        const novo = canvas.cloneNode(false) as HTMLCanvasElement;
        canvas.replaceWith(novo);
        canvas = novo;
      }
      canvas.dataset.usado = '1';
      const hotspots = new Map(
        [...palco.querySelectorAll<HTMLElement>('[data-hotspot]')].map((h) => [
          h.dataset.hotspot ?? '',
          h,
        ]),
      );
      cena = await criarCena({
        palco,
        canvas,
        hotspots,
        ambientes: JSON.parse(tour.dataset.poses ?? '[]'),
        inicial: atual,
        glb: tour.dataset.glb ?? null,
        aoSelecionar: (id) => {
          escolher(id);
          abrirPainel();
        },
      });
      if (estado) estado.hidden = true;
      requestAnimationFrame(() => requestAnimationFrame(() => (palco.dataset.estado = 'pronto')));
      tour.querySelector<HTMLElement>('[data-dica]')?.removeAttribute('hidden');
      (window as Window & { __tour3d?: unknown }).__tour3d = cena; // medição (fps) nas capturas
      medir('tour_3d_aberto', { ambiente: atual });
      // ao sair, libera a GPU; se a página voltar do cache de voltar/avançar (bfcache), recria a cena
      addEventListener(
        'pagehide',
        () => {
          cena?.destruir();
          cena = null;
        },
        { once: true },
      );
    } catch (erro) {
      console.warn('[tour 3D] fallback:', erro);
      usarFallback('erro');
    }
  };
  addEventListener('pageshow', (e) => {
    if (e.persisted && !cena && palco.dataset.estado === 'pronto') void carregar();
  });
  // depois do LCP + quando o palco aparece + quando o navegador estiver ocioso
  void depoisDoLcp().then(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const ocioso = (
          window as Window & {
            requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number;
          }
        ).requestIdleCallback;
        if (ocioso) ocioso(() => void carregar(), { timeout: 1500 });
        else setTimeout(() => void carregar(), 200);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(palco);
  });
}
