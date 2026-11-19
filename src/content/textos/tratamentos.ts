// /tratamentos: glossário do fio, reescrito das artes educativas da casa (docs/dados/textos-das-artes.md).
// Linguagem clara, sem promessa: o que cada etapa faz no fio, não o resultado garantido.
import { F, type Meta } from './fontes.ts';

export const meta: Meta = {
  title: 'Tratamentos capilares em Lages: o fio explicado · Todalinda',
  description:
    'Hidratação, nutrição, reconstrução e cauterização, explicadas camada por camada. Avaliação do fio em salão em Lages, no Centro, na Todalinda.',
};

export const fonte = F.artes;

export const pagina = {
  rotulo: 'Ficha técnica',
  titulo: { antes: 'O que acontece dentro do ', destaque: 'fio', depois: '' },
  resposta:
    'Na Todalinda, salão no Centro de Lages/SC, todo procedimento começa pela avaliação do fio. Esta página explica, em linguagem simples, as camadas do cabelo e o que cada tipo de tratamento faz nelas; qual deles o seu fio pede, a profissional indica na avaliação.',
  aviso:
    'Tratamento capilar é técnica de salão, não tratamento de saúde. Queda de cabelo e problemas no couro cabeludo pedem avaliação de um médico dermatologista.',
};

export const camadas = {
  titulo: 'As três camadas',
  intro: 'O fio de cabelo é formado por três camadas, que trabalham juntas.',
  itens: [
    {
      nome: 'Cutícula',
      texto:
        'A camada de fora. São células sobrepostas como escamas, que protegem o fio e controlam a entrada e a saída de água, nutrientes e lipídios. Quando estão alinhadas, a luz reflete melhor e o fio parece mais macio e brilhante.',
    },
    {
      nome: 'Córtex',
      texto:
        'A camada do meio. Guarda a queratina e a melanina, que dá a cor. É ela que responde pela força, pela elasticidade e pela forma do fio, e é nela que a coloração age.',
    },
    {
      nome: 'Medula',
      texto:
        'O centro do fio. Aparece nos fios mais grossos e pode nem existir nos mais finos. Tem pouco papel na estrutura.',
    },
  ],
};

export const dano = {
  titulo: 'Quando o fio está danificado',
  intro: 'Química, calor e atrito do dia a dia podem alterar as camadas. Os sinais mais comuns:',
  itens: [
    {
      nome: 'Cutículas abertas',
      texto: 'As escamas levantam e perdem o alinhamento. O fio fica áspero, poroso e sem brilho.',
    },
    {
      nome: 'Perda de água e nutrientes',
      texto:
        'Com a cutícula aberta, água, lipídios e nutrientes saem com mais facilidade. O fio resseca.',
    },
    {
      nome: 'Córtex exposto',
      texto: 'A camada de força fica fragilizada e perde elasticidade e forma.',
    },
    {
      nome: 'Textura irregular',
      texto: 'O fio fica opaco, áspero e mais sujeito a quebrar e abrir nas pontas.',
    },
  ],
};

export const tratamentos = {
  titulo: 'O que cada tratamento faz',
  itens: [
    {
      nome: 'Hidratação',
      oQueRepoe: 'água',
      texto:
        'Repõe água no interior do fio e ajuda a manter as cutículas alinhadas, o que diminui a porosidade e a perda de água. O toque fica mais macio e o fio, mais flexível.',
    },
    {
      nome: 'Nutrição',
      oQueRepoe: 'lipídios (óleos)',
      texto:
        'Repõe os lipídios entre as fibras de queratina e ajuda a selar a cutícula com óleos. Indicada quando o fio está ressecado e sem maleabilidade.',
    },
    {
      nome: 'Reconstrução',
      oQueRepoe: 'massa proteica (queratina)',
      texto:
        'Repõe a massa proteica do fio, principalmente depois de química, calor e escova frequente. Ajuda a devolver resistência e elasticidade à estrutura.',
    },
    {
      nome: 'Cauterização',
      oQueRepoe: 'massa proteica e selamento',
      texto:
        'Combina reposição de massa proteica com o selamento da cutícula, formando uma camada protetora que mantém os nutrientes dentro do fio.',
    },
  ],
  nota: 'Muitas vezes o fio pede mais de um, em sequência. O cronograma é montado na avaliação.',
};

export const cta = {
  titulo: 'Qual o seu fio pede?',
  texto: 'Agende uma avaliação: a profissional olha o fio e indica o tratamento.',
  botao: 'Agendar avaliação do fio',
};
