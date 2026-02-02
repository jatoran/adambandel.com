---
title: Code Context Builder
summary: Desktop app for creating LLM-optimized prompts from codebases with smart compression
started: 2025-05-06
updated: 2025-08-15
type: desktop
github: https://github.com/jatoran/code_context_builder
stack:
  - TypeScript
  - React
  - Rust
  - Tauri
  - SQLite
  - tree-sitter
tags:
  - ai
  - developer-tools
  - prompt-engineering
loc: 5655
files: 35
architecture:
  auth: none
  database: SQLite
  api: none
  realtime: none
  background: custom Rust threads
  cache: SQLite
  search: none
---

## Overview

Code Context Builder is a keyboard-driven desktop application that streamlines the creation of high-quality, token-efficient prompts from source code for LLMs like GPT-4 and Claude. When working with expensive API calls, every token counts.

The app allows developers to scan and index project folders, interactively select files, and generate well-formatted prompts in multiple output formats. A standout feature is AST-based smart compression using tree-sitter, which can significantly reduce token counts while preserving code structure and semantics.

## Screenshots

<!-- SCREENSHOT: Main interface with a project loaded showing the file tree on the left with checkboxes, token counts per file, and the aggregator panel on the right with pre/post prompt fields -->
![Main Interface](/images/projects/code_context_builder/screenshot-1.png)

<!-- SCREENSHOT: Settings modal showing theme options, global ignore patterns configuration, and format instruction settings -->
![Settings Modal](/images/projects/code_context_builder/screenshot-2.png)

<!-- SCREENSHOT: File viewer modal displaying syntax-highlighted code preview of a selected source file -->
![File Viewer](/images/projects/code_context_builder/screenshot-3.png)

## Problem

Preparing code context for LLMs is tedious and error-prone. Developers often resort to manually copying files, losing track of what's included, and exceeding token limits unexpectedly. Existing tools either lack precision in file selection or don't optimize for token efficiency. There was no keyboard-driven workflow for power users who iterate quickly with LLMs.

## Approach

Built a native desktop app using Tauri to combine a responsive React UI with high-performance Rust backend processing. The architecture separates concerns cleanly: React handles interactivity while Rust does the heavy lifting of file I/O, parsing, and tokenization.

### Stack

- **Tauri** - Lightweight alternative to Electron with native Rust backend for performance
- **React + TypeScript** - Type-safe frontend with hooks-based state management
- **tree-sitter** - AST parsing for semantically-aware code compression
- **tiktoken-rs** - Accurate OpenAI token counting matching the actual cl100k_base tokenizer
- **SQLite** - Portable database stored alongside executable for project persistence
- **Rayon** - Parallel file processing for fast scanning of large codebases

### Challenges

- **Cross-platform file watching** - Implemented a 30-second polling system stored in SQLite rather than relying on OS-specific file watchers, ensuring consistent behavior across Windows, macOS, and Linux

- **AST-based compression** - Built a `Compressor` trait in Rust that uses tree-sitter grammars to intelligently collapse function bodies and remove comments while preserving signatures. Supports Python and TypeScript/TSX with an extensible architecture for additional languages

- **Token accuracy** - Integrated tiktoken-rs to provide real-time token estimates that match OpenAI's actual tokenization, preventing unexpected truncation during API calls

- **Keyboard-first UX** - Designed the entire workflow around keyboard shortcuts (Ctrl+Shift+C to copy, Ctrl+F to search, arrow keys for navigation) with a hotkeys modal for discoverability

## Outcomes

The app successfully reduces the friction of LLM-assisted development. Key achievements:

- Multiple output formats (Sentinel, Markdown, XML, Raw) accommodate different LLM preferences
- Prompt presets save and restore custom templates for repeated workflows
- File freshness indicators alert when source files change after scanning
- Smart compression can reduce token counts by 30-50% on typical codebases
- Cross-platform releases via GitHub Actions produce Windows .exe, Linux .deb/.AppImage, and macOS .dmg

## Implementation Notes

The compression system uses tree-sitter to parse source files into ASTs, then walks the tree to identify collapsible regions:

```rust
// Compressor trait allows extensible language support
pub trait Compressor: Send + Sync {
    fn compress(&self, content: &str, options: &CompressionOptions) -> String;
}

// Python implementation collapses function bodies while preserving signatures
fn collapse_body(source: &str, node: Node, options: &CompressionOptions) -> String {
    // Preserve docstrings, collapse implementation
    // Result: def process(data: List[str]) -> Dict: ...
}
```

The frontend uses `useImperativeHandle` to expose tree control methods, enabling parent components to programmatically expand, collapse, and search the file tree without prop drilling:

```typescript
export interface FileTreeRef {
  expandAll: () => void;
  collapseAll: () => void;
  expandToLevel: (level: number) => void;
  focusSearch: () => void;
}
```

State persistence splits between SQLite (projects, file cache, settings) and localStorage (UI preferences, selected files, expanded paths), ensuring the database remains portable while user preferences roam with the browser profile.
