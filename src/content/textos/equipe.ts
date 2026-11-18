// /equipe e /equipe/<slug>. Função e anos: confirmados pelo João (src/content/equipe).
// "Quem faz o quê" (serviços de cada pessoa) só aparece quando a casa confirmar.
import { F, real, type Meta, type Real } from './fontes.ts';

export const meta: Meta = {
  title: 'Equipe Todalinda: cabeleireiros e coloristas em Lages',
  description:
    'Conheça quem cuida do seu fio na Todalinda, salão em Lages, no Centro: coloristas, cabeleireiros, manicure, nail designer e maquiadora.',
};

export const pagina = {
  etiqueta: '#TalentoTodalinda',
  titulo: { antes: 'Quem cuida do seu ', destaque: 'fio', depois: '' },
  resposta:
    'A equipe da Todalinda, salão no Centro de Lages/SC, reúne cabeleireiros, colorista, manicure, nail designer e maquiadora, sob a direção da fundadora Edna Antoniolli. Você pode agendar com uma profissional específica ou deixar a casa indicar.',
  fala: real('Hoje somos fortes porque temos pessoas.', F.revista5anos, 'literal'),
};

export interface Perfil {
  meta: Meta;
  linha: string; // uma linha (home e grade)
  bio: string[]; // só fatos confirmados
  especialidades: string[];
  fala?: Real;
  agendar: string;
  whatsapp: string;
  semRetrato?: string; // texto do cartão tipográfico
}

const m = (nome: string, funcao: string): Meta => ({
  title: `${nome}, ${funcao.toLowerCase()} · Todalinda Lages`.slice(0, 60),
  description: `${nome} é ${funcao.toLowerCase()} na Todalinda, salão em Lages, no Centro. Agende com ${nome.split(' ')[0]} pelo WhatsApp.`,
});

export const perfis: Record<string, Perfil> = {
  'edna-antoniolli': {
    meta: m('Edna Antoniolli', 'Fundadora da Todalinda'),
    linha: 'Fundadora. Abriu a casa em 2017.',
    bio: [
      'Edna Antoniolli abriu a Todalinda em 2017, no Centro de Lages. É ela quem conta a história da casa nas revistas e nos vídeos.',
      'Sob a direção dela, a casa cresceu de um sonho para uma equipe de sete profissionais.',
    ],
    especialidades: ['Direção da casa'],
    fala: real(
      'Talvez uma das partes mais bonitas de empreender seja essa: ver um sonho se tornar um lugar.',
      F.ednaSonho,
    ),
    agendar: 'Falar com a Edna',
    whatsapp: 'Olá! Vim pelo site e quero falar com a Edna.',
  },
  'dido-rodrigues': {
    meta: m('Dido Rodrigues', 'Cabeleireiro'),
    linha: 'Cabeleireiro, 26 anos de profissão.',
    bio: ['Dido Rodrigues é cabeleireiro há 26 anos.'],
    especialidades: ['Cabelo'],
    fala: real('A gente consegue fazer um loiro num cabelo 100% branco.', F.dido, 'literal'),
    agendar: 'Agendar com Dido',
    whatsapp: 'Olá! Vim pelo site e quero agendar com Dido Rodrigues.',
    semRetrato: 'Retrato em breve.',
  },
  'andressa-savaris': {
    meta: m('Andressa Savaris', 'Cabeleireira e cosmetóloga'),
    linha: 'Cabeleireira e cosmetóloga, 9 anos de profissão.',
    bio: ['Andressa Savaris é cabeleireira e cosmetóloga, com 9 anos de profissão.'],
    especialidades: ['Cabelo', 'Cosmetologia'],
    agendar: 'Agendar com Andressa',
    whatsapp: 'Olá! Vim pelo site e quero agendar com Andressa Savaris.',
  },
  'isabela-cristina': {
    meta: m('Isabela Cristina', 'Colorista'),
    linha: 'Colorista: colorimetria avançada, mechas, técnica + cor.',
    bio: [
      'Isabela Cristina é colorista, com especialização em colorimetria avançada e mechas. Está na equipe desde março de 2020.',
    ],
    especialidades: ['Colorimetria avançada', 'Mechas', 'Técnica + cor'],
    agendar: 'Agendar com Isabela',
    whatsapp: 'Olá! Vim pelo site e quero agendar com Isabela Cristina.',
  },
  karine: {
    meta: m('Karine (Kah)', 'Manicure e pedicure'),
    linha: 'Manicure e pedicure.',
    bio: ['Karine, a Kah, é manicure e pedicure da esmalteria Todalinda.'],
    especialidades: ['Manicure', 'Pedicure'],
    agendar: 'Agendar com Kah',
    whatsapp: 'Olá! Vim pelo site e quero agendar com a Karine (Kah).',
    semRetrato: 'Retrato em breve.',
  },
  'thaynara-colombo': {
    meta: m('Thaynara Colombo', 'Educadora e nail designer'),
    linha: 'Educadora e nail designer.',
    bio: ['Thaynara Colombo é educadora e nail designer.'],
    especialidades: ['Nail design', 'Educação'],
    fala: real('Cada unha tem uma necessidade diferente.', F.thaynara, 'literal'),
    agendar: 'Agendar com Thaynara',
    whatsapp: 'Olá! Vim pelo site e quero agendar com Thaynara Colombo.',
    semRetrato: 'Retrato em breve.',
  },
  'marina-schpanski': {
    meta: m('Marina Schpanski', 'Maquiadora'),
    linha: 'Maquiadora.',
    bio: ['Marina Schpanski é maquiadora.'],
    especialidades: ['Maquiagem'],
    agendar: 'Agendar com Marina',
    whatsapp: 'Olá! Vim pelo site e quero agendar com Marina Schpanski.',
    semRetrato: 'Retrato em breve.',
  },
};

export const trabalhosDaPessoa = {
  titulo: 'Trabalhos',
  vazio: 'Os trabalhos assinados aparecem aqui assim que a casa confirmar a autoria de cada foto.',
};
