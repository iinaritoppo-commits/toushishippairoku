// =============================================================
// キャンペーンDB ロジック層
//
// 設計方針:
//   データ（src/data/campaigns.ts）は事実だけを持つ。
//   「開催中 / 終了間近 / 終了済み」の判定は一切データに書かず、
//   ビルド時の日付から毎回計算する。
//   日次ビルド（08:07 / 21:07 JST）が回るたびに表示が自動で切り替わるため、
//   手動更新なしで鮮度が保たれる。
// =============================================================

import type { AmountUnit, Campaign } from "../data/campaigns";

export type CampaignStatus = "upcoming" | "active" | "ending-soon" | "ended";

/** 終了間近と見なす残日数 */
export const ENDING_SOON_DAYS = 7;

/** YYYY-MM-DD を JST の 0時 として Date にする（タイムゾーン差で1日ズレるのを防ぐ） */
function parseDate(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 時刻を捨てて日付だけにする */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * 終了日までの残り日数。
 * 当日終了なら 0、期限の記載が無いキャンペーンは null。
 */
export function daysLeft(campaign: Campaign, today: Date = new Date()): number | null {
  if (!campaign.endDate) return null;
  const end = parseDate(campaign.endDate);
  const base = startOfDay(today);
  return Math.round((end.getTime() - base.getTime()) / 86_400_000);
}

/** 開始日までの残り日数（開始済みなら 0 以下） */
export function daysUntilStart(campaign: Campaign, today: Date = new Date()): number {
  const start = parseDate(campaign.startDate);
  const base = startOfDay(today);
  return Math.round((start.getTime() - base.getTime()) / 86_400_000);
}

/** ビルド時点のステータスを判定する */
export function getStatus(campaign: Campaign, today: Date = new Date()): CampaignStatus {
  if (daysUntilStart(campaign, today) > 0) return "upcoming";

  const left = daysLeft(campaign, today);
  if (left === null) return "active"; // 期限の記載なし＝終了扱いにしない
  if (left < 0) return "ended";
  if (left <= ENDING_SOON_DAYS) return "ending-soon";
  return "active";
}

/** 表示用ラベル */
export function statusLabel(status: CampaignStatus): string {
  switch (status) {
    case "upcoming": return "開始前";
    case "active": return "開催中";
    case "ending-soon": return "まもなく終了";
    case "ended": return "終了";
  }
}

/** 残日数の表示文言。期限なしと終了済みも吸収する */
export function deadlineText(campaign: Campaign, today: Date = new Date()): string {
  const status = getStatus(campaign, today);
  if (status === "upcoming") {
    return `${formatYmd(campaign.startDate)}開始`;
  }
  const left = daysLeft(campaign, today);
  if (left === null) return "終了日の記載なし";
  if (left < 0) return `${formatYmd(campaign.endDate!)}に終了`;
  if (left === 0) return "本日まで";
  return `残り${left}日`;
}

/** 2026-08-31 → 8月31日 */
export function formatYmd(ymd: string): string {
  const [, m, d] = ymd.split("-").map(Number);
  return `${m}月${d}日`;
}

/** 2026-08-31 → 2026年8月31日 */
export function formatYmdFull(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

/** 最終確認日からの経過日数。情報の鮮度を読者に開示するために使う */
export function daysSinceChecked(campaign: Campaign, today: Date = new Date()): number {
  const checked = parseDate(campaign.checkedAt);
  const base = startOfDay(today);
  return Math.round((base.getTime() - checked.getTime()) / 86_400_000);
}

/**
 * 掲載中（開始前・開催中・終了間近）のものを、
 * 「終了間近 → 残日数が少ない順 → 金額が大きい順」で並べる。
 * 終了済みは含めない（アーカイブ側で扱う）。
 */
export function liveCampaigns(all: Campaign[], today: Date = new Date()): Campaign[] {
  return all
    .filter((c) => getStatus(c, today) !== "ended")
    .sort((a, b) => {
      const rank = (c: Campaign) => (getStatus(c, today) === "ending-soon" ? 0 : 1);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);

      const la = daysLeft(a, today);
      const lb = daysLeft(b, today);
      // 期限なしは後ろに回す
      if (la === null && lb !== null) return 1;
      if (lb === null && la !== null) return -1;
      if (la !== null && lb !== null && la !== lb) return la - lb;

      return (b.maxAmount ?? 0) - (a.maxAmount ?? 0);
    });
}

/** 終了済みを新しい順に並べる。実施履歴として蓄積していく */
export function endedCampaigns(all: Campaign[], today: Date = new Date()): Campaign[] {
  return all
    .filter((c) => getStatus(c, today) === "ended")
    .sort((a, b) => (b.endDate ?? "").localeCompare(a.endDate ?? ""));
}

/** 会社ごとにまとめる（会社別ページ生成用） */
export function groupByCompany(all: Campaign[]): Map<string, Campaign[]> {
  const map = new Map<string, Campaign[]>();
  for (const c of all) {
    const list = map.get(c.companySlug) ?? [];
    list.push(c);
    map.set(c.companySlug, list);
  }
  return map;
}

/**
 * 金額表示。12000 → 1万2,000円 ではなく素直に 12,000円 とする。
 * ポイント特典を円と混同させないため、単位を明示して出し分ける。
 */
export function formatAmount(value: number, unit: AmountUnit = "yen"): string {
  const n = value.toLocaleString("ja-JP");
  return unit === "point" ? `${n}ポイント` : `${n}円`;
}
