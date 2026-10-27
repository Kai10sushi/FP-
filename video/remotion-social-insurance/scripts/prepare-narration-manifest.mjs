import fs from 'node:fs';
const intro=fs.readFileSync('src/NarratedIntro.tsx','utf8').split('const cues:')[1].split('];')[0];
const introCues=[...intro.matchAll(/\[\s*([\d.]+),\s*([\d.]+),\s*'([^']*)'\s*\]/g)].map(m=>({start:Number(m[1]),end:Number(m[2]),text:m[3]}));
const purpose=JSON.parse(fs.readFileSync('src/purpose-captions.json','utf8')).map(([start,end,text])=>({start,end,text}));
const fields=JSON.parse(fs.readFileSync('src/fields-timing.json','utf8'));
const benefits=JSON.parse(fs.readFileSync('src/benefits-timing.json','utf8'));
const entries=[
 ['intro','導入','intro-recording17-v1.m4a',53.9,introCues],
 ['purpose','社会保険の目的','purpose-recording18-v1.m4a',70.1,purpose],
 ['fields','4分野の地図','fields-recording19-v2.m4a',74.25,fields.cues],
 ['risk','リスク分散','risk-benefit-v1.m4a',benefits.risk.durationSeconds,benefits.risk.cues],
 ['coverage','幅広い保障','coverage-benefit-v1.m4a',benefits.coverage.durationSeconds,benefits.coverage.cues],
];
const format=s=>{const ms=Math.round(s*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(n=>String(n).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};
const records=Object.fromEntries(entries.map(([id,title,file,duration,cues])=>{
 for(let i=0;i<cues.length;i++) {
  const c=cues[i];
  if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||c.end>duration+0.03||(i&&c.start<cues[i-1].end-0.001)) throw new Error('Invalid captions: '+id);
 }
 if(cues.length===0)throw new Error('No captions: '+id);
 return [id,{title,source:'audio/'+file,processed:'audio/'+id+'-clean-v1.wav',duration,cues}];
}));
fs.mkdirSync('transcripts/cleaned-v1',{recursive:true});
for(const [id,r] of Object.entries(records))fs.writeFileSync('transcripts/cleaned-v1/'+id+'.srt',r.cues.map((c,i)=>[i+1,format(c.start)+' --> '+format(c.end),c.text,''].join('\n')).join('\n'),'utf8');
fs.writeFileSync('src/narration-recordings.json',JSON.stringify(records,null,2)+'\n','utf8');
console.log(JSON.stringify(Object.fromEntries(Object.entries(records).map(([id,r])=>[id,{duration:r.duration,cues:r.cues.length}]))));

