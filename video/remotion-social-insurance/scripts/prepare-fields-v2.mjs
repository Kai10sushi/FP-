import fs from 'node:fs';
const edits=[[1.15,4.3],[8.05,62.9],[71.4,87.65]];
const map=s=>{let offset=0;for(const [a,b] of edits){if(s>=a&&s<=b)return +(offset+s-a).toFixed(3);offset+=b-a;}throw new Error(`Outside retained audio: ${s}`);};
const sourceCues=[
 [1.76,4.18,'では、どんな社会保険があるのでしょうか。'],
 [8.56,11.36,'今回は、医療・年金・介護・労働の'],
 [11.36,14,'4つにまとめて見ていきます。'],
 [14.86,16.5,'まず、医療保険。'],
 [16.78,20.02,'けがや病気で治療を受けるとき、'],
 [20.02,22.1,'医療費などを支える仕組みです。'],
 [24.3,27.7,'会社員の健康保険は、この医療の一つです。'],
 [28.74,30.2,'次に、年金保険。'],
 [30.8,34.16,'老後の年金というイメージが強いかもしれませんが、'],
 [34.16,36.2,'それだけではありません。'],
 [36.54,38.5,'一定の障害が残ったときや、'],
 [38.5,42.2,'亡くなった方の遺族の生活を支える役割もあります。'],
 [43.12,44.2,'そして、介護保険。'],
 [45,47.06,'介護が必要になったとき、'],
 [47.06,51.2,'条件に応じて、介護サービスなどを利用するための仕組みです。'],
 [51.84,53.46,'最後が、労働保険。'],
 [53.46,57.2,'これは、雇用保険と労災保険をまとめた呼び方です。'],
 [58.32,62.85,'雇用保険は、失業したときの生活や再就職などを支えます。'],
 [71.75,75.48,'労災保険は、仕事や通勤が原因の'],
 [75.48,78.15,'けがや病気などに備えるものです。'],
 [79.02,81.48,'つまり、雇用保険と労災保険を'],
 [81.48,83.4,'別々に数えれば5つ。'],
 [83.94,87.4,'今回は、この2つを労働保険としてまとめています。'],
];
const cues=sourceCues.map(([a,b,text])=>({start:map(a),end:map(b),text}));
const durationSeconds=+edits.reduce((s,[a,b])=>s+b-a,0).toFixed(3);
const sections=[{start:0,id:'overview'},...[[14.86,'medical'],[28.74,'pension'],[43.12,'care'],[51.84,'labor'],[58.32,'employment'],[71.75,'accident'],[79.02,'count']].map(([s,id])=>({start:map(s),id}))];
const data={durationSeconds,sections,cues};
for(let i=0;i<cues.length;i++){const c=cues[i];if(c.start<0||c.end<=c.start||c.end>durationSeconds||(i&&c.start<cues[i-1].end))throw new Error('Invalid cue');}
const prev='transcripts/fields-timing-v1.json';if(!fs.existsSync(prev))fs.copyFileSync('src/fields-timing.json',prev);
fs.writeFileSync('src/fields-timing.json',JSON.stringify(data,null,2)+'\n');
const base='transcripts/fields-recording19-v2';
const fmt=s=>{const n=Math.round(s*1000);return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')},${String(n%1000).padStart(3,'0')}`;};
fs.writeFileSync(base+'.srt',cues.map((c,i)=>`${i+1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`).join('\n'));
fs.writeFileSync(base+'.txt',cues.map(c=>c.text).join('\n')+'\n');
fs.writeFileSync(base+'.json',JSON.stringify({...data,edits,sourceCues,status:'ときやはユーザー確認済み。短区間再認識と無音検出によるタイミング調整。聴取確認は未実施。'},null,2));
fs.writeFileSync(base+'.filter.txt',edits.map(([a,b],i)=>`[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS[a${i}]`).join(';')+';[a0][a1][a2]concat=n=3:v=0:a=1[out]');
console.log(JSON.stringify({durationSeconds,cues:cues.length,joins:[3.15,58]}));
