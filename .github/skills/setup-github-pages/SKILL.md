---
name: setup-github-pages
description: 'GitHub Pages サイトを構築・公開するためのワークフロー。リポジトリの Pages 有効化、公開ソース（Branch / GitHub Actions）の選択、静的サイト（素のHTML / Jekyll / Hugo / Next.js / Astro 等）に応じたデプロイワークフローの作成、カスタムドメイン設定までを手順化する。「GitHub Pagesを設定したい」「サイトを公開したい」「ページをデプロイ」「Pagesのworkflowを作って」「独自ドメインを設定」などの依頼で使用する。'
argument-hint: '使用するフレームワーク（html / jekyll / hugo / next / astro など）があれば指定'
---

# GitHub Pages 構築

## 使うとき

- リポジトリを GitHub Pages で公開したいとき
- 静的サイトジェネレータ（Jekyll / Hugo / Next.js / Astro / Vite など）のデプロイワークフローを追加するとき
- 公開ソースを「branch」から「GitHub Actions」へ移行するとき
- カスタムドメインを設定するとき

## 前提の確認

着手前に以下をユーザーに確認、または既存ファイルから判断する：

1. **公開対象のフレームワーク**
   - 素のHTML / CSS / JS（最小構成）
   - Jekyll（GitHub 標準サポート）
   - Hugo / Next.js / Astro / Vite など（Actions ビルドが必要）
2. **公開ソースの方針**
   - **Deploy from a branch**（`main` の `/` または `/docs`）：素のHTMLや Jekyll で最も簡単
   - **GitHub Actions**（推奨）：任意のビルドステップを実行可能
3. **公開URL**
   - `https://<owner>.github.io/<repo>/` （プロジェクトサイト）
   - `https://<owner>.github.io/` （ユーザー / Organization サイト：リポジトリ名が `<owner>.github.io`）
4. **カスタムドメインの有無**

## 手順

### A. 素のHTML を branch から公開（最速）

1. ルートに `index.html` を配置（または `docs/index.html` にして `/docs` を公開ディレクトリに指定）
2. GitHub UI: **Settings → Pages → Build and deployment**
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)` または `/docs`
3. 数分後 `https://<owner>.github.io/<repo>/` で公開を確認

### B. GitHub Actions でデプロイ（推奨・任意フレームワーク対応）

1. **Settings → Pages → Source** を `GitHub Actions` に変更
2. ワークフローを `.github/workflows/deploy-pages.yml` に作成
   - フレームワーク別の雛形は [references/workflows.md](./references/workflows.md) を参照
   - 公式 Starter Workflows: <https://github.com/actions/starter-workflows/tree/main/pages>
3. ワークフローには以下を含める：
   - `permissions: contents: read / pages: write / id-token: write`
   - `concurrency: group: "pages"`
   - ビルドジョブ → `actions/upload-pages-artifact@v3`
   - デプロイジョブ → `actions/deploy-pages@v4`（`environment: github-pages`）
4. `main` への push、または `workflow_dispatch` でトリガ
5. Actions 実行後、Pages の URL（環境のサマリに表示）でアクセス確認

### C. カスタムドメインの設定

1. リポジトリのデプロイ対象ルートに `CNAME` ファイルを置く（中身は `example.com` のみ）
   - Actions デプロイの場合はビルド成果物に含まれること
2. DNS 設定
   - **Apex ドメイン（`example.com`）**：`A` レコードで GitHub の IP を 4 件登録
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **サブドメイン（`www.example.com`）**：`CNAME` を `<owner>.github.io` へ
3. **Settings → Pages → Custom domain** にドメインを入力 → DNS チェックが通るのを待つ
4. **Enforce HTTPS** にチェック

## チェックリスト（完了判定）

- [ ] **Settings → Pages** で `Your site is live at <URL>` が表示されている
- [ ] その URL に実際にアクセスして 200 で表示される
- [ ] 相対パス・アセットパスが `<repo>` プレフィックス（プロジェクトサイトの場合）に対応している
  - Next.js: `basePath` / `assetPrefix`
  - Vite: `base: '/<repo>/'`
  - Hugo: `baseURL`
- [ ] カスタムドメイン使用時：HTTPS が有効、リダイレクトが正しい
- [ ] 404 用ページ（`404.html` など）が用意されている

## よくある落とし穴

- **アセットが 404**：プロジェクトサイトで `/` 始まりの絶対パスを使い、`<repo>/` プレフィックスを忘れている
- **Jekyll が勝手に動く**：意図せず Jekyll 処理されたくない場合はリポジトリルートに空の `.nojekyll` ファイルを置く（`_` で始まるディレクトリも公開したい時に必要）
- **Source 設定後に反映されない**：ブラウザキャッシュや CDN の TTL（最長数分）を待つ
- **権限エラー**：Actions ワークフローの `permissions:` ブロックが不足している
- **CNAME が消える**：UI でカスタムドメインを設定すると `CNAME` が自動コミットされるが、Actions デプロイでは成果物に含めて毎回出力する必要がある

## 参考

- 公式 Starter Workflows（フレームワーク別雛形）: <https://github.com/actions/starter-workflows/tree/main/pages>
- `actions/deploy-pages`: <https://github.com/actions/deploy-pages>
- `actions/upload-pages-artifact`: <https://github.com/actions/upload-pages-artifact>
- 公式ドキュメント（日本語）
  - GitHub Pages トップ: <https://docs.github.com/ja/pages>
  - サイトの作成: <https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site>
  - 公開ソースの設定: <https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
  - カスタムワークフロー: <https://docs.github.com/ja/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
  - カスタムドメイン: <https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages>
  - Jekyll で構築: <https://docs.github.com/ja/pages/setting-up-a-github-pages-site-with-jekyll>
- フレームワーク別ワークフロー雛形: [references/workflows.md](./references/workflows.md)
