---
title: Augur Engine
summary: Dagster-based financial data platform with 88 ClickHouse tables, 32 data providers, and LLM-powered autonomous trading agents
date: 2025-12-02
---

## Overview

Augur Engine is a production-grade financial data platform that ingests, transforms, and serves comprehensive market data for quantitative analysis. Built on Dagster's asset-centric orchestration, it implements a Medallion Architecture (Bronze/Silver/Gold) to progressively refine raw data into actionable analytics across 88 ClickHouse tables.

The platform powers an LLM-based trading simulator where autonomous AI "firms" make investment decisions using the underlying data infrastructure. Agents maintain persistent memory across trading days, execute structured research queries, and manage portfolios with engine-enforced risk controls.

## Screenshots

<!-- SCREENSHOT: Dagster UI showing the asset dependency graph with Bronze, Silver, and Gold layers visible, highlighting the data flow from raw ingestion to analytics -->
![Asset Dependency Graph](/images/projects/augur-engine/screenshot-1.png)

<!-- SCREENSHOT: Dashboard showing the market overview panel with candlestick charts, sector heatmap, and institutional flow indicators -->
![Market Dashboard](/images/projects/augur-engine/screenshot-2.png)

<!-- SCREENSHOT: LLM trading simulation output showing agent reasoning, trade execution, and portfolio state after a simulated trading day -->
![Trading Simulation](/images/projects/augur-engine/screenshot-3.png)

<!-- SCREENSHOT: ClickHouse query interface or Dagster materialization logs showing data quality checks passing on a Gold layer asset -->
![Data Quality Checks](/images/projects/augur-engine/screenshot-4.png)

## Problem

Building a quantitative research platform requires solving three interconnected challenges: reliable data ingestion from dozens of rate-limited APIs, transformation pipelines that maintain data quality at scale, and an analytics layer that serves both human analysts and AI agents. Traditional approaches scatter these concerns across cron jobs, ad-hoc scripts, and disconnected databases, creating maintenance nightmares and data drift.

The secondary challenge was exploring how LLMs could function as autonomous trading agents. Rather than simple chatbot interfaces, I wanted agents with persistent memory, structured tool use, and the ability to reason over multi-domain data (market, macro, government, alternative) to surface non-obvious insights.

## Approach

The architecture centers on **Dagster's asset-based orchestration**, where each dataset is a first-class citizen with explicit dependencies, freshness policies, and data quality checks. This declarative approach replaced imperative scripts with a self-documenting dependency graph.

### Stack

- **Orchestration** - Dagster for asset dependency management, scheduling, and 238+ auto-generated data quality checks
- **Analytics Database** - ClickHouse for columnar OLAP queries across 88 tables with sub-second response times
- **Metadata Store** - PostgreSQL for relational data (instruments, universes, distributed rate limiting via advisory locks)
- **Data Processing** - Polars for high-performance DataFrame operations; Pandas for market calendar compatibility
- **API Layer** - FastAPI serving REST endpoints with query passthrough to ClickHouse
- **Frontend** - Vanilla JavaScript SPA with LightweightCharts for candlesticks and Chart.js for composites
- **AI Integration** - Anthropic Claude with Generative Gateway for guaranteed structured JSON output

### Challenges

- **Schema drift between code and database** - Solved with declarative `ClickHouseTableSchema` that auto-generates DDL, Polars schemas, IO configs, and check definitions from a single source of truth
- **Rate limit coordination across workers** - Implemented distributed rate limiting using PostgreSQL advisory locks, enabling multi-worker Dagster runs without API bans
- **LLM output reliability** - Integrated a Generative Gateway that enforces JSON schema at generation time, eliminating parsing failures and hallucinated field names
- **Incremental processing at scale** - Built watermark-based incrementalism with freshness checking, reducing redundant API calls and enabling efficient re-runs

## Outcomes

The platform reliably processes data from 32 providers (FRED, SEC, Treasury, Congress, GDELT, yFinance, and more) into a unified analytics layer. The Medallion Architecture creates clear separation between raw ingestion, cleaned/adjusted data, and derived signals.

Key learnings:
- **Asset-centric orchestration** fundamentally changes how you reason about data pipelines. Dependencies become explicit, testing becomes tractable, and the codebase documents itself.
- **Declarative schemas** eliminate entire categories of bugs. When table definitions, DataFrame types, and quality checks derive from the same source, drift becomes impossible.
- **LLM agents benefit from constraints**. Engine-enforced risk controls (stop-losses, position limits) and structured output schemas produce more reliable behavior than prompt-only guardrails.

## Implementation Notes

The schema system demonstrates how a single declaration propagates through the entire stack:

```python
class ClickHouseTableSchema:
    """Single source of truth for table definitions."""
    name: str
    columns: dict[str, pl.DataType]
    primary_key: tuple[str, ...]
    order_by: tuple[str, ...]
    check_config: CheckConfig | None = None

    def to_ddl(self) -> str:
        """Generate CREATE TABLE statement."""
        ...

    def to_polars_schema(self) -> dict[str, pl.DataType]:
        """Generate Polars DataFrame schema for validation."""
        ...

    def to_io_config(self) -> dict:
        """Generate Dagster IO manager configuration."""
        ...
```

The two-phase ingestion pattern separates API concerns from database concerns:

```
fetch_api_fred     Load Cache
      |                 |
      v                 v
  (Parquet)  --->  load_cache_fred
                        |
                        v
                   (ClickHouse)
```

This enables zero API calls on re-runs, watermark-based incrementalism, and resilience to database failures. Each phase can be retried independently without re-fetching data.

The LLM trading simulator enforces structured output through schema constraints:

```python
AGENT_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "reasoning": {"type": "string"},
        "trades": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "symbol": {"type": "string"},
                    "side": {"enum": ["buy", "sell", "close"]},
                    "quantity": {"type": "integer"},
                    "rationale": {"type": "string"}
                }
            }
        },
        "research_queries": {"type": "array"}
    },
    "required": ["reasoning", "trades"]
}
```

Agents maintain three tiers of persistent memory (portfolio, strategy, symbol-level) that carry context across simulated trading days, enabling learning and thesis tracking without fine-tuning.
