#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
投資失敗録 OGP画像 自動生成スクリプト

各記事の OGP（1200x630）を /public/ogp/ に生成。
articles.ts を JSON 風にパースして、各記事の loss / title / category から画像を作る。

依存：Pillow（pip install Pillow）

使い方：
  python3 scripts/gen-ogp.py
"""
import os
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent.parent
ARTICLES_TS = ROOT / "src" / "data" / "articles.ts"
OUT = ROOT / "public" / "ogp"
OUT.mkdir(parents=True, exist_ok=True)

# Font candidates（macOS / Linux 両対応）
FONT_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
    "/Library/Fonts/Arial Unicode.ttf",
]
HELV_CANDIDATES = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

def get_font(size, helvetica=False):
    candidates = HELV_CANDIDATES if helvetica else FONT_CANDIDATES
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

def parse_articles():
    """articles.ts から各記事の slug/title/amountDisplay/category を抽出"""
    text = ARTICLES_TS.read_text(encoding="utf-8")
    # オブジェクトブロック単位で抽出（{ slug: ... }, から次まで）
    blocks = re.split(r"\n  \{", text)[1:]
    items = []
    for b in blocks:
        slug = re.search(r'slug:\s*"([^"]+)"', b)
        title = re.search(r'title:\s*"([^"]+)"', b)
        amount = re.search(r'amountDisplay:\s*"([^"]+)"', b)
        category = re.search(r'category:\s*"([^"]+)"', b)
        cardTitle = re.search(r'cardTitle:\s*"([^"]+)"', b)
        if slug and title:
            items.append({
                "slug": slug.group(1),
                "title": cardTitle.group(1) if cardTitle else title.group(1),
                "amount": amount.group(1) if amount else "",
                "category": category.group(1) if category else "",
            })
    return items

def wrap_text(text, font, max_width, max_lines=3):
    """文字列を max_width 内で折り返す（日本語向け：1文字ずつ追加）"""
    lines = []
    cur = ""
    for ch in text:
        test = cur + ch
        bbox = font.getbbox(test)
        if bbox[2] - bbox[0] > max_width and cur:
            lines.append(cur)
            cur = ch
            if len(lines) >= max_lines - 1:
                # 最後の行に残り全部入れて末尾に "…"
                rest = text[len(''.join(lines)):]
                while rest:
                    test = cur + rest[0]
                    if font.getbbox(test)[2] - font.getbbox(test)[0] > max_width - 20:
                        cur += "…"
                        break
                    cur += rest[0]
                    rest = rest[1:]
                lines.append(cur)
                return lines
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines

def render_ogp(item):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), (16, 35, 72))  # navy deep
    d = ImageDraw.Draw(img)

    # 上下のゴールドライン
    d.rectangle([(0, 0), (W, 8)], fill=(200, 154, 74))
    d.rectangle([(0, H-8), (W, H)], fill=(200, 154, 74))

    # 左ボーダー（カテゴリchipエリア用）
    d.rectangle([(0, 8), (12, H-8)], fill=(200, 154, 74))

    f_brand = get_font(34)
    f_brand_en = get_font(15, helvetica=True)
    f_cat = get_font(22)
    f_loss = get_font(118, helvetica=True)
    f_loss_yen = get_font(48, helvetica=True)
    f_title = get_font(40)
    f_attr = get_font(20)

    # ブランド（左上）
    d.text((60, 50), "投資失敗録", font=f_brand, fill=(255, 255, 255))
    d.text((60, 96), "TOUSHI-SHIPPAI-ROKU", font=f_brand_en, fill=(200, 154, 74))

    # カテゴリ chip（右上）
    cat = item["category"]
    if cat:
        cat_bbox = f_cat.getbbox(cat)
        cw = cat_bbox[2] - cat_bbox[0] + 32
        ch = 38
        cx = W - 60 - cw
        cy = 60
        d.rectangle([(cx, cy), (cx + cw, cy + ch)], fill=(200, 154, 74))
        d.text((cx + 16, cy + 6), cat, font=f_cat, fill=(26, 37, 64))

    # 損失額（中央左寄り、最大ヒーロー）
    amount = item["amount"]
    # ¥マーク付きなら大きく、それ以外（おおよそ¥..万 等）は小ぶりに
    if amount.startswith("¥") and amount.replace(",", "").replace("¥", "").isdigit():
        # 純数字 ¥3,800,000 形式
        d.text((60, 220), amount, font=f_loss, fill=(240, 160, 152))
    else:
        # おおよそ¥280万 / 500〜700万円台 形式
        d.text((60, 240), amount, font=get_font(78, helvetica=False), fill=(240, 160, 152))

    # 「の損失」を右下に小さく
    d.text((60, 360), "の損失", font=f_attr, fill=(200, 154, 74))

    # タイトル（下部・折返し）
    title = item["title"]
    title_lines = wrap_text(title, f_title, W - 120, max_lines=2)
    y = 430
    for line in title_lines:
        d.text((60, y), line, font=f_title, fill=(255, 255, 255))
        y += 56

    # 編集者署名（右下）
    sign = "編集：白川 諒｜投稿と聞いた話の実話アーカイブ"
    sb = f_attr.getbbox(sign)
    d.text((W - 60 - (sb[2] - sb[0]), H - 50), sign, font=f_attr, fill=(200, 154, 74))

    out = OUT / f"{item['slug']}.png"
    img.save(out, "PNG", optimize=True)
    return out

def render_default():
    """サイトトップ用 OGP（記事スラグなし）"""
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), (16, 35, 72))
    d = ImageDraw.Draw(img)
    d.rectangle([(0, 0), (W, 8)], fill=(200, 154, 74))
    d.rectangle([(0, H-8), (W, H)], fill=(200, 154, 74))

    f_sub = get_font(22, helvetica=True)
    f_main = get_font(96)
    f_lead = get_font(28)
    f_brand = get_font(28)

    # サブタイトル中央上
    sub = "REAL LOSS RECORDS"
    sb = f_sub.getbbox(sub)
    d.text(((W - (sb[2] - sb[0])) / 2, 130), sub, font=f_sub, fill=(200, 154, 74))

    # メインキャッチ（2行）
    line1 = "他人の失敗から、"
    line2 = "明日の判断を。"
    for i, line in enumerate([line1, line2]):
        bbox = f_main.getbbox(line)
        x = (W - (bbox[2] - bbox[0])) / 2
        d.text((x, 200 + i * 110), line, font=f_main, fill=(255, 255, 255))

    # リード
    lead = "投稿で寄せられた話と、仕事の合間に聞いた話を、編集して残しています。"
    lb = f_lead.getbbox(lead)
    d.text(((W - (lb[2] - lb[0])) / 2, 450), lead, font=f_lead, fill=(232, 212, 155))

    # ブランド
    brand = "投資失敗録 ・ TOUSHI-SHIPPAI-ROKU"
    bb = f_brand.getbbox(brand)
    d.text(((W - (bb[2] - bb[0])) / 2, 540), brand, font=f_brand, fill=(200, 154, 74))

    out = ROOT / "public" / "og-default.png"
    img.save(out, "PNG", optimize=True)
    return out

def main():
    items = parse_articles()
    print(f"Parsed {len(items)} articles")

    for it in items:
        out = render_ogp(it)
        print(f"  ✓ {out.name}  ({it['amount']})")

    default = render_default()
    print(f"\n  ✓ {default.name}")
    print("\nDone.")

if __name__ == "__main__":
    main()
