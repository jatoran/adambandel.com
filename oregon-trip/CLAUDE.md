# Oregon / Washington Coast Trip Planner

A personal, self-contained trip planner for a 5-day road trip (**July 22–26, 2026**:
Portland → Columbia River Gorge → Mt. Hood → Cannon Beach → Astoria → PDX). It is
two static HTML pages plus a small set of Python scripts that fetch photos and
weather and bake them into the pages. **There is no build step and no server** —
the pages open by double-clicking (`file://`).

Trip context that drives content decisions: the travelers bring **2 small dogs**,
so dog-friendliness (leash rules, patios, off-leash beaches) is a first-class
concern throughout.

## The two pages

- **`oregon_trip_plan.html`** — the main deliverable. A scroll-through, day-by-day
  travel plan: hero, sticky day nav (Wed–Sun, color-coded), a top **weather strip**,
  a "Before you go" passes/permits/dog-rules panel, then each day as a numbered
  **timeline** of booked stops (each with a swipeable photo filmstrip) and a
  collapsible **"Ideas & alternatives"** panel (optional adds/swaps/skips, each with
  a 🐾 dog note and a routing/time line, and its own photos). Click any photo for a
  lightbox. Per-day weather shows in each day header.
- **`oregon_trip_actual_route_with_large_images.html`** — a Leaflet route map. Click a
  numbered marker → popup with that stop's photo filmstrip. The two pages share the
  same photo set and link to each other.

## How it works (important)

Both pages run from `file://`, where `fetch()`/XHR is blocked but `<img>`, `<script>`,
and inline JS data work fine. **So all data is embedded inline in the HTML rather than
fetched at runtime.** The Python scripts write that data into the pages by replacing
text between marker comments:

- `/* IMAGES_DATA_START */ … /* IMAGES_DATA_END */` → `const STOP_IMAGES` (both pages)
- `/* IDEA_DATA_START */ … /* IDEA_DATA_END */` → `const IDEA_IMAGES` (plan page only)
- `/* WEATHER_DATA_START */ … /* WEATHER_DATA_END */` → `const WEATHER` (plan page only)

**Do not hand-edit content between those markers — regenerate it with the scripts.**

Data shapes:
- `STOP_IMAGES` / `IDEA_IMAGES`: `{ "<key>": [ {f:"images/…", t:"title"}, … ] }`
- `WEATHER`: `{ meta:{kind,headline,note}, days:{ wed:{dow,date,high,low,icon,short,summary,…}, … } }`

The plan page is otherwise **data-driven** from three JS literals you CAN edit by hand:
`trip` (days + `items`, where a place item carries `stop:'<STOP_IMAGES key>'`),
`DAY_IDEAS` (per-day idea cards: `tag`/`name`/`what`/`dogs`/`route`/`img`, where `img`
is an `IDEA_IMAGES` key), and `TRIP_NOTES`. The map page is driven by `places` + `routes`;
its routing is wrapped in try/catch so an offline/CDN failure can't stop popups/photos.

Photos are local files in `images/`. **Map tiles, Leaflet, and OSRM routing still need
internet** on the map page; everything else (plan page, all photos) works fully offline.

## Key files

| File | What it is |
|---|---|
| `oregon_trip_plan.html` | Main scroll-through plan page (weather, timeline, ideas, photos) |
| `oregon_trip_actual_route_with_large_images.html` | Leaflet route map with photo popups |
| `itinerary.md` | Source itinerary (the booked plan) |
| `itinerary_ideas.md` | Researched dog-aware ideas/swaps brief (Hug Point closure, permits, etc.) |
| `images/` | All photos: stops `=<slug>-NN.jpg`, ideas `=idea-<slug>-NN.jpg` |
| `images_manifest.json` | 22 stops → photo lists (`file`,`title`,`source`) |
| `idea_images_manifest.json` | 16 idea spots → photo lists |
| `weather.json` | Generated weather (climatology or live forecast) |
| `.trash/` | Superseded files / one-off scripts (we move, never delete) |

### Scripts (the pipeline)

| Script | Does |
|---|---|
| `download_images_v2.py` | Fetch stop photos (Openverse + Wikimedia Commons), write `images_manifest.json` + `images/` |
| `download_idea_images.py` | Fetch idea-spot photos → `idea_images_manifest.json` |
| `backfill_idea_images.py` | Corrected-query refill for idea spots that came up short |
| `apply_images.py` | Inject `STOP_IMAGES` into both pages + `IDEA_IMAGES` into the plan page, from the manifests |
| `fetch_weather.py` | Pull weather from Open-Meteo, write `weather.json`, inject `WEATHER` into the plan page |

## Common tasks

- **Re-sync photos after editing a manifest / adding a stop:** `python apply_images.py`
- **Refresh stop photos:** `python download_images_v2.py` then `python apply_images.py`
- **Refresh idea photos:** `python download_idea_images.py` (+ `backfill_idea_images.py`) then `python apply_images.py`
- **Update weather:** `python fetch_weather.py`
  - It tries the live forecast first and falls back to **climatology (2015–2025 averages)**
    when the dates are beyond the ~16-day horizon. The trip is currently > 2 weeks out, so
    the page shows climatology; **re-run within ~2 weeks of the trip** to get the real forecast.

## Gotchas / conventions

- **Never hand-edit between the `*_DATA_START/END` markers** — it's generated.
- **Image sources:** Wikimedia Commons is the reliable source; Openverse (Flickr/CC) gives
  nicer photos but its anonymous API frequently returns 401/429 here, so scripts fall back
  to Commons. Commons can 429 if hammered — scripts pace requests.
- **Windows console can't print emoji/°** (cp1252); scripts reconfigure stdout to UTF-8.
- **Verifying visual changes:** render headless with Edge, e.g.
  `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --screenshot=out.png file.html`.
  For the plan page, `.reveal` elements start hidden (IntersectionObserver) and `<details>`
  start collapsed — temporarily force them visible in a throwaway copy when screenshotting.
- Per the global rules: read-only git only, and move unwanted files to `.trash/` instead of deleting.
