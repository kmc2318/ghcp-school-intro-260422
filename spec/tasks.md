# Tasks: 神山まるごと高専 紹介サイト

要件 (`requirements.md`) と設計 (`design.md`) に基づく実装計画。チェックボックスで進捗管理する。

## Phase 1: 設計とコンテンツ準備

- [x] **T-1.1** 公式サイト (kamiyama.ac.jp) から事実情報（設立年・学科・所在地・教育理念）を要約し、各ページのコピー骨子を作成
  - 出力: ページ別コピー（任意で `spec/content.md` に保存）
  - 依存: なし
  - 関連要件: REQ-ABOUT-1, REQ-ABOUT-3, REQ-ACCESS-1

- [x] **T-1.2** 4 ページのワイヤーフレーム（セクション順序）を確定
  - 出力: ワイヤースケッチ or 文章メモ
  - 依存: T-1.1

## Phase 2: 共通基盤

- [x] **T-2.1** ディレクトリ構造を作成 (`assets/css/`, `assets/js/`, `assets/images/`) と `.nojekyll` を root に配置
  - 関連要件: REQ-DEPLOY-2

- [x] **T-2.2** `assets/css/main.css` にデザイントークン（CSS 変数）・リセット・タイポ・グリッド・共通コンポーネント（`.btn`, `.card`, `.section`, `.site-header`, `.site-footer`, `.circle-decor`）を実装
  - 関連要件: REQ-DESIGN-1, REQ-DESIGN-2, REQ-RWD-1, REQ-A11Y-3
  - 依存: T-2.1

- [x] **T-2.3** `assets/js/main.js` に `initPathDraw()` / `initMobileNav()` / `initScrollProgress()` / `respectsReducedMotion()` を実装
  - 関連要件: REQ-DESIGN-3, REQ-DESIGN-4, REQ-RWD-2, REQ-A11Y-1, REQ-A11Y-2
  - 依存: T-2.1

- [x] **T-2.4** 共通 SVG パーツを作成（円アイコン・円弧ディバイダ・浮遊円・favicon・OGP プレースホルダー）
  - 出力: `assets/images/*.svg`
  - 関連要件: REQ-DEPLOY-4, REQ-CAMPUS-2
  - 依存: T-2.1

- [x] **T-2.5** 共通ヘッダー / フッターの HTML スニペットを確定（4 ページに同一コピー貼付の元になる）
  - 関連要件: REQ-PAGE-2, REQ-PAGE-3, REQ-RWD-2
  - 依存: T-2.2, T-2.3

## Phase 3: ページ実装（T-2.* 完了後は並列可能）

- [x] **T-3.1** `index.html` 実装
  - フルビューポートのヒーロー（中心大円 + キャッチコピー、背景に浮遊円）/ 学校概要 3 カード / 各サブページ導線 / 共通ヘッダー・フッター / OGP・favicon
  - 関連要件: REQ-PAGE-1, REQ-TOP-1〜4, REQ-DEPLOY-3, REQ-DEPLOY-4
  - 依存: T-2.2〜T-2.5

- [x] **T-3.2** `about.html` 実装
  - 「学校概要」「教育の特徴」「カリキュラム / 5 年間の学び」3 セクション、セクション間 SVG パスで接続、出典リンク併記
  - 関連要件: REQ-PAGE-1, REQ-ABOUT-1〜3, REQ-DESIGN-3
  - 依存: T-2.2〜T-2.5

- [x] **T-3.3** `campus.html` 実装
  - 全寮制紹介 + キャンパス画像枠（プレースホルダー SVG）
  - 関連要件: REQ-PAGE-1, REQ-CAMPUS-1〜2
  - 依存: T-2.2〜T-2.5

- [x] **T-3.4** `access.html` 実装
  - 所在地、地図埋め込み枠（`<iframe>` プレースホルダー）、公式サイト・募集要項・問い合わせ外部リンクボタン（新規タブ）
  - 関連要件: REQ-PAGE-1, REQ-ACCESS-1〜3
  - 依存: T-2.2〜T-2.5

## Phase 4: 検証

- [x] **T-4.1** ローカルプレビュー: `python3 -m http.server 8000` で 4 ページ表示・遷移確認
  - 関連要件: REQ-PAGE-3, REQ-DEPLOY-3
  - 依存: T-3.1〜T-3.4

- [ ] **T-4.2** レスポンシブ確認 (375px / 768px / 1280px)
  - 関連要件: REQ-RWD-1, REQ-RWD-2

- [ ] **T-4.3** Lighthouse 測定 (Performance / Accessibility / Best Practices ≥ 90)
  - 関連要件: NFR-PERF-1, REQ-A11Y-3

- [ ] **T-4.4** アニメーション 60fps 確認 / `prefers-reduced-motion` 抑制確認
  - 関連要件: NFR-PERF-2, REQ-DESIGN-4

- [x] **T-4.5** リンク切れ・外部リンク `target=_blank rel=noopener` 確認
  - 関連要件: REQ-ACCESS-3

- [ ] **T-4.6** ブラウザ互換確認（Chrome / Edge / Safari / Firefox 最新）
  - 関連要件: NFR-COMPAT-1

## Phase 5: GitHub Pages 公開

- [ ] **T-5.1** `Second` ブランチで PR を作成 → レビュー → `main` にマージ
  - 関連要件: REQ-DEPLOY-1

- [ ] **T-5.2** GitHub `Settings` → `Pages` → `Source` を `Deploy from a branch` / `main` / `/ (root)` に設定
  - 関連要件: REQ-DEPLOY-1

- [ ] **T-5.3** 公開 URL `https://kmc2318.github.io/ghcp-school-intro-260422/` で全ページ・CSS/JS/画像が 200 OK か検証
  - 関連要件: REQ-DEPLOY-1, REQ-DEPLOY-3
  - 依存: T-5.2

- [x] **T-5.4** README.md に公開 URL とローカル確認手順を追記
  - 依存: T-5.3

## Phase 6: 引き継ぎ・改善

- [ ] **T-6.1** 画像素材到着後にプレースホルダー SVG を差し替え（`assets/images/`）
- [ ] **T-6.2** Lighthouse 改善余地・技術的負債を Issue 化
- [ ] **T-6.3** 中間ファイル・作業ログを `.agent_work/` に整理（必要に応じて）

## トレーサビリティ表

| 要件 | 実装タスク | 検証タスク |
|---|---|---|
| REQ-PAGE-1 | T-3.1〜T-3.4 | T-4.1 |
| REQ-PAGE-2/3 | T-2.5, T-3.1〜T-3.4 | T-4.1, T-4.5 |
| REQ-TOP-* | T-3.1 | T-4.1, T-4.2 |
| REQ-ABOUT-* | T-3.2 | T-4.1 |
| REQ-CAMPUS-* | T-3.3, T-2.4 | T-4.1 |
| REQ-ACCESS-* | T-3.4 | T-4.5 |
| REQ-DESIGN-1/2 | T-2.2 | T-4.3 |
| REQ-DESIGN-3 | T-2.3, T-3.2 | T-4.4 |
| REQ-DESIGN-4 | T-2.3 | T-4.4 |
| REQ-RWD-* | T-2.2, T-2.3, T-2.5 | T-4.2 |
| REQ-A11Y-* | T-2.2, T-2.3 | T-4.3 |
| REQ-DEPLOY-* | T-2.1, T-5.* | T-5.3 |
| NFR-PERF-* | T-2.2, T-2.3 | T-4.3, T-4.4 |
| NFR-COMPAT-1 | 全実装 | T-4.6 |
