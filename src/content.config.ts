import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { equipeSchema, servicoSchema, trabalhoSchema } from './content/schemas.ts';

// Dados em src/content/<coleção>/*.json; schemas em src/content/schemas.ts.
export const collections = {
  equipe: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/equipe' }),
    schema: equipeSchema,
  }),
  servicos: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/servicos' }),
    schema: servicoSchema,
  }),
  trabalhos: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/trabalhos' }),
    schema: trabalhoSchema,
  }),
};
