import fs from 'node:fs';
import {pipeline,env} from '@huggingface/transformers';
env.cacheDir='.cache/transcription';env.allowRemoteModels=false;
const asr=await pipeline('automatic-speech-recognition','Xenova/whisper-small',{device:'cpu',dtype:'q8',local_files_only:true});
for(const [key,sections] of [['risk',[[0,10.7],[10.7,20],[20,28.6],[28.8,37.8],[40.9,51.3]]],['coverage',[[1.5,12.3],[12.6,20.1],[20.4,31.6],[32,45.5]]]]){
 const wav=fs.readFileSync(`.cache/${key}-review.wav`);let offset=12,pcm;
 while(offset+8<wav.length){const n=wav.readUInt32LE(offset+4);if(wav.toString('ascii',offset,offset+4)==='data'){pcm=wav.subarray(offset+8,offset+8+n);break;}offset+=8+n+(n%2);}
 if(!pcm)throw new Error('No PCM');const audio=Float32Array.from({length:pcm.length/2},(_,i)=>pcm.readInt16LE(i*2)/32768);const results=[];
 for(const [start,end] of sections){const r=await asr(audio.slice(Math.round(start*16000),Math.round(end*16000)),{language:'japanese',task:'transcribe',return_timestamps:'word'});const item={start,end,text:r.text,chunks:r.chunks.map(c=>({...c,timestamp:c.timestamp.map(x=>x===null?end:+(x+start).toFixed(3))}))};results.push(item);console.log(key,JSON.stringify(item));fs.writeFileSync(`transcripts/${key}-segment-review.json`,JSON.stringify(results,null,2));}
}
