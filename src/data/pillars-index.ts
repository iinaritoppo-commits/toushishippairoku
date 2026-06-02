// =============================================================
// ピラー・解説記事のインデックス
// ハブページ（/compare/, /explain/）から参照される
// 新規ピラー追加時はここに1行追加するだけで反映される
// =============================================================

export type PillarMeta = {
  href: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  updatedAt: string;
  badge?: string;
  accent?: "navy" | "loss" | "gold";
};

export const PILLARS: PillarMeta[] = [
  {
    href: "/compare/fx-no-margin-call/",
    title: "追証なしFX口座 比較2026 ─ 強制ロスカット仕様で選ぶ国内FX 5社の整理",
    shortTitle: "追証なしFX口座 比較2026",
    category: "FX 口座比較",
    description:
      "FXで「追証」が発生する仕組みを整理しつつ、ロスカット余裕度・最低取引単位・スプレッドで国内FX口座5社を観察。実際にロスカットが間に合わずに追証発生した失敗体験から学ぶ口座選びの観点。",
    updatedAt: "2026-05-25",
    accent: "navy",
  },
  {
    href: "/compare/asset-expo-warning/",
    title: "【2026最新】資産運用EXPOに初心者が行ったらヤバい本当の理由 ─ Xトレンド分析＋構造解説",
    shortTitle: "資産運用EXPOに行ったらヤバい理由",
    category: "投資詐欺 / 警鐘",
    description:
      "2026年5月の資産運用EXPOがXでトレンド入り。X上に集まった来場者の証言と、編集者が運営構造から逆算で組み立てた「なぜ毎回ぼったくり化するのか」の答えを1記事で整理。",
    updatedAt: "2026-05-25",
    badge: "炎上中",
    accent: "loss",
  },
  {
    href: "/compare/net-securities/",
    title: "ネット証券3社の整理2026 ─ SBI・楽天・松井を「新NISA・米国株・サポート」で並べる",
    shortTitle: "ネット証券3社の整理2026",
    category: "株式・投信 / 比較",
    description:
      "新NISAをこれから始める人向けに、SBI・楽天・松井の3社を「投信本数・国内株手数料・米国株・クレカ積立・サポート」で観察整理。EXPO行く前に家で30分で完結する代替案。",
    updatedAt: "2026-05-25",
    accent: "gold",
  },
  {
    href: "/compare/realestate-crowdfunding/",
    title: "不動産クラウドファンディング比較2026 ─ 1万円から始める少額不動産投資5社の整理",
    shortTitle: "不動産クラファン比較2026",
    category: "不動産 / 比較",
    description:
      "ワンルーム投資の代替案として、不動産クラファン主要5社を「最低投資額・想定利回り・運用期間・優先劣後・運営会社実績」で観察整理。ワンルームで1820万円失う前に、まず1万円で仕組みを試す道筋。",
    updatedAt: "2026-05-25",
    accent: "gold",
  },
];

export const EXPLAINS: PillarMeta[] = [
  {
    href: "/explain/retirement-money-pitfalls/",
    title: "退職金運用で絶対に避けるべき9つの落とし穴｜実例から学ぶ判断軸（2026年版）",
    shortTitle: "退職金運用の落とし穴 完全版",
    category: "退職金 / 解説",
    description:
      "ファンドラップ・毎月分配型・ワンルーム不動産・AIテーマ型・FX自動売買・暗号資産・サブリース・海外バイナリー・MLM。本サイトに集まった9つの典型パターンを実損失額と気付いた瞬間で整理。判断フレーム5つとFAQ完備。",
    updatedAt: "2026-06-02",
    badge: "NEW",
    accent: "loss",
  },
  {
    href: "/explain/scam-detection-guide/",
    title: "投資詐欺の見抜き方 完全版 ─ 勧誘文言・出金条件・運営実態の3軸で識別する",
    shortTitle: "投資詐欺の見抜き方 完全版",
    category: "投資詐欺 / 解説",
    description:
      "投資詐欺の典型パターンを「勧誘文言・出金条件・運営実態」の3軸で整理。本サイトに集まった被害体験から共通項を抽出し、被害発覚後の対応フロー、弁護士相談の選び方まで一通り。",
    updatedAt: "2026-05-25",
    accent: "loss",
  },
  {
    href: "/explain/loss-cut-mechanism/",
    title: "ロスカットの仕組み ─ 「指定レートで切る」と「次の約定可能レートで切る」の違い",
    shortTitle: "ロスカットの仕組み",
    category: "FX / 解説",
    description:
      "FXのロスカットが本当に効くかどうかは、設定レートで切る仕様か、次の約定可能レートで切る仕様かで決まる。スリッページの発生メカニズムと、口座選びで見るべき箇所を整理。",
    updatedAt: "2026-05-25",
    accent: "navy",
  },
  {
    href: "/explain/sublease-pitfall/",
    title: "サブリースの2年見直し条項 ─ 「家賃保証」が外れる構造的理由",
    shortTitle: "サブリースの2年見直し条項",
    category: "不動産 / 解説",
    description:
      "サブリース契約の家賃保証は永久じゃない。法律と契約条項に組み込まれた「2年見直し」の仕組みと、保証家賃が下げられる典型タイミングを整理。",
    updatedAt: "2026-05-25",
    accent: "navy",
  },
  {
    href: "/explain/crypto-scam-patterns/",
    title: "仮想通貨詐欺の典型パターン ─ 「内部情報」「上場前」「LINE紹介」の構造",
    shortTitle: "仮想通貨詐欺の典型パターン",
    category: "仮想通貨 / 解説",
    description:
      "仮想通貨詐欺は、入口・滞留・回収の3フェーズで設計されている。本サイトに集まった被害体験から共通する典型パターンを整理。",
    updatedAt: "2026-05-25",
    accent: "loss",
  },
  {
    href: "/explain/fx-shippai-patterns/",
    title: "FXで退場した人の7パターン ─ 取材で見えた共通点と回避ポイント",
    shortTitle: "FXで退場した人の7パターン",
    category: "FX / 解説",
    description:
      "FXで退場した投稿者の話を編集者が取材して見えた7つの共通パターン。レバレッジ・損切り遅れ・スワップ依存・両建て・指標時のフルポジ・残高見ない期間・家族に黙る。退場直前のサインを実例から整理。",
    updatedAt: "2026-05-26",
    accent: "loss",
  },
  {
    href: "/explain/nisa-fukumison-patterns/",
    title: "新NISAで含み損になった人の失敗パターン ─ 取材で見えた7つの共通点",
    shortTitle: "新NISA 含み損 失敗パターン",
    category: "投信・NISA / 解説",
    description:
      "新NISAで含み損を抱えた投稿者の話を編集者が取材して見えた7つの共通パターン。S&P500偏重・米国株信仰・FIRE便乗・短期売買・高配当株信仰・ロボアド任せ・SNSインフルエンサー追従。新NISA時代の失敗構造を実例から整理。",
    updatedAt: "2026-05-27",
    accent: "loss",
  },
  {
    href: "/explain/fx-jido-baibai-sagi/",
    title: "FX自動売買ツール詐欺の被害パターン ─ EA・コピートレード・MAMの実例7類型",
    shortTitle: "FX自動売買ツール詐欺 7類型",
    category: "FX・投資詐欺 / 解説",
    description:
      "FX自動売買ツール（EA・コピートレード・MAM）で被害に遭った投稿者の話を編集者が取材して見えた7つの典型パターン。バックテスト改ざん・成功口座だけ見せる・無料モニター→有料・出金停止・運営者逃走・LINE勧誘・AI便乗広告。2024年以降急増する自動売買詐欺の構造を実例から整理。",
    updatedAt: "2026-05-28",
    accent: "loss",
  },
];

// =============================================================
// カテゴリ別ラベル（ヘッダーナビ・記事カード等で使う）
// =============================================================
export const CATEGORY_LABELS: Record<string, string> = {
  fx: "FX",
  stocks: "株式",
  crypto: "暗号資産",
  realestate: "不動産",
  funds: "ファンド・投信",
  fraud: "投資詐欺",
  sidejob: "副業 / その他",
  other: "その他",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  fx: "通貨ペア・レバレッジ・指標発表で起きたFX関連の失敗体験。ロスカット仕様と現実のズレが大きな共通項。退場・含み損固定・追証・スワップ被害の実話を編集者が本人取材してアーカイブ。",
  stocks: "個別株・優待・ナンピン・信用取引で起きた失敗体験。サンクコスト効果と相場心理が交差する記録。塩漬けから抜けられなかった人、利確を遅らせた人、信用取引で退場した人の声を本人取材して残す。",
  crypto: "ビットコイン・アルトコイン・未上場トークンで起きた失敗体験。バブルとバブル後の塩漬けが多くを占める。億り人を狙って失った人、レンディング被害、海外取引所の出金停止トラブルの実話を編集者が記録。",
  realestate: "ワンルームマンション・サブリース・海外不動産で起きた失敗体験。表面利回りと実質利回りの差が共通の落とし穴。空室・修繕費・税制変更で計算が崩れた実例を、被害者本人から聞いて編集してアーカイブ。",
  funds: "投信・ファンドラップ・ロボアドで起きた失敗体験。複利で効く手数料が「目に見えない損失」を作る構造。塩漬け投信、目論見書の罠、運用報告書の読み違い、退職金一括投資の実話を編集して残す。",
  fraud: "投資詐欺・ロマンス詐欺・情報商材で起きた失敗体験。共通する勧誘文言と出金条件のサインを整理。被害者本人から聞いた手口、気づいた瞬間、弁護士相談までを編集者が記録してアーカイブ。",
  sidejob: "副業詐欺・自動売買ツール・マルチで起きた失敗体験。「楽して稼げる」の裏側を記録。コピペ商材、AIブーム便乗詐欺、海外案件被害、コーチング高額化の実話を本人取材で編集してアーカイブ。",
  other: "上記カテゴリに該当しない投資失敗体験。CFD・先物・競馬投資・ポンジスキーム・FXコピートレードなど周辺領域の実話。投稿フォームから届いた中で、新ジャンル枠として編集者が記録している実例集。",
};
