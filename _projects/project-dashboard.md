---
title: Project Dashboard
summary: A Windows project launcher where a global hotkey brings up a search box and one keypress opens the project in VS Code, a terminal or Claude Code
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

Project Dashboard is a Windows desktop app for opening local code projects.
`Win+Shift+W` brings up a command palette from anywhere, where you search for a project and open it in VS Code, a terminal, the file manager, or a coding agent such as Claude Code.

It is a FastAPI backend, a React/Next.js web dashboard, and a native CustomTkinter window for the palette.
It runs in the system tray.

## Screenshots

<!-- SCREENSHOT: Command palette overlay showing project search results with fuzzy matching, keyboard hints at bottom -->
![Command Palette](/images/projects/project-dashboard/screenshot-1.png)

<!-- SCREENSHOT: Web dashboard grid view with project cards showing status indicators, drag handles, and quick-launch buttons -->
![Web Dashboard](/images/projects/project-dashboard/screenshot-2.png)

<!-- SCREENSHOT: Project detail modal showing detected docs, custom links, and port configuration options -->
![Project Details](/images/projects/project-dashboard/screenshot-3.png)

## Problem

Opening a project usually means finding its folder, starting the editor, maybe opening a terminal, and checking whether its services are running.
Across many projects, that adds up.

## Approach

A global hotkey opens a search box over the project list, and each launcher has its own key: Enter opens VS Code, Ctrl+Enter a terminal, Ctrl+C Claude Code.
The launchers and their keys are set in a JSON config.

### Stack

- FastAPI: a small REST API for adding and editing projects, launching them, and serving files. Chosen for async support and the automatic OpenAPI docs.
- Next.js 16 and React 19: built as a static export that FastAPI serves.
- CustomTkinter: a native Windows window for the command palette, so showing and hiding it doesn't go through a browser.
- pystray and pynput: the tray icon and the global hotkey, which works whichever application has focus.
- @dnd-kit: drag-and-drop reordering of projects in the web dashboard.

### Challenges

- Hotkey response. Creating the Tkinter window on each press was too slow (about 500 ms). The window is now created once, off-screen, and shown and hidden instead of created and destroyed, which gets it from keypress to visible in under 50 ms.
- Focus. Windows works hard to stop apps from taking focus, and focusing the palette reliably took `AttachThreadInput` and `SetForegroundWindow` through ctypes.
- Scan timeouts. Large monorepos with deep node_modules trees made the scanner hang. Scans now run in a ThreadPoolExecutor with a 10-second timeout, and only descend into known subdirectories.

## Outcomes

The palette opens a project in under 100 ms from any application.
Scanning picks up each project's framework (React, Next.js, FastAPI and others) and its documentation files.
The drag-and-drop order of projects is kept between sessions.

Creating the window ahead of time did more for how fast it feels than creating it on demand.
Calling the Windows API through ctypes works, but it needs careful thread management.
A JSON file is enough storage for a personal tool with fewer than 100 records.

## Implementation Notes

The command palette skips HTTP and calls the Python services directly, for speed:

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

Scanning has a timeout and a cap on directory entries so it can't hang:

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

Launchers are either built-in commands or any CLI tool defined in the config:

```json
{
  "launchers": [
    {"id": "vscode", "command": "__vscode__", "hotkey": "enter", "builtin": true},
    {"id": "terminal", "command": "__terminal__", "hotkey": "ctrl+enter", "builtin": true},
    {"id": "claude", "command": "claude", "hotkey": "ctrl+c", "builtin": false}
  ]
}
```
