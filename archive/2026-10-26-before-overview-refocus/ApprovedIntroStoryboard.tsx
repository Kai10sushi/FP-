import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Person} from './NarratedIntro';
import {approvedIntroDuration,approvedIntroScenes} from './approved-intro-scenes';
import {annual,final,man,model} from './premium-model';

export {approvedIntroDuration};
const ink='#173c42',teal='#267e83',paper='#f5f3ec',muted='#627373';
const Slip:React.FC<{x:number;y:number;scale?:number}>=({x,y,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect width="710" height="425" rx="24" fill="white"/>
 <text x="34" y="54" fontSize="28" fontWeight="700">給与明細</text>
 <text x="678" y="52" textAnchor="end" fontSize="17" fill={muted}>模式図・実際の明細ではありません</text>
 <path d="M30 76 H680" stroke="#d6dfda" strokeWidth="2"/>
 <text x="38" y="117" fontSize="25">支給額</text><text x="670" y="117" textAnchor="end" fontSize="25">○○○,○○○ 円</text>
 <rect x="22" y="140" width="666" height="170" rx="14" fill="#e1efeb" stroke={teal} strokeWidth="4"/>
 <text x="42" y="180" fontSize="28" fill={teal} fontWeight="700">社会保険料</text>
 <text x="44" y="223" fontSize="24">健康保険料</text><text x="350" y="223" fontSize="24">厚生年金保険料</text>
 <text x="44" y="264" fontSize="24">雇用保険料</text><text x="350" y="264" fontSize="24">介護保険料 ※対象者</text>
 <text x="38" y="346" fontSize="24">税金など</text>
 <rect x="22" y="365" width="666" height="44" rx="10" fill={ink}/><text x="43" y="397" fontSize="23" fill="white">差引支給額（手取り）</text>
</g>;

export const ApprovedIntroStoryboard:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const index=Math.max(0,approvedIntroScenes.filter(s=>t>=s.start).length-1),scene=approvedIntroScenes[index];
 const enter=interpolate(t-scene.start,[0,.4],[.85,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const before=annual(22);
 return <AbsoluteFill style={{background:paper,fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink}}>
 <svg width="1600" height="900" viewBox="0 0 1600 900">
  <defs><marker id="approved-intro-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={teal}/></marker></defs>
  <rect x="64" y="35" width="236" height="38" rx="19" fill="#e1efeb"/>
  <text x="182" y="61" textAnchor="middle" fontSize="20" fontWeight="700">導入・無音の映像案</text>
  <text x="325" y="61" fontSize="20">制度の翻訳室</text>
  <text x="1535" y="61" textAnchor="end" fontSize="19" fill={muted}>本人録音待ち／時間・テロップは仮</text>
  <text x="64" y="143" fontSize="43" fontWeight="700">{scene.display}</text>
  <g opacity={enter} transform={`translate(0 ${(1-enter)*10})`}>
  {index===0&&<>
   <rect x="64" y="214" width="626" height="440" rx="26" fill="#e6ede8"/>
   <rect x="96" y="247" width="562" height="126" rx="20" fill="white"/>
   <text x="377" y="297" textAnchor="middle" fontSize="29">これがなければ、</text><text x="377" y="343" textAnchor="middle" fontSize="29">もっと手取りが増えるのに…</text>
   <path d="M332 372 L357 399 L380 372" fill="white"/>
   <Person x={288} y={402} scale={1.05}/>
   <Slip x={780} y={215} scale={1.06}/>
   <path d="M615 470 H764" stroke={teal} strokeWidth="5" markerEnd="url(#approved-intro-arrow)"/>
   <text x="800" y="695" fontSize="20" fill={muted}>税金など、社会保険料以外の控除とは分けて見る。</text>
  </>}
  {index===1&&<>
   <Slip x={64} y={275} scale={.69}/>
   <path d="M570 427 H720" stroke={teal} strokeWidth="5" markerEnd="url(#approved-intro-arrow)"/>
   <text x="640" y="395" textAnchor="middle" fontSize="23" fill={teal}>暮らしへ</text>
   {[{label:'病気・けが',sub:'治療が必要になったとき',x:760,color:'#e1efeb'},{label:'老後など',sub:'生活を支える備え',x:1155,color:'#ece7f2'}].map((item,i)=><g key={item.label}>
    <rect x={item.x} y="235" width="380" height="360" rx="24" fill={item.color}/>
    {i===0?<g><rect x={item.x+120} y="292" width="140" height="112" rx="12" fill="white"/><path d={`M${item.x+190} 310 V384 M${item.x+153} 347 H${item.x+227}`} stroke={teal} strokeWidth="20"/></g>:<Person x={item.x+135} y={267} scale={.65} older/>}
    <text x={item.x+190} y="485" textAnchor="middle" fontSize="33" fontWeight="700">{item.label}</text>
    <text x={item.x+190} y="536" textAnchor="middle" fontSize="23">{item.sub}</text>
   </g>)}
   <text x="760" y="645" fontSize="21" fill={muted}>生活の場面の例。給付には制度ごとの条件があります。</text>
   <text x="64" y="695" fontSize="19" fill={muted}>関係のイメージです。各制度を一つの財布で運営しているという意味ではありません。</text>
  </>}
  {index===2&&<>
   <rect x="64" y="218" width="620" height="419" rx="24" fill="white"/>
   <text x="98" y="264" fontSize="27" fontWeight="700">生活の出来事 → 関係する制度</text>
   {[['病気・けが','医療保険'],['老後・障害など','年金保険'],['介護が必要','介護保険'],['失業・仕事中のけがなど','労働保険']].map(([life,insurance],i)=><g key={insurance}>
    <rect x="92" y={285+i*77} width="562" height="62" rx="12" fill={i%2?'#eef0ed':'#e1efeb'}/>
    <text x="108" y={325+i*77} fontSize="22">{life}</text><text x="414" y={325+i*77} fontSize="23" fill={teal} fontWeight="700">→ {insurance}</text>
   </g>)}
   <rect x="714" y="218" width="821" height="419" rx="24" fill="#e5ecf1"/>
   <text x="748" y="264" fontSize="27" fontWeight="700">月給30万円モデルで、給与と保険料を比較</text>
   {[{label:'1年間（40歳未満）',salary:'360万円',premium:man(before.socialTotal,1)+'万円',ratio:before.socialShare},{label:'38年間（22歳→60歳到達）',salary:'1億3,680万円',premium:man(final.socialTotal,0)+'万円',ratio:final.socialShare}].map((item,i)=><g key={item.label}>
    <text x="750" y={312+i*147} fontSize="23" fontWeight="700">{item.label}</text>
    <rect x="750" y={330+i*147} width="746" height="35" rx="6" fill="#c4d4e1"/>
    <rect x="750" y={330+i*147} width={746*item.ratio} height="35" rx="6" fill={teal}/>
    <text x="750" y={399+i*147} fontSize="23">額面給与 {item.salary} ／ うち保険料 約{item.premium}</text>
   </g>)}
   <text x="750" y="592" fontSize="18" fill={muted}>各期間の額面給与＝100％の割合図。年額と累計の金額の目盛りは別です。</text>
   <text x="750" y="619" fontSize="18" fill={muted}>保険料は給与の一部。給与との差額は手取りではありません。</text>
   <text x="64" y="672" fontSize="18" fill={muted}>モデル：協会けんぽ東京・一般の事業／月給30万円・賞与／昇給なし・本人負担・支援金別掲。労働保険＝雇用・労災。</text>
   <text x="64" y="701" fontSize="17" fill={muted}>出典P01〜P04（{model.checkedAt}確認）。料率固定・40歳から介護分加算。独自試算で将来予測ではありません。</text>
  </>}
  {index===3&&<>
   <rect x="64" y="235" width="590" height="350" rx="26" fill="#e9e5d9"/>
   <text x="359" y="297" textAnchor="middle" fontSize="34" fontWeight="700">毎月の負担</text>
   <Slip x={157} y={324} scale={.56}/>
   <rect x="946" y="235" width="590" height="350" rx="26" fill="#e1efeb"/>
   <text x="1241" y="297" textAnchor="middle" fontSize="34" fontWeight="700">暮らしを支える保障</text>
   <path d="M1118 426 Q1241 275 1364 426 Z" fill={teal}/><path d="M1241 425 V526 Q1241 550 1218 550" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round"/>
   <Person x={744} y={338} scale={.85}/>
   <path d="M734 452 H665 M867 452 H933" stroke={teal} strokeWidth="4" markerEnd="url(#approved-intro-arrow)"/>
   <text x="800" y="653" textAnchor="middle" fontSize="31" fill={teal}>金額だけではなく、支える仕組みも見ていく。</text>
   <text x="800" y="695" textAnchor="middle" fontSize="20" fill={muted}>給付には条件があります。全ての損失を補うという意味ではありません。</text>
  </>}
  </g>
 </svg>
 <div style={{position:'absolute',left:64,right:64,bottom:28,height:142,boxSizing:'border-box',padding:'12px 24px',background:ink,color:'white',borderRadius:16,display:'flex',flexDirection:'column',justifyContent:'center',gap:8}}>
  <div style={{fontSize:17,color:'#b9d7cf'}}>確定したナレーション原稿／未収録・発話字幕は録音後に同期</div>
  <div style={{fontSize:26,lineHeight:1.45,fontWeight:600}}>{scene.narration}</div>
 </div>
 </AbsoluteFill>;
};
