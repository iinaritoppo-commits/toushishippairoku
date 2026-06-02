# 投資失敗録 デプロイ手順書

最終更新：2026-05-09 ／ 編集：白川 諒

---

## 全体ロードマップ

```
[1] ドメイン取得（Cloudflare）
       ↓
[2] GitHubリポジトリ作成・push
       ↓
[3] Cloudflare Pages 接続
       ↓
[4] 独自ドメイン接続
       ↓
[5] 公開後：GA4 + Search Console 設定
       ↓
[6] AdSense 申請（記事30本到達後）
```

合計所要時間：**初回 1.5時間** ／ 以降は git push で自動デプロイ。

---

## [1] ドメイン取得（Cloudflare Registrar）

1. https://dash.cloudflare.com/ にログイン
2. 左メニュー「ドメイン登録」→「ドメイン登録」
3. **`toushi-shippai-roku.com`** を検索（仮）
   - .com が取れない場合は .jp / .net も検討
   - 年間 $10〜15 程度
4. 購入手続き完了 → 数分でアクティブ化

**※既に取得済みの場合**：DNS が Cloudflare に向いていることだけ確認。

---

## [2] GitHubリポジトリ作成・push

```bash
cd /Users/toppo/マイファイル/投資失敗録

# 既に git 初期化済みでなければ
git init
git add .
git commit -m "Initial: 投資失敗録 v1 リリース準備"

# GitHub で空リポジトリ "toushi-shippai-roku" を作成しておく
git remote add origin https://github.com/<your-account>/toushi-shippai-roku.git
git branch -M main
git push -u origin main
```

**ここで `.env` がコミットされていないことを確認**（.gitignore で除外済み）。

---

## [3] Cloudflare Pages で接続

1. Cloudflare Dashboard → 「Workers & Pages」→「Create」→「Pages」
2. 「Connect to Git」→ GitHub 連携 → `toushi-shippai-roku` 選択
3. **Build settings**：
   - **Project name**: `toushi-shippai-roku`
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
4. **Environment variables**（後ほど microCMS 連携時に追加）：
   - `MICROCMS_SERVICE_DOMAIN` = `toushishippairoku`
   - `MICROCMS_API_KEY` = （microCMS で発行した API キー）
5. 「Save and Deploy」→ 初回ビルド開始
6. 1〜2分で `https://toushi-shippai-roku.pages.dev` でアクセス可能に

---

## [4] 独自ドメイン接続

1. Cloudflare Pages の対象プロジェクト → 「Custom domains」
2. 「Set up a custom domain」→ `toushi-shippai-roku.com` を入力
3. 自動で DNS の CNAME 設定が追加される
4. 数分〜数時間で SSL 証明書が発行されて有効化
5. https://toushi-shippai-roku.com/ でサイトが表示される

---

## [5] 公開後の必須設定

### 5-1. Google Analytics 4

1. https://analytics.google.com/ にログイン
2. プロパティ作成 → 「投資失敗録」
3. データストリーム → ウェブ → URL `https://toushi-shippai-roku.com`
4. 測定ID（G-XXXXXXXX）を取得
5. `src/components/SEO.astro` または BaseLayout.astro に GA4 タグを追加：

```html
<!-- BaseLayout.astro <head> に追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

### 5-2. Google Search Console

1. https://search.google.com/search-console にログイン
2. プロパティ追加 → ドメイン → `toushi-shippai-roku.com`
3. DNS 確認（Cloudflare で TXT レコード追加）
4. 確認完了 → サイトマップ送信
   - サイトマップ URL：`https://toushi-shippai-roku.com/sitemap.xml`

### 5-3. アフィリエイト・ASP 申請（オプション）

公開直後（記事10本以上）から申請可能：
- A8.net：即日承認
- もしもアフィリエイト：即日承認
- バリューコマース：1〜2営業日

AdSense は記事30本＋運営期間1ヶ月超で申請推奨。

---

## [6] OGP 画像の生成・配置

公開時には OGP 画像が必要。スクリプト1発で全件生成：

```bash
cd /Users/toppo/マイファイル/投資失敗録
python3 scripts/gen-ogp.py
```

出力先：
- `/public/ogp/<slug>.png` ← 各記事用
- `/public/og-default.png` ← トップページ用

`SEO.astro` で各ページが該当 OGP を参照する設定済み。

---

## 7. 自走運営（Phase D）

公開後、毎日21時に1記事公開する自走サイクル：

```bash
# cron 例（毎日21時）
0 21 * * * cd /Users/toppo/マイファイル/投資失敗録 && python3 scripts/auto-publish.py >> logs/publish.log 2>&1
```

`scripts/auto-publish.py` の中身は雛型実装済み（要 microCMS API 連携で完成）。

---

## トラブルシューティング

### Cloudflare ビルドが Node バージョンエラーになる

`.nvmrc` または環境変数で Node 22 を指定：
- Pages 設定 → Environment variables → `NODE_VERSION` = `22`

### 「微小な日本語フォントが崩れる」OGP 表示

`scripts/gen-ogp.py` の FONT_CANDIDATES に環境のフォントを追加。
ローカル macOS なら問題なし、Cloudflare ビルド環境で生成する場合は別途フォント配置が必要。

### deploy 後に CSS/SVG が読み込まれない

`astro.config.mjs` の `site` URL が `https://toushi-shippai-roku.com` になっているか確認。

---

## 公開後30日プラン

| Day | やること |
|---|---|
| 0 | 公開・SNS告知（X固定ツイート） |
| 1〜3 | サイトマップ送信・GSC でインデックス確認 |
| 7 | 各記事の検索表示状況をGSCで確認 |
| 14 | A8.net・もしもアフィリ申請 |
| 21 | アクセス解析でPV / 直帰率チェック |
| 30 | AdSense申請（記事30本到達後） |
