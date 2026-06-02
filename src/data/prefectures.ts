// 都道府県別 静的マスタ（id/name/slug/badge座標）
// id は build_japan_svg.py の都道府県ID（1=北海道 〜 47=沖縄）
// badge座標はSVG path bbox中心でclient-side自動補正される（仮値）

export type PrefectureStats = {
  id: number;
  name: string;
  slug: string;
  cases: number;
  amount: string;
  amountValue: number;
  badgeCx: number;
  badgeCy: number;
};

export const prefectureStats: PrefectureStats[] = [
  { id:  1, name: "北海道", slug: "hokkaido", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 480, badgeCy: 105 },
  { id:  2, name: "青森県", slug: "aomori", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 490, badgeCy: 165 },
  { id:  3, name: "岩手県", slug: "iwate", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 520, badgeCy: 200 },
  { id:  4, name: "宮城県", slug: "miyagi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 510, badgeCy: 240 },
  { id:  5, name: "秋田県", slug: "akita", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 480, badgeCy: 215 },
  { id:  6, name: "山形県", slug: "yamagata", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 475, badgeCy: 250 },
  { id:  7, name: "福島県", slug: "fukushima", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 490, badgeCy: 285 },
  { id:  8, name: "茨城県", slug: "ibaraki", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 460, badgeCy: 330 },
  { id:  9, name: "栃木県", slug: "tochigi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 430, badgeCy: 320 },
  { id: 10, name: "群馬県", slug: "gunma", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 410, badgeCy: 330 },
  { id: 11, name: "埼玉県", slug: "saitama", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 425, badgeCy: 342 },
  { id: 12, name: "千葉県", slug: "chiba", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 458, badgeCy: 380 },
  { id: 13, name: "東京都", slug: "tokyo", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 432, badgeCy: 358 },
  { id: 14, name: "神奈川県", slug: "kanagawa", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 415, badgeCy: 388 },
  { id: 15, name: "新潟県", slug: "niigata", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 400, badgeCy: 280 },
  { id: 16, name: "富山県", slug: "toyama", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 365, badgeCy: 320 },
  { id: 17, name: "石川県", slug: "ishikawa", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 340, badgeCy: 320 },
  { id: 18, name: "福井県", slug: "fukui", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 320, badgeCy: 360 },
  { id: 19, name: "山梨県", slug: "yamanashi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 395, badgeCy: 390 },
  { id: 20, name: "長野県", slug: "nagano", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 380, badgeCy: 350 },
  { id: 21, name: "岐阜県", slug: "gifu", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 345, badgeCy: 380 },
  { id: 22, name: "静岡県", slug: "shizuoka", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 380, badgeCy: 410 },
  { id: 23, name: "愛知県", slug: "aichi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 332, badgeCy: 388 },
  { id: 24, name: "三重県", slug: "mie", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 320, badgeCy: 410 },
  { id: 25, name: "滋賀県", slug: "shiga", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 290, badgeCy: 400 },
  { id: 26, name: "京都府", slug: "kyoto", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 270, badgeCy: 410 },
  { id: 27, name: "大阪府", slug: "osaka", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 258, badgeCy: 422 },
  { id: 28, name: "兵庫県", slug: "hyogo", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 235, badgeCy: 415 },
  { id: 29, name: "奈良県", slug: "nara", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 265, badgeCy: 435 },
  { id: 30, name: "和歌山県", slug: "wakayama", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 250, badgeCy: 455 },
  { id: 31, name: "鳥取県", slug: "tottori", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 200, badgeCy: 420 },
  { id: 32, name: "島根県", slug: "shimane", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 170, badgeCy: 425 },
  { id: 33, name: "岡山県", slug: "okayama", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 195, badgeCy: 445 },
  { id: 34, name: "広島県", slug: "hiroshima", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 165, badgeCy: 450 },
  { id: 35, name: "山口県", slug: "yamaguchi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 125, badgeCy: 460 },
  { id: 36, name: "徳島県", slug: "tokushima", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 215, badgeCy: 475 },
  { id: 37, name: "香川県", slug: "kagawa", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 200, badgeCy: 460 },
  { id: 38, name: "愛媛県", slug: "ehime", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 170, badgeCy: 480 },
  { id: 39, name: "高知県", slug: "kochi", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 195, badgeCy: 500 },
  { id: 40, name: "福岡県", slug: "fukuoka", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 88, badgeCy: 478 },
  { id: 41, name: "佐賀県", slug: "saga", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 70, badgeCy: 490 },
  { id: 42, name: "長崎県", slug: "nagasaki", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 50, badgeCy: 500 },
  { id: 43, name: "熊本県", slug: "kumamoto", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 95, badgeCy: 510 },
  { id: 44, name: "大分県", slug: "oita", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 120, badgeCy: 495 },
  { id: 45, name: "宮崎県", slug: "miyazaki", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 110, badgeCy: 540 },
  { id: 46, name: "鹿児島県", slug: "kagoshima", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 88, badgeCy: 555 },
  { id: 47, name: "沖縄県", slug: "okinawa", cases: 0, amount: "¥0万", amountValue: 0, badgeCx: 595, badgeCy: 575 },
];

// 都道府県の件数を id で引けるmap
export const casesByPrefId = new Map<number, PrefectureStats>(
  prefectureStats.map((p) => [p.id, p])
);

// TOP都道府県（互換性保持・JapanMap.astroは独自集計に移行済み）
export const topPrefectures: any[] = [];
