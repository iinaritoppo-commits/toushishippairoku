import rss from "@astrojs/rss";
import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";
import { articles } from "../data/articles";

const CAT_LABELS: Record<string, string> = {
  fx: "FX", stocks: "株式", crypto: "暗号資産",
  realestate: "不動産", funds: "ファンド・投信", fraud: "投資詐欺",
  sidejob: "副業/その他", realty: "不動産", other: "その他",
};

export const GET: APIRoute = async (context) => {
  const items: any[] = [];

  // ① 手書き articles.ts 10本
  for (const a of articles) {
    items.push({
      title: a.title,
      description: a.metaDescription,
      link: `/articles/${a.slug}/`,
      pubDate: new Date(a.publishDate.replace(/年|月/g, "-").replace(/日/g, "")),
      categories: [a.category.split(" / ")[0]],
    });
  }

  // ② approved/*.json 70本
  const dir = path.join(process.cwd(), "approved");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      try {
        const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
        if (j.slug && j.title) {
          const stat = fs.statSync(path.join(dir, f));
          items.push({
            title: j.title,
            description: j.description ?? "",
            link: `/articles/${j.slug}/`,
            pubDate: stat.mtime,
            categories: [CAT_LABELS[j.category] ?? j.category],
          });
        }
      } catch {}
    }
  }

  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: "投資失敗録 — 他人の失敗から、明日の判断を",
    description: "実話・体験談ベースの投資失敗まとめ。読者の失敗談を編集してアーカイブしています。",
    site: context.site ?? "https://toushishippairoku.com",
    items: items.slice(0, 50),
    customData: `<language>ja-JP</language>`,
  });
};
