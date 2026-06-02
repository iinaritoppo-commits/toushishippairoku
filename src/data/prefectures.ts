// 都道府県別 掲載件数・損失額（仮データ。後でarticles.tsから自動集計）
// id は build_japan_svg.py の都道府県ID（1=北海道 〜 47=沖縄）

export type PrefectureStats = {
  id: number;
  name: string;
  slug: string;         // /prefecture/<slug>/ 用
  cases: number;
  amount: string;       // 表示用
  amountValue: number;  // 集計用（万円）
  badgeCx: number;      // 件数バッジのX座標
  badgeCy: number;      // 件数バッジのY座標
};

// 第1弾10記事の都道府県分布（投稿者の居住地）
// badge座標は新viewBox 700x640 基準で再キャリブレート
export const prefectureStats: PrefectureStats[] = [
  { id: 13, name: "東京",   slug: "tokyo",     cases: 3, amount: "¥868万", amountValue: 868, badgeCx: 432, badgeCy: 358 },
  { id: 12, name: "千葉",   slug: "chiba",     cases: 1, amount: "¥620万", amountValue: 620, badgeCx: 458, badgeCy: 380 },
  { id: 1,  name: "北海道", slug: "hokkaido",  cases: 1, amount: "¥480万", amountValue: 480, badgeCx: 480, badgeCy: 105 },
  { id: 23, name: "愛知",   slug: "aichi",     cases: 1, amount: "¥320万", amountValue: 320, badgeCx: 332, badgeCy: 388 },
  { id: 11, name: "埼玉",   slug: "saitama",   cases: 1, amount: "¥280万", amountValue: 280, badgeCx: 425, badgeCy: 342 },
  { id: 27, name: "大阪",   slug: "osaka",     cases: 1, amount: "¥210万", amountValue: 210, badgeCx: 258, badgeCy: 422 },
  { id: 40, name: "福岡",   slug: "fukuoka",   cases: 1, amount: "¥148万", amountValue: 148, badgeCx: 88,  badgeCy: 478 },
  { id: 14, name: "神奈川", slug: "kanagawa",  cases: 1, amount: "¥18万",  amountValue: 18,  badgeCx: 415, badgeCy: 388 },
];

// 都道府県の件数を id で引けるmap
export const casesByPrefId = new Map<number, PrefectureStats>(
  prefectureStats.map((p) => [p.id, p])
);

// 件数→色クラス（JapanMap.astroで使用）
export function colorClassByCount(c: number): string {
  if (c >= 30) return "pref-c5";
  if (c >= 15) return "pref-c3";
  if (c >= 5)  return "pref-c2";
  if (c >= 1)  return "pref-c1";
  return "pref-c0";
}

// TOP5 都道府県（損失額ランキング）─ 表示用（順位順）
export const topPrefectures = [
  { rank: 1, id: 13, slug: "tokyo",    name: "東京都", cases: 3, breakdown: "FX / 詐欺 / 優待株", total: "¥868万" },
  { rank: 2, id: 12, slug: "chiba",    name: "千葉県", cases: 1, breakdown: "不動産 1件",        total: "¥620万" },
  { rank: 3, id: 1,  slug: "hokkaido", name: "北海道", cases: 1, breakdown: "仮想通貨 1件",      total: "¥480万" },
  { rank: 4, id: 23, slug: "aichi",    name: "愛知県", cases: 1, breakdown: "仮想通貨 1件",      total: "¥320万" },
  { rank: 5, id: 11, slug: "saitama",  name: "埼玉県", cases: 1, breakdown: "株式 1件",          total: "¥280万" },
];
