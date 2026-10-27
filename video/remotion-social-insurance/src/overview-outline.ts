// 編集設計v7。完成台本・同期済み映像ではない。行動案は本人確認前。
export const overviewOutline = [
  {
    "id": "01",
    "title": "導入：この控除は何を支える？",
    "start": 0,
    "seconds": 40,
    "purpose": "給与明細への疑問と、動画で得られる答えを提示する"
  },
  {
    "id": "02",
    "title": "社会保険の目的と支え合う仕組み",
    "start": 40,
    "seconds": 45,
    "purpose": "大きなリスクを一人で抱え込まない仕組みを理解する"
  },
  {
    "id": "03",
    "title": "暮らしと4分野の地図",
    "start": 85,
    "seconds": 80,
    "purpose": "生活の出来事と、医療・年金・介護・労働を結びつける"
  },
  {
    "id": "04",
    "title": "負担と注意点：月額＋短い年額",
    "start": 165,
    "seconds": 70,
    "purpose": "給与に対する負担、条件、保障の限界を混同せず理解する"
  },
  {
    "id": "05",
    "title": "私の見方：負担感と安心感",
    "start": 235,
    "seconds": 25,
    "purpose": "本人の実感を公式情報と区別して伝える"
  },
  {
    "id": "06",
    "title": "困った場面から確認する順番",
    "start": 260,
    "seconds": 90,
    "purpose": "状況を切り分け、自分に関係する制度の候補を選ぶ"
  },
  {
    "id": "07",
    "title": "確認先と一つの行動（行動案は本人確認前）",
    "start": 350,
    "seconds": 55,
    "purpose": "疑問と最初の確認先を一行に残す行動案を示す"
  },
  {
    "id": "08",
    "title": "まとめ：何を支え、次に何を確認する？",
    "start": 405,
    "seconds": 20,
    "purpose": "冒頭の疑問に答え、選んだ次の確認につなげる"
  }
] as const;
export const overviewDurationSeconds = 425;
export const overviewPayrollDuration = 45*30;
export const overviewPayrollBeats=[
 {start:0,seconds:25,title:'給与明細の負担を、月額で見る',narration:'月給30万円、協会けんぽ東京に加入する40歳未満の会社員モデルです。賞与はない設定で、社会保険料の本人負担は月4万3725円。給与の一部が保険料になります。税金などは別で、残りがそのまま手取りになるわけではありません。'},
 {start:25,seconds:12,title:'同じ月額を、1年分に換算する',narration:'同じ月額が12か月続くと、社会保険料は年間およそ52万5千円。額面給与360万円のうちの負担です。'},
 {start:37,seconds:8,title:'年齢や加入先で、負担は変わる',narration:'40歳からは介護保険料も加わります。詳しい計算方法は、それぞれの保険の動画で解説します。'}
] as const;
