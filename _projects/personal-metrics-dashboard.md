---
title: Personal Metrics Dashboard
summary: Self-hosted ETL pipeline aggregating Fitbit, app usage, mood, and location data into DuckDB for correlation analysis
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

A comprehensive personal data analytics platform that ingests, unifies, and correlates health and productivity metrics from over 15 different data sources. The system implements a bronze/silver/gold data lake architecture using DuckDB as the analytical database, transforming raw exports from Fitbit, ActivityWatch, RescueTime, Daylio, and other apps into a unified daily metrics table optimized for correlation analysis.

The pipeline processes years of personal data (spanning 2017-2025) including sleep stages, heart rate variability, SpO2, steps, app usage patterns, mood tracking, weight measurements, and location history. A Streamlit-based dashboard provides interactive visualizations, lagged correlation analysis, and a pipeline status monitor.

## Screenshots

<!-- SCREENSHOT: Pipeline Status Dashboard showing ingestion status with processed files count and source availability matrix -->
![Pipeline Status](/images/projects/metrics_dashboard/screenshot-1.png)

<!-- SCREENSHOT: Daily Wide Metrics Viewer showing multi-metric time series chart with date filtering and aggregation controls -->
![Metrics Visualization](/images/projects/metrics_dashboard/screenshot-2.png)

<!-- SCREENSHOT: Correlation heatmap showing pairwise relationships between metrics like sleep, heart rate, and productivity -->
![Correlation Analysis](/images/projects/metrics_dashboard/screenshot-3.png)

## Problem

Personal health and productivity data is fragmented across dozens of apps and devices, each with proprietary export formats. Manually analyzing relationships between sleep quality and next-day productivity, or tracking how exercise affects mood over time, requires tedious data wrangling and loses the temporal context needed for meaningful insights.

This project solves the data unification problem by creating a single source of truth where metrics from different sources can be joined, compared, and analyzed together. It handles the complexity of overlapping data sources (e.g., multiple sleep trackers), timezone-aware daily boundaries, and the challenge of correlating metrics with different sampling frequencies.

## Approach

The architecture follows a medallion (bronze/silver/gold) data lake pattern:

### Stack

- **DuckDB** - Embedded analytical database chosen for columnar storage, fast aggregations, and single-file deployment. Supports complex window functions for rolling averages and lag analysis.
- **Pandas** - DataFrame manipulation for parsing heterogeneous source formats and data transformation.
- **Streamlit** - Rapid prototyping of interactive dashboards with minimal frontend code. Enables date range filtering, metric selection, and real-time chart updates.
- **Altair** - Declarative visualization library for creating faceted heatmaps, time series, and correlation matrices.
- **ijson** - Streaming JSON parser for handling large ActivityWatch exports without loading entire files into memory.

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

- **Offset daily boundaries** - Personal sleep cycles don't align with midnight. Implemented a configurable `DAY_TERMINATION_HOUR` (default 5 AM) so a sleep session ending at 2 AM is credited to the previous day's metrics.

- **Source overlap resolution** - When multiple apps track the same activity (e.g., ActivityWatch and RescueTime both tracking computer usage), the system applies per-device-per-day priority rules. A day with any ActivityWatch data for "desktop" ignores RescueTime's desktop data, but still uses RescueTime's mobile data if AW didn't capture it.

- **Incremental processing** - With 8+ years of data and frequent exports, full reprocessing is expensive. Each parser tracks file hashes in a `processed_files` table, skipping unchanged files on subsequent runs.

- **Schema evolution** - As new metrics become available (e.g., Fitbit adding new HRV fields), parsers use `ALTER TABLE ADD COLUMN` to backfill missing columns without dropping existing data.

## Outcomes

The unified daily metrics table enables analyses that were previously impossible:

- **Lag correlation scanning** - Automated search across 30-day windows finds that calorie intake correlates strongest with weight change 14 days later
- **Cross-domain insights** - Sleep quality (deep sleep %) shows 0.3+ correlation with next-day app productivity categories
- **Habit tracking validation** - KeepTrack entries (caffeine, exercise, meditation) can be correlated against biometric outcomes

The modular parser architecture makes adding new data sources straightforward - each parser is a self-contained ~200 line script following the same pattern.

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

The system handles multiple temporal data patterns:

| Type | Examples | Aggregation Strategy |
|------|----------|---------------------|
| Continuous time series | Heart rate, steps | Sum/avg within daily boundary |
| Interval/session data | Sleep logs, app usage | Split across boundaries, sum durations |
| Point events | Weight, mood entries | Last value or average per day |
| Categorical | App categories, mood labels | Count/mode per day |
