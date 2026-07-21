#!/usr/bin/env node
/**
 * dist 内のすべての Amazon 商品リンクに アソシエイトタグ tag=toushishippai-22 を付与する（build 後に実行）。
 *
 * なぜ postbuild で一括か:
 * リンクは affiliate-defaults.ts の href だけでなく asin フィールドからテンプレ側で
 * 組まれる経路もあり、ソースを個別に直すと取りこぼす。生成後の HTML を単一の関門で
 * 処理すれば、どの描画経路でも 100% タグが乗る。tag が無いと成約が記録されず 1 円も入らない。
 * 既に tag が付いているリンクは触らない（冪等）。cron ビルドでも毎回自動で走る。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const TAG = 'toushishippai-22';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// href/src 属性内の amazon.co.jp/dp/ASIN(/...)?(query)? に tag を付ける。既に tag= があれば据え置き。
const AMAZON = /(https?:\/\/(?:www\.)?amazon\.co\.jp\/(?:dp|gp\/product)\/[A-Z0-9]+[^"'\s<>]*)/g;

function tagUrl(url) {
  if (/[?&]tag=/.test(url)) return url;
  return url + (url.includes('?') ? '&' : '?') + 'tag=' + TAG;
}

const files = await walk(DIST);
let tagged = 0;
let touchedFiles = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf-8');
  let n = 0;
  const out = html.replace(AMAZON, (m) => {
    const t = tagUrl(m);
    if (t !== m) n++;
    return t;
  });
  if (n > 0) {
    writeFileSync(f, out);
    tagged += n;
    touchedFiles++;
  }
}
console.log(`add-amazon-tag: tag=${TAG} を ${tagged} リンクに付与（${touchedFiles} ファイル）`);
