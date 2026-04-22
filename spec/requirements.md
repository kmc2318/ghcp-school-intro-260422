# Requirements: 神山まるごと高専 紹介サイト

EARS 記法で要件を定義する。プロジェクトサイトとして GitHub Pages から配信する、4 ページ構成のモノクロ・ミニマルな静的サイト。

## 1. ユーザーストーリー

### US-1: 訪問者がサイトの第一印象で学校の世界観を掴む
- **As a** 学校に興味を持った中学生・保護者・教育関係者
- **I want** トップページを開いた瞬間にスタイリッシュなビジュアルで学校の雰囲気を感じたい
- **So that** 続きを読みたいと思える

### US-2: 学校の基本情報を素早く把握する
- **As a** 受験を検討している中学生
- **I want** 学校概要・教育の特徴・カリキュラムをページ内で完結して読みたい
- **So that** 自分に合うかを判断できる

### US-3: キャンパスライフのイメージを得る
- **As a** 全寮制が気になる保護者
- **I want** キャンパス・寮生活の様子を視覚的に把握したい
- **So that** 子どもを送り出す判断材料になる

### US-4: アクセス・問い合わせ先に到達する
- **As a** 訪問・出願検討者
- **I want** 所在地・公式サイト・募集要項などの一次情報リンクを 1 か所で得たい
- **So that** 次のアクションに進める

### US-5: モバイル端末で快適に閲覧する
- **As a** スマートフォン中心の中学生
- **I want** スマホでもレイアウト崩れなく閲覧できる
- **So that** 通学中・自宅で気軽に読める

## 2. 機能要件 (EARS)

### 2.1 ページ構成

- **REQ-PAGE-1**: THE SYSTEM SHALL `index.html`, `about.html`, `campus.html`, `access.html` の 4 ページを提供する。
- **REQ-PAGE-2**: THE SYSTEM SHALL 全ページに共通ヘッダー（ロゴ + 円アイコン + ナビゲーション）と共通フッター（公式リンク + コピーライト）を表示する。
- **REQ-PAGE-3**: WHEN ユーザーがヘッダーのナビリンクをクリック THE SYSTEM SHALL 該当ページへ遷移する（相対パス）。

### 2.2 トップページ (`index.html`)

- **REQ-TOP-1**: THE SYSTEM SHALL ファーストビューにフルビューポートのヒーロー（中心に大円 + キャッチコピー）を表示する。
- **REQ-TOP-2**: THE SYSTEM SHALL ヒーロー背景に複数の円をふわっと浮遊させる（CSS keyframes）。
- **REQ-TOP-3**: THE SYSTEM SHALL 学校概要を 3 枚程度のカードで表示する。
- **REQ-TOP-4**: THE SYSTEM SHALL 各サブページへの導線リンクを表示する。

### 2.3 学校概要 (`about.html`)

- **REQ-ABOUT-1**: THE SYSTEM SHALL 「学校概要」「教育の特徴（テクノロジー × デザイン × 起業家精神）」「カリキュラム / 5 年間の学び」の 3 セクションを順に表示する。
- **REQ-ABOUT-2**: THE SYSTEM SHALL 各セクション間を SVG パス（円弧）で視覚的につなぐ。
- **REQ-ABOUT-3**: THE SYSTEM SHALL 各セクションに公式情報の出典リンクを併記する。

### 2.4 キャンパス (`campus.html`)

- **REQ-CAMPUS-1**: THE SYSTEM SHALL 全寮制の紹介とキャンパスの様子を表示する。
- **REQ-CAMPUS-2**: WHERE 画像素材が未提供 THE SYSTEM SHALL プレースホルダー SVG（モノクロの幾何学図形）を表示する。

### 2.5 アクセス (`access.html`)

- **REQ-ACCESS-1**: THE SYSTEM SHALL 所在地（徳島県神山町）と地図埋め込み枠を表示する。
- **REQ-ACCESS-2**: THE SYSTEM SHALL 公式サイト・募集要項・問い合わせの外部リンクボタンを表示する。
- **REQ-ACCESS-3**: WHEN ユーザーが外部リンクをクリック THE SYSTEM SHALL 新規タブで開く（`target="_blank"` + `rel="noopener noreferrer"`）。

### 2.6 デザイン・アニメーション

- **REQ-DESIGN-1**: THE SYSTEM SHALL モノクロ配色（白 `#fff` / 黒 `#0a0a0a` / グレー 4 段階 `#f5f5f5` `#e5e5e5` `#999` `#333`）のみを使用する。
- **REQ-DESIGN-2**: THE SYSTEM SHALL タイポグラフィに Noto Sans JP と Inter（Google Fonts）を使用する。
- **REQ-DESIGN-3**: WHEN セクションがビューポートに入る THE SYSTEM SHALL SVG パスを `stroke-dasharray` アニメーションで描画する（IntersectionObserver 利用）。
- **REQ-DESIGN-4**: IF ユーザーが `prefers-reduced-motion: reduce` を指定している THEN THE SYSTEM SHALL 浮遊・パス描画アニメーションを無効化する。

### 2.7 レスポンシブ・アクセシビリティ

- **REQ-RWD-1**: THE SYSTEM SHALL モバイルファーストで 768px / 1024px のブレイクポイントを持つレイアウトを提供する。
- **REQ-RWD-2**: WHILE ビューポート幅が 768px 未満 THE SYSTEM SHALL ナビをハンバーガーメニュー化し、トグルで開閉する。
- **REQ-A11Y-1**: THE SYSTEM SHALL すべてのインタラクティブ要素にキーボード操作とフォーカスリングを提供する。
- **REQ-A11Y-2**: THE SYSTEM SHALL ナビ・主要ボタンに適切な `aria-*` 属性を付与する。
- **REQ-A11Y-3**: THE SYSTEM SHALL 本文と背景のコントラスト比 4.5:1 以上を確保する。

### 2.8 デプロイ・運用

- **REQ-DEPLOY-1**: THE SYSTEM SHALL `main` ブランチのリポジトリ root を GitHub Pages の配信ソースとする。
- **REQ-DEPLOY-2**: THE SYSTEM SHALL リポジトリ直下に `.nojekyll` を配置し Jekyll 処理を回避する。
- **REQ-DEPLOY-3**: THE SYSTEM SHALL すべての内部リンク・アセット参照を相対パスで記述する（プロジェクトサイトの baseurl ずれ回避）。
- **REQ-DEPLOY-4**: THE SYSTEM SHALL OGP / メタタグ / favicon を全ページに設定する。

## 3. 非機能要件

- **NFR-PERF-1**: Lighthouse の Performance / Accessibility / Best Practices スコアが 90 点以上であること。
- **NFR-PERF-2**: アニメーションは 60fps 近くで動作すること（Performance パネル測定）。
- **NFR-MAINT-1**: ビルド不要（素の HTML/CSS/JS のみ）で、ファイル編集 → push で即時反映できること。
- **NFR-COMPAT-1**: 最新版の Chrome / Edge / Safari / Firefox で正常表示されること。

## 4. スコープ外

- 多言語対応（日本語のみ）
- お問い合わせフォーム送信機能
- CMS / ヘッドレス連携
- カスタムドメイン
- 認証・会員機能
