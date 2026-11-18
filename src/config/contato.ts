import { confirmado, opcional } from './tipos.ts';

const FONTE = 'João (WAXLO) + ficha do Google, 17/11/2026';
const LAT = -27.8168249;
const LNG = -50.3245096;
const CID = '14959576611857227956';

export const contato = {
  /** Só dígitos, com DDI. Usado em wa.me. */
  whatsapp: confirmado('5549991772089', 'João (WAXLO), 17/11/2026'),
  telefone: confirmado(
    { exibir: '(49) 3018-0082', tel: '+554930180082' },
    'ficha do Google, 17/11/2026',
  ),
  instagram: confirmado(
    { usuario: 'somostodalinda', url: 'https://www.instagram.com/somostodalinda/' },
    'Instagram',
  ),
  endereco: confirmado(
    {
      logradouro: 'Rua Lauro Müller',
      numero: '574',
      bairro: 'Centro',
      cidade: 'Lages',
      uf: 'SC',
      cep: '88501-000',
      pais: 'BR',
      linha: 'Rua Lauro Müller, 574 · Centro · Lages/SC · 88501-000',
    },
    FONTE,
  ),
  geo: confirmado({ lat: LAT, lng: LNG }, 'ficha do Google, 17/11/2026'),
  plusCode: confirmado('5MMG+75 Lages, SC', 'ficha do Google, 17/11/2026'),
  mapas: {
    google: confirmado(`https://www.google.com/maps?cid=${CID}`, 'ficha do Google (cid)'),
    googleCid: CID,
    waze: confirmado(
      `https://waze.com/ul?ll=${LAT},${LNG}&navigate=yes`,
      'gerado das coordenadas da ficha',
    ),
    apple: confirmado(
      `https://maps.apple.com/?ll=${LAT},${LNG}&q=Todalinda`,
      'gerado das coordenadas da ficha',
    ),
  },
  /** Página do Facebook ("Todalinda | Lages SC"): o endereço exato não está no repositório. */
  facebook: opcional<string>(),
  estacionamento: opcional<string>(),
  pagamentos: opcional<string[]>(),
  acessibilidade: opcional<string>(),
  cartaoPresente: opcional<string>(),
  noivaForaDoSalao: opcional<boolean>(),
} as const;
