import React from 'react';
import {useNarrationAudio} from './NarrationAudio';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {Person, NarratedIntro, narratedIntroDuration} from './NarratedIntro';
import cues from './purpose-captions.json';

export const purposeDuration = 2103;
export const chaptersDuration = narratedIntroDuration + purposeDuration;
const ink='#173c42', teal='#267e83';
const Arrow = ({d}:{d:string}) => <path d={d} fill="none" stroke={teal} strokeWidth="5" markerEnd="url(#purpose-arrow)"/>;
const Box = ({x,y,w,h,fill='white',children}:{x:number;y:number;w:number;h:number;fill?:string;children:React.ReactNode})=><g><rect x={x} y={y} width={w} height={h} rx="24" fill={fill}/>{children}</g>;

export const NarratedPurpose: React.FC = () => {
  const t=useCurrentFrame()/30;
  const audioSrc=useNarrationAudio('purpose');
  const stage=t<21.2?0:t<37.06?1:t<48.3?2:t<57.94?3:4;
  const start=[0,21.2,37.06,48.3,57.94][stage];
  const opacity=interpolate(t-start,[0,.3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const cue=cues.find(c=>t>=Number(c[0])&&t<Number(c[1]));
  const titles=['なぜ、社会保険があるのでしょうか？','一人では抱えきれない負担を、社会で支える。','支える側にも、支えられる側にもなる。','費用を負担するのは、本人だけではない。','制度ごとの仕組みで、生活のリスクを支える。'];
  return <AbsoluteFill style={{background:'#f5f3ec',fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink}}>
    <Audio src={audioSrc}/>
    <svg width="1600" height="900" viewBox="0 0 1600 900">
      <defs><marker id="purpose-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={teal}/></marker></defs>
      <rect x="55" y="40" width="8" height="28" rx="4" fill={teal}/><text x="78" y="62" fontSize="22" fill={ink}>制度の翻訳室</text>
      <text x="1540" y="62" textAnchor="end" fontSize="20" fill="#627373">02 / 社会保険の目的</text>
      <g opacity={opacity}>
        <text x="65" y="152" fontSize="46" fontWeight="bold" fill={ink}>{titles[stage]}</text>
        {stage===0 && <>
          <Box x={80} y={242} w={480} h={472} fill="#e5eeea"><Person x={218} y={363} scale={1.3}/><text x="320" y="306" textAnchor="middle" fontSize="29" fill={ink}>{t<4.66?'いつもの暮らしに…':'突然、病気になったら？'}</text></Box>
          <g opacity={t>=4.66?1:.15}>
            <Arrow d="M580 408 H697"/>
            <Box x={720} y={253} w={795} h={186}><path d="M788 287 V373 M745 330 H831" stroke={teal} strokeWidth="16"/><text x="877" y="330" fontSize="34" fontWeight="bold" fill={ink}>治療が必要になる</text><text x="877" y="386" fontSize="28" fill={teal}>治療費がかかる</text></Box>
          </g>
          <g opacity={t>=11.18?1:.15}>
            <Arrow d="M580 545 H697"/>
            <Box x={720} y={470} w={795} h={186} fill="#f3e7d4"><path d="M760 524 H825 V584 M794 554 L825 584 L854 554" fill="none" stroke="#b47c36" strokeWidth="11"/><text x="877" y="540" fontSize="34" fontWeight="bold" fill={ink}>仕事を休むことも</text><text x="877" y="596" fontSize="28" fill="#936127">収入が減ることがある</text></Box>
          </g>
          <text x="1115" y="723" textAnchor="middle" fontSize="29" fill={ink} opacity={t>=15.66?1:0}>家庭だけで抱えるのは、大きな負担。</text>
        </>}
        {(stage===1||stage===3) && <>
          <Box x={65} y={244} w={395} h={470} fill="#e5eeea"><text x="263" y="300" textAnchor="middle" fontSize="29" fontWeight="bold" fill={ink}>負担する側</text><Person x={150} y={346} scale={.9}/><Person x={276} y={346} scale={.9}/><text x="263" y="611" textAnchor="middle" fontSize="29" fill={ink}>加入者の保険料</text><text x="263" y="665" textAnchor="middle" fontSize="26" fill={ink} opacity={stage===3?1:0}>事業主の負担など</text></Box>
          <Arrow d="M475 480 H599"/>
          <Box x={620} y={360} w={350} h={266} fill={ink}><text x="795" y="440" textAnchor="middle" fontSize="34" fontWeight="bold" fill="white">社会保険</text><path d="M750 485 L795 465 L840 485 V519 Q840 551 795 572 Q750 551 750 519 Z" fill="#9acdc0"/></Box>
          <Arrow d="M987 480 H1110"/>
          <Box x={1130} y={244} w={405} h={470}><text x="1332" y="300" textAnchor="middle" fontSize="29" fontWeight="bold" fill={ink}>保障を受ける側</text><Person x={1260} y={346} scale={1}/><text x="1332" y="620" textAnchor="middle" fontSize="28" fill={ink}>必要な人を</text><text x="1332" y="669" textAnchor="middle" fontSize="28" fill={teal}>条件に応じて支える</text></Box>
          {stage===3&&<g opacity={t>=52.42?1:.2}><Box x={620} y={228} w={350} h={88} fill="#e1e6dc"><text x="795" y="284" textAnchor="middle" fontSize="28" fill={ink}>税金による支えも</text></Box><Arrow d="M795 322 V350"/></g>}
          <text x="795" y="737" textAnchor="middle" fontSize="21" fill="#627373">概念図です。財源・負担割合・給付条件は制度ごとに異なります。</text>
        </>}
        {stage===2 && <>
          <Box x={80} y={246} w={600} h={458} fill="#e5eeea"><text x="380" y="307" textAnchor="middle" fontSize="33" fill={ink}>支える側の自分</text><Person x={280} y={363} scale={1.25}/><text x="380" y="671" textAnchor="middle" fontSize="28" fill={teal}>保険料などを負担する</text></Box>
          <Arrow d="M710 410 H884"/><Arrow d="M884 560 H710"/>
          <Box x={920} y={246} w={600} h={458} fill="#eee8f4"><text x="1220" y="307" textAnchor="middle" fontSize="33" fill={ink}>支えられる側の自分</text><Person x={1120} y={363} scale={1.25}/><text x="1220" y="671" textAnchor="middle" fontSize="28" fill="#7e709f">必要なとき、条件に応じて保障</text></Box>
          <text x="800" y="756" textAnchor="middle" fontSize="28" fill={ink}>ずっと別々の人、というわけではありません。</text>
        </>}
        {stage===4 && <>
          <text x="800" y="250" textAnchor="middle" fontSize="31" fill="#627373">すべてを一つの財布で運営するわけではありません。</text>
          <g transform="translate(0 0) scale(.96 1)">
          {['医療','年金','介護','労働'].map((label,i)=><g key={label}><Box x={80+i*390} y={325} w={350} h={273} fill={['#e1efeb','#eee8f4','#e7ecdf','#f3e7d4'][i]}><rect x={205+i*390} y="361" width="100" height="72" rx="14" fill="white"/><path d={`M${233+i*390} 382 H${277+i*390} M${233+i*390} 400 H${277+i*390}`} stroke={teal} strokeWidth="5"/><text x={255+i*390} y="492" textAnchor="middle" fontSize="35" fontWeight="bold" fill={ink}>{label}保険</text><text x={255+i*390} y="551" textAnchor="middle" fontSize="24" fill="#627373">それぞれの仕組み</text></Box></g>)}
          </g>
          <text x="800" y="667" textAnchor="middle" fontSize="21" fill="#627373">この動画では4分野で整理。労働保険には雇用保険・労災保険が含まれます。</text>
          <text x="800" y="743" textAnchor="middle" fontSize="37" fontWeight="bold" fill={teal} opacity={t>=64.18?1:0}>生活のリスクを、社会で支える。</text>
        </>}
      </g>
    </svg>
    {cue && <div style={{position:'absolute',left:54,right:54,bottom:36,minHeight:74,display:'flex',alignItems:'center',justifyContent:'center',padding:'14px 24px',background:ink,color:'white',borderRadius:15,fontSize:32,fontWeight:600,lineHeight:1.45,textAlign:'center'}}>{String(cue[2])}</div>}
  </AbsoluteFill>;
};

export const NarratedChapters: React.FC = () => <AbsoluteFill>
  <Sequence durationInFrames={narratedIntroDuration}><NarratedIntro/></Sequence>
  <Sequence from={narratedIntroDuration} durationInFrames={purposeDuration}><NarratedPurpose/></Sequence>
</AbsoluteFill>;
