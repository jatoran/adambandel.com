"""Wire the image manifests into the plan + map SOURCE pages (in .trash/) using the
shared tools/inject.py helpers, then rebundle:

    python tools/build_index.py oregon-jul-2026

Trip-specific bits (the place-name -> manifest-key map) stay here. The deliverable
is the bundled index.html; the editable sources are in .trash/. Re-runnable.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRIP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(TRIP)), "tools"))
from inject import slim_manifest, to_js, inject, convert_imgs_to_stop  # noqa: E402

DATA = os.path.join(TRIP, "data")
SRC = os.path.join(TRIP, ".trash")  # editable source pages (rebundled into index.html)
PLAN = os.path.join(SRC, "oregon_trip_plan.html")
MAP = os.path.join(SRC, "oregon_trip_actual_route_with_large_images.html")

# plan-page place name -> manifest key (only used if a place still uses `imgs:`)
NAME_TO_STOP = {
    "Land at PDX — 9:25 a.m.": "PDX / Portland Airport",
    "Downtown Portland": "Downtown Portland",
    "Pittock Mansion Viewpoint": "Pittock Mansion viewpoint",
    "International Rose Test Garden": "International Rose Test Garden",
    "Vista House / Crown Point": "Vista House / Crown Point",
    "Latourell Falls": "Latourell Falls",
    "Bridal Veil Falls": "Bridal Veil Falls",
    "Wahkeena Falls": "Wahkeena Falls",
    "Multnomah Falls": "Multnomah Falls",
    "Horsetail Falls": "Horsetail Falls",
    "Timberline Lodge / Mt. Hood": "Timberline Lodge / Mt. Hood",
    "Trillium Lake": "Trillium Lake",
    "Haystack Rock / Cannon Beach Sunset": "Cannon Beach hotel area",
    "Wayfarer Restaurant — Breakfast": "Wayfarer Restaurant / Haystack Rock",
    "Haystack Rock / Cannon Beach": "Cannon Beach hotel area",
    "Ecola State Park": "Ecola State Park",
    "Indian Beach": "Indian Beach",
    "Oswald West / Short Sand Beach": "Oswald West / Short Sand Beach",
    "Neahkahnie Viewpoint": "Neahkahnie Viewpoint",
    "Fort Stevens / Peter Iredale": "Fort Stevens / Peter Iredale",
    "Astoria": "Astoria",
    "Cape Disappointment, Washington": "Cape Disappointment",
}

manifest = json.load(open(os.path.join(DATA, "images_manifest.json"), encoding="utf-8"))
stop_js = to_js("STOP_IMAGES", slim_manifest(manifest))

idea_js = None
idea_path = os.path.join(DATA, "idea_images_manifest.json")
if os.path.exists(idea_path):
    idea = json.load(open(idea_path, encoding="utf-8"))
    idea_js = to_js("IDEA_IMAGES", slim_manifest(idea))

# --- plan source page ---
plan = open(PLAN, encoding="utf-8").read()
plan, n = convert_imgs_to_stop(plan, NAME_TO_STOP)
plan = inject(plan, "IMAGES_DATA", stop_js)
if idea_js:
    plan = inject(plan, "IDEA_DATA", idea_js)
open(PLAN, "w", encoding="utf-8").write(plan)
print(f"plan source: converted {n} imgs->stop, STOP_IMAGES"
      + (" + IDEA_IMAGES" if idea_js else "") + " injected")

# --- map source page ---
mp = open(MAP, encoding="utf-8").read()
mp = inject(mp, "IMAGES_DATA", stop_js)
open(MAP, "w", encoding="utf-8").write(mp)
print("map source: STOP_IMAGES injected")

total = sum(len(v) for v in manifest.values())
print(f"STOP_IMAGES: {len(manifest)} stops, {total} images.")
print("Now rebundle: python tools/build_index.py oregon-jul-2026")
