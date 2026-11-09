---
title: Augur Engine
summary: A pipeline that pulls market prices, SEC filings, government records and economic data into one database, plus a simulator for testing LLM trading agents on it
started: 2025-12-02
updated: 2026-01-30
type: data-pipeline
stack:
  - Python
  - Dagster
  - ClickHouse
  - PostgreSQL
  - FastAPI
  - Polars
tags:
  - finance
  - data
  - ai
  - developer-tools
loc: 126529
files: 482
architecture:
  auth: none
  database: ClickHouse + PostgreSQL
  api: REST
  realtime: none
  background: Dagster
  cache: Parquet files
  search: none
---

## Overview

Augur Engine is a financial data pipeline built on Dagster.
It pulls data from 32 external providers and refines it through Bronze, Silver and Gold tiers (the Medallion Architecture) into ClickHouse tables for quantitative analysis.

On top of the data sits an API that LLM trading agents use to test theories, run backtests and paper trade.
The data is broad on purpose, covering SEC filings, Congressional bills, lobbying records, GDELT geopolitical events and macro indicators, so that analyst agents can look for trading signals across structured data, documents and alternative datasets.

## Screenshots

<!-- SCREENSHOT: Dagster UI showing the asset graph with Bronze/Silver/Gold tier groups and their dependency relationships -->
![Asset Graph](/images/projects/augur-engine/screenshot-1.png)

<!-- SCREENSHOT: Frontend dashboard Market Overview page showing market pulse indicators (S&P 500, VIX, Treasury yields) and sector performance -->
![Market Dashboard](/images/projects/augur-engine/screenshot-2.png)

<!-- SCREENSHOT: Query Explorer interface with a sample SQL query and results table -->
![Query Explorer](/images/projects/augur-engine/screenshot-3.png)

## Problem

Building a quantitative trading strategy takes a wide range of financial data that can be trusted.
Most retail and small institutional traders have that data scattered across sources with inconsistent schemas, some of it stale, and nothing to combine market prices with alternative data like SEC filings, Congressional voting records or institutional fund flows.

Augur Engine pulls 30+ of those sources into one database that can be queried directly.
Ingestion is automated, rate limited and incremental.
There are 238+ asset checks generated from the table schemas, and a simulation environment for testing LLM trading agents without look-ahead bias.

## Approach

### Stack

- Dagster runs the pipeline: 182 assets with declared dependencies, materialization sensors and built-in observability. Asset checks validate the data at each tier.

- ClickHouse holds the analytical data in 88 columnar tables. ReplacingMergeTree handles upserts, and partitioning by date keeps time-series queries efficient.

- PostgreSQL is the source of truth for reference data (instruments, universes, organizations and persons) and backs the symbol resolver that every asset uses.

- Polars does the transformations, with lazy evaluation and streaming to keep memory use down, and validates data against the `ClickHouseTableSchema` definitions.

- FastAPI serves REST endpoints for ad hoc SQL queries, with guardrails that block mutations and cap rows and run time. It also serves a plain JavaScript frontend for exploring the data.

- augur_firm is the LLM trading simulation. Several agents get structured market briefings, call tools to do research, and submit orders through a paper trading engine.

### Challenges

- Rate limiting across 30+ APIs: parallel Dagster runs call the same APIs from several workers. The rate limiter is shared through PostgreSQL, with tokens in a `rate_limit_tokens` table and advisory locks coordinating the workers, which keeps parallel runs from getting banned by the providers.

- ClickHouse deduplication edge cases: SEC 13F holdings for large managers like BlackRock came out 100 times too low. The `ORDER BY` keys weren't unique when a filing listed several sub-managers for the same CUSIP, so ReplacingMergeTree collapsed separate holdings into one row. A hash-based row identifier fixed it.

- LLM tool-calling reliability: agents made up tool names, like `get_technicals_quality_stocks` for `get_quality_stocks`. Tool names now go through fuzzy matching in `_normalize_tool_name()`, and the tool definitions moved from markdown to JSON.

- Mixed intent responses: when a model returned trades and research queries in the same response, the trades were silently dropped. The trades from the first response are now kept through the research phase and merged with the responses that follow.

## Outcomes

Augur Engine ingests data from 32 providers into 88 ClickHouse tables through 182 Dagster assets, with 238+ automated quality checks.

- A fresh install can load from the Parquet cache with `full_bootstrap_job`, without a single API call.
- Loading is incremental: watermarks mean each run processes only new data, so a daily run takes minutes.
- Dagster, FastAPI, ClickHouse and PostgreSQL all run in Docker containers, started in dependency order.
- Trading agents can run multi-day backtests with persistent memory, watchlists, and stop-losses that the engine enforces.

Defining every table once in code, as a `ClickHouseTableSchema`, keeps the code and the database from drifting apart.
Dagster's asset checks catch bad data before it spreads to downstream assets.
Rate limiting needs coordination across workers; in-memory buckets fail as soon as there is more than one.

## Implementation Notes

### Schema-Driven Architecture

Every table is defined once as a Python dataclass, and its DDL, IO manager config and asset checks are generated from that definition:

```python
RAW_OHLCV_DAILY = ClickHouseTableSchema(
    name="raw_ohlcv_daily",
    tier="bronze",
    description="Daily OHLCV from Stooq/yFinance/Massive",
    engine="ReplacingMergeTree",
    order_by=("symbol", "date", "source"),
    partition_by="toYYYYMM(date)",
    columns={
        "symbol": pl.Utf8,
        "date": pl.Date,
        "open": pl.Float64,
        "high": pl.Float64,
        "low": pl.Float64,
        "close": pl.Float64,
        "volume": pl.UInt64,
        "source": pl.Utf8,
    },
    watermark_column="date",
    check_config=CheckConfig(
        min_row_count=1000,
        min_instrument_count=500,
        value_bounds={"open": (0, 1_000_000), "volume": (0, 1e12)},
    ),
)
```

### LLM Trading Agent Response Schema

Agents return structured JSON with trades, research queries, and memory updates:

```python
AGENT_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "reasoning": {"type": "string"},
        "research_queries": {
            "type": "array",
            "items": {
                "properties": {"tool": {"type": "string"}, "args": {"type": "object"}}
            }
        },
        "trades": {
            "type": "array",
            "items": {
                "properties": {
                    "action": {"enum": ["BUY", "SELL", "CLOSE"]},
                    "symbol": {"type": "string"},
                    "quantity": {"type": "number"}
                }
            }
        },
        "memories_to_record": {"type": "object"},
        "watchlist_updates": {"type": "object"}
    }
}
```

### Data Provider Coverage

| Category | Providers |
|----------|-----------|
| Market Data | Stooq, yFinance, Polygon (Massive), CBOE |
| SEC Filings | 13F holdings, Form 4 insider, N-PORT funds, FTD |
| Macro | FRED, Treasury, BLS, EIA, World Bank |
| Alternative | GDELT, Congress.gov, LobbyView, Senate LDA |
| Reference | GLEIF (LEI), Fama-French factors, FINRA |
