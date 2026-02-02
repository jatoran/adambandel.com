---
title: Galaxy Sim
summary: 4X space strategy simulation with multi-layer AI factions competing for galactic dominance
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

Galaxy Sim is a 4X (eXplore, eXpand, eXploit, eXterminate) space strategy simulation where 10 AI-controlled factions compete for galactic dominance. Each faction operates autonomously through a sophisticated multi-layer AI system, managing colonization, fleet movements, combat, diplomacy, research, and economic development across a procedurally generated spiral galaxy.

The simulation runs in real-time with a Pygame visualization layer, rendering the galaxy map with faction territories, fleet movements, and combat encounters. What makes this project unique is its focus on emergent gameplay through complex AI decision-making rather than player input—it's essentially a galaxy-scale civilization simulation that runs itself.

## Screenshots

<!-- SCREENSHOT: Galaxy overview showing spiral arm distribution with multiple colored faction territories, fleet icons in transit, and the sidebar UI panel -->
![Galaxy Overview](/images/projects/galaxy-sim/screenshot-1.png)

<!-- SCREENSHOT: Close-up of a contested border region showing fleet combat, system ownership changes, and defense structure icons -->
![Combat and Expansion](/images/projects/galaxy-sim/screenshot-2.png)

<!-- SCREENSHOT: Late-game state showing dominant faction expansion with eliminated factions and remaining contested territories -->
![Late-Game Dominance](/images/projects/galaxy-sim/screenshot-3.png)

## Problem

Traditional 4X strategy games rely on scripted AI behaviors that become predictable after a few playthroughs. I wanted to explore whether decomposing AI decision-making into specialized subsystems—each with its own domain expertise—could produce more emergent and interesting faction behaviors. The goal was to create a simulation where watching AI factions compete would be genuinely unpredictable and engaging.

## Approach

The core architectural decision was separating strategic concerns into independent AI modules that communicate through a central orchestrator, rather than building a monolithic decision engine.

### Stack

- **Python 3.12** - Primary language, chosen for rapid prototyping and dataclass support
- **Pygame** - Real-time visualization of galaxy state, fleet movements, and combat
- **Custom ECS** - Entity Component System architecture optimized for spatial queries and cache efficiency
- **JSON Configuration** - Data-driven design for ships, structures, technologies, and faction definitions

### Architecture

The game uses an **Entity Component System** pattern where:
- Entities are integer IDs representing star systems and fleets
- Components are dataclasses (Position, Fleet, Owner, StarSystem) stored in contiguous arrays
- Systems operate on entities with specific component combinations each frame/turn

The AI architecture splits decision-making across five specialized modules:

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

Each sub-AI proposes actions within its domain. The orchestrator filters by affordability, resolves conflicts, and prioritizes execution.

### Challenges

- **AI Coordination** - Initially, sub-AIs would propose conflicting actions (e.g., EconomicAI wants to build farms while MilitaryAI needs ships). Solved by implementing a priority queue in the orchestrator with resource reservation, letting higher-priority actions claim resources first.

- **Combat Balance** - Early combat was deterministic and boring. Added synergy mechanics (scouts boost destroyer damage), force ratio multipliers (overwhelming force deals bonus damage), and siege-style multi-round attrition to create more dynamic engagements.

- **Performance at Scale** - O(n²) distance checks between fleets and systems caused stuttering with 40+ systems. Implemented sector-based spatial indexing in `SpatialManager` for O(1) proximity lookups.

- **Faction Differentiation** - Making 10 factions feel distinct required more than just different colors. Each faction has personality traits (aggressiveness 0-1.0, defensiveness, expansion_desire), economic modifiers (extraction multiplier, population growth), and preferred research paths that meaningfully affect their behavior.

## Outcomes

The multi-layer AI architecture produces genuinely emergent behavior. Factions form opportunistic alliances against dominant powers, recognize when they have overwhelming advantage and switch to aggressive elimination strategies, and adapt their expansion patterns based on border threats. The simulation rarely plays out the same way twice.

Key technical insights:
- **Decomposition pays off** - Specialized AI modules are easier to tune and debug than monolithic decision trees
- **Event-driven communication** - Using an event bus for inter-system messaging (e.g., fleet arrival triggers combat check) kept systems decoupled and testable
- **Data-driven design** - Defining ships, structures, and factions in JSON made balancing iterations much faster

## Implementation Notes

The ECS uses array-based storage for frequently accessed components to maximize cache efficiency:

```python
class ECSManager:
    def __init__(self):
        self._positions: list[PositionComponent | None] = []
        self._fleets: list[FleetComponent | None] = []
        self._movements: list[MovementComponent | None] = []
        self._live_fleets: set[int] = set()  # O(n) iteration without scanning
```

Combat calculates damage through synergy bonuses and force ratio multipliers:

```python
def calculate_synergy_bonus(attacker_fleet: dict) -> float:
    scouts = attacker_fleet.get("scout", 0)
    destroyers = attacker_fleet.get("destroyer", 0)
    if scouts > 0 and destroyers > 0:
        return 1.0 + min(scouts / destroyers, 0.3)  # Up to 30% bonus
    return 1.0
```

The galaxy is procedurally generated using spiral arm distribution:

```python
for i in range(num_systems):
    arm_index = random.randint(0, spiral_arms - 1)
    base_angle = (2 * math.pi / spiral_arms) * arm_index
    t = random.random()
    radius = (t ** 0.8) * max_radius  # Denser toward center
    theta = base_angle + arm_spread * t * 2 * math.pi
```
