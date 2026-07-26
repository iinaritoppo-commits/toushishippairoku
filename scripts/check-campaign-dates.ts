/**
 * キャンペーンDB の日付挙動を、任意の日付で先に確認する。
 *
 * 実装（src/lib/campaigns.ts）をそのまま読み込んで動かすため、
 * 本番のビルドで起きることと同じ結果になる。
 * データを足したとき、期限切れが想定どおりアーカイブへ移るかを
 * その日を待たずに検証できる。
 *
 * 使い方:
 *   npx tsx scripts/check-campaign-dates.ts
 *   npx tsx scripts/check-campaign-dates.ts 2026-08-02 2026-09-01
 */
import { CAMPAIGNS } from "../src/data/campaigns.ts";
import {
  getStatus,
  liveCampaigns,
  endedCampaigns,
  recheckPending,
  deadlineText,
} from "../src/lib/campaigns.ts";

const argv = process.argv.slice(2);
const dates = argv.length > 0 ? argv : ["2026-07-26", "2026-08-01", "2026-08-02", "2026-10-01"];

for (const ymd of dates) {
  const [y, m, d] = ymd.split("-").map(Number);
  const today = new Date(y, m - 1, d);

  const live = liveCampaigns(CAMPAIGNS, today);
  const ended = endedCampaigns(CAMPAIGNS, today);
  const pending = recheckPending(CAMPAIGNS, today);
  const soon = live.filter((c) => getStatus(c, today) === "ending-soon");

  console.log(`\n===== ${ymd} 時点 =====`);
  console.log(
    `掲載中 ${live.length}件 / まもなく終了 ${soon.length}件 / 実施履歴 ${ended.length}件 / 再確認待ち ${pending.length}件`,
  );

  for (const c of live) {
    const mark = getStatus(c, today) === "ending-soon" ? "🔴" : "  ";
    console.log(`${mark} [${deadlineText(c, today)}] ${c.company} — ${c.title.slice(0, 32)}`);
  }
  for (const c of ended) {
    console.log(`   📦 アーカイブ  ${c.company} — ${c.title.slice(0, 32)}`);
  }
  for (const c of pending) {
    console.log(`   ⏸️ 再確認待ち  ${c.company} — ${c.title.slice(0, 32)}`);
  }
}
console.log("");
