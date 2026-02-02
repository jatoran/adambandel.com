---
title: LLM Benchmark Aggregator
summary: Unified dashboard aggregating 50+ AI model benchmarks with canonical identity resolution
started: 2025-12-14
updated: 2025-12-20
type: data-pipeline
stack:
  - Python
  - FastAPI
  - SQLAlchemy
  - React
  - TypeScript
  - SQLite
tags:
  - ai
  - data
  - developer-tools
loc: 23398
files: 128
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: none
  background: custom async queue
  cache: none
  search: none
---

## Overview

LLM Benchmark Aggregator is a full-stack service that collects, normalizes, and visualizes AI model performance data from over 50 disparate benchmark sources. It solves the fragmentation problem in the AI evaluation space—where each leaderboard uses different model naming conventions, scoring formats, and update frequencies—by creating a unified view with canonical model identities.

The system combines web scraping, API integrations, HuggingFace datasets, and CSV imports through 18 specialized adapters, all feeding into a normalized SQLite database with historical tracking capabilities.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing benchmark overview with multiple sources listed in sidebar and aggregate statistics displayed -->
![Dashboard Overview](/images/projects/llm-bench-aggregator/screenshot-1.png)

<!-- SCREENSHOT: Single benchmark leaderboard table showing model rankings with scores, highlighting the canonical model name mapping -->
![Benchmark Leaderboard](/images/projects/llm-bench-aggregator/screenshot-2.png)

<!-- SCREENSHOT: Model hierarchy tree view displaying the Era > Provider > Family > Canonical > Variants structure -->
![Model Hierarchy](/images/projects/llm-bench-aggregator/screenshot-3.png)

## Problem

AI benchmark results are scattered across dozens of platforms—LiveBench, LMArena, HuggingFace Open LLM Leaderboard, Chatbot Arena, ARC-AGI, and many more. Each source:

- Uses inconsistent model naming (`gpt-4-turbo` vs `GPT-4 Turbo` vs `openai/gpt-4-turbo-2024-04-09`)
- Presents data in different formats (HTML tables, JSON APIs, markdown, CSV)
- Updates on unpredictable schedules
- Lacks cross-benchmark comparison capabilities

Researchers and developers wanting a holistic view of model performance must manually visit multiple sites and mentally reconcile different naming schemes.

## Approach

The aggregator treats benchmark collection as an ETL pipeline with an intelligent identity layer.

### Stack

- **FastAPI** - Async Python backend with automatic OpenAPI documentation
- **SQLAlchemy 2.0** - Async ORM with SQLite (Postgres-ready schema design)
- **React 19 + TypeScript** - Modern frontend with Vite for fast development
- **18 Adapters** - Specialized parsers for each benchmark source format
- **Search Gateway** - External service (port 7083) for unified web content extraction
- **LLM Pipeline** - 7-step canonicalization using external LLMs for model identity resolution

### Challenges

- **Model Name Canonicalization** - Built a hierarchical identity system (Era → Provider → Family → Canonical → Variants) with LLM-assisted matching. The pipeline processes model names in batches, detecting providers, grouping families, assigning eras, and resolving duplicates using fuzzy matching with 80%+ token overlap detection.

- **Diverse Source Formats** - Created an adapter pattern where each source implements a `parse()` method. The base adapter handles common operations (gateway requests, error handling, retry logic) while concrete adapters focus on format-specific extraction. HTML tables, JSON APIs, markdown, and CSV files all normalize to the same schema.

- **Rate Limiting and Reliability** - Implemented a staggered refresh queue with 20-300 second delays between sources, exponential backoff on failures, and historical snapshot archival. Each refresh is logged with status and error details for debugging.

## Outcomes

The system successfully aggregates benchmarks from 50+ sources into a queryable, comparable format. Key capabilities:

- **Unified Leaderboards** - View any benchmark's results with normalized model names
- **Cross-Benchmark Comparison** - Compare the same model across different evaluations
- **Historical Tracking** - Snapshots preserve benchmark evolution over time
- **Orphan Management** - Dashboard surfaces unlinked models for manual or LLM-assisted resolution
- **Admin Pipeline** - Web UI for triggering refreshes and running canonicalization steps

The adapter pattern proved highly extensible—adding a new benchmark source requires only implementing a single `parse()` method.

## Implementation Notes

The adapter registry enables dynamic source handling:

```python
ADAPTER_REGISTRY = {
    "livebench": LiveBenchAdapter,
    "lmarena": LMArenaAdapter,
    "artificial_analysis": ArtificialAnalysisAdapter,
    "epoch_csv": EpochCSVAdapter,
    # ... 14 more adapters
}
```

Each adapter inherits from `BaseAdapter` and implements source-specific parsing:

```python
class LiveBenchAdapter(BaseAdapter):
    async def parse(self, content: str) -> list[BenchmarkResult]:
        # Extract markdown tables, normalize scores, map model names
        ...
```

The canonical model hierarchy is stored across related tables:

```
eras (technological generations)
  └── model_families (grouped by provider + release)
        └── canonical_models (authoritative identities)
              └── model_variants (source-specific aliases)
```

The 7-step LLM pipeline handles:
1. Provider detection
2. Family grouping
3. Era assignment
4. Modality classification
5. Release date discovery
6. Duplicate detection
7. Confidence scoring
