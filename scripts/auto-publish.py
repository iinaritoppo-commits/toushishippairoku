#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
投資失敗録 毎日21時 自走公開スクリプト（雛型）

実装予定の流れ：
1. /approved/ から「次に公開する記事」を1本選択（curr_index で順次）
2. microCMS API（patch）で本番反映
3. OGP画像を生成（gen-ogp.py 呼び出し）
4. X予約投稿（怪談録の x-scheduler.py を移植予定）
5. ログを memory に書き出し

cron 例:
  0 21 * * * cd /Users/toppo/マイファイル/投資失敗録 && python3 scripts/auto-publish.py >> logs/publish.log 2>&1
"""
import os
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
APPROVED = ROOT / "approved"  # 公開待ち記事の json 置き場
LOGS = ROOT / "logs"

LOGS.mkdir(exist_ok=True)
APPROVED.mkdir(exist_ok=True)

def log(msg):
    print(f"[{datetime.now().isoformat()}] {msg}")

def pick_next_article():
    """approved/ から次の記事を選ぶ（修正：日付順 or genre rotation）"""
    files = sorted(APPROVED.glob("*.json"))
    if not files:
        log("No approved articles to publish")
        return None
    return files[0]

def publish_to_microcms(article_path):
    """microCMS に PATCH で公開"""
    log(f"Publishing: {article_path.name}")
    # TODO: microcms client で PATCH
    # MICROCMS_API_KEY = os.environ.get("MICROCMS_API_KEY")
    # ... PATCH /api/v1/articles/<slug>
    pass

def main():
    log("=== Auto publish start ===")
    article = pick_next_article()
    if not article:
        log("Nothing to publish, exiting")
        return
    publish_to_microcms(article)
    # 次工程：
    # 1. gen-ogp.py 実行
    # 2. X予約投稿
    log("=== Done ===")

if __name__ == "__main__":
    main()
