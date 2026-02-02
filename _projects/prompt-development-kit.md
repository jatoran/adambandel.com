---
title: Prompt Development Kit
summary: Desktop app for visual AI prompt engineering with node-based workflows and code context integration
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

Prompt Development Kit (PDK) is a cross-platform desktop application for building, organizing, and managing complex AI prompt workflows. It provides a visual node-based editor where users can create prompt sequences, manage variables across scopes, and integrate code context from their projects directly into prompts.

The application bridges the gap between simple prompt copy-paste workflows and programmatic prompt engineering, offering a visual interface for prompt development without requiring coding knowledge.

## Screenshots

<!-- SCREENSHOT: Main flow canvas showing connected nodes with prompt content, the sidebar folder tree visible on the left, and the variables panel on the right -->
![Flow Canvas](/images/projects/prompt-development-kit/screenshot-1.png)

<!-- SCREENSHOT: Node editor modal open with content area, system message field, and variable insertion dropdown visible -->
![Node Editor](/images/projects/prompt-development-kit/screenshot-2.png)

<!-- SCREENSHOT: Code Context Builder panel showing file tree with checkboxes, pattern filters, and aggregated output preview -->
![Code Context Builder](/images/projects/prompt-development-kit/screenshot-3.png)

## Problem

Prompt engineering for LLMs often involves:
- Managing multiple prompt variations and versions
- Reusing common patterns across different prompts
- Incorporating code snippets and documentation into prompts
- Tracking which combinations work best

Existing solutions force users into either plain text files (no structure) or full programming (high barrier). PDK provides a middle ground: visual prompt composition with variables, versioning, and code integration.

## Approach

### Stack

- **React + TypeScript** - Type-safe component architecture for the complex UI
- **ReactFlow** - Node-based visual canvas for connecting prompt sequences
- **Tauri + Rust** - Native performance and small binary size for desktop distribution
- **SQLite** - Embedded database for persistent storage without external dependencies
- **Zustand** - Lightweight state management for multi-pane layout persistence

### Challenges

- **Variable resolution order** - Implemented recursive variable expansion with cycle detection, distinguishing between content variables (expand recursively) and response variables (literal substitution)
- **Multi-pane state persistence** - Built a recursive tree structure for pane splits with localStorage persistence, allowing users to view multiple flows simultaneously
- **Code context synchronization** - Used the `notify` crate for file watching to auto-update code context variables when source files change

## Outcomes

The application successfully handles complex prompt workflows:
- Visual node connections map to prompt sequences
- Three-tier variable system (global, flow, code context) covers common reuse patterns
- Version history enables experimentation without losing previous work
- Token counting provides cost awareness before execution

Key technical wins:
- Cold start under 500ms due to Tauri's lightweight runtime
- SQLite handles thousands of nodes without performance degradation
- Parallel file scanning via Rayon processes large codebases efficiently

## Implementation Notes

The variable system uses a `{{variable_name}}` syntax with three scopes:

```typescript
// Variable resolution priority
1. Code context variables (auto-generated from file scans)
2. Flow-specific variables (scoped to current flow)
3. Global variables (available everywhere)
```

The database schema includes 16 tables tracking flows, nodes, variables, versions, and soft-deleted items:

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
