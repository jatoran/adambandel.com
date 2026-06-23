"""Wire images_manifest.json into both HTML pages.

1. (one-time, idempotent) Convert the plan page's `imgs: [im(...)]` lines into
   `stop: '<manifest key>'` based on each place's name.
2. Inject `const STOP_IMAGES = {...}` between the IMAGES_DATA markers in both
   the map page and the plan page.

Re-run this any time the images change.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "oregon_trip_plan.html")
MAP = os.path.join(HERE, "oregon_trip_actual_route_with_large_images.html")

# plan-page place name -> manifest key
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

manifest = json.load(open(os.path.join(HERE, "images_manifest.json"), encoding="utf-8"))
slim = {k: [{"f": r["file"], "t": r["title"]} for r in v] for k, v in manifest.items()}
data_js = "const STOP_IMAGES = " + json.dumps(slim, ensure_ascii=False, separators=(",", ":")) + ";"

NAME_RE = re.compile(r"name:\s*(['\"])(.*?)\1")
IMGS_RE = re.compile(r"^(\s*)imgs:\s*\[.*\],?\s*$")


def convert_plan_imgs_to_stop(text):
    out, current_name, converted = [], None, 0
    for line in text.split("\n"):
        if "kind: 'place'" in line or 'kind: "place"' in line:
            m = NAME_RE.search(line)
            if m:
                current_name = m.group(2)
        m = IMGS_RE.match(line)
        if m and current_name is not None:
            key = NAME_TO_STOP.get(current_name)
            if key is None:
                raise SystemExit(f"No manifest key mapped for place name: {current_name!r}")
            out.append(f"{m.group(1)}stop: {json.dumps(key, ensure_ascii=False)},")
            converted += 1
            current_name = None
            continue
        out.append(line)
    return "\n".join(out), converted


def inject(text, marker, js):
    pattern = re.compile(
        r"(/\* " + marker + r"_START[^\n]*\*/\n).*?(\n\s*/\* " + marker + r"_END \*/)", re.S)
    if not pattern.search(text):
        raise SystemExit(marker + " markers not found")
    return pattern.sub(lambda m: m.group(1) + "    " + js + m.group(2), text)


# idea images (optional second manifest, plan page only)
idea_js = None
idea_slim = {}
idea_path = os.path.join(HERE, "idea_images_manifest.json")
if os.path.exists(idea_path):
    idea = json.load(open(idea_path, encoding="utf-8"))
    idea_slim = {k: [{"f": r["file"], "t": r["title"]} for r in v] for k, v in idea.items()}
    idea_js = "const IDEA_IMAGES = " + json.dumps(idea_slim, ensure_ascii=False, separators=(",", ":")) + ";"

# --- plan page ---
plan = open(PLAN, encoding="utf-8").read()
plan, n = convert_plan_imgs_to_stop(plan)
plan = inject(plan, "IMAGES_DATA", data_js)
if idea_js:
    plan = inject(plan, "IDEA_DATA", idea_js)
open(PLAN, "w", encoding="utf-8").write(plan)
print(f"plan page: converted {n} imgs->stop, STOP_IMAGES + IDEA_IMAGES injected")

# --- map page ---
mp = open(MAP, encoding="utf-8").read()
mp = inject(mp, "IMAGES_DATA", data_js)
open(MAP, "w", encoding="utf-8").write(mp)
print("map page: data injected")

total = sum(len(v) for v in slim.values())
print(f"STOP_IMAGES: {len(slim)} stops, {total} images, {len(data_js)} chars")
if idea_js:
    itotal = sum(len(v) for v in idea_slim.values())
    print(f"IDEA_IMAGES: {len(idea_slim)} spots, {itotal} images, {len(idea_js)} chars")
