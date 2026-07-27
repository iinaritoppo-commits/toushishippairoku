import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CAMPAIGNS } from "../src/data/campaigns.ts";
import { liveCampaigns } from "../src/lib/campaigns.ts";

type WatchStatus = "変化なし" | "変化あり" | "取得失敗";

type WatchEntry = {
  hash: string;
  lastChecked: string;
  lastChanged: string;
  status: WatchStatus;
};

type WatchLog = Record<string, WatchEntry>;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = resolve(SCRIPT_DIR, "../logs");
const WATCH_LOG_PATH = resolve(LOG_DIR, "campaign-watch.json");
const REPORT_PATH = resolve(LOG_DIR, "campaign-watch-report.md");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

function normalizeHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function jstDate(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function markdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

async function readPreviousLog(): Promise<WatchLog> {
  try {
    return JSON.parse(await readFile(WATCH_LOG_PATH, "utf8")) as WatchLog;
  } catch {
    return {};
  }
}

async function main(): Promise<void> {
  await mkdir(LOG_DIR, { recursive: true });

  const previous = await readPreviousLog();
  const campaigns = liveCampaigns(CAMPAIGNS);
  const pages = new Map<string, Set<string>>();

  for (const campaign of campaigns) {
    const companies = pages.get(campaign.officialUrl) ?? new Set<string>();
    companies.add(campaign.company);
    pages.set(campaign.officialUrl, companies);
  }

  const checkedAt = new Date();
  const checkedAtIso = checkedAt.toISOString();
  const next: WatchLog = {};
  const alerts: Array<{ companies: string; url: string; status: WatchStatus }> = [];
  const pageList = [...pages.entries()];

  for (let index = 0; index < pageList.length; index += 1) {
    const [url, companies] = pageList[index];
    const oldEntry = previous[url];

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const hash = sha256(normalizeHtml(await response.text()));
      const changed = oldEntry !== undefined && oldEntry.hash !== hash;
      const status: WatchStatus = changed ? "変化あり" : "変化なし";

      next[url] = {
        hash,
        lastChecked: checkedAtIso,
        lastChanged: changed ? checkedAtIso : (oldEntry?.lastChanged ?? checkedAtIso),
        status,
      };

      if (changed) {
        alerts.push({ companies: [...companies].join("、"), url, status });
      }
    } catch (error) {
      const status: WatchStatus = "取得失敗";
      next[url] = {
        hash: oldEntry?.hash ?? "",
        lastChecked: checkedAtIso,
        lastChanged: oldEntry?.lastChanged ?? checkedAtIso,
        status,
      };
      alerts.push({ companies: [...companies].join("、"), url, status });
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[取得失敗] ${url}: ${message}`);
    }

    if (index < pageList.length - 1) {
      await sleep(1_000);
    }
  }

  await writeFile(WATCH_LOG_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");

  if (alerts.length === 0) {
    await writeFile(
      REPORT_PATH,
      `# キャンペーンページ監視レポート（${jstDate(checkedAt)}）\n\n変化なし\n`,
      "utf8",
    );
    console.log("変化なし");
    return;
  }

  const lines = [
    `# キャンペーンページ監視レポート（${jstDate(checkedAt)}）`,
    "",
    "| 日付 | 会社名 | URL | 状態 |",
    "|---|---|---|---|",
    ...alerts.map(
      ({ companies, url, status }) =>
        `| ${jstDate(checkedAt)} | ${markdownCell(companies)} | ${url} | ${status} |`,
    ),
    "",
  ];
  const report = lines.join("\n");
  await writeFile(REPORT_PATH, report, "utf8");
  console.log(report);
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`キャンペーンページ監視で予期しないエラーが発生しました: ${message}`);
}).finally(() => {
  process.exitCode = 0;
});
