---
title: Prompt Development Kit
summary: A desktop app for building chains of AI prompts as connected nodes, with reusable variables and project code pulled into the prompts
started: 2025-05-04
updated: 2025-05-04
type: desktop
stack:
  - TypeScript
  - React
  - Tauri
  - Rust
  - SQLite
  - ReactFlow
tags:
  - ai
  - developer-tools
  - automation
loc: 33493
files: 241
architecture:
  auth: none
  database: SQLite
  api: none
  realtime: none
  background: none
  cache: in-memory
  search: none
---

## Overview

Prompt Development Kit (PDK) is a cross-platform desktop app for building and organizing chains of AI prompts.
Each prompt is a node on a canvas, and you connect nodes into sequences, use variables at several scopes, and pull code from your own projects straight into the prompts.

I never released it, and I stopped using it.
The code context part outlived it as its own app, [Code Context Builder](/projects/code-context-builder/).

## Screenshots

<!-- SCREENSHOT: Main flow canvas showing connected nodes with prompt content, the sidebar folder tree visible on the left, and the variables panel on the right -->
![Flow Canvas](/images/projects/prompt-development-kit/screenshot-1.png)

<!-- SCREENSHOT: Node editor modal open with content area, system message field, and variable insertion dropdown visible -->
![Node Editor](/images/projects/prompt-development-kit/screenshot-2.png)

<!-- SCREENSHOT: Code Context Builder panel showing file tree with checkboxes, pattern filters, and aggregated output preview -->
![Code Context Builder](/images/projects/prompt-development-kit/screenshot-3.png)

## Problem

Working with LLM prompts means keeping several variations and versions of a prompt, reusing the same patterns across prompts, and pasting code and documentation into them.
I built PDK so I could string predefined prompts together as nodes and reuse them by changing only the variables, with global or locally scoped variables holding the context.

## Approach

### Stack

- React and TypeScript for the interface
- ReactFlow for the node canvas
- Tauri and Rust for the desktop app. PDK was the first thing I built with Tauri, because I wanted something cross-platform that I could share easily.
- SQLite as an embedded database, so there is nothing external to install
- Zustand for state such as the multi-pane layout

### Challenges

- Variable resolution order. Variables expand recursively with cycle detection. Content variables expand recursively, and response variables are substituted literally.
- Multi-pane layout. Pane splits are stored as a recursive tree and persisted in localStorage, so several flows can be open side by side.
- Keeping code context current. The `notify` crate watches the source files, and code context variables update when those files change.

## Outcomes

Connecting nodes on the canvas defines a prompt sequence.
Variables come in three scopes (global, flow and code context), which covers the common kinds of reuse.
Version history keeps earlier versions of flows and nodes, so you can experiment without losing previous work.
Token counting is built in, though it ended up switched off in the flow and node views for performance and stays on in the code context builder.
File scanning runs in parallel with Rayon.

It was good for managing a collection of prompts I wanted to remember, and for building hierarchical prompt chains, some of them quite complex, mostly for coding and for generating documentation.
Overall, though, defining prompt workflows in it was too cumbersome, and I stopped using it.
Once you code a lot, you find you don't use the same prompts over and over: every project is different, every day is different, and different models need different prompting.
What I kept using was the code context builder inside it, so I took that out and made it a standalone app.

## Implementation Notes

The variable system uses a `{% raw %}{{variable_name}}{% endraw %}` syntax with three scopes:

```typescript
// Variable resolution priority
1. Code context variables (auto-generated from file scans)
2. Flow-specific variables (scoped to current flow)
3. Global variables (available everywhere)
```

The database schema has 19 tables, covering flows, nodes, variables, versions and soft-deleted items:

```sql
-- Core tables for flow/node versioning
CREATE TABLE flow_versions (
  id INTEGER PRIMARY KEY,
  flow_id INTEGER,
  version TEXT,
  snapshot TEXT,  -- JSON snapshot of flow state
  created_at TEXT
);

CREATE TABLE node_versions (
  id INTEGER PRIMARY KEY,
  node_id INTEGER,
  version TEXT,
  snapshot TEXT,
  created_at TEXT
);
```

The code context builder scans project directories and generates variables:

```rust
// Parallel file scanning with Rayon
files.par_iter()
    .filter(|f| matches_patterns(f, &include_patterns, &exclude_patterns))
    .map(|f| read_and_tokenize(f))
    .collect()
```
