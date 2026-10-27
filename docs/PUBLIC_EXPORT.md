# 公開用保存版の範囲

保存日：2026-10-27。元の制作フォルダを変更せず、公開用の別コピーを作成。

## 保存したもの
チャンネル方針、学習資料、台本と旧版、研究・出典メモ、レビューと進捗、Remotionコード、依存関係の定義、字幕とタイミング、テキスト図解。チャット全履歴や音声込みの完全バックアップではない。

## 公開しないもの
- 本人の音声（原音・調整版）、動画出力、キャッシュ、認識モデル、node_modules、Python環境。
- 個人の給与・控除額、加入制度、勤務履歴の具体的回答、連絡先、ローカル利用者名。一般モデルの月給30万円と制度計算は個人実績と分けて保持。
- 個人回答2資料は公開用要約・テンプレートへ置換。他の文書中の個人概算額や収益目標も省略。
- 秘密情報らしいファイル名と代表的なトークン・秘密鍵のパターンを検査。全ての秘密情報の不存在を保証するものではない。

## 確認・復元方法
Node.jsとnpmを用意し、video/remotion-social-insuranceで次を実行する。

    npm ci --ignore-scripts
    npx tsc --noEmit
    node scripts/verify-approved-intro.mjs
    node scripts/verify-overview-refocus.mjs
    node scripts/verify-premium-model.mjs
    npm run studio

StudioではApprovedIntroStoryboard（導入の無音素材）、OverviewPayroll（短い給与モデル）を選ぶ。PremiumSupplementは旧累計の履歴。SocialInsuranceOverviewは初期試作で、最新の全編ではない。
録音済みCompositionには非公開のローカル音声の復元が必要。127.0.0.1はローカル表示であり、公開動画URLではない。
MP4出力の既存問題は残作業。依存関係・外部モデルは別途取得が必要で、取得だけで最終動画が完成するわけではない。

## 履歴・権利
現在のスナップショットとして保存し、過去に存在しなかったGitコミットを過去の日付で作らない。各時点はarchive/・旧版ファイル・PROJECT_HISTORY.mdで追う。
未許諾の第三者の動画・音声や資料本文を追加しない。参考リンクは許諾や日本への適用の証明ではない。
