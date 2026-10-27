import fs from 'node:fs';
const specs={
 risk:{sourceFile:'メリット1：リスク分散.m4a',edits:[[1.15,37.65],[40.9,51.2]],sections:[[1.15,'intro'],[20.32,'shared'],[41.36,'limit']],sourceCues:[
 [1.7,5.5,'社会保険のメリットを、3つに分けて考えてみましょう。'],
 [6.48,10.35,'一つ目は、大きな負担も一人だけで抱え込まないことです。'],
 [11.14,13.6,'もちろん、貯蓄は大切です。'],
 [14.28,15.94,'ただ、病気やけがは、'],
 [15.94,19.8,'十分に貯金ができるまで待ってくれるわけではありません。'],
 [20.32,24.9,'そこで、いつ誰に起きるかわからない負担に、みんなで備えます。'],
 [25.58,28.22,'こうした考え方が、リスク分散です。'],
 [29.3,32,'自分が今すぐ給付を受けていなくても、'],
 [32.3,35.3,'必要なときに支えにつながる仕組みに参加している、'],
 [35.3,37.5,'と考えるとわかりやすいですね。'],
 [41.36,44.9,'ただし、損失がすべて埋まるわけではありません。'],
 [45.3,47.46,'社会保険と自分の備え、'],
 [47.46,51,'その両方で暮らしを守っていくことが大切です。']
 ]},
 coverage:{sourceFile:'メリット2：幅広い保証.m4a',edits:[[1.5,45.6]],sections:[[1.5,'intro'],[6.98,'hospital'],[13,'wide'],[20.8,'notice'],[32.46,'check']],sourceCues:[
 [1.9,5.85,'二つ目は、暮らしのさまざまな場面に保障があることです。'],
 [6.98,8.56,'社会保険というと、'],
 [8.56,12.2,'病院で使う健康保険を思い浮かべるかもしれません。'],
 [13,14.8,'でも、先ほど見たように、'],
 [14.8,20,'老後や障害、介護、失業など、支える場面は広がっています。'],
 [20.8,22.4,'ここで大切なのは、'],
 [22.4,25.6,'制度の名前を全部暗記することではありません。'],
 [26.36,31.56,'この困りごとにも関係する制度があるかもしれない、と気づけることです。'],
 [32.46,36.4,'ただし、誰もが同じ保障を受けられるわけではありません。'],
 [37.3,39.1,'働き方や年齢、'],
 [39.1,42.24,'加入している制度などによって違うので、'],
 [42.24,45.48,'自分の場合を確認する必要があります。']
 ]}
};
const fmt=s=>{const n=Math.round(s*1000);return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')},${String(n%1000).padStart(3,'0')}`;};
const combined={};
for(const [key,spec] of Object.entries(specs)){
 const map=s=>{let offset=0;for(const [a,b] of spec.edits){if(s>=a&&s<=b)return +(offset+s-a).toFixed(3);offset+=b-a;}throw new Error('Timestamp outside retained audio');};
 const durationSeconds=+spec.edits.reduce((sum,[a,b])=>sum+b-a,0).toFixed(3);
 const cues=spec.sourceCues.map(([a,b,text])=>({start:map(a),end:map(b),text}));
 for(let i=0;i<cues.length;i++){const c=cues[i];if(c.start<0||c.end<=c.start||c.end>durationSeconds||(i&&c.start<cues[i-1].end))throw new Error('Invalid cue');}
 const sections=spec.sections.map(([start,id])=>({start:map(start),id}));combined[key]={durationSeconds,cues,sections};
 const base=`transcripts/${key}-benefit-v1`;
 fs.writeFileSync(base+'.json',JSON.stringify({...spec,...combined[key],status:'短区間認識・台本・無音検出に基づく確認用編集。聴取確認は未実施。'},null,2));
 fs.writeFileSync(base+'.txt',cues.map(c=>c.text).join('\n')+'\n');
 fs.writeFileSync(base+'.srt',cues.map((c,i)=>`${i+1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`).join('\n'));
 const filter=spec.edits.map(([a,b],i)=>`[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS[a${i}]`).join(';')+';'+spec.edits.map((_,i)=>`[a${i}]`).join('')+`concat=n=${spec.edits.length}:v=0:a=1[out]`;
 fs.writeFileSync(base+'.filter.txt',filter);console.log(key,durationSeconds,'seconds',cues.length,'cues');
}
fs.writeFileSync('src/benefits-timing.json',JSON.stringify(combined,null,2)+'\n');
