---
title: Personal Metrics Dashboard
summary: Self-hosted ETL pipeline aggregating health, productivity, and lifestyle data from 10+ sources into a unified DuckDB analytics warehouse.
date: 2024-09-01
---

## Overview

Personal Metrics Dashboard is a modular data platform that consolidates years of personal quantified-self data into a single, queryable analytics database. It ingests data exports from Fitbit, RescueTime, ActivityWatch, Daylio, KeepTrack, Google Location History, and custom CSVs—normalizing, deduplicating, and unifying them into daily aggregate tables optimized for correlation analysis and trend discovery.

The system follows a medallion architecture (Bronze/Silver/Gold layers) where 25+ specialized parsers handle raw ingestion, unification logic resolves overlapping data sources with priority rules, and aggregators produce daily summaries. The final output is a wide-format "one row per day" table spanning 150+ metrics across sleep, productivity, mood, fitness, and location.

## Screenshots

<!-- SCREENSHOT: Main Streamlit dashboard showing daily_wide_metrics table with date selector and multi-metric chart visualization -->
![Daily metrics overview](/images/projects/metrics_dashboard/screenshot-1.png)

<!-- SCREENSHOT: DuckDB CLI or database inspector output showing the schema of unified_sleep_daily_agg table with sample rows -->
![Sleep aggregation data](/images/projects/metrics_dashboard/screenshot-2.png)

<!-- SCREENSHOT: Terminal output during parser execution showing progress, file processing counts, and deduplication stats -->
![ETL pipeline in action](/images/projects/metrics_dashboard/screenshot-3.png)

## Problem

Quantified-self enthusiasts accumulate data across dozens of apps and devices, but the data lives in silos. Fitbit exports JSON, RescueTime exports CSV, ActivityWatch uses its own format, and manual trackers like Daylio and KeepTrack add more fragmentation. Answering questions like "Does my caffeine intake affect sleep quality?" or "How does screen time correlate with mood?" requires painful manual joins across incompatible schemas.

Commercial solutions either lock you into their ecosystem, lack the granularity needed for serious analysis, or charge subscription fees for your own data. This project provides a self-hosted, fully-owned data warehouse where all personal metrics live in a single DuckDB file ready for SQL analysis, Jupyter notebooks, or dashboard visualization.

## Approach

The architecture prioritizes incremental processing, source-aware deduplication, and schema stability over performance optimization—since personal data volumes are modest but consistency is critical.

### Stack

- **DuckDB** - Embedded columnar database chosen for its analytical query performance, single-file simplicity, and native Python integration. No server setup required.
- **Python 3.12** - Core language for all parsers, aggregators, and utilities. Type hints throughout.
- **Pandas** - Data transformation layer for complex reshaping operations that are clearer in DataFrame operations than SQL.
- **ijson** - Streaming JSON parser for handling multi-gigabyte ActivityWatch exports without memory exhaustion.
- **Streamlit** - Planned visualization layer for exploring the unified data through interactive dashboards.

### Challenges

- **Overlapping data sources** - Multiple apps track the same metrics (e.g., ActivityWatch, RescueTime, and AppUsage all track screen time). Solved with a per-device-per-day priority system: ActivityWatch > RescueTime > AppUsage. If higher-priority data exists for a device/day combination, lower-priority sources are excluded from that day's aggregation.

- **Cross-midnight sessions** - Sleep sessions that start at 11 PM and end at 7 AM span two calendar dates. Rather than splitting them, sessions are attributed to their end date, matching how humans think about "last night's sleep." A configurable `DAY_TERMINATION_HOUR` (default: 5 AM) defines day boundaries for aggregation.

- **Schema evolution** - Source apps change their export formats over time. Parsers use defensive column access and backfill missing columns with ALTER TABLE when aggregator tables already exist with older schemas.

- **Deduplication at scale** - Re-running parsers shouldn't create duplicates. Each parser tracks processed files via MD5 hash + file size in a `processed_files` table, and post-parse DISTINCT operations catch any duplicates from overlapping date ranges in source files.

## Outcomes

The pipeline successfully ingests 7+ years of historical data across all configured sources:

- **Sleep:** 2,500+ nights from Fitbit with minute-level sleep stage data, plus non-Fitbit historical logs
- **Usage:** 500,000+ session records from three tracking apps, unified into device-aware daily summaries
- **Fitness:** 2 million+ heart rate samples, daily step/distance totals, HRV, SpO2
- **Mood/Habits:** Daily Daylio entries with custom energy/stress/pain scales, KeepTrack events for caffeine/meditation/exercise

The `daily_wide_metrics` table provides immediate answers to correlation questions via simple SQL. Running the full pipeline from raw exports takes ~2 minutes; incremental runs complete in seconds by skipping unchanged files.

## Implementation Notes

### Data Flow

```
Source Files (JSON/CSV)
    ↓
[Parsers] → raw_data.duckdb (Bronze)
    ↓
[Unifiers] → unified_usage, unified_sleep (Silver)
    ↓
[Aggregators] → *_daily_agg tables (Silver)
    ↓
[Wide Builder] → daily_wide_metrics (Gold)
```

### Parser Pattern

Each parser follows a consistent pattern for idempotent ingestion:

```python
def parse_source_folder():
    # 1. Check for new/modified files via hash comparison
    if file_already_processed(con, PARSER_NAME, path, hash, size):
        return
    
    # 2. Parse and transform
    df = pd.DataFrame(...)
    
    # 3. Atomic insert with transaction
    con.execute("BEGIN")
    con.execute("INSERT INTO table BY NAME SELECT * FROM df")
    mark_file_as_processed(con, PARSER_NAME, path, hash, size)
    con.execute("COMMIT")
    
    # 4. Post-parse deduplication
    con.execute("CREATE TABLE temp AS SELECT DISTINCT * FROM table")
```

### Wide Table Join Strategy

The `daily_wide_metrics` builder uses a cascading FULL OUTER JOIN across 14 aggregator tables, with COALESCE to handle sparse data (not every day has every metric type):

```sql
SELECT 
    COALESCE(usage.date, sleep.date, steps.date, ...) AS daily_date,
    usage.total_minutes,
    sleep.daily_total_sleep,
    steps.daily_step_total,
    ...
FROM usage_daily_agg usage
FULL OUTER JOIN unified_sleep_daily_agg sleep 
    ON usage.date = sleep.agg_date
FULL OUTER JOIN fb_steps_daily_agg steps 
    ON COALESCE(usage.date, sleep.agg_date) = steps.agg_date
-- ... continues for all aggregator tables
```

### Configuration

Environment variables control paths and aggregation behavior:

```env
SOURCE_FILES_DIR=./source_files
DB_RAW_DATA_FILE=./database/raw_data.duckdb
DB_AGGREGATES_FILE=./database/aggregates.duckdb
DAY_TERMINATION_HOUR=5  # Days end at 5 AM, not midnight
```
