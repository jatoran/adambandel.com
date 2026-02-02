---
title: Task Windows
summary: A time-boxing task manager with 3-day windows, drag-and-drop scheduling, and capacity tracking
started: 2025-11-20
updated: 2025-11-30
type: web-app
stack:
  - TypeScript
  - Next.js 16
  - React 19
  - Zustand
  - TailwindCSS
  - dnd-kit
tags:
  - productivity
  - developer-tools
loc: 8036
files: 33
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

Task Windows is a novel approach to task management that organizes work into rolling 3-day time windows rather than traditional single-day calendars. Each window represents a contiguous block of time where tasks can be scheduled, with built-in capacity tracking to prevent overcommitment. The application features a polished drag-and-drop interface with modifier-key workflows for rapid task organization.

The system treats time as a sliding window: today's window covers the next 3 days, and tasks can span multiple windows to represent longer-duration work. This approach acknowledges that many tasks don't fit neatly into a single day while maintaining focus on what's actionable now.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing multiple window columns with tasks, the capacity bars, and the current window highlighted -->
![Main Dashboard](/images/projects/task-windows/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop in action with the Shift modifier overlay showing point assignment zones -->
![Point Assignment Overlay](/images/projects/task-windows/screenshot-2.png)

<!-- SCREENSHOT: Sidebar panel open showing the inbox/backlog, heatmap calendar, and project hierarchy -->
![Sidebar with Heatmap](/images/projects/task-windows/screenshot-3.png)

## Problem

Traditional calendar-based task managers force users to assign tasks to specific days, which creates friction when tasks don't fit neatly into 24-hour blocks. This leads to constant rescheduling as tasks slip from one day to the next. Additionally, most tools lack capacity awareness, making it easy to overcommit without realizing it until burnout sets in.

The goal was to create a task manager that:
- Treats time as flexible 3-day windows rather than rigid days
- Tracks capacity with a point-based system to prevent overcommitment
- Supports multi-day tasks that "ghost" across their span
- Enables rapid reorganization through keyboard-modified drag operations

## Approach

The solution centers on a custom "engine" that generates the visible window state from a flat list of tasks. Each task has a home window index and a span, and the engine projects these into the appropriate windows, creating ghost instances where tasks extend beyond their home.

### Stack

- **Frontend Framework** - Next.js 16 with React 19 for the app router and server components
- **State Management** - Zustand for global state with optimistic updates and API sync
- **Drag and Drop** - dnd-kit for accessible, performant drag operations with custom collision detection
- **Styling** - TailwindCSS with dark mode support via next-themes
- **Data Persistence** - JSON file-based storage for cross-platform portability (see AGENTS.md for rationale)
- **Date Handling** - date-fns with timezone support for the 4 AM day boundary logic

### Challenges

- **Multi-window task visualization** - Tasks spanning multiple windows needed to appear as "ghosts" in non-home windows without duplicating the underlying data. Solved by generating display instances at render time based on home index and span.

- **Capacity calculation** - Both per-window and 3-window cluster capacity needed tracking. Cluster capacity (adjacent windows) helps identify fatigue and overload patterns that single-window metrics miss.

- **Modifier-key workflows** - Implemented custom collision detection in dnd-kit that prioritizes different drop zones based on held modifiers (Shift for points, Ctrl for contexts, Alt for projects). This enables power-user workflows without cluttering the UI.

- **Mobile responsiveness** - Desktop uses button-based navigation between windows while mobile switches to native horizontal scroll with snap points. A ResizeObserver detects the breakpoint and adjusts the column count dynamically.

## Outcomes

The time-window mental model proves effective for managing flexible workloads. The capacity visualization catches overcommitment before it becomes a problem, and the ghost-task rendering provides visibility into upcoming work without manual date management.

Key technical wins:
- The engine pattern cleanly separates task storage from view computation
- Optimistic updates with rollback provide a snappy user experience
- The modifier-key overlay system scales to additional workflows without UI bloat

## Implementation Notes

The core engine generates window data from tasks:

```typescript
export function generateEngineState(
    allTasks: Task[], 
    now: Date = new Date(), 
    viewOffset: number = 0,
    settings: Settings,
    contexts: Context[] = [],
    projects: Project[] = [],
    visibleColumns: number = 4,
    dragSourceWindowIndex?: number | null
): AppState {
    // Tasks are distributed to windows based on home_window_index and span_windows
    // Ghost instances created for i !== home where i is in [home, home + span - 1]
    // Capacity calculated per-window and for 3-window clusters
}
```

The modifier-key collision detection enables different drop behaviors:

```typescript
const customCollisionDetection: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    const { isShiftHeld, isCtrlHeld, isAltHeld } = useTaskStore.getState();
    
    // Shift: prioritize point-assignment zones
    if (isShiftHeld && !isCtrlHeld && !isAltHeld) {
        const pointZone = pointerCollisions.find(c => c.id.toString().includes('-pts-'));
        if (pointZone) return [pointZone];
    }
    
    // Ctrl: prioritize context zones
    // Alt: prioritize project zones
    // ...
}, []);
```

The 4 AM day boundary handles late-night work gracefully:

```typescript
export function getLogicalDate(now: Date = new Date()): string {
    const zoned = toZonedTime(now, 'America/Chicago');
    const shifted = subHours(zoned, 4); // Work before 4 AM counts as previous day
    return format(shifted, 'yyyy-MM-dd');
}
```
