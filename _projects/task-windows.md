---
title: Task Windows
summary: A rolling 3-day window task manager with drag-and-drop scheduling and capacity planning
date: 2024-12-01
---

## Overview

Task Windows is a desktop-first personal task manager built around a unique "rolling window" paradigm. Instead of infinite backlogs or rigid daily lists, tasks are scheduled into overlapping 3-day windows that naturally handle deadline pressure while maintaining flexibility.

The application provides real-time capacity planning, multi-day task spans with ghost card visualization, and a modifier-key enhanced drag-and-drop system for rapid task organization. It's designed for knowledge workers who need to balance deep work with responsive scheduling.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing multiple rolling windows with tasks, the capacity bars, and the sidebar with backlog visible -->
![Dashboard Overview](/images/projects/task-windows/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop in action with Shift key held, showing the point assignment overlay zones -->
![Quick Point Assignment](/images/projects/task-windows/screenshot-2.png)

<!-- SCREENSHOT: Calendar heatmap in sidebar showing task load distribution across days -->
![Calendar Heatmap](/images/projects/task-windows/screenshot-3.png)

<!-- SCREENSHOT: Dark mode view with expanded window showing task details and context labels -->
![Dark Mode Detail View](/images/projects/task-windows/screenshot-4.png)

## Problem

Traditional task managers force users into one of two extremes: rigid daily planning that breaks when priorities shift, or endless backlogs that obscure what actually needs attention. Neither approach handles the reality of knowledge work where tasks have varying urgency, some work spans multiple days, and capacity limits are real but soft.

The goal was to create a system that makes "what should I work on in the next few days?" immediately visible while providing enough structure to prevent overcommitment.

## Approach

The core innovation is the **rolling window model**: each window represents 3 consecutive days, and windows overlap. A task scheduled for Monday's window remains visible (as a ghost) through Wednesday, naturally handling the common pattern of work that slips or spans sessions.

### Stack

- **Framework** - Next.js 16 with App Router for hybrid rendering and API routes
- **State Management** - Zustand for performant, subscription-based reactive state
- **Drag & Drop** - dnd-kit for accessible, flexible drag interactions with custom collision detection
- **Styling** - Tailwind CSS with dark mode support via next-themes
- **Data Layer** - JSON file persistence for zero-dependency portability
- **Rich Text** - TipTap for note editing within project/context slide-overs

### Challenges

- **Cross-platform portability** - Initially used better-sqlite3, but native module compilation failed when moving between Linux dev environments and Windows production. Solved by implementing a JSON file adapter with the same interface, ensuring the architecture can swap back to a real database later.

- **Modifier-key DnD zones** - Standard drag-and-drop doesn't account for keyboard modifiers changing the drop target semantics. Built a custom collision detection system that dynamically prioritizes point zones (Shift), context zones (Ctrl), or project zones (Alt) based on held keys.

- **Ghost card consistency** - Tasks spanning multiple windows appear as "ghosts" in non-home windows. Maintaining sort order, selection state, and capacity calculations across these virtual instances required careful instance ID tracking (`taskId::window-index`).

- **Capacity truth** - The engine calculates both window capacity (single window load) and cluster capacity (3-window rolling sum) to surface overcommitment. These metrics inform but don't block scheduling, respecting user autonomy.

## Outcomes

The rolling window model effectively surfaces near-term priorities without losing sight of backlogged work. The modifier-key shortcuts significantly reduce the clicks needed for common operations like adjusting task effort or moving work between contexts.

Key learnings from this project include designing state that supports multiple "views" of the same entity (anchor vs. ghost), building custom DnD behaviors on top of dnd-kit's flexible API, and the importance of portable data layers in personal tools.

## Implementation Notes

The engine (`src/lib/engine.ts`) is pure functional - it takes all tasks, the current date, and settings, then produces the complete application state including window contents, overdue items, and capacity metrics:

```typescript
export function generateEngineState(
    allTasks: Task[], 
    now: Date = new Date(), 
    viewOffset: number = 0,
    settings: Settings,
    contexts: Context[],
    projects: Project[],
    visibleColumns: number = 4,
    dragSourceWindowIndex?: number | null
): AppState {
    // Calculate logical date (4 AM CST boundary)
    const currentLogicalDate = getLogicalDate(now);
    const currentWindowIndex = getDayIndex(currentLogicalDate);
    
    // Generate visible windows with task distribution
    // Ghost tasks appear in [home, home + span - 1] windows
    // ...
}
```

Custom collision detection enables the modifier-key behavior:

```typescript
const customCollisionDetection: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    const { isShiftHeld, isCtrlHeld, isAltHeld } = useTaskStore.getState();
    
    // Shift: prioritize point assignment zones
    if (isShiftHeld && pointerCollisions.length > 0) {
        const pointZone = pointerCollisions.find(c => 
            c.id.toString().includes('-pts-')
        );
        if (pointZone) return [pointZone];
    }
    // Ctrl: prioritize context zones
    // Alt: prioritize project zones
    // ...
}, []);
```

The data layer abstracts storage behind a simple interface, making it trivial to swap between JSON files and a proper database:

```typescript
export const db = {
    getTasks: () => { /* ... */ },
    addTask: (task: Task) => { /* ... */ },
    updateTask: (id: string, updates: Partial<Task>) => { /* ... */ },
    // Same interface regardless of backend
};
```
