// "A capa se abre" (WAAPI). Linha do tempo (ms):
//   0–300 Noite · 300–1300 filigrana do centro para fora · 1300–1900 logo completo (folha de ouro + TODA LINDA)
//   1900–2600 o quadrado dourado cresce até a área da foto de capa, com a revelação no espelho; a filigrana sai
//   2600–3000 o logo vai para o cabeçalho (FLIP), o loop começa, entram manchete, chamadas e botões.
// Pular: botão, toque, clique, tecla ou rolagem. Uma vez por sessão.
import { depoisDoLcp } from '../../scripts/depois-do-lcp.ts';

const raiz = document.documentElement;
const ab = document.querySelector<HTMLElement>('[data-ab-camada]'); // atenção: o <html> tem data-abertura

if (ab && raiz.dataset.abertura === 'tocar') void iniciar(ab);

const SELO = { x0: 0.1802, x1: 0.8198, y0: 0.1809, y1: 0.8183 }; // o quadro dentro da filigrana (viewBox do logo)
const ENTRADA = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
const PRECISA = 'cubic-bezier(0.4, 0, 0.2, 1)';

async function svg(nome: string): Promise<string> {
  // prioridade baixa: o pôster da capa (LCP) vem antes
  const r = await fetch(`/abertura/${nome}.svg`, { priority: 'low' } as RequestInit);
  if (!r.ok) throw new Error(nome);
  return (await r.text()).replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}

async function iniciar(ab: HTMLElement) {
  const q = new URLSearchParams(location.search);
  const congelarEm = q.has('abertura-t') ? Number(q.get('abertura-t')) : null;
  const $ = <T extends Element>(s: string, r: ParentNode = ab) => r.querySelector<T>(s);
  const palco = $<HTMLElement>('[data-ab-palco]');
  const filigrana = $<HTMLElement>('[data-ab-filigrana]');
  const logo = $<HTMLElement>('[data-ab-logo]');
  const quadro = $<HTMLElement>('[data-ab-quadro]');
  const revelacao = $<HTMLImageElement>('[data-ab-revelacao]');
  const foto = $<HTMLElement>('[data-ab-foto]');
  const palavra = $<HTMLElement>('[data-ab-palavra]');
  const fundo = $<HTMLElement>('[data-ab-fundo]');
  const pular = $<HTMLButtonElement>('[data-ab-pular]');
  const midiaCapa = document.querySelector<HTMLElement>('[data-capa-midia]');
  const logoCapa = document.querySelector<HTMLElement>('[data-capa-logo] svg');
  const entram = [...document.querySelectorAll<HTMLElement>('[data-capa-entra]')];
  const logoLink = document.querySelector<HTMLElement>('[data-capa-logo]');
  if (
    !palco ||
    !filigrana ||
    !logo ||
    !quadro ||
    !revelacao ||
    !foto ||
    !palavra ||
    !fundo ||
    !pular ||
    !midiaCapa ||
    !logoCapa ||
    !logoLink
  )
    return terminar();

  const anims: Animation[] = [];
  let acabou = false;
  function terminar() {
    if (acabou) return;
    acabou = true;
    for (const a of anims) a.finish();
    try {
      sessionStorage.setItem('tl-abertura', '1');
    } catch {
      /* navegação privada: tudo bem, toca de novo */
    }
    // se o foco estava na abertura (botão Pular), ele vai para o conteúdo, sem rolar
    if (ab?.contains(document.activeElement)) {
      const main = document.getElementById('conteudo');
      if (main) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }
    }
    raiz.dataset.abertura = 'fim';
    document.dispatchEvent(new Event('abertura:fim'));
    for (const a of anims) a.cancel();
    ab?.remove();
  }
  const pularAgora = () => terminar();

  // nada da abertura é baixado antes do pôster (LCP) estar pintado: ela é uma camada sobre ele
  await depoisDoLcp();
  if (revelacao.dataset.src) {
    revelacao.srcset = revelacao.dataset.srcset ?? '';
    revelacao.src = revelacao.dataset.src;
    const fonte = foto.querySelector('source');
    if (fonte?.dataset.srcset) fonte.srcset = fonte.dataset.srcset;
  }
  try {
    const [f, l] = await Promise.race([
      Promise.all([svg('filigrana'), svg('logo')]),
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error('lento')), congelarEm === null ? 1500 : 10000),
      ),
    ]);
    filigrana.innerHTML = f;
    logo.innerHTML = l;
  } catch {
    return terminar();
  }

  if (congelarEm === null) {
    pular.addEventListener('click', pularAgora);
    // Tab não pula (é como se chega ao botão); qualquer outra tecla, toque, clique ou rolagem pula
    const porTecla = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Shift') return;
      removeEventListener('keydown', porTecla);
      pularAgora();
    };
    addEventListener('keydown', porTecla);
    for (const ev of ['pointerdown', 'wheel', 'touchmove'] as const)
      addEventListener(ev, pularAgora, { once: true, passive: true });
  }

  // geometria
  const p = palco.getBoundingClientRect();
  const inicio = {
    left: p.left + p.width * SELO.x0,
    top: p.top + p.height * SELO.y0,
    width: p.width * (SELO.x1 - SELO.x0),
    height: p.height * (SELO.y1 - SELO.y0),
  };
  const alvo = midiaCapa.getBoundingClientRect();
  type Ret = { left: number; top: number; width: number; height: number };
  const px = (r: Ret) => ({
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  });
  // o quadro ocupa a união dos dois retângulos e cresce por clip-path (só pintura: sem layout, sem CLS)
  const uni: Ret = {
    left: Math.min(inicio.left, alvo.left),
    top: Math.min(inicio.top, alvo.top),
    width: Math.max(inicio.left + inicio.width, alvo.right) - Math.min(inicio.left, alvo.left),
    height: Math.max(inicio.top + inicio.height, alvo.bottom) - Math.min(inicio.top, alvo.top),
  };
  const recorte = (r: Ret) =>
    `inset(${r.top - uni.top}px ${uni.left + uni.width - (r.left + r.width)}px ${uni.top + uni.height - (r.top + r.height)}px ${r.left - uni.left}px)`;
  Object.assign(quadro.style, px(uni));
  Object.assign(
    foto.style,
    px({
      left: alvo.left - uni.left,
      top: alvo.top - uni.top,
      width: alvo.width,
      height: alvo.height,
    }),
  );
  const pal = palavra.getBoundingClientRect();
  const dest = logoCapa.getBoundingClientRect();
  const escala = dest.width / pal.width;

  // A 1ª animação de cada elemento preenche para trás (estado inicial); as seguintes só para frente,
  // senão o "antes" delas sobrescreveria a anterior (composição: a última vence).
  const jaAnimados = new Set<Element>();
  const anima = (
    el: Element,
    kf: Keyframe[],
    delay: number,
    duration: number,
    easing = ENTRADA,
  ) => {
    const fill: FillMode = jaAnimados.has(el) ? 'forwards' : 'both';
    jaAnimados.add(el);
    const a = el.animate(kf, { delay, duration, easing, fill });
    anims.push(a);
    return a;
  };

  // 0,3–1,3 s: filigrana do centro para fora
  anima(
    filigrana,
    [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(72% at 50% 50%)' }],
    300,
    1000,
  );
  // 1,3–1,9 s: o logo completo (folha de ouro + TODA LINDA)
  anima(
    logo,
    [
      { opacity: 0, transform: 'scale(0.97)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    1300,
    600,
  );
  // 1,9–2,6 s: o quadrado dourado cresce até a foto de capa; a revelação aparece; a filigrana sai
  anima(quadro, [{ opacity: 0 }, { opacity: 1 }], 1900, 1, 'linear');
  anima(logo, [{ opacity: 1 }, { opacity: 0 }], 1900, 200, PRECISA);
  anima(
    filigrana,
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(1.12)' },
    ],
    1900,
    450,
    PRECISA,
  );
  anima(quadro, [{ clipPath: recorte(inicio) }, { clipPath: recorte(alvo) }], 1900, 700);
  anima(revelacao, [{ opacity: 0 }, { opacity: 1 }], 2050, 400);
  anima(palavra, [{ opacity: 0 }, { opacity: 1 }], 1900, 250);
  // 2,6–3,0 s: o logo vai para o cabeçalho; a capa aparece; o loop começa
  anima(
    palavra,
    [
      { transform: 'translate(0, 0) scale(1)' },
      {
        transform: `translate(${dest.left - pal.left}px, ${dest.top - pal.top}px) scale(${escala})`,
      },
    ],
    2600,
    400,
    PRECISA,
  );
  anima(palavra, [{ opacity: 1 }, { opacity: 0 }], 2950, 50, 'linear');
  anima(logoLink, [{ opacity: 0 }, { opacity: 1 }], 2950, 50, 'linear');
  anima(fundo, [{ opacity: 1 }, { opacity: 0 }], 2600, 350, PRECISA);
  anima(quadro, [{ opacity: 1 }, { opacity: 0 }], 2650, 350, PRECISA);
  anima(pular, [{ opacity: 1 }, { opacity: 0, visibility: 'hidden' }], 2600, 250, PRECISA);
  // entrada por recorte (sem opacidade parcial: o texto nunca fica translúcido, o contraste é sempre o final)
  entram.forEach((el, i) =>
    anima(
      el,
      [
        { opacity: 1, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(1.25rem)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'none' },
      ],
      2600 + i * 30,
      300,
    ),
  );

  if (congelarEm !== null) {
    for (const a of anims) {
      a.pause();
      a.currentTime = congelarEm;
    }
    raiz.dataset.aberturaCongelada = String(congelarEm);
    return;
  }
  setTimeout(() => document.dispatchEvent(new Event('abertura:ondas')), 2600);
  await Promise.all(anims.map((a) => a.finished.catch(() => undefined)));
  terminar();
}
