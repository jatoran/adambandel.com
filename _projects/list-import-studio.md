---
title: List Import Studio
summary: Desktop app for visual data transformation pipelines with fuzzy matching, validation, and multi-dataset workflows
started: 2025-10-03
updated: 2025-10-15
type: desktop
stack:
  - TypeScript
  - React 19
  - Tauri 2
  - Python
  - Polars
  - SQLite
tags:
  - data
  - developer-tools
  - automation
loc: 48000
files: 269
architecture:
  auth: none
  database: SQLite
  api: JSON-RPC
  realtime: none
  background: Python sidecar
  cache: Parquet + in-memory
  search: none
---

## Overview

List Import Studio is a desktop application for importing, transforming, and enriching tabular data through visual pipelines. Users load CSV/XLSX files, map columns to reference schemas, build transformation graphs with filtering, branching, and derivation nodes, then execute workflows that handle deduplication, fuzzy record matching, and human-in-the-loop review gates.

The application combines a React/TypeScript frontend running in Tauri with a Python sidecar that handles heavy data processing via Polars. Communication happens through JSON-RPC over stdio, avoiding HTTP overhead while enabling rich bidirectional command dispatch.

## Screenshots

<!-- SCREENSHOT: Main plan canvas with connected nodes showing a dataset flowing through transform, filter, and export nodes -->
![Plan Canvas](/images/projects/list-import-studio/screenshot-1.png)

<!-- SCREENSHOT: Dataset mapping editor showing source columns mapped to reference schema fields with type indicators -->
![Dataset Mapping](/images/projects/list-import-studio/screenshot-2.png)

<!-- SCREENSHOT: Transform node editor with phone normalization suite selected and preview table showing before/after values -->
![Transform Editor](/images/projects/list-import-studio/screenshot-3.png)

## Problem

Data imports from external sources are messy. Phone numbers come in inconsistent formats, emails need validation, company names require standardization, and duplicate records need detection. Traditional ETL tools are either too complex for one-off imports or too limited for sophisticated matching logic.

The goal was to build a tool that makes it easy to:
- Visually design transformation pipelines without writing code
- Apply fuzzy matching with configurable blocking rules and scoring ensembles
- Pause execution at review gates for human verification of edge cases
- Track data lineage to explain how any output row was derived

## Approach

### Stack

- **Tauri 2** - Desktop shell providing native file dialogs, process spawning, and cross-platform distribution without Electron's overhead
- **React 19 + TypeScript** - Frontend with feature-based architecture; hooks manage workflow state while Zod validates RPC contracts
- **Python Sidecar** - Polars-based data engine spawned as a subprocess; handles all heavy computation
- **JSON-RPC over stdio** - Custom protocol avoiding HTTP; parent process writes JSON requests to stdin, child responds via stdout
- **SQLite + Parquet** - Workspace metadata in SQLite; cached pipeline stages in columnar Parquet for efficient resumption

### Challenges

- **Row identity across transforms** - After filtering, standardizing, and deduplicating, tracking which output rows correspond to which inputs requires persistent identifiers. Solution: each row gets a `row_ref` string that propagates through the pipeline, enabling the explain/review features to fetch original values.

- **Multi-dataset lineage** - Match and Relate nodes combine two datasets, complicating schema propagation. Solution: routes track `source_dataset_ids`, and the frontend builds field selectors that label origins as "From Dataset: X" or "From Node: Transform".

- **Pause/resume execution** - Full runs on large datasets can take significant time; users need to pause at review nodes and resume later. Solution: cache checkpoints after each node with stable keys derived from input data + config hashes. Resume rehydrates from the last checkpoint without re-running earlier stages.

- **Quick-fix suggestions** - When validation detects issues (e.g., invalid phone formats), the UI should suggest fixes. Solution: validator registry maps issue codes to transform suggestions; clicking "Apply fix" inserts the appropriate Transform node with pre-configured normalization.

## Outcomes

The visual pipeline approach proves effective for complex data workflows. Key wins:

- **Iterative refinement** - Preview at any node shows exactly what data looks like mid-pipeline; adjust transform config and immediately see results
- **Caching efficiency** - Re-running after config changes only recomputes affected nodes; unchanged upstream stages load from Parquet cache
- **Review workflow** - Match scoring produces histograms; users set thresholds and manually review borderline cases before export
- **Lineage transparency** - Clicking any output row shows its derivation path through the pipeline with intermediate values

## Implementation Notes

### JSON-RPC Protocol

Frontend and sidecar communicate via JSON-RPC 2.0 over stdio:

```typescript
// Frontend: src/services/sidecar/client.ts
export async function callRpc<T>(method: string, params: unknown): Promise<T> {
  const response = await Command.create('sidecar', ['--rpc'])
    .execute(JSON.stringify({ jsonrpc: '2.0', method, params, id: generateId() }));
  return JSON.parse(response.stdout).result;
}
```

```python
# Sidecar: sidecar/rpc/dispatcher.py
def dispatch(request: dict) -> dict:
    handler = REGISTRY.get(request['method'])
    result = handler(**request.get('params', {}))
    return {'jsonrpc': '2.0', 'result': result, 'id': request['id']}
```

### Plan Execution Engine

The plan engine traverses the node graph, caching results at each stage:

```python
# sidecar/plan_engine.py
def execute_node(node: PlanNode, context: PlanContext) -> DataFrame:
    cache_key = compute_stable_key(node, context.upstream_data)

    if cached := context.cache.get(cache_key):
        return cached

    match node.type:
        case 'transform':
            result = apply_standardizers(context.upstream_data, node.config.operations)
        case 'filter':
            result = apply_filter_conditions(context.upstream_data, node.config.conditions)
        case 'branch':
            # Returns dict of outcome -> DataFrame
            result = route_by_conditions(context.upstream_data, node.config.branches)
        case 'match':
            result = score_candidates(context.upstream_data, node.config.ensemble)

    context.cache.set(cache_key, result)
    return result
```

### Blocking Rules for Matching

Fuzzy matching at scale requires blocking to avoid O(n*m) comparisons:

```python
# sidecar/match/blocking.py
def build_blocking_index(records: DataFrame, rules: list[BlockingRule]) -> dict:
    """Group records by blocking keys for efficient candidate generation."""
    index = defaultdict(list)
    for row in records.iter_rows(named=True):
        for rule in rules:
            key = normalize_blocking_key(row, rule)
            index[key].append(row['_row_ref'])
    return index
```

### State Persistence

Workspace state auto-saves to SQLite on navigation, enabling seamless resume:

```typescript
// Frontend: src/features/workspace/hooks/useProjectPersistence.ts
const saveState = useCallback(async () => {
  const snapshot = {
    plan: planState,
    datasets: datasetState,
    mapping: mappingState,
    settings: settingsState,
  };
  await rpc.project.saveState(projectId, snapshot);
}, [projectId, planState, datasetState, mappingState, settingsState]);
```
