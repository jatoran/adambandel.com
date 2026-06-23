"""Backfill the idea spots that came up short, using better Commons queries +
junk filters. Appends to existing files/manifest (continues numbering).
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)"

# key -> (target, query, must_any, must_not)
BACKFILL = {
    "hood-river":         (5, "Hood River Oregon", ["hood river"], ["life flight", "helicopter", "middle school", "district", "map of", "diagram"]),
    "tolovana-beach":     (5, "Tolovana Beach Oregon", ["tolovana", "arcadia"], ["map"]),
    "astoria-riverwalk":  (5, "Astoria Riverfront Trolley Oregon", ["astoria"], ["map", "diagram"]),
    "sandy-river-delta":  (4, "Sandy River Delta Oregon", ["sandy", "delta", "bird blind"], ["map", "diagram", "district"]),
    "salmon-river-trail": (4, "Salmon River Oregon Mount Hood", ["salmon river"], ["1915", "woman", ".pdf", ".djvu", "district", "map", "journal", "names"]),
    "little-zigzag-falls":(4, "Little Zigzag Falls", ["zigzag", "zig zag"], [".pdf", ".djvu", "trail system", "skyline", "directory", "book", "1911", "1877", "outings", "out of doors"]),
    "seaside-promenade":  (5, "Seaside Oregon beach promenade turnaround", ["seaside", "promenade", "prom"], ["california", "new jersey", "florida", "heights", "map"]),
}


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def ok_dims(w, h):
    if not w or not h:
        return True
    if w < 500 or h < 500 or max(w, h) < 820:
        return False
    return 0.45 <= (w / h) <= 2.9


def passes(title, must_any, must_not):
    low = (title or "").lower()
    if must_any and not any(k in low for k in must_any):
        return False
    return not any(k in low for k in must_not)


def commons(query, must_any, must_not):
    out = []
    data = get_json("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {"origin": "*", "action": "query", "format": "json", "generator": "search",
         "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": "24",
         "prop": "imageinfo", "iiprop": "url|mime|size", "iiurlwidth": "1400"}))
    pages = sorted((data.get("query", {}).get("pages", {}) or {}).values(), key=lambda p: p.get("index", 999))
    for p in pages:
        info = (p.get("imageinfo") or [None])[0]
        if not info or info.get("mime") not in ("image/jpeg", "image/png"):
            continue
        title = re.sub(r"^File:", "", p.get("title", ""))
        if passes(title, must_any, must_not) and ok_dims(info.get("thumbwidth"), info.get("thumbheight")):
            out.append({"url": info.get("thumburl") or info.get("url"), "title": title, "source": "Wikimedia Commons"})
    return out


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        blob = r.read()
    if len(blob) < 8000:
        raise ValueError("too small")
    with open(dest, "wb") as f:
        f.write(blob)
    return len(blob)


mpath = os.path.join(HERE, "idea_images_manifest.json")
manifest = json.load(open(mpath, encoding="utf-8"))

for key, (target, query, must_any, must_not) in BACKFILL.items():
    have = manifest.get(key, [])
    existing_titles = {r["title"] for r in have}
    n = len(have)
    if n >= target:
        print(f"[ok] {key} already has {n}")
        continue
    print(f"\n=== backfill {key} (have {n}, want {target}) '{query}' ===")
    try:
        cands = commons(query, must_any, must_not)
    except Exception as e:
        print("  commons error:", e); continue
    for c in cands:
        if n >= target:
            break
        if c["title"] in existing_titles:
            continue
        idx = n + 1
        ext = ".png" if c["url"].lower().split("?")[0].endswith(".png") else ".jpg"
        rel = f"images/idea-{key}-{idx:02d}{ext}"
        try:
            size = download(c["url"], os.path.join(HERE, rel))
            have.append({"file": rel, "title": c["title"], "source": c["source"]})
            existing_titles.add(c["title"]); n = idx
            print(f"  [ok ] {rel}  {size//1024:>4} KB  {c['title'][:46]}")
            time.sleep(0.6)
        except Exception as e:
            print(f"  [ERR] {c['url'][:55]}: {e}")
    manifest[key] = have
    if len(have) < 2:
        print(f"  [WARN] {key} still only {len(have)}")
    time.sleep(1.2)

json.dump(manifest, open(mpath, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nCounts:", json.dumps({k: len(v) for k, v in manifest.items()}, ensure_ascii=False))
