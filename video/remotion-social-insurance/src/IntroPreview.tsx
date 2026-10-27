import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';

export const introScenes = [
  {seconds: 10, chapter: '01 / 導入', title: 'この保険料、何を支えている？', subtitle: '毎月の給与明細にある社会保険料。何のために使われているのでしょうか。', cards: ['給与明細', '社会保険料', '暮らしとのつながり'], note: '給与明細はイメージです'},
  {seconds: 10, chapter: '01 / 導入', title: '暮らしが変わる、そのときに', subtitle: '病気になったとき。家族に介護が必要になったとき。仕事を失ったとき。社会保険は、こうした場面とつながっています。', cards: ['病気・けが', '介護', '失業'], note: '給付には制度ごとの条件があります'},
  {seconds: 12, chapter: '01 / 導入', title: '自分に関係する制度を見つける', subtitle: '今回は目的、4つの分野、メリットと注意点、使い方を整理します。困ったとき、何を調べればよいか。その入り口をつかみましょう。', cards: ['医療保険', '年金保険', '介護保険', '労働保険'], note: '労働保険 ＝ 雇用保険 ＋ 労災保険'},
  {seconds: 12, chapter: '02 / 社会保険の目的', title: '一人では抱えきれない負担を支える', subtitle: '病気や老後など、個人だけでは対応が難しい生活上のリスクを、社会で支えること。それが社会保険の目的です。', cards: ['治療が必要になる', '仕事を休む', '生活費が必要になる'], note: 'リスク：生活に大きな影響を与える出来事や状況'},
  {seconds: 14, chapter: '02 / 社会保険の目的', title: '備えが整う前にも、起こりうる', subtitle: '貯蓄は大切な備えです。ただ、大きな出費は十分に貯める前に起こることもあります。そこで、保険料を出し合って支える仕組みがあります。', cards: ['貯蓄で備える', '社会保険でも支える'], note: '保障の範囲・給付条件は制度ごとに異なります'},
  {seconds: 14, chapter: '02 / 社会保険の目的', title: '支える側にも、支えられる側にも', subtitle: '集めた保険料などをもとに、必要な人を条件に応じて支えます。制度によっては税金も使われます。次に、4つの分野の役割を見ていきましょう。', cards: ['保険料・公費など', '制度ごとの条件', '医療や暮らしの支え'], note: '出典：厚生労働省「社会保障教育」／詳しい出典は制作資料へ'},
];
export const introDuration = introScenes.reduce((sum, scene) => sum + scene.seconds * 30, 0);

const Scene: React.FC<{scene: typeof introScenes[number]}> = ({scene}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
  const colors = ['#216e78', '#6a62a6', '#498768', '#b27b31'];
  return <AbsoluteFill style={{background: '#f6f4ef', color: '#172d35', fontFamily: 'Yu Gothic, Meiryo, sans-serif', padding: '65px 100px'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 25, letterSpacing: 2, color: '#546a70'}}><span>制度の翻訳室</span><span>{scene.chapter}</span></div>
    <div style={{opacity: appear, transform: `translateY(${(1 - appear) * 20}px)`}}>
      <div style={{fontSize: 65, fontWeight: 800, marginTop: 75, letterSpacing: -1}}>{scene.title}</div>
      <div style={{width: 90, height: 6, background: '#216e78', marginTop: 30}} />
      <div style={{display: 'flex', gap: 25, marginTop: 80}}>
        {scene.cards.map((card, i) => {
          const fade = interpolate(frame, [12 + i * 12, 27 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <div key={card} style={{flex: 1, height: 215, background: '#fff', borderRadius: 18, borderTop: `7px solid ${colors[i % colors.length]}`, padding: '30px 26px', opacity: fade, transform: `translateY(${(1 - fade) * 20}px)`}}>
            <div style={{fontSize: 24, color: colors[i % colors.length], marginBottom: 28}}>0{i + 1}</div>
            <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.5}}>{card}</div>
          </div>;
        })}
      </div>
      <div style={{fontSize: 25, color: '#546a70', marginTop: 30}}>{scene.note}</div>
    </div>
    <div style={{position: 'absolute', left: 100, right: 100, bottom: 100, background: '#172d35', color: 'white', borderRadius: 16, padding: '27px 38px', minHeight: 155, fontSize: 33, lineHeight: 1.65}}>{scene.subtitle}</div>
    <div style={{position: 'absolute', left: 100, bottom: 37, fontSize: 21, color: '#697a7e'}}>構成確認用プレビュー・音声なし・表示時間は仮</div>
  </AbsoluteFill>;
};

export const IntroPreview: React.FC = () => {
  const frame = useCurrentFrame();
  let offset = 0;
  return <AbsoluteFill>
    {introScenes.map((scene) => {
      const from = offset;
      offset += scene.seconds * 30;
      return <Sequence key={scene.title} from={from} durationInFrames={scene.seconds * 30}><Scene scene={scene}/></Sequence>;
    })}
    <div style={{position: 'absolute', bottom: 0, height: 7, width: `${100 * frame / (introDuration - 1)}%`, background: '#216e78'}} />
  </AbsoluteFill>;
};
