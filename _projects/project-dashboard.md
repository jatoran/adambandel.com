---
title: Project Dashboard
summary: Windows desktop app with global hotkey command palette for managing local dev projects
date: 2025-01-15
github: https://github.com/adambandel/project-dashboard
---

## Overview

Project Dashboard is a Windows desktop application that combines a modern web-based dashboard with an instant global hotkey command palette. It solves a common developer frustration: quickly switching between dozens of local projects without hunting through file explorers or terminal history.

The application runs as a system tray icon, serving both a Next.js dashboard for visual project management and a lightning-fast (<50ms) Tkinter command palette accessible from anywhere via Win+Shift+W. Auto-discovery scans project directories to detect tech stacks, ports, documentation, and more—no manual configuration required.

## Screenshots

<!-- SCREENSHOT: Command palette overlay showing fuzzy search with project list, demonstrating the instant global access feature with a few projects visible -->
![Command Palette with fuzzy search](/images/projects/project-dashboard/screenshot-1.png)

<!-- SCREENSHOT: Web dashboard grid view showing multiple project cards with colored tech stack indicators, status dots for running services, and drag handles visible -->
![Dashboard with project cards](/images/projects/project-dashboard/screenshot-2.png)

<!-- SCREENSHOT: Project detail panel expanded showing detected documentation, ports, and available launcher buttons (VS Code, Terminal, Explorer) -->
![Project detail with launchers](/images/projects/project-dashboard/screenshot-3.png)

<!-- SCREENSHOT: System tray icon context menu showing Start/Stop Server, Command Palette, and Exit options with green active indicator -->
![System tray integration](/images/projects/project-dashboard/screenshot-4.png)

## Problem

Managing dozens of local development projects means constantly context-switching: opening terminals to the right directory, launching VS Code in the correct workspace, remembering which ports different projects use, and finding project documentation. Traditional file explorers and IDE recent-projects lists are too slow and require too many clicks.

I wanted a single hotkey that instantly shows all my projects, fuzzy-searches by name or tech stack, and launches my preferred tools in under 100ms—all without touching the mouse.

## Approach

The core insight was that perceived speed matters more than actual speed. A command palette spawned fresh takes 1-2 seconds; a pre-spawned window that unhides takes 50ms. This led to a hybrid architecture combining native desktop performance with web-based visual richness.

### Stack

- **Backend** - Python with FastAPI for REST API and static file serving. Chosen for rapid prototyping and excellent Windows integration libraries.
- **Command Palette** - CustomTkinter for a native, pre-spawned overlay window. Bypasses HTTP entirely for sub-50ms response times.
- **Frontend** - Next.js 16 with static export, served by FastAPI. React 19 with @dnd-kit for drag-and-drop project reordering.
- **System Tray** - pystray for native Windows tray integration with pynput for global hotkey capture without keyboard lag.
- **Styling** - Tailwind CSS 4 for rapid UI development with consistent design tokens.

### Challenges

- **Instant window focus** - Tkinter windows fail to grab focus from other applications. Solved using Windows API `AttachThreadInput` to force foreground window capture, ensuring reliable focus regardless of active application.

- **Path case sensitivity** - Windows is case-insensitive but case-preserving, causing duplicate project entries when paths differ only by case. Built `resolve_path_case()` to walk the filesystem and resolve exact on-disk casing.

- **Process cleanup on exit** - `uv run uvicorn` spawns child processes that survive `terminate()`. Implemented Windows-specific `taskkill /F /T /PID` to kill the entire process tree cleanly.

- **Port auto-detection** - Dev servers run on various ports with no standard declaration. Created waterfall heuristics checking docker-compose.yml, package.json scripts, and framework defaults for ~80% accuracy.

## Outcomes

The command palette achieves consistent <50ms show time, making it feel genuinely instant. Fuzzy search with recency sorting means frequently-used projects require just one or two keystrokes. The dashboard provides visual project management for less frequent tasks like reordering or reviewing documentation.

Key learnings included the importance of pre-spawning for perceived performance, Windows API quirks around focus management, and the value of convention-based auto-discovery over explicit configuration.

## Implementation Notes

The pre-spawn pattern is the core performance optimization:

```python
class CommandPaletteController:
    def __init__(self):
        # Create window immediately but keep hidden
        self.window = ctk.CTk()
        self.window.withdraw()  # Hide from taskbar
        self._position_offscreen()
        
    def show(self):
        # Just move and show - no creation overhead
        self._center_on_screen()
        self.window.deiconify()
        self._force_focus()  # Windows API call
```

The project scanner uses parallel execution with timeouts to handle slow network drives:

```python
def scan_directory(path: Path) -> ProjectInfo:
    with ThreadPoolExecutor(max_workers=4) as executor:
        future = executor.submit(_deep_scan, path)
        try:
            return future.result(timeout=10)  # 10s max per project
        except TimeoutError:
            return _minimal_project_info(path)
```

Launcher definitions are JSON-configurable, allowing users to add custom CLI tools without code changes:

```json
{
  "id": "claude-code",
  "name": "Claude Code",
  "command": "claude",
  "args": ["{path}"],
  "hotkey": "ctrl+shift+c"
}
```
