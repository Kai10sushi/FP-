import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = 'intro-recording17-v1';
const raw = JSON.parse(fs.readFileSync(path.join(root,'transcripts/レコーディング (17).json'),'utf8'));
// Boundaries are inside detected pauses. Keep the complete final paragraph intact.
const edits = [[0.95,11.35],[20.2,39.1],[43.45,68.05]];
const corrections = [['給与明祭','給与明細'],['高生年金','厚生年金'],['前付き','毎月'],['ロゴ','老後'],['調理','整理']];
const chunks = [];
let offset = 0;
for (const [start,end] of edits) {
  for (const cue of raw.chunks) {
    const [a,b] = cue.timestamp;
    if (a >= end || b <= start) continue;
    let text = cue.text.replace(/^、/,'');
    for (const [from,to] of corrections) text = text.replaceAll(from,to);
    chunks.push({text,timestamp:[+(Math.max(a,start)-start+offset).toFixed(3),+(Math.min(b,end)-start+offset).toFixed(3)]});
  }
  offset += end-start;
}
const durationSeconds = +offset.toFixed(3);
for (let i=0;i<chunks.length;i++) {
  const [a,b] = chunks[i].timestamp;
  if (a<0 || b<=a || b>durationSeconds || (i && a<chunks[i-1].timestamp[1])) throw new Error('Invalid subtitle timing');
}
const stamp = seconds => {
  const ms = Math.round(seconds*1000);
  return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;
};
const output = path.join(root,'transcripts',name);
fs.writeFileSync(output+'.json',JSON.stringify({sourceFile:raw.sourceFile,audioFile:`public/audio/${name}.m4a`,durationSeconds,edits,corrections,status:'確認用。自動認識と台本の照合・無音検出に基づく編集。聴取確認は未実施。字幕時刻は推定値。',chunks},null,2)+'\n');
fs.writeFileSync(output+'.txt',chunks.map(c=>c.text).join('\n')+'\n');
fs.writeFileSync(output+'.srt',chunks.map((c,i)=>`${i+1}\n${stamp(c.timestamp[0])} --> ${stamp(c.timestamp[1])}\n${c.text}\n`).join('\n'));
fs.writeFileSync(output+'.ffmpeg-filter.txt',edits.map(([start,end],i)=>`[0:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${i}]`).join(';')+';[a0][a1][a2]concat=n=3:v=0:a=1[out]');
console.log(JSON.stringify({durationSeconds,cues:chunks.length,joinSeconds:[10.4,29.3]}));
