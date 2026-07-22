"""Rebuild Downtown Portland and Timberline image sets from already-downloaded
files (no network): keep the good Commons shots + good Flickr originals, drop
the naked-bike-ride and Mt-Jefferson images. Updates images_manifest.json.
"""
import json
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "images")
REJ = os.path.join(HERE, ".trash", "rejected_images")
SUP = os.path.join(HERE, ".trash", "superseded_images")
os.makedirs(SUP, exist_ok=True)

C = lambda p: os.path.join(IMG, p)   # current images dir
R = lambda p: os.path.join(REJ, p)   # rejected (Flickr originals)

PLAN = {
    "downtown-portland": {
        "stops": ["Downtown Portland", "Portland hotel area"],
        "order": [
            (C("downtown-portland-01.jpg"), "Portland skyline panorama", "Wikimedia Commons"),
            (C("downtown-portland-02.jpg"), "McCormick Pier & downtown skyline", "Wikimedia Commons"),
            (R("downtown-portland-01.jpg"), "Downtown Portland (HDR)", "Flickr"),
            (R("downtown-portland-02.jpg"), "Twilight skyline", "Flickr"),
            (R("downtown-portland-03.jpg"), "Portland, Oregon", "Flickr"),
            (R("downtown-portland-04.jpg"), "Skyline & Hawthorne Bridge", "Flickr"),
            (R("downtown-portland-05.jpg"), "Portland dawn", "Flickr"),
            (R("downtown-portland-06.jpg"), "Good morning, Portland", "Flickr"),
        ],
    },
    "timberline-lodge-mt-hood": {
        "stops": ["Timberline Lodge / Mt. Hood"],
        "order": [
            (C("timberline-lodge-mt-hood-01.jpg"), "Timberline Lodge (WPA-built, 1937)", "Wikimedia Commons"),
            (R("timberline-lodge-mt-hood-01.jpg"), "Timberline Lodge, Mount Hood", "Flickr"),
            (R("timberline-lodge-mt-hood-02.jpg"), "Mount Hood", "Flickr"),
            (R("timberline-lodge-mt-hood-03.jpg"), "Mount Hood, Oregon", "Flickr"),
            (R("timberline-lodge-mt-hood-04.jpg"), "Mount Hood, Oregon", "Flickr"),
            (R("timberline-lodge-mt-hood-05.jpg"), "Mount Hood, Oregon", "Flickr"),
            (R("timberline-lodge-mt-hood-06.jpg"), "Mount Hood, Oregon", "Flickr"),
            (R("timberline-lodge-mt-hood-07.jpg"), "White River & White Falls", "Flickr"),
        ],
    },
}

manifest = json.load(open(os.path.join(HERE, "images_manifest.json"), encoding="utf-8"))

for slug, spec in PLAN.items():
    # read source bytes first (some sources live in images/ and will be cleared)
    blobs = []
    for src, title, source in spec["order"]:
        with open(src, "rb") as f:
            blobs.append((f.read(), title, source))
    # clear any current files for this slug out of images/
    for fn in os.listdir(IMG):
        if fn.startswith(slug + "-"):
            shutil.move(os.path.join(IMG, fn), os.path.join(SUP, fn))
    # write final sequential set
    records = []
    for i, (blob, title, source) in enumerate(blobs, 1):
        rel = f"images/{slug}-{i:02d}.jpg"
        with open(os.path.join(HERE, rel), "wb") as f:
            f.write(blob)
        records.append({"file": rel, "title": title, "source": source})
        print(f"  {rel}  <- {title} [{source}]")
    for stop in spec["stops"]:
        manifest[stop] = records
    print(f"-> {slug}: {len(records)} images\n")

json.dump(manifest, open(os.path.join(HERE, "images_manifest.json"), "w", encoding="utf-8"),
          indent=2, ensure_ascii=False)
print("Manifest updated.")
