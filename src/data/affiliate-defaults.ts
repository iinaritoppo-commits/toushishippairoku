// =============================================================
// アフィリ用デフォルトデータ
// approved/*.json に個別の related_pillars/lessons_triple/affiliate_books
// が無い時に、カテゴリから自動補完する
// =============================================================

export type PillarLink = {
  href: string;
  title: string;
  subtitle?: string;
  icon?: string;
};

export type BookLink = {
  title: string;
  href: string;
  author?: string;
  note?: string;
};

export type ExpertLink = {
  title: string;
  href: string;
  subtitle?: string;
  type?: "lawyer" | "fp" | "counselor" | "other";
};

// =============================================================
// カテゴリ別デフォルト・ピラー記事リンク
// （ピラー記事が完成するまでは Coming Soon URL でもOK）
// =============================================================
export const PILLARS_BY_CATEGORY: Record<string, PillarLink[]> = {
  fx: [
    {
      href: "/compare/fx-no-margin-call/",
      title: "追証なしFX口座 比較",
      subtitle: "強制ロスカット仕様で選ぶ国内FX口座の整理",
      icon: "",
    },
    {
      href: "/explain/loss-cut-mechanism/",
      title: "ロスカットの仕組み",
      subtitle: "「指定レートで切る」と「次の約定可能レートで切る」の違い",
      icon: "",
    },
  ],
  stocks: [
    {
      href: "/compare/net-securities/",
      title: "ネット証券3社の整理",
      subtitle: "SBI・楽天・松井の手数料体系と特徴",
      icon: "",
    },
    {
      href: "/explain/index-vs-active/",
      title: "インデックスとアクティブの違い",
      subtitle: "コストとリターンの長期データ",
      icon: "",
    },
  ],
  crypto: [
    {
      href: "/compare/crypto-exchanges/",
      title: "国内仮想通貨取引所 比較",
      subtitle: "セキュリティ・出金体制・板の厚みで整理",
      icon: "",
    },
    {
      href: "/explain/crypto-scam-patterns/",
      title: "仮想通貨詐欺の典型パターン",
      subtitle: "「内部情報」「上場前」「LINE紹介」の構造",
      icon: "",
    },
  ],
  realestate: [
    {
      href: "/compare/realestate-crowdfunding/",
      title: "不動産クラファン比較",
      subtitle: "少額から始められる不動産投資の整理",
      icon: "",
    },
    {
      href: "/explain/sublease-pitfall/",
      title: "サブリースの2年見直し条項",
      subtitle: "家賃保証が外れる構造的理由",
      icon: "",
    },
  ],
  funds: [
    {
      href: "/compare/roboadvisor/",
      title: "ロボアド比較",
      subtitle: "WealthNavi・THEO・SUSTEN等の手数料と運用方針",
      icon: "",
    },
    {
      href: "/explain/wrap-account-cost/",
      title: "ラップ口座の本当のコスト",
      subtitle: "「おまかせ」の裏で抜かれる費用構造",
      icon: "",
    },
  ],
  fraud: [
    {
      href: "/compare/scam-detection-guide/",
      title: "投資詐欺の見抜き方",
      subtitle: "勧誘文言・出金条件・運営実態の見るべき箇所",
      icon: "",
    },
    {
      href: "/explain/scam-recovery-flow/",
      title: "被害発覚後の対応フロー",
      subtitle: "警察・消費者センター・弁護士の順番",
      icon: "✓",
    },
  ],
  sidejob: [
    {
      href: "/compare/scam-detection-guide/",
      title: "副業詐欺の見抜き方",
      subtitle: "「自動収益」「LINE登録」「初期費用」の典型構造",
      icon: "",
    },
  ],
  other: [
    {
      href: "/compare/scam-detection-guide/",
      title: "投資詐欺の見抜き方",
      subtitle: "勧誘文言・出金条件・運営実態の見るべき箇所",
      icon: "",
    },
  ],
};

// =============================================================
// カテゴリ別デフォルト・書籍アフィリ
// 実URLはAmazon審査通過後にこの定数を更新するだけで全記事反映
// =============================================================
export const BOOKS_BY_CATEGORY: Record<string, BookLink[]> = {
  fx: [
    {
      title: "デイトレード（オリバー・ベレス）",
      author: "オリバー・ベレス／グレッグ・カプラ",
      href: "https://www.amazon.co.jp/dp/4894511630",
      note: "規律・撤退・心理の3軸を学べる定番",
    },
    {
      title: "ゾーン　最終章 トレーダーで成功するためのマーク・ダグラスの教え",
      author: "マーク・ダグラス",
      href: "https://www.amazon.co.jp/dp/4775991884",
      note: "トレード心理の聖典",
    },
  ],
  stocks: [
    {
      title: "敗者のゲーム",
      author: "チャールズ・エリス",
      href: "https://www.amazon.co.jp/dp/4532358884",
      note: "インデックス投資の理論的支柱",
    },
    {
      title: "ウォール街のランダム・ウォーカー",
      author: "バートン・マルキール",
      href: "https://www.amazon.co.jp/dp/4532358817",
      note: "個別株の限界とインデックスの優位性",
    },
  ],
  crypto: [
    {
      title: "ビットコイン・スタンダード",
      author: "セイファディーン・アンモウス",
      href: "https://www.amazon.co.jp/dp/4775942476",
      note: "暗号資産の貨幣論的位置づけ",
    },
    {
      title: "暗号資産の経済学",
      author: "小早川周司",
      href: "https://www.amazon.co.jp/dp/4502428515",
      note: "規制・税制・取引実態の整理",
    },
  ],
  realestate: [
    {
      title: "金持ち父さんの「儲かる」不動産投資（の罠を知る）",
      author: "玉川陽介",
      href: "https://www.amazon.co.jp/dp/4860085639",
      note: "ワンルーム・サブリースの構造",
    },
    {
      title: "金持ち父さん貧乏父さん",
      author: "ロバート・キヨサキ",
      href: "https://www.amazon.co.jp/dp/4480864245",
      note: "資産と負債の定義を見直す原点",
    },
  ],
  funds: [
    {
      title: "ほったらかし投資術",
      author: "山崎元／水瀬ケンイチ",
      href: "https://www.amazon.co.jp/dp/4022950765",
      note: "インデックス積立の実務書",
    },
    {
      title: "投資信託にだまされるな！",
      author: "竹川美奈子",
      href: "https://www.amazon.co.jp/dp/4478017239",
      note: "手数料構造の読み方",
    },
  ],
  fraud: [
    {
      title: "プロスペクト理論／行動経済学",
      author: "ダニエル・カーネマン",
      href: "https://www.amazon.co.jp/dp/4150504113",
      note: "なぜ詐欺に引っかかるかを心理から解く",
    },
    {
      title: "「ありえない」のあとに、必ずある",
      author: "島田秀平",
      href: "https://www.amazon.co.jp/dp/4106109808",
      note: "騙される側の心理の整理",
    },
  ],
  sidejob: [
    {
      title: "副業の正解",
      author: "上田祐輝",
      href: "https://www.amazon.co.jp/dp/4046055375",
      note: "怪しい副業と健全な副業の見分け方",
    },
  ],
  other: [
    {
      title: "敗者のゲーム",
      author: "チャールズ・エリス",
      href: "https://www.amazon.co.jp/dp/4532358884",
      note: "投資判断の出発点",
    },
  ],
};

// =============================================================
// カテゴリ別デフォルト・専門家相談リンク
// 実URLはASP承認後に更新（プレースホルダ #consult-xxx で運用開始可能）
// =============================================================
export const EXPERTS_BY_CATEGORY: Record<string, ExpertLink[]> = {
  fx: [
    {
      title: "ファイナンシャル・プランナー無料相談",
      subtitle: "投資の建て直し方針を整える",
      href: "#consult-fp",
      type: "fp",
    },
  ],
  stocks: [
    {
      title: "ファイナンシャル・プランナー無料相談",
      subtitle: "ポートフォリオの再設計に",
      href: "#consult-fp",
      type: "fp",
    },
  ],
  crypto: [
    {
      title: "詐欺被害の弁護士相談",
      subtitle: "返金可能性・刑事告訴の方針確認",
      href: "#consult-lawyer",
      type: "lawyer",
    },
  ],
  realestate: [
    {
      title: "不動産の中立アドバイザー相談",
      subtitle: "売却・賃貸・保有判断の整理",
      href: "#consult-realestate",
      type: "other",
    },
  ],
  funds: [
    {
      title: "ファイナンシャル・プランナー無料相談",
      subtitle: "投信の入れ替え方針を整える",
      href: "#consult-fp",
      type: "fp",
    },
  ],
  fraud: [
    {
      title: "詐欺被害の弁護士相談",
      subtitle: "返金交渉・刑事告訴の進め方",
      href: "#consult-lawyer",
      type: "lawyer",
    },
    {
      title: "消費者ホットライン 188",
      subtitle: "全国の消費生活センターに繋がる窓口",
      href: "https://www.kokusen.go.jp/map/",
      type: "counselor",
    },
  ],
  sidejob: [
    {
      title: "詐欺被害の弁護士相談",
      subtitle: "情報商材・自動売買ツール被害の相談",
      href: "#consult-lawyer",
      type: "lawyer",
    },
  ],
  other: [
    {
      title: "ファイナンシャル・プランナー無料相談",
      subtitle: "投資全般の見直しに",
      href: "#consult-fp",
      type: "fp",
    },
  ],
};

// =============================================================
// カテゴリ別デフォルト・教訓（reasons）
// approved JSON に lessons_reasons がない時のフォールバック
// =============================================================
export const REASONS_BY_CATEGORY: Record<string, string[]> = {
  fx: [
    "ロスカットは保険であって敵じゃない。動かす方向を間違えると一晩で口座が空になる。",
    "指標発表の前後は流動性が抜けて、設定したロスカット幅を素通りすることがある。",
    "深夜の30分だけのトレードは、判断疲れが乗ったまま画面に向かう時間でもある。",
  ],
  stocks: [
    "ナンピンは「平均取得単価が下がる」のではなく「枚数が増えてリスクが膨らむ」が正体。",
    "業績悪化のニュースは、配当・優待停止に直結する。優待利回りで株価リスクを隠さない。",
    "信用2階建ては撤退の選択肢が消える。現物に戻すルートを最初に決めておく。",
  ],
  crypto: [
    "上昇局面の「次の半値」は来る。逃げる速度は買う速度より遅い、と知っておく。",
    "出金完了するまでは「利益」ではない。取引所のホット枯渇・規制で凍結することがある。",
    "「お前にだけ教える」「上場前」「LINEグループで限定公開」は、ほぼ全部詐欺の入口。",
  ],
  realestate: [
    "表面利回りと実質利回りは別物。空室・修繕・税・金利を引いた手取りで考える。",
    "サブリースは契約2年で見直される。家賃保証は永久じゃない。",
    "出口（売却・賃貸継続・住み替え）まで含めて、初日にシミュレーションを作る。",
  ],
  funds: [
    "信託報酬は複利でリターンを削る。0.5%の差が20年で20%のリターン差になる。",
    "通貨選択型・カバードコール型は、設計を理解せずに買うと2階建てのリスクを背負う。",
    "分配金は「特別分配（元本払い戻し）」の可能性がある。受取額=利益ではない。",
  ],
  fraud: [
    "「お前にだけ」「内部情報」「上場前」「税金が必要」は、典型的な詐欺フレーズ。",
    "送金先が個人口座 or 海外口座なら、ほぼ確実に詐欺。即時被害届の準備に動く。",
    "出金時に追加費用や保証金を要求されたら、その時点で「払うほど深みにハマる」フェーズ。",
  ],
  sidejob: [
    "「自動で月◯万円」「コピペで稼げる」「初期費用◯万円必要」は副業詐欺の3点セット。",
    "本物の副業は時間と労力に対する対価。一気に楽になる仕組みは存在しない。",
    "クーリングオフ期間外の高額情報商材は、購入前に消費者センター（188）に確認。",
  ],
  other: [
    "失敗にはパターンがある。自分だけが特殊なケースだ、と思った時こそ典型例の可能性が高い。",
    "判断が鈍る時間帯・状況・心理状態を、自分で把握しておく。",
    "ひとりで抱え込まない。早めに専門家に話すほうが、結果的に被害は小さい。",
  ],
};

// 取得用ヘルパ
export function pillarsFor(category: string): PillarLink[] {
  return PILLARS_BY_CATEGORY[category] ?? PILLARS_BY_CATEGORY.other;
}
export function booksFor(category: string): BookLink[] {
  return BOOKS_BY_CATEGORY[category] ?? BOOKS_BY_CATEGORY.other;
}
export function expertsFor(category: string): ExpertLink[] {
  return EXPERTS_BY_CATEGORY[category] ?? EXPERTS_BY_CATEGORY.other;
}
export function reasonsFor(category: string): string[] {
  return REASONS_BY_CATEGORY[category] ?? REASONS_BY_CATEGORY.other;
}
