"""Pull weather for each trip day and inject it into the plan SOURCE page (in
.trash/), then rebundle:

    python tools/build_index.py oregon-jul-2026

Live forecast where within the ~16-day horizon, else 2015-2025 climate normals.
The Open-Meteo fetch/cache/fallback engine lives in tools/weather.py; this file
holds only the trip's days, locations and the coastal phrasing. Re-run within ~2
weeks of the trip for the real forecast.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TRIP = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(TRIP)), "tools"))
from weather import day_weather, climatology_day  # noqa: E402
from inject import to_js, inject_file  # noqa: E402

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DATA = os.path.join(TRIP, "data")
PLAN = os.path.join(TRIP, ".trash", "oregon_trip_plan.html")  # source page (rebundled into index.html)
TZ = "America/Los_Angeles"

DAYS = [
    dict(key="wed", dow="Wed", date="Jul 22", iso="2026-07-22", lat=45.515, lon=-122.678, loc="Portland", coastal=False),
    dict(key="thu", dow="Thu", date="Jul 23", iso="2026-07-23", lat=45.576, lon=-122.116, loc="Columbia Gorge", coastal=False),
    dict(key="fri", dow="Fri", date="Jul 24", iso="2026-07-24", lat=45.892, lon=-123.961, loc="Mt. Hood → Cannon Beach", coastal=True),
    dict(key="sat", dow="Sat", date="Jul 25", iso="2026-07-25", lat=45.892, lon=-123.961, loc="Cannon Beach", coastal=True),
    dict(key="sun", dow="Sun", date="Jul 26", iso="2026-07-26", lat=46.188, lon=-123.831, loc="Astoria", coastal=True),
]
MT_HOOD = dict(lat=45.303, lon=-121.753)  # for the Friday transition note


def temp_word(h):
    return ("hot" if h >= 88 else "warm" if h >= 80 else "mild" if h >= 72 else "cool" if h >= 64 else "chilly")


def descriptor(high, rainy_pct, coastal):
    """(icon, short, summary) for a climatology day."""
    w = temp_word(high)
    if rainy_pct >= 45:
        return "🌧️", "Wet", f"{w.capitalize()} with periods of rain"
    if rainy_pct >= 22:
        return "🌦️", "Showers poss.", f"{w.capitalize()}, a passing shower possible"
    if coastal:
        return "🌤️", "AM marine layer", f"{w.capitalize()}; morning marine layer, afternoon sun"
    return "☀️", f"Sunny, {w}", f"{w.capitalize()} and mostly sunny"


out_days, kinds = {}, set()
for d in DAYS:
    print(f"=== {d['dow']} {d['date']} — {d['loc']} ===")
    w = day_weather(d["lat"], d["lon"], d["iso"], tz=TZ)
    if not w:
        print("  [WARN] no data")
        continue
    if w["kind"] == "climatology":
        icon, short, summary = descriptor(w["high"], w.get("rainyPct", 0), d["coastal"])
        res = dict(high=w["high"], low=w["low"], icon=icon, short=short, summary=summary,
                   rainyPct=w.get("rainyPct"), kind="climatology", samples=w.get("samples"))
    else:
        pp = w.get("precip")
        rp = f" · {pp}% precip" if pp is not None else ""
        res = dict(high=w["high"], low=w["low"], icon=w["icon"], short=w["short"],
                   summary=f"{w['short']}{rp}", rainyPct=pp, kind="forecast")
    kinds.add(res["kind"])
    res.update(dow=d["dow"], date=d["date"], loc=d["loc"])
    out_days[d["key"]] = res
    extra = f" ({res.get('samples')} yrs)" if res["kind"] == "climatology" else ""
    print(f"  {res['icon']} {res['high']}°/{res['low']}°  {res['summary']}  [{res['kind']}{extra}]")

# Friday transition note: add Mt. Hood morning numbers (climatology)
if "fri" in out_days:
    mh = climatology_day(MT_HOOD["lat"], MT_HOOD["lon"], "2026-07-24", tz=TZ)
    if mh:
        out_days["fri"]["summary"] += f" · Mt. Hood AM ~{mh['high']}°/{mh['low']}°"
        print(f"  (Fri Mt. Hood climatology ~{mh['high']}°/{mh['low']}°)")

kind = "forecast" if kinds == {"forecast"} else "climatology" if kinds == {"climatology"} else "mixed"
headline = {
    "forecast": "live forecast (Open-Meteo)",
    "climatology": "typical for these dates (2015–2025 averages)",
    "mixed": "live forecast where available, otherwise typical for the date",
}[kind]
note = ("Shown as climate normals — the 2015–2025 average for each exact date and place — because the trip is "
        "still beyond the ~16-day live-forecast window. Re-run fetch_weather.py within about two weeks of the "
        "trip and these flip to the real forecast. Coastal days (Fri–Sun) usually open with morning marine-layer "
        "cloud that burns off by midday. Source: Open-Meteo.") if kind != "forecast" else \
    "Live 16-day forecast from Open-Meteo — re-run fetch_weather.py to refresh."

data = {"meta": {"kind": kind, "headline": headline, "note": note}, "days": out_days}
json.dump(data, open(os.path.join(DATA, "weather.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
inject_file(PLAN, "WEATHER_DATA", to_js("WEATHER", data), indent="  ")
print(f"\nInjected weather ({kind}) for {len(out_days)} days -> plan source + weather.json")
print("Now rebundle: python tools/build_index.py oregon-jul-2026")
