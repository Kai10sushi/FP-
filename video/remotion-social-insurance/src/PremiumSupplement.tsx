import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {annual,categories,chartSvg,model,monthly,monthlySupport,premiumDuration,premiumScenes,sum,yen} from './premium-model';

export {premiumDuration};
const ink='#173c42',muted='#52676b',teal='#237c82',paper='#f5f3ec';
const textStyle={fontFamily:'"Yu Gothic",Meiryo,sans-serif',color:ink};
const tag:React.CSSProperties={padding:'8px 18px',borderRadius:30,background:'#e1efeb',fontSize:21,fontWeight:700};
const card:React.CSSProperties={background:'#ffffff',borderRadius:24,padding:'28px 32px',boxShadow:'0 8px 30px #173c4208'};
const Price:React.FC<{value:number,size?:number}>=({value,size=52})=><span style={{fontSize:size,fontWeight:800,fontVariantNumeric:'tabular-nums'}}>{yen(value)}<span style={{fontSize:size*0.48,marginLeft:5}}>円</span></span>;
const Source:React.FC<{ids:readonly string[]}>=({ids})=><div style={{position:'absolute',bottom:18,left:64,right:64,fontSize:17,color:muted,lineHeight:1.5}}>{ids.length?'出典：'+ids.join('・')+' ／2026-10-22確認　協会けんぽ・日本年金機構・厚生労働省・こども家庭庁（URLは資料・概要欄に掲載）':'私の考え：制作者本人の回答（2026-10-20）。計算の公式出典は前画面と資料・概要欄に掲載。'}</div>;

const MonthlySlip:React.FC=()=>{
 const values=monthly(22);
 return <div style={{display:'grid',gridTemplateColumns:'760px 1fr',gap:52,marginTop:32}}>
   <section style={card}>
     <div style={{display:'flex',justifyContent:'space-between',fontSize:25,fontWeight:700,borderBottom:'2px solid #e1e8e4',paddingBottom:18}}><span>給与明細（説明用モデル）</span><span>40歳未満</span></div>
     <div style={{display:'flex',justifyContent:'space-between',padding:'22px 0 16px',alignItems:'center'}}><span style={{fontSize:26}}>月給（手当込み）</span><Price value={model.salary} size={43}/></div>
     {categories.filter(c=>c.id!=='care').map(c=><div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',marginTop:8,borderRadius:12,background:c.color+'16'}}><span style={{fontSize:27,borderLeft:'6px solid '+c.color,paddingLeft:14}}>{c.label}</span><Price value={values[c.id]} size={35}/></div>)}
     <div style={{marginTop:20,fontSize:21,color:muted}}>労災保険は全額会社負担。税金はこの表に含めていません。</div>
   </section>
   <section style={{paddingTop:35}}>
     <div style={{fontSize:26}}>社会保険料の本人負担</div>
     <div style={{marginTop:15,color:teal}}><Price value={sum(values)} size={72}/><span style={{fontSize:28}}>／月</span></div>
     <div style={{height:3,background:'#cbd9d2',margin:'25px 0'}}/>
     <div style={{fontSize:24}}>別掲：子ども・子育て支援金</div>
     <div style={{margin:'12px 0'}}><Price value={monthlySupport} size={38}/><span style={{fontSize:24}}>／月</span></div>
     <div style={{fontSize:23,marginTop:20}}>支援金込み：<strong>{yen(sum(values)+monthlySupport)}円／月</strong></div>
     <div style={{fontSize:20,color:muted,marginTop:24,lineHeight:1.7}}>加入先・地域・年齢などで金額は異なります。<br/>控除の一部を示した説明用のモデルです。</div>
   </section>
 </div>;
};

export const PensionCalculationForLaterVideo:React.FC=()=> <div style={{marginTop:22}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 70px 1fr 70px 1fr',gap:14,alignItems:'center'}}>
   <section style={{...card,padding:'20px 26px'}}><div style={{fontSize:22,color:muted}}>報酬の区分</div><div style={{fontSize:32,fontWeight:700,marginTop:14}}>29万円以上<br/>31万円未満</div><div style={{fontSize:21,marginTop:14,lineHeight:1.5}}>基本給だけでなく<br/>通勤手当なども含む</div></section>
   <span style={{fontSize:52,textAlign:'center',color:teal}}>→</span>
   <section style={{...card,padding:'20px 26px',background:'#e1efeb'}}><div style={{fontSize:22}}>標準報酬月額</div><div style={{fontSize:48,fontWeight:800,marginTop:14}}>30万円</div><div style={{fontSize:21,marginTop:14}}>今回のモデルの設定</div></section>
   <span style={{fontSize:52,textAlign:'center',color:teal}}>→</span>
   <section style={{...card,padding:'20px 26px'}}><div style={{fontSize:22}}>本人負担率</div><div style={{fontSize:48,fontWeight:800,marginTop:14}}>9.15％</div><div style={{fontSize:21,marginTop:14}}>全体18.3％の半分</div></section>
  </div>
  <div style={{marginTop:20,padding:'18px 32px',background:ink,color:'white',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:35}}>300,000円 × 9.15％</span><span style={{fontSize:36}}>＝</span><Price value={27450} size={46}/></div>
  <div style={{marginTop:16,fontSize:22,lineHeight:1.5}}>会社も別に27,450円を負担。標準報酬月額は所定の決定・改定で決まり、毎月の給与と常に同額ではありません。</div>
 </div>;

const AgeComparison:React.FC=()=>{
 const before=monthly(22),after=monthly(40);
 return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:30,marginTop:25}}>
   {[{label:'22〜39歳',values:before},{label:'40〜59歳',values:after}].map(({label,values})=><section key={label} style={{...card,padding:'24px 30px'}}>
     <div style={{fontSize:29,fontWeight:700}}>{label}</div>
     <div style={{height:35,display:'flex',marginTop:18,borderRadius:8,overflow:'hidden',width:sum(values)/sum(after)*100+'%'}}>{categories.map(c=><div key={c.id} style={{width:values[c.id]/sum(values)*100+'%',background:c.color}}/>)}</div>
     {categories.map(c=><div key={c.id} style={{fontSize:23,display:'flex',justifyContent:'space-between',marginTop:12}}><span><span style={{color:c.color}}>■ </span>{c.label}</span><strong>{yen(values[c.id])}円</strong></div>)}
     <div style={{marginTop:16,paddingTop:14,borderTop:'2px solid #dce6e0',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:22}}>社会保険料 小計</span><Price value={sum(values)} size={36}/></div>
     <div style={{fontSize:21,marginTop:12,display:'flex',justifyContent:'space-between'}}><span>別掲：支援金</span><span>＋345円</span></div>
     <div style={{fontSize:23,marginTop:10,display:'flex',justifyContent:'space-between',color:teal,fontWeight:700}}><span>支援金を含めた合計</span><span>{yen(sum(values)+monthlySupport)}円／月</span></div>
   </section>)}
 </div>;
};

const Action:React.FC<{t:number}>=({t})=><div style={{marginTop:50,display:'grid',gridTemplateColumns:'1fr 1fr',gap:45,alignItems:'center'}}>
 <section style={{...card,background:'#e9e5d9',minHeight:280}}>
   <span style={{...tag,background:'#dfd8c9'}}>私の考え</span>
   <div style={{fontSize:35,fontWeight:700,marginTop:35,lineHeight:1.7}}>引かれなければ、もっと<br/>手取りが多いのにと感じる。</div>
 </section>
 <section style={{...card,background:'#e1efeb',minHeight:280,opacity:interpolate(t,[1,3],[0.25,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
   <span style={tag}>私の考え</span>
   <div style={{fontSize:35,fontWeight:700,marginTop:35,lineHeight:1.7}}>一定の保障があることは<br/>安心につながる。</div>
 </section>
 <div style={{gridColumn:'1 / -1',fontSize:24,color:muted}}>このグラフは負担額の試算です。受け取る年金・給付や制度の価値を差し引いた「損得」の計算ではありません。</div>
</div>;

const AnnualComparison:React.FC<{t:number}>=({t})=><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px 30px',marginTop:28,lineHeight:1.25}}>
 {[22,40].map(age=>{
  const values=annual(age),value=sum(monthly(age)),progress=interpolate(t,[1,5],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <section key={age} style={{...card,padding:'20px 30px'}}>
   <div style={{fontSize:24,fontWeight:700}}>{age===22?'40歳未満':'40〜59歳'}の1年間</div>
   <div style={{marginTop:8,fontSize:19,color:muted}}>額面給与総額（税・保険料の控除前）</div>
   <div style={{fontSize:32,fontWeight:800,marginTop:3}}>月30万円 × 12か月 ＝ 360万円</div>
   <div style={{marginTop:14,display:'flex',justifyContent:'space-between',fontSize:18,color:muted}}><span>0円</span><span>360万円</span></div>
   <div role="img" aria-label={'額面給与360万円のうち社会保険料'+yen(values.socialTotal)+'円'} style={{height:46,marginTop:6,borderRadius:10,overflow:'hidden',background:'#dce6ed',border:'1px solid #afc0cd',display:'flex'}}>
    <div style={{width:values.socialShare*100*progress+'%',background:teal}}/>
   </div>
   <div style={{display:'flex',justifyContent:'space-between',fontSize:18,marginTop:9}}><span style={{color:teal}}>■ そのうち社会保険料</span><span>□ 棒全体：額面給与</span></div>
   <div style={{marginTop:16,borderTop:'2px solid #dce6e0',paddingTop:12,fontSize:21}}>月 <Price value={value} size={28}/> <span style={{color:muted}}>× 12か月</span></div>
   <div style={{marginTop:6,color:teal,fontSize:23}}>年 <Price value={values.socialTotal} size={38}/><span style={{fontSize:22,marginLeft:12}}>約{(values.socialShare*100).toFixed(1)}％</span></div>
  </section>;
 })}
 <div style={{gridColumn:'1 / -1',fontSize:20,color:muted,lineHeight:1.4}}>
  同じ360万円の目盛りで比較。保険料は給与の一部で、上乗せする額ではありません。<br/>
  差額は手取りではありません（税金等は未計算）。賞与なし。支援金は別掲：年4,140円。
 </div>
</div>;

export const PremiumSupplement:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),seconds=frame/fps;
 const scene=premiumScenes.filter(s=>seconds>=s.start).at(-1)??premiumScenes[0];
 const local=seconds-scene.start;
 if(scene.id==='P4')return <AbsoluteFill style={textStyle}>
   <div style={{width:1600,height:900}} dangerouslySetInnerHTML={{__html:chartSvg(interpolate(local,[1,21],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}))}}/>
 </AbsoluteFill>;
 return <AbsoluteFill style={{...textStyle,background:paper,padding:'42px 64px'}}>
  <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',gap:16,alignItems:'center'}}><span style={tag}>{scene.id==='P5'?'自分の見方':'モデル試算'}</span><span style={{fontSize:21}}>制度の翻訳室</span></div><span style={{fontSize:20,color:muted}}>{scene.id} ／ 給与明細から考える</span></header>
  <h1 style={{fontSize:44,lineHeight:1.3,margin:'30px 0 12px'}}>{scene.title}</h1>
  <div style={{fontSize:22,color:muted}}>{scene.id==='P5'?'制作者本人の実感として、負担感と安心感をお伝えします。':'月給30万円／協会けんぽ東京／一般の事業／賞与なし／本人負担'}</div>
  {scene.id==='P1'?<MonthlySlip/>:scene.id==='P2'?<AgeComparison/>:scene.id==='P3'?<AnnualComparison t={local}/>:<Action t={local}/>}
  <div style={{position:'absolute',left:64,right:64,bottom:72,padding:'15px 24px',borderRadius:14,background:ink,color:'white',fontSize:27,textAlign:'center',fontWeight:600}}>{scene.caption}</div>
  <Source ids={scene.sourceIds}/>
 </AbsoluteFill>;
};

