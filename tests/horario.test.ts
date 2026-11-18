import { describe, expect, it } from 'vitest';
import { feriadosDoAno, pascoa } from '../src/config/horario.ts';
import { horarioResumo, local, statusEm } from '../src/lib/horario.ts';

// Lages: UTC−3 o ano todo (sem horário de verão desde 2019).
const em = (isoLocal: string) => new Date(`${isoLocal}-03:00`);

describe('statusEm', () => {
  it('segunda 10h → fechado, abre amanhã (terça)', () => {
    expect(statusEm(em('2026-11-16T10:00')).texto).toBe('Fechado · abre amanhã às 9h');
  });
  it('terça 8h50 → fechado, abre hoje às 9h', () => {
    const s = statusEm(em('2026-11-17T08:50'));
    expect(s).toMatchObject({ aberto: false, texto: 'Fechado · abre hoje às 9h', minutos: 10 });
  });
  it('quarta 10h → aberto até 19h', () => {
    expect(statusEm(em('2026-11-18T10:00'))).toMatchObject({
      aberto: true,
      texto: 'Aberto agora · até 19h',
    });
  });
  it('sábado 18h30 → fecha em 30 min; 18h40 → fecha em 20 min', () => {
    expect(statusEm(em('2026-11-21T18:30')).texto).toBe('Fecha em 30 min');
    expect(statusEm(em('2026-11-21T18:40')).texto).toBe('Fecha em 20 min');
  });
  it('sábado 19h01 → fechado, abre terça', () => {
    expect(statusEm(em('2026-11-21T19:01')).texto).toBe('Fechado · abre terça às 9h');
  });
  it('sábado 19h00 em ponto já é fechado', () => {
    expect(statusEm(em('2026-11-21T19:00')).aberto).toBe(false);
  });
  it('domingo → abre terça', () => {
    expect(statusEm(em('2026-11-29T11:00')).texto).toBe('Fechado · abre terça às 9h');
  });
  it('feriado numa quarta (Tiradentes 2027) → fechado, abre amanhã', () => {
    expect(local(em('2027-04-21T10:00')).diaSemana).toBe(3);
    const s = statusEm(em('2027-04-21T10:00'));
    expect(s.texto).toBe('Fechado · feriado (Tiradentes) · abre amanhã às 9h');
    expect(s.feriado?.esfera).toBe('nacional');
  });
  it('virada de ano: 31/12 à noite pula o feriado de 1º/1 (sexta) e abre sábado', () => {
    expect(statusEm(em('2026-12-31T19:30')).texto).toBe('Fechado · abre sábado às 9h');
    expect(statusEm(em('2027-01-01T10:00')).texto).toBe(
      'Fechado · feriado (Confraternização Universal) · abre amanhã às 9h',
    );
  });
  it('se a casa abrir nos feriados, o feriado não fecha', () => {
    expect(statusEm(em('2027-04-21T10:00'), { fechaNosFeriados: false }).aberto).toBe(true);
  });
  it('usa o fuso da casa, não o do servidor', () => {
    // 02:30Z de quarta = 23:30 de terça em Lages
    expect(local(new Date('2026-11-18T02:30:00Z'))).toMatchObject({
      iso: '2026-11-17',
      diaSemana: 2,
    });
  });
});

describe('feriados', () => {
  it('Páscoa e Sexta-feira da Paixão', () => {
    expect(pascoa(2026)).toBe('2026-04-05');
    expect(pascoa(2027)).toBe('2027-03-28');
    expect(feriadosDoAno(2027).find((f) => f.nome === 'Sexta-feira da Paixão')?.data).toBe(
      '2027-03-26',
    );
  });
  it('inclui o municipal de Lages e a Consciência Negra', () => {
    const f = feriadosDoAno(2026);
    expect(f.find((x) => x.data === '2026-11-22')?.esfera).toBe('municipal');
    expect(f.some((x) => x.data === '2026-11-20')).toBe(true);
  });
  it('resumo do horário', () => {
    expect(horarioResumo()).toBe('ter–sáb · 9h–19h');
  });
});
