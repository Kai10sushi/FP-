import React from 'react';
import {useNarrationAudio} from './NarrationAudio';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {NarratedChapters, chaptersDuration} from './NarratedPurpose';
import {Person} from './NarratedIntro';
import timing from './fields-timing.json';

export const fieldsDuration = Math.round(timing.durationSeconds*30);
export const threeChaptersDuration = chaptersDuration+fieldsDuration;
const ink='#173c42', teal='#267e83';
const labels=['医療保険','年金保険','介護保険','労働保険'];
const colors=['#e1efeb','#eee8f4','#e7ecdf','#f3e7d4'];

export const NarratedFields: React.FC = () => {
  const t=useCurrentFrame()/30;
  const audioSrc=useNarrationAudio('fields');
  const phase=timing.sections.filter(s=>t>=s.start).at(-1)?.id ?? 'overview';
  const active=['medical','pension','care','labor'].indexOf(phase);
  const cue=timing.cues.find(c=>t>=c.start&&t<c.end);
  const labor=phase==='labor'||phase==='employment'||phase==='accident'||phase==='count';
  return <AbsoluteFill style={{background:'#f5f3ec',fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink}}>
    <Audio src={audioSrc}/>
    <svg width="1600" height="900" viewBox="0 0 1600 900">
      <defs><marker id="fields-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={teal}/></marker></defs>
      <rect x="55" y="40" width="8" height="28" rx="4" fill={teal}/><text x="78" y="62" fontSize="22" fill={ink}>制度の翻訳室</text>
      <text x="1540" y="62" textAnchor="end" fontSize="20" fill="#627373">03 / 4分野の地図</text>
      <text x="65" y="151" fontSize="48" fontWeight="bold" fill={ink}>{phase==='count'?'まとめ方を変えると、4分野にも5つにも。':'暮らしのリスクと、4つの分野。'}</text>
      {labels.map((label,i)=>{
        const selected=active===i||(i===3&&labor);
        return <g key={label} opacity={phase==='overview'||phase==='count'||selected?1:.5}>
          <rect x="65" y={235+i*126} width="460" height="103" rx="19" fill={colors[i]} stroke={selected?teal:'none'} strokeWidth="4"/>
          <text x="102" y={299+i*126} fontSize="35" fontWeight="bold" fill={ink}>{label}</text>
          {selected&&<path d={`M480 ${271+i*126} L495 ${286+i*126} L480 ${301+i*126}`} fill="none" stroke={teal} strokeWidth="5"/>}
        </g>;
      })}
      <rect x="580" y="235" width="955" height="496" rx="28" fill="white"/>
      {phase==='overview'&&<>
        <Person x={650} y={358} scale={1.35}/>
        <text x="938" y="345" fontSize="35" fontWeight="bold" fill={ink}>何に備える仕組み？</text>
        {['病気やけが','老後・障害・遺族の生活','介護が必要な生活','失業・仕事や通勤の災害'].map((s,i)=><text key={s} x="938" y={421+i*62} fontSize="27" fill={ink}>{s}</text>)}
      </>}
      {phase==='medical'&&<>
        <rect x="648" y="348" width="196" height="168" rx="18" fill={colors[0]}/><path d="M746 375 V463 M702 419 H790" stroke={teal} strokeWidth="22"/>
        <text x="903" y="344" fontSize="35" fontWeight="bold" fill={ink}>病気やけがで、治療を受ける</text>
        <text x="903" y="412" fontSize="30" fill={teal}>医療費などを支える</text>
        <rect x="884" y="488" width="601" height="155" rx="20" fill={colors[0]}/>
        <text x="918" y="544" fontSize="28" fill={ink}>医療保険の一つ</text>
        <text x="918" y="602" fontSize="34" fontWeight="bold" fill={ink}>会社員の「健康保険」</text>
      </>}
      {phase==='pension'&&<>
        <Person x={683} y={350} scale={1.15} older/>
        <text x="908" y="332" fontSize="35" fontWeight="bold" fill={ink}>老後だけではありません</text>
        {['老後の暮らし','一定の障害が残ったとき','亡くなった方の遺族の生活'].map((s,i)=><g key={s}><rect x="893" y={374+i*94} width="594" height="76" rx="15" fill={colors[1]}/><text x="926" y={423+i*94} fontSize="29" fill={ink}>{s}</text></g>)}
      </>}
      {phase==='care'&&<>
        <Person x={660} y={365} scale={1.05} older/><Person x={796} y={365} scale={1.05}/>
        <text x="1010" y="347" fontSize="34" fontWeight="bold" fill={ink}>介護が必要になったとき</text>
        <path d="M1223 391 V443" stroke={teal} strokeWidth="5" markerEnd="url(#fields-arrow)"/>
        <text x="1010" y="502" fontSize="28" fill={teal}>条件に応じて</text>
        <text x="1010" y="558" fontSize="31" fontWeight="bold" fill={ink}>介護サービスなどを利用</text>
      </>}
      {labor&&<>
        <text x="1057" y="301" textAnchor="middle" fontSize="31" fontWeight="bold" fill={ink}>{phase==='count'?'労働保険を2つに分けて数えると…':'労働保険は、2つをまとめた呼び方'}</text>
        <path d="M1057 321 V354 M821 354 H1293 M821 354 V393 M1293 354 V393" fill="none" stroke={teal} strokeWidth="4"/>
        {[['雇用保険','失業したときの生活','再就職などを支える'],['労災保険','仕事や通勤が原因の','けが・病気などに備える']].map((lines,i)=><g key={lines[0]} opacity={phase==='employment'&&i===1||phase==='accident'&&i===0?.45:1}>
          <rect x={620+i*465} y="399" width="413" height="233" rx="22" fill={colors[3]} stroke={phase===(i===0?'employment':'accident')?teal:'none'} strokeWidth="4"/>
          <text x={826+i*465} y="458" textAnchor="middle" fontSize="36" fontWeight="bold" fill={ink}>{lines[0]}</text>
          <text x={826+i*465} y="526" textAnchor="middle" fontSize="27" fill={ink}>{lines[1]}</text>
          <text x={826+i*465} y="575" textAnchor="middle" fontSize="27" fill={ink}>{lines[2]}</text>
        </g>)}
        {phase==='count'&&<text x="1057" y="686" textAnchor="middle" fontSize="29" fontWeight="bold" fill={teal}>医療・年金・介護 ＋ 雇用・労災 ＝ 5つ</text>}
      </>}
      <text x="800" y="769" textAnchor="middle" fontSize="20" fill="#627373">主な役割の説明です。加入対象・給付条件は制度ごとに異なります。</text>
    </svg>
    {cue&&<div style={{position:'absolute',left:54,right:54,bottom:30,minHeight:70,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 24px',background:ink,color:'white',borderRadius:15,fontSize:31,fontWeight:600,lineHeight:1.4,textAlign:'center'}}>{cue.text}</div>}
  </AbsoluteFill>;
};

export const NarratedThreeChapters: React.FC = () => <AbsoluteFill>
  <Sequence durationInFrames={chaptersDuration}><NarratedChapters/></Sequence>
  <Sequence from={chaptersDuration} durationInFrames={fieldsDuration}><NarratedFields/></Sequence>
</AbsoluteFill>;
