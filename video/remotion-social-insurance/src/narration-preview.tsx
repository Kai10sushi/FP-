import React from 'react';
import {ApprovedIntroStoryboard,approvedIntroDuration} from './ApprovedIntroStoryboard';
import {approvedIntroScenes} from './approved-intro-scenes';
import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';
import {NarratedFiveChapters,fiveChaptersDuration,riskStart,coverageStart} from './NarratedBenefits';
import {PremiumSupplement,premiumDuration} from './PremiumSupplement';
import {premiumScenes,sources} from './premium-model';
import {OverviewPayroll,overviewPayrollDuration,overviewPayrollBeats} from './OverviewPayroll';
import {overviewOutline,overviewDurationSeconds} from './overview-outline';
import {NarrationAudioProvider} from './NarrationAudio';

const App=()=>{
 const [mode,setMode]=React.useState<'intro'|'model'|'recorded'|'legacy'>('intro');
 const [enhanced,setEnhanced]=React.useState(true);
 const [frame,setFrame]=React.useState(0);
 const player=React.useRef<PlayerRef>(null);
 const duration=mode==='intro'?approvedIntroDuration:mode==='model'?overviewPayrollDuration:mode==='legacy'?premiumDuration:fiveChaptersDuration;
 React.useEffect(()=>{
  const instance=player.current;
  const onFrame=(e:{detail:{frame:number}})=>setFrame(e.detail.frame);
  instance?.addEventListener('frameupdate',onFrame);
  setFrame(0);
  return ()=>instance?.removeEventListener('frameupdate',onFrame);
 },[mode]);
 const seek=(second:number)=>{player.current?.pause();player.current?.seekTo(Math.min(duration-1,Math.round(second*30)));};
 const buttons:readonly (readonly [number,string])[]=mode==='intro'?approvedIntroScenes.map(s=>[s.start,s.title] as const):mode==='model'?overviewPayrollBeats.map(s=>[s.start,s.title] as const):mode==='legacy'?
  [...premiumScenes.map(s=>[s.start,s.title] as const),[premiumScenes.find(s=>s.id==='P4')!.start+premiumScenes.find(s=>s.id==='P4')!.seconds-1,'累計グラフの完成形']]:
  [[0,'01 導入'],[53.9,'02 目的'],[124,'03 4分野'],[riskStart,'04 リスク分散'],[coverageStart,'05 幅広い保障']];
 return <main style={{maxWidth:1400,margin:'auto',padding:24}}>
  <h1 style={{fontSize:26}}>社会保険の全体像｜字幕付き音声と補足映像の確認</h1>
  <nav style={{display:'flex',gap:12,marginBottom:12}}>
   {([['intro','v7：改訂した導入（無音）'],['model','v7：月額と短い年額（無音）'],['recorded','旧録音の第1〜5章（再利用候補）']] as const).map(([id,label])=><button key={id} onClick={()=>{player.current?.pause();setMode(id);}} style={{padding:14,borderRadius:10,border:mode===id?'2px solid #efc173':'2px solid transparent',background:mode===id?'#e1efeb':'#36575a',color:mode===id?'#173c42':'white',fontSize:17,cursor:'pointer'}}>{label}</button>)}
  </nav>
  <p>{mode==='intro'?'v7構成に合わせ、予告から累計比較を外しました。40秒は仮尺。変更した予告文は本人確認前で、原稿表示は同期済み字幕ではありません。':mode==='legacy'?'履歴用の旧補足映像です。本編v7には採用しません。旧累計グラフは削除せず保管しています。':mode==='model'?'月額を中心に、年額は12秒だけ添えた無音の素材案です。累計グラフは本編から外しました。詳しい計算式は個別動画へ回します。':'ご本人の録音5章・約4分49秒。発話字幕付きで、調整版と原音を切り替えて比較できます。映像・発話内容は新構成への素材候補です。'}</p>
  {mode==='recorded'&&<div style={{display:'flex',gap:12,marginBottom:16}}>
   {([[true,'調整版：軽いノイズ低減・音量調整'],[false,'原音：比較用']] as const).map(([value,label])=><button key={label} aria-pressed={enhanced===value} onClick={()=>{player.current?.pause();setEnhanced(value);}} style={{padding:'12px 16px',borderRadius:8,border:enhanced===value?'2px solid #efc173':'2px solid transparent',background:'#e1efeb',color:'#173c42',fontSize:16,cursor:'pointer'}}>{label}</button>)}
  </div>}
  <NarrationAudioProvider value={enhanced}>
   <Player key={mode} ref={player} component={mode==='intro'?ApprovedIntroStoryboard:mode==='model'?OverviewPayroll:mode==='legacy'?PremiumSupplement:NarratedFiveChapters} durationInFrames={duration} fps={30} compositionWidth={1600} compositionHeight={900} controls={false} style={{width:'100%',borderRadius:16,overflow:'hidden'}}/>
  </NarrationAudioProvider>
  <div style={{display:'flex',gap:12,alignItems:'center',marginTop:16}}>
   <button onClick={()=>player.current?.play()} style={{padding:12,fontSize:16}}>再生</button><button onClick={()=>player.current?.pause()} style={{padding:12,fontSize:16}}>一時停止</button>
   <input aria-label="再生位置" type="range" min={0} max={duration-1} value={frame} onChange={e=>player.current?.seekTo(Number(e.target.value))} style={{flex:1,minWidth:50}}/>
   <span style={{whiteSpace:'nowrap'}}>{(frame/30).toFixed(1)} / {(duration/30).toFixed(0)}秒</span>
  </div>
  <nav style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}>{buttons.map(([t,label])=><button key={label} onClick={()=>seek(t)} style={{padding:'12px 16px',background:'#e1efeb',color:'#173c42',border:0,borderRadius:8,fontSize:16,cursor:'pointer'}}>{label}</button>)}</nav>
  {mode==='intro'&&<section><h2 style={{fontSize:20}}>改訂原稿：予告文のみ変更・本人確認前</h2><p>累計の予告を削除し、困ったときの確認先を案内する内容へ改訂しました。録音は改訂した予告文の確認後に、導入だけをひと続きで行います。他の章の原音は保持しています。</p>{approvedIntroScenes.map(s=><p key={s.id}>{s.narration}</p>)}</section>}
  {mode==='model'&&<section><h2 style={{fontSize:20}}>月額・年額の素材案</h2><p>数値は協会けんぽ東京・一般の事業・月給と標準報酬月額30万円・賞与なし・40歳未満のモデル。保険料の料率は2026-10-22確認。年額は同じ条件が12か月続く換算で、実際の暦年の実績ではありません。</p>{overviewPayrollBeats.map(s=><p key={s.start}>{s.narration}</p>)}</section>}
  <details style={{margin:'24px 0'}} open={mode==='intro'}><summary style={{cursor:'pointer',fontSize:20}}>改善した全体構成 v7（仮{Math.floor(overviewDurationSeconds/60)}分{overviewDurationSeconds%60}秒）</summary>
   <p>目的は、負担額の大きさではなく「暮らしに関係する制度と、次の確認先」を理解することです。完成台本・完成動画ではありません。</p>
   {overviewOutline.map(s=><p key={s.id}><strong>{s.id} {s.title}（{s.seconds}秒）</strong><br/>{s.purpose}</p>)}
   <p>厳しい再評価：分野紹介と使い方が同じ説明にならないこと、窓口を並べすぎないこと、本人の見方を実感の範囲に留めることが課題です。最後の行動は提案段階で、本人が採用した扱いにはしません。</p>
  </details>
  <details style={{margin:'24px 0'}}><summary style={{cursor:'pointer',fontSize:20}}>旧累計グラフ・映像（履歴／本編不採用）</summary><p>旧案は比較・将来の企画検討用に残しています。</p><button onClick={()=>{player.current?.pause();setMode('legacy');}}>履歴の旧映像を表示</button></details>
  {mode==='legacy'&&<>
   <p>前提：協会けんぽ東京・一般の事業・月給と標準報酬月額30万円・賞与なし・昇給なし・本人負担のみ。22歳から60歳到達まで38年間。介護分は40歳から加算します。2026年10月確認の料率を全期間固定した試算で、将来予測ではありません。</p>
   <p>年額は額面給与360万円、38年累計は1億3,680万円と同じ目盛りで比較します。保険料はその一部です。給与との差額は手取りではありません。</p>
   <p><a href="/charts/premiums-lifetime-2026.svg" target="_blank" rel="noreferrer" style={{color:'#efc173'}}>給与と保険料の累計グラフを大きく表示</a>　／　<a href="/charts/premiums-model-2026.json" target="_blank" rel="noreferrer" style={{color:'#efc173'}}>計算の内訳を見る</a></p>
   <details><summary style={{cursor:'pointer',fontSize:20}}>履歴：旧場面ごとのナレーション案（不採用）</summary>{premiumScenes.map(s=><section key={s.id}><h2 style={{fontSize:20}}>{s.id} {s.title}</h2><p>{s.narration}</p></section>)}</details>
   <details style={{margin:'24px 0'}}><summary style={{cursor:'pointer',fontSize:20}}>公式の出典（2026-10-22確認）</summary>{sources.map(s=><p key={s.id}><a href={s.url} target="_blank" rel="noreferrer" style={{color:'#efc173'}}>{s.id} {s.name}</a><br/>{s.effective}</p>)}</details>
  </>}
 </main>;
};
createRoot(document.getElementById('root')!).render(<App/>);
