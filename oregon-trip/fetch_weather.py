"""Pull the most accurate weather available for each trip day and inject it into
oregon_trip_plan.html (top strip + per-day header).

For each day it FIRST tries Open-Meteo's live forecast; if the date is beyond the
~16-day forecast horizon (as it is until ~2 weeks before the trip), it falls back
to climatology: the average of the same calendar date across 2015-2025 at that
location. Re-run this within two weeks of the trip to get the real forecast.

Writes weather.json and updates the WEATHER_DATA block in the plan page.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "oregon_trip_plan.html")
UA = "OregonTripMap/1.0 (personal trip planner)"
CLIM_YEARS = list(range(2015, 2026))  # 2015..2025

DAYS = [
    dict(key="wed", dow="Wed", date="Jul 22", iso="2026-07-22", lat=45.515, lon=-122.678, loc="Portland", coastal=False),
    dict(key="thu", dow="Thu", date="Jul 23", iso="2026-07-23", lat=45.576, lon=-122.116, loc="Columbia Gorge", coastal=False),
    dict(key="fri", dow="Fri", date="Jul 24", iso="2026-07-24", lat=45.892, lon=-123.961, loc="Cannon Beach", coastal=True),
    dict(key="sat", dow="Sat", date="Jul 25", iso="2026-07-25", lat=45.892, lon=-123.961, loc="Cannon Beach", coastal=True),
    dict(key="sun", dow="Sun", date="Jul 26", iso="2026-07-26", lat=46.188, lon=-123.831, loc="Astoria", coastal=True),
]
MT_HOOD = dict(lat=45.303, lon=-121.753)  # for the Friday transition note


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


WMO = {
    0: ("☀️", "Clear"), 1: ("☀️", "Mostly clear"), 2: ("🌤️", "Partly cloudy"), 3: ("☁️", "Overcast"),
    45: ("🌫️", "Fog"), 48: ("🌫️", "Fog"),
    51: ("🌦️", "Light drizzle"), 53: ("🌦️", "Drizzle"), 55: ("🌦️", "Drizzle"),
    61: ("🌧️", "Light rain"), 63: ("🌧️", "Rain"), 65: ("🌧️", "Heavy rain"),
    80: ("🌧️", "Showers"), 81: ("🌧️", "Showers"), 82: ("🌧️", "Heavy showers"),
    95: ("⛈️", "Thunderstorms"), 96: ("⛈️", "Thunderstorms"), 99: ("⛈️", "Thunderstorms"),
}


def temp_word(h):
    return ("hot" if h >= 88 else "warm" if h >= 80 else "mild" if h >= 72 else "cool" if h >= 64 else "chilly")


def descriptor(high, rainy_pct, coastal):
    """Return (icon, short, summary) for a climatology day."""
    w = temp_word(high)
    if rainy_pct >= 45:
        return "🌧️", "Wet", f"{w.capitalize()} with periods of rain"
    if rainy_pct >= 22:
        return "🌦️", "Showers poss.", f"{w.capitalize()}, a passing shower possible"
    if coastal:
        return "🌤️", "AM marine layer", f"{w.capitalize()}; morning marine layer, afternoon sun"
    return "☀️", f"Sunny, {w}", f"{w.capitalize()} and mostly sunny"


def forecast_day(d):
    """Live forecast for the exact date, or None if beyond horizon."""
    url = "https://api.open-meteo.com/v1/forecast?" + urllib.parse.urlencode({
        "latitude": d["lat"], "longitude": d["lon"], "forecast_days": "16",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
        "timezone": "America/Los_Angeles", "temperature_unit": "fahrenheit", "precipitation_unit": "inch",
    })
    try:
        dd = get_json(url).get("daily", {})
        times = dd.get("time", [])
        if d["iso"] not in times:
            return None
        i = times.index(d["iso"])
        code = int(dd["weathercode"][i])
        icon, label = WMO.get(code, ("🌤️", "Mixed"))
        high = round(dd["temperature_2m_max"][i])
        low = round(dd["temperature_2m_min"][i])
        pp = dd.get("precipitation_probability_max", [None] * len(times))[i]
        rp = f" · {pp}% precip" if pp is not None else ""
        return dict(high=high, low=low, icon=icon, short=label,
                    summary=f"{label}{rp}", rainyPct=pp, kind="forecast")
    except Exception as e:
        print("    forecast error:", e)
        return None


def archive_samples(lat, lon, day):
    """11 years of one calendar date (Jul DD) at a location."""
    start = f"{CLIM_YEARS[0]}-07-{day:02d}"
    end = f"{CLIM_YEARS[-1]}-07-{day:02d}"
    url = "https://archive-api.open-meteo.com/v1/archive?" + urllib.parse.urlencode({
        "latitude": lat, "longitude": lon, "start_date": start, "end_date": end,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "America/Los_Angeles", "temperature_unit": "fahrenheit", "precipitation_unit": "inch",
    })
    dd = get_json(url).get("daily", {})
    suffix = f"-07-{day:02d}"
    highs, lows, precs = [], [], []
    for t, hi, lo, pr in zip(dd.get("time", []), dd.get("temperature_2m_max", []),
                             dd.get("temperature_2m_min", []), dd.get("precipitation_sum", [])):
        if t.endswith(suffix) and hi is not None and lo is not None:
            highs.append(hi); lows.append(lo); precs.append(pr or 0.0)
    return highs, lows, precs


def clim_day(d):
    day = int(d["iso"][-2:])
    highs, lows, precs = archive_samples(d["lat"], d["lon"], day)
    if not highs:
        return None
    high = round(sum(highs) / len(highs))
    low = round(sum(lows) / len(lows))
    rainy = round(100 * sum(1 for p in precs if p >= 0.05) / len(precs))
    icon, short, summary = descriptor(high, rainy, d["coastal"])
    return dict(high=high, low=low, icon=icon, short=short, summary=summary,
                rainyPct=rainy, kind="climatology", samples=len(highs))


out_days = {}
kinds = set()
for d in DAYS:
    print(f"=== {d['dow']} {d['date']} — {d['loc']} ===")
    res = forecast_day(d) or clim_day(d)
    if not res:
        print("  [WARN] no data"); continue
    kinds.add(res["kind"])
    res.update(dow=d["dow"], date=d["date"], loc=d["loc"])
    out_days[d["key"]] = res
    extra = f" ({res.get('samples')} yrs)" if res["kind"] == "climatology" else ""
    print(f"  {res['icon']} {res['high']}°/{res['low']}°  {res['summary']}  [{res['kind']}{extra}]")

# Friday transition note: add Mt. Hood morning numbers
if "fri" in out_days:
    mh_hi, mh_lo, _ = archive_samples(MT_HOOD["lat"], MT_HOOD["lon"], 24)
    if mh_hi:
        h, lo = round(sum(mh_hi) / len(mh_hi)), round(sum(mh_lo) / len(mh_lo))
        out_days["fri"]["summary"] += f" · Mt. Hood AM ~{h}°/{lo}°"
        print(f"  (Fri Mt. Hood climatology ~{h}°/{lo}°)")

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
json.dump(data, open(os.path.join(HERE, "weather.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

js = "const WEATHER = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"
text = open(PLAN, encoding="utf-8").read()
pat = re.compile(r"(/\* WEATHER_DATA_START[^\n]*\*/\n).*?(\n\s*/\* WEATHER_DATA_END \*/)", re.S)
if not pat.search(text):
    raise SystemExit("WEATHER_DATA markers not found in plan page")
text = pat.sub(lambda m: m.group(1) + "  " + js + m.group(2), text)
open(PLAN, "w", encoding="utf-8").write(text)
print(f"\nInjected weather ({kind}) for {len(out_days)} days -> plan page + weather.json")
