---
title: Odyssos
summary: A browser incremental idle game where you train, explore and fight tournaments to raise your power level, then reset for permanent bonuses and push further
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

Odyssos is an incremental idle game that runs in the browser.
You train in four realms (Force, Wisdom, Energy and Divine), each with its own resource, conquer zones across a series of worlds, fight in tournaments, collect artifacts, and spend on upgrades to raise your power level.
It is released, and you can play it at [odyssos.io](https://odyssos.io).

Rebirths reset your progress in exchange for permanent bonuses, in several tiers.
Automation, which you earn through upgrades and rebirths, takes over the repetitive buying.
Upgrades all go through one modifier system, so a single upgrade can affect one training, a whole realm, or every feature of a kind.
It is written in vanilla JavaScript with ES6 modules, and the game content is defined in JSON data files rather than in code.

## Screenshots

<!-- SCREENSHOT: Main training tab showing Force realm trainings with levels, production rates, and upgrade costs -->
![Training Tab](/images/projects/odyssos/screenshot-1.png)

<!-- SCREENSHOT: Exploration map view with conquered zones, region progress, and zone conquest timer -->
![Exploration Map](/images/projects/odyssos/screenshot-2.png)

<!-- SCREENSHOT: Skill tree or Essence upgrade tree showing unlocked nodes and available paths -->
![Skill Tree](/images/projects/odyssos/screenshot-3.png)

## Problem

The plan from the start was a game that unfolds gradually.
I hate being overwhelmed by a thousand menus and options when I start a game, and I believe most players do too, so a lot of the work went into the interface and the tutorial opening up a piece at a time.
I had also never released a game, and I wanted this one published and in front of as many people as I could.

On the technical side, a browser idle game has to work out what you earned while the tab was closed, and save a lot of state compactly between sessions.

## Approach

### Stack

- JavaScript ES6 modules: no framework, loaded natively by the browser, split across 95+ component files.
- break_eternity.js: handles numbers up to 10^^1e308, which an incremental game needs because its values grow far past what a native JavaScript number can hold.
- lz-string: compresses the save before it goes into localStorage, which matters with hundreds of objects carrying state.
- Parcel: bundling with no configuration, and hot reload during development.

### Challenges

- Modifier order. Upgrades had to affect several kinds of target (a specific training, a whole realm, or every feature) and be calculated in the right order. The answer was ModTree, a linked list of modifier nodes, each with a priority that sets its evaluation order. It supports add, multiply, exponent and tetration.

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

- Offline progress. Idle gains had to account for autobuying, unlocks and compounding production. The game loop is replayed asynchronously in 10-second chunks with setTimeout, which keeps the calculation accurate without freezing the UI.

- Saving state. With 20+ kinds of feature (trainings, zones, artifacts, skills and more), saving and loading needed clean separation. Each feature type has its own state handler class, and a central StateManager handles serialization, lz-string compression, and the selective resets a rebirth needs.

## Outcomes

It took the better part of a year, and I released it.
Reviews were mixed, and the negative ones were almost all about balancing.
The praise was for the gameplay, and players logged a lot of hours on a couple of incremental game sites.
It still needs balancing.

The modifier system handles hundreds of active modifiers, targeted by type (for example `allTrain` or `forceTrain`) and calculated by priority, without circular dependencies.
Offline progress simulates long idle periods and shows a progress window while the longer calculations run.

An EventManager (the observer pattern) keeps the UI and the game logic loosely coupled.
All game content is defined in 16 JSON files, so content changes don't need code changes.
Separating what gets saved from how it gets saved made it simpler to add new features to the save system.

Rebirth 1 (Essence) works, and the code is set up for Rebirth 2 (Godhood) and Rebirth 3 (Transcendence).

## Implementation Notes

### Architecture Pattern

The Game class is a mediator that coordinates everything else:

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

All game content is defined in JSON, so a new training, zone or artifact is a new data entry:

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

Each feature type has its own ID range, so IDs never collide:

- Realms: 10-40
- Trainings: 1001-2201
- Skills: 40001+
- Zones: 90001+
- Essence Upgrades: 100001+
