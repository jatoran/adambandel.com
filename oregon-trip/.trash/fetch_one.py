"""Fetch a specific Commons file (by exact title) into a given local path."""
import json
import sys
import urllib.parse
import urllib.request

UA = "OregonTripMap/1.0 (personal trip planner; contact jordan.hale.31981@gmail.com)"


def fetch_title(title, dest, width=1600):
    params = {
        "origin": "*",
        "action": "query",
        "format": "json",
        "titles": "File:" + title,
        "prop": "imageinfo",
        "iiprop": "url|mime",
        "iiurlwidth": str(width),
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    page = list(data["query"]["pages"].values())[0]
    info = page["imageinfo"][0]
    thumb = info.get("thumburl") or info["url"]
    req2 = urllib.request.Request(thumb, headers={"User-Agent": UA})
    with urllib.request.urlopen(req2, timeout=60) as r:
        blob = r.read()
    with open(dest, "wb") as f:
        f.write(blob)
    print(f"saved {dest} ({len(blob)//1024} KB) from {title}")


jobs = [
    ("Portland International Airport main terminal - walkways (2024).jpg",
     "images/pdx-portland-airport-2.jpg"),
    ("Bridge and waterfront Sheryl Sloan (28882626456).jpg",
     "images/astoria-1.jpg"),
]
for title, dest in jobs:
    fetch_title(title, dest)
