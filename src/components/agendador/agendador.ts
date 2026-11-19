// Comportamento do agendador: lê o formulário nativo, monta o pedido (src/lib/agenda.ts), mostra a
// prévia exata e prepara o envio pelo destino configurado (src/config/agenda.ts). Nada é guardado.
// Também abre a gaveta a partir de qualquer link com data-agendar (já preenchida com o serviço/pessoa).
import { agenda } from '../../config/agenda.ts';
import {
  ErroAgenda,
  hojeEmLages,
  montarPedido,
  perguntaQuimica,
  proximosDias,
  resolverDestino,
  type Pedido,
  type ServicoAgenda,
} from '../../lib/agenda.ts';
import { medir } from '../../lib/medicao.ts';
import { linkWhatsApp, MENSAGENS } from '../../lib/whatsapp.ts';

interface Dados {
  servicos: ServicoAgenda[];
  equipe: { slug: string; nome: string }[];
  sugeridos: Record<string, string[]>;
  preview: boolean;
}
export interface Preenchimento {
  servico?: string | null;
  profissional?: string | null;
}

const iniciados = new WeakMap<HTMLFormElement, (p: Preenchimento) => void>();

function iniciar(form: HTMLFormElement): (p: Preenchimento) => void {
  const ja = iniciados.get(form);
  if (ja) return ja;
  const dados = JSON.parse(form.dataset.dados ?? '{}') as Dados;
  const $ = <T extends Element>(s: string) => form.querySelector<T>(s);
  const passoProf = $<HTMLFieldSetElement>('[data-passo-profissional]');
  const ajudaProf = $<HTMLElement>('[data-ajuda-profissional]');
  const quimica = $<HTMLFieldSetElement>('[data-pergunta-quimica]');
  const primeiraCor = $<HTMLElement>('[data-primeira-cor]');
  const previa = $<HTMLOutputElement>('[data-previa]');
  const enviar = $<HTMLAnchorElement>('[data-enviar]');
  const geral = linkWhatsApp(MENSAGENS.geral());
  /** Pessoa que a cliente escolheu no perfil (?profissional=): aparece em qualquer serviço. */
  let pessoaFixa: string | null = null;

  // os dias: refeitos com a data de hoje (o HTML veio com a data do build)
  const caixaDias = $<HTMLElement>('[data-dias]');
  if (caixaDias) {
    const marcado = (form.elements.namedItem('data') as RadioNodeList | null)?.value;
    caixaDias.replaceChildren(
      ...proximosDias(hojeEmLages(), agenda.diasAFrente).map((d) => {
        const l = document.createElement('label');
        l.className = `agd__dia${d.disponivel ? '' : ' agd__dia--fechado'}`;
        const i = document.createElement('input');
        i.type = 'radio';
        i.name = 'data';
        i.value = d.data;
        i.disabled = !d.disponivel;
        i.checked = d.disponivel && d.data === marcado;
        const r = document.createElement('span');
        r.className = 'agd__dia-rotulo';
        r.textContent = d.rotulo;
        l.append(i, r);
        if (d.motivo) {
          const m = document.createElement('span');
          m.className = 'agd__motivo';
          m.textContent = d.motivo;
          l.append(m);
          i.setAttribute('aria-label', `${d.rotulo}, indisponível: ${d.motivo}`);
        }
        // as classes de escopo do Astro não chegam aos nós criados aqui: copia o atributo
        const escopo = caixaDias.getAttributeNames().find((a) => a.startsWith('data-astro-cid'));
        if (escopo)
          for (const el of [l, i, r, ...l.querySelectorAll('span')]) el.setAttribute(escopo, '');
        return l;
      }),
    );
  }

  const valor = (nome: string) =>
    (form.elements.namedItem(nome) as RadioNodeList | null)?.value ?? '';

  function pedido(): { p: Pedido; passo: string } | null {
    const s = dados.servicos.find((x) => x.id === valor('servico'));
    if (!s) return null;
    const slug = valor('profissional');
    const pessoa = slug ? (dados.equipe.find((m) => m.slug === slug) ?? null) : null;
    const data = valor('data') || null;
    const periodo = (valor('periodo') || null) as NonNullable<Pedido['periodo']> | null;
    const q = valor('quimica');
    const pv = valor('primeira');
    const p: Pedido = {
      servico: s,
      profissional: pessoa,
      profissionalLivre: Boolean(pessoa && !s.profissionaisConfirmados?.includes(pessoa.slug)),
      data,
      periodo,
      quimicaRecente: q ? q === 'sim' : null,
      primeiraVez: pv ? pv === 'sim' : null,
      nome: (form.elements.namedItem('nome') as HTMLInputElement | null)?.value ?? '',
    };
    const passo = data || periodo ? 'quando' : pessoa ? 'profissional' : 'servico';
    return { p, passo };
  }

  function atualizar() {
    const id = valor('servico');
    const s = dados.servicos.find((x) => x.id === id);
    // (2) com quem: confirmadas; no preview, a sugestão (com selo); e a pessoa escolhida no perfil
    const confirmados = new Set(s?.profissionaisConfirmados ?? []);
    const sugeridos = new Set(dados.preview && s ? (dados.sugeridos[s.id] ?? []) : []);
    let algum = false;
    for (const l of form.querySelectorAll<HTMLElement>('[data-pessoa]')) {
      const slug = l.dataset.pessoa ?? '';
      const mostra = confirmados.has(slug) || sugeridos.has(slug) || slug === pessoaFixa;
      l.hidden = !mostra;
      const selo = l.querySelector<HTMLElement>('[data-selo]');
      if (selo)
        selo.hidden = !(sugeridos.has(slug) && !confirmados.has(slug) && slug !== pessoaFixa);
      const r = l.querySelector('input');
      if (!mostra && r?.checked) {
        r.checked = false;
        (form.querySelector('input[name="profissional"][value=""]') as HTMLInputElement).checked =
          true;
      }
      algum ||= mostra;
    }
    if (passoProf) passoProf.hidden = !algum;
    if (ajudaProf) ajudaProf.hidden = !(sugeridos.size > 0 && confirmados.size === 0);
    // perguntas condicionais
    const temQuimica = Boolean(s && perguntaQuimica(s));
    if (quimica) {
      quimica.hidden = !temQuimica;
      if (!temQuimica) for (const r of quimica.querySelectorAll('input')) r.checked = false;
    }
    if (primeiraCor) primeiraCor.hidden = !(temQuimica && valor('primeira') === 'sim');
    // prévia + destino
    const r = pedido();
    if (!r || !previa || !enviar) {
      if (previa) previa.value = MENSAGENS.geral();
      if (enviar) enviar.href = geral;
      return;
    }
    try {
      const acao = resolverDestino(r.p, agenda.destino.valor);
      previa.value = montarPedido(r.p);
      if (acao.tipo === 'abrir-url') enviar.href = acao.url;
    } catch (e) {
      if (!(e instanceof ErroAgenda)) throw e;
      previa.value = MENSAGENS.geral();
      enviar.href = geral;
    }
  }

  function preencher(p: Preenchimento) {
    pessoaFixa =
      p.profissional && dados.equipe.some((m) => m.slug === p.profissional) ? p.profissional : null;
    if (p.servico) {
      const r = form.querySelector<HTMLInputElement>(
        `input[name="servico"][value="${CSS.escape(p.servico)}"]`,
      );
      if (r) r.checked = true;
    }
    atualizar();
    if (pessoaFixa) {
      const r = form.querySelector<HTMLInputElement>(
        `input[name="profissional"][value="${CSS.escape(pessoaFixa)}"]`,
      );
      if (r) r.checked = true;
    }
    atualizar();
  }

  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Enter no campo de nome: envia pelo botão (link)
    enviar?.click();
  });
  enviar?.addEventListener('click', (e) => {
    const r = pedido();
    medir('agendador_enviado', { servico: r?.p.servico.id ?? '', passo: r?.passo ?? 'nenhum' });
    if (!r) return;
    try {
      const acao = resolverDestino(r.p, agenda.destino.valor);
      if (acao.tipo === 'requisicao') {
        // fase 2 (agenda online): o envio real nasce com a API; até lá, não chega aqui
        e.preventDefault();
        void fetch(acao.endpoint, {
          method: acao.metodo,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(acao.corpo),
        });
      }
    } catch {
      /* pedido inválido: o link geral segue */
    }
  });

  if ('lerUrl' in form.dataset) {
    const q = new URLSearchParams(location.search);
    preencher({ servico: q.get('servico'), profissional: q.get('profissional') });
  } else atualizar();
  iniciados.set(form, preencher);
  form.dataset.pronto = '1'; // e2e e conferência: o agendador já responde
  return preencher;
}

for (const f of document.querySelectorAll<HTMLFormElement>('form[data-agendador]')) iniciar(f);

// ---------- gaveta: qualquer link com data-agendar abre o agendador já preenchido ----------
const gaveta = document.querySelector<HTMLDialogElement>('dialog[data-gaveta-agendar]');
const naPagina = document.querySelector<HTMLFormElement>('#agendar form[data-agendador]');
if (!gaveta && naPagina && !naPagina.dataset.atalho) {
  // a home tem o agendador na própria página: o link rola até ele, já preenchido
  naPagina.dataset.atalho = '1';
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-agendar]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    naPagina.reset();
    iniciar(naPagina)({
      servico: a.dataset.agendarServico ?? null,
      profissional: a.dataset.agendarProfissional ?? null,
    });
    naPagina.closest('#agendar')?.scrollIntoView({ block: 'start' });
    naPagina
      .querySelector<HTMLInputElement>('input:checked, input')
      ?.focus({ preventScroll: true });
  });
}
if (gaveta && !gaveta.dataset.pronta) {
  gaveta.dataset.pronta = '1';
  const form = gaveta.querySelector<HTMLFormElement>('form[data-agendador]');
  let origem: HTMLElement | null = null;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-agendar]');
    if (!a || !form || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    origem = a;
    form.reset();
    iniciar(form)({
      servico: a.dataset.agendarServico ?? null,
      profissional: a.dataset.agendarProfissional ?? null,
    });
    gaveta.showModal();
    gaveta.querySelector<HTMLElement>('[data-gaveta-titulo]')?.focus();
  });
  gaveta.addEventListener('click', (e) => {
    if (e.target === gaveta) gaveta.close();
  });
  gaveta.addEventListener('close', () => origem?.focus());
}
