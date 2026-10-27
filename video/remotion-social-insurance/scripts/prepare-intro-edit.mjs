import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(fs.readFileSync(path.join(root, 'transcripts/レコーディング (16).json'), 'utf8'));
const out = path.join(root, 'transcripts');
const version = process.argv.includes('--v2') ? 'v2' : 'v1';
const basename = `intro-edited-${version}`;
const edits = version === 'v2' ? [[3.9, 56.5], [69.65, 77.55]] : [[3.9, 61.15], [74.15, 77.55]];
const replacements = [['給与名祭','給与明細'], ['手伝わり','手取り'], ['高生年金','厚生年金'], ['ロゴ','老後']];
const chunks = [];
let offset = 0;
for (const [start, end] of edits) {
  for (const chunk of raw.chunks) {
    const [a,rawEnd] = chunk.timestamp;
    // The recognizer compressed the final reread into 0.96 s.
    // Extend its caption to the following detected pause (an approximate cue).
    const b = version === 'v2' && a === 70.04 ? 73.8 : rawEnd;
    if (a >= end || b <= start) continue;
    let text = chunk.text.replace(/^、/, '').replace(/\?/g, '？');
    for (const [from,to] of replacements) text = text.replaceAll(from,to);
    chunks.push({text, timestamp:[+(Math.max(a,start)-start+offset).toFixed(3), +(Math.min(b,end)-start+offset).toFixed(3)]});
  }
  offset += end-start;
}
const stamp = n => {
  const ms = Math.round(n*1000);
  return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;
};
const result = {
  sourceFile:raw.sourceFile,
  audioFile:`public/audio/${basename}.m4a`,
  durationSeconds:+offset.toFixed(3),
  status:'確認用。字幕は台本と認識結果に基づく修正版。タイミングは自動認識の推定を編集後の時間に変換したもの。聴取確認は未実施。',
  replacements, edits:edits.map(([start,end])=>({sourceStart:start,sourceEnd:end})), chunks,
};
fs.writeFileSync(path.join(out,`${basename}.json`), JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(out,`${basename}.txt`), chunks.map(c=>c.text).join('\n')+'\n');
fs.writeFileSync(path.join(out,`${basename}.srt`), chunks.map((c,i)=>`${i+1}\n${stamp(c.timestamp[0])} --> ${stamp(c.timestamp[1])}\n${c.text}\n`).join('\n'));
fs.mkdirSync(path.join(root,'public/audio'),{recursive:true});
const filter = edits.map(([start,end],i)=>`[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${i}]`).join(';')+';[a0][a1]concat=n=2:v=0:a=1[out]';
fs.writeFileSync(path.join(out,`${basename}.ffmpeg-filter.txt`),filter);
for (const c of chunks) {
  if (!(c.timestamp[0]>=0 && c.timestamp[1]>c.timestamp[0] && c.timestamp[1]<=result.durationSeconds)) throw new Error('Invalid cue');
}
console.log(JSON.stringify({durationSeconds:result.durationSeconds,cues:chunks.length,joinSeconds:edits[0][1]-edits[0][0]}));
