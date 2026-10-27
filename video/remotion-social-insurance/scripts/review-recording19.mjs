import fs from 'node:fs';
import {pipeline,env} from '@huggingface/transformers';
env.cacheDir='.cache/transcription';env.allowRemoteModels=false;
const wav=fs.readFileSync('.cache/recording19-review.wav');
let offset=12,pcm;
while(offset+8<wav.length){const size=wav.readUInt32LE(offset+4);if(wav.toString('ascii',offset,offset+4)==='data'){pcm=wav.subarray(offset+8,offset+8+size);break;}offset+=8+size+(size%2);}
if(!pcm)throw new Error('No PCM');
const audio=Float32Array.from({length:pcm.length/2},(_,i)=>pcm.readInt16LE(i*2)/32768);
const asr=await pipeline('automatic-speech-recognition','Xenova/whisper-small',{device:'cpu',dtype:'q8',local_files_only:true});
const result=[];
const opening=process.argv.includes('--opening');
for(const [start,end] of opening?[[4.5,6.5],[8,14.3]]:[[0,14.3],[14.3,28.2],[28.2,44.5],[44.5,57.8],[58,63],[71.4,87.65]]){
  const r=await asr(audio.slice(Math.round(start*16000),Math.round(end*16000)),{language:'japanese',task:'transcribe',return_timestamps:'word'});
  const item={start,end,text:r.text,chunks:r.chunks.map(c=>({...c,timestamp:c.timestamp.map(x=>x===null?end:+(x+start).toFixed(3))}))};
  result.push(item);console.log(JSON.stringify(item));
  fs.writeFileSync(`transcripts/recording19-${opening?'opening':'segment'}-review.json`,JSON.stringify(result,null,2));
}
