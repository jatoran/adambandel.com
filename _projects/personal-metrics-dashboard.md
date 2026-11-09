---
title: Personal Metrics Dashboard
summary: A self-hosted DuckDB warehouse with a React dashboard that merges wearable, screen-time, habit, mood and location data into one row per day, kept current by hourly syncs
started: 2025-11-30
updated: 2026-11-08
type: data-pipeline
stack:
  - Python
  - DuckDB
  - Pandas
  - FastAPI
  - React
  - TypeScript
  - ECharts
  - scikit-learn
  - statsmodels
  - Docker
tags:
  - data
  - quantified-self
  - analytics
loc: 33342
files: 222
architecture:
  auth: none
  database: DuckDB
  api: REST
  realtime: none
  background: in-process scheduler
  cache: in-memory
  search: none
---

## Overview

Personal Metrics Dashboard pulls my health, screen-time and habit data into one DuckDB warehouse and looks for relationships between them.
The sources are a Fitbit tracker through Google Health, ActivityWatch on my PC and phone, my [Habit Ledger](/projects/habit-ledger/) app for habits, calories, mood, meditation and workouts, GPS logging on my phone, a smart scale, daily weather, and old exports from apps I no longer use: RescueTime, App Usage, Daylio, KeepTrack and Google location history.

Everything ends up in one table with a row per day, and a FastAPI read API and a React dashboard sit on top.
It runs on my home server as a Docker Compose stack: the API, a scheduler that does all the writing, and an nginx front end.
On 8 November 2026 that table covered 4,822 days, from August 2013 to that day, in 207 columns, and the largest raw table held 30 million heart-rate readings.

The code is private.
This page describes it; there is no repository to link.

## Screenshots

<!-- SCREENSHOT: Pipeline Status Dashboard showing ingestion status with processed files count and source availability matrix -->
![Pipeline Status](/images/projects/metrics_dashboard/screenshot-1.png)

<!-- SCREENSHOT: Daily Wide Metrics Viewer showing multi-metric time series chart with date filtering and aggregation controls -->
![Metrics Visualization](/images/projects/metrics_dashboard/screenshot-2.png)

<!-- SCREENSHOT: Correlation heatmap showing pairwise relationships between metrics like sleep, heart rate, and productivity -->
![Correlation Analysis](/images/projects/metrics_dashboard/screenshot-3.png)

## Problem

Health and productivity data is spread across dozens of apps and devices, each with its own export format.
Checking how sleep affects the next day's productivity, or how exercise affects mood over time, means a lot of manual data wrangling, and the timing that makes those comparisons mean anything gets lost along the way.

This project puts every metric in one database, where metrics from different sources can be joined and compared.
It has to deal with sources that overlap, like two screen-time trackers on the same computer, with day boundaries that depend on the time zone, and with metrics recorded at very different rates, from intraday heart rate to an occasional weigh-in.

The first version, in November 2025, was a set of parser scripts with a Streamlit dashboard.
An audit in June 2026 found every stream in it out of date, heart rate by 655 days, because each one depended on a manual export.
It also found the day boundary applied three different ways (most daily tables shifted by five hours, sleep not at all, habits by three), unknown Daylio moods filled in as 3.0 and missing altitudes as 0, and every run dropping and rebuilding every table.
The rebuild kept the multi-year dataset and replaced the rest: a FastAPI read API, a React dashboard whose first job is showing which sources are stale, and automatic feeds for every source I still use.

## Approach

### Data flow

```
Phone (GPSLogger, Habit Ledger) ──Syncthing──┐
PC + phone (ActivityWatch sync) ──Syncthing──┤
Google Health API (hourly) ──────────────────┤
Google Takeout (monthly) ────────────────────┤
Old exports (dropped in by hand) ────────────┤
                                             ▼
  ingest  → raw_data.duckdb     one raw table per source        (Bronze)
  unify   → unified_usage, unified_sleep                        (Silver)
  gold    → aggregates.duckdb   one *_daily table per stream
                                + daily_metrics, one row per day (Gold)
  weather → Open-Meteo, daily, folded into daily_metrics
                                             │
                    FastAPI (read-only) ◀────┘ ──▶ React dashboard (nginx)
```

### Capture

- Since 3 November 2026, wrist data comes from the Google Health API, fetched every hour into a raw archive that is never pruned and then ingested like any other file. Sleep score and device temperature are not in the API, so those two still come from a monthly scheduled Google Takeout export.
- GPSLogger and Habit Ledger write files on my phone, and Syncthing copies them straight to the server. ActivityWatch uses its own sync: the PC pushes once a day at 3 AM and the phone every 15 minutes.
- Weather comes from Open-Meteo once a day.
- The old exports are dropped into a folder and ingested once, by hand, with the scheduler stopped, because those older parsers append rows without checking for duplicates.
- The scheduler runs the sync every hour and is the only process that writes to the warehouse on its own. Screen time is rebuilt once a night instead, because a full rebuild holds the write lock for about six minutes.

### Freshness

Every stream is registered once in code with its table, its time column and how often it should update.
The freshness page compares each stream's newest row with today and marks it fresh, stale, missing, retired, or on demand for streams that only fill when something happens, like an ECG reading.
On 8 November 2026 it tracked 48 streams, 28 of them fresh, and the only stale one was weight (see Limits).

### Analysis

- A correlation view runs Pearson correlations between any two daily metrics at lags of up to 14 days.
- An insights layer scans every metric against a chosen target with Spearman correlations, controls the false discovery rate across the hundreds of comparisons, and looks for weekday and seasonal effects and unusual days. Its statistics are written in NumPy, without SciPy or scikit-learn, so the API stays light.
- A separate offline analysis treats the warehouse as one person's time series. It splits the history into tracking eras and life chapters, fits a dynamic factor model and per-person vector autoregressions, runs Granger and convergent cross mapping tests, and corrects its correlations for the fact that neighboring days are not independent. It writes its results to a third DuckDB file that the dashboard reads.

The dashboard has a page per category (sleep, activity, exercise, vitals, mood, body, screen time, location, habits and meditation) and pages for correlations, insights, the offline analysis, a table inspector, freshness and pipeline health.

### Stack

- DuckDB in three files: raw and unified tables, the daily tables, and the analysis results. DuckDB allows one writer per file, so the API opens them read-only for each request and holds nothing between requests; while the hourly sync is writing, requests that need the warehouse fail for those few seconds.
- Pandas in the parsers. SciPy, scikit-learn, statsmodels, ruptures and lingam only in the offline analysis.
- FastAPI for the read API.
- React 18, TypeScript and Vite, with TanStack Query, ECharts for the charts, and MapLibre with OpenStreetMap tiles for the location map.
- Docker Compose on my home server, deployed from my PC by a script that copies code only, so a deploy cannot touch the data.

### Challenges

- One day boundary: a day runs from 5 AM to 5 AM local time, so screen use at 1 AM counts toward the evening before it, and a night's sleep counts toward the day it ends. Every daily table now gets its day from one SQL macro. ActivityWatch stores UTC, and bucketing it without converting had filed about 14% of screen time on the wrong day; rounding each event down to whole minutes had undercounted another 6.5%.
- Overlapping sources: ActivityWatch and RescueTime both tracked my computer for a while, so one source wins per device per day, in the order ActivityWatch, RescueTime, App Usage. Events inside one source overlap too: the Android watchers wrote the same event several times, which had inflated phone screen time for 2025 by about 26%. Events are now trimmed so a device shows one foreground window at a time.
- Safe re-runs: the new parsers check for existing rows before inserting, so running one again adds nothing. The old ones do not, and one full re-ingest took the ActivityWatch table from 6.8 million rows to 15 million. That is why every automatic source uses the new parsers only.
- Silent stalls: after a phone switch, Habit Ledger stopped writing its log from 8 September to 3 October 2026 while Syncthing still reported the folder in sync. The freshness page did not flag it, because habits were set to go stale only after 30 days. A source logged every day now goes stale after 3.
- Workout notes: I log workouts in my own shorthand, like `60-h-gym` or `3mi @12pace`. An LLM normalized all 1,012 notes from May 2017 to June 2026 once, offline, into structured sessions, and a rule-based parser written from the same notation handles every new note. On the 66 most recent notes the rules agreed with the LLM on every field checked. The pipeline itself never calls an LLM. Logged workouts are then matched with the tracker's own sessions, so a workout counts whether I logged it, tracked it, or both.
- Memory: the whole-history screen-time rebuild was killed at the server's 2.5 GB memory cap. It now runs one month at a time and produces the same rows as the whole-history build.

## Outcomes

The offline analysis was last run on 27 June 2026, and the dashboard's landing page summarizes what it found.

- More screen use one day goes with less sleep that night. It is the one relationship every method agreed on: the corrected correlation, a lagged model that held in five separate stretches of the data, Granger, and convergent cross mapping.
- The cost is concentrated in night-time screen use and in coding, gaming and AI tools. Video did not show it.
- Neighboring days are so alike that the data holds about an eighth as many independent observations as it has days, and several correlations that look significant on raw day counts do not survive that correction.
- Next-day forecasting is weak, and no series has a weekly cycle, only weak seasonal ones.
- All of it is correlational. The landing page names a randomized late-night screen cutoff as the experiment that would test the first finding.

On the pipeline side, every source I still use reaches the warehouse without a manual step.
A new Habit Ledger tracker shows up as new daily columns with no code change; the old wide table had silently dropped eight trackers.
Adding a source means a registry entry, a parser class, and usually one spec line in the daily build.

## Limits

- It is single-user, with no authentication, and only reachable on my own network.
- The offline analysis is not scheduled, so the analysis page reflects data through 27 June 2026.
- Phone screen time before 15 August 2026 is roughly half of real use, because the old Android watcher missed foreground time, and the series steps up on that date because the measurement changed. There is also a gap from 10 September to 28 October 2026 after a phone switch.
- GPS logging gives raw points only, so place visits and travel distance have been empty since June 2026, and location days roll over at 5 AM UTC instead of 5 AM local time.
- Since the switch to Google's export format in October 2026, two Fitbit measures, sedentary minutes and sleep efficiency, have no source and are left empty.
- Sleep score and device temperature depend on a monthly Takeout series that ends around September 2027.
- Weight arrives only through the scale app's link to Health Connect, and nothing has come through since August, so it shows as stale.
- The old export parsers still append without checking for duplicates, which is why old exports are ingested by hand.

## Implementation Notes

### One Day Boundary

Every daily table gets its `day` from one DuckDB macro, created when the gold build opens the database:

```python
con.execute(
    "CREATE OR REPLACE MACRO shifted_day(ts) AS "
    f"CAST((CAST(ts AS TIMESTAMP) - INTERVAL '{cfg.day_termination_hour}' HOUR) AS DATE)"
)
```

`DAY_TERMINATION_HOUR` defaults to 5.
The wide table is a calendar of every day from the first to the last, left-joined to each per-stream daily table on `day`, so a day with no data is a row of NULLs instead of a missing row.
It replaced a 15-way `FULL OUTER JOIN` chained on `COALESCE`d date keys, whose result depended on the join order.

### Parser Framework

A parser declares its table, its schema and the columns that identify a row.
The base class handles finding files, skipping files whose size and modification time or hash match the ledger, sending rows with missing required fields to a rejects table, and inserting only rows that are not already stored:

```python
class GpsLoggerParser(BaseFileParser):
    name = "gpslogger_gpx"
    source_folder = "gpslogger"
    raw_table = "location_raw"
    # Column order must match location_raw (shared with the Timeline parser).
    schema = {
        "timestamp": "TIMESTAMP", "latitudeE7": "BIGINT", "longitudeE7": "BIGINT",
        "accuracy": "BIGINT", "source": "VARCHAR", "deviceTag": "BIGINT", "altitude": "BIGINT",
        "velocity": "BIGINT", "verticalAccuracy": "BIGINT", "heading": "BIGINT", "placeId": "VARCHAR",
    }
    dedupe_keys = ["timestamp", "latitudeE7", "longitudeE7"]
    required_cols = ["timestamp", "latitudeE7"]
    globs = ("*.gpx",)
    recursive = True
```

### Data Classifications

The data comes in four shapes, each aggregated differently:

| Type | Examples | Aggregation Strategy |
|------|----------|---------------------|
| Continuous time series | Heart rate, steps | Count, sum, average, min, max, median and standard deviation within the day |
| Interval/session data | Sleep, app usage | Credited to the day the session ends, durations summed |
| Point events | Weight, mood, habit entries | Daily counts and value aggregates; habits get one column per tracker |
| Already-daily summaries | Resting heart rate, sleep score, daily HRV | Mapped to the day, duplicates averaged |
