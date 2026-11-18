import { z } from 'astro/zod';

// Ids de serviço e grupos (fonte única; a lógica do agendador usa estes tipos).
export const GRUPOS = ['cor', 'corte', 'tratamento', 'festa', 'unhas', 'estetica'] as const;
export const SERVICOS = [
  'morena-iluminada',
  'loiros',
  'ruivo-e-cobre',
  'castanho-e-mocha',
  'mechas',
  'corte',
  'tratamentos',
  'penteado-e-make',
  'esmalteria',
  'limpeza-de-pele',
] as const;
export type Grupo = (typeof GRUPOS)[number];
export type IdServico = (typeof SERVICOS)[number];

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const idMidia = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);

export const equipeSchema = z.object({
  slug,
  nome: z.string().min(2),
  funcao: z.string().min(2),
  anosDeProfissao: z.number().int().positive().optional(),
  /** Etiquetas da função (vêm do que o João informou); usadas para SUGERIR quem faz cada serviço. */
  especialidades: z.array(z.string()),
  /** Serviços que a pessoa faz: só o que a casa confirmou. Vazio = pendente. */
  servicos: z.array(z.enum(SERVICOS)),
  /** Id de mídia do retrato; null = cartão tipográfico até chegar o retrato. */
  foto: idMidia.nullable(),
  instagram: z
    .string()
    .regex(/^[a-z0-9._]+$/)
    .optional(),
  ordem: z.number().int(),
  confirmado: z.boolean(),
});

const profissionaisConfirmados = z.object({
  estado: z.literal('confirmado'),
  valor: z.array(slug).min(1),
  fonte: z.string().min(3),
});
const profissionaisPendentes = z.object({
  estado: z.literal('bloqueante'),
  valor: z.null(),
  rotulo: z.string(),
  /** Sugestão pelas especialidades (só no preview, com selo PROVISÓRIO). */
  sugestao: z.array(slug),
});

export const servicoSchema = z
  .object({
    id: z.enum(SERVICOS),
    nome: z.string().min(2),
    grupo: z.enum(GRUPOS),
    resumo: z.string().min(10),
    /** Etiquetas de especialidade que indicam quem pode fazer (para a sugestão). */
    especialidades: z.array(z.string()),
    processo: z
      .array(
        z.object({
          etapa: z.enum(['avaliacao', 'teste-de-mecha', 'tecnica', 'tratamento', 'finalizacao']),
          titulo: z.string(),
          texto: z.string(),
        }),
      )
      .min(2),
    profissionais: z.discriminatedUnion('estado', [
      profissionaisConfirmados,
      profissionaisPendentes,
    ]),
    midia: z.array(idMidia),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })),
    publicado: z.boolean(),
    /** Opcional até a casa confirmar o serviço (ex.: limpeza de pele). */
    opcional: z.boolean().default(false),
    /** Texto ainda é rascunho (reescrito na sessão 5). */
    textoRevisado: z.boolean().default(false),
    ordem: z.number().int(),
  })
  .refine((s) => !s.publicado || s.midia.length >= 1, {
    message: 'serviço publicado precisa de pelo menos 1 mídia',
    path: ['midia'],
  })
  .refine((s) => s.processo[0]?.etapa === 'avaliacao', {
    message: 'o processo começa pela avaliação',
    path: ['processo'],
  })
  .refine((s) => s.grupo !== 'cor' || s.processo.some((p) => p.etapa === 'teste-de-mecha'), {
    message: 'serviço de cor (química) tem teste de mecha',
    path: ['processo'],
  });

export const trabalhoSchema = z.object({
  midia: idMidia,
  tecnica: z.enum(SERVICOS),
  /** Só quando a casa confirmar quem fez. */
  profissional: slug.optional(),
  destaque: z.boolean(),
  parAntesDepois: z
    .object({
      papel: z.enum(['antes', 'depois', 'ambos']),
      com: z.array(idMidia),
      confirmado: z.boolean(),
    })
    .nullable(),
});

export type Membro = z.infer<typeof equipeSchema>;
export type Servico = z.infer<typeof servicoSchema>;
export type Trabalho = z.infer<typeof trabalhoSchema>;

// ---------- ambientes (tour 3D) ----------
const vec3 = z.tuple([z.number(), z.number(), z.number()]);
export const ambienteSchema = z.object({
  id: slug,
  nome: z.string().min(2),
  /** "pendente" até a planta: o tour não afirma em que andar fica. */
  andar: z.enum(['terreo', 'superior', 'externo', 'pendente']),
  descricao: z.string().min(10),
  /** Serviços feitos ali (ids da coleção servicos). Só o evidente; o resto, vazio. */
  servicos: z.array(z.enum(SERVICOS)),
  /** Ids de mídia do manifesto (capturas: no máximo 480 px). */
  midia: z.array(idMidia),
  /** Pose da câmera na maquete atual (esquemática até a planta). */
  camera: z.object({ posicao: vec3, alvo: vec3 }),
  /** De onde vem o layout: planta (medidas), captura (scan 3D), foto, pendente (esquemático). */
  fonteLayout: z.enum(['planta', 'captura', 'foto', 'pendente']),
  /** Splat comprimido deste ambiente (public/modelos/…), quando a captura existir. */
  splat: z.string().nullable().default(null),
  ordem: z.number().int(),
});
export type Ambiente = z.infer<typeof ambienteSchema>;
