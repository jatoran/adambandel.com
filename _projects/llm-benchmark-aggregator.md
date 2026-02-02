---
title: LLM Benchmark Aggregator
summary: Unified AI model benchmark tracking across 50+ sources with canonical identity resolution and LLM-assisted data enrichment
date: 2025-12-20
github: https://github.com/adambandel/llm-bench-aggregator
---

## Overview

LLM Benchmark Aggregator solves a fundamental problem in AI model evaluation: different benchmarks use wildly inconsistent naming for the same model. LiveBench calls it "GPT-4o", LMArena uses "gpt-4o-2024-11-20", EQBench lists "OpenAI GPT-4o", and Epoch AI reports "GPT-4o (high)". This makes cross-benchmark comparison nearly impossible without manual reconciliation.

This service aggregates benchmark data from 50+ sources into a unified view with a canonical model identity layer. It normalizes naming conventions, tracks historical performance snapshots, and uses an LLM-assisted pipeline for automated classification of providers, model families, release dates, and modalities.

## Screenshots

<!-- SCREENSHOT: Dashboard overview showing aggregate statistics - total models tracked, active benchmarks, sources by health status, and recent refresh activity -->
![Dashboard Overview](/images/projects/llm-bench-aggregator/screenshot-1.png)

<!-- SCREENSHOT: Hierarchy view displaying the provider > family > model tree structure with expandable nodes showing Claude, GPT, and Gemini families -->
![Model Hierarchy](/images/projects/llm-bench-aggregator/screenshot-2.png)

<!-- SCREENSHOT: Individual benchmark leaderboard (e.g., LiveBench) with scores, model linking status, and variant qualifiers visible -->
![Benchmark Leaderboard](/images/projects/llm-bench-aggregator/screenshot-3.png)

<!-- SCREENSHOT: Admin panel showing the LLM pipeline controls with step-by-step canonicalization options and orphaned entity counts -->
![Admin Pipeline](/images/projects/llm-bench-aggregator/screenshot-4.png)

## Problem

AI benchmark leaderboards proliferate across dozens of independent sources—arena-style human preference rankings, automated evaluation suites, specialized domain tests. Each maintains its own naming conventions, update cadences, and data formats. Researchers and developers face several pain points:

- **Identity fragmentation**: The same model appears under different names across sources
- **No historical tracking**: Most leaderboards show only current standings
- **Format chaos**: Data comes as markdown tables, CSVs, APIs, HuggingFace datasets, and scraped HTML
- **Manual reconciliation**: Comparing a model across benchmarks requires tedious lookup work

## Approach

The system employs a three-layer architecture: adapters for heterogeneous data ingestion, a canonical identity layer for model resolution, and an LLM-assisted pipeline for automated enrichment.

### Stack

- **Backend** - Python 3.12+ with FastAPI for async REST API, SQLAlchemy 2.0 for ORM, and httpx for concurrent data fetching
- **Frontend** - React 19 with TypeScript and Vite for a responsive dashboard with tree/list views
- **Database** - SQLite with aiosqlite for async operations (Postgres-ready schema)
- **Identity Resolution** - rapidfuzz for fuzzy string matching plus custom normalization rules
- **LLM Pipeline** - External LLM via Generative Gateway for automated classification when heuristics fail
- **Data Ingestion** - Search Gateway abstraction for web scraping, API calls, and content extraction

### Challenges

- **Heterogeneous data formats** - Built 18 adapters handling markdown tables, tab-separated values, transposed tables (models as columns), CSV files, JSON APIs, and HuggingFace datasets. Each adapter implements a common interface while handling source-specific parsing quirks.

- **Fuzzy identity matching** - Developed a multi-stage normalization pipeline: separator standardization (`._` → `-`), case folding, version extraction, and rapidfuzz matching with configurable thresholds. This catches variants like `claude-3.5-sonnet` and `claude-3-5-sonnet` as duplicates.

- **LLM token limits** - The canonicalization pipeline processes hundreds of unlinked models. Solved by batching requests (max 10 items per call) with structured prompts that include anti-duplication rules and existing canonical context.

- **Historical snapshot integrity** - Before each refresh, the system archives current results to a history table with today's snapshot date. Unique constraints on `(source_id, model_name_raw, snapshot_date)` prevent duplicate entries while enabling trend analysis.

## Outcomes

The aggregator now tracks 50+ benchmark sources with automated weekly refreshes. The canonical identity layer successfully maps thousands of raw model names to a clean hierarchy of ~200 canonical models organized by provider and family.

Key technical wins:

- **Zero-config source addition**: New benchmarks require only an adapter class implementing `parse()` and source metadata—no schema changes
- **Sub-second lookups**: Unified benchmark queries across all sources return in <100ms thanks to SQLite with proper indexing
- **Audit trail**: Every refresh logs source, duration, result count, and any errors for operational visibility
- **Dry-run safety**: All destructive operations support `--dry-run` for preview before committing changes

The LLM pipeline handles edge cases that defeat heuristics—disambiguating whether "Gemini 2.0" is a new release or a typo, detecting providers for obscure open-source models, and extracting release dates from search results with confidence scoring.

## Implementation Notes

The adapter pattern provides clean separation between generic refresh logic and source-specific parsing:

```python
class BaseAdapter:
    @property
    def source_id(self) -> str:
        """Unique identifier matching benchmark_sources table."""
        ...
    
    def parse(self, raw_content: str) -> list[dict]:
        """Transform raw content into normalized result dicts."""
        return [{"model_name": ..., "scores": {...}}]
```

The refresh queue handles archival before upsert:

```python
async def _process_source(source_id: str):
    # Archive current state for historical tracking
    archived = await _archive_current_results(source_id)
    
    # Fetch and parse fresh data
    content = await gateway.fetch(source)
    results = adapter.parse(content)
    
    # Upsert replaces current snapshot
    for result in results:
        await upsert_benchmark_result(result)
```

All timestamps use US Central timezone via a helper that ensures consistency across scheduled tasks:

```python
def now_central() -> datetime:
    return datetime.now(ZoneInfo("America/Chicago"))
```

The model identity layer uses a three-tier hierarchy: **Providers** (OpenAI, Anthropic, Google) → **Families** (GPT-4o, Claude 3.5, Gemini Pro) → **Canonical Models** (specific versions). Model variants from each benchmark source link to canonicals, enabling queries like "show me all GPT-4o scores across every benchmark."
