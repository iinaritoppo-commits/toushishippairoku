#!/usr/bin/env python3
"""
投資失敗録 OGP プレミアム版：東洋経済・日経ヴェリタス・ダイヤモンド誌レベルの
エディトリアル誌風サムネをPILで再現
1200x630
"""
import json, glob, os, random, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path("/Users/toppo/マイファイル/投資失敗録")
OUT_DIR = ROOT / "public" / "ogp"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# フォント
FONT_MINCHO = "/System/Library/Fonts/Hiragino Mincho ProN.ttc"
FONT_SANS = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_SERIF_FALLBACK = "/System/Library/Fonts/ヒラギノ明朝 ProN.ttc"

for fp in [FONT_MINCHO, FONT_SERIF_FALLBACK]:
    if os.path.exists(fp):
        FONT_MINCHO = fp
        break

# 配色（東洋経済・日経ヴェリタス風）
BG = (251, 250, 246)          # オフホワイト
BG_BAND = (16, 35, 72)        # 深紺（上下帯）
INK = (28, 35, 48)            # 墨色（本文）
INK_SOFT = (74, 85, 104)      # 中濃グレー
INK_DIM = (140, 148, 160)     # 薄グレー
GOLD = (200, 154, 74)         # 金（高級感アクセント）
GOLD_LIGHT = (231, 207, 149)  # 薄金
RED = (170, 38, 32)           # 損失赤（深い赤）
RED_DEEP = (135, 24, 20)      # より深い赤
LINE = (216, 210, 194)        # 薄線（ベージュグレー）
LINE_SOFT = (235, 228, 211)   # 極薄線

CAT_LABEL = {
    "fx": "F X", "stocks": "株 式", "crypto": "仮 想 通 貨",
    "fraud": "投 資 詐 欺", "info": "情 報 商 材",
    "real": "不 動 産", "realty": "不 動 産",
    "fund": "投 資 信 託", "credit": "信 用 取 引",
    "sidejob": "副 業 投 資", "other": "そ の 他",
}

# 各カテゴリのチャート風ライン形状（簡易折れ線）
def chart_points_for(cat: str) -> list:
    """カテゴリごとに特徴的な失敗パターンの折れ線"""
    if cat in ("fx", "credit"):
        # 急上昇→急落
        return [(0, 60), (15, 50), (30, 35), (45, 20), (55, 15), (60, 30), (65, 60), (70, 80), (80, 90), (100, 95)]
    elif cat == "crypto":
        # バブル→暴落
        return [(0, 70), (20, 55), (35, 40), (45, 25), (50, 15), (55, 18), (60, 35), (65, 55), (75, 70), (90, 85), (100, 90)]
    elif cat == "stocks":
        # じわじわ下落
        return [(0, 30), (15, 35), (30, 40), (45, 50), (60, 60), (75, 70), (85, 80), (100, 88)]
    elif cat in ("fraud", "info"):
        # 階段状下落
        return [(0, 25), (20, 30), (25, 50), (40, 52), (45, 70), (60, 72), (65, 85), (85, 87), (90, 95), (100, 95)]
    elif cat in ("real", "realty"):
        # 緩やかな下落
        return [(0, 35), (20, 40), (40, 48), (60, 58), (80, 72), (100, 85)]
    else:
        return [(0, 40), (25, 45), (50, 60), (75, 75), (100, 85)]


def short_title(t: str, max_chars: int = 24) -> str:
    if len(t) <= max_chars:
        return t
    return t[:max_chars] + "…"


def wrap_text(draw, text: str, font, max_width: int, max_lines: int = 3) -> list:
    """文字列を max_width に収めて改行（日本語向け、1文字ずつ判定）"""
    lines = []
    current = ""
    for ch in text:
        if not current:
            current = ch
            continue
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=font)
        w = bbox[2] - bbox[0]
        if w > max_width:
            lines.append(current)
            current = ch
            if len(lines) >= max_lines:
                break
        else:
            current = test
    if current and len(lines) < max_lines:
        lines.append(current)
    elif len(lines) >= max_lines:
        # 最終行に省略記号
        last = lines[-1]
        # スペース確保のため短く
        while True:
            test = last + "…"
            bbox = draw.textbbox((0, 0), test, font=font)
            if bbox[2] - bbox[0] <= max_width or len(last) <= 1:
                lines[-1] = test
                break
            last = last[:-1]
    return lines


def draw_chart(draw, points, area, color):
    """簡易折れ線チャートを描画。points は (x%, y%) のリスト"""
    x0, y0, x1, y1 = area
    w = x1 - x0
    h = y1 - y0
    coords = [(x0 + p[0] * w / 100, y0 + p[1] * h / 100) for p in points]
    # チャート背景に薄い縦線
    for gx in range(5):
        gxc = x0 + gx * w / 4
        draw.line([(gxc, y0), (gxc, y1)], fill=(230, 224, 208), width=1)
    # 折れ線
    for i in range(len(coords) - 1):
        draw.line([coords[i], coords[i + 1]], fill=color, width=3)
    # マーカー（最後の点）
    last = coords[-1]
    draw.ellipse([last[0] - 5, last[1] - 5, last[0] + 5, last[1] + 5], fill=color)


def build(article: dict) -> Image.Image:
    img = Image.new("RGB", (1200, 630), BG)
    draw = ImageDraw.Draw(img)

    # ===== 上帯（深紺、高さ56） =====
    draw.rectangle([0, 0, 1200, 56], fill=BG_BAND)
    # 投資失敗録ロゴ（明朝・金）
    font_logo = ImageFont.truetype(FONT_MINCHO, 26)
    draw.text((40, 12), "投資失敗録", font=font_logo, fill=GOLD)
    # サブ「実話・他人の投資失敗事例アーカイブ」
    font_sub = ImageFont.truetype(FONT_SANS, 12)
    draw.text((180, 22), "実話・他人の投資失敗事例アーカイブ", font=font_sub, fill=GOLD_LIGHT)
    # 右側ラベル
    label_en = "TOUSHI-SHIPPAI-ROKU"
    bbox = draw.textbbox((0, 0), label_en, font=font_sub)
    draw.text((1200 - 40 - (bbox[2] - bbox[0]), 22), label_en, font=font_sub, fill=GOLD_LIGHT)
    # 金線（上帯の下）
    draw.rectangle([0, 56, 1200, 58], fill=GOLD)

    # ===== カテゴリピル（左上） =====
    cat_key = article.get("category", "")
    cat_text = CAT_LABEL.get(cat_key, cat_key)
    font_cat = ImageFont.truetype(FONT_SANS, 14)
    pad_x, pad_y = 16, 8
    bbox = draw.textbbox((0, 0), cat_text, font=font_cat)
    cw, ch = bbox[2] - bbox[0], bbox[3] - bbox[1]
    cx0, cy0 = 64, 92
    # 細枠カラーピル
    draw.rectangle([cx0, cy0, cx0 + cw + pad_x * 2, cy0 + ch + pad_y * 2 - 2], fill=BG_BAND)
    draw.text((cx0 + pad_x, cy0 + pad_y - 4), cat_text, font=font_cat, fill=GOLD)

    # ===== 記事タイトル（明朝、左寄せ、2-3行） =====
    title = article.get("title", "")
    # ロスや人数表記を削って簡潔に
    short = short_title(title, 32)
    font_title = ImageFont.truetype(FONT_MINCHO, 38)
    title_y = 156
    title_lines = wrap_text(draw, short, font_title, max_width=720, max_lines=2)
    for i, line in enumerate(title_lines):
        draw.text((64, title_y + i * 52), line, font=font_title, fill=INK)
    title_end_y = title_y + len(title_lines) * 52

    # ===== 金線（タイトル下） =====
    line_y = title_end_y + 12
    draw.rectangle([64, line_y, 200, line_y + 2], fill=GOLD)

    # ===== 大金額（明朝、極大） =====
    loss_yen = article.get("loss_amount_yen", 0)
    loss_text = f"¥{loss_yen:,}-"
    digits = sum(1 for c in loss_text if c.isdigit())
    if digits <= 5:
        amt_size = 124
    elif digits == 6:
        amt_size = 110
    elif digits == 7:
        amt_size = 96
    elif digits == 8:
        amt_size = 84
    else:
        amt_size = 72
    font_amt = ImageFont.truetype(FONT_MINCHO, amt_size)
    amt_y = line_y + 28
    draw.text((64, amt_y), loss_text, font=font_amt, fill=RED)
    # 金額の下に LOSS キャプション
    amt_bbox = draw.textbbox((0, 0), loss_text, font=font_amt)
    amt_w = amt_bbox[2] - amt_bbox[0]
    cap_y = amt_y + amt_size + 4
    font_cap = ImageFont.truetype(FONT_SANS, 14)
    cap_text = "L O S S  ─  この記録の損失額"
    draw.text((68, cap_y), cap_text, font=font_cap, fill=INK_SOFT)

    # ===== 右側：チャート風アクセント =====
    chart_x0 = 800
    chart_y0 = 130
    chart_x1 = 1136
    chart_y1 = 360
    # チャート枠（薄ベージュ）
    draw.rectangle([chart_x0, chart_y0, chart_x1, chart_y1], outline=LINE, width=1)
    # チャートタイトル
    font_chart_label = ImageFont.truetype(FONT_SANS, 11)
    chart_label = f"LOSS CURVE  ─  {CAT_LABEL.get(cat_key, '')}"
    draw.text((chart_x0 + 12, chart_y0 + 8), chart_label, font=font_chart_label, fill=INK_DIM)
    # チャート描画
    draw_chart(draw, chart_points_for(cat_key), (chart_x0 + 16, chart_y0 + 36, chart_x1 - 16, chart_y1 - 16), RED)

    # チャート下に小さな数値ラベル（演出）
    font_axis = ImageFont.truetype(FONT_SANS, 10)
    draw.text((chart_x0, chart_y1 + 8), "T0", font=font_axis, fill=INK_DIM)
    draw.text((chart_x1 - 30, chart_y1 + 8), "T-end", font=font_axis, fill=INK_DIM)

    # ===== 下帯（薄ベージュ） =====
    draw.rectangle([0, 588, 1200, 630], fill=(238, 234, 222))
    draw.rectangle([0, 586, 1200, 588], fill=GOLD)
    font_meta = ImageFont.truetype(FONT_SANS, 13)
    draw.text((40, 602), "TOUSHISHIPPAIROKU.COM", font=font_meta, fill=INK_SOFT)
    p = article.get("persona", {})
    age = p.get("age", "")
    gender = p.get("gender", "")
    occ = (p.get("occupation", "") or "").split("（")[0]
    pref = p.get("prefecture", "")
    meta_parts = []
    if pref:
        meta_parts.append(pref)
    if age:
        meta_parts.append(f"{age}歳")
    if occ:
        meta_parts.append(occ)
    if gender:
        meta_parts.append(gender)
    meta_right = "  ・  ".join(meta_parts)
    bbox = draw.textbbox((0, 0), meta_right, font=font_meta)
    draw.text((1200 - 40 - (bbox[2] - bbox[0]), 602), meta_right, font=font_meta, fill=INK_SOFT)

    return img


def main():
    drafts = sorted(glob.glob(str(ROOT / "approved" / "draft-*.json")))
    print(f"Found {len(drafts)} drafts")
    count = 0
    for jf in drafts:
        try:
            a = json.load(open(jf))
        except Exception as e:
            continue
        if not all(k in a for k in ("slug", "loss_amount_yen", "title", "category")):
            continue
        img = build(a)
        out = OUT_DIR / f"{a['slug']}.png"
        img.save(out, optimize=True)
        count += 1

    # og-default：「他人の失敗から、明日の判断を。」専用版
    img = Image.new("RGB", (1200, 630), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 1200, 56], fill=BG_BAND)
    font_logo = ImageFont.truetype(FONT_MINCHO, 28)
    draw.text((40, 12), "投資失敗録", font=font_logo, fill=GOLD)
    font_sub = ImageFont.truetype(FONT_SANS, 13)
    draw.text((188, 22), "実話・他人の投資失敗事例アーカイブ", font=font_sub, fill=GOLD_LIGHT)
    draw.rectangle([0, 56, 1200, 58], fill=GOLD)
    font_h_label = ImageFont.truetype(FONT_SANS, 14)
    draw.text((64, 130), "R E A L   L O S S   R E C O R D S", font=font_h_label, fill=GOLD)
    font_h = ImageFont.truetype(FONT_MINCHO, 80)
    draw.text((64, 168), "他人の失敗から、", font=font_h, fill=INK)
    draw.text((64, 268), "明日の判断を。", font=font_h, fill=RED)
    draw.rectangle([64, 386, 200, 388], fill=GOLD)
    font_msg = ImageFont.truetype(FONT_SANS, 18)
    draw.text((64, 412), "FX・株・仮想通貨・不動産・投信・詐欺。実話・実体験ベースの取材記録アーカイブ。", font=font_msg, fill=INK_SOFT)
    font_quote = ImageFont.truetype(FONT_MINCHO, 18)
    draw.text((64, 480), "─  投資の話なのに、人間の話ばかり。  ─", font=font_quote, fill=INK_DIM)
    draw.rectangle([0, 588, 1200, 630], fill=(238, 234, 222))
    draw.rectangle([0, 586, 1200, 588], fill=GOLD)
    font_meta = ImageFont.truetype(FONT_SANS, 13)
    draw.text((40, 602), "TOUSHISHIPPAIROKU.COM", font=font_meta, fill=INK_SOFT)
    img.save(OUT_DIR / "og-default.png", optimize=True)
    print(f"  ✓ og-default.png")
    print(f"\nGenerated {count + 1} OGP thumbnails (premium edition)")


if __name__ == "__main__":
    main()
