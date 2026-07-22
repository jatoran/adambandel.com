# Oregon / Washington Coast Trip Planner

A personal, self-contained trip planner for a 5-day road trip (**July 22–26, 2026**:
Portland → Columbia River Gorge → Mt. Hood → Cannon Beach → Astoria → PDX). It ships as
**one file, `index.html`** — a sticky-tab-bar shell with five tabs (**Plan · Reservations ·
Route map · Hotels · Cars**), assembled from five source pages by the shared `tools/build_index.py`
(config in `build.json`). **There is no server** — `index.html` opens by double-clicking
(`file://`), and it's registered in the repo-root dashboard via `trip.json`.

The five source pages (the editable originals) now live in `.trash/`; the plan + map two
are fed by the Python photo/weather pipeline (which injects into those sources), the
**Reservations** page is fed by `reservations.json` (via `scripts/apply_reservations.py`),
and the hotels + cars two are hand-authored. Re-run the pipeline against the sources, then re-run
`python tools/build_index.py oregon-jul-2026` to rebundle `index.html`.

**Reservations = the booked truth.** `reservations.json` holds the locked-in flights, lodging,
and car (guest names, confirmation numbers, dates, real prices incl. mixed cash / Capital One
miles / Venture X credit). It's the project-wide convention (see root `CLAUDE.md`); the tab renders
from it and the root dashboard shows its cash total + status chip.

Trip context that drives content decisions: the travelers bring **2 small dogs**,
so dog-friendliness (leash rules, patios, off-leash beaches) is a first-class
concern throughout.

## The pages

**Trip plan + map** — share the same photo set, link to each other, and are fed by the
script pipeline below:

- **`oregon_trip_plan.html`** — the main deliverable. A scroll-through, day-by-day
  travel plan: hero, sticky day nav (Wed–Sun, color-coded), a top **weather strip**,
  a "Before you go" passes/permits/dog-rules panel, then each day as a numbered
  **timeline** of booked stops (each with a swipeable photo filmstrip) and a
  collapsible **"Ideas & alternatives"** panel (optional adds/swaps/skips, each with
  a 🐾 dog note and a routing/time line, and its own photos). Click any photo for a
  lightbox. Per-day weather shows in each day header.
- **`oregon_trip_actual_route_with_large_images.html`** — a Leaflet route map. Click a
  numbered marker → popup with that stop's photo filmstrip.

**Comparison pages** — standalone and hand-authored (no script pipeline, no data
markers; edit their inline JS literals directly):

- **`hotel_options.html`** — ranked hotel options for the two overnight bases
  (Portland · 2 nts, Cannon Beach · 2 nts), each with a per-hotel room breakdown,
  client-side sort + budget filter, and a photo lightbox. Dog policy + pet fee are
  called out per hotel.
- **`rental_car_options.html`** — an SUV model comparison (cargo / dog fit), the PDX
  rental companies (price ranges + pet policies), and booking aggregators/tools, with
  client-side sort and a photo lightbox.

## How it works (important)

All four pages run from `file://`, where `fetch()`/XHR is blocked but `<img>`, `<script>`,
and inline JS data work fine, **so every page embeds its data inline rather than fetching
at runtime.** For the **plan + map** pages, the Python scripts write that data into the
HTML by replacing text between marker comments:

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

### Comparison pages (hotels / rental cars)

These two are **fully hand-authored** — no `*_DATA_START/END` markers and no script
touches them. Each renders client-side from inline JS literals you edit directly, and
both are fully offline (photos are local):

- `hotel_options.html`: `HOTELS = { portland:[…], cannonbeach:[…] }` (per hotel:
  `name, img:"hotel_images/…", rank, area, areaType, tags[], blurb, room, dogs, dogFee,
  warn, lo, hi, price, url, src`) and `ROOMS = { "<hotel name>": [ [name, sqft, beds,
  view, sleeps, features, pet, est$, photoFile], … ] }`, where `photoFile` resolves to
  `hotel_images/rooms/<photoFile>`.
- `rental_car_options.html`: `MODELS[]` (SUV cargo/dog-fit cards: `n, yr, rank, cls,
  cargo, verdict, suite, dog, img:"car_images/…"`), `COMPANIES[]` (PDX rentals:
  `n, lo, hi, day, cls, tags:[[label,cls]], pet, url, note`), and `AGGS[]` (booking
  tools: `t, n, d, u`).

The **Reservations** page (`reservations.html`) is different: it is **data-driven from
`reservations.json`** (not hand-authored literals). Its inline `const RESERVATIONS` sits between
`/* RESERVATIONS_DATA_START */ … _END */` markers — **do not hand-edit it**; edit `reservations.json`
and run `python trips/oregon-jul-2026/scripts/apply_reservations.py`, then rebundle. Photos: reuses
`hotel_images/pdx-nines.jpg` for The Nines and `res_images/` for the Drifthaven + Nissan Rogue.

## Folder layout

Deliverable HTML pages and the image folders they reference sit at the **top
level**; Python tooling lives in **`scripts/`**; generated/source data lives in
**`data/`**. Image paths are stored in the manifests (and HTML) as `images/…`,
i.e. relative to the HTML pages at the top level — `data/` and `scripts/` are
not part of those paths.

```
trips/oregon-jul-2026/
├─ index.html      ← THE deliverable: tabbed single page (open via file://)
├─ trip.json       ← registers this trip in the root dashboard/dropdown
├─ build.json      ← tab config for tools/build_index.py
├─ reservations.json ← THE booked truth: confirmed flights/lodging/car + real prices
├─ images/         ← stop + idea photos (Plan/Map tabs)
├─ hotel_images/   ← hotel + room photos (Hotels tab); rooms in rooms/
├─ car_images/     ← rental-car photos (Cars tab)
├─ res_images/     ← reservations photos (Drifthaven, Nissan Rogue) for the Reservations tab
├─ scripts/        ← the Python photo/weather pipeline
├─ data/           ← manifests, weather, itineraries
└─ .trash/         ← the four source pages + superseded files (we move, never delete)
```

## Key files

| File | What it is |
|---|---|
| `index.html` | THE deliverable — tabbed bundle of the four pages below (built by `tools/build_index.py`) |
| `build.json` | tab config (title/brand/gradient/pages) for the shared builder |
| `.trash/oregon_trip_plan.html` | **source** — main scroll-through plan page (weather, timeline, ideas, photos) |
| `.trash/oregon_trip_actual_route_with_large_images.html` | **source** — Leaflet route map with photo popups |
| `.trash/hotel_options.html` | **source** — hotel options/comparison (Portland + Cannon Beach); photos in `hotel_images/` |
| `.trash/rental_car_options.html` | **source** — rental-car options/comparison; photos in `car_images/` |
| `.trash/reservations.html` | **source** — the booked **Reservations** tab; data-driven from `reservations.json` (generic/reusable) |
| `reservations.json` | THE booked truth — confirmed flights/lodging/car, guest names, dates, real prices (cash + miles + credit) |
| `images/` | All trip photos: stops `=<slug>-NN.jpg`, ideas `=idea-<slug>-NN.jpg` |
| `data/itinerary.md` | Source itinerary (the booked plan) |
| `data/itinerary_ideas.md` | Researched dog-aware ideas/swaps brief (Hug Point closure, permits, etc.) |
| `data/images_manifest.json` | 22 stops → photo lists (`file`,`title`,`source`) |
| `data/idea_images_manifest.json` | 16 idea spots → photo lists |
| `data/weather.json` | Generated weather (climatology or live forecast) |
| `.trash/` | Superseded files / one-off scripts (we move, never delete) |

### Scripts (the pipeline, in `scripts/`)

These are now **thin wrappers over the shared `tools/`** — each holds only this trip's config (queries, day
list, name→key map) and calls the shared engine. They inject into the `.trash/` **source** pages, so always
rebundle (`python tools/build_index.py oregon-jul-2026`) afterward.

| Script | Does | Wraps |
|---|---|---|
| `download_images_v2.py` | Fetch stop photos → `images_manifest.json` + `images/` | `tools/photos.py` |
| `download_idea_images.py` | Fetch idea-spot photos → `idea_images_manifest.json` | `tools/photos.py` |
| `backfill_idea_images.py` | Corrected-query refill for idea spots that came up short (standalone one-off) | — |
| `apply_images.py` | Inject `STOP_IMAGES` (plan + map) + `IDEA_IMAGES` (plan) into the source pages | `tools/inject.py` |
| `fetch_weather.py` | Pull weather, write `weather.json`, inject `WEATHER` into the source plan page | `tools/weather.py` + `tools/inject.py` |
| `apply_reservations.py` | Validate `reservations.json`, compute totals, inject `RESERVATIONS` into the Reservations source page | `tools/reservations.py` + `tools/inject.py` |

## Common tasks

The scripts resolve their own paths, so any CWD works. The photo/weather scripts now inject into the **source**
pages in `.trash/`, so **always finish by rebundling** `index.html`:

- **Rebundle the deliverable (run after ANY content/data change):** `python tools/build_index.py oregon-jul-2026`
- **Edit a tab's content / styling:** edit the source page in `.trash/`, then rebundle.
- **Re-sync photos after editing a manifest / adding a stop:** `python scripts/apply_images.py` → rebundle.
- **Refresh stop photos:** `python scripts/download_images_v2.py` then `python scripts/apply_images.py` → rebundle.
- **Refresh idea photos:** `python scripts/download_idea_images.py` (+ `scripts/backfill_idea_images.py`) then `python scripts/apply_images.py` → rebundle.
- **Update reservations (booked truth):** edit `reservations.json`, then
  `python scripts/apply_reservations.py` → rebundle. Sanity-check totals with
  `python tools/reservations.py oregon-jul-2026`.
- **Update weather:** `python scripts/fetch_weather.py` → rebundle.
  - It tries the live forecast first and falls back to **climatology (2015–2025 averages)**
    when the dates are beyond the ~16-day horizon. The trip is currently > 2 weeks out, so
    the page shows climatology; **re-run within ~2 weeks of the trip** to get the real forecast.

## Gotchas / conventions

- **Never hand-edit between the `*_DATA_START/END` markers** — it's generated.
- **Image sources:** Wikimedia Commons is the reliable source; Openverse (Flickr/CC) gives
  nicer photos but its anonymous API frequently returns 401/429 here, so scripts fall back
  to Commons. Commons can 429 if hammered — scripts pace requests.
- **Windows console can't print emoji/°** (cp1252); scripts reconfigure stdout to UTF-8.
- **Verifying visual changes:** use `python tools/screenshot.py index.html --out out.png --size 1320x2200`
  (writes the PNG to a temp dir outside the project). For a standalone `.trash/` source page whose `.reveal`
  elements start hidden and `<details>` start collapsed, add `--force-reveal --base .` (the `--base` lets its
  `images/…` paths resolve from the trip root).
- Per the global rules: read-only git only, and move unwanted files to `.trash/` instead of deleting.
