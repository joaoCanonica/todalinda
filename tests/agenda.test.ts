import { describe, expect, it } from 'vitest';
import {
  DIAS,
  ErroAgenda,
  EXTRAS,
  montarPedido,
  proximosDias,
  opcoesProfissional,
  paraAgenda,
  perguntaQuimica,
  resolverDestino,
  type ServicoAgenda,
} from '../src/lib/agenda.ts';
import { comOrigem, linkWhatsApp, MENSAGENS } from '../src/lib/whatsapp.ts';

const mechas: ServicoAgenda = {
  id: 'mechas',
  nome: 'Mechas',
  grupo: 'cor',
  profissionaisConfirmados: ['isabela-cristina'],
};
const mechasPendente: ServicoAgenda = { ...mechas, profissionaisConfirmados: null };
const corte: ServicoAgenda = {
  id: 'corte',
  nome: 'Corte',
  grupo: 'corte',
  profissionaisConfirmados: null,
};
const unhas: ServicoAgenda = {
  id: 'esmalteria',
  nome: 'Esmalteria',
  grupo: 'unhas',
  profissionaisConfirmados: null,
};
const isabela = { slug: 'isabela-cristina', nome: 'Isabela Cristina' };
const equipe = [isabela, { slug: 'dido-rodrigues', nome: 'Dido Rodrigues' }];

describe('montarPedido', () => {
  it('exemplo completo do briefing', () => {
    expect(
      montarPedido({
        servico: mechas,
        profissional: isabela,
        dia: 'sabado',
        periodo: 'tarde',
        quimicaRecente: true,
        primeiraVez: true,
      }),
    ).toBe(
      'Olá! Vim pelo site e quero agendar Mechas com Isabela Cristina, de preferência sábado à tarde. Já fiz química nos últimos 6 meses: sim. É minha primeira vez na Todalinda.',
    );
  });
  it('só o serviço', () => {
    expect(montarPedido({ servico: corte })).toBe('Olá! Vim pelo site e quero agendar Corte.');
  });
  it('dia sem período, período sem dia, qualquer horário', () => {
    expect(montarPedido({ servico: corte, dia: 'terca' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência terça.',
    );
    expect(montarPedido({ servico: corte, periodo: 'manha' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência de manhã.',
    );
    expect(montarPedido({ servico: corte, periodo: 'qualquer' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte.',
    );
    expect(montarPedido({ servico: corte, dia: 'quinta', periodo: 'qualquer' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência quinta, em qualquer horário.',
    );
  });
  it('química: só para cor/mechas; "não" também aparece', () => {
    expect(montarPedido({ servico: mechasPendente, quimicaRecente: false })).toBe(
      'Olá! Vim pelo site e quero agendar Mechas. Já fiz química nos últimos 6 meses: não.',
    );
    expect(montarPedido({ servico: unhas, quimicaRecente: true })).toBe(
      'Olá! Vim pelo site e quero agendar Esmalteria.',
    );
    expect(perguntaQuimica(mechas)).toBe(true);
    expect(perguntaQuimica(corte)).toBe(false);
  });
  it('cliente antiga e nome (limpo)', () => {
    expect(montarPedido({ servico: corte, primeiraVez: false, nome: '  Ana\nPaula  ' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte. Já sou cliente da Todalinda. Meu nome é Ana Paula.',
    );
  });
  it('rejeita segunda/domingo, período inválido e profissional não confirmada', () => {
    expect(() => montarPedido({ servico: corte, dia: 'segunda' as never })).toThrow(ErroAgenda);
    expect(() => montarPedido({ servico: corte, dia: 'domingo' as never })).toThrow(ErroAgenda);
    expect(() => montarPedido({ servico: corte, periodo: 'noite' as never })).toThrow(ErroAgenda);
    expect(() => montarPedido({ servico: mechasPendente, profissional: isabela })).toThrow(
      /não está confirmada/,
    );
  });
  it('dias oferecidos são ter–sáb', () => {
    expect(DIAS.map((d) => d.rotulo)).toEqual(['terça', 'quarta', 'quinta', 'sexta', 'sábado']);
  });
});

describe('opcoesProfissional', () => {
  it('sem confirmação: só "Sem preferência"', () => {
    expect(opcoesProfissional(mechasPendente, equipe)).toEqual([
      { slug: null, nome: 'Sem preferência' },
    ]);
  });
  it('com confirmação: "Sem preferência" + confirmadas', () => {
    expect(opcoesProfissional(mechas, equipe).map((o) => o.nome)).toEqual([
      'Sem preferência',
      'Isabela Cristina',
    ]);
  });
  it('paraAgenda lê o estado da coleção', () => {
    expect(
      paraAgenda({
        id: 'corte',
        nome: 'Corte',
        grupo: 'corte',
        profissionais: { estado: 'bloqueante', valor: null },
      }).profissionaisConfirmados,
    ).toBeNull();
    expect(
      paraAgenda({
        id: 'corte',
        nome: 'Corte',
        grupo: 'corte',
        profissionais: { estado: 'confirmado', valor: ['dido-rodrigues'] },
      }).profissionaisConfirmados,
    ).toEqual(['dido-rodrigues']);
  });
});

describe('destinos', () => {
  const pedido = { servico: corte, dia: 'sexta' as const, periodo: 'manha' as const };
  it('whatsapp (fase 1): abre wa.me com o texto', () => {
    const a = resolverDestino(pedido);
    expect(a.tipo).toBe('abrir-url');
    if (a.tipo !== 'abrir-url') return;
    expect(a.url.startsWith('https://wa.me/5549991772089?text=')).toBe(true);
    expect(decodeURIComponent(a.url.split('text=')[1] ?? '')).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência sexta de manhã.',
    );
  });
  it('link externo (fase 2): só https', () => {
    expect(
      resolverDestino(pedido, { tipo: 'link-externo', url: 'https://agenda.exemplo/todalinda' }),
    ).toEqual({ tipo: 'abrir-url', url: 'https://agenda.exemplo/todalinda' });
    expect(() => resolverDestino(pedido, { tipo: 'link-externo', url: 'http://x' })).toThrow(
      ErroAgenda,
    );
  });
  it('api (fase 2, stub): devolve a requisição, não envia', () => {
    expect(resolverDestino(pedido, { tipo: 'api', endpoint: '/api/agenda' })).toEqual({
      tipo: 'requisicao',
      metodo: 'POST',
      endpoint: '/api/agenda',
      corpo: {
        texto: 'Olá! Vim pelo site e quero agendar Corte, de preferência sexta de manhã.',
        servico: 'corte',
        profissional: null,
        data: null,
        dia: 'sexta',
        periodo: 'manha',
      },
    });
    expect(() => resolverDestino(pedido, { tipo: 'api', endpoint: 'ftp://x' })).toThrow(ErroAgenda);
  });
});

describe('whatsapp', () => {
  it('mensagens prontas', () => {
    expect(MENSAGENS.geral()).toBe('Olá! Vim pelo site da Todalinda e quero agendar um horário.');
    expect(MENSAGENS.servico('Corte')).toBe('Olá! Vim pelo site e quero agendar Corte.');
    expect(MENSAGENS.trabalho('morena iluminada')).toBe(
      'Olá! Vi no site o trabalho de morena iluminada e quero algo assim.',
    );
    expect(MENSAGENS.profissional('Dido Rodrigues')).toBe(
      'Olá! Vim pelo site e quero agendar com Dido Rodrigues.',
    );
    expect(MENSAGENS.ambiente()).toBe(
      'Olá! Vi o espaço no site e quero agendar uma visita/horário.',
    );
    expect(MENSAGENS.duvida()).toBe('Olá! Vim pelo site e tenho uma dúvida.');
  });
  it('garante "Vim pelo site" no início', () => {
    expect(comOrigem('Quero um horário.')).toBe('Vim pelo site. Quero um horário.');
    expect(comOrigem('Olá! Quero um horário.')).toBe('Olá! Vim pelo site. Quero um horário.');
    for (const f of Object.values(MENSAGENS)) expect(comOrigem(f('x'))).toBe(f('x'));
  });
  it('link e trava de número ausente', () => {
    expect(linkWhatsApp()).toBe(
      `https://wa.me/5549991772089?text=${encodeURIComponent(MENSAGENS.geral())}`,
    );
    expect(() => linkWhatsApp('oi', null)).toThrow(/WhatsApp ausente/);
  });
});

describe('agendador por data (sessão 7)', () => {
  it('data + período, data em qualquer horário', () => {
    expect(montarPedido({ servico: corte, data: '2026-11-24', periodo: 'tarde' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência terça, 24/11, à tarde.',
    );
    expect(montarPedido({ servico: corte, data: '2026-11-28', periodo: 'qualquer' })).toBe(
      'Olá! Vim pelo site e quero agendar Corte, de preferência sábado, 28/11, em qualquer horário.',
    );
  });
  it('recusa domingo, segunda e feriado', () => {
    expect(() => montarPedido({ servico: corte, data: '2026-11-23' })).toThrow(ErroAgenda);
    expect(() => montarPedido({ servico: corte, data: '2026-11-22' })).toThrow(ErroAgenda);
    expect(() => montarPedido({ servico: corte, data: '2026-12-25' })).toThrow(/feriado/);
  });
  it('"Não sei ainda" e "Avaliação capilar"', () => {
    expect(montarPedido({ servico: { ...EXTRAS.naoSei, profissionaisConfirmados: null } })).toBe(
      'Olá! Vim pelo site e quero agendar um horário (ainda não sei qual serviço).',
    );
    expect(montarPedido({ servico: { ...EXTRAS.avaliacao, profissionaisConfirmados: null } })).toBe(
      'Olá! Vim pelo site e quero agendar Avaliação capilar.',
    );
  });
  it('profissional escolhida pela cliente (perfil) passa sem confirmação da casa', () => {
    expect(
      montarPedido({
        servico: corte,
        profissional: { slug: 'dido-rodrigues', nome: 'Dido Rodrigues' },
        profissionalLivre: true,
      }),
    ).toBe('Olá! Vim pelo site e quero agendar Corte com Dido Rodrigues.');
  });
  it('próximos 14 dias: dom/seg e feriados indisponíveis, com motivo', () => {
    const dias = proximosDias('2026-11-18', 14);
    expect(dias).toHaveLength(14);
    expect(dias[0]?.data).toBe('2026-11-19');
    const dom = dias.find((d) => d.data === '2026-11-22');
    expect(dom?.disponivel).toBe(false);
    expect(dom?.motivo).toMatch(/domingo/);
    const consciencia = dias.find((d) => d.data === '2026-11-20');
    expect(consciencia?.disponivel).toBe(false);
    expect(consciencia?.motivo).toMatch(/feriado/);
    expect(dias.find((d) => d.data === '2026-11-21')?.disponivel).toBe(true);
  });
});
