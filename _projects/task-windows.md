---
title: Task Windows
summary: A task manager that schedules work into 3-day windows instead of single days, with a point budget for each window
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

Task Windows is a task manager that schedules work into 3-day windows instead of single days.
A new window starts every day and covers that day and the next two, so a task goes into a three-day span instead of onto one date.
Tasks that take longer can span several windows.
Each window has a point budget, and a capacity bar shows how much of it is already committed.
Everything moves by drag and drop, and holding Shift, Ctrl or Alt during a drag sets a task's points, context or project instead of moving it.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing multiple window columns with tasks, the capacity bars, and the current window highlighted -->
![Main Dashboard](/images/projects/task-windows/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop in action with the Shift modifier overlay showing point assignment zones -->
![Point Assignment Overlay](/images/projects/task-windows/screenshot-2.png)

<!-- SCREENSHOT: Sidebar panel open showing the inbox/backlog, heatmap calendar, and project hierarchy -->
![Sidebar with Heatmap](/images/projects/task-windows/screenshot-3.png)

## Problem

Calendar-style task managers make you put every task on a specific day.
A task that doesn't fit neatly into one day slips to the next, and gets rescheduled again and again.
Most of them also have no sense of capacity, so it's easy to overcommit without noticing until you burn out.

## Approach

At the center is an engine that builds everything on screen from a flat list of tasks.
Each task has a home window and a span.
The engine puts the task in its home window and adds a ghost copy, faded and not draggable, to each later window the span covers.

### Stack

- Next.js 16 and React 19, with Next.js API routes reading and writing the data.
- Zustand for state. Changes show on screen immediately and sync to the API in the background.
- dnd-kit for drag and drop, with custom collision detection for the modifier keys.
- TailwindCSS, with dark mode through next-themes.
- A JSON file instead of a database. It started on SQLite, but the SQLite driver is a native module, and a build compiled on Linux wouldn't load on Windows, so it moved to plain JSON.
- date-fns and date-fns-tz for dates, including the 4 AM day boundary.

### Challenges

- A task that spans several windows has to appear in each of them without duplicating the stored task. The ghost copies are generated at render time from the task's home window and span.
- Capacity is tracked per window and for clusters of three adjacent windows. A heavy stretch spread across several windows shows up in the cluster total even when no single window looks overloaded.
- The modifier keys needed custom collision detection in dnd-kit. Depending on which key is held, it prefers a different set of drop zones: Shift for points, Ctrl for contexts, Alt for projects. That keeps those controls out of the main UI.
- On desktop, buttons move between windows. On mobile the columns switch to native horizontal scrolling with snap points, and a ResizeObserver sets how many columns fit.

## Outcomes

Storage and display are separate.
Tasks are stored as a flat list, and everything on screen, ghosts and capacity included, is recomputed from that list on every change.
Edits to tasks show up immediately and roll back if the save fails.
The modifier overlays can take more drag actions without adding buttons to the UI.

## Implementation Notes

The engine builds the window data from the task list:

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

The collision detection checks which modifier is held and prefers the matching drop zones:

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

The day changes at 4 AM Central time instead of midnight, so anything done before 4 AM counts toward the previous day:

```typescript
export function getLogicalDate(now: Date = new Date()): string {
    const zoned = toZonedTime(now, 'America/Chicago');
    const shifted = subHours(zoned, 4); // Work before 4 AM counts as previous day
    return format(shifted, 'yyyy-MM-dd');
}
```
