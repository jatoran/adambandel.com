---
title: List Import Studio
summary: Desktop ETL tool for reconciling contact lists—visual data pipelines with fuzzy matching and human-in-the-loop review
date: 2025-10-03
---

## Overview

List Import Studio is a native Windows desktop application that transforms messy spreadsheet data into clean, deduplicated, and enriched datasets. It provides a visual pipeline builder where users construct directed acyclic graphs (DAGs) of data operations—transformations, filtering, fuzzy matching, deduplication, and relationship modeling—without writing code.

The tool bridges the gap between enterprise ETL platforms (Talend, Informatica) and manual Excel workflows, targeting power users who need sophisticated data reconciliation but lack IT department resources. A core differentiator is the human-in-the-loop review system that pauses execution for ambiguous matches, ensuring data quality on high-stakes integrations.

## Screenshots

<!-- SCREENSHOT: Plan canvas showing a multi-node DAG with dataset ingestion, transform, deduplicate, and match nodes connected by routes -->
![Plan Canvas](/images/projects/list-import-studio/screenshot-1.png)

<!-- SCREENSHOT: Match node editor displaying weighted ensemble configuration, blocking rules, and score histogram telemetry -->
![Match Configuration](/images/projects/list-import-studio/screenshot-2.png)

<!-- SCREENSHOT: Review queue interface with candidate pair comparison, explain snippets showing token alignment, and bulk action buttons -->
![Review Queue](/images/projects/list-import-studio/screenshot-3.png)

<!-- SCREENSHOT: Dataset mapping editor with field type inference, validation warnings, and sample data preview -->
![Dataset Mapping](/images/projects/list-import-studio/screenshot-4.png)

## Problem

Organizations frequently need to merge contact lists from multiple sources—CRM exports, event registrations, partner data feeds—but face common obstacles:

- **Schema inconsistency**: Different column names, date formats, phone number styles across sources
- **Duplicate records**: Same person appearing multiple times with slight variations
- **Matching ambiguity**: Fuzzy matching algorithms produce false positives that require human judgment
- **Audit requirements**: Stakeholders need to understand why records were matched or rejected
- **Technical barriers**: Existing ETL tools require SQL knowledge or programming skills

The project was built to provide a self-contained solution that non-technical users can operate while maintaining the sophistication needed for enterprise-grade data quality.

## Approach

The architecture prioritizes separation of concerns across three distinct runtime layers, each optimized for its role.

### Stack

- **Frontend (React 19 + TypeScript)** - Renders the visual plan builder, dataset previews, and review interfaces; Zod validates every RPC payload at runtime
- **Shell (Tauri v2 + Rust)** - Provides the native window, file dialogs, and process management with minimal overhead (no Chromium bundle)
- **Data Engine (Python Sidecar)** - Handles all data processing via Pandas/Polars, persists to Parquet columnar format, manages SQLite workspace state
- **IPC Protocol (JSON-RPC over stdio)** - Enables clean request/response semantics with timeout handling and schema validation on both ends

### Challenges

- **Multi-process reliability** - Coordinating React → Rust → Python required careful IPC design; solved with line-delimited JSON-RPC, unique request IDs, and matched Pydantic/Zod schemas ensuring type safety across language boundaries

- **Deterministic cache invalidation** - DAG nodes needed consistent cache hits across restarts; implemented stable hashing of node configs, input data, and upstream cache keys with version pinning to automatically invalidate when algorithms change

- **Human-in-the-loop at scale** - 100k-row datasets might produce thousands of ambiguous matches; built a queue persistence system that halts execution at configurable thresholds, surfaces score histograms for threshold tuning, and supports bulk accept/reject operations

- **Schema lineage tracking** - After matching records from multiple datasets, downstream nodes must know field provenance; every field carries `datasetId` and `sourceNodeId` metadata, with UI grouping showing origins clearly

## Outcomes

The application successfully processes datasets of 100k+ rows with sub-second preview feedback via sampling and intelligent caching. The modular architecture enabled aggressive refactoring (1,200-line components reduced to ~300 LOC) while maintaining 80%+ Python test coverage.

Key learnings:
- Sidecar patterns excel when desktop apps need heavy computation—keeps the UI responsive while Python handles data
- Parquet's columnar format dramatically accelerates column-wise operations compared to row-based CSV processing
- Visual DAG builders require careful state management—every node change must propagate cache invalidation upstream and downstream
- Review queue UX makes or breaks adoption—score histograms and explain snippets reduced review time significantly in testing

## Implementation Notes

The plan engine uses stable hashing for reproducible cache keys:

```python
cache_key = make_cache_key(
    node_id=node.id,
    config=stable_hash_config(node.config),
    data=stable_hash_rows(input_data),
    upstream_keys=[parent_cache_key],
    version=PLAN_ENGINE_VERSION
)
```

Match scoring supports weighted ensembles with configurable tie-breaking:

```python
ensemble_config = EnsembleConfig(
    comparisons=[
        Comparison(field="email", algorithm="exact", weight=1.0),
        Comparison(field="name", algorithm="jaro_winkler", weight=0.6),
        Comparison(field="company", algorithm="levenshtein", weight=0.4),
    ],
    margin=0.15,  # Minimum score gap to declare winner
    tie_policy="potential",  # Route ties to review queue
    fallback_outcome="no_match"
)
```

The review queue persists pending items to SQLite, enabling pause/resume across application restarts:

```typescript
// Frontend hook monitors queue state
const { queueItems, pending, handleBulkAction } = useReviewQueue(nodeId);

// Bulk operations update queue and trigger re-execution
await handleBulkAction("accept", selectedIds);
```
