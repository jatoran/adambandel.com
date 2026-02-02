---
title: Odyssos
summary: A deep incremental game with multi-realm training, exploration, and a priority-based modifier system.
date: 2023-04-01
---

## Overview

Odyssos is a web-based incremental (idle) game that combines training, exploration, and strategy mechanics. Players progress through multiple realms of power—Force, Wisdom, Energy, and Divine—while conquering zones across an expansive universe, battling in tournaments, and unlocking artifacts that provide powerful bonuses.

The game features a sophisticated modifier system, multi-layered rebirth mechanics, and offline progression. Built entirely in vanilla JavaScript with ES6 modules, it demonstrates complex game state management and data-driven architecture without relying on frameworks.

## Screenshots

<!-- SCREENSHOT: Main training tab showing Force realm with multiple training exercises, level buttons, and current income display -->
![Training Tab](/images/projects/odyssos/screenshot-1.png)

<!-- SCREENSHOT: Odyssey exploration map with regions and zone connections visible, showing conquest progress -->
![Exploration Map](/images/projects/odyssos/screenshot-2.png)

<!-- SCREENSHOT: Skill tree interface showing unlocked skills and branching paths -->
![Skill Tree](/images/projects/odyssos/screenshot-3.png)

<!-- SCREENSHOT: Essence tab after rebirth showing persistent upgrade tree -->
![Essence Upgrades](/images/projects/odyssos/screenshot-4.png)

## Problem

Most incremental games plateau quickly or become tedious number-watching experiences. I wanted to create a game with genuine strategic depth—one where progression systems interconnect meaningfully, where player choices matter, and where the satisfaction of optimization keeps players engaged across multiple prestige layers.

## Approach

The solution was building a data-driven architecture where game content is defined in JSON and processed by a flexible modifier system that allows any upgrade to affect any other game element.

### Stack

- **JavaScript (ES6 Modules)** - Vanilla JS for maximum control over game loop timing and memory management
- **Parcel** - Zero-config bundling for development and production builds
- **break_eternity.js** - Arbitrary precision math for numbers that exceed JavaScript's limits (1e308+)
- **lz-string** - Save data compression to stay within localStorage limits
- **CSS** - Custom dark theme UI with inset shadows and visual feedback

### Challenges

- **Priority-Based Modifier System** - Built a tree-based calculation system where modifiers stack in priority order. Additive bonuses calculate before multiplicative ones, and global modifiers cascade correctly through all affected features. Solved by creating `ModTree` nodes that rebuild dynamically when modifiers activate.

- **Offline Progression Accuracy** - Rather than approximating gains with formulas, the `OfflineManager` simulates game ticks in chunks. This ensures autobuyers, unlocks, and synergy bonuses all trigger correctly during offline time, matching what would have happened if the player was active.

- **State Serialization at Scale** - With 10,000+ game objects, save/load needed to be modular and efficient. Created a state module pattern where each feature type handles its own serialization, with `Decimal` objects converted to strings and compressed before storage.

- **Memory Leaks on Reset** - Rebirth mechanics that reinitialize the game caused memory buildup. Solved by implementing a full `window.reload` bypass with state type stored in localStorage, ensuring clean reinitialization.

## Outcomes

The architecture scales well—adding new training types, zones, or upgrade paths requires only JSON changes and optional unlock conditions. The modifier system handles edge cases like self-referential cost reductions and cross-realm synergies without special-case code.

Key learnings:
- Data-driven design pays off exponentially as content grows
- Event-driven architecture keeps managers decoupled and testable
- Simulating time (vs. calculating) for offline gains is more accurate and surprisingly performant

## Implementation Notes

The core of the game is the modifier system. Every bonus in the game is a `Mod` with a source, target, and calculation type:

```javascript
export default class Mod extends Observable {
  constructor(eventManager, id, name, type, priority, 
              sourceID, sourceCalcType, targetType, targetID, 
              runningCalcType, baseValue, value, active) {
    this.priority = priority; // Lower = calculated first
    this.runningCalcType = runningCalcType; // 'add', 'mult', 'pow'
    this.modTreeReferences = []; // Nodes in target's calculation tree
  }
}
```

Modifiers can target specific objects or entire categories (e.g., `allTrain` affects all training exercises). The `ModTree` rebuilds whenever a modifier activates, inserting nodes in priority order:

```javascript
// Priority assignment based on mod type
// Base values: priority 1
// Additive bonuses: priority 10
// Multiplicative: priority 20
// Exponential: priority 30
```

The game loop runs at 100ms intervals, processing income updates, unlock checks, and UI refreshes:

```javascript
this.incomeUpdateInterval = 100; // ms
this.uiUpdateInterval = 100; // ms  
this.unlockCheckInterval = 200;
```

Zone conquest uses a time-based system where the player's power level logarithmically reduces conquest duration, creating satisfying momentum as power grows.
