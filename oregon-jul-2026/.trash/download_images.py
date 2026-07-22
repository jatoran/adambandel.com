"""Download 2 photos per trip stop from Wikimedia Commons into ./images,
then write images_manifest.json mapping each stop name to its local files.
Re-runnable: skips files that already exist.
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

# stop name -> search query (mirrors the HTML's `places`)
PLACES = {
    "PDX / Portland Airport": "Portland International Airport Oregon exterior",
    "Downtown Portland": "Downtown Portland Oregon skyline",
    "Pittock Mansion viewpoint": "Pittock Mansion Portland Oregon view",
    "International Rose Test Garden": "International Rose Test Garden Portland Oregon",
    "Portland hotel area": "Downtown Portland Oregon skyline",
    "Vista House / Crown Point": "Vista House Crown Point Columbia River Gorge Oregon",
    "Latourell Falls": "Latourell Falls Oregon Columbia River Gorge",
    "Bridal Veil Falls": "Bridal Veil Falls Oregon Columbia River Gorge",
    "Wahkeena Falls": "Wahkeena Falls Oregon Columbia River Gorge",
    "Multnomah Falls": "Multnomah Falls Oregon",
    "Horsetail Falls": "Horsetail Falls Oregon Columbia River Gorge",
    "Timberline Lodge / Mt. Hood": "Timberline Lodge Mount Hood Oregon",
    "Trillium Lake": "Trillium Lake Mount Hood Oregon",
    "Cannon Beach hotel area": "Cannon Beach Oregon Haystack Rock",
    "Wayfarer Restaurant / Haystack Rock": "Haystack Rock Cannon Beach Oregon",
    "Ecola State Park": "Ecola State Park Oregon coast",
    "Indian Beach": "Indian Beach Ecola State Park Oregon",
    "Oswald West / Short Sand Beach": "Oswald West State Park Oregon",
    "Neahkahnie Viewpoint": "Neahkahnie Mountain Oregon",
    "Astoria": "Astoria Oregon Columbia River",
    "Fort Stevens / Peter Iredale": "Peter Iredale shipwreck Fort Stevens Oregon",
    "Cape Disappointment": "Cape Disappointment State Park Washington lighthouse",
}


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def api_search(query, limit=8, width=1600):
    params = {
        "origin": "*",
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": str(width),
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    pages = list((data.get("query", {}).get("pages", {}) or {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    out = []
    for p in pages:
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = info.get("mime", "")
        thumb = info.get("thumburl") or info.get("url")
        if not thumb or mime not in ("image/jpeg", "image/png"):
            continue
        out.append({
            "title": re.sub(r"^File:", "", p.get("title", "")),
            "thumb": thumb,
            "mime": mime,
        })
    return out


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def ext_for(mime):
    return ".png" if mime == "image/png" else ".jpg"


query_cache = {}   # query -> list of file records (relative path + title)
manifest = {}      # stop name -> list of file records

for stop, query in PLACES.items():
    if query in query_cache:
        manifest[stop] = query_cache[query]
        print(f"[reuse] {stop}  <-  same photos as another '{query}' stop")
        continue

    slug = slugify(stop)
    try:
        candidates = api_search(query)
    except Exception as e:
        print(f"[ERR ] {stop}: search failed: {e}")
        manifest[stop] = []
        query_cache[query] = []
        continue

    records = []
    n = 0
    for cand in candidates:
        if n >= 2:
            break
        n_try = n + 1
        fname = f"{slug}-{n_try}{ext_for(cand['mime'])}"
        dest = os.path.join(IMG_DIR, fname)
        rel = f"images/{fname}"
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            records.append({"file": rel, "title": cand["title"]})
            n = n_try
            print(f"[skip] {rel} (exists)")
            continue
        try:
            size = download(cand["thumb"], dest)
            records.append({"file": rel, "title": cand["title"]})
            n = n_try
            print(f"[ok  ] {rel}  ({size//1024} KB)  {cand['title']}")
            time.sleep(0.3)
        except Exception as e:
            print(f"[ERR ] {stop}: download failed ({cand['title']}): {e}")

    if not records:
        print(f"[WARN] {stop}: no usable images found")
    manifest[stop] = records
    query_cache[query] = records

with open(os.path.join(HERE, "images_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

total = sum(len(v) for v in manifest.values())
print(f"\nDone. {total} image references across {len(manifest)} stops.")
print("Manifest: images_manifest.json")
