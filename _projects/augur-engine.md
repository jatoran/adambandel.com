---
title: Augur Engine
summary: Dagster-based financial data platform with 180+ assets, 30+ data providers, and LLM trading simulation
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

Augur Engine is a production-grade financial data platform that ingests, transforms, and serves market data for quantitative analysis. Built on Dagster's orchestration framework, it implements a Medallion Architecture (Bronze/Silver/Gold tiers) to progressively refine raw data from 32 external providers into analytics-ready datasets stored in ClickHouse.

The platform's vision extends beyond data pipelines: it provides an API surface that enables LLM-powered trading agents to test theories, run backtests, and execute paper trading simulations. The broad data coverage (SEC filings, Congressional bills, lobbying records, GDELT geopolitical events, macro indicators) supports analyst agents that surface alpha signals across structured data, documents, and alternative datasets.

## Screenshots

<!-- SCREENSHOT: Dagster UI showing the asset graph with Bronze/Silver/Gold tier groups and their dependency relationships -->
![Asset Graph](/images/projects/augur-engine/screenshot-1.png)

<!-- SCREENSHOT: Frontend dashboard Market Overview page showing market pulse indicators (S&P 500, VIX, Treasury yields) and sector performance -->
![Market Dashboard](/images/projects/augur-engine/screenshot-2.png)

<!-- SCREENSHOT: Query Explorer interface with a sample SQL query and results table -->
![Query Explorer](/images/projects/augur-engine/screenshot-3.png)

## Problem

Building quantitative trading strategies requires access to diverse, high-quality financial data. Most retail and small institutional traders face fragmented data sources, inconsistent schemas, stale data, and no infrastructure to combine market prices with alternative data like SEC filings, Congressional voting records, or institutional fund flows.

This project consolidates 30+ data sources into a unified, query-ready platform with:
- Automated ingestion with rate limiting and incremental processing
- Schema-driven data quality checks (238+ asset checks)
- A simulation environment for testing LLM trading agents without look-ahead bias

## Approach

### Stack

- **Orchestration (Dagster)** - Manages 182 assets with declarative dependencies, materialization sensors, and built-in observability. Asset checks validate data quality at each tier.

- **OLAP Database (ClickHouse)** - Columnar storage optimized for analytical queries across 88 tables. ReplacingMergeTree handles upserts; partitioning by date enables efficient time-series queries.

- **Relational Database (PostgreSQL)** - Source of truth for reference data: instruments, universes, organizations, and persons. Powers the symbol resolver used across all assets.

- **Data Processing (Polars)** - Lazy evaluation and streaming for memory-efficient transformations. Schema validation against `ClickHouseTableSchema` definitions.

- **API Layer (FastAPI)** - REST endpoints for dynamic SQL queries with safety guardrails (mutation blocking, row limits, timeouts). Serves the vanilla JS frontend for data exploration.

- **LLM Trading Simulation (augur_firm)** - Multi-agent trading simulation framework. Agents receive structured market briefings, execute tool-calling for research, and submit orders through a paper trading engine.

### Challenges

- **Rate limiting across 30+ APIs** - Built a distributed rate limiter using PostgreSQL advisory locks. Tokens are stored in `rate_limit_tokens` table; cross-worker coordination prevents API bans during parallel Dagster runs.

- **ClickHouse deduplication edge cases** - SEC 13F data showed 100x undercounts for large managers like BlackRock. Root cause: `ORDER BY` keys weren't unique when filings contained multiple sub-managers per CUSIP. Fixed by adding a hash-based row identifier.

- **LLM tool-calling reliability** - Agents hallucinated tool names (`get_technicals_quality_stocks` instead of `get_quality_stocks`). Implemented fuzzy matching with `_normalize_tool_name()` and switched from markdown to JSON tool definitions.

- **Mixed intent responses** - When LLMs returned both trades and research queries in one response, trades were silently dropped. Solution: preserve first-response trades before research phase and merge with subsequent responses.

## Outcomes

The platform successfully ingests data from 32 providers into 88 ClickHouse tables, with 182 Dagster assets and 238+ automated quality checks. Key achievements:

- **Zero-API bootstrap**: Fresh installations can load from Parquet cache without API calls using `full_bootstrap_job`
- **Incremental processing**: Watermark-based loading processes only new data, reducing daily runs to minutes
- **Full Docker deployment**: All services (Dagster, FastAPI, ClickHouse, PostgreSQL) run in containers with proper dependency ordering
- **LLM simulation framework**: Trading agents can execute multi-day backtests with persistent memory, watchlists, and engine-enforced stop-losses

Lessons learned:
- Schema-as-code (`ClickHouseTableSchema`) eliminates drift between code and database
- Dagster's asset checks catch data quality issues before they propagate downstream
- Rate limiting needs distributed coordination in production; in-memory buckets fail with multiple workers

## Implementation Notes

### Schema-Driven Architecture

All table definitions live in Python dataclasses, generating DDL, IO manager configs, and asset checks:

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
