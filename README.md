# 神山まるごと高専 紹介サイト

神山まるごと高専を紹介する、4ページ構成の静的サイトです。
素の HTML/CSS/JavaScript で実装し、GitHub Pages での配信を前提にしています。

## ページ構成

- `index.html`: トップページ（ヒーロー、概要カード、導線）
- `about.html`: 学校概要、教育の特徴、5年間の学び
- `campus.html`: キャンパス・全寮制紹介（プレースホルダー画像）
- `access.html`: 所在地、地図、外部リンク

## 公開 URL

- `https://kmc2318.github.io/ghcp-school-intro-260422/`

## ローカル確認手順

1. リポジトリ直下に移動
2. 次のコマンドを実行

```bash
python3 -m http.server 8000
```

3. ブラウザで `http://localhost:8000/` を開く

## 補足

- GitHub Pages 用に `.nojekyll` を配置済み
- 内部リンクとアセット参照は相対パスで記述