# toushishippairoku.com 接続手順（とよくん作業・2ステップ）

## 現状（くー作業 完了）
- ✅ ネームサーバ Cloudflare 委譲済（`ashton.ns / raphaela.ns`）
- ✅ `astro.config.mjs` の site を `https://toushishippairoku.com` に修正
- ✅ `@astrojs/sitemap` 導入＋`sitemap-index.xml` 自動生成
- ✅ `public/robots.txt` のSitemap URLを本ドメインに修正
- ✅ build → deploy 完了（最新版: ee08bd73.toushi-shippai-roku.pages.dev）

## 残り（とよくん作業・3分）

### ステップ1：Pages にカスタムドメイン追加（これだけで DNS 自動設定される）

1. https://dash.cloudflare.com/24c0992b0e69032bc08369a5005a5302/pages/view/toushi-shippai-roku/domains を開く
2. 「Set up a custom domain」もしくは「Add custom domain」
3. `toushishippairoku.com` 入力 → Continue
4. 「Activate domain」クリック
5. （同じ流れで `www.toushishippairoku.com` も追加すると `www` でもアクセス可能）

### ステップ2：接続確認（5〜30分待ち）

- 黄色雲アイコン → SSL発行中
- 緑チェック → 接続完了
- 最終確認：`https://toushishippairoku.com/` にブラウザでアクセス → 投資失敗録トップが出ればOK

---

## 接続完了後にくーがやること（自動）

- [ ] GSC 新規プロパティ追加（既存の `.pages.dev` とは別扱い）
- [ ] Sitemap送信 `https://toushishippairoku.com/sitemap-index.xml`
- [ ] microCMS 側の image URL が `.pages.dev` 残ってないか確認
- [ ] OGP/canonical の URL 更新確認

## 注意
- 旧 `.pages.dev` URL は引き続き生きる（自動廃止されない）
- SEO観点では新ドメインで Sitemap 送信し直すと評価リセットなので、本気で動かす前にやるべき
