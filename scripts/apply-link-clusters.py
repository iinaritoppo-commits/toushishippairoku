#!/usr/bin/env python3
"""B-1〜B-5の校閲で設計した手口クラスタを related_slugs として approved/*.json に注入する。

related_slugs は記事ページの「関連する失敗の記録」の先頭枠を決める（残りは同カテゴリで自動補充）。
- 設計の出典: サイト設計資料/投資失敗録ランキングplaybook_2026-06-27.md の各コホート追記
- 全slugの実在チェック付き。存在しないslugが1つでもあれば何も書かずに終了する。
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPROVED = ROOT / "approved"

# slug -> 優先関連slug（順序が表示順。3〜5本、残り枠は自動補充に任せる）
CLUSTERS: dict[str, list[str]] = {
    # ── FTX破綻（015=最大被害をハブに、入口違いの4本＋コインチェック対比＋退職金2018）
    "toushi-crypto-015": ["toushi-crypto-003", "toushi-crypto-006", "toushi-crypto-017", "toushi-crypto-010", "toushi-crypto-008"],
    "toushi-crypto-003": ["toushi-crypto-015", "toushi-crypto-006", "toushi-crypto-017", "toushi-crypto-010", "toushi-crypto-008"],
    "toushi-crypto-006": ["toushi-crypto-015", "toushi-crypto-003", "toushi-crypto-017", "toushi-crypto-010", "toushi-crypto-011"],
    "toushi-crypto-017": ["toushi-crypto-015", "toushi-crypto-003", "toushi-crypto-006", "toushi-crypto-010", "toushi-crypto-008"],
    "toushi-crypto-010": ["toushi-crypto-015", "toushi-crypto-003", "toushi-crypto-006", "toushi-crypto-017", "toushi-crypto-008"],
    # ── トルコリラ（4本相互＋スワップ神話つながりの014）
    "toushi-fx-012": ["toushi-fx-007", "toushi-fx-020", "toushi-fx-022", "toushi-fx-014"],
    "toushi-fx-007": ["toushi-fx-012", "toushi-fx-020", "toushi-fx-022", "toushi-fx-014"],
    "toushi-fx-020": ["toushi-fx-012", "toushi-fx-007", "toushi-fx-022", "toushi-fx-025"],
    "toushi-fx-022": ["toushi-fx-012", "toushi-fx-007", "toushi-fx-020", "toushi-fx-009"],
    # ── 退職金×暴落（コロナ/スイスフラン/予行演習/ビットコイン）
    "toushi-fx-003": ["toushi-fx-014", "toushi-fx-025", "toushi-fx-018", "toushi-crypto-011"],
    "toushi-fx-014": ["toushi-fx-025", "toushi-fx-003", "toushi-fx-018", "toushi-fx-007"],
    "toushi-fx-025": ["toushi-fx-014", "toushi-fx-003", "toushi-fx-018", "toushi-crypto-011"],
    "toushi-fx-018": ["toushi-fx-003", "toushi-fx-014", "toushi-fx-025", "toushi-crypto-011"],
    # ── 2018ビットコインバブル（借入/取引先/親族/退職金）
    "toushi-crypto-001": ["toushi-crypto-005", "toushi-crypto-018", "toushi-crypto-011", "toushi-crypto-021"],
    "toushi-crypto-005": ["toushi-crypto-001", "toushi-crypto-018", "toushi-crypto-011", "toushi-crypto-008"],
    "toushi-crypto-018": ["toushi-crypto-001", "toushi-crypto-005", "toushi-crypto-011", "toushi-crypto-009"],
    "toushi-crypto-011": ["toushi-crypto-001", "toushi-crypto-005", "toushi-crypto-018", "toushi-fx-025"],
    # ── Luna/UST崩壊（009=最大被害ハブ）
    "toushi-crypto-009": ["toushi-crypto-002", "toushi-crypto-013", "toushi-crypto-019", "toushi-crypto-004"],
    "toushi-crypto-002": ["toushi-crypto-009", "toushi-crypto-013", "toushi-crypto-019", "toushi-crypto-012"],
    "toushi-crypto-013": ["toushi-crypto-009", "toushi-crypto-002", "toushi-crypto-019", "toushi-crypto-004"],
    "toushi-crypto-019": ["toushi-crypto-009", "toushi-crypto-002", "toushi-crypto-013", "toushi-crypto-023"],
    # ── ロマンス詐欺トリオ（B-1設計: 入口と職業で差別化した相互リンク）
    "toushi-fraud-001": ["toushi-fraud-006", "toushi-fraud-010"],
    "toushi-fraud-006": ["toushi-fraud-001", "toushi-fraud-010"],
    "toushi-fraud-010": ["toushi-fraud-001", "toushi-fraud-006"],
    # ── LINE AI自動売買トリオ
    "toushi-fraud-003": ["toushi-fraud-008", "toushi-fraud-015", "toushi-fraud-016"],
    "toushi-fraud-008": ["toushi-fraud-003", "toushi-fraud-015", "toushi-fraud-013"],
    "toushi-fraud-015": ["toushi-fraud-003", "toushi-fraud-008", "toushi-fraud-016"],
    # ── 草コイン（X DM/借金上乗せ/取引先/初任給）
    "toushi-crypto-012": ["toushi-crypto-016", "toushi-crypto-020", "toushi-crypto-023", "toushi-crypto-002"],
    "toushi-crypto-016": ["toushi-crypto-012", "toushi-crypto-020", "toushi-crypto-023"],
    "toushi-crypto-020": ["toushi-crypto-012", "toushi-crypto-016", "toushi-crypto-023"],
    "toushi-crypto-023": ["toushi-crypto-012", "toushi-crypto-016", "toushi-crypto-020", "toushi-crypto-019"],
    # ── NFT・送金型（X DM/コミュニティ/プレミント/EXPO）
    "toushi-crypto-007": ["toushi-crypto-014", "toushi-crypto-024", "toushi-crypto-026"],
    "toushi-crypto-014": ["toushi-crypto-007", "toushi-crypto-024", "toushi-crypto-026"],
    "toushi-crypto-024": ["toushi-crypto-007", "toushi-crypto-014", "toushi-crypto-026"],
    "toushi-crypto-026": ["toushi-crypto-007", "toushi-crypto-014", "toushi-crypto-024", "toushi-crypto-expo-001"],
    "toushi-crypto-expo-001": ["toushi-crypto-026", "toushi-crypto-024", "toushi-fraud-011"],
    # ── 夫関連・運用委託（fx）
    "toushi-fx-002": ["toushi-fx-009", "toushi-fx-022", "toushi-fx-006"],
    "toushi-fx-009": ["toushi-fx-002", "toushi-fx-022", "toushi-fx-013"],
    "toushi-fx-004": ["toushi-fx-015", "toushi-fraud-016", "toushi-fx-023"],
    "toushi-fx-015": ["toushi-fx-004", "toushi-fraud-016", "toushi-fx-021"],
}


def main() -> None:
    # slug -> ファイルの索引を実データから作る
    by_slug: dict[str, Path] = {}
    for f in APPROVED.glob("*.json"):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        if d.get("slug"):
            by_slug[d["slug"]] = f

    # 実在チェック（1件でも不在なら何も書かない）
    missing = []
    for src, targets in CLUSTERS.items():
        if src not in by_slug:
            missing.append(f"src不在: {src}")
        for t in targets:
            if t not in by_slug:
                missing.append(f"{src} -> 不在: {t}")
    if missing:
        print("🔴 実在チェック失敗（何も書き込まない）:")
        for m in missing:
            print("  ", m)
        sys.exit(1)

    n = 0
    for src, targets in CLUSTERS.items():
        p = by_slug[src]
        d = json.loads(p.read_text(encoding="utf-8"))
        if d.get("related_slugs") == targets:
            continue
        d["related_slugs"] = targets
        p.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        n += 1
    print(f"related_slugs 注入: {n} 本 / クラスタ定義 {len(CLUSTERS)} 本（全slug実在確認済み）")


if __name__ == "__main__":
    main()
