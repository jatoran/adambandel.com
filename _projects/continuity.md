---
title: Continuity
summary: A Markdown notes editor for Windows with no save button, plus the storage-neutral Rust engine extracted from it
status: Active
date: 2026-05-09
github: https://github.com/jatoran/continuity
type: desktop
stack:
  - Rust
  - Win32
  - DirectWrite / Direct2D
  - SQLite
  - tree-sitter
  - WASM
tags:
  - developer-tools
  - rust
  - desktop
loc: 217000
files: 26
architecture:
  auth: none
  database: SQLite
  api: none
  realtime: none
  background: threads
  cache: layout cache
  search: in-process
---

## Overview

Continuity is two things in one repository.

The first is a native Win32 Markdown notes editor. Every keystroke writes to a local SQLite database, so the database is the document and writing a `.md` file is an export rather than a commitment. There is no save button, no dirty indicator, and no prompt when you close a window, because there is never an unsaved state to lose.

The second is the editing engine underneath it, extracted into a storage-neutral Rust crate. The same engine runs in four places off one codebase: the native app, a browser Web Component compiled to WASM, a Python module, and a C ABI.

## Problem

Two problems, one per half.

The notes editor exists because Sublime Text has the speed, ephemerality, and crash-safety I want and doesn't do Markdown, while Obsidian does Markdown and also wants to be a knowledge graph with a plugin ecosystem and a startup time. Neither one is the thing.

The engine exists because the valuable part of the editor, the text handling and selections and undo and Markdown projection, was welded to an application that only runs on Windows. None of that logic is Windows-specific and all of it was trapped.

## Approach

### The storage decision came before the UI

The database is the document. Every edit becomes a row in `buffer_edits` carrying the op, the resulting checksum, and an undo group. The enforced budget is 400 ms from accepted edit to durable on disk at p99. Deciding this on day one meant the save-state machinery was never built, which meant it never had to be removed.

### The rope is canonical, the display map only projects

Markdown rendering goes through a display map that can hide, replace, or wrap source ranges. It cannot invent content. Every WYSIWYG feature has to survive the display map being ripped out, or it doesn't ship.

### The engine owns nothing but editing

Making the core embeddable meant making it storage-neutral first. It owns buffers, selections, edit planning, undo, and revisions, and it owns nothing else. No SQLite, no filesystem, no threads, no window. The desktop app didn't lose durability, it stopped being the thing that has durability and became the thing that projects engine output into SQLite.

### Stack

- **Rust** across 26 crates, with no `async fn` anywhere in the workspace
- **Win32, DirectWrite, Direct2D** for the native surface
- **ropey** for the buffer, **tree-sitter** for Markdown parsing
- **SQLite** in WAL mode for per-keystroke durability
- **WASM** for the browser Web Component, with a thin JavaScript adapter layer

## Outcomes

Enforced performance gates that fail the build rather than sitting on a dashboard: 8 ms keypress to pixel at p99, 400 ms edit to durable, 120 ms cold start, plus a dhat assertion of zero new heap allocations per keystroke in steady state. Measured keypress to pixel is 3.4 ms. The stripped binary is 8.55 MiB against a 9 MiB cap.

A shared behavior corpus runs against every binding: same inputs, same resulting text, same selections, same revisions, same deltas. When the Python binding and the browser disagree about a block toggle, that's a failing test rather than a support ticket eighteen months later.

## Installing it

```
winget install Continuity.Continuity     # Windows desktop, manifest PR in review
cargo add continuity-engine              # Rust, crates.io
npm i @continuity-editor/editor@next     # Browser and Electron, preview channel
```

MSI, portable zip, and standalone exe ship in each GitHub release, as do the Python wheel and the C DLL plus header. PyPI is deliberately empty until there are cross-platform wheels worth publishing.

## Honest constraints

The desktop app is Windows-only and will stay Windows-only. The engine is portable, the app is not. It's not a code editor: fenced blocks highlight and it's fine for code notes, but it isn't an IDE. It's early, currently 0.4.8, and things break. Builds are unsigned, so installs show a SmartScreen warning until code signing is in place. The `@next` on the npm install is load-bearing, because the SDK publishes to a preview dist-tag and a bare install won't resolve.

MIT licensed.
