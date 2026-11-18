import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
  checar3D,
  checarCapturas,
  checarHtml,
  checarMidias,
  checarServicos,
  checarWhatsApp,
  deveFalhar,
  type ItemManifesto,
} from '../src/lib/travas.ts';

const item = (id: string, extra: Partial<ItemManifesto> = {}): ItemManifesto => ({
  id,
  natureza: 'foto',
  naoUsar: false,
  crianca: 'nao',
  resolucaoMax: 2400,
  parAntesDepois: null,
  ...extra,
});
const manifesto = [
  item('f-ok'),
  item('f-proibida', { naoUsar: true }),
  item('f-crianca', { crianca: 'sim' }),
  item('f-idade', { crianca: 'verificar' }),
  item('cap-x', { natureza: 'captura-de-tela', resolucaoMax: 480 }),
];

describe('travas (funções)', () => {
  it('mídia: naoUsar, criança, idade a confirmar, inexistente', () => {
    const regras = (modo: 'preview' | 'producao') =>
      checarMidias(
        [
          { id: 'f-proibida', onde: 'a' },
          { id: 'f-crianca', onde: 'b' },
          { id: 'f-idade', onde: 'c' },
          { id: 'nao-existe', onde: 'd' },
          { id: 'f-ok', onde: 'e' },
        ],
        manifesto,
        modo,
      ).map((a) => `${a.nivel}:${a.regra}`);
    expect(regras('preview')).toEqual([
      'trava:midia-naoUsar',
      'trava:midia-crianca',
      'aviso:midia-crianca',
      'erro:midia-inexistente',
    ]);
    expect(regras('producao')).toContain('trava:midia-crianca');
    expect(regras('producao').filter((r) => r === 'trava:midia-crianca')).toHaveLength(2);
  });
  it('captura acima de 480 px, 3D inventado, serviço publicado sem mídia, WhatsApp', () => {
    expect(
      checarCapturas([item('cap-y', { natureza: 'captura-de-tela', resolucaoMax: 682 })])[0]?.regra,
    ).toBe('captura-480');
    expect(checarCapturas(manifesto)).toEqual([]);
    expect(checar3D([{ id: 'm', nome: 'M', fonte: null, aprovadoPeloJoao: false }])).toHaveLength(
      1,
    );
    expect(checar3D([{ id: 'm', nome: 'M', fonte: null, aprovadoPeloJoao: true }])).toEqual([]);
    expect(
      checar3D([{ id: 'm', nome: 'M', fonte: 'planta 2026', aprovadoPeloJoao: false }]),
    ).toEqual([]);
    expect(
      checarServicos(
        [
          {
            id: 's',
            publicado: true,
            midia: [],
            profissionais: { estado: 'bloqueante', valor: null },
          },
        ],
        [],
      )[0]?.regra,
    ).toBe('servico-sem-midia');
    expect(checarWhatsApp(null)[0]?.nivel).toBe('trava');
    expect(checarWhatsApp('5549991772089')).toEqual([]);
  });
  it('HTML: termo vetado, tolerância em avaliação literal, AggregateRating, capturas', () => {
    expect(
      checarHtml('<p>Faça seu corte com desconto</p>', 'x.html', manifesto, 'preview').map(
        (a) => a.regra,
      ),
    ).toEqual(['termo-vetado']);
    expect(
      checarHtml(
        '<meta name="description" content="O melhor salão">',
        'x.html',
        manifesto,
        'preview',
      ),
    ).toHaveLength(2);
    expect(
      checarHtml(
        '<blockquote data-avaliacao-literal>Foi o melhor corte da vida</blockquote>',
        'x.html',
        manifesto,
        'preview',
      ),
    ).toEqual([]);
    expect(
      checarHtml(
        '<blockquote data-avaliacao-literal>tem promoção</blockquote>',
        'x.html',
        manifesto,
        'preview',
      ),
    ).toHaveLength(1);
    expect(
      checarHtml('<script>const a = "grátis"</script>', 'x.html', manifesto, 'preview'),
    ).toEqual([]);
    expect(
      checarHtml('{"@type":"AggregateRating"}', 'x.html', manifesto, 'preview')[0]?.regra,
    ).toBe('aggregate-rating');
    expect(
      checarHtml(
        '<img srcset="/media/img/cap-x-800.webp 800w">',
        'x.html',
        manifesto,
        'preview',
      ).map((a) => a.regra),
    ).toEqual(['captura-480']);
    expect(
      checarHtml('<img src="/media/img/cap-x-480.webp">', 'x.html', manifesto, 'preview'),
    ).toEqual([]);
  });
  it('preview passa com travas; produção não; erro derruba os dois', () => {
    const trava = [{ nivel: 'trava' as const, regra: 'r', mensagem: 'm' }];
    expect(deveFalhar(trava, 'preview')).toBe(false);
    expect(deveFalhar(trava, 'producao')).toBe(true);
    expect(deveFalhar([{ nivel: 'erro', regra: 'r', mensagem: 'm' }], 'preview')).toBe(true);
    expect(deveFalhar([{ nivel: 'aviso', regra: 'r', mensagem: 'm' }], 'producao')).toBe(false);
    expect(deveFalhar([{ nivel: 'aviso', regra: 'r', mensagem: 'm' }], 'producao', true)).toBe(
      true,
    );
  });
});

describe('validate-config (CLI)', () => {
  const rodar = (modo: string, ...args: string[]) =>
    spawnSync('node', ['scripts/validate-config.mjs', ...args], {
      env: { ...process.env, MODO: modo, PUBLIC_MODO: '' },
      encoding: 'utf8',
    });
  it('preview passa com pendências', () => {
    const r = rodar('preview');
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('preview liberado');
  });
  it('trava simulada derruba a produção (e o preview segue de pé)', () => {
    expect(rodar('producao', '--simular=whatsapp').status).toBe(1);
    expect(rodar('preview', '--simular=whatsapp').status).toBe(0);
  });
});

describe('idade a confirmar por trecho de vídeo', () => {
  const m = [
    item('v-x', {
      natureza: 'video',
      trechos: [
        { nome: 'ondas', crianca: 'nao' },
        { nome: 'iluminada', crianca: 'verificar' },
      ],
    }),
  ];
  it('só o trecho marcado acusa', () => {
    expect(
      checarHtml(
        '<source src="/media/video/v-x--ondas-720x900-4x5.webm">',
        'x.html',
        m,
        'producao',
      ),
    ).toEqual([]);
    expect(
      checarHtml(
        '<source src="/media/video/v-x--iluminada-720x900-4x5.webm">',
        'x.html',
        m,
        'producao',
      ).map((a) => a.nivel),
    ).toEqual(['trava']);
  });
});
