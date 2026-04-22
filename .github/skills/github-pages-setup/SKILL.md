---
name: github-pages-setup
description: 'GitHub Pages サイトの新規構築・公開・更新を支援するスキル。USE FOR: リポジトリで GitHub Pages を有効化したい、静的サイト（HTML/CSS/JS）を公開したい、Jekyll でブログやドキュメントサイトを作りたい、GitHub Actions のカスタムワークフローでビルド・デプロイしたい、カスタムドメイン（CNAME / Apex / www）や HTTPS を設定したい、`gh-pages` ブランチや `/docs` フォルダーからの配信を切り替えたい、公開後に 404 やビルド失敗をデバッグしたい場合。DO NOT USE FOR: GitHub Pages 以外の静的ホスティング（Netlify, Vercel, Cloudflare Pages 等）、サーバーサイドが必要な動的サイト、リポジトリ作成自体の手順。'
---

# GitHub Pages 構築スキル

GitHub Pages を使った静的サイトの公開を、要件確認 → 配信ソース選定 → セットアップ → デプロイ → 検証 の流れで進めます。

## いつ使うか

- リポジトリの内容を Web サイトとして公開したい
- Jekyll または GitHub Actions ワークフローでサイトをビルド・デプロイしたい
- カスタムドメインや HTTPS を設定したい
- Pages の公開設定・ビルド失敗・404 をトラブルシューティングしたい

## 公式ドキュメント（参照優先順）

不明点が出たら推測せず、以下のドキュメントを参照してください。

- トップ: https://docs.github.com/ja/pages
- クイックスタート: https://docs.github.com/ja/pages/quickstart
- サイト作成: https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site
- 公開ソースの設定: https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- カスタムワークフロー（Actions）: https://docs.github.com/ja/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Jekyll でのセットアップ: https://docs.github.com/ja/pages/setting-up-a-github-pages-site-with-jekyll
- カスタムドメイン: https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site
- HTTPS 強制: https://docs.github.com/ja/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

## 手順

### 1. 要件ヒアリング

以下を確認してから着手します。曖昧な場合はユーザーに質問してください。

- リポジトリ種別: ユーザー / Organization サイト（`<user>.github.io`）か、プロジェクトサイト（`<user>.github.io/<repo>`）か
- リポジトリの公開設定: Public か Private（Private は GitHub Pro / Team / Enterprise が必要）
- コンテンツ種別: 素の HTML / Jekyll / その他静的サイトジェネレーター（Next.js, Astro, VitePress, Hugo 等）
- 配信ソース: `Deploy from a branch`（`main` の `/` または `/docs`、もしくは `gh-pages`）か `GitHub Actions`
- カスタムドメインの有無

### 2. 配信ソースの選定

| ケース | 推奨ソース |
|--------|------------|
| 素の HTML を `main` に置くだけ | Branch: `main` / `/ (root)` または `/docs` |
| Jekyll をそのまま使う | Branch: `main` / `/ (root)`（GitHub が自動ビルド） |
| Next.js / Astro / Hugo / Vite など | GitHub Actions（カスタムワークフロー） |
| ビルド成果物のみ別ブランチに出したい | Branch: `gh-pages` |

### 3. セットアップ

#### 3-1. ブランチから配信する場合

1. リポジトリ直下（または `/docs`）に `index.html` を配置
2. GitHub の `Settings` → `Pages` を開く
3. `Build and deployment` → `Source` で `Deploy from a branch` を選択
4. ブランチとフォルダー（`/` または `/docs`）を指定して `Save`

#### 3-2. GitHub Actions で配信する場合

`.github/workflows/pages.yml` を作成し、`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages` を使う公式パターンに従います。最小例:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ここでビルド（例: npm ci && npm run build）
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist   # ビルド成果物のディレクトリに合わせて変更

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

設定後、`Settings` → `Pages` → `Source` を `GitHub Actions` に切り替えます。

#### 3-3. Jekyll を使う場合

- `Gemfile` に `gem "github-pages", group: :jekyll_plugins` を追加
- `_config.yml` で `title`, `description`, `theme`（例: `minima`）, `baseurl`（プロジェクトサイトでは `/<repo>`）を設定
- ローカル確認: `bundle install && bundle exec jekyll serve`

### 4. カスタムドメイン（任意）

1. リポジトリ直下に `CNAME` ファイルを作成し、ドメイン名を 1 行で記載（例: `example.com`）
2. DNS 設定:
   - Apex ドメイン: GitHub Pages の A レコード 4 つ（`185.199.108.153` 等）または ALIAS/ANAME
   - サブドメイン: `CNAME` で `<user>.github.io`
3. `Settings` → `Pages` → `Custom domain` に入力 → DNS チェック完了後 `Enforce HTTPS` を有効化

### 5. 検証

- Actions のジョブが緑になっているか
- `Settings` → `Pages` に「Your site is live at ...」が表示されるか
- 公開 URL を実際に開き、トップページとサブページ、CSS / JS / 画像が読めるか
- プロジェクトサイトでは相対パス・`baseurl` のずれによる 404 に注意

## よくある落とし穴

- **プロジェクトサイトの絶対パス**: `/assets/...` で書くと `<user>.github.io/<repo>/assets/...` を指せず 404 になる。相対パスか `baseurl` を使う。
- **`Source` の選択ミス**: Actions ワークフローを作っただけでは公開されない。Pages 設定で `GitHub Actions` を選ぶ必要がある。
- **`permissions` 不足**: Actions の `pages: write` と `id-token: write` がないと `deploy-pages` が失敗する。
- **Jekyll の `_` プレフィックス**: 既定で `_` 始まりのファイルは無視される。素の HTML サイトで `_` を使いたい場合はリポジトリ直下に空の `.nojekyll` を置く。
- **CNAME の上書き**: ビルド成果物に `CNAME` を含めないと、デプロイのたびにカスタムドメイン設定が外れる。`public/CNAME` などソースに含めておく。
- **キャッシュ**: 反映されない時は CDN キャッシュの可能性。数分待つかシークレットウィンドウで確認。

## 完了チェック

- [ ] `Settings` → `Pages` で公開 URL が表示されている
- [ ] 公開 URL でトップページが 200 で開ける
- [ ] 静的アセット（CSS/JS/画像）が読み込めている
- [ ] （該当する場合）カスタムドメインで HTTPS アクセスできる
- [ ] （Actions 利用時）`main` への push で自動デプロイされる
