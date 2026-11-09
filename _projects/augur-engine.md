---
title: Augur Engine
summary: A Dagster pipeline that pulls market prices, SEC filings, government records and economic data into ClickHouse, plus a lab where LLM agents write, backtest and paper-trade strategies on it
started: 2025-12-02
updated: 2026-11-08
type: data-pipeline
stack:
  - Python
  - Dagster
  - ClickHouse
  - PostgreSQL
  - Polars
  - FastAPI
  - SQLite
  - Docker
tags:
  - finance
  - data
  - ai
  - developer-tools
loc: 160623
files: 639
architecture:
  auth: none
  database: ClickHouse + PostgreSQL + SQLite
  api: REST
  realtime: none
  background: Dagster
  cache: API responses on disk
  search: none
---

## Overview

Augur Engine is a financial data pipeline built on Dagster.
It pulls market prices, SEC filings, government records and economic data from about 30 sources, none of them paid, and refines them through Bronze, Silver and Gold tiers (the Medallion Architecture) into ClickHouse tables for quantitative analysis.

On top of the data sits a strategy lab.
LLM agents write investment strategies as JSON, backtest them without seeing the future, and paper-trade them forward as new data lands.
Four paper firms, each with its own $1M paper book and allocation rules, decide which of those strategies to fund.
The data is broad on purpose, covering SEC filings, Congressional bills, lobbying records, institutional holdings and macro indicators, so that the agents can look for trading signals beyond price.

It runs on my PC under Docker Desktop: Dagster, ClickHouse, PostgreSQL and a FastAPI dashboard in four containers, with the strategy lab as a separate process beside them.
On 8 November 2026 the pipeline had 271 Dagster assets, 159 ClickHouse tables and 674 asset checks.

The code is private.
This page describes it; there is no repository to link.

## Screenshots

<!-- SCREENSHOT: Dagster UI showing the asset graph with Bronze/Silver/Gold tier groups and their dependency relationships -->
![Asset Graph](/images/projects/augur-engine/screenshot-1.png)

<!-- SCREENSHOT: Frontend dashboard Market Overview page showing market pulse indicators (S&P 500, VIX, Treasury yields) and sector performance -->
![Market Dashboard](/images/projects/augur-engine/screenshot-2.png)

<!-- SCREENSHOT: Query Explorer interface with a sample SQL query and results table -->
![Query Explorer](/images/projects/augur-engine/screenshot-3.png)

## Problem

Building a quantitative trading strategy takes a wide range of financial data that can be trusted.
Most retail and small institutional traders have that data scattered across sources with inconsistent schemas, some of it stale, and nothing to combine market prices with alternative data like SEC filings, Congressional bills or institutional fund flows.

Augur Engine pulls about 30 of those sources into one database that can be queried directly.
Ingestion is automated, rate limited and incremental, and asset checks generated from the table definitions validate the tables as they load.
Backtests read every signal as of that day's close and fill orders at the next day's open, so a strategy cannot trade on data it would not have had.

## Approach

### Stack

- Dagster runs the pipeline: 271 assets with declared dependencies, a daily fetch at 5 AM Central, a freshness watchdog at noon, and sensors that load files I drop in by hand. Fetch assets cache raw responses on disk, separate load assets read that cache into the database, and an automation sensor carries new data through the Silver and Gold assets.
- ClickHouse holds the analytical data in 159 columnar tables. ReplacingMergeTree handles upserts, and partitioning by date keeps time-series queries efficient.
- PostgreSQL is the source of truth for reference data (instruments, universes, organizations and persons) and backs the symbol resolver that every asset uses. It also holds the shared rate-limit state and Dagster's own run history.
- Polars does the transformations, and the largest loaders use its lazy and streaming modes to keep memory use down.
- FastAPI serves a SQL endpoint with guardrails that block mutations, cap results at 10,000 rows and cap run time at 300 seconds. It also serves a plain JavaScript dashboard with pages for markets, insider and institutional activity, options, macro, global markets and a query explorer.
- The strategy lab is a second FastAPI app with its own plain JavaScript dashboard. It reads ClickHouse and PostgreSQL with SELECT only and keeps strategies and runs in its own SQLite file, so it can run while the pipeline is loading.

### The Strategy Lab and the Firms

- A strategy is a JSON document: a fixed list of tickers or a screen that re-picks the top names by a signal at each rebalance, target weights, a rebalance schedule, and rules like "sell a position that is down 13%" or "move half to cash when the VIX is above 25" (see Implementation Notes).
- Backtests step through the trading calendar one day at a time, and every run reports return, drawdown, beta, alpha and up and down capture against a benchmark. A strategy with no end date keeps paper-trading forward as new days load.
- The shared pool held 52 strategies on 8 November 2026, almost all written by agents.
- The four firms draw on that one pool with different allocation policies: momentum, risk parity, a quality blend that penalizes drawdowns, and a thematic book built around bottlenecks in the AI supply chain. Each firm session is a Claude Code session that reads only its own firm's books, refreshes that firm's monitors, and calls a deterministic allocator that moves the paper money and logs every trade. The agent does the judgment, like retiring a strategy for its firm; the code decides how much money moves.
- The first agent layer, from January 2026, is still in the repo: an LLM trader that gets a daily market briefing, calls research tools against the API, and submits orders to a paper trading engine with slippage, persistent memory, watchlists and stop-losses that the engine enforces. Its model calls go through my [Generative Gateway](/projects/generative-gateway/).

### Challenges

- Rate limiting across about 30 APIs: parallel Dagster runs call the same APIs from several workers. The rate limiter is shared through PostgreSQL, with tokens in a `rate_limit_tokens` table and advisory locks coordinating the workers, which keeps parallel runs from getting banned by the providers. Yahoo Finance sets the pace at 2,000 requests an hour, so a backlog after an outage takes days; the long fetches now stop at a time budget and pick up on the next run.

- ClickHouse deduplication edge cases: SEC 13F holdings for large managers like BlackRock came out 100 times too low. The `ORDER BY` key wasn't unique when a filing listed several sub-managers for the same CUSIP, so ReplacingMergeTree collapsed separate holdings into one row. Adding SEC's own row identifier, `infotable_sk`, to the key fixed it.

- A CIK identifies a filer, not a stock: one filer can cover its common stock, every preferred series and other share classes, and 2,057 CIKs map to more than one instrument. Until August 2026 the table of canonical SEC fundamentals kept whichever row the database returned last, so NextEra's whole filing history landed on a preferred series and 896 companies' common shares showed no SEC data. Each filer now has one flagged primary listing, and the two tables that join on CIK raise an error instead of guessing.

- Sources that stall while reporting success: a sweep of every dated table in October 2026 found dozens of sources stalled or wrong while their runs succeeded. SEC had moved the Form 4 and 13F data sets, the old URLs returned 404s, and the fetch only logged a warning, so both sat five months behind. Corporate actions were read from a "Splits" column that yfinance calls "Stock Splits", which lost about 3,000 splits, and bars from Stooq that were already split-adjusted got every factor applied again, so adjusted prices were wrong for about 1,400 instruments. A daily watchdog now fails when any of 134 tables falls behind its expected lag, and every price bar records which adjustments its source already made.

- A latest date that hides stale rows: `earnings_momentum` showed a current latest date that came from one instrument, while 1,796 others were ten months stale. The freshness checks on price and analytics tables now look at how many instruments are behind, not just the newest date.

- Look-ahead by the author: reading data as of a past date stops a backtest from seeing the future, but not an agent that already knows what happened since. Strategies with a past start date are written by a separate subagent that gets only a locked spec and the cutoff date, has no web access, and returns its metrics unedited.

- LLM tool-calling reliability, in the January 2026 trader: agents made up tool names, like `get_technicals_quality_stocks` for `get_quality_stocks`. Tool names now go through fuzzy matching in `_normalize_tool_name()`, and the tool definitions moved from markdown to JSON. When a model returned trades and research queries in the same response, the trades were silently dropped; the trades from the first response are now kept through the research phase and merged with the responses that follow.

## Outcomes

- A fresh install can load from the cache with `full_bootstrap_job`, without a single API call.
- Loading is incremental: watermarks mean each run processes only new data.
- Dagster, FastAPI, ClickHouse and PostgreSQL all run in Docker containers, started in dependency order, each with a memory cap so the stack stays inside Docker Desktop's VM.
- The four firms started on 6 July 2026 and ran 25 sessions through 14 August, one firm per session in rotation.
- GDELT, a global news and events feed, came out of the pipeline on 8 November 2026. It took about a third of the stack's disk, its daily news tone showed no relationship with same-day, 1-, 5- or 21-day returns over 182 days, and its company matching credited Google, Facebook, New York Times and Boeing news to AAPL, ADBE, NMRK and CDE. The firms now take news from the open web, and backtests take none.

Defining every table once in code, as a `ClickHouseTableSchema`, keeps the code and the database from drifting apart.
Asset checks catch bad rows in a table that loads, but they did not catch sources that stopped arriving while their runs succeeded; that took a watchdog that compares every table with how far behind it is allowed to be.
Rate limiting needs coordination across workers; in-memory buckets fail as soon as there is more than one.

## Limits

- The firm sessions are started by hand and have not run since 14 August 2026, so none of the firms has reallocated since then.
- No source is paid. A paid fundamentals and estimates provider was left out on purpose, so forward estimates are only as good as Yahoo's.
- 13F holdings arrive about 45 days after each quarter, so they can confirm a move but not lead it.
- Screens pick from today's index membership, not the membership on the backtest date, so screen-based backtests carry survivorship bias.
- The lab cannot short, use leverage or trade options; a hedge has to be a long position in an inverse ETF.

## Implementation Notes

### Schema-Driven Architecture

Every table is defined once as a Python dataclass, and its DDL, IO manager config and asset checks are generated from that definition:

```python
RAW_OHLCV_DAILY = ClickHouseTableSchema(
    name="raw_ohlcv_daily",
    tier="bronze",
    description=(
        "Daily OHLCV from Stooq bulk drops and the yFinance gap-fill, AS DELIVERED: "
        "Stooq is split-adjusted (and partly dividend-adjusted) as of its drop, yFinance "
        "split-adjusted as of its fetch. source/source_asof/split_basis_date/div_basis_date "
        "record what each bar already contains."
    ),
    engine="ReplacingMergeTree",
    order_by=("instrument_id", "date"),
    partition_by="toYYYYMM(date)",
    primary_key=("instrument_id", "date"),
    columns={
        "instrument_id": pl.UInt32,
        "date": pl.Date,
        "open": pl.Float64,
        "high": pl.Float64,
        "low": pl.Float64,
        "close": pl.Float64,
        "volume": pl.Float64,
        "source": pl.String,  # "stooq" | "yfinance"
        "source_asof": pl.Date,
        "split_basis_date": pl.Date,
        "div_basis_date": pl.Date,
    },
    nullable_columns=("source_asof", "split_basis_date", "div_basis_date"),
    # column_codecs, column_comments and owner_assets omitted here
    watermark_column="date",
    metadata_extractors=("row_count", "instrument_count", "quarantine_stats"),
)
```

### Strategy Rules

The rules from one of the agent-written strategies: a stop at -13%, a half trim at +35%, and a move to 50% cash when volatility spikes or breadth breaks down.

```json
"rules": [
  { "when": {"field": "position.unrealized_pct", "op": "<=", "value": -0.13},
    "do": "sell", "scope": "position", "note": "cut losers (report: 12-15% single-name / 8-10% ETF, uniform proxy)" },
  { "when": {"field": "position.unrealized_pct", "op": ">=", "value": 0.35},
    "do": "trim", "amount": 0.5, "scope": "position", "note": "take partial profit on fast movers (+25-40% band)" },
  { "when": {"any": [
      {"field": "macro.vix", "op": ">", "value": 25},
      {"field": "macro.breadth_above_sma50", "op": "<", "value": 40}
    ]},
    "do": "go_to_cash", "target_cash": 0.5, "scope": "portfolio",
    "note": "tail-risk breaker: de-risk on vol spike / breadth breakdown (report emphasizes elevated SKEW)" }
],
```

### Data Provider Coverage

| Category | Providers |
|----------|-----------|
| Market Data | Stooq, yFinance, Polygon (Massive), CBOE, FINRA |
| SEC Filings | 13F holdings, Form 4 insider, N-PORT funds, FTD, XBRL fundamentals, Exhibit 21 subsidiaries |
| Macro | FRED, Treasury, BLS, EIA, World Bank, BIS, ECB, CFTC, NFIB |
| Government | Congress.gov, LobbyView, Senate LDA, USAspending |
| Reference | GLEIF (LEI), Fama-French factors, Nasdaq listings, Wikipedia index constituents |
