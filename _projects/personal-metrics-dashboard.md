---
title: Personal Metrics Dashboard
summary: A pipeline that merges Fitbit, app usage, mood and location exports into one row per day, with a dashboard for finding correlations
started: 2025-11-30
updated: 2025-11-30
type: data-pipeline
stack:
  - Python
  - DuckDB
  - Streamlit
  - Pandas
  - Altair
tags:
  - data
  - quantified-self
  - analytics
loc: 12652
files: 97
architecture:
  auth: none
  database: DuckDB
  api: none
  realtime: none
  background: none
  cache: none
  search: none
---

## Overview

Personal Metrics Dashboard pulls health and productivity data from over 15 sources into one place and looks for correlations between them.
Raw exports from Fitbit, ActivityWatch, RescueTime, Daylio and other apps go through bronze, silver and gold tiers in DuckDB and end up in one daily metrics table built for correlation analysis.

The data runs from 2017 to 2025: sleep stages, heart rate variability, SpO2, steps, app usage, mood, weight and location history.
A Streamlit dashboard on top shows charts, lagged correlations and the status of the pipeline.

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
It has to deal with sources that overlap, like more than one sleep tracker, with day boundaries that depend on the time zone, and with correlating metrics sampled at different frequencies.

## Approach

The pipeline follows the medallion data lake pattern, with raw data in a bronze database, daily aggregates in silver, and one wide daily table in gold.

### Stack

- DuckDB: an embedded analytical database, picked for columnar storage, fast aggregations and single-file deployment. Its window functions handle the rolling averages and lag analysis.
- Pandas: parses the different source formats and transforms the data.
- Streamlit: the dashboard, with very little frontend code. It has date range filters, metric selection, and charts that update as the filters change.
- Altair: the charts, including faceted heatmaps, time series and correlation matrices.
- ijson: streams large ActivityWatch exports instead of loading the whole file into memory.

### Data Flow

```
Source Files (CSV/JSON)
        │
        ▼
  ┌─────────────┐
  │   Parsers   │  → raw_data.duckdb (Bronze)
  │  (26 files) │     fb_sleep_logs, aw_events, etc.
  └─────────────┘
        │
        ▼
  ┌─────────────┐
  │   Unify     │  → unified_sleep, unified_usage
  │  (Overlap   │     Source priority: AW > RT > AppUsage
  │  Resolution)│
  └─────────────┘
        │
        ▼
  ┌─────────────┐
  │ Aggregators │  → aggregates.duckdb (Silver)
  │ (12 files)  │     sleep_daily_agg, usage_daily_agg, etc.
  └─────────────┘
        │
        ▼
  ┌─────────────┐
  │  Wide Join  │  → daily_wide_metrics (Gold)
  │             │     One row per day, 150+ columns
  └─────────────┘
```

### Challenges

- Offset day boundaries: sleep doesn't stop at midnight. A configurable `DAY_TERMINATION_HOUR`, 5 AM by default, decides where a day ends, so a sleep session that ends at 2 AM counts toward the previous day.

- Overlapping sources: ActivityWatch and RescueTime both track computer usage, so priority is decided per device per day. On a day with any ActivityWatch data for the desktop, RescueTime's desktop data is ignored, but its mobile data is still used if ActivityWatch didn't capture mobile.

- Incremental processing: with 8+ years of data and frequent exports, reprocessing everything is expensive. Each parser records file hashes in a `processed_files` table and skips files that haven't changed.

- Schema changes: when a source adds a metric, like Fitbit adding new HRV fields, the parser adds the missing column with `ALTER TABLE ADD COLUMN` instead of dropping existing data.

## Outcomes

An automated lag scan across 30-day windows found that calorie intake correlates most strongly with weight change 14 days later.
Sleep quality, measured as deep sleep percentage, shows a correlation of 0.3 or more with the next day's app productivity categories.
KeepTrack entries for caffeine, exercise and meditation can be correlated against the biometric data.

Adding a source means writing one more parser, a self-contained script of about 200 lines that follows the same pattern as the others.

## Implementation Notes

### Daily Wide Table Join Strategy

The `daily_wide_metrics.py` aggregator uses a chain of `FULL OUTER JOIN` operations to preserve all dates present in any source table:

```sql
SELECT 
    COALESCE(
        base_usage.daily_date,
        sleep.agg_date,
        steps.agg_date,
        ...
    ) AS daily_date,
    usage.total_usage_minutes,
    sleep.daily_total_sleep,
    steps.daily_step_total,
    ...
FROM usage_daily_agg AS base_usage
FULL OUTER JOIN unified_sleep_daily_agg AS sleep
    ON base_usage.daily_date = sleep.agg_date
FULL OUTER JOIN fb_steps_daily_agg AS steps
    ON COALESCE(base_usage.daily_date, sleep.agg_date) = steps.agg_date
...
```

### File Processing Pattern

Every parser follows this incremental processing pattern:

```python
for file_path in source_files:
    file_hash = compute_file_hash(str(file_path))
    file_size = file_path.stat().st_size
    
    if file_already_processed(con, PARSER_NAME, str(file_path), file_hash, file_size):
        continue  # Skip unchanged files
    
    # Parse and insert...
    
    mark_file_as_processed(con, PARSER_NAME, str(file_path), file_hash, file_size)
```

### Data Classifications

The data comes in four temporal patterns, each aggregated differently:

| Type | Examples | Aggregation Strategy |
|------|----------|---------------------|
| Continuous time series | Heart rate, steps | Sum/avg within daily boundary |
| Interval/session data | Sleep logs, app usage | Split across boundaries, sum durations |
| Point events | Weight, mood entries | Last value or average per day |
| Categorical | App categories, mood labels | Count/mode per day |
