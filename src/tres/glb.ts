// Maquete a partir da planta (Prompt 3D): public/modelos/maquete.glb, otimizado por scripts/model-prepare.mjs.
// Convenção: cada ambiente é um nó "ambiente:<id>" (ex.: "ambiente:esmalteria"); o contorno Ouro do piso
// é gerado a partir da caixa do nó. Decoders: Meshopt (padrão do pipeline) e, se o arquivo pedir, Draco/KTX2.
import {
  Box3,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  type WebGLRenderer,
} from 'three';
import { COR, type Contorno } from './esquematica.ts';

const contorno = (b: Box3, inset: number, cor: number, opacidade: number) => {
  const y = b.min.y + 0.02;
  const [a, c, e, f] = [b.min.x + inset, b.max.x - inset, b.min.z + inset, b.max.z - inset];
  const g = new BufferGeometry();
  g.setAttribute(
    'position',
    new Float32BufferAttribute(
      [a, y, e, c, y, e, c, y, e, c, y, f, c, y, f, a, y, f, a, y, f, a, y, e],
      3,
    ),
  );
  return new LineSegments(
    g,
    new LineBasicMaterial({ color: cor, transparent: opacidade < 1, opacity: opacidade }),
  );
};

export async function carregarGlb(
  url: string,
  renderer: WebGLRenderer,
): Promise<{ grupo: Group; contornos: Map<string, Contorno> }> {
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
  ]);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  // Draco e KTX2 só se o arquivo usar (o pipeline padrão usa Meshopt; texturas KTX2 quando houver toktx)
  const cabecalho = await (
    await fetch(url, { headers: { Range: 'bytes=0-65535' } })
  )
    .arrayBuffer()
    .catch(() => new ArrayBuffer(0));
  const texto = new TextDecoder().decode(cabecalho);
  if (texto.includes('KHR_draco_mesh_compression')) {
    const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
    loader.setDRACOLoader(new DRACOLoader().setDecoderPath('/modelos/draco/'));
  }
  if (texto.includes('KHR_texture_basisu')) {
    const { KTX2Loader } = await import('three/addons/loaders/KTX2Loader.js');
    loader.setKTX2Loader(
      new KTX2Loader().setTranscoderPath('/modelos/basis/').detectSupport(renderer),
    );
  }
  const gltf = await loader.loadAsync(url);
  const grupo = new Group();
  grupo.add(gltf.scene);
  const contornos = new Map<string, Contorno>();
  gltf.scene.traverse((n) => {
    const m = /^ambiente:(.+)$/.exec(n.name);
    if (!m?.[1]) return;
    const caixa = new Box3().setFromObject(n);
    const externo = contorno(caixa, 0.05, COR.ouro, 0.55);
    const interno = contorno(caixa, 0.4, COR.ouroClaro, 1);
    interno.visible = false;
    grupo.add(externo, interno);
    contornos.set(m[1], { externo, interno });
  });
  return { grupo, contornos };
}
