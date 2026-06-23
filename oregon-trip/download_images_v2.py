"""Fetch 5-10 nice photos per trip stop from Openverse (Flickr/CC) + Wikimedia
Commons into ./images, then write images_manifest.json mapping stop -> [files].

Openverse is queried first (better travel photography); Commons fills in.
Re-runnable: skips image files that already exist on disk.
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
TARGET = 8          # images per stop
MIN_SIDE = 500      # reject anything smaller on both sides
MIN_LONG = 820      # require the long edge to be at least this

# stop name -> search query.  Stops that share a query share their photos.
QUERIES = {
    "PDX / Portland Airport": "Portland International Airport terminal",
    "Downtown Portland": "Portland Oregon downtown skyline",
    "Pittock Mansion viewpoint": "Pittock Mansion Portland view",
    "International Rose Test Garden": "International Rose Test Garden Portland",
    "Portland hotel area": "Portland Oregon downtown skyline",
    "Vista House / Crown Point": "Vista House Crown Point Columbia Gorge",
    "Latourell Falls": "Latourell Falls Oregon",
    "Bridal Veil Falls": "Bridal Veil Falls Oregon Columbia Gorge",
    "Wahkeena Falls": "Wahkeena Falls Oregon",
    "Multnomah Falls": "Multnomah Falls Oregon",
    "Horsetail Falls": "Horsetail Falls Columbia Gorge Oregon",
    "Timberline Lodge / Mt. Hood": "Timberline Lodge Mount Hood Oregon",
    "Trillium Lake": "Trillium Lake Mount Hood Oregon",
    "Cannon Beach hotel area": "Cannon Beach Haystack Rock Oregon",
    "Wayfarer Restaurant / Haystack Rock": "Cannon Beach Haystack Rock Oregon",
    "Ecola State Park": "Ecola State Park Oregon coast",
    "Indian Beach": "Indian Beach Ecola State Park Oregon",
    "Oswald West / Short Sand Beach": "Oswald West State Park Short Sand Beach Oregon",
    "Neahkahnie Viewpoint": "Neahkahnie Mountain Oregon coast",
    "Astoria": "Astoria Oregon waterfront bridge",
    "Fort Stevens / Peter Iredale": "Peter Iredale shipwreck Fort Stevens Oregon",
    "Cape Disappointment": "Cape Disappointment lighthouse Washington",
}

JUNK = ("map of", "diagram", "advertis", "logo", "schematic", "timetable",
        "brochure", " chart", "blueprint", "floor plan", "trail map")


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def ok_dims(w, h):
    if not w or not h:
        return True  # unknown — let it through, dedup/quality handled elsewhere
    if w < MIN_SIDE or h < MIN_SIDE:
        return False
    if max(w, h) < MIN_LONG:
        return False
    ratio = w / h
    return 0.45 <= ratio <= 2.9


def clean_title(t):
    return re.sub(r"^File:", "", (t or "")).strip()


def is_junk(title):
    low = (title or "").lower()
    return any(j in low for j in JUNK)


def from_openverse(query):
    out = []
    try:
        url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode({
            "q": query, "page_size": "20", "mature": "false",
        })
        data = get_json(url)
    except Exception as e:
        print(f"    openverse error: {e}")
        return out
    for r in data.get("results", []):
        src = r.get("url")
        if not src or not re.search(r"\.(jpg|jpeg|png)(\?|$)", src, re.I):
            continue
        title = clean_title(r.get("title"))
        if is_junk(title):
            continue
        if not ok_dims(r.get("width"), r.get("height")):
            continue
        out.append({"url": src, "title": title or query,
                    "source": (r.get("provider") or "openverse").capitalize()})
    return out


def from_commons(query):
    out = []
    try:
        url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
            "origin": "*", "action": "query", "format": "json",
            "generator": "search", "gsrsearch": query, "gsrnamespace": "6",
            "gsrlimit": "14", "prop": "imageinfo", "iiprop": "url|mime|size",
            "iiurlwidth": "1400",
        })
        data = get_json(url)
    except Exception as e:
        print(f"    commons error: {e}")
        return out
    pages = list((data.get("query", {}).get("pages", {}) or {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    for p in pages:
        info = (p.get("imageinfo") or [None])[0]
        if not info or info.get("mime") not in ("image/jpeg", "image/png"):
            continue
        title = clean_title(p.get("title"))
        if is_junk(title):
            continue
        if not ok_dims(info.get("thumbwidth"), info.get("thumbheight")):
            continue
        out.append({"url": info.get("thumburl") or info.get("url"),
                    "title": title, "source": "Wikimedia Commons"})
    return out


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        blob = r.read()
    if len(blob) < 8000:  # too small to be a real photo
        raise ValueError("file too small (%d bytes)" % len(blob))
    with open(dest, "wb") as f:
        f.write(blob)
    return len(blob)


query_cache = {}   # query -> list of file records
manifest = {}

for stop, query in QUERIES.items():
    if query in query_cache:
        manifest[stop] = query_cache[query]
        print(f"[reuse] {stop}  <-  shares '{query}'")
        continue

    print(f"\n=== {stop}  ('{query}') ===")
    # Openverse first (nicer), then Commons to fill; dedupe by URL.
    candidates = from_openverse(query)
    time.sleep(0.4)
    seen_urls = {c["url"] for c in candidates}
    for c in from_commons(query):
        if c["url"] not in seen_urls:
            candidates.append(c)
            seen_urls.add(c["url"])

    slug = slugify(stop)
    records, n = [], 0
    for cand in candidates:
        if n >= TARGET:
            break
        idx = n + 1
        ext = ".png" if cand["url"].lower().split("?")[0].endswith(".png") else ".jpg"
        fname = f"{slug}-{idx:02d}{ext}"
        dest = os.path.join(IMG_DIR, fname)
        rel = f"images/{fname}"
        if os.path.exists(dest) and os.path.getsize(dest) > 8000:
            records.append({"file": rel, "title": cand["title"], "source": cand["source"]})
            n = idx
            print(f"  [skip] {rel} (exists)")
            continue
        try:
            size = download(cand["url"], dest)
            records.append({"file": rel, "title": cand["title"], "source": cand["source"]})
            n = idx
            print(f"  [ok  ] {rel}  {size//1024:>4} KB  [{cand['source']}]  {cand['title'][:48]}")
            time.sleep(0.25)
        except Exception as e:
            print(f"  [ERR ] {cand['url'][:60]}: {e}")

    if len(records) < 3:
        print(f"  [WARN] only {len(records)} images for {stop}")
    manifest[stop] = records
    query_cache[query] = records

with open(os.path.join(HERE, "images_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

total = sum(len(v) for v in manifest.values())
counts = {s: len(v) for s, v in manifest.items()}
print(f"\nDone. {total} images across {len(manifest)} stops.")
print("Per-stop:", json.dumps(counts, ensure_ascii=False))
