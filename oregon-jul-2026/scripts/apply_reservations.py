"""Wire reservations.json into the Reservations SOURCE page (in .trash/) using the
shared tools/reservations.py engine, then rebundle:

    python tools/build_index.py oregon-jul-2026

The engine (validate + compute totals + build the inline JS) lives in
tools/reservations.py; this wrapper only knows this trip's paths. Re-runnable.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRIP = os.path.dirname(HERE)
TOOLS = os.path.join(os.path.dirname(os.path.dirname(TRIP)), "tools")
sys.path.insert(0, TOOLS)
from reservations import load, inline_js, compute_totals  # noqa: E402
from inject import inject_file  # noqa: E402

SRC = os.path.join(TRIP, ".trash", "reservations.html")  # editable source (rebundled into index.html)

data = load(os.path.join(TRIP, "reservations.json"))
if isinstance(data, dict) and data.get("ok") is False:
    sys.exit("ERROR: " + data["error"])

js = inline_js(data)
inject_file(SRC, "RESERVATIONS_DATA", js)

t = compute_totals(data)
print(f"RESERVATIONS injected into {os.path.relpath(SRC, TRIP)}")
print(f"  {len(data['items'])} items · cash ${t['cash']:,.2f}"
      + "".join(f" · {v:,.0f} {k}" for k, v in t["points"].items())
      + "".join(f" · ${v:,.0f} {k}" for k, v in t["credits"].items()))
print("Now rebundle: python tools/build_index.py oregon-jul-2026")
