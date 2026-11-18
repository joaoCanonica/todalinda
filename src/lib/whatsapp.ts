import { contato } from '../config/contato.ts';
import { valorDe } from '../config/tipos.ts';

export const MENSAGENS = {
  geral: () => 'Olá! Vim pelo site da Todalinda e quero agendar um horário.',
  servico: (servico: string) => `Olá! Vim pelo site e quero agendar ${servico}.`,
  trabalho: (tecnica: string) => `Olá! Vi no site o trabalho de ${tecnica} e quero algo assim.`,
  profissional: (nome: string) => `Olá! Vim pelo site e quero agendar com ${nome}.`,
  ambiente: () => 'Olá! Vi o espaço no site e quero agendar uma visita/horário.',
  duvida: () => 'Olá! Vim pelo site e tenho uma dúvida.',
} as const;

/** Garante que a mensagem diga, logo no início, que a pessoa veio do site. */
export function comOrigem(texto: string): string {
  const t = texto.trim();
  if (/^Olá!\s+(Vim pelo site|Vi no site|Vi o espaço no site)/.test(t)) return t;
  if (/^Olá!/.test(t)) return t.replace(/^Olá!\s*/, 'Olá! Vim pelo site. ');
  return `Vim pelo site. ${t}`;
}

export function linkWhatsApp(
  texto: string = MENSAGENS.geral(),
  numero: string | null = valorDe(contato.whatsapp),
): string {
  if (!numero || !/^\d{12,13}$/.test(numero))
    throw new Error('WhatsApp ausente ou inválido em src/config/contato.ts');
  return `https://wa.me/${numero}?text=${encodeURIComponent(comOrigem(texto))}`;
}
