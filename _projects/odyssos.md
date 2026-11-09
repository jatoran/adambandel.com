---
title: Odyssos
summary: A browser incremental game where you train, explore and fight tournaments to raise your power level, then reset in three tiers for permanent bonuses
updated: 2026-11-06
type: web-app
stack:
  - JavaScript (ES modules)
  - HTML5/CSS3
  - Parcel
  - break_eternity.js
  - lz-string
  - node:test
  - GitHub Pages
tags:
  - game
  - idle-game
  - incremental
loc: 34865
files: 254
architecture:
  auth: none
  database: localStorage
  api: none
  realtime: none
  background: none
  cache: none
  search: none
---

## Overview

Odyssos is an incremental idle game that runs in the browser.
You train in four realms (Force, Wisdom, Energy and Divine), each with its own resource, conquer zones on a map that runs across a series of worlds, fight your way up a ladder of tournament fighters, collect artifacts, and spend on upgrades to raise your power level, the one number all of it feeds.
It is released and live at [odyssos.io](https://odyssos.io), at version 0.9.4, still marked beta.
The same build is also on itch.io and Game Jolt, and galaxy.click and IncrementalDB list it.

A rebirth resets your run in exchange for a permanent multiplier, and there are three tiers of it.
Each tier opens at a higher power level, resets more than the tier below it, and pays its own currency, which buys upgrades that are kept through that tier's resets and the ones below it.
The final upgrade in the second tier's tree opens the fourth realm, Divine, whose income multiplies the other three.
Automation, which you earn through upgrades and rebirths, takes over the buying, the zone conquests, the tournament and, under conditions you set, the rebirths themselves.
Upgrades all go through one modifier system, so a single upgrade can affect one training, a whole realm, or every feature of a kind.
It is written in plain JavaScript with no framework and no server: the game and its save both live in the browser.

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
Once players have saves, every update also has to load them.

## Approach

### Stack

- JavaScript ES modules: no framework, about 155 files, bundled by Parcel.
- break_eternity.js: handles numbers up to 10^^1e308, which an incremental game needs because its values grow far past what a native JavaScript number can hold.
- lz-string: compresses an exported save into a block of text you can keep and import later.
- Parcel: bundling with no configuration, and hot reload during development.
- node:test: about 260 tests, most of them running the real game headless in Node.
- GitHub Pages: serves odyssos.io.
  The release scripts build the game once, zip it for the game portals, and push the same build to the site.

### Challenges

- Modifier order.
  Upgrades had to affect several kinds of target (a specific training, a whole realm, or every feature) and be calculated in the right order.
  The answer was ModTree: each feature keeps the modifiers that target it in a linked list sorted by priority, which sets the order they are applied in.
  A modifier can add, subtract, multiply, divide, raise to a power or take a logarithm.
  Tetration is still in the table, but it is switched off for balance and falls back to an exponent.

```javascript
// ModTree.js: how one modifier combines with the running result
const CALCULATION_TYPES = {
  'add': (val1, val2) => val1.plus(val2),
  'sub': (val1, val2) => val2.minus(val1),
  'mult': (val1, val2) => val1.times(val2),
  'div': (val1, val2) => val2.dividedBy(val1),
  'addPercent': (val1, val2) => val1.times(val2),
  'subPercent': (val1, val2) => val2.times(val1),
  'exp': (val1, val2) => val2.pow(val1),
  'tetra': (val1, val2) => {
    console.warn('Tetration disabled for balance safety, falling back to exp');
    return val2.pow(val1);
  },
  // 1 + log_base(level): neutral (1) at level 1 and growing slowly,
  // so a log-scaled mod never divides by zero or inverts its effect.
  'log': (val1, val2) => val2.lte(1) ? DEC(1) : DEC(1).plus(val2.log(DEC(val1)))
};
```

- Runaway numbers.
  The 2024 build had multiplier cascades that jumped hundreds of orders of magnitude in seconds and then stalled in World 2, and an engine cap that silently threw away every multiplier above 1e30.
  Version 0.9.0 removed the cap and rebuilt production so that each order of magnitude takes a little longer to reach than the last, instead of less.

- Offline progress.
  Idle gains have to account for autobuying, unlocks and compounding production.
  The catch-up runs the same tick as live play, in steps sized so that power level and income move about the same amount each step: long steps while little changes, short ones while income climbs, anywhere from 1 second to an hour.
  It hands control back to the browser every 50 milliseconds so a progress bar can draw, and a Finish faster button takes coarser steps.
  Eight hours offline on a late save used to take 276 seconds to process; it now takes 7.5.

- Saving state.
  With 20+ kinds of feature (trainings, zones, artifacts, skills and more), saving and loading needed clean separation.
  Each kind has its own state module, 27 in all, most with their own schema version, and a central StateManager runs them, migrates older saves forward, and backs up a save it cannot read instead of overwriting it.
  Only what can't be recomputed is saved, such as levels, flags and conquest progress; everything derived from it is recomputed on load, which made saves about 55% smaller.
  What each rebirth tier resets is decided in one registry that lists every saved category and the tier that wipes it, and a category missing from it is an error, so a new feature cannot be wiped or kept by accident.

## Outcomes

It took the better part of a year, and I released it in March 2024.
Reviews were mixed, and the negative ones were almost all about balancing.
The praise was for the gameplay, and players logged a lot of hours on a couple of incremental game sites: by November 2026 galaxy.click alone counted about 18,000 plays and 16,000 hours.

Version 0.9.0, in October 2026, was the first update since July 2024, and it included a full balancing pass.
It rebuilt production and rebirth gains, fixed calculation bugs such as the 1e30 cap, shipped the second and third rebirth tiers and the Divine realm, and gave Worlds 4 to 13 real costs.
Four patches followed within eight days, 0.9.1 to 0.9.4, working through player reports going back to March 2024.
Saves from the 2024 build still load.

The modifier system handles hundreds of active modifiers, targeted by type (for example `allTrain` or `forceTrain`) and calculated by priority, without circular dependencies.
Purchases made in one tick are batched, so an autobuy tick that buys 50 things rebuilds each affected modifier list once instead of 50 times.
An EventManager (the observer pattern) keeps the UI and the game logic loosely coupled.
Content lives in 20 JSON files, and most costs and production rates come from formulas in one balance file, so one coefficient retunes a whole category instead of hundreds of rows.
Separating what gets saved from how it gets saved made it simpler to add new features to the save system.

A bot that plays the real game code by fixed rules measures pacing, and it clears all 1,310 zones in about 24 simulated hours.
It plays worse than an engaged player: one finished 0.9.0 in 9 hours.

## Limits

- It still needs balancing.
  The Star Forge, the last upgrade track of the third rebirth tier, still runs on placeholder numbers.
- The late game does not change strategy.
  After a big jump in World 3 it comes down to timing rebirths with everything automated.
  That is the sharpest recent complaint, and the 0.9 fixes moved the galaxy.click rating only from 3.1 to 3.2.
- The content ends partway through World 13.
  Its last three regions and World 14 are not written; beating the last boss shows an ending that says so, and whether to finish them is undecided.
- Saves live only in the browser.
  There is no cloud save, so clearing the site's data loses the game unless you exported a save first.

## Implementation Notes

### Architecture Pattern

The Game class is a mediator that coordinates everything else:

```
Game (mediator, game loop)
├── EventManager (observer pattern)
├── GameManager (logic, one tick)
│   ├── GameContent (all features and currencies)
│   ├── UnlockManager (progression gates)
│   ├── AutomationManager (autobuy, auto-conquest, auto-tournament)
│   └── RankManager (level milestones)
├── Builder (builds every feature from JSON and the balance formulas, once at boot)
├── StateManager (saves, loads, migrations)
│   └── 27 state modules
├── OfflineManager (catch-up after the tab was closed)
└── GameUI (presentation)
```

### Content and Balance

Game content is defined in JSON, so a new zone, artifact or upgrade is a new data entry with its name, description and place in the graph.
Costs and production come from formulas in `BalanceConfig.js` for every kind of feature except two, whose hand-tuned curves don't fit one formula yet and still take their numbers from the JSON:

```javascript
// BalanceConfig.js (excerpt)
useFormulaOverrides: {
  trainings:        true,
  forgeUpgrades:    true,
  radianceUpgrades: true,
  artifacts:        true,
  fighters:         true,
  zones:            true,
  essenceUpgrades:  true,
  godhoodUpgrades:  true,
  lifeNodes:        true,
  cosmicUpgrades:   true,
  starForgeStructures: true,
  generators:       false,   // wisdom chain: 1 → 100 → 1e6 → 1e20 → 1e25 (non-geometric jumps)
  realmUpgrades:    false,   // Force realm: 50 → 1e5 → 5e5 → 1e7 → 1e9 (×2000 jump at upgrade 2)
},
```

### ID Range System

Each feature type has its own ID range, so IDs never collide:

- Realms: 10-40
- Generators (Wisdom and Divine): 611-715
- Trainings: 1001-1005 (Force) and 2001-2005 (Energy)
- Skills: 40001+
- Zones: 90001+
- Rebirth 1 upgrades: 100001+
- Rebirth 2 and 3 upgrades: 130001+ and 140001+
- Their late upgrade tracks, the Life Tree and the Star Forge: 150001+ and 160001+
