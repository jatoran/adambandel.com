---
title: Code Context Builder
summary: Keyboard-driven desktop app for creating LLM-optimized prompts from your codebase with smart compression and token tracking.
date: 2025-01-31
github: https://github.com/jatoran/code_context_builder
---

## Overview

Code Context Builder is a desktop application that transforms the tedious process of feeding code to LLMs into a fast, keyboard-driven workflow. Built with Tauri, React, and Rust, it lets you scan projects, select files, and generate properly-formatted prompts with accurate token counts in seconds.

## Problem

Manually copying code snippets into ChatGPT or Claude is painful. You waste time:
- Navigating between files and your browser
- Losing track of which files you've already copied
- Going over token limits with expensive models
- Reformatting code blocks and adding context manually
- Missing important dependencies between files

With expensive pro models, **every token counts**, and ad-hoc copy-pasting wastes both time and money.

## Approach

I built a cross-platform desktop app that treats prompt engineering as a first-class workflow with keyboard shortcuts, real-time token counting, and multiple output formats optimized for different LLM interfaces.

### Architecture

- **Frontend (React + TypeScript)** - File tree UI, search, prompt editing, syntax highlighting
- **Backend (Rust + Tauri)** - Project scanning, file system watching, SQLite persistence
- **Tree-sitter integration** - Smart code compression (removes comments, collapses function bodies)
- **tiktoken-rs** - Accurate OpenAI-compatible token counting

### Stack

- **Tauri 2.x** - Cross-platform desktop framework (Rust + web frontend)
- **React 18 + TypeScript** - UI with file tree, search, and live preview
- **Vite** - Fast dev server and build tooling
- **SQLite** - Persistent storage for projects, presets, and settings
- **tree-sitter** - AST-based code parsing for Python and TypeScript/TSX
- **tiktoken-rs** - Token counting compatible with GPT models
- **GitHub Actions** - Automated multi-platform builds (Windows, macOS, Linux)

### Challenges

- **Smart compression without breaking context** - tree-sitter AST parsing preserves function signatures and structure while removing implementation details and comments
- **Cross-platform file watching** - Rust backend monitors file changes and signals the frontend when scans are stale
- **Keyboard-first UX** - Comprehensive hotkey system (`Ctrl+F` search, `Ctrl+Shift+C` copy, `Ctrl+A` select all) for mouse-free operation
- **Token accounting accuracy** - tiktoken-rs provides exact counts matching OpenAI's tokenizer
- **Ignore pattern handling** - `.gitignore` syntax support for filtering dependencies and build artifacts

## Outcomes

The result is a tool that reduces prompt creation from minutes to seconds:

1. `Ctrl+F` → type filename → `Enter` to select files
2. Edit pre-prompt and post-prompt in sidebar (or load a preset)
3. `Ctrl+Shift+C` to copy the complete formatted prompt

No mouse required. The entire workflow is keyboard-driven.

### Key Features

- **Multiple output formats**: Sentinel (loud markers), Markdown (YAML front matter), XML (well-formed), Raw (concatenation)
- **Smart code compression**: Optional tree-sitter parsing for Python/TS/TSX reduces token count
- **Prompt presets**: Save and reuse common instructions + tasks
- **Real-time file monitoring**: Visual indicators when scanned files have changed
- **Accurate token counting**: tiktoken-rs for precise GPT-compatible counts
- **Customizable ignore patterns**: `.gitignore` syntax for excluding files
- **Theme support**: System-aware dark/light mode
- **Cross-platform**: Windows, macOS, Linux via GitHub Actions

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` | Focus search |
| `Ctrl+A` | Select all files |
| `Ctrl+Shift+A` | Deselect all |
| `Ctrl+Shift+C` | Copy final prompt to clipboard |
| `Ctrl+Shift+R` | Re-scan project |
| `Ctrl+Shift+M` | Cycle output format |
| `Ctrl+Shift+T` | Toggle "Prepend Tree" |
| `Ctrl+↓/↑` | Expand/collapse tree levels |

## Implementation Notes

### Smart Compression

Tree-sitter parses Python and TypeScript/TSX files to produce a compressed version:

```python
# Before compression (45 tokens)
def authenticate_user(username: str, password: str) -> bool:
    """Validates user credentials against the database."""
    # Hash the password before comparison
    hashed_pw = hash_password(password)
    # Query the database
    user = db.query(username)
    return user and user.password == hashed_pw

# After compression (12 tokens)
def authenticate_user(username: str, password: str) -> bool: ...
```

Function signatures and class structures are preserved, but implementation details and comments are removed. This dramatically reduces token usage for large codebases while maintaining enough context for LLMs to understand structure.

### Output Formats

**Sentinel** - Loud, unambiguous markers for LLMs:
```
FILE: src/main.py
LINES: 1-45
[file contents]
FILE_END
```

**Markdown** - YAML front matter with fenced code blocks:
```markdown
---
file: src/main.py
lines: 1-45
---
```python
[file contents]
```
```

**XML** - Well-formed documents for tooling:
```xml
<file path="src/main.py" lines="1-45">
<![CDATA[[file contents]]]>
</file>
```

**Raw** - Unformatted concatenation for custom processing

### GitHub Actions Build Pipeline

Automated builds for all platforms using Tauri's official action:

```yaml
- name: Build Tauri App
  uses: tauri-apps/tauri-action@v0
  with:
    tagName: v__VERSION__
    releaseName: 'Code Context Builder v__VERSION__'
```

Produces `.exe` (Windows), `.dmg` (macOS), `.deb` and `.AppImage` (Linux) on every release.
