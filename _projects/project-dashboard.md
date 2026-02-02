---
title: Project Dashboard
summary: Windows desktop app for instantly launching dev projects via global hotkey command palette
started: 2025-11-29
updated: 2026-01-31
type: desktop
stack:
  - Python
  - FastAPI
  - Next.js 16
  - React 19
  - TypeScript
  - CustomTkinter
  - Tailwind CSS
tags:
  - developer-tools
  - automation
  - desktop
loc: 3500
files: 26
architecture:
  auth: none
  database: none
  api: REST
  realtime: none
  background: none
  cache: in-memory
  search: none
---

## Overview

Project Dashboard is a Windows desktop application that provides instant access to local development projects through a global hotkey command palette. Press `Win+Shift+W` from anywhere and immediately search, filter, and launch projects in VS Code, terminals, file managers, or AI coding assistants like Claude Code.

The app combines a FastAPI backend, a React/Next.js web dashboard, and native Windows integration via CustomTkinter for the command palette overlay. It runs quietly in the system tray, consuming minimal resources while providing sub-100ms project launching.

## Screenshots

<!-- SCREENSHOT: Command palette overlay showing project search results with fuzzy matching, keyboard hints at bottom -->
![Command Palette](/images/projects/project-dashboard/screenshot-1.png)

<!-- SCREENSHOT: Web dashboard grid view with project cards showing status indicators, drag handles, and quick-launch buttons -->
![Web Dashboard](/images/projects/project-dashboard/screenshot-2.png)

<!-- SCREENSHOT: Project detail modal showing detected docs, custom links, and port configuration options -->
![Project Details](/images/projects/project-dashboard/screenshot-3.png)

## Problem

Developers working on multiple projects waste time navigating file explorers, remembering paths, and context-switching between tools. Opening a project typically requires: finding the folder, launching the IDE, maybe opening a terminal, checking if services are running. This friction adds up across dozens of daily context switches.

Existing launchers like Alfred or Raycast are macOS-only. Windows alternatives lack deep integration with development workflows and don't understand project structures, git status, or development tooling.

## Approach

The solution is a dedicated project launcher that understands developer workflows. A global hotkey summons an instant search interface, and configurable keybindings launch projects directly into the right tool.

### Stack

- **FastAPI** - Lightweight REST API for project CRUD, launching, and file serving. Chosen for async support and automatic OpenAPI docs
- **Next.js 16 + React 19** - Static export served by FastAPI. Modern React features like server components and the React compiler for optimal bundle size
- **CustomTkinter** - Native Windows overlay for the command palette. Provides instant show/hide without browser overhead
- **pystray + pynput** - System tray icon and global hotkey capture. Works across all Windows applications
- **@dnd-kit** - Accessible drag-and-drop for project reordering in the web dashboard

### Challenges

- **Global hotkey responsiveness** - Initial Tkinter window creation was too slow (~500ms). Solved by pre-spawning the window off-screen and using show/hide instead of create/destroy. Now achieves <50ms from keypress to visible
- **Windows focus stealing** - Windows aggressively prevents apps from stealing focus. Required using `AttachThreadInput` and `SetForegroundWindow` via ctypes to reliably focus the palette
- **Project scanning timeouts** - Large monorepos with deep node_modules trees caused hangs. Implemented 10-second timeout with ThreadPoolExecutor and restricted directory traversal to known subdirectories

## Outcomes

The command palette provides reliable sub-100ms project access from any application. Project scanning correctly identifies frameworks (React, Next.js, FastAPI, etc.) and discovers documentation files. Drag-and-drop reordering persists across sessions.

Key learnings:
- Pre-spawning UI elements beats lazy initialization for perceived performance
- Windows API integration via ctypes is powerful but requires careful thread management
- JSON file storage is sufficient for personal tools with <100 records

## Implementation Notes

The command palette bypasses HTTP entirely for speed, calling Python services directly:

```python
# Direct store import for speed (bypasses HTTP)
from .services.launcher import Launcher
from .services.store import ProjectStore

_launcher = Launcher()
_store = ProjectStore()

def _launch_project(self, project: Dict, launch_type: str):
    self.hide()
    def do_launch():
        _launcher.launch(project['path'], launch_type)
        _store.mark_palette_open(project['path'])
    threading.Thread(target=do_launch, daemon=True).start()
```

Project scanning uses defensive timeouts and directory caps to prevent hangs:

```python
SCAN_TIMEOUT = 10  # seconds
MAX_DIR_ENTRIES = 200
KNOWN_SUBDIRS = ['frontend', 'client', 'backend', 'server', 'src', 'docs']

def scan(self, path_str: str) -> Project:
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(self._do_scan, path_str)
        try:
            return future.result(timeout=SCAN_TIMEOUT)
        except FuturesTimeoutError:
            raise ValueError(f"Scan timed out after {SCAN_TIMEOUT}s")
```

The launcher system supports both built-in commands and custom CLI tools defined in config:

```json
{
  "launchers": [
    {"id": "vscode", "command": "__vscode__", "hotkey": "enter", "builtin": true},
    {"id": "terminal", "command": "__terminal__", "hotkey": "ctrl+enter", "builtin": true},
    {"id": "claude", "command": "claude", "hotkey": "ctrl+c", "builtin": false}
  ]
}
```
