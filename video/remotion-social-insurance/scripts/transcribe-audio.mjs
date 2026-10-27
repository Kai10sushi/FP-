import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pipeline, env, LogLevel} from '@huggingface/transformers';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultOutputDir = path.join(projectRoot, 'transcripts');
const defaultCacheDir = path.join(projectRoot, '.cache', 'transcription');

function usage(message) {
  if (message) console.error('エラー: ' + message + '\n');
  console.error('使い方: node scripts/transcribe-audio.mjs <16kHzモノラルWAV> [--model=Xenova/whisper-small] [--offline]');
  process.exit(message ? 1 : 0);
}

function parseArgs(argv) {
  const options = {
    model: 'Xenova/whisper-small',
    language: 'japanese',
    offline: false,
    output: null,
    sourceName: null,
  };
  const positional = [];
  for (const arg of argv) {
    if (arg === '--offline') options.offline = true;
    else if (arg.startsWith('--model=')) options.model = arg.slice('--model='.length);
    else if (arg.startsWith('--language=')) options.language = arg.slice('--language='.length);
    else if (arg.startsWith('--output=')) options.output = arg.slice('--output='.length);
    else if (arg.startsWith('--source-name=')) options.sourceName = arg.slice('--source-name='.length);
    else if (arg === '--help' || arg === '-h') usage();
    else positional.push(arg);
  }
  if (positional.length !== 1) usage('WAVファイルを1つ指定してください。');
  return {...options, input: path.resolve(positional[0])};
}

async function readWavFloat32(input) {
  const buffer = await fs.readFile(input);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('WAVファイルを指定してください。m4a等は transcribe-audio.ps1 で変換します。');
  }

  let offset = 12;
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let audioFormat = 0;
  let dataStart = -1;
  let dataSize = 0;

  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (id === 'fmt ') {
      audioFormat = buffer.readUInt16LE(start);
      channels = buffer.readUInt16LE(start + 2);
      sampleRate = buffer.readUInt32LE(start + 4);
      bitsPerSample = buffer.readUInt16LE(start + 14);
    } else if (id === 'data') {
      dataStart = start;
      dataSize = Math.min(size, buffer.length - start);
      break;
    }
    offset = start + size + (size % 2);
  }

  if (audioFormat !== 1 || channels !== 1 || sampleRate !== 16000 || bitsPerSample !== 16 || dataStart < 0) {
    throw new Error('WAVは16kHz・モノラル・16bit PCMである必要があります。');
  }

  const samples = new Float32Array(Math.floor(dataSize / 2));
  for (let i = 0; i < samples.length; i++) {
    samples[i] = buffer.readInt16LE(dataStart + i * 2) / 32768;
  }
  return samples;
}

function formatSrtTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const whole = Math.floor(safe % 60);
  const millis = Math.floor((safe - Math.floor(safe)) * 1000);
  return [hours, minutes, whole].map((v) => String(v).padStart(2, '0')).join(':') +
    ',' + String(millis).padStart(3, '0');
}

function chunksToSrt(chunks) {
  return chunks.map((chunk, index) => {
    const [start, end] = chunk.timestamp || [0, 0];
    return String(index + 1) + '\n' +
      formatSrtTime(start) + ' --> ' + formatSrtTime(end ?? start) + '\n' +
      String(chunk.text || '').trim() + '\n';
  }).join('\n');
}

const options = parseArgs(process.argv.slice(2));
const stat = await fs.stat(options.input).catch(() => null);
if (!stat?.isFile()) usage('WAVファイルが見つかりません: ' + options.input);

await fs.mkdir(defaultOutputDir, {recursive: true});
await fs.mkdir(defaultCacheDir, {recursive: true});
env.cacheDir = defaultCacheDir;
env.allowRemoteModels = !options.offline;
env.allowLocalModels = true;
env.useFSCache = true;
env.logLevel = LogLevel.WARNING;

console.log('WAV音声を読み込んでいます...');
const audio = await readWavFloat32(options.input);
console.log('音声認識モデルを準備しています: ' + options.model);
if (options.offline) console.log('オフラインモード: キャッシュ済みモデルだけを使用します。');

let lastProgressKey = '';
const transcriber = await pipeline('automatic-speech-recognition', options.model, {
  device: 'cpu',
  dtype: 'q8',
  cache_dir: defaultCacheDir,
  local_files_only: options.offline,
  progress_callback: (info) => {
    if (info?.status === 'progress' && Number.isFinite(info.progress)) {
      const key = String(info.file || '') + ':' + Math.floor(info.progress / 10);
      if (key !== lastProgressKey) {
        lastProgressKey = key;
        console.log('モデル取得 ' + Math.floor(info.progress) + '% ' + String(info.file || ''));
      }
    }
  },
});

console.log('文字起こし中です...');
const result = await transcriber(audio, {
  language: options.language,
  task: 'transcribe',
  chunk_length_s: 30,
  stride_length_s: 5,
  return_timestamps: 'word',
});
const chunks = Array.isArray(result.chunks) ? result.chunks : [];
const basename = path.basename(options.sourceName || options.input, path.extname(options.sourceName || options.input));
const outputBase = options.output ? path.resolve(options.output) : path.join(defaultOutputDir, basename);
const payload = {
  sourceFile: options.sourceName || path.basename(options.input),
  model: options.model,
  language: options.language,
  text: result.text.trim(),
  chunks,
};
await fs.writeFile(outputBase + '.json', JSON.stringify(payload, null, 2), 'utf8');
await fs.writeFile(outputBase + '.srt', chunksToSrt(chunks), 'utf8');
await fs.writeFile(outputBase + '.txt', result.text.trim() + '\n', 'utf8');
console.log('完了:');
console.log('  ' + outputBase + '.txt');
console.log('  ' + outputBase + '.srt');
console.log('  ' + outputBase + '.json');

