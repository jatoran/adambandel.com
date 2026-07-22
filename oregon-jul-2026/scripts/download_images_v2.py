"""Fetch stop photos via the shared tools/photos.py engine (Openverse + Commons).

Only the trip-specific stop -> search-query map lives here; the fetch engine,
filtering, pacing, magic-byte verification and manifest writing are in
tools/photos.py. Re-runnable (skips files already on disk).
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRIP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(TRIP)), "tools"))
from photos import fetch  # noqa: E402

# stop name -> search query. Stops sharing a query share their photos.
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

if __name__ == "__main__":
    fetch(QUERIES, root=TRIP, out_subdir="images",
          manifest_path=os.path.join(TRIP, "data", "images_manifest.json"),
          per=8, share_queries=True,
          ua="OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)")
