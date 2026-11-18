// Transcreve falas com Whisper local (faster-whisper em .ferramentas/venv), idioma pt.
// Uso: node scripts/transcrever.mjs [id ...]   (padrão: todos com "transcrever": true no manifesto)
// Saída: docs/dados/transcricoes/<id>.json (segmentos com tempo). Não sobrescreve sem FORCAR=1.
// Instalação (uma vez, local, sem global):
//   python3 -m venv .ferramentas/venv && .ferramentas/venv/bin/pip install faster-whisper
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { correcoesTranscricao } from './dados/curadoria.mjs';

const RAIZ = new URL('..', import.meta.url).pathname;
const PY = join(RAIZ, '.ferramentas/venv/bin/python');
const MODELO = process.env.MODELO_WHISPER ?? 'large-v3-turbo';
const SAIDA = join(RAIZ, 'docs/dados/transcricoes');
mkdirSync(SAIDA, { recursive: true });

if (!existsSync(PY)) {
  console.error('faster-whisper não instalado. Veja o cabeçalho deste arquivo.');
  process.exit(1);
}

const manifesto = JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8'));
const pedidos = process.argv.slice(2);
const alvos = manifesto.itens.filter((i) =>
  pedidos.length ? pedidos.includes(i.id) : i.transcrever === true,
);

const codigoPy = `
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel
wav, modelo, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
# áudio já decodificado pelo ffmpeg (16 kHz mono); evita depender do PyAV
with wave.open(wav, "rb") as w:
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
m = WhisperModel(modelo, device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, language="pt", beam_size=5, vad_filter=True,
    initial_prompt=prompt, condition_on_previous_text=False)
out = [{"inicio": round(s.start, 2), "fim": round(s.end, 2), "texto": s.text.strip()} for s in segs]
print(json.dumps({"modelo": modelo, "duracao": round(info.duration, 2), "segmentos": out}, ensure_ascii=False))
`;

// Vocabulário da casa ajuda o modelo com nomes próprios e técnicas.
const PROMPT =
  'Salão Todalinda, Lages. Edna Antoniolli, Dido Rodrigues. Loiro perolado, mechas, coloração, morena iluminada, Truss.';

for (const item of alvos) {
  const destino = join(SAIDA, `${item.id}.json`);
  if (existsSync(destino) && !process.env.FORCAR) {
    console.log(`já existe: ${item.id}`);
    continue;
  }
  const wav = join(tmpdir(), `${item.id}.wav`);
  const f = spawnSync('ffmpeg', [
    '-loglevel',
    'error',
    '-y',
    '-i',
    join(RAIZ, item.arquivo),
    '-ar',
    '16000',
    '-ac',
    '1',
    wav,
  ]);
  if (f.status !== 0) {
    console.error(`ffmpeg falhou: ${item.id}`);
    continue;
  }
  console.log(`transcrevendo ${item.id} (${MODELO})…`);
  const t0 = Date.now();
  const r = spawnSync(PY, ['-I', '-c', codigoPy, wav, MODELO, PROMPT], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, HF_HOME: join(RAIZ, '.ferramentas/hf') },
  });
  if (r.status !== 0) {
    console.error(r.stderr);
    continue;
  }
  const dados = JSON.parse(r.stdout);
  const correcoes = correcoesTranscricao[item.id] ?? [];
  for (const s of dados.segmentos)
    for (const [de, para] of correcoes) s.texto = s.texto.replace(de, para);
  dados.correcoes = correcoes.length ? 'aplicadas (scripts/dados/curadoria.mjs)' : 'nenhuma';
  dados.arquivo = item.arquivo;
  dados.revisado = false;
  writeFileSync(destino, JSON.stringify(dados, null, 2) + '\n');
  console.log(
    `ok ${item.id}: ${dados.segmentos.length} segmentos em ${((Date.now() - t0) / 1000).toFixed(0)} s`,
  );
}
