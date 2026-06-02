#!/usr/bin/env python3
"""
approved/*.json の既存記事に inline_column（本文中の心理学コラム）と
top_pillars（冒頭ピラーリンク）のメタフィールドを追加する。

- すでに inline_column / top_pillars があるファイルはスキップ
- カテゴリ別のテンプレートからランダム選択（再現性のためslugベースのseed）
- カテゴリ別のピラーリンクも自動付与

実行：
    python3 scripts/enrich-articles.py
    python3 scripts/enrich-articles.py --dry-run   # 変更内容だけ表示
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPROVED_DIR = ROOT / "approved"

# =============================================================
# カテゴリ別の inline_column テンプレート
# 各記事に1つランダム挿入される（slugベースのseedで決定的）
# =============================================================
INLINE_COLUMNS: dict[str, list[dict]] = {
    "fx": [
        {
            "title": "サンクコスト効果",
            "body": "<p>「ここまで耐えたんだから、もう少し待てば戻るはず」。これがサンクコスト効果。失った金額への執着が、追加の損失を呼び込む心理現象として、行動経済学で何度も観察されている。</p><p>FXでナンピンや塩漬けが止まらなくなる時、判断を狂わせているのはチャートじゃなくて、自分の脳内の「もったいない」という感情の方。</p>",
            "book": {
                "title": "ゾーン　最終章 トレーダーで成功するためのマーク・ダグラスの教え",
                "href": "https://www.amazon.co.jp/dp/4775991884",
                "note": "トレード心理の聖典"
            }
        },
        {
            "title": "プロスペクト理論",
            "body": "<p>同じ金額でも、得る喜びより失う痛みの方が2倍以上大きい。これがダニエル・カーネマンが示したプロスペクト理論の核心。</p><p>含み損を確定したくない心理は、この非対称性が原因。「損切りできない」のは性格じゃなくて、脳の標準仕様。仕様を知った上でルールで縛るしかない。</p>",
            "book": {
                "title": "ファスト&スロー（上下巻）",
                "href": "https://www.amazon.co.jp/dp/4150504113",
                "note": "ノーベル経済学賞・人間の判断バイアスの教科書"
            }
        },
        {
            "title": "確証バイアス",
            "body": "<p>自分のポジションと同じ方向の情報ばかり目に入る現象。SNSで自分のロング根拠を補強するツイートだけ「いいね」してしまう感覚。</p><p>含み損が膨らんでいる時こそ、自分のポジションと逆方向の意見を3つ読む習慣をつけると、判断のバイアスが補正されやすい。</p>",
            "book": {
                "title": "事実はなぜ人の意見を変えられないのか",
                "href": "https://www.amazon.co.jp/dp/4561241043",
                "note": "認知バイアス全般のわかりやすい解説書"
            }
        }
    ],
    "stocks": [
        {
            "title": "ハウスマネー効果",
            "body": "<p>儲かったお金は「自分のお金じゃない」と感じて、リスクを取りすぎる現象。利益が出た直後の追加投資が、最初の損失より大きくなりやすい理由。</p><p>「あぶく銭」と感じた瞬間、その金額は別管理にする。これだけで判断が冷静に戻る。</p>",
            "book": {
                "title": "敗者のゲーム",
                "href": "https://www.amazon.co.jp/dp/4532358884",
                "note": "個別株より低コストインデックスが優位な理由"
            }
        },
        {
            "title": "アンカリング効果",
            "body": "<p>「過去の最高値」が頭に残って、現在の株価が割安に見える現象。3年前2,000円の株が今1,000円だと「半分まで下がった、安い」と感じるが、企業価値が変わっていれば1,000円でも高い可能性がある。</p><p>過去価格をアンカーにせず、現在の業績と将来の収益力で判断する習慣を持つ。</p>",
            "book": {
                "title": "ウォール街のランダム・ウォーカー",
                "href": "https://www.amazon.co.jp/dp/4532358817",
                "note": "個別株分析の限界と分散投資の合理性"
            }
        }
    ],
    "crypto": [
        {
            "title": "FOMO（取り残される恐怖）",
            "body": "<p>Fear Of Missing Out。SNSで「億り人」の投稿を見るたびに、自分だけ乗り遅れる恐怖が増幅する。バブル相場の天井圏で買い増ししてしまう典型的な心理。</p><p>「乗り遅れる恐怖」を感じた瞬間こそ、バブルの後半にいる可能性が高い、と覚えておく。</p>",
            "book": {
                "title": "暗号資産の経済学",
                "href": "https://www.amazon.co.jp/dp/4502428515",
                "note": "規制・税制・取引実態の整理"
            }
        },
        {
            "title": "ソーシャル・プルーフ（社会的証明）",
            "body": "<p>「みんなが買ってるから安心」と感じる心理。LINEグループで他のメンバーの入金スクショが流れると、判断が鈍る。</p><p>そもそもLINEグループの「他のメンバー」が本当に実在するかは分からない、という前提で見るほうが安全。</p>",
            "book": {
                "title": "影響力の武器",
                "href": "https://www.amazon.co.jp/dp/4414304229",
                "note": "なぜ騙されるかを6つの原理で解明"
            }
        }
    ],
    "realestate": [
        {
            "title": "現状維持バイアス",
            "body": "<p>「契約したからには、もう動かない方が楽」と感じる心理。サブリースの家賃見直し通知が来ても、解約の手間と比較してそのまま放置してしまう典型。</p><p>3年後・5年後の見通しを契約時に書面化しておくと、現状維持バイアスに引きずられにくい。</p>",
            "book": {
                "title": "金持ち父さん貧乏父さん",
                "href": "https://www.amazon.co.jp/dp/4480864245",
                "note": "資産と負債の定義を見直す原点"
            }
        }
    ],
    "funds": [
        {
            "title": "複利の見えなさ",
            "body": "<p>年率3%の手数料は、1年で見ると小さい数字に見える。けれど20年複利で計算すると、リターンの60%以上を削る計算になる。</p><p>「年率」表記は短期目線では小さく見えるが、長期では決定的に効く。手数料は必ず20年積算で確認する。</p>",
            "book": {
                "title": "ほったらかし投資術",
                "href": "https://www.amazon.co.jp/dp/4022950765",
                "note": "インデックス積立の実務書"
            }
        }
    ],
    "fraud": [
        {
            "title": "権威バイアス",
            "body": "<p>「医師が言っている」「元証券マンが教える」「東大卒の専門家」など、肩書きで判断が甘くなる現象。詐欺ビジネスの定番手口。</p><p>本当の専門家ほど、肩書きを前面に出さずに事実だけ語る傾向がある、と覚えておく。</p>",
            "book": {
                "title": "影響力の武器",
                "href": "https://www.amazon.co.jp/dp/4414304229",
                "note": "なぜ騙されるかを6つの原理で解明"
            }
        },
        {
            "title": "コミットメントと一貫性",
            "body": "<p>「最初に100円のチェックを入れた人は、次に1万円に応じやすい」という心理。詐欺ビジネスが「最初は無料」「次は少額」と段階を踏むのはこの原理。</p><p>気づいた時点で、その後の追加要求は全部断っていい。一貫性を守る必要はない。</p>",
            "book": {
                "title": "影響力の武器",
                "href": "https://www.amazon.co.jp/dp/4414304229",
                "note": "なぜ騙されるかを6つの原理で解明"
            }
        }
    ],
    "sidejob": [
        {
            "title": "ギャンブラーの誤謬",
            "body": "<p>「今までハズレが続いたから、次は当たる」と感じる心理。情報商材を1つ買って失敗した後、次の商材に期待してしまう構造。</p><p>過去の失敗は次の成功確率を上げない。むしろ「次こそ」と思った瞬間が、最も冷静さを失っている。</p>",
            "book": {
                "title": "副業の正解",
                "href": "https://www.amazon.co.jp/dp/4046055375",
                "note": "怪しい副業と健全な副業の見分け方"
            }
        }
    ],
    "other": [
        {
            "title": "正常性バイアス",
            "body": "<p>「自分は大丈夫」「自分の判断は間違ってない」と感じる心理。詐欺被害者の多くが事後インタビューで「あんなのに引っかかると思ってなかった」と答える理由。</p><p>「自分は引っかからない」と思っている時こそ、最も無防備な状態かもしれない。</p>",
            "book": {
                "title": "ファスト&スロー（上下巻）",
                "href": "https://www.amazon.co.jp/dp/4150504113",
                "note": "ノーベル経済学賞・人間の判断バイアスの教科書"
            }
        }
    ]
}

# =============================================================
# 既存のカテゴリ別ピラーリンク（affiliate-defaults.ts と整合）
# =============================================================
TOP_PILLARS: dict[str, list[dict]] = {
    "fx": [
        {"href": "/compare/fx-no-margin-call/", "title": "追証なしFX口座 比較2026", "subtitle": "強制ロスカット仕様で選ぶ国内FX口座の整理", "icon": "▶"},
        {"href": "/explain/loss-cut-mechanism/", "title": "ロスカットの仕組み", "subtitle": "「指定レート」と「次の約定可能レート」の違い", "icon": "⚙"},
    ],
    "stocks": [
        {"href": "/compare/net-securities/", "title": "ネット証券3社の整理", "subtitle": "SBI・楽天・松井の手数料体系と特徴", "icon": "▶"},
    ],
    "crypto": [
        {"href": "/compare/crypto-exchanges/", "title": "国内仮想通貨取引所 比較", "subtitle": "セキュリティ・出金体制・板の厚みで整理", "icon": "▶"},
        {"href": "/explain/crypto-scam-patterns/", "title": "仮想通貨詐欺の典型パターン", "subtitle": "「内部情報」「上場前」「LINE紹介」の構造", "icon": "⚠"},
    ],
    "realestate": [
        {"href": "/compare/realestate-crowdfunding/", "title": "不動産クラファン比較", "subtitle": "少額から始められる不動産投資の整理", "icon": "▶"},
    ],
    "funds": [
        {"href": "/compare/roboadvisor/", "title": "ロボアド比較", "subtitle": "WealthNavi・THEO・SUSTEN等の手数料と運用方針", "icon": "▶"},
    ],
    "fraud": [
        {"href": "/compare/asset-expo-warning/", "title": "資産運用EXPOに行ったらヤバい理由", "subtitle": "両学長警鐘＋構造分析（2026最新）", "icon": "⚠"},
        {"href": "/explain/scam-detection-guide/", "title": "投資詐欺の見抜き方", "subtitle": "勧誘文言・出金条件・運営実態の見るべき箇所", "icon": "⚠"},
    ],
    "sidejob": [
        {"href": "/compare/asset-expo-warning/", "title": "資産運用EXPOに行ったらヤバい理由", "subtitle": "副業詐欺の温床にもなっている構造", "icon": "⚠"},
    ],
    "other": [
        {"href": "/explain/scam-detection-guide/", "title": "投資詐欺の見抜き方", "subtitle": "勧誘文言・出金条件・運営実態の見るべき箇所", "icon": "⚠"},
    ],
}


def slug_seed(slug: str) -> int:
    """slug から決定的なseedを生成（実行ごとに同じ結果にする）"""
    return int(hashlib.sha256(slug.encode("utf-8")).hexdigest(), 16)


def pick_inline_column(category: str, slug: str) -> dict | None:
    candidates = INLINE_COLUMNS.get(category) or INLINE_COLUMNS.get("other") or []
    if not candidates:
        return None
    seed = slug_seed(slug)
    return candidates[seed % len(candidates)]


def pick_top_pillars(category: str) -> list[dict]:
    return TOP_PILLARS.get(category) or TOP_PILLARS.get("other") or []


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="変更内容だけ表示・ファイル書き換えなし")
    parser.add_argument("--force", action="store_true", help="既存のフィールドも上書き")
    args = parser.parse_args()

    if not APPROVED_DIR.is_dir():
        print(f"approved ディレクトリが見つからない: {APPROVED_DIR}", file=sys.stderr)
        return 1

    files = sorted(APPROVED_DIR.glob("*.json"))
    enriched = 0
    skipped = 0
    failed = 0

    for path in files:
        try:
            with path.open("r", encoding="utf-8") as fp:
                data = json.load(fp)
        except Exception as e:
            print(f"  [読込失敗] {path.name}: {e}", file=sys.stderr)
            failed += 1
            continue

        slug = data.get("slug") or path.stem
        category = (data.get("category") or "other").lower()

        added: list[str] = []

        if args.force or "top_pillars" not in data:
            pillars = pick_top_pillars(category)
            if pillars:
                data["top_pillars"] = pillars
                added.append("top_pillars")

        if args.force or "inline_column" not in data:
            col = pick_inline_column(category, slug)
            if col is not None:
                data["inline_column"] = col
                added.append("inline_column")

        if not added:
            skipped += 1
            continue

        if args.dry_run:
            print(f"  [dry] {path.name}  +{','.join(added)}")
        else:
            try:
                with path.open("w", encoding="utf-8") as fp:
                    json.dump(data, fp, ensure_ascii=False, indent=2)
                    fp.write("\n")
                print(f"  [done] {path.name}  +{','.join(added)}")
            except Exception as e:
                print(f"  [書込失敗] {path.name}: {e}", file=sys.stderr)
                failed += 1
                continue

        enriched += 1

    mode = "dry-run" if args.dry_run else "writeback"
    print(f"\n[{mode}] enriched={enriched} skipped={skipped} failed={failed} total={len(files)}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
