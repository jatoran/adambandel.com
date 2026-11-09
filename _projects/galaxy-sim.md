---
title: Galaxy Sim
summary: A space strategy simulation that plays itself, with AI factions colonizing, researching, fighting and making alliances across a generated galaxy
started: 2025-05-19
updated: 2026-01-05
type: game
github: https://github.com/jatoran/galaxy-sim
stack:
  - Python
  - Pygame
  - Custom ECS
tags:
  - ai
  - game-dev
  - simulation
loc: 8672
files: 50
---

## Overview

Galaxy Sim is a 4X space strategy simulation (explore, expand, exploit, exterminate) in which 10 AI-controlled factions compete for a procedurally generated spiral galaxy.
Each faction runs itself through a set of AI modules that cover colonization, fleet movement, combat, diplomacy, research and the economy.

The simulation runs in real time, and Pygame draws the galaxy map with faction territory, fleet movements and battles.
There is no player.
Everything that happens comes from the factions' own decisions, so it is closer to a galaxy-scale civilization simulation that runs itself than to a game you play.

## Screenshots

<!-- SCREENSHOT: Galaxy overview showing spiral arm distribution with multiple colored faction territories, fleet icons in transit, and the sidebar UI panel -->
![Galaxy Overview](/images/projects/galaxy-sim/screenshot-1.png)

<!-- SCREENSHOT: Close-up of a contested border region showing fleet combat, system ownership changes, and defense structure icons -->
![Combat and Expansion](/images/projects/galaxy-sim/screenshot-2.png)

<!-- SCREENSHOT: Late-game state showing dominant faction expansion with eliminated factions and remaining contested territories -->
![Late-Game Dominance](/images/projects/galaxy-sim/screenshot-3.png)

## Problem

Traditional 4X strategy games use scripted AI, and it gets predictable after a few playthroughs.
I wanted to find out whether splitting the AI's decisions across specialized subsystems, each responsible for one area, would produce faction behavior that is more emergent and more interesting.
The goal was a simulation that stays unpredictable enough to be worth watching.

## Approach

The main architectural decision was to split strategy into independent AI modules that report to a central orchestrator, instead of building one monolithic decision engine.

### Stack

- Python 3.12, chosen for fast prototyping and dataclasses
- Pygame for drawing the galaxy, fleet movements and combat in real time
- A custom Entity Component System (ECS), built for spatial queries and cache efficiency
- JSON files that define the ships, structures, technologies and factions

### Architecture

The game uses the Entity Component System pattern.

- Entities are integer IDs for star systems and fleets.
- Components are dataclasses (Position, Fleet, Owner, StarSystem) stored in contiguous arrays.
- Systems run each frame or turn on the entities that have the components they need.

The AI splits its decisions across five modules (empire, military, economy, research and diplomacy), which all report to the orchestrator; the diagram shows four of them.

```
┌─────────────────────────────────────────────────┐
│              AI Orchestrator                     │
│  (Merges proposals, applies resource constraints)│
└─────────────────────────────────────────────────┘
         ▲           ▲           ▲           ▲
         │           │           │           │
    ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
    │ Empire  │ │Military │ │Economic │ │Research │
    │   AI    │ │   AI    │ │   AI    │ │   AI    │
    └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

Each module proposes actions in its own area.
The orchestrator drops what the faction can't afford, resolves conflicts between proposals, and sets the order they run in.

### Challenges

- Coordinating the modules. At first they proposed conflicting actions, for example the economic AI building farms while the military AI needed ships. The fix was a priority queue in the orchestrator with resource reservation, so higher-priority actions claim resources first.
- Combat balance. Early combat was deterministic and boring. I added synergy (scouts raise destroyer damage), force-ratio multipliers (a much larger force deals bonus damage) and siege-style attrition over several rounds, so battles don't all go the same way.
- Performance. Checking the distance between every fleet and every system is O(n²), and it stuttered with 40+ systems. Sector-based spatial indexing in `SpatialManager` made proximity lookups O(1).
- Telling factions apart. Ten factions needed more than ten colors. Each one has personality traits (aggressiveness from 0 to 1.0, defensiveness, expansion_desire), economic modifiers (extraction multiplier, population growth) and preferred research paths, and those change how it behaves.

## Outcomes

Factions form alliances against whichever faction is dominant, switch to wiping out rivals once they have an overwhelming advantage, and change where they expand based on threats at their borders.
The simulation rarely plays out the same way twice.

Splitting the AI into specialized modules made it easier to tune and debug than one monolithic decision tree.
Systems pass messages over an event bus instead of calling each other; a fleet arriving at a system, for example, triggers a combat check.
Defining ships, structures and factions in JSON made balancing changes much faster.

## Implementation Notes

The ECS keeps the most frequently used components in arrays, for cache efficiency:

```python
class ECSManager:
    def __init__(self):
        self._positions: list[PositionComponent | None] = []
        self._fleets: list[FleetComponent | None] = []
        self._movements: list[MovementComponent | None] = []
        self._live_fleets: set[int] = set()  # O(n) iteration without scanning
```

Combat damage includes the synergy bonus and the force-ratio multiplier:

```python
def calculate_synergy_bonus(attacker_fleet: dict) -> float:
    scouts = attacker_fleet.get("scout", 0)
    destroyers = attacker_fleet.get("destroyer", 0)
    if scouts > 0 and destroyers > 0:
        return 1.0 + min(scouts / destroyers, 0.3)  # Up to 30% bonus
    return 1.0
```

The galaxy is procedurally generated along spiral arms:

```python
for i in range(num_systems):
    arm_index = random.randint(0, spiral_arms - 1)
    base_angle = (2 * math.pi / spiral_arms) * arm_index
    t = random.random()
    radius = (t ** 0.8) * max_radius  # Denser toward center
    theta = base_angle + arm_spread * t * 2 * math.pi
```
