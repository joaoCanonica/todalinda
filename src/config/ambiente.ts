// Modo do site: "preview" (padrão: faixa "em revisão", selos PROVISÓRIO, noindex) ou "producao".
// Lido de PUBLIC_MODO (Astro/Vite) ou MODO (scripts Node).
type Modo = 'preview' | 'producao';

const lerEnv = (nome: string): string | undefined => {
  const viaVite = (import.meta as { env?: Record<string, string | undefined> }).env?.[nome];
  const viaNode = typeof process !== 'undefined' ? process.env[nome] : undefined;
  const v = viaVite ?? viaNode;
  return v === '' ? undefined : v;
};

const bruto = lerEnv('PUBLIC_MODO') ?? lerEnv('MODO') ?? 'preview';
export const MODO: Modo = bruto === 'producao' ? 'producao' : 'preview';
export const EM_PREVIEW = MODO === 'preview';
export const SITE_URL_ENV = lerEnv('PUBLIC_SITE_URL') ?? lerEnv('SITE_URL') ?? null;
export const GOOGLE_REVIEW_URL_ENV = lerEnv('PUBLIC_GOOGLE_REVIEW_URL') ?? null;
