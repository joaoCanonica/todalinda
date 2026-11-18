// Maquete ESQUEMÁTICA (sem planta): o sobrado como volume simples de 2 andares, gramado na frente,
// porta marcada; ambientes como blocos rotulados. Proporções da fachada medidas na captura
// (media-originais/fotos/capturas 12-24-16: prédio ~475 × 270 px). Profundidade, posição e andar
// dos ambientes NÃO são medidas reais: o selo "Representação esquemática" fica sempre visível.
import {
  BoxGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
} from 'three';

export const COR = {
  papel: 0xf7f3ec,
  noite: 0x121013,
  cafe: 0x2a1e19,
  ouro: 0xae8c55,
  ouroClaro: 0xe2c88c,
  mocha: 0x6b4a3a,
  gramado: 0x4a5640,
};

// fachada: largura 10,8; altura 6,1 (razão 475:270 da captura); profundidade 7,6 (ESQUEMÁTICA)
const X0 = -4.6;
const X1 = 6.2;
const Z0 = -7.6;
const ALT = 6.1;
const PISO2 = 3.05;
const px = (p: number) => X0 + ((p - 25) / 475) * (X1 - X0); // x em px da captura → unidades
const py = (p: number) => ((280 - p) / 270) * ALT; // y em px (base em 280 px) → unidades

/** Ambientes no esquema: centro e tamanho do bloco. Posições ilustrativas até a planta. */
export const BLOCOS: Record<string, { c: [number, number, number]; t: [number, number] }> = {
  recepcao: { c: [-2.6, 0, -1.9], t: [3, 3.2] },
  'salao-de-cabelo': { c: [0.8, 0, -1.9], t: [3, 3.2] },
  lavatorios: { c: [4.2, 0, -1.9], t: [3, 3.2] },
  esmalteria: { c: [-2.6, 0, -5.6], t: [3, 3.2] },
  estetica: { c: [0.8, 0, -5.6], t: [3, 3.2] },
  'parede-todalinda': { c: [4.2, 0, -5.6], t: [3, 3.2] },
  'lounge-mezanino': { c: [1, PISO2, -3.8], t: [6.6, 3.8] },
  'fachada-e-gramado': { c: [5.9, 0.02, 1.7], t: [8.6, 2.6] },
};

function segmentos(pontos: number[], cor: number, opacidade = 1): LineSegments {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pontos, 3));
  return new LineSegments(
    g,
    new LineBasicMaterial({ color: cor, transparent: opacidade < 1, opacity: opacidade }),
  );
}
/** Retângulo horizontal (y fixo) como 4 segmentos. */
function retXZ(cx: number, y: number, cz: number, w: number, d: number): number[] {
  const [a, b, c, e] = [cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2];
  return [a, y, c, b, y, c, b, y, c, b, y, e, b, y, e, a, y, e, a, y, e, a, y, c];
}
/** Retângulo vertical na fachada (z fixo). */
function retXY(x0: number, y0: number, x1: number, y1: number, z: number): number[] {
  return [x0, y0, z, x1, y0, z, x1, y0, z, x1, y1, z, x1, y1, z, x0, y1, z, x0, y1, z, x0, y0, z];
}

export interface Contorno {
  externo: LineSegments;
  interno: LineSegments; // a "moldura" do logo como desenho do piso: aparece ao ativar
}

export function montarEsquematica(): { grupo: Group; contornos: Map<string, Contorno> } {
  const grupo = new Group();
  const papel = new MeshLambertMaterial({ color: COR.papel });
  const piso = new MeshLambertMaterial({ color: 0xe9e2d6 });

  // terreno e gramado
  const terreno = new Mesh(
    new BoxGeometry(30, 0.2, 24),
    new MeshLambertMaterial({ color: COR.cafe }),
  );
  terreno.position.set(1, -0.11, -2);
  grupo.add(terreno);
  const gramado = new Mesh(
    new BoxGeometry(px(682) - px(290), 0.06, 2.7),
    new MeshLambertMaterial({ color: COR.gramado }),
  );
  gramado.position.set((px(290) + px(682)) / 2, 0.03, 1.65);
  grupo.add(gramado);

  // laje do térreo e paredes do fundo e da esquerda (corte de casa de bonecas: a frente fica aberta)
  const laje = new Mesh(new BoxGeometry(X1 - X0, 0.16, -Z0), piso);
  laje.position.set((X0 + X1) / 2, 0.0, Z0 / 2);
  grupo.add(laje);
  const fundo = new Mesh(new BoxGeometry(X1 - X0, ALT, 0.18), papel);
  fundo.position.set((X0 + X1) / 2, ALT / 2, Z0);
  grupo.add(fundo);
  const lateral = new Mesh(new BoxGeometry(0.18, ALT, -Z0), papel);
  lateral.position.set(X0, ALT / 2, Z0 / 2);
  grupo.add(lateral);

  // andar de cima: só o contorno da laje (transparente), para não esconder o térreo
  grupo.add(segmentos(retXZ((X0 + X1) / 2, PISO2, Z0 / 2, X1 - X0, -Z0), COR.ouro, 0.45));

  // fachada em traço (z = 0), medidas da captura: volume, faixas, janelas, garagem, porta, vitrine
  const f: number[] = [
    ...retXY(X0, 0, X1, ALT, 0),
    X0,
    py(165),
    0,
    X1,
    py(165),
    0,
    ...retXY(px(84), py(122), px(158), py(70), 0),
    ...retXY(px(205), py(122), px(271), py(70), 0),
    ...retXY(px(315), py(125), px(375), py(78), 0),
    ...retXY(px(410), py(125), px(466), py(80), 0),
    ...retXY(px(62), 0, px(196), py(166), 0),
    ...retXY(px(268), py(256), px(452), py(166), 0),
  ];
  grupo.add(segmentos(f, COR.ouro, 0.7));
  // a porta de madeira (marcada)
  const porta = new Mesh(
    new BoxGeometry(px(268) - px(214), py(196), 0.08),
    new MeshLambertMaterial({ color: COR.mocha }),
  );
  porta.position.set((px(214) + px(268)) / 2, py(196) / 2, 0.02);
  grupo.add(porta);
  // a placa TODALINDA no gramado
  const placa = new Mesh(
    new BoxGeometry(px(628) - px(530), py(213) - py(254), 0.12),
    new MeshLambertMaterial({ color: COR.noite }),
  );
  placa.position.set((px(530) + px(628)) / 2, (py(213) + py(254)) / 2, 2.4);
  grupo.add(placa);

  // ambientes: blocos rotulados (papel) + contorno Ouro; o interno acende no ambiente ativo
  const contornos = new Map<string, Contorno>();
  for (const [id, b] of Object.entries(BLOCOS)) {
    const [cx, cy, cz] = b.c;
    const [w, d] = b.t;
    if (id !== 'fachada-e-gramado') {
      const bloco = new Mesh(new BoxGeometry(w - 0.2, 0.18, d - 0.2), papel);
      bloco.position.set(cx, cy + 0.17, cz);
      grupo.add(bloco);
    }
    const y = cy + 0.28;
    const externo = segmentos(retXZ(cx, y, cz, w - 0.2, d - 0.2), COR.ouro, 0.55);
    const interno = segmentos(
      [...retXZ(cx, y, cz, w - 0.7, d - 0.7), ...retXZ(cx, y, cz, w - 0.95, d - 0.95)],
      COR.ouroClaro,
      1,
    );
    interno.visible = false;
    grupo.add(externo, interno);
    contornos.set(id, { externo, interno });
  }
  return { grupo, contornos };
}
