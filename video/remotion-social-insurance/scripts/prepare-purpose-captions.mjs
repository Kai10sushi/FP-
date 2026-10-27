import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cues=JSON.parse(fs.readFileSync(path.join(root,'src/purpose-captions.json'),'utf8'));
const fmt=s=>{const n=Math.round(s*1000);return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')},${String(n%1000).padStart(3,'0')}`;};
for(let i=0;i<cues.length;i++){const [a,b]=cues[i];if(a<0||b<=a||b>70.1||(i&&a<cues[i-1][1]))throw new Error('Invalid cue');}
const base=path.join(root,'transcripts/purpose-recording18-v1');
fs.writeFileSync(base+'.srt',cues.map(([a,b,text],i)=>`${i+1}\n${fmt(a)} --> ${fmt(b)}\n${text}\n`).join('\n'));
fs.writeFileSync(base+'.txt',cues.map(c=>c[2]).join('\n')+'\n');
fs.writeFileSync(base+'.json',JSON.stringify({sourceFile:'レコーディング (18).m4a',sourceStart:2.3,sourceEnd:72.4,durationSeconds:70.1,internalCuts:[],status:'原音保持。自動文字起こし・台本・無音検出に基づく字幕。聴取での確認は未実施。',cues},null,2)+'\n');
console.log(`Validated ${cues.length} cues over 70.1 seconds.`);
