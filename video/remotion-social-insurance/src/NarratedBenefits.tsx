import React from 'react';
import {useNarrationAudio} from './NarrationAudio';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {Person} from './NarratedIntro';
import {NarratedThreeChapters,threeChaptersDuration} from './NarratedFields';
import data from './benefits-timing.json';
export const riskDuration=Math.ceil(data.risk.durationSeconds*30);
export const coverageDuration=Math.ceil(data.coverage.durationSeconds*30);
export const riskStart=threeChaptersDuration/30;
export const coverageStart=(threeChaptersDuration+riskDuration)/30;
export const fiveChaptersDuration=threeChaptersDuration+riskDuration+coverageDuration;
const ink='#173c42',teal='#267e83';
const Arrow=({d}:{d:string})=><path d={d} fill="none" stroke={teal} strokeWidth="5" markerEnd="url(#benefit-arrow)"/>;
const Benefit:React.FC<{kind:'risk'|'coverage'}>=({kind})=>{
 const t=useCurrentFrame()/30,chapter=data[kind];
 const audioSrc=useNarrationAudio(kind);
 const stage=chapter.sections.filter(s=>t>=s.start).at(-1)?.id??'intro';
 const cue=chapter.cues.find(c=>t>=c.start&&t<c.end);
 const risk=kind==='risk';
 return <AbsoluteFill style={{background:'#f5f3ec',fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink}}>
  <Audio src={audioSrc}/>
  <svg width="1600" height="900" viewBox="0 0 1600 900">
   <defs><marker id="benefit-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={teal}/></marker></defs>
   <rect x="55" y="40" width="8" height="28" rx="4" fill={teal}/><text x="78" y="62" fontSize="22" fill={ink}>制度の翻訳室</text>
   <text x="1540" y="62" textAnchor="end" fontSize="20" fill="#627373">{risk?'04 / メリット① リスク分散':'05 / メリット② 幅広い保障'}</text>
   <text x="65" y="152" fontSize="46" fontWeight="bold" fill={ink}>{risk?(stage==='limit'?'社会保険と自分の備えで、暮らしを守る。':'大きな負担を、一人だけで抱え込まない。'):(stage==='check'?'自分の場合に、使える制度を確認する。':'暮らしのさまざまな場面に、保障がある。')}</text>
   {risk&&stage!=='limit'&&<>
    <rect x="65" y="235" width="575" height="482" rx="26" fill="#f3e7d4"/>
    <text x="352" y="294" textAnchor="middle" fontSize="31" fontWeight="bold" fill={ink}>自分で備える</text>
    <Person x={145} y={383} scale={1.12}/>
    {[0,1,2].map(i=><g key={i}><rect x={370+i*58} y={538-i*47} width="48" height={50+i*47} rx="9" fill="#d4ac6b"/></g>)}
    <text x="440" y="632" textAnchor="middle" fontSize="26" fill={ink}>貯蓄は大切</text>
    <text x="352" y="677" textAnchor="middle" fontSize="23" fill="#936127">病気やけがの時期は、選べない</text>
    <Arrow d="M658 480 H766"/>
    <g opacity={stage==='intro'?.3:1}>
     <rect x="790" y="235" width="745" height="482" rx="26" fill="#e1efeb"/>
     <text x="1162" y="294" textAnchor="middle" fontSize="31" fontWeight="bold" fill={ink}>社会で備える</text>
     {[900,1055,1210].map(x=><Person key={x} x={x} y={334} scale={.78}/>)}
     <Arrow d="M945 520 V560 M1100 520 V560 M1255 520 V560"/>
     <rect x="866" y="580" width="590" height="91" rx="20" fill={teal}/><text x="1161" y="637" textAnchor="middle" fontSize="30" fontWeight="bold" fill="white">必要なときの支えにつながる</text>
    </g>
    <text x="800" y="760" textAnchor="middle" fontSize="23" fill="#627373">概念図です。図の大きさは実際の負担割合・給付額を表しません。</text>
   </>}
   {risk&&stage==='limit'&&<>
    <rect x="80" y="259" width="610" height="259" rx="26" fill="#e1efeb"/><text x="385" y="336" textAnchor="middle" fontSize="36" fontWeight="bold" fill={ink}>社会保険</text><text x="385" y="407" textAnchor="middle" fontSize="29" fill={ink}>条件に応じた保障</text><text x="385" y="459" textAnchor="middle" fontSize="25" fill={teal}>すべての損失が埋まるわけではない</text>
    <text x="800" y="419" textAnchor="middle" fontSize="62" fill={teal}>＋</text>
    <rect x="910" y="259" width="610" height="259" rx="26" fill="#f3e7d4"/><text x="1215" y="336" textAnchor="middle" fontSize="36" fontWeight="bold" fill={ink}>自分の備え</text><text x="1215" y="407" textAnchor="middle" fontSize="29" fill={ink}>貯蓄など</text><text x="1215" y="459" textAnchor="middle" fontSize="25" fill="#936127">暮らしに合わせて準備する</text>
    <Arrow d="M385 534 L710 640 M1215 534 L890 640"/>
    <rect x="515" y="654" width="570" height="91" rx="20" fill={ink}/><text x="800" y="713" textAnchor="middle" fontSize="34" fontWeight="bold" fill="white">両方で、暮らしを守る</text>
   </>}
   {!risk&&stage!=='check'&&<>
    <Person x={694} y={370} scale={1.5}/>
    {[['病気やけが','医療保険',65,247,'#e1efeb'],['老後・障害など','年金保険',1043,247,'#eee8f4'],['介護が必要になった','介護保険',65,510,'#e7ecdf'],['失業・仕事中のけがなど','労働保険',1043,510,'#f3e7d4']].map(([a,b,x,y,c],i)=><g key={String(b)} opacity={stage==='hospital'&&i!==0?.25:1}>
      <rect x={Number(x)} y={Number(y)} width="492" height="186" rx="22" fill={String(c)}/><text x={Number(x)+30} y={Number(y)+65} fontSize={i===3?29:32} fontWeight="bold" fill={ink}>{a}</text><text x={Number(x)+30} y={Number(y)+125} fontSize="28" fill={teal}>{b}</text>
      <Arrow d={i%2===0?`M573 ${Number(y)+94} H678`:`M1027 ${Number(y)+94} H925`}/>
    </g>)}
    <text x="800" y="749" textAnchor="middle" fontSize="30" fontWeight="bold" fill={teal}>{stage==='notice'?'この困りごとにも、関係する制度があるかもしれない。':'病院で使う健康保険だけではありません。'}</text>
   </>}
   {!risk&&stage==='check'&&<>
    <Person x={190} y={378} scale={1.35}/>
    <text x="800" y="263" textAnchor="middle" fontSize="32" fontWeight="bold" fill={ink}>誰もが同じ保障を受けられるわけではありません。</text>
    {['働き方','年齢','加入している制度'].map((s,i)=><g key={s}><rect x={610+i*304} y="358" width="278" height="140" rx="22" fill={['#e1efeb','#eee8f4','#f3e7d4'][i]}/><text x={749+i*304} y="443" textAnchor="middle" fontSize={i===2?27:33} fontWeight="bold" fill={ink}>{s}</text></g>)}
    <Arrow d="M1054 520 V602"/>
    <rect x="620" y="623" width="880" height="109" rx="22" fill={ink}/><text x="1060" y="691" textAnchor="middle" fontSize="34" fontWeight="bold" fill="white">自分の場合を、確認する</text>
   </>}
  </svg>
  {cue&&<div style={{position:'absolute',left:54,right:54,bottom:26,minHeight:68,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 24px',background:ink,color:'white',borderRadius:15,fontSize:31,fontWeight:600,lineHeight:1.4,textAlign:'center'}}>{cue.text}</div>}
 </AbsoluteFill>;
};
export const NarratedRisk=()=> <Benefit kind="risk"/>;
export const NarratedCoverage=()=> <Benefit kind="coverage"/>;
export const NarratedFiveChapters=()=> <AbsoluteFill>
 <Sequence durationInFrames={threeChaptersDuration}><NarratedThreeChapters/></Sequence>
 <Sequence from={threeChaptersDuration} durationInFrames={riskDuration}><NarratedRisk/></Sequence>
 <Sequence from={threeChaptersDuration+riskDuration} durationInFrames={coverageDuration}><NarratedCoverage/></Sequence>
</AbsoluteFill>;
