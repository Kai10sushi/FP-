import React from 'react';
import {useNarrationAudio} from './NarrationAudio';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const narratedIntroDuration = 1617; // Approved recording: 53.900 s at 30 fps.
const ink = '#173c42';
const teal = '#267e83';
const paper = '#f5f3ec';
const cues: [number, number, string][] = [
  [.43,3.05,'毎月の給与明細、どこを見ていますか？'],
  [4.09,6.55,'今月の手取りはいくらかな、と'],
  [6.55,10.05,'まず振り込まれる金額を確認する方も多いですよね。'],
  [10.9,15.64,'その少し上にある、健康保険料や厚生年金保険料。'],
  [16.12,17.8,'毎月引かれているけれど、'],
  [17.8,22.32,'何のためのお金なのか、意外と説明しにくくありませんか？'],
  [22.96,25.4,'実は、これらは病気や老後など、'],
  [25.4,29.3,'暮らしのリスクに備える社会保険につながっています。'],
  [29.77,32.85,'今回は、社会保険が何を支えているのか、'],
  [32.85,35.49,'どんなメリットや注意点があるのか、'],
  [35.49,38.3,'そして困った時にどう調べればいいのかを、'],
  [38.3,41.85,'会社員の方中心に整理していきます。'],
  [43.51,45.85,'細かい計算式を覚える必要がありません。'],
  [47.31,48.69,'自分が困った時、'],
  [48.69,50.97,'まず何を確認すればいいか。'],
  [50.97,53.85,'その入り口を、一緒につかんでいきましょう。'],
];

export const Person: React.FC<{x:number;y:number;scale?:number;older?:boolean}> = ({x,y,scale=1,older=false}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="70" cy="216" rx="66" ry="12" fill="#d7e2df"/>
    <path d="M38 147 L32 213 M102 147 L109 213" stroke={ink} strokeWidth="22" strokeLinecap="round"/>
    <path d="M24 144 Q18 73 70 75 Q124 73 116 144 Z" fill={older?'#7e709f':teal}/>
    <path d="M32 93 L10 150 M108 93 L130 150" stroke={older?'#7e709f':teal} strokeWidth="19" strokeLinecap="round"/>
    <circle cx="70" cy="43" r="33" fill="#f0c5a4"/>
    <path d="M37 44 Q27 1 65 6 Q107 0 105 47 L93 25 Q70 38 44 28 Z" fill={older?'#aab5b5':ink}/>
    <circle cx="59" cy="46" r="2.6" fill={ink}/><circle cx="82" cy="46" r="2.6" fill={ink}/>
    <path d="M62 60 Q71 66 80 60" fill="none" stroke="#a5664d" strokeWidth="2.4"/>
    <path d="M57 79 L70 96 L84 79" fill="white"/>
  </g>
);

export const NarratedIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const audioSrc = useNarrationAudio('intro');
  const t = frame/30;
  const scene = t<22.96?0:t<29.77?1:t<43?2:3;
  const sceneStart = [0,22.96,29.77,43][scene];
  const enter = interpolate(t-sceneStart,[0,.35],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const caption = cues.find(([a,b])=>t>=a && t<b)?.[2];
  const highlight = t>=10.9;
  const agenda = t<32.85?0:t<35.49?1:2;
  return <AbsoluteFill style={{background:paper,fontFamily:'"Yu Gothic", Meiryo, sans-serif',color:ink}}>
    <Audio src={audioSrc}/>
    <svg width="1600" height="900" viewBox="0 0 1600 900">
      <defs><marker id="intro-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={teal}/></marker></defs>
      <rect x="55" y="40" width="8" height="28" rx="4" fill={teal}/>
      <text x="78" y="62" fontSize="22" fill={ink}>制度の翻訳室</text>
      <text x="1540" y="62" textAnchor="end" fontSize="20" fill="#627373">社会保険の全体像 / 導入</text>
      <g opacity={enter} transform={`translate(0 ${(1-enter)*12})`}>
      {scene===0 && <>
        <text x="65" y="152" fontSize="48" fontWeight="bold" fill={ink}>{highlight?'毎月引かれる、このお金は何のため？':'給与明細、どこを見ていますか？'}</text>
        <rect x="65" y="220" width="540" height="520" rx="28" fill="#e5eeea"/>
        <rect x="100" y="252" width="465" height="108" rx="22" fill="white"/>
        <text x="332" y="319" textAnchor="middle" fontSize="30" fill={ink}>{highlight?'この保険料は何のため？':'今月の手取りは、いくら？'}</text>
        <path d="M245 360 L265 389 L287 360" fill="white"/>
        <Person x={240} y={394} scale={1.45}/>
        <rect x="700" y="220" width="835" height="520" rx="22" fill="white"/>
        <text x="750" y="276" fontSize="32" fontWeight="bold" fill={ink}>給与明細</text>
        <text x="1490" y="275" textAnchor="end" fontSize="18" fill="#627373">イメージ・金額省略</text>
        <path d="M740 301 H1495" stroke="#d8e0dc" strokeWidth="2"/>
        <text x="755" y="346" fontSize="25" fill={ink}>支給額</text><text x="1485" y="346" textAnchor="end" fontSize="25" fill="#627373">○○○,○○○ 円</text>
        <rect x="728" y="370" width="778" height="219" rx="15" fill={highlight?'#e3f2ed':'#f3f5f3'} stroke={highlight?teal:'none'} strokeWidth="5"/>
        <text x="752" y="410" fontSize="29" fill={teal} fontWeight="bold">社会保険料</text>
        <text x="766" y="456" fontSize="27" fill={ink} fontWeight={highlight?'bold':'normal'}>健康保険料</text>
        <text x="1110" y="456" fontSize="27" fill={ink} fontWeight={highlight?'bold':'normal'}>厚生年金保険料</text>
        <text x="766" y="506" fontSize="24" fill={ink}>雇用保険料</text><text x="1110" y="506" fontSize="24" fill={ink}>介護保険料 ※</text>
        <text x="752" y="561" fontSize="18" fill="#627373">※ 対象者の場合。表示方法は勤務先により異なります。</text>
        <text x="755" y="628" fontSize="24" fill={ink}>税金など</text>
        <rect x="728" y="651" width="778" height="65" rx="12" fill={ink} stroke={!highlight&&t>4?'#b47c36':'none'} strokeWidth="6"/>
        <text x="756" y="694" fontSize="27" fill="white">差引支給額（手取り）</text><text x="1480" y="694" textAnchor="end" fontSize="27" fill="white">○○○,○○○ 円</text>
        <path d={highlight?'M572 450 H715':'M572 675 H715'} stroke={teal} strokeWidth="5" markerEnd="url(#intro-arrow)"/>
      </>}
      {scene===1 && <>
        <text x="65" y="152" fontSize="48" fontWeight="bold" fill={ink}>保険料の先にある、暮らしの支え。</text>
        <rect x="65" y="242" width="480" height="466" rx="26" fill="#e1efeb"/>
        <rect x="200" y="340" width="210" height="160" rx="14" fill="white"/>
        <path d="M305 360 V430 M270 395 H340" stroke={teal} strokeWidth="22"/>
        <text x="305" y="556" textAnchor="middle" fontSize="34" fill={ink} fontWeight="bold">病気やけがのとき</text>
        <text x="305" y="608" textAnchor="middle" fontSize="26" fill={teal}>医療保険などが支える</text>
        <Person x={684} y={365} scale={1.5}/>
        <path d="M560 470 H674 M1038 470 H925" stroke={teal} strokeWidth="5" markerEnd="url(#intro-arrow)"/>
        <rect x="1055" y="242" width="480" height="466" rx="26" fill="#eee8f4"/>
        <Person x={1250} y={280} scale={.85} older/>
        <text x="1295" y="556" textAnchor="middle" fontSize="34" fill={ink} fontWeight="bold">老後の暮らしに</text>
        <text x="1295" y="608" textAnchor="middle" fontSize="26" fill="#7e709f">年金保険などが支える</text>
        <text x="800" y="730" textAnchor="middle" fontSize="20" fill="#627373">保障の例です。給付には制度ごとの条件があります。</text>
      </>}
      {scene===2 && <>
        <text x="65" y="152" fontSize="48" fontWeight="bold" fill={ink}>この動画で、暮らしと制度をつなげる。</text>
        <Person x={132} y={336} scale={1.6}/>
        <path d="M388 510 H548" stroke={teal} strokeWidth="5" markerEnd="url(#intro-arrow)"/>
        {['社会保険は、何を支えている？','メリットと、知っておきたい注意点は？','困ったら、何をどう調べればいい？'].map((text,i)=><g key={text} opacity={i<=agenda?1:.3}>
          <rect x="575" y={244+i*151} width="958" height="126" rx="22" fill={agenda===i?'#e1efeb':'white'} stroke={agenda===i?teal:'none'} strokeWidth="3"/>
          <circle cx="634" cy={307+i*151} r="29" fill={teal}/><text x="634" y={317+i*151} textAnchor="middle" fontSize="28" fill="white">{i+1}</text>
          <text x="691" y={319+i*151} fontSize="32" fill={ink} fontWeight="bold">{text}</text>
        </g>)}
        <text x="575" y="745" fontSize="23" fill="#627373">会社員の方を中心に、身近な場面から整理します。</text>
      </>}
      {scene===3 && <>
        <text x="65" y="152" fontSize="48" fontWeight="bold" fill={ink}>覚えるよりも、困ったときの入口を。</text>
        <Person x={185} y={372} scale={1.5}/>
        <rect x="580" y="248" width="935" height="122" rx="22" fill="white"/>
        <text x="625" y="325" fontSize="35" fill="#627373">細かい計算式を覚えなくても大丈夫。</text>
        <g opacity={t>=47.1?1:.2}>
          <path d="M442 520 H564" stroke={teal} strokeWidth="5" markerEnd="url(#intro-arrow)"/>
          <rect x="580" y="423" width="935" height="220" rx="26" fill="#e1efeb" stroke={teal} strokeWidth="3"/>
          <text x="628" y="492" fontSize="30" fill={teal}>自分が困ったとき</text>
          <text x="628" y="569" fontSize="43" fill={ink} fontWeight="bold">まず、何を確認すればいい？</text>
        </g>
        <text x="1047" y="710" textAnchor="middle" fontSize="29" fill={teal} opacity={t>=50.97?1:0}>その入口を、一緒につかんでいきましょう。</text>
      </>}
      </g>
    </svg>
    {caption && <div style={{position:'absolute',left:54,right:54,bottom:36,minHeight:74,display:'flex',alignItems:'center',justifyContent:'center',padding:'14px 24px',background:ink,color:'white',borderRadius:15,fontSize:32,fontWeight:600,lineHeight:1.45,textAlign:'center'}}>{caption}</div>}
    <div style={{position:'absolute',bottom:0,left:0,height:5,width:`${frame/narratedIntroDuration*100}%`,background:teal}}/>
  </AbsoluteFill>;
};
