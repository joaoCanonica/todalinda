// Ilha 3D da casa: cena, câmera, órbita limitada, voo entre ambientes, hotspots e ciclo de vida.
// Carregada só depois do LCP, quando o palco entra na tela (ver src/components/casa3d/ilha.ts).
import {
  AmbientLight,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type Group,
  type Material,
  type Mesh,
  type Object3D,
} from 'three';
import { BLOCOS, COR, montarEsquematica, type Contorno } from './esquematica.ts';

export interface PoseAmbiente {
  id: string;
  posicao: [number, number, number];
  alvo: [number, number, number];
}
export interface OpcoesCena {
  palco: HTMLElement; // contém o <canvas> e a camada de hotspots
  canvas: HTMLCanvasElement;
  hotspots: Map<string, HTMLElement>;
  ambientes: PoseAmbiente[];
  inicial?: string | null;
  glb?: string | null;
  aoSelecionar: (id: string) => void;
}
export interface Cena {
  selecionar(id: string, voar?: boolean): void;
  destruir(): void;
  fps(): number;
  /** "Ver de verdade": baixa o splat do ambiente (Spark), com progresso; devolve como cancelar. */
  verDeVerdade(
    url: string,
    progresso: (p: number) => void,
  ): Promise<{ promessa: Promise<unknown>; cancelar: () => void }>;
}

const VISAO_GERAL: PoseAmbiente = {
  id: 'visao-geral',
  posicao: [13, 10.5, 15],
  alvo: [1, 1.6, -3],
};
const DURACAO_VOO = 1050; // ms (900–1200)
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2); // easeInOutCubic

export async function criarCena(o: OpcoesCena): Promise<Cena> {
  const movel = matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({
    canvas: o.canvas,
    antialias: !movel,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, movel ? 1.5 : 2));
  renderer.setClearColor(new Color(COR.noite));

  const cena = new Scene();
  cena.add(new HemisphereLight(0xfff6e8, 0x2a1e19, 1.1));
  cena.add(new AmbientLight(0xffffff, 0.25));
  const janela = new DirectionalLight(0xffe9c9, 1.6); // luz suave de janela, quente, vinda da frente-direita
  janela.position.set(12, 14, 10);
  cena.add(janela);

  // maquete: o GLB da planta (quando existir) ou a esquemática
  let maquete: Group;
  let contornos = new Map<string, Contorno>();
  if (o.glb) {
    const { carregarGlb } = await import('./glb.ts');
    ({ grupo: maquete, contornos } = await carregarGlb(o.glb, renderer));
  } else {
    ({ grupo: maquete, contornos } = montarEsquematica());
  }
  cena.add(maquete);

  const camera = new PerspectiveCamera(38, 1, 0.1, 200);
  const pos = new Vector3(...VISAO_GERAL.posicao);
  const alvo = new Vector3(...VISAO_GERAL.alvo);

  // órbita pequena em torno da pose atual: só gira um pouco, sem zoom, sem atravessar paredes
  let giro = 0; // yaw (rad)
  let incl = 0; // pitch (rad)
  const LIM_GIRO = 0.4;
  const LIM_INCL = 0.18;
  let arrastando = false;
  let ux = 0;
  let uy = 0;
  const aoApertar = (e: PointerEvent) => {
    arrastando = true;
    ux = e.clientX;
    uy = e.clientY;
    o.canvas.setPointerCapture(e.pointerId);
  };
  const aoMover = (e: PointerEvent) => {
    if (!arrastando) return;
    giro = Math.max(-LIM_GIRO, Math.min(LIM_GIRO, giro - (e.clientX - ux) * 0.004));
    if (e.pointerType === 'mouse')
      incl = Math.max(-LIM_INCL, Math.min(LIM_INCL, incl + (e.clientY - uy) * 0.003));
    ux = e.clientX;
    uy = e.clientY;
  };
  const aoSoltar = () => {
    arrastando = false;
  };
  o.canvas.addEventListener('pointerdown', aoApertar);
  o.canvas.addEventListener('pointermove', aoMover);
  o.canvas.addEventListener('pointerup', aoSoltar);
  o.canvas.addEventListener('pointercancel', aoSoltar);

  // voo entre poses
  let voo: { de: [Vector3, Vector3]; para: [Vector3, Vector3]; t0: number } | null = null;
  const poses = new Map(o.ambientes.map((a) => [a.id, a]));

  function acender(id: string | null) {
    for (const [k, c] of contornos) {
      const sim = k === id;
      c.interno.visible = sim;
      (c.externo.material as Material & { opacity: number }).opacity = sim ? 1 : 0.55;
    }
    for (const [k, h] of o.hotspots) h.toggleAttribute('data-ativo', k === id);
  }

  function selecionar(id: string, voar = true) {
    const p = poses.get(id);
    if (!p) return;
    acender(id);
    giro = 0;
    incl = 0;
    const destino: [Vector3, Vector3] = [new Vector3(...p.posicao), new Vector3(...p.alvo)];
    if (!voar) {
      pos.copy(destino[0]);
      alvo.copy(destino[1]);
      voo = null;
      return;
    }
    voo = { de: [pos.clone(), alvo.clone()], para: destino, t0: performance.now() };
  }

  // hotspots: botões HTML posicionados pela projeção do centro de cada bloco
  const centros = new Map<string, Vector3>();
  for (const [id, b] of Object.entries(BLOCOS))
    centros.set(id, new Vector3(b.c[0], b.c[1] + 0.6, b.c[2]));
  for (const [id, h] of o.hotspots) h.addEventListener('click', () => o.aoSelecionar(id));
  const tmp = new Vector3();
  function posicionarHotspots(w: number, h: number) {
    for (const [id, el] of o.hotspots) {
      const c = centros.get(id);
      if (!c) continue;
      tmp.copy(c).project(camera);
      const visivel = tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05;
      el.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px) translate(-50%, -50%)`;
      el.toggleAttribute('data-fora', !visivel);
    }
  }

  // tamanho
  let largura = 0;
  let altura = 0;
  const ajustar = () => {
    largura = o.palco.clientWidth;
    altura = o.palco.clientHeight;
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / Math.max(1, altura);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(ajustar);
  ro.observe(o.palco);
  ajustar();

  // laço: só roda visível e com a aba ativa
  let quadros = 0;
  let fpsMedido = 0;
  let marcoFps = performance.now();
  const olho = new Vector3();
  const quadro = (agora: number) => {
    if (voo) {
      const t = Math.min(1, (agora - voo.t0) / DURACAO_VOO);
      const k = suave(t);
      pos.lerpVectors(voo.de[0], voo.para[0], k);
      alvo.lerpVectors(voo.de[1], voo.para[1], k);
      if (t >= 1) voo = null;
    }
    // aplica a órbita como rotação do olho em torno do alvo
    olho.copy(pos).sub(alvo);
    const r = olho.length();
    const th = Math.atan2(olho.x, olho.z) + giro;
    const ph = Math.min(1.45, Math.max(0.15, Math.acos(olho.y / r) - incl));
    camera.position.set(
      alvo.x + r * Math.sin(ph) * Math.sin(th),
      alvo.y + r * Math.cos(ph),
      alvo.z + r * Math.sin(ph) * Math.cos(th),
    );
    camera.lookAt(alvo);
    renderer.render(cena, camera);
    posicionarHotspots(largura, altura);
    quadros++;
    if (agora - marcoFps >= 1000) {
      fpsMedido = (quadros * 1000) / (agora - marcoFps);
      quadros = 0;
      marcoFps = agora;
    }
  };
  let visivel = false;
  const ligar = () => renderer.setAnimationLoop(visivel && !document.hidden ? quadro : null);
  const io = new IntersectionObserver(([e]) => {
    visivel = Boolean(e?.isIntersecting);
    ligar();
  });
  io.observe(o.palco);
  document.addEventListener('visibilitychange', ligar);

  if (o.inicial && poses.has(o.inicial)) selecionar(o.inicial, false);
  else acender(null);

  function destruir() {
    renderer.setAnimationLoop(null);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', ligar);
    o.canvas.removeEventListener('pointerdown', aoApertar);
    o.canvas.removeEventListener('pointermove', aoMover);
    o.canvas.removeEventListener('pointerup', aoSoltar);
    o.canvas.removeEventListener('pointercancel', aoSoltar);
    cena.traverse((obj: Object3D) => {
      const m = obj as Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) mat.dispose();
    });
    renderer.dispose();
    renderer.forceContextLoss();
  }

  async function verDeVerdade(url: string, progresso: (p: number) => void) {
    const { carregarSplat } = await import('./realismo.ts');
    return carregarSplat(url, cena, progresso);
  }

  return { selecionar, destruir, fps: () => Math.round(fpsMedido), verDeVerdade };
}

export const visaoGeral = VISAO_GERAL;
