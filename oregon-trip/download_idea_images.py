"""Fetch photos for the 'ideas & alternatives' spots into ./images and write
idea_images_manifest.json (keyed by idea key). Same multi-source approach as
download_images_v2.py (Openverse + Wikimedia Commons), with per-spot title
filters and gentle pacing to avoid rate limits. Re-runnable (skips existing).
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(HERE, "images")
os.makedirs(IMG_DIR, exist_ok=True)
UA = "OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)"
TARGET = 5

# key -> (query, must_any, must_not)
IDEAS = {
    "forest-park":        ("Forest Park Portland Oregon trail", ["portland", "forest", "wildwood"], ["wildfire", "national forest sign"]),
    "food-carts":         ("Portland Oregon food carts pod", ["cart", "food", "portland", "pod"], ["golf"]),
    "bonneville-hatchery":("Bonneville Fish Hatchery Oregon sturgeon", ["bonneville", "sturgeon", "hatchery", "herman"], ["blueprint"]),
    "bridge-of-the-gods": ("Bridge of the Gods Cascade Locks Oregon", ["bridge", "cascade locks", "gods", "columbia"], []),
    "sandy-river-delta":  ("Sandy River Delta Oregon Troutdale", ["sandy river", "delta", "troutdale"], []),
    "hood-river":         ("Hood River Oregon waterfront downtown", ["hood river"], ["new york", "michigan"]),
    "rowena-crest":       ("Rowena Crest viewpoint Oregon", ["rowena"], []),
    "little-zigzag-falls":("Little Zigzag Falls Oregon", ["zigzag", "zig zag"], []),
    "salmon-river-trail": ("Salmon River Trail Mount Hood Oregon", ["salmon river"], ["idaho", "alaska"]),
    "government-camp":     ("Government Camp Oregon Mount Hood", ["government camp", "mount hood", "mt hood", "timberline", "ski bowl"], []),
    "tolovana-beach":     ("Tolovana Beach Cannon Beach Oregon Haystack", ["tolovana", "cannon beach", "haystack", "arcadia"], []),
    "manzanita":          ("Manzanita Oregon beach Neahkahnie", ["manzanita", "neahkahnie", "nehalem"], ["california"]),
    "seaside-promenade":  ("Seaside Oregon promenade beach", ["seaside", "promenade"], ["california", "new jersey", "florida", "heights"]),
    "astoria-column":     ("Astoria Column Oregon", ["astoria", "column"], []),
    "astoria-riverwalk":  ("Astoria Oregon riverwalk waterfront trolley", ["astoria", "riverwalk", "trolley", "waterfront", "river"], []),
    "fort-clatsop":       ("Fort Clatsop Lewis and Clark Oregon", ["clatsop", "lewis"], []),
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


def openverse(query, must_any, must_not):
    out = []
    try:
        data = get_json("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(
            {"q": query, "page_size": "30", "mature": "false"}))
    except Exception as e:
        print("    openverse error:", e); return out
    for r in data.get("results", []):
        src = r.get("url")
        if not src or not re.search(r"\.(jpg|jpeg|png)(\?|$)", src, re.I):
            continue
        title = (r.get("title") or "").strip()
        if passes(title, must_any, must_not) and ok_dims(r.get("width"), r.get("height")):
            out.append({"url": src, "title": title or query, "source": (r.get("provider") or "openverse").capitalize()})
    return out


def commons(query, must_any, must_not):
    out = []
    try:
        data = get_json("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
            {"origin": "*", "action": "query", "format": "json", "generator": "search",
             "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": "16",
             "prop": "imageinfo", "iiprop": "url|mime|size", "iiurlwidth": "1400"}))
    except Exception as e:
        print("    commons error:", e); return out
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


manifest = {}
mpath = os.path.join(HERE, "idea_images_manifest.json")
if os.path.exists(mpath):
    manifest = json.load(open(mpath, encoding="utf-8"))

for key, (query, must_any, must_not) in IDEAS.items():
    print(f"\n=== {key}  ('{query}') ===")
    cands = openverse(query, must_any, must_not)
    time.sleep(0.5)
    seen = {c["url"] for c in cands}
    for c in commons(query, must_any, must_not):
        if c["url"] not in seen:
            cands.append(c); seen.add(c["url"])

    records, n = [], 0
    for c in cands:
        if n >= TARGET:
            break
        idx = n + 1
        ext = ".png" if c["url"].lower().split("?")[0].endswith(".png") else ".jpg"
        rel = f"images/idea-{key}-{idx:02d}{ext}"
        dest = os.path.join(HERE, rel)
        if os.path.exists(dest) and os.path.getsize(dest) > 8000:
            records.append({"file": rel, "title": c["title"], "source": c["source"]}); n = idx
            print(f"  [skip] {rel}"); continue
        try:
            size = download(c["url"], dest)
            records.append({"file": rel, "title": c["title"], "source": c["source"]}); n = idx
            print(f"  [ok ] {rel}  {size//1024:>4} KB  [{c['source']}]  {c['title'][:44]}")
            time.sleep(0.5)
        except Exception as e:
            print(f"  [ERR] {c['url'][:55]}: {e}")

    if len(records) < 2:
        print(f"  [WARN] only {len(records)} for {key}")
    manifest[key] = records
    time.sleep(1.0)  # be polite between spots

json.dump(manifest, open(mpath, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
total = sum(len(v) for v in manifest.values())
print(f"\nDone. {total} idea images across {len(manifest)} spots -> idea_images_manifest.json")
print("Counts:", json.dumps({k: len(v) for k, v in manifest.items()}, ensure_ascii=False))
