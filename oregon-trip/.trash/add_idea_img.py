"""Insert `img: '<key>'` into each DAY_IDEAS entry by matching a token in its
name line. Idempotent (skips lines that already have img:). Only edits inside
the DAY_IDEAS block.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "oregon_trip_plan.html")

# token found in the idea's name -> idea image key
TOKEN_KEY = [
    ("Forest Park", "forest-park"),
    ("food-cart pod", "food-carts"),
    ("Bonneville Fish Hatchery", "bonneville-hatchery"),
    ("Thunder Island Brewing", "bridge-of-the-gods"),
    ("Sandy River Delta", "sandy-river-delta"),
    ("Hood River detour", "hood-river"),
    ("Rowena Crest", "rowena-crest"),
    ("Little Zigzag Falls", "little-zigzag-falls"),
    ("Old Salmon River Trail", "salmon-river-trail"),
    ("Government Camp lunch", "government-camp"),
    ("Tolovana", "tolovana-beach"),
    ("Manzanita (dog-town", "manzanita"),
    ("Seaside Promenade", "seaside-promenade"),
    ("Astoria Column", "astoria-column"),
    ("Bowpicker", "astoria-riverwalk"),
    ("Fort Clatsop", "fort-clatsop"),
]

text = open(PLAN, encoding="utf-8").read()
start = text.index("const DAY_IDEAS")
end = text.index("const TRIP_NOTES")
block = text[start:end]

lines = block.split("\n")
out, added = [], 0
for line in lines:
    if "name:" in line and "img:" not in line:
        for token, key in TOKEN_KEY:
            if token in line:
                line = line.rstrip() + f" img: '{key}',"
                added += 1
                break
    out.append(line)
new_block = "\n".join(out)

text = text[:start] + new_block + text[end:]
open(PLAN, "w", encoding="utf-8").write(text)
print(f"inserted img keys on {added} idea lines")
