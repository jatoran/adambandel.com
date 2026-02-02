---
title: Odyssos
summary: Incremental idle game with training, exploration, and multi-tier rebirth mechanics
type: web-app
stack:
  - JavaScript (ES6 modules)
  - HTML5/CSS3
  - Parcel
  - break_eternity.js
  - lz-string
tags:
  - game
  - idle-game
  - incremental
loc: 20000
files: 97
---

## Overview

Odyssos is a feature-rich incremental idle game that blends training progression, world exploration, tournament combat, and artifact collection into a cohesive gameplay loop. Players grind through multiple realms (Force, Wisdom, Energy, Divine), conquer zones across expansive worlds, and strategically invest in upgrades to increase their Power Level.

The game features a sophisticated multi-tier rebirth system where players sacrifice progress for permanent bonuses, deep automation options that reward long-term investment, and an interconnected modifier system where upgrades can affect entire categories of game features. Built entirely with vanilla JavaScript and ES6 modules, the architecture prioritizes modularity and data-driven content creation.

## Screenshots

<!-- SCREENSHOT: Main training tab showing Force realm trainings with levels, production rates, and upgrade costs -->
![Training Tab](/images/projects/odyssos/screenshot-1.png)

<!-- SCREENSHOT: Exploration map view with conquered zones, region progress, and zone conquest timer -->
![Exploration Map](/images/projects/odyssos/screenshot-2.png)

<!-- SCREENSHOT: Skill tree or Essence upgrade tree showing unlocked nodes and available paths -->
![Skill Tree](/images/projects/odyssos/screenshot-3.png)

## Problem

Incremental games often suffer from shallow mechanics that become repetitive after initial engagement. Many lack the interconnected systems that create emergent gameplay and strategic depth. Additionally, browser-based idle games need robust offline progress calculation and efficient save state management to provide seamless player experience across sessions.

## Approach

### Stack

- **JavaScript ES6 Modules** - Chosen for native browser module support without framework overhead, enabling clean separation of concerns across 95+ component files
- **break_eternity.js** - Handles numbers up to 10^^1e308, essential for incremental games where values grow exponentially beyond JavaScript's native limits
- **lz-string** - Compresses save data before localStorage persistence, critical for games with hundreds of stateful objects
- **Parcel** - Zero-config bundling with hot reload for rapid development iteration

### Challenges

- **Priority-Based Modifier System** - Upgrades needed to affect multiple targets (specific trainings, entire realms, or all features) with correct calculation order. Solved with a ModTree linked-list structure where each node has a priority determining evaluation order, supporting add, multiply, exponent, and tetration operations

```javascript
// ModTree calculates final values by traversing priority-sorted nodes
performCalculation(type, val1, val2) {
  const CALCULATION_TYPES = {
    'add': (v1, v2) => v1.plus(v2),
    'mult': (v1, v2) => v1.times(v2),
    'exp': (v1, v2) => v2.pow(v1),
    'tetra': (v1, v2) => v2.tetrate(v1)
  };
  return CALCULATION_TYPES[type](val1, val2);
}
```

- **Offline Progress Simulation** - Needed accurate idle gains that account for autobuying, unlocks, and compounding production. Implemented asynchronous chunk-based simulation that processes the game loop in 10-second intervals using setTimeout, preventing UI freeze while maintaining calculation accuracy

- **Modular State Persistence** - With 20+ distinct feature types (trainings, zones, artifacts, skills, etc.), save/load needed clean separation. Created dedicated state handler classes for each feature type, with a central StateManager orchestrating serialization, lz-string compression, and rebirth-aware selective resets

## Outcomes

The modifier system successfully handles hundreds of active modifiers with type-targeting (e.g., `allTrain`, `forceTrain`) and priority-based calculation without circular dependencies. Offline processing accurately simulates extended idle periods while displaying a progress modal for longer calculations.

Key architectural learnings:
- Observer pattern via EventManager enables loose coupling between UI and game logic
- Data-driven content (16 JSON files define all game features) allows rapid iteration without code changes
- Separating "what to save" from "how to save" in state management simplified adding new features

The game successfully implements multiple prestige layers, with Rebirth 1 (Essence) fully functional and architecture prepared for Rebirth 2 (Godhood) and Rebirth 3 (Transcendence) tiers.

## Implementation Notes

### Architecture Pattern

The codebase follows a Mediator pattern with the Game class as central coordinator:

```
Game (Mediator)
├── GameManager (Logic)
│   ├── GameContent (All objects)
│   ├── UnlockManager (Progression gates)
│   └── AutomationManager (Autobuy)
├── StateManager (Persistence)
│   └── 20+ State modules
├── EventManager (Observer pattern)
└── GameUI (Presentation)
```

### Data-Driven Design

All game content is defined in JSON, making it easy to add new trainings, zones, or artifacts:

```json
// trainingData.json example
{
  "id": 1001,
  "realmID": 10,
  "name": "Running",
  "costType": "force",
  "costBase": 10,
  "costGrowthRate": 1.15,
  "prodType": "force",
  "prodBase": 1,
  "evolutions": [...]
}
```

### ID Range System

Organized ID allocation prevents collisions across feature types:
- Realms: 10-40
- Trainings: 1001-2201
- Skills: 40001+
- Zones: 90001+
- Essence Upgrades: 100001+
