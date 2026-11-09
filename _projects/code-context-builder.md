---
title: Code Context Builder
summary: A keyboard-driven desktop app for picking files from a codebase and copying them as one formatted prompt for a chat model, with token counts
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

Code Context Builder is a keyboard-driven desktop app for building prompts out of source code for LLMs such as GPT-4 and Claude.
You scan and index a project folder, pick files from the tree, and copy them out as one formatted prompt in one of several output formats, with a token count.
Optional compression uses tree-sitter to parse the code and cut the token count while keeping its structure: function bodies collapse, and signatures stay.

## Screenshots

<!-- SCREENSHOT: Main interface with a project loaded showing the file tree on the left with checkboxes, token counts per file, and the aggregator panel on the right with pre/post prompt fields -->
![Main Interface](/images/projects/code_context_builder/screenshot-1.png)

<!-- SCREENSHOT: Settings modal showing theme options, global ignore patterns configuration, and format instruction settings -->
![Settings Modal](/images/projects/code_context_builder/screenshot-2.png)

<!-- SCREENSHOT: File viewer modal displaying syntax-highlighted code preview of a selected source file -->
![File Viewer](/images/projects/code_context_builder/screenshot-3.png)

## Problem

Once models could write several hundred lines of code across multiple files, getting accurate output out of them meant feeding them a lot of your codebase.
This was before the CLI coding tools, so that meant going through the codebase, working out which files to include, and pasting them into a chat window one by one.
Copying files by hand, it is easy to lose track of what is included and to go over the token limit without noticing.

I started with basic scripts that concatenated the codebase, and they turned into a Python and Tkinter tool I called Code_Formatter, with ignore and allow patterns, a view of the file tree, and token counting.
I used that for about six months.
It then went into [PDK](/projects/prompt-development-kit/), and once I realized it was more useful on its own, I took it out again and made it this standalone Tauri app.

## Approach

React handles the interface, and Rust does the file reading, parsing and token counting.
The Tauri version is much faster than the Python one.

### Stack

- Tauri: a lighter alternative to Electron, with a Rust backend
- React and TypeScript: the frontend, with state kept in hooks
- tree-sitter: parses code for compression
- tiktoken-rs: counts tokens with OpenAI's cl100k_base tokenizer
- SQLite: projects and the file cache, in a database file kept next to the executable
- Rayon: scans large codebases in parallel

### Challenges

- File watching across platforms. Instead of the OS file watchers, which differ by platform, a thread polls every 30 seconds and compares each file's modified time and size with what the last scan recorded, so it behaves the same on Windows, macOS and Linux.
- Compression. A `Compressor` trait in Rust uses tree-sitter grammars to collapse function bodies and remove comments while keeping signatures. It supports Python and TypeScript/TSX, and adding a language means adding its grammar and a `Compressor` for it.
- Token counts. tiktoken-rs counts tokens live with the same tokenizer OpenAI uses, so you see the size of the context before you copy it.
- Keyboard first. The whole workflow runs on shortcuts (Ctrl+Shift+C copies the prompt, Ctrl+F searches, arrow keys move through the tree), and a hotkeys window lists them all.

## Outcomes

- Four output formats: Sentinel (loud BEGIN and END FILE markers), Markdown, XML and Raw.
- Prompt presets save and restore the instructions and tasks you wrap around the code.
- Files that changed after the last scan are flagged, so you rescan before copying something out of date.
- Scanning reuses a cache keyed on each file's modified time and size, so rescanning even a large codebase is cheap. The slow part is display: select a 300,000-token codebase and the preview takes a second to render.
- GitHub Actions builds releases for Windows (.exe), Linux (.deb and .AppImage) and macOS (.dmg).

It was the tool I used for about a year and a half to get code into models, using the top models through their chat interfaces instead of Cursor or the CLI tools of the time.
I still use it, though not for coding.
Now it is mostly for attaching the right personal and work notes to a prompt, and occasionally for getting code into high-end tools that have no CLI, such as GPT-5 Pro.
For coding, it has run its course.

## Implementation Notes

The compression system uses tree-sitter to parse source files into ASTs, then walks the tree to find the regions it can collapse:

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

The file tree exposes its controls through `useImperativeHandle`, so parent components can expand, collapse and search it without prop drilling:

```typescript
export interface FileTreeRef {
  expandAll: () => void;
  collapseAll: () => void;
  expandToLevel: (level: number) => void;
  focusSearch: () => void;
}
```

State is split between SQLite (projects, file cache, settings) and localStorage (UI preferences, selected files, expanded paths).
