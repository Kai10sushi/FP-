// 2026-10-22確認。一般の事業・協会けんぽ東京・賞与なしの説明用モデル。
export const model = {
  checkedAt: '2026-10-22',
  salary: 300000,
  standardRemuneration: 300000,
  startAge: 22,
  endAge: 60,
  careStartAge: 40,
  notes: '2026年10月時点の料率と月給を38年間固定。将来予測ではない。',
} as const;

export const sources = [
  {id:'P01',name:'協会けんぽ｜2026年度 東京の保険料額表',url:'https://www.kyoukaikenpo.or.jp/assets/R8_13tokyo.pdf',section:'標準報酬月額300,000円の行、料率・適用開始時期',effective:'健康・介護：2026年3月分〜／支援金：2026年4月分〜'},
  {id:'P02',name:'日本年金機構｜2026年度 厚生年金保険料額表',url:'https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku/ryogakuhyo/20200825.files/R08ryougaku.pdf',section:'19等級：報酬290,000円以上310,000円未満、標準報酬300,000円',effective:'料率18.3％：2017年9月分〜'},
  {id:'P03',name:'厚生労働省｜2026年度 雇用保険料率',url:'https://www.mhlw.go.jp/content/001692566.pdf',section:'一般の事業、労働者負担5/1000',effective:'2026-04-01〜2027-03-31'},
  {id:'P04',name:'こども家庭庁｜子ども・子育て支援金制度',url:'https://www.cfa.go.jp/policies/kodomokosodateshienkinseido',section:'令和8年度の支援金額（試算）、被用者保険',effective:'2026年4月分〜、2026年度の率0.23％'},
  {id:'P05',name:'厚生労働省｜労働保険とは',url:'https://www.mhlw.go.jp/seisakunitsuite/bunya/koyou_roudou/roudoukijun/hoken/tokusetusaito/about.html',section:'保険料の負担（労災分は全額事業主負担）',effective:'2026-10-22確認'},
  {id:'P06',name:'日本年金機構｜厚生年金保険の保険料',url:'https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html',section:'標準報酬月額と賞与、報酬に含む手当',effective:'ページ更新2026-09-30'},
] as const;

export const categories = [
  {id:'pension',label:'厚生年金',color:'#237c82',employeeRate:0.0915,source:'P02',basis:'standard'},
  {id:'health',label:'健康保険',color:'#78ab98',employeeRate:0.04925,source:'P01',basis:'standard'},
  {id:'employment',label:'雇用保険',color:'#8c82b7',employeeRate:0.005,source:'P03',basis:'salary'},
  {id:'care',label:'介護保険',color:'#d4a04d',employeeRate:0.0081,source:'P01',basis:'standard'},
] as const;
export type CategoryId = typeof categories[number]['id'];
export type Amounts = Record<CategoryId,number>;

export const yen = (v:number) => Math.round(v).toLocaleString('ja-JP');
export const man = (v:number, digits=1) => (v/10000).toLocaleString('ja-JP',{minimumFractionDigits:digits,maximumFractionDigits:digits});

export function monthly(age:number): Amounts {
  return Object.fromEntries(categories.map(c=>[c.id,
    c.id==='care' && age < model.careStartAge ? 0 :
    Math.round((c.basis==='salary'?model.salary:model.standardRemuneration)*c.employeeRate)
  ])) as Amounts;
}
export function sum(v:Amounts) { return categories.reduce((s,c)=>s+v[c.id],0); }
export const monthlySupport = Math.round(model.standardRemuneration*0.0023/2);

export function annual(age:number) {
  const grossSalary=model.salary*12, socialTotal=sum(monthly(age))*12;
  return {grossSalary,socialTotal,supportTotal:monthlySupport*12,socialShare:socialTotal/grossSalary};
}

export function cumulative(age:number) {
  const reachedAge = Math.max(model.startAge,Math.min(model.endAge,age));
  const months = Math.round((reachedAge-model.startAge)*12);
  const careMonths = Math.max(0,Math.round((reachedAge-model.careStartAge)*12));
  const regular = monthly(model.startAge);
  const amounts = Object.fromEntries(categories.map(c=>[c.id,
    c.id==='care'?monthly(model.careStartAge).care*careMonths:regular[c.id]*months
  ])) as Amounts;
  const socialTotal = sum(amounts);
  const grossSalary=model.salary*months;
  return {age:reachedAge,months,careMonths,amounts,grossSalary,socialShare:grossSalary?socialTotal/grossSalary:0,socialTotal,supportTotal:monthlySupport*months,payrollTotal:socialTotal+monthlySupport*months};
}
export const final = cumulative(model.endAge);
export const milestones = [22,30,40,50,60].map(cumulative);

// 静止SVGとRemotionで同じ描画関数・同じ計算を使う。給与と保険料は同じゼロ起点の目盛り。
export function chartSvg(progress=1) {
  const p=Math.min(1,Math.max(0,progress));
  const age=model.startAge+(model.endAge-model.startAge)*p, current=cumulative(age);
  const left=142,top=270,width=900,height=410,maxY=140000000;
  const x=(a:number)=>left+(a-22)/38*width;
  const y=(v:number)=>top+height-v/maxY*height;
  const ages=Array.from({length:39},(_,i)=>22+i);
  const pathFor=(index:number)=>{
    const points=ages.map(a=>{
      const v=cumulative(a).amounts, below=categories.slice(0,index).reduce((s,c)=>s+v[c.id],0);
      return {x:x(a),low:y(below),high:y(below+v[categories[index].id])};
    });
    return 'M'+points.map(v=>v.x+','+v.high).join(' L')+' L'+points.slice().reverse().map(v=>v.x+','+v.low).join(' L')+' Z';
  };
  const grossPath='M'+ages.map(a=>x(a)+','+y(cumulative(a).grossSalary)).join(' L');
  const socialPath='M'+ages.map(a=>x(a)+','+y(cumulative(a).socialTotal)).join(' L');
  const grossLabel=(v:number)=>v>=100000000?Math.floor(v/100000000)+'億'+man(v%100000000,0)+'万円':man(v,0)+'万円';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="38年間の額面給与総額1億3680万円と、そのうちの社会保険料本人負担約2052万円。同じ期間と目盛りで比較。">
  <defs><clipPath id="premium-reveal"><rect x="${left}" y="${top-15}" width="${width*p+1}" height="${height+16}"/></clipPath></defs>
  <rect width="1600" height="900" fill="#f5f3ec"/>
  <g font-family="'Yu Gothic',Meiryo,sans-serif" fill="#173c42">
    <rect x="64" y="42" width="150" height="35" rx="17" fill="#e1efeb"/>
    <text x="139" y="67" text-anchor="middle" font-size="21" font-weight="700">モデル試算</text>
    <text x="240" y="67" font-size="20">給与と保険料を、同じ期間・同じ目盛りで比較</text>
    <text x="64" y="137" font-size="43" font-weight="700">38年間の給与、そのうち保険料はいくら？</text>
    <text x="66" y="181" font-size="23" fill="#52676b">月給30万円・賞与なし・昇給なし／2026年10月確認の料率固定／本人負担</text>
    <text x="64" y="222" font-size="23" font-weight="700">保険料は給与総額の「一部」です。給与に上乗せする金額ではありません。</text>
    <text x="${left}" y="253" font-size="19" fill="#52676b">累計（万円）・ゼロ起点</text>
    ${[0,4000,8000,12000,14000].map(v=>`<line x1="${left}" y1="${y(v*10000)}" x2="${left+width}" y2="${y(v*10000)}" stroke="#d6ddda"/><text x="${left-18}" y="${y(v*10000)+6}" text-anchor="end" font-size="20">${yen(v)}</text>`).join('')}
    <line x1="${x(40)}" x2="${x(40)}" y1="${top}" y2="${top+height}" stroke="#a47830" stroke-dasharray="7 7"/>
    <g clip-path="url(#premium-reveal)">
      <path d="${grossPath} L${x(60)},${y(0)} L${x(22)},${y(0)} Z" fill="#dce6ed"/>
      <path d="${grossPath}" fill="none" stroke="#456a86" stroke-width="4"/>
      ${categories.map((c,i)=>`<path d="${pathFor(i)}" fill="${c.color}"/>`).join('')}
      <path d="${socialPath}" fill="none" stroke="#173c42" stroke-width="3"/>
    </g>
    <circle cx="${x(age)}" cy="${y(current.grossSalary)}" r="6" fill="#456a86"/>
    <circle cx="${x(age)}" cy="${y(current.socialTotal)}" r="6" fill="#173c42"/>
    ${[22,30,40,50,60].map(a=>`<text x="${x(a)}" y="714" text-anchor="middle" font-size="22">${a}歳</text>`).join('')}
    <text x="${x(40)+12}" y="650" font-size="18" fill="#855e23">40歳から介護分</text>
    <rect x="1090" y="270" width="445" height="156" rx="20" fill="#e1e9ef"/>
    <text x="1118" y="307" font-size="21">${p>=1?'60歳到達':Math.floor(age)+'歳付近'}までの額面給与総額</text>
    <text x="1118" y="365" font-size="42" font-weight="700">${grossLabel(current.grossSalary)}</text>
    <text x="1118" y="401" font-size="19">月30万円 × ${current.months}か月（控除前）</text>
    <rect x="1090" y="440" width="445" height="161" rx="20" fill="#173c42"/>
    <text x="1118" y="478" font-size="21" fill="#e0eee8">そのうち 社会保険料の本人負担</text>
    <text x="1118" y="535" font-size="45" font-weight="700" fill="white">約${man(current.socialTotal,0)}万円</text>
    <text x="1118" y="573" font-size="23" fill="#e0eee8">額面給与総額の 約${(current.socialShare*100).toFixed(1)}％</text>
    <text x="1098" y="638" font-size="20">別掲：支援金 約${man(current.supportTotal,1)}万円</text>
    <text x="1098" y="673" font-size="20">支援金込みの負担：約${man(current.payrollTotal,0)}万円</text>
    <rect x="142" y="748" width="20" height="20" rx="4" fill="#dce6ed" stroke="#456a86"/>
    <text x="172" y="765" font-size="20">額面給与総額</text>
    ${categories.map((c,i)=>`<rect x="${420+i*215}" y="748" width="20" height="20" rx="4" fill="${c.color}"/><text x="${450+i*215}" y="765" font-size="20">${c.label}</text>`).join('')}
    <text x="64" y="813" font-size="21" font-weight="700">差額は手取りではありません。税金等は未計算。給付や年金を差し引いた「損得」の図でもありません。</text>
    <text x="64" y="846" font-size="18" fill="#52676b">仮定：協会けんぽ東京・一般の事業・22歳〜60歳未満456か月。会社負担・賞与・昇給・免除・60歳以降は含めません。</text>
    <text x="64" y="877" font-size="17" fill="#52676b">出典：協会けんぽ／日本年金機構／厚生労働省／こども家庭庁（P01〜P04）。独自試算・将来予測ではありません。</text>
  </g></svg>`;
}

export const premiumScenes = [
  {id:'P1',title:'月給30万円の控除内訳',start:0,seconds:30,purpose:'計算式より先に項目と負担額を読む',
    narration:'ここからは、月給30万円の一般会社員モデルで見てみます。協会けんぽの東京支部に加入し、賞与はない設定です。40歳未満では、健康保険が1万4775円、厚生年金が2万7450円、雇用保険が1500円。社会保険料は、合わせて月4万3725円になります。別掲の子ども・子育て支援金は345円です。今回は計算方法の詳しい説明は各制度の動画に回し、負担の大きさを見ていきましょう。',
    onScreen:'モデル試算／月給30万円／社会保険料 月43,725円',image:'模式給与明細から控除内訳と小計へ',animation:'明細の項目と合計を順番に強調',caption:'社会保険料：月43,725円（40歳未満）',sourceIds:['P01','P02','P03','P04'],takeaway:'条件付きの一般モデル。支援金は別掲'},
  {id:'P2',title:'40歳から加わる介護保険料',start:30,seconds:20,purpose:'年齢による追加負担を見る',
    narration:'40歳になると、このモデルでは介護保険料が月2430円加わります。社会保険料の小計は、4万6155円です。支援金を含めた合計とは分けて表示しています。労災保険料は会社の負担なので、本人の控除額には加えていません。',
    onScreen:'40歳から介護分＋2,430円',image:'40歳未満と40歳以降の内訳棒',animation:'介護分が棒に追加される',caption:'40歳から介護分＋2,430円／詳しい計算は各制度の動画へ',sourceIds:['P01','P04','P05'],takeaway:'今回の集計は60歳到達まで。介護の対象年齢全体を表すものではない'},
  {id:'P3',title:'1年分の給与と、そのうちの保険料',start:50,seconds:30,purpose:'給与と保険料を同じ1年間・同じ目盛りで見る',
    narration:'月給30万円が12か月続くと、額面給与は年間360万円です。そのうち、社会保険料の本人負担は、40歳未満で52万4700円、40歳から59歳で55万3860円になります。給与全体に対して、およそ15パーセントです。支援金は別に示しています。また、残りがそのまま手取りになるわけではありません。次は、給与と保険料の両方を38年分に広げます。',
    onScreen:'額面給与 年360万円／そのうち保険料 年524,700円・553,860円',image:'共通目盛りの給与総額の棒の中に本人負担を表示',animation:'月額→12か月→年額。給与の全体と保険料の一部を同時に表示',caption:'月々 → 1年 → 38年。給与と保険料を同じ期間で見る',sourceIds:['P01','P02','P03','P04'],takeaway:'保険料は給与の一部。給与との差額は手取りではない'},
  {id:'P4',title:'38年間の給与と保険料を比べる',start:80,seconds:45,purpose:'累計額だけでなく給与総額に対する割合も伝える',
    narration:'22歳から60歳になるまで、38年間働くモデルです。月給30万円が変わらず、賞与もない場合、額面給与の総額は1億3680万円。そのうち、社会保険料の本人負担はおよそ2052万円で、給与総額のおよそ15パーセントです。グラフは同じ期間と目盛りで比べています。40歳からは介護分も加えています。支援金を含めた負担はおよそ2068万円です。給与との差額がそのまま手取りになるわけではなく、給付も差し引いていません。現在の条件を固定した試算で、将来予測ではありません。',
    onScreen:'額面給与総額1億3,680万円／うち社会保険料 約2,052万円・約15.0％',image:'給与総額の面とその一部の保険料を共通のゼロ起点の目盛りに表示',animation:'22歳→40歳→60歳。同じ時間軸で給与と保険料が増える',caption:'同じ38年間の額面給与と保険料／差額は手取りではない',sourceIds:['P01','P02','P03','P04'],takeaway:'給与総額との関係で読む固定条件の試算。将来予測や損失額ではない'},
  {id:'P5',title:'私が感じる負担感と安心感',start:125,seconds:45,purpose:'回答済みの本人の実感を伝える',
    narration:'正直、給与明細を見ると、「これが引かれなければ、もっと手取りが多いのに」と思います。自分の月々の負担を1年分に換算したときも、「こんなに払っているんだ」と驚きました。一方で、医療費の負担が抑えられることや、老後、働けなくなったときにも一定の保障があることには、安心感もあります。毎月の負担は大きく感じる。でも、保障があることは安心につながる。私は、その両方を感じています。',
    onScreen:'私の考え／負担感と安心感',image:'給与控除を見る場面と生活を支える保障',animation:'モデル試算から私の考えへラベル切替',caption:'毎月の負担感と、一定の保障がある安心感',sourceIds:[],takeaway:'本人回答の範囲で編集。最後の行動案は別途検討'},
] as const;
export const premiumDuration = 170*30;

