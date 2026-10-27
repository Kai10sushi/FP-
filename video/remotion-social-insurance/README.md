# Remotion動画制作環境

制度解説チャンネル用の動画制作アプリです。Reactで画面を組み立て、Remotion Studioで確認し、MP4へ書き出します。

## セットアップ

```powershell
npm install
```

## プレビュー

```powershell
npm run studio
```

表示されたRemotion Studioで `SocialInsuranceOverview` を選びます。

## MP4を書き出す

```powershell
npm run render
```

出力先は `out/social-insurance-overview.mp4` です。現在のCompositionは、5分野を表示する12秒の画面設計プロトタイプです。音声や本編台本はまだ入れていません。

## 導入・目的の試作（2026-10-04）

`IntroPreview` は72秒・6場面の構成確認用プレビューです。4分野（医療・年金・介護・労働）の構成を採用し、労働保険の内訳も表示します。ナレーション・BGMは未収録。字幕は台本v2の導入・目的を短尺用に編集したもので、表示時間は仮です。

```powershell
npx remotion render src/index.ts IntroPreview out/intro-preview.mp4 --scale=0.6666667 --concurrency=2
```

Studioでは `IntroPreview` を選びます。旧 `SocialInsuranceOverview` は5分野の12秒デザイン試作として保存しています。
検証状況：TypeScriptチェックは成功。静止画とMP4の書き出しは実行環境の `spawn EPERM` により失敗。見た目・再生の検証は未実施で、MP4完成とは扱いません。ローカル端末で `npm run preview:intro` により起動し、確認後に `npm run render:intro` で書き出せます。
確認する点：文字の読みやすさ、落ち着いた配色、場面の順番。音声収録後、字幕の区切りと表示時間を音声に合わせます。

### 既存環境の役割

- 5分野の説明カード、章タイトル、図解、字幕などを再利用する。
- 動画の文章・色・表示順をコードで管理する。
- ナレーションや顔出し映像を組み込む場合は、後からAudioやVideoを追加する。
- 制度の内容や数字は、動画コードとは別に公式情報と台本で確認する。

Remotionは個人利用や小規模な制作に使えますが、利用規模によってライセンス条件が変わるため、収益化後や法人利用へ進む際は公式ライセンスを確認します。
# 2026-10-22追加：給与明細と38年累計の補足映像

Remotionコンポジション：PremiumSupplement（1600×900、30fps、138秒、現時点は無音）。
プレビューは npm run preview:narrated-intro で起動し、http://127.0.0.1:3102/ を開く。新しい補足映像と録音済み5章を切り替え可能。
グラフ生成は npm run premium:assets、計算確認は npm run premium:check、書き出しは npm run render:premium。
計算の前提・出典は ../../research/001-payroll-model-2026.md、読み上げ案は ../../scripts/001-payroll-supplement-2026.md。

