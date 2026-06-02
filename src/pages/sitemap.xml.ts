import { articles } from "../data/articles";

const SITE = "https://toushishippairoku.com"; // 本番ドメイン

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/about/", priority: "0.7", changefreq: "monthly" },
    { loc: "/policy/", priority: "0.6", changefreq: "monthly" },
    { loc: "/disclaimer/", priority: "0.5", changefreq: "monthly" },
    { loc: "/privacy/", priority: "0.5", changefreq: "monthly" },
  ];

  const articlePages = articles.map((a) => ({
    loc: `/articles/${a.slug}/`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const all = [...staticPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
