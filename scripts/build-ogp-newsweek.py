#!/usr/bin/env python3
"""
投資失敗録 OGP サムネ：Newsweek/日経ヴェリタス系 報道誌風
オフホワイト × 黒 × 赤、シックで信頼感ある報道誌スタイル
1200x630
"""
import json, glob, os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/Users/toppo/マイファイル/投資失敗録")
OUT_DIR = ROOT / "public" / "ogp"
OUT_DIR.mkdir(parents=True, exist_ok=True)
FONT_SERIF = "/System/Library/Fonts/Hiragino Mincho ProN.ttc"
FONT_SANS = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_FALLBACK = "/System/Library/Fonts/Hiragino Sans GB.ttc"

if not os.path.exists(FONT_SERIF):
    FONT_SERIF = FONT_FALLBACK

# 配色
BG = (251, 250, 246)       # オフホワイト
BG_HEAD = (16, 35, 72)     # 深紺（上下帯）
INK = (28, 35, 48)         # 墨
INK_SOFT = (74, 85, 104)   # 中濃
GOLD = (200, 154, 74)      # 金
RED = (184, 49, 42)        # 損失赤
LINE = (216, 210, 194)     # 薄線

CAT_LABEL = {
    "fx": "FX",
    "stocks": "株式",
    "crypto": "仮想通貨",
    "fraud": "投資詐欺",
    "info": "情報商材",
    "real": "不動産",
    "fund": "投資信託",
    "credit": "信用取引",
    "realty": "不動産",
    "sidejob": "副業投資",
    "other": "その他",
}


def short_title(t: str, max_chars: int = 28) -> str:
    if len(t) <= max_chars:
        return t
    return t[:max_chars] + "…"


def draw_text_safe(draw, text, pos, font, fill):
    draw.text(pos, text, font=font, fill=fill)


def build(article: dict) -> Image.Image:
    img = Image.new("RGB", (1200, 630), BG)
    draw = ImageDraw.Draw(img)

    # 上帯（紺）
    draw.rectangle([0, 0, 1200, 56], fill=BG_HEAD)
    # 上帯のロゴ「投資失敗録」（金）
    font_logo = ImageFont.truetype(FONT_SERIF, 24)
    draw.text((36, 14), "投資失敗録", font=font_logo, fill=(200, 154, 74))
    # 上帯の右側ラベル
    font_brand = ImageFont.truetype(FONT_SANS, 14)
    label_en = "TOUSHI-SHIPPAI-ROKU ・ LOSS RECORDS"
    bbox = draw.textbbox((0, 0), label_en, font=font_brand)
    draw.text((1200 - 36 - (bbox[2] - bbox[0]), 21), label_en, font=font_brand, fill=(200, 154, 74, 200))

    # 下帯（薄紺）
    draw.rectangle([0, 594, 1200, 630], fill=(232, 230, 222))
    # 下帯の右側日付・URL
    font_meta = ImageFont.truetype(FONT_SANS, 14)
    draw.text((36, 604), "TOUSHI-SHIPPAI-ROKU.PAGES.DEV", font=font_meta, fill=INK_SOFT)
    p = article.get("persona", {})
    age = p.get("age", "")
    gender = p.get("gender", "")
    pref = p.get("prefecture", "")
    meta_right = f"{age}歳 {gender} ・ {pref}"
    bbox = draw.textbbox((0, 0), meta_right, font=font_meta)
    draw.text((1200 - 36 - (bbox[2] - bbox[0]), 604), meta_right, font=font_meta, fill=INK_SOFT)

    # カテゴリラベル（左上、紺帯下に）
    cat_key = article.get("category", "")
    cat_text = CAT_LABEL.get(cat_key, cat_key)
    font_cat = ImageFont.truetype(FONT_SANS, 22)
    cat_pad_x, cat_pad_y = 16, 7
    bbox = draw.textbbox((0, 0), cat_text, font=font_cat)
    cw, ch = bbox[2] - bbox[0], bbox[3] - bbox[1]
    cx0, cy0 = 64, 96
    draw.rectangle([cx0, cy0, cx0 + cw + cat_pad_x * 2, cy0 + ch + cat_pad_y * 2 - 4], fill=RED)
    draw.text((cx0 + cat_pad_x, cy0 + cat_pad_y - 4), cat_text, font=font_cat, fill=(255, 255, 255))

    # 金額（大）
    loss_yen = article.get("loss_amount_yen", 0)
    loss_text = f"¥{loss_yen:,}-"
    # 金額に合わせてサイズ調整
    digits = sum(1 for c in loss_text if c.isdigit())
    if digits <= 6:
        amt_size = 124
    elif digits <= 7:
        amt_size = 108
    elif digits <= 8:
        amt_size = 94
    else:
        amt_size = 84
    font_amt = ImageFont.truetype(FONT_SERIF, amt_size)
    bbox = draw.textbbox((0, 0), loss_text, font=font_amt)
    amt_w = bbox[2] - bbox[0]
    amt_x = 64
    amt_y = 168
    draw.text((amt_x, amt_y), loss_text, font=font_amt, fill=RED)
    # 金額の下に「累計損失」ラベル
    font_loss_label = ImageFont.truetype(FONT_SANS, 16)
    label_y = amt_y + amt_size + 6
    draw.text((amt_x + 6, label_y), "LOSS  ─  この記録の損失額", font=font_loss_label, fill=INK_SOFT)

    # タイトル（記事タイトル、3行まで）
    title = article.get("title", "")
    font_title = ImageFont.truetype(FONT_SERIF, 36)
    # 改行ロジック：文字を1行ずつ詰める
    max_width = 1200 - 64 - 64  # 左右マージン
    lines = []
    current = ""
    for ch in title:
        if not current:
            current = ch
            continue
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=font_title)
        if bbox[2] - bbox[0] > max_width:
            lines.append(current)
            current = ch
            if len(lines) >= 3:
                # 最大3行、それ以上は省略
                break
        else:
            current = test
    if current and len(lines) < 3:
        lines.append(current)
    elif len(lines) >= 3 and current:
        # 最後の行に省略記号
        last = lines.pop()
        truncated = last[:-1] + "…" if len(last) > 1 else "…"
        lines.append(truncated)

    title_y = label_y + 50
    line_h = 50
    for i, line in enumerate(lines[:3]):
        draw.text((64, title_y + i * line_h), line, font=font_title, fill=INK)

    # 仕切り線（タイトル下）
    sep_y = title_y + line_h * len(lines[:3]) + 16
    if sep_y < 560:
        draw.rectangle([64, sep_y, 200, sep_y + 2], fill=GOLD)

    return img


def main():
    drafts = sorted(glob.glob(str(ROOT / "approved" / "draft-*.json")))
    print(f"Found {len(drafts)} drafts")
    count = 0
    for jf in drafts:
        try:
            a = json.load(open(jf))
        except Exception as e:
            print(f"  skip {jf}: {e}")
            continue
        if not all(k in a for k in ("slug", "loss_amount_yen", "title", "category")):
            print(f"  skip {a.get('slug', jf)} (missing fields)")
            continue
        img = build(a)
        out = OUT_DIR / f"{a['slug']}.png"
        img.save(out, optimize=True)
        count += 1
        print(f"  ✓ {a['slug']} ({a['loss_amount_yen']//10000}万)")

    # デフォルト：累計表示の特別版
    default_article = {
        "slug": "og-default",
        "title": "他人の失敗から、明日の判断を。実話・実体験ベースの投資失敗記録アーカイブ。",
        "category": "other",
        "loss_amount_yen": 0,
        "persona": {"age": "", "gender": "", "prefecture": ""},
    }
    # デフォルトは独自レイアウト
    img = Image.new("RGB", (1200, 630), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 1200, 56], fill=BG_HEAD)
    font_logo = ImageFont.truetype(FONT_SERIF, 28)
    draw.text((36, 12), "投資失敗録", font=font_logo, fill=(200, 154, 74))
    font_h = ImageFont.truetype(FONT_SERIF, 72)
    draw.text((64, 200), "他人の失敗から、", font=font_h, fill=INK)
    draw.text((64, 290), "明日の判断を。", font=font_h, fill=RED)
    font_sub = ImageFont.truetype(FONT_SANS, 22)
    draw.text((64, 410), "FX・株・仮想通貨・不動産・投信・詐欺。実話・実体験ベースの取材記録アーカイブ。", font=font_sub, fill=INK_SOFT)
    draw.rectangle([0, 594, 1200, 630], fill=(232, 230, 222))
    font_meta = ImageFont.truetype(FONT_SANS, 14)
    draw.text((36, 604), "TOUSHI-SHIPPAI-ROKU.PAGES.DEV", font=font_meta, fill=INK_SOFT)
    img.save(OUT_DIR / "og-default.png", optimize=True)
    print(f"  ✓ og-default.png")
    print(f"\nGenerated {count + 1} OGP thumbnails")


if __name__ == "__main__":
    main()
