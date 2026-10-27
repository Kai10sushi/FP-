"""Light local cleanup, no cuts, pitch/time changes, or uploaded recordings.
Requires NumPy (bundled) and PyAV from the project's .tools/audio-processing.
All measurements are dBFS/RMS, not LUFS or a subjective listening assessment.
"""
import sys, json, wave, hashlib, math
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / ".tools/audio-processing"))
import av
import numpy as np

def db(v):
    return float(20*np.log10(max(float(v), 1e-12)))

def read_audio(path, duration):
    with av.open(str(path)) as container:
        stream=container.streams.audio[0]
        rate=stream.codec_context.sample_rate
        chunks=[frame.to_ndarray() for frame in container.decode(stream)]
    if not chunks: raise RuntimeError("No audio: "+str(path))
    samples=np.concatenate(chunks,axis=1).astype(np.float64)
    # The input recordings are floating-point planar AAC. Refuse unsupported formats.
    if not all(c.dtype.kind=="f" for c in chunks): raise RuntimeError("Expected floating AAC decoder output")
    channels=samples.shape[0]
    mono=np.mean(samples,axis=0)
    max_channel=int(np.argmax(np.mean(samples*samples,axis=1)))
    used_channel=None
    if np.sqrt(np.mean(mono*mono)) < 0.5*np.sqrt(np.mean(samples[max_channel]**2)):
        mono=samples[max_channel]
        used_channel=max_channel
    expected=round(duration*rate)
    if abs(len(mono)-expected)>round(rate*0.08):
        raise RuntimeError("Unexpected duration discrepancy: "+str(path)+" "+str(len(mono)/rate))
    # Drop only codec padding, preserving the already-approved edit's timeline.
    mono=mono[:expected] if len(mono)>=expected else np.pad(mono,(0,expected-len(mono)))
    return mono,rate,{"inputChannels":channels,"usedChannelInsteadOfDownmix":used_channel}

def process(signal,rate,cues):
    nfft=2048
    hop=512
    pad=nfft//2
    padded=np.pad(signal,(pad,pad+nfft),mode="reflect")
    starts=np.arange(0,len(padded)-nfft+1,hop)
    win=np.hanning(nfft)
    frames=np.lib.stride_tricks.sliding_window_view(padded,nfft)[::hop]
    centers=(starts+pad-pad)/rate
    rms=np.sqrt(np.mean(frames**2,axis=1))
    quiet=np.ones(len(frames),dtype=bool)
    speech=np.zeros(len(signal),dtype=bool)
    for c in cues:
        quiet &= ~((centers>=c["start"]-0.15)&(centers<=c["end"]+0.15))
        speech[max(0,round(c["start"]*rate)):min(len(signal),round(c["end"]*rate))]=True
    candidates=np.flatnonzero(quiet)
    if len(candidates)<20:
        candidates=np.argsort(rms)[:max(20,round(len(frames)*0.08))]
    else:
        candidates=candidates[np.argsort(rms[candidates])[:max(20,round(len(candidates)*0.5))]]
    spectrum=np.fft.rfft(frames*win,axis=1)
    noise=np.median(np.abs(spectrum[candidates])**2,axis=0)
    # Maximum broadband reduction 3 dB; keep consonants and breaths, no hard gate.
    gain=np.sqrt(np.maximum(1-0.35*noise/(np.abs(spectrum)**2+1e-15),10**(-3/10)))
    freq=np.fft.rfftfreq(nfft,1/rate)
    highpass=1/np.sqrt(1+(60/np.maximum(freq,1e-12))**4)
    highpass[0]=0
    filtered=np.fft.irfft(spectrum*gain*highpass,n=nfft,axis=1)*win
    out=np.zeros(len(padded))
    norm=np.zeros(len(padded))
    for i,start in enumerate(starts):
        out[start:start+nfft]+=filtered[i]
        norm[start:start+nfft]+=win*win
    out=out[pad:pad+len(signal)]/np.maximum(norm[pad:pad+len(signal)],1e-10)
    if not np.any(speech): raise RuntimeError("No speech windows")
    before_rms=np.sqrt(np.mean(signal[speech]**2))
    after_rms=np.sqrt(np.mean(out[speech]**2))
    peak=np.max(np.abs(out))
    multiplier=min(max(10**(-23/20)/max(after_rms,1e-12),0.5),2.0)
    multiplier=min(multiplier,10**(-1/20)/max(peak,1e-12))
    out*=multiplier
    quiet_samples=~speech
    return out,{
      "speechRmsBeforeDbfs":db(before_rms),"speechRmsAfterDbfs":db(np.sqrt(np.mean(out[speech]**2))),
      "peakBeforeDbfs":db(np.max(np.abs(signal))),"peakAfterDbfs":db(np.max(np.abs(out))),
      "constantGainDb":db(multiplier),"noiseEstimateFrames":int(len(candidates)),
      "noiseReductionCapDb":3,"highpassHz":60,
      "durationChanged":False,"sampleCount":len(out),
      "nonfiniteSamples":int(np.sum(~np.isfinite(out))),
      "clippedSamples":int(np.sum(np.abs(out)>=1)),
      "correlationWithOriginal":float(np.corrcoef(signal,out)[0,1])
    }

def write_wav(path,signal,rate):
    path.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(path),"wb") as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate)
        f.writeframes(np.rint(np.clip(signal,-1,32767/32768)*32768).astype("<i2").tobytes())

def main():
    records=json.loads((ROOT/"src/narration-recordings.json").read_text(encoding="utf-8"))
    results={}
    for key,record in records.items():
        source=ROOT/"public"/record["source"]
        dest=ROOT/"public"/record["processed"]
        signal,rate,decode_notes=read_audio(source,record["duration"])
        out,metrics=process(signal,rate,record["cues"])
        if metrics["nonfiniteSamples"] or metrics["clippedSamples"]: raise RuntimeError("Invalid samples")
        if metrics["correlationWithOriginal"]<0.96: raise RuntimeError("Cleanup changed waveform too much")
        write_wav(dest,out,rate)
        with wave.open(str(dest),"rb") as f:
            if f.getnframes()!=len(signal) or f.getframerate()!=rate: raise RuntimeError("Timeline mismatch")
        results[key]={"source":record["source"],"processed":record["processed"],"rate":rate,
          "duration":len(signal)/rate,"sourceSha256":hashlib.sha256(source.read_bytes()).hexdigest(),
          "outputSha256":hashlib.sha256(dest.read_bytes()).hexdigest(),**decode_notes,**metrics,
          "captionCount":len(record["cues"]),"subjectiveListeningReview":"not_performed"}
        print(key,json.dumps({k:results[key][k] for k in ["duration","constantGainDb","peakAfterDbfs","correlationWithOriginal"]}),flush=True)
    report={"createdAt":"2026-10-23","tool":"PyAV "+av.__version__+" + NumPy",
      "policy":"no speech cuts, no timing/pitch changes, mild denoise, constant gain; retain originals",
      "records":results,"captions":"existing reviewed cue text and timing; no new ASR claims"}
    (ROOT/"transcripts/cleaned-v1/audio-cleanup-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
if __name__=="__main__":main()

