// Atualiza o status de funcionamento e destaca "hoje" na tabela. Roda no navegador (o build é estático).
import { local, statusEm } from '../lib/horario.ts';

function atualizar() {
  const agora = new Date();
  const s = statusEm(agora);
  for (const el of document.querySelectorAll<HTMLElement>('[data-status-horario]')) {
    const texto = el.querySelector('[data-status-texto]');
    if (texto) texto.textContent = s.texto;
    el.dataset.aberto = String(s.aberto);
  }
  const hoje = local(agora).diaSemana;
  for (const linha of document.querySelectorAll<HTMLElement>('[data-tabela-horario] [data-dia]')) {
    const ehHoje = Number(linha.dataset.dia) === hoje;
    linha.classList.toggle('hoje', ehHoje);
    if (ehHoje) linha.setAttribute('aria-current', 'date');
    else linha.removeAttribute('aria-current');
  }
}

atualizar();
setInterval(atualizar, 60_000);
