"""Rebuild image sets for specific stops with strict title include/exclude
filters, to fix off-topic search results. Updates images_manifest.json in place.
Old files for each rebuilt slug are moved to .trash (not deleted).
"""
import json
import os
import re
import shutil
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(HERE, "images")
TRASH = os.path.join(HERE, ".trash", "rejected_images")
os.makedirs(TRASH, exist_ok=True)
UA = "OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)"

# Each fix: which stops to (re)assign, the query, and title filters.
FIXES = [
    {
        "stops": ["PDX / Portland Airport"], "slug": "pdx-portland-airport",
        "query": "PDX Portland International Airport", "target": 6,
        "must_any": ["portland", "pdx"],
        "must_not": ["newark", "seatac", "sea-tac", "spruce goose", "francisco",
                     "chicago", "denver", "atlanta", "minor", "seattle", "los angeles"],
    },
    {
        "stops": ["Bridal Veil Falls"], "slug": "bridal-veil-falls",
        "query": "Bridal Veil Falls Oregon", "target": 6,
        "must_any": ["bridal"],
        "must_not": ["multnomah", "washington", "telluride", "utah", "yosemite", "wedding"],
    },
    {
        "stops": ["Downtown Portland", "Portland hotel area"], "slug": "downtown-portland",
        "query": "Portland Oregon downtown skyline", "target": 8,
        "must_any": ["portland"],
        "must_not": ["naked", "nude", "bike ride"],
    },
    {
        "stops": ["Timberline Lodge / Mt. Hood"], "slug": "timberline-lodge-mt-hood",
        "query": "Timberline Lodge Mount Hood Oregon", "target": 8,
        "must_any": ["hood", "timberline"],
        "must_not": ["jefferson", "helens", "adams", "rainier", "shasta", "bachelor"],
    },
]


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def passes(title, must_any, must_not):
    low = (title or "").lower()
    if must_any and not any(k in low for k in must_any):
        return False
    if any(k in low for k in must_not):
        return False
    return True


def ok_dims(w, h):
    if not w or not h:
        return True
    if w < 500 or h < 500 or max(w, h) < 820:
        return False
    return 0.45 <= (w / h) <= 2.9


def openverse(query, must_any, must_not):
    out = []
    try:
        data = get_json("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(
            {"q": query, "page_size": "30", "mature": "false"}))
    except Exception as e:
        print("  openverse error:", e); return out
    for r in data.get("results", []):
        src = r.get("url")
        if not src or not re.search(r"\.(jpg|jpeg|png)(\?|$)", src, re.I):
            continue
        title = (r.get("title") or "").strip()
        if not passes(title, must_any, must_not) or not ok_dims(r.get("width"), r.get("height")):
            continue
        out.append({"url": src, "title": title or query,
                    "source": (r.get("provider") or "openverse").capitalize()})
    return out


def commons(query, must_any, must_not):
    out = []
    try:
        data = get_json("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
            {"origin": "*", "action": "query", "format": "json", "generator": "search",
             "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": "20",
             "prop": "imageinfo", "iiprop": "url|mime|size", "iiurlwidth": "1400"}))
    except Exception as e:
        print("  commons error:", e); return out
    pages = sorted((data.get("query", {}).get("pages", {}) or {}).values(),
                   key=lambda p: p.get("index", 999))
    for p in pages:
        info = (p.get("imageinfo") or [None])[0]
        if not info or info.get("mime") not in ("image/jpeg", "image/png"):
            continue
        title = re.sub(r"^File:", "", p.get("title", ""))
        if not passes(title, must_any, must_not) or not ok_dims(info.get("thumbwidth"), info.get("thumbheight")):
            continue
        out.append({"url": info.get("thumburl") or info.get("url"),
                    "title": title, "source": "Wikimedia Commons"})
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


manifest = json.load(open(os.path.join(HERE, "images_manifest.json"), encoding="utf-8"))

for fix in FIXES:
    slug = fix["slug"]
    print(f"\n=== fixing {slug} ===")
    # move existing files for this slug to .trash
    for fn in os.listdir(IMG_DIR):
        if re.match(rf"^{re.escape(slug)}-\d+\.(jpg|png)$", fn):
            shutil.move(os.path.join(IMG_DIR, fn), os.path.join(TRASH, fn))

    cands = openverse(fix["query"], fix["must_any"], fix["must_not"])
    time.sleep(0.4)
    seen = {c["url"] for c in cands}
    for c in commons(fix["query"], fix["must_any"], fix["must_not"]):
        if c["url"] not in seen:
            cands.append(c); seen.add(c["url"])

    records, n = [], 0
    for c in cands:
        if n >= fix["target"]:
            break
        idx = n + 1
        ext = ".png" if c["url"].lower().split("?")[0].endswith(".png") else ".jpg"
        rel = f"images/{slug}-{idx:02d}{ext}"
        try:
            size = download(c["url"], os.path.join(HERE, rel))
            records.append({"file": rel, "title": c["title"], "source": c["source"]})
            n = idx
            print(f"  [ok ] {rel}  {size//1024:>4} KB  [{c['source']}]  {c['title'][:46]}")
            time.sleep(0.2)
        except Exception as e:
            print(f"  [ERR] {c['url'][:55]}: {e}")

    for stop in fix["stops"]:
        manifest[stop] = records
    print(f"  -> {len(records)} images, assigned to: {', '.join(fix['stops'])}")

json.dump(manifest, open(os.path.join(HERE, "images_manifest.json"), "w", encoding="utf-8"),
          indent=2, ensure_ascii=False)
print("\nManifest updated.")
