#!/usr/bin/env node
/**
 * noindex を付けたページを sitemap から除去する（build 後に実行）。
 *
 * なぜ必要か: 中身が薄い一覧(記事2本未満)は BaseLayout の noindex prop で
 * 検索対象から外しているが、@astrojs/sitemap はそれを知らずに全URLを載せてしまう。
 * 「noindexなのにsitemapで送信」は矛盾したシグナルになるため、実際に生成された
 * HTML を読んで noindex のURLだけを落とす。
 *
 * 記事が増えて 2本以上になれば noindex が外れ、このスクリプトも自動的に
 * そのURLを残すようになる（閾値ロジックと常に同期する）。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://toushishippairoku.com';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const files = await walk(DIST);
const noindexUrls = new Set();
for (const f of files) {
  const html = readFileSync(f, 'utf-8');
  if (!/name="robots"\s+content="noindex/.test(html)) continue;
  const rel = f.slice(DIST.length).replace(/\/index\.html$/, '/');
  noindexUrls.add(SITE + (rel === '/' ? '/' : rel));
}

const smPath = join(DIST, 'sitemap-0.xml');
if (!existsSync(smPath)) {
  console.error('prune-sitemap: sitemap-0.xml が無い（sitemap生成前？）');
  process.exit(1);
}
const xml = readFileSync(smPath, 'utf-8');
const before = (xml.match(/<url>/g) || []).length;

const pruned = xml.replace(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\s*/g, (m, loc) =>
  noindexUrls.has(decodeURI(loc)) || noindexUrls.has(loc) ? '' : m
);
const after = (pruned.match(/<url>/g) || []).length;
writeFileSync(smPath, pruned);

console.log(`prune-sitemap: noindexページ ${noindexUrls.size}件 / sitemap ${before} → ${after} URL (除去 ${before - after})`);
if (before - after !== noindexUrls.size) {
  console.warn('  ⚠ 除去数とnoindex数が不一致（sitemap未収録のnoindexページがある可能性）');
}
