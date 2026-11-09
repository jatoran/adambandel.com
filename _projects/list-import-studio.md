---
title: List Import Studio
summary: A desktop app for cleaning contact and company lists and matching them against existing records before an import
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

List Import Studio is a desktop app for importing, cleaning and enriching tabular data through a visual pipeline.
It loads CSV and XLSX files, maps their columns to a reference schema, and runs them through a graph of nodes that filter, branch and derive new fields.
Running the pipeline handles deduplication and fuzzy record matching, and it stops at review gates where a person checks the edge cases.

The frontend is React and TypeScript running in Tauri, and the heavy data processing happens in a Python sidecar using Polars.
The two talk JSON-RPC over stdio, which avoids the overhead of HTTP.

## Screenshots

<!-- SCREENSHOT: Main plan canvas with connected nodes showing a dataset flowing through transform, filter, and export nodes -->
![Plan Canvas](/images/projects/list-import-studio/screenshot-1.png)

<!-- SCREENSHOT: Dataset mapping editor showing source columns mapped to reference schema fields with type indicators -->
![Dataset Mapping](/images/projects/list-import-studio/screenshot-2.png)

<!-- SCREENSHOT: Transform node editor with phone normalization suite selected and preview table showing before/after values -->
![Transform Editor](/images/projects/list-import-studio/screenshot-3.png)

## Problem

For my work, I do a lot of list cleaning and importing of contacts and companies into our database.
That takes a lot of matching and normalization, to make sure an import isn't overwriting or duplicating something.
Phone numbers come in inconsistent formats, emails need validating, company names need standardizing, and duplicates need finding.
There are lots of tools for this, and probably some better ones, but I wanted a node-based flow.

I also wanted to be able to save a workflow that comes up often and run it again.
Trade show leads are an example.
If a company does trade shows several times a month, that import comes up constantly, and each one is different: the lead scanner formats differ, the sales reps' formats and notes differ, and so does how much data each event hands over.
The goal was to have a lot of the boilerplate taken care of.

The pipeline is built visually, without writing code.
It applies fuzzy matching with configurable blocking rules and scoring ensembles, pauses at review gates so a person can verify the edge cases, and tracks lineage so it can explain how any output row was derived.

## Approach

### Stack

- Tauri 2: the desktop shell, for native file dialogs, process spawning, and cross-platform builds without Electron's overhead.
- React 19 and TypeScript: the frontend, organized by feature. Hooks hold the workflow state, and Zod validates the RPC contracts.
- Python sidecar: the data engine, built on Polars and spawned as a subprocess. All the heavy computation happens here.
- JSON-RPC over stdio: no HTTP. The app writes JSON requests to the sidecar's stdin, and the sidecar answers on stdout.
- SQLite and Parquet: workspace metadata goes in SQLite, and each pipeline stage is cached as columnar Parquet so a run can resume without starting over.

### Challenges

- Row identity across transforms: after filtering, standardizing and deduplicating, there has to be a way to tell which input row each output row came from. Each row gets a `row_ref` string that travels through the pipeline, and the explain and review features use it to fetch the original values.

- Multi-dataset lineage: Match and Relate nodes combine two datasets, which makes it harder to carry the schema forward. Routes track `source_dataset_ids`, and the field selectors in the frontend label where each field came from, "From Dataset: X" or "From Node: Transform".

- Pause and resume: a full run on a large dataset can take a long time, and it has to be able to stop at a review node and pick up later. Each node's output is cached as a checkpoint under a stable key built from hashes of its input data and config, and resuming loads the last checkpoint instead of re-running the earlier stages.

- Quick-fix suggestions: when validation finds a problem, like invalid phone formats, the UI suggests a fix. A validator registry maps each issue code to a transform, and clicking "Apply fix" inserts a Transform node with the normalization already configured.

## Outcomes

I use it consistently, and it saves me hours on each list I have to upload.

- Every node has a preview of the data at that point in the pipeline, so a transform's config can be changed and the result checked straight away.
- After a config change, a re-run only recomputes the affected nodes; unchanged upstream stages load from the Parquet cache.
- Match scoring produces a histogram. Thresholds are set from it, and borderline cases are reviewed by hand before export.
- Clicking any output row shows the path it took through the pipeline, with the intermediate values.

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

Workspace state saves to SQLite automatically on navigation, so work picks up where it left off:

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
