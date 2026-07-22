"""Fetch 'ideas & alternatives' spot photos via the shared tools/photos.py engine.

Trip-specific idea key -> (query, must_any, must_not) map only. Files are written
as images/idea-<key>-NN.jpg into idea_images_manifest.json. Re-runnable (merges
into the existing manifest, skips files already on disk). For spots that come up
short, backfill_idea_images.py tops them up with corrected Commons queries.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRIP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(TRIP)), "tools"))
from photos import fetch  # noqa: E402

# key -> (query, must_any, must_not)
IDEAS = {
    "forest-park":         ("Forest Park Portland Oregon trail", ["portland", "forest", "wildwood"], ["wildfire", "national forest sign"]),
    "food-carts":          ("Portland Oregon food carts pod", ["cart", "food", "portland", "pod"], ["golf"]),
    "bonneville-hatchery":  ("Bonneville Fish Hatchery Oregon sturgeon", ["bonneville", "sturgeon", "hatchery", "herman"], ["blueprint"]),
    "bridge-of-the-gods":  ("Bridge of the Gods Cascade Locks Oregon", ["bridge", "cascade locks", "gods", "columbia"], []),
    "sandy-river-delta":   ("Sandy River Delta Oregon Troutdale", ["sandy river", "delta", "troutdale"], []),
    "hood-river":          ("Hood River Oregon waterfront downtown", ["hood river"], ["new york", "michigan"]),
    "rowena-crest":        ("Rowena Crest viewpoint Oregon", ["rowena"], []),
    "little-zigzag-falls":  ("Little Zigzag Falls Oregon", ["zigzag", "zig zag"], []),
    "salmon-river-trail":  ("Salmon River Trail Mount Hood Oregon", ["salmon river"], ["idaho", "alaska"]),
    "government-camp":      ("Government Camp Oregon Mount Hood", ["government camp", "mount hood", "mt hood", "timberline", "ski bowl"], []),
    "tolovana-beach":      ("Tolovana Beach Cannon Beach Oregon Haystack", ["tolovana", "cannon beach", "haystack", "arcadia"], []),
    "manzanita":           ("Manzanita Oregon beach Neahkahnie", ["manzanita", "neahkahnie", "nehalem"], ["california"]),
    "seaside-promenade":   ("Seaside Oregon promenade beach", ["seaside", "promenade"], ["california", "new jersey", "florida", "heights"]),
    "astoria-column":      ("Astoria Column Oregon", ["astoria", "column"], []),
    "astoria-riverwalk":   ("Astoria Oregon riverwalk waterfront trolley", ["astoria", "riverwalk", "trolley", "waterfront", "river"], []),
    "fort-clatsop":        ("Fort Clatsop Lewis and Clark Oregon", ["clatsop", "lewis"], []),
}

if __name__ == "__main__":
    fetch(IDEAS, root=TRIP, out_subdir="images", prefix="idea-",
          manifest_path=os.path.join(TRIP, "data", "idea_images_manifest.json"),
          per=5, merge=True, spot_pause=1.0,
          ua="OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)")
