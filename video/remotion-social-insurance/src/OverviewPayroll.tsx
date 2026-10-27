import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {annual,model,monthly,monthlySupport,sum,yen} from './premium-model';
export {overviewPayrollDuration} from './overview-outline';

import {overviewPayrollBeats} from './overview-outline';
export {overviewPayrollBeats} from './overview-outline';

const ink='#173c42',teal='#267e83',paper='#f5f3ec',muted='#52676b';
export const OverviewPayroll:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const index=t<25?0:t<37?1:2,beat=overviewPayrollBeats[index];
 const month=sum(monthly(22)),year=annual(22);
 const reveal=interpolate(t,[25,26.5],[.15,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:paper,fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink}}>
  <svg width="1600" height="900" viewBox="0 0 1600 900">
   <g fill={ink}>
   <rect x="64" y="35" width="200" height="38" rx="19" fill="#e1efeb"/>
   <text x="164" y="61" textAnchor="middle" fontSize="20" fontWeight="700">v7・無音の映像案</text>
   <text x="289" y="61" fontSize="20">制度の翻訳室</text>
   <text x="1535" y="61" textAnchor="end" fontSize="19" fill={muted}>この部分は仮45秒／年額は12秒だけ</text>
   <text x="64" y="143" fontSize="44" fontWeight="700">{beat.title}</text>
   <text x="64" y="190" fontSize="22" fill={muted}>モデル：月給30万円・協会けんぽ東京・一般の事業・賞与なし・40歳未満・本人負担</text>
   <rect x="64" y="230" width="660" height="380" rx="25" fill="white"/>
   <text x="100" y="281" fontSize="26" fontWeight="700">給与の中から負担するお金</text>
   <text x="100" y="336" fontSize="25">額面給与　月30万円</text>
   <rect x="100" y="362" width="585" height="54" rx="9" fill="#dce6ed"/>
   <rect x="100" y="362" width={585*year.socialShare} height="54" rx="9" fill={teal}/>
   <text x="100" y="459" fontSize="23" fill={teal}>■ 社会保険料の本人負担</text>
   <text x="100" y="527" fontSize="52" fontWeight="700">{yen(month)}円／月</text>
   <text x="100" y="574" fontSize="22">額面給与の約{(year.socialShare*100).toFixed(1)}％（この条件の場合）</text>
   {index===1&&<g opacity={reveal}>
    <rect x="764" y="230" width="772" height="380" rx="25" fill={index===1?'#e1efeb':'white'}/>
    <text x="802" y="281" fontSize="26" fontWeight="700">同じ条件が12か月続いたら</text>
    <text x="802" y="336" fontSize="25">額面給与　年360万円</text>
    <rect x="802" y="362" width="695" height="54" rx="9" fill="#dce6ed"/>
    <rect x="802" y="362" width={695*year.socialShare} height="54" rx="9" fill={teal}/>
    <text x="802" y="459" fontSize="23" fill={teal}>■ そのうち社会保険料の本人負担</text>
    <text x="802" y="527" fontSize="52" fontWeight="700">{yen(year.socialTotal)}円／年</text>
    <text x="802" y="574" fontSize="22">年額は月額の換算。同じ負担をもう一度足すわけではありません。</text>
   </g>}
   {index!==1&&<g><rect x="764" y="230" width="772" height="380" rx="25" fill={index===2?'#e1efeb':'white'}/>
    <text x="804" y="288" fontSize="28" fontWeight="700">{index===0?'給与明細で、分けて見るもの':'年齢による追加負担'}</text>
    {index===0?<><text x="804" y="364" fontSize="31">社会保険料 ／ 税金 ／ その他</text><path d="M804 394 H1490" stroke="#d6dfda" strokeWidth="2"/><text x="804" y="463" fontSize="29">保険料だけを引いた残りは、</text><text x="804" y="515" fontSize="34" fontWeight="700" fill={teal}>手取りではありません。</text><text x="804" y="572" fontSize="23">実際の項目名や表示方法は勤務先によって異なります。</text></>:<><text x="804" y="366" fontSize="34">40歳から介護保険料が加わる</text><text x="804" y="455" fontSize="57" fontWeight="700" fill={teal}>＋2,430円／月</text><text x="804" y="523" fontSize="24">このモデルでの追加額です。</text><text x="804" y="569" fontSize="23">詳しい計算や対象は介護保険の動画へ。</text></>}
   </g>}
   <text x="64" y="638" fontSize="20" fill={muted}>棒はそれぞれの額面給与＝100％の割合図。月額と年額で金額の目盛りは異なります。差額は手取りではありません。</text>
   <text x="64" y="670" fontSize="21" fontWeight={index===2?700:400} fill={index===2?teal:muted}>40歳から介護分が加わる（このモデルでは月2,430円）。加入先・地域・年齢などで金額は異なります。</text>
   <text x="64" y="700" fontSize="18" fill={muted}>子ども・子育て支援金は別掲：月{yen(monthlySupport)}円／年{yen(monthlySupport*12)}円。税金・会社負担は未集計。労災分は本人控除に加えません。</text>
   <text x="64" y="728" fontSize="17" fill={muted}>出典P01〜P04・P05（{model.checkedAt}確認）の料率による独自試算。実際の暦年の負担実績ではありません。詳しい計算は別動画へ。</text>
   </g>
  </svg>
  <div style={{position:'absolute',left:64,right:64,bottom:25,height:142,boxSizing:'border-box',padding:'11px 22px',borderRadius:15,background:ink,color:'white',fontSize:22,lineHeight:1.4}}>
   <div style={{fontSize:16,color:'#b9d7cf',marginBottom:5}}>ナレーション案・未収録／発話字幕は録音後に調整</div>{beat.narration}
  </div>
 </AbsoluteFill>;
};
