---
title: Prompt Development Kit (PDK)
summary: Desktop app for building, organizing, and managing AI prompt workflows with visual node editor and code context integration
date: 2025-01-01
---

## Overview

Prompt Development Kit (PDK) is a cross-platform desktop application for managing AI prompt workflows through a visual node-based editor. Built with Tauri (Rust backend) and React, it enables power users to compose complex prompt sequences, manage reusable variables, and aggregate codebase context for LLM interactions.

The application addresses a gap in prompt engineering tooling: most users interact with LLMs through simple chat interfaces, but complex tasks require structured prompts with dynamic content, version history, and organized context. PDK provides this infrastructure while keeping prompts portable for use with any LLM chat interface.

## Screenshots

<!-- SCREENSHOT: Main flow canvas showing interconnected prompt nodes with edges, demonstrating the visual workflow builder -->
![Flow Canvas Editor](/images/projects/prompt-development-kit/screenshot-1.png)

<!-- SCREENSHOT: Node editor modal open with content field, system prompt section, and variable references visible -->
![Node Editor with Variables](/images/projects/prompt-development-kit/screenshot-2.png)

<!-- SCREENSHOT: Code Context Builder showing file tree with checkboxes, aggregated output preview, and format options -->
![Code Context Builder](/images/projects/prompt-development-kit/screenshot-3.png)

<!-- SCREENSHOT: Multi-pane layout with sidebar folder tree, flow canvas, and variables panel visible -->
![Multi-Pane Interface](/images/projects/prompt-development-kit/screenshot-4.png)

## Problem

Working with LLMs on complex coding tasks requires assembling context from multiple sources: system prompts, specific instructions, code snippets, previous responses, and project documentation. Managing this manually becomes unwieldy as prompts grow in complexity. Existing tools either lock you into specific APIs or lack the organizational features needed for serious prompt engineering.

Key pain points PDK addresses:
- No visual way to compose and sequence related prompts
- Manual copy-pasting of code context is error-prone and tedious
- No version history for prompt iterations
- Variables and templates scattered across files
- Context switching between different LLM interfaces loses prompt state

## Approach

PDK treats prompts as composable units in a visual workflow. Each node contains content that can reference variables, link to other nodes, and maintain version history. The application stays interface-agnostic by focusing on prompt preparation rather than LLM execution.

### Stack

- **Desktop Runtime** - Tauri v2 enables native performance with a ~10MB binary, SQLite persistence, and filesystem access for code scanning
- **Frontend** - React 18 with React Flow for the interactive canvas, Zustand for state management, and TypeScript throughout
- **Backend** - Rust handles database operations, parallel file scanning with Rayon, and GPT-BPE token counting
- **Data Layer** - SQLite stores flows, nodes, variables, versions, and code context profiles with automatic schema migrations

### Challenges

- **Recursive variable expansion** - Variables can reference node content that contains other variables. Solved with cycle detection and field-aware recursion (content/system fields recurse, response fields don't)
- **Multi-pane state management** - Supporting arbitrary pane splits with drag-and-drop tabs required a recursive tree structure in Zustand with persistent localStorage sync
- **Code context scalability** - Large codebases need parallel scanning with cancellation support. Implemented async Rust scanning with file caching and incremental updates
- **Node version history** - Tracking changes without bloating the database led to a dual versioning scheme: major numeric versions for significant changes, minor alphabetic revisions for incremental edits

## Outcomes

PDK successfully consolidates prompt engineering into a single organized workspace. The visual node editor makes complex prompt relationships explicit, while the variable system eliminates repetitive copy-pasting. Code context aggregation with auto-update dramatically speeds up the workflow of providing LLMs with relevant project context.

Key learnings:
- Tauri's Rust/React bridge performs well for frequent operations (node updates trigger ~20ms round-trips)
- React Flow handles 100+ nodes smoothly with virtualized rendering
- SQLite's single-file database simplifies portability while transactions ensure data integrity
- Event-driven architecture (custom DOM events for cross-component communication) keeps components decoupled

## Implementation Notes

The variable insertion engine handles three variable types with priority ordering:

```typescript
// Priority: Code Context -> Flow Variables -> Global Variables
function findVarValue(varName: string): string | null {
  if (codeMap.has(varName)) return codeMap.get(varName);
  if (flowMap.has(varName)) return flowMap.get(varName);
  if (globalMap.has(varName)) return globalMap.get(varName);
  return null;
}

// Regex replacement with cycle detection for recursive expansion
const regex = /\{\{([^}]+)\}\}/g;
return text.replace(regex, (_match, raw) => {
  const val = findVarValue(raw.trim());
  return val !== null ? val : `{{${raw.trim()}}}`;
});
```

The pane layout uses a recursive tree structure supporting arbitrary splits:

```typescript
interface PaneLayoutNode {
  pane?: { id: string; tabs: Tab[]; activeTabIndex: number };
  child1?: PaneLayoutNode;
  child2?: PaneLayoutNode;
  direction?: 'horizontal' | 'vertical';
  splitRatio?: number;
}
```

Backend commands expose 50+ operations through Tauri's IPC:

```rust
#[tauri::command]
fn copy_node_merged_content(
    state: State<AppState>,
    node_id: i64,
    flow_id: i64
) -> Result<String, String> {
    // Fetches node content, resolves all variable references,
    // and returns fully expanded text
}
```
