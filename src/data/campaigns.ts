// =============================================================
// キャンペーンDB 単一ソース
//
// ここに書くのは「事実」だけ。開催中 / 終了間近 / 終了 の判定は
// src/lib/campaigns.ts がビルド時の日付から毎回計算する。
// 期限切れは日次ビルドで自動的にアーカイブへ移るため、
// このファイルから削除しないこと（実施履歴として蓄積していく）。
//
// 【掲載ルール】YMYL 領域のため厳守する
//   1. officialUrl（一次情報）で実際に確認できた内容だけを書く
//   2. 確認した日を checkedAt に必ず入れる
//   3. 条件が読み取れなかった項目は空欄にする。推測で埋めない
//   4. 「一番お得」等の順位づけ・断定はデータにもページにも書かない
// =============================================================

export type CampaignCategory = "securities" | "fx" | "crypto" | "cfd";

/** 特典の単位。ポイント特典を現金と混同させないために分ける */
export type AmountUnit = "yen" | "point";

export type Campaign = {
  /** 一意なID。`{companySlug}-{開始年月}-{連番}` を推奨 */
  id: string;
  /** 会社名（正式名称） */
  company: string;
  /** URL に使うスラッグ */
  companySlug: string;
  category: CampaignCategory;
  /** キャンペーン名。公式の表記に合わせる */
  title: string;
  /** 何がもらえるかを一行で */
  summary: string;
  /** 最大受取額。並び替えに使う。金額でもポイントでもない特典なら省略 */
  maxAmount?: number;
  /** maxAmount の単位。省略時は円 */
  amountUnit?: AmountUnit;
  /** 達成条件。公式に書かれている粒度で分解する */
  conditions: string[];
  /** 開始日 YYYY-MM-DD */
  startDate: string;
  /** 終了日 YYYY-MM-DD。「終了日未定」なら null */
  endDate: string | null;
  /** 一次情報の URL。読者が自分で検証できるように必ず載せる */
  officialUrl: string;
  /** 成果報酬リンク。無ければ officialUrl を使う */
  affiliateUrl?: string;
  /** 最終確認日 YYYY-MM-DD */
  checkedAt: string;
  /** 注意点・除外条件など */
  note?: string;
};

export const CATEGORY_LABEL: Record<CampaignCategory, string> = {
  securities: "証券口座",
  fx: "FX口座",
  crypto: "暗号資産",
  cfd: "CFD",
};

// =============================================================
// データ本体
//
// ⚠️ 現在は空。一次情報での裏取りが済んだものから追記する。
//    仕組み側（期限の自動計算・自動アーカイブ）は完成済みのため、
//    ここに 1 件足せばそのまま公開される。
// =============================================================
export const CAMPAIGNS: Campaign[] = [
  {
    id: "dmm-fx-202506-01",
    company: "DMM FX",
    companySlug: "dmm-fx",
    category: "fx",
    title: "DMM FXの新規アカウント登録+お取引で最大50万円キャッシュバック",
    summary:
      "新規にアカウント登録し、その後3か月間の新規取引数量に応じてキャッシュバックを受け取れます。金額は取引量で段階的に決まります。",
    maxAmount: 500000,
    conditions: [
      "2025年6月1日以降にアカウント登録の審査が完了していること",
      "アカウント登録の審査完了日から3か月後の営業日クローズまでに約定した新規取引が対象",
      "新規取引数量のみカウントされ、決済取引はカウントされない",
      "1,000Lot以上2,000Lot未満で10,000円、300,000Lot以上で500,000円という段階制",
      "ミニ通貨ペアは新規取引Lot数量を10分の1として計算する",
      "キャッシュバック付与時にアカウントを解約していると対象外",
    ],
    startDate: "2025-06-01",
    endDate: null,
    officialUrl: "https://fx.dmm.com/campaign/account/",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=3BDQIZ+6C130I+1WP2+69WPU",
    checkedAt: "2026-07-26",
    note: "上限の500,000円には新規取引300,000Lotが必要です。DMM FXは1Lot＝10,000通貨のため、30億通貨を新規で取引する計算になります。段階の下限は1,000Lot（1,000万通貨）で10,000円です。",
  },
  {
    id: "matsui-202402-01",
    company: "松井証券",
    companySlug: "matsui",
    category: "securities",
    title: "NISA応援プログラム",
    summary: "総合口座を開設してクイズに正解すると、松井証券ポイントが最大2,000ポイント受け取れます。",
    maxAmount: 2000,
    amountUnit: "point",
    conditions: [
      "新規で松井証券の総合口座を開設し、クイズに正解すること",
      "総合口座に加えてNISA口座も開設すると特典が上がる",
      "総合口座の開設完了後、翌々月までにNISA口座の開設を完了すること",
      "総合口座開設の翌々月までにクイズに回答すること",
      "クイズの回答は1人1回限り",
    ],
    startDate: "2024-02-01",
    endDate: null,
    officialUrl: "https://www.matsui.co.jp/campaign/detail/nisa-04.html",
    checkedAt: "2026-07-26",
    note: "ポイントの有効期限は付与月の翌々月末です。付与時点で口座を解約していると対象外になります。ポイントは課税対象です。",
  },
  {
    id: "gaitame-202412-01",
    company: "外為どっとコム",
    companySlug: "gaitame",
    category: "fx",
    title: "『外貨ネクストネオ』口座開設キャッシュバックキャンペーン",
    summary:
      "口座開設月から翌月末までの新規取引量に応じてキャッシュバックを受け取れます。金額は取引量で段階的に決まります。",
    maxAmount: 1000000,
    conditions: [
      "『外貨ネクストネオ』口座を新規開設すること",
      "エントリーが必要",
      "対象期間は口座開設月から翌月末まで",
      "新規注文の取引量に応じた段階制。10万通貨以上100万通貨未満で1,000円、100,000万通貨以上で1,000,000円",
      "『らくらくFX積立』で1回以上の定期買付をすると1,000FXポイント（1,000円相当）が加算される",
      "『CFDネクスト』で1回以上の新規注文をすると現金1,000円が加算される",
    ],
    startDate: "2024-12-01",
    endDate: null,
    officialUrl: "https://www.gaitame.com/campaign/nextneo/",
    checkedAt: "2026-07-26",
    note: "上限の1,000,000円には100,000万通貨（10億通貨）の新規取引が必要です。段階の下限は10万通貨で1,000円です。",
  },
  {
    id: "gaitame-202606-01",
    company: "外為どっとコム",
    companySlug: "gaitame",
    category: "fx",
    title: "取引数量・入金額に応じて最大300万円！大還元キャッシュバックキャンペーン",
    summary:
      "対象21通貨ペアの新規取引数量に応じたキャッシュバックが、期間中の入金額に応じて増額されます。",
    maxAmount: 3000000,
    conditions: [
      "対象期間中にエントリーすること",
      "対象期間中の入金額（純増額）が50万円以上であること",
      "『外貨ネクストネオ』の対象21通貨ペアの新規取引数量に応じて最大100万円",
      "入金額に応じて増額され、上限は300万円まで拡大する",
      "グループごとの新規取引数量の合計が1万通貨の倍数に達するたびに所定額が進呈される",
    ],
    startDate: "2026-06-29",
    endDate: "2026-08-01",
    officialUrl: "https://www.gaitame.com/campaign/cb-2607/",
    checkedAt: "2026-07-26",
    note: "対象になるには期間中の入金額（純増額）50万円以上が必要です。受付は2026年8月1日午前5時55分までです。",
  },
  {
    id: "gaitame-202606-02",
    company: "外為どっとコム",
    companySlug: "gaitame",
    category: "cfd",
    title: "CFD口座開設＆お取引1回でもれなく3,000円プレゼント！",
    summary: "『CFDネクスト』口座を開設して1回取引すると、条件を満たした人全員が現金3,000円を受け取れます。",
    maxAmount: 3000,
    conditions: [
      "『CFDネクスト』口座を開設すること（既存顧客の追加開設も対象）",
      "対象期間中に新規取引を1回行うこと。銘柄・取引チャネル・入金額は問わない",
      "エントリーが必要（1人につき1回のみ有効）",
    ],
    startDate: "2026-06-29",
    endDate: "2026-08-01",
    officialUrl: "https://www.gaitame.com/campaign/cfd260629/",
    checkedAt: "2026-07-26",
    note: "抽選ではなく、条件を満たした人全員が対象です。受付は2026年8月1日午前5時30分まで。特典は2026年8月末までにマイページへ入金されます。",
  },
  {
    id: "monex-202606-01",
    company: "マネックス証券",
    companySlug: "monex",
    category: "securities",
    title: "信用取引口座開設で抽選で100名様に2,000円プレゼント",
    summary: "信用取引口座を開設してエントリーすると、抽選で100名に現金2,000円が当たります。",
    maxAmount: 2000,
    conditions: [
      "期間中に信用取引口座（スタート信用を含む）を開設すること",
      "エントリーが必要",
      "対象者の中から抽選で100名",
    ],
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    officialUrl: "https://info.monex.co.jp/news/2026/20260529_01.html",
    checkedAt: "2026-07-26",
    note: "全員が受け取れるものではなく、抽選です。信用取引は元本を超える損失が出る取引です。",
  },
  {
    id: "monex-202605-01",
    company: "マネックス証券",
    companySlug: "monex",
    category: "securities",
    title: "【値動きを気にせずコツコツ投資】米国株積立デビューで200ポイントプレゼント",
    summary: "期間中に米国株積立を設定し、初めて買付が約定した人全員にマネックスポイントが200ポイント付きます。",
    maxAmount: 200,
    amountUnit: "point",
    conditions: [
      "期間中に米国株積立を設定すること",
      "初めての買付が約定していること",
      "エントリーが必要",
      "dアカウント連携をしている場合はdポイントへ自動交換される",
    ],
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    officialUrl: "https://info.monex.co.jp/news/2026/20260501_03.html",
    checkedAt: "2026-07-26",
  },
  {
    id: "monex-202510-01",
    company: "マネックス証券",
    companySlug: "monex",
    category: "securities",
    title: "毎月抽選で1万円が当たる！NISAつみたてわくわくプログラム",
    summary: "NISA口座で月3万円以上の投信積立を行うと、毎月の抽選で500名に現金1万円が当たります。",
    maxAmount: 10000,
    conditions: [
      "NISA口座で投資信託の積立を月間合計3万円以上行うこと",
      "エントリーが必要",
      "条件達成者の中から毎月抽選で500名",
      "NISA口座での日本株現物買付・米国株現物買付などを行うと当選確率が上がり、すべての対象取引で最大5倍になる",
    ],
    startDate: "2025-10-01",
    endDate: "2026-09-30",
    officialUrl: "https://info.monex.co.jp/news/2025/20251001_04.html",
    checkedAt: "2026-07-26",
    note: "全員が受け取れるものではなく、抽選です。",
  },
  {
    id: "monex-202412-01",
    company: "マネックス証券",
    companySlug: "monex",
    category: "securities",
    title: "【最大2,000pt】新規口座開設＆NISAデビュープログラム",
    summary: "クイズに正解し、新規口座開設などを行うとdポイントが最大2,000ポイント受け取れます。",
    maxAmount: 2000,
    amountUnit: "point",
    conditions: ["クイズに正解すること", "新規口座開設等を行うこと", "エントリーが必要"],
    startDate: "2024-12-01",
    endDate: null,
    officialUrl: "https://info.monex.co.jp/news/2024/20241129_02.html",
    checkedAt: "2026-07-26",
  },
  {
    id: "minna-fx-202606-01",
    company: "みんなのFX",
    companySlug: "minna-fx",
    category: "fx",
    title: "新規口座開設プログラム（最大100万円キャッシュバック）",
    summary:
      "新規口座開設後の取引量と初回入金額に応じてキャッシュバックが段階的に決まります。取引量のみの達成でも200円から受け取れます。",
    maxAmount: 1000000,
    conditions: [
      "2026年6月1日以降に新規口座開設が完了していること",
      "プログラムへのエントリーが必要（エントリー期限は口座開設月の翌々月末の最終営業日マーケットクローズまで）",
      "取引量はFX口座とシストレ口座の新規注文分を合算（シストレ口座は2倍として換算）",
      "取引量のみの達成で200円（15Lot以上30Lot未満）〜900,000円（200,000Lot以上）の段階制",
      "初回入金額（30万円以上〜300万円以上）に応じた上乗せがあり、取引量と合わせて最大999,000円",
      "特典1として、口座開設日から14日後の営業日マーケットクローズまでに初回入金30万円以上＋0.1Lot以上の新規取引で1,000円",
      "対象者抽出時・付与時に証拠金残高の合計が0円を超えていること",
    ],
    startDate: "2026-06-01",
    endDate: null,
    officialUrl: "https://min-fx.jp/campaign/program/newopen202606/",
    checkedAt: "2026-07-27",
    note: "上限の999,000円には初回入金300万円以上＋新規取引200,000Lot以上（1Lot＝1万通貨のため20億通貨）が必要です。過去に口座を保有したことがある場合は対象外です。キャッシュバックは一時所得の扱いです。",
  },
  {
    id: "light-fx-202606-01",
    company: "LIGHT FX",
    companySlug: "light-fx",
    category: "fx",
    title: "新規口座開設プログラム（最大100万円キャッシュバック）",
    summary:
      "みんなのFXと同じトレイダーズ証券が運営するLIGHT FXの口座開設プログラムです。取引量と初回入金額に応じた段階制で、条件表も同一です。",
    maxAmount: 1000000,
    conditions: [
      "2026年6月1日以降に新規口座開設が完了していること",
      "プログラムへのエントリーが必要（エントリー期限は口座開設月の翌々月末の最終営業日マーケットクローズまで）",
      "取引量のみの達成で200円(15Lot以上30Lot未満)〜900,000円（200,000Lot以上）の段階制",
      "初回入金額（30万円以上〜300万円以上）に応じた上乗せがあり、取引量と合わせて最大999,000円",
      "特典1として、口座開設日から14日後の営業日マーケットクローズまでに初回入金30万円以上＋0.1Lot以上の新規取引で1,000円",
      "初回入金は1回での入金のみ対象（分割入金は対象外）",
    ],
    startDate: "2026-06-01",
    endDate: null,
    officialUrl: "https://lightfx.jp/campaign/program/newopen202606/",
    checkedAt: "2026-07-27",
    note: "みんなのFXとLIGHT FXは運営会社が同じですが、別々の口座です。過去にLIGHT FX口座を保有したことがある場合は対象外です。上限の999,000円には初回入金300万円以上＋新規取引200,000Lot以上が必要です。",
  },
  {
    id: "gmo-click-202408-01",
    company: "GMOクリック証券",
    companySlug: "gmo-click",
    category: "fx",
    title: "はじめてのFX口座開設とお取引で最大100万円キャッシュバック!!",
    summary:
      "FXネオの新規口座開設後、対象期間内の新規建て取引数量に応じてキャッシュバックが受け取れます。最低ラインは10万通貨の取引で100円です。",
    maxAmount: 1000000,
    conditions: [
      "FXネオ口座を新規開設すること（2024年8月1日以降の口座開設が対象）",
      "対象期間内の新規建て取引の数量で金額が決まる段階制",
      "10万通貨以上30万通貨未満で100円、500万通貨以上1,000万通貨未満で5,000円という段階",
      "上限の100万円には400,000万通貨（40億通貨）以上の新規建て取引が必要",
      "くりっく365での取引は対象外",
      "ポイントサイト経由の申込みは対象外",
    ],
    startDate: "2024-08-01",
    endDate: null,
    officialUrl: "https://www.click-sec.com/corp/campaign/fx_1906/",
    checkedAt: "2026-07-27",
    note: "過去にGMOクリック証券の口座を開設したことがある場合や、キャッシュバック付与時に口座を解約している場合は対象外です。",
  },
  {
    id: "coincheck-202607-01",
    company: "コインチェック",
    companySlug: "coincheck",
    category: "crypto",
    title: "夏のボーナスを賢くつみたて！最大2,000円相当のイーサリアムをプレゼント",
    summary:
      "キャンペーンにエントリーの上、Coincheckつみたてを新規に申し込み、3か月継続して買付を行うと、初回つみたて設定額の10%相当（最大2,000円）のイーサリアムが受け取れます。",
    maxAmount: 2000,
    conditions: [
      "キャンペーンページからのエントリーが必要",
      "期間中に「Coincheckつみたて」を新規に申し込むこと（またはつみたてプラン設定済みで未設定だった口座振替設定を完了すること）",
      "2026年9月7日から3か月間、BTCまたはETHの買付を継続すること",
      "初回つみたて設定金額はBTCとETHの合算で判定",
      "特典の付与は2026年11月下旬ごろの予定",
    ],
    startDate: "2026-07-24",
    endDate: "2026-08-14",
    officialUrl: "https://coincheck.com/ja/cp_lp/tsumitate202607",
    checkedAt: "2026-07-27",
    note: "以前Coincheckつみたてを利用していて期間中に再開した場合は対象外です。ETHの付与レートは付与時のレートで計算されます。",
  },
];

/** 会社名の逆引き（会社別ページのタイトル用） */
export function companyNameOf(slug: string): string {
  return CAMPAIGNS.find((c) => c.companySlug === slug)?.company ?? slug;
}
