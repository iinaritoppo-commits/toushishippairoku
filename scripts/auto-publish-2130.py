#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
投資失敗録 X予約スクリプト（毎日21:30 cron）

設計：
- approved/*.json 直読みベース（microCMS不要、[slug].astro が getStaticPaths でビルド時に拾う）
- 「Xにまだ出してないslug」を曜日カテゴリから1本選ぶ
- X投稿用テキストを logs/x-post-pending.txt に追記
- macOS通知でとよくんに「コピペどうぞ」
- .env に X API キーがあれば自動投稿、無ければ pending のみ
- 投稿済みslugは logs/x-posted-slugs.txt に追記
- ビルド・デプロイは別タイミング（記事追加時のみ・このスクリプトでは行わない）

曜日割：
  月 = fx       （FX破産）
  火 = crypto   （暗号資産）
  水 = fraud    （投資詐欺）
  木 = stocks   （株式信用/オプション）
  金 = realestate（不動産）
  土 = funds    （ファンド・投信）
  日 = other    （CFD/先物/その他）

fallback: 在庫切れ時は sidejob → 任意未投稿の順
"""
import json, os, sys, urllib.request, urllib.error, subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPROVED = ROOT / "approved"
LOGS = ROOT / "logs"
LOGS.mkdir(exist_ok=True)
LOG_FILE = LOGS / "publish.log"
POSTED_FILE = LOGS / "x-posted-slugs.txt"
PENDING_FILE = LOGS / "x-post-pending.txt"

SITE_URL = "https://toushishippairoku.com"

# .env or environ から取得（GitHub Actions対応）
def _get_env(key):
    v = os.environ.get(key)
    if v: return v
    env_file = ROOT / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.startswith(f"{key}=") and not line.strip().startswith("#"):
                    return line.strip().split("=", 1)[1]
    return ""

env = {"MICROCMS_SERVICE_DOMAIN": _get_env("MICROCMS_SERVICE_DOMAIN"), "MICROCMS_API_KEY": _get_env("MICROCMS_API_KEY")}

DOW_GENRE = {
    0: "fx",          # 月
    1: "crypto",      # 火
    2: "fraud",       # 水
    3: "stocks",      # 木
    4: "realestate",  # 金
    5: "funds",       # 土
    6: "other",       # 日
}
FALLBACK_ORDER = ["fx", "crypto", "fraud", "stocks", "realestate",
                  "funds", "other", "sidejob"]

GENRE_TAGS = {
    "fx":         "#FX #投資失敗",
    "crypto":     "#暗号資産 #投資失敗",
    "fraud":      "#投資詐欺 #投資失敗",
    "stocks":     "#株式投資 #投資失敗",
    "realestate": "#不動産投資 #投資失敗",
    "funds":      "#投資信託 #投資失敗",
    "other":      "#投資失敗",
    "sidejob":    "#副業 #投資失敗",
}


def log(msg):
    line = f"[{datetime.now().isoformat(timespec='seconds')}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def load_posted_slugs():
    if not POSTED_FILE.exists():
        return set()
    return {l.strip() for l in POSTED_FILE.read_text().splitlines() if l.strip()}


def append_posted(slug):
    with open(POSTED_FILE, "a") as f:
        f.write(slug + "\n")


def list_approved_by_genre(prefix):
    return sorted(APPROVED.glob(f"draft-{prefix}-*.json"))


def pick_target(posted_slugs, genre):
    for f in list_approved_by_genre(genre):
        try:
            j = json.loads(f.read_text(encoding="utf-8"))
            if j.get("slug") and j["slug"] not in posted_slugs:
                return j, f
        except Exception:
            pass
    return None, None


def build_x_post(item):
    """X投稿用280字以内テキスト"""
    title = item["title"]
    desc = item.get("description", "")
    slug = item["slug"]
    cat = item.get("category", "fx")
    tags = GENRE_TAGS.get(cat, "#投資失敗")

    # 1文目で切る（句点 or 120字）
    if "。" in desc:
        first = desc.split("。")[0] + "。"
    else:
        first = desc[:120]
    if len(first) > 120:
        first = first[:118] + "…"

    # 損失額あれば1行追加
    loss = item.get("loss_amount_yen", 0)
    loss_line = ""
    if loss and loss >= 10000:
        if loss >= 100000000:
            loss_line = f"溶かした金額：{loss/100000000:.1f}億円\n"
        elif loss >= 10000:
            loss_line = f"溶かした金額：{loss/10000:.0f}万円\n"

    text = (
        f"{title}\n\n"
        f"{first}\n"
        f"{loss_line}\n"
        f"{SITE_URL}/articles/{slug}/\n\n"
        f"💀 {tags}"
    )
    return text


def write_x_pending(item):
    text = build_x_post(item)
    with open(PENDING_FILE, "a") as f:
        f.write(f"\n===== {datetime.now().isoformat(timespec='seconds')} =====\n")
        f.write(f"slug: {item['slug']}\n")
        f.write(f"title: {item['title']}\n")
        f.write(f"chars: {len(text)} (URL=23字換算)\n")
        f.write(f"---\n{text}\n---\n")
    return text, len(text)


def try_post_to_x(text):
    keys = ("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET")
    if not all(env.get(k) for k in keys):
        return False, "X API keys not set in .env"
    try:
        import tweepy
    except ImportError:
        return False, "tweepy not installed (pip install tweepy)"
    try:
        client = tweepy.Client(
            consumer_key=env["X_API_KEY"],
            consumer_secret=env["X_API_SECRET"],
            access_token=env["X_ACCESS_TOKEN"],
            access_token_secret=env["X_ACCESS_TOKEN_SECRET"],
        )
        resp = client.create_tweet(text=text)
        tid = resp.data.get("id") if resp.data else None
        return True, f"tweet_id={tid}"
    except Exception as e:
        return False, str(e)


def notify_macos(title_str, message):
    try:
        t = title_str.replace('"', '\\"')
        m = message.replace('"', '\\"')
        subprocess.run(
            ["osascript", "-e",
             f'display notification "{m}" with title "{t}" sound name "Submarine"'],
            timeout=5
        )
    except Exception as e:
        log(f"  notify failed: {e}")


def main():
    now = datetime.now()
    dow = now.weekday()
    primary = DOW_GENRE[dow]
    log(f"=== auto-publish-toushi start  dow={dow} primary={primary} ===")

    posted = load_posted_slugs()
    log(f"X-posted so far: {len(posted)} slugs")

    item, src = pick_target(posted, primary)
    if not item:
        log(f"No unposted stock for {primary}, trying fallback...")
        for fb in FALLBACK_ORDER:
            if fb == primary:
                continue
            item, src = pick_target(posted, fb)
            if item:
                log(f"  fallback hit: {fb}")
                break

    if not item:
        log("ALL X-POSTED. Out of stock. (正常終了：X投稿は任意なのでビルド&デプロイは継続)")
        notify_macos("投資失敗録：X在庫切れ", "approved 全てX投稿済み")
        return 0

    log(f"Target: {item['slug']}  ({src.name})")

    try:
        x_text, n = write_x_pending(item)
        log(f"  ✓ X-pending written ({n} chars) → {PENDING_FILE.name}")
    except Exception as e:
        log(f"  ✗ X-pending failed: {e}")
        return 2

    ok, msg = try_post_to_x(x_text)
    if ok:
        log(f"  ✓ X posted automatically: {msg}")
        append_posted(item["slug"])
        notify_macos("投資失敗録：X自動投稿完了",
                     f"{item['title'][:30]}…")
    else:
        log(f"  ⚠ X auto-post skipped: {msg}")
        notify_macos("投資失敗録：X投稿準備OK（手動）",
                     f"{item['title'][:30]}… ({n}字)")

    log("=== done ===\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
