# フレームワーク別 GitHub Pages デプロイワークフロー雛形

すべて `.github/workflows/deploy-pages.yml` に保存する想定。

`<repo>` の部分は実リポジトリ名に置換すること。

## 共通の前提

- **Settings → Pages → Source** を `GitHub Actions` に設定済み
- ワークフロー権限ブロックは必須

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false
```

---

## 1. 素のHTML / 静的ファイル

```yaml
name: Deploy static site to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'   # 公開対象ディレクトリ。docs/ にする場合は 'docs'
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 2. Jekyll

```yaml
name: Deploy Jekyll site to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - uses: actions/configure-pages@v5
      - run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 3. Hugo

```yaml
name: Deploy Hugo site to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

env:
  HUGO_VERSION: 0.128.0

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: |
          wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
          sudo dpkg -i hugo.deb
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - id: pages
        uses: actions/configure-pages@v5
      - run: hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 4. Next.js（静的エクスポート）

`next.config.js` に以下が必要：

```js
module.exports = {
  output: 'export',
  basePath: '/<repo>',
  images: { unoptimized: true },
};
```

```yaml
name: Deploy Next.js site to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - uses: actions/configure-pages@v5
        with:
          static_site_generator: next
      - run: npm ci
      - run: npm run build
      - run: touch ./out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 5. Vite / Astro / 任意の Node 系 SSG

`vite.config.*` の場合は `base: '/<repo>/'`、Astro は `astro.config.mjs` の `base` を設定。

```yaml
name: Deploy site to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - uses: actions/configure-pages@v5
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist   # Astro は ./dist、ビルド出力に合わせて調整
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## カスタムドメインを使う場合の追記

ビルド成果物ディレクトリに `CNAME` を含める。例（Hugo の場合、`static/CNAME` に書いておけば `public/CNAME` として出力される）。Next.js なら `public/CNAME`、Vite なら `public/CNAME`。

中身は単一行のドメイン名のみ：

```
example.com
```
