---
title: Galaxy Sim
summary: A 4X space strategy simulation featuring 10 AI factions with distinct personalities competing for galactic dominance through combat, diplomacy, and expansion.
date: 2025-05-19
github: https://github.com/jatoran/galaxy-sim
---

## Overview

Galaxy Sim is an autonomous 4X space strategy simulation where multiple AI-controlled factions compete for control of a procedurally generated galaxy. Unlike traditional strategy games, there is no human player - the entire simulation runs autonomously, showcasing emergent gameplay as AI empires expand, form alliances, wage wars, and adapt their strategies based on the evolving galactic situation.

The project serves as both a sandbox for AI decision-making experimentation and a visualization of complex multi-agent systems. Each faction operates with a unique personality that influences whether they prefer aggressive expansion, defensive fortification, or economic development.

## Screenshots

<!-- SCREENSHOT: Main galaxy view showing the spiral arm layout with colored star systems representing faction territories, fleet triangles in motion, and the side panel displaying faction rankings -->
![Galaxy overview](/images/projects/galaxy-sim/screenshot-1.png)

<!-- SCREENSHOT: Side panel expanded for a faction showing diplomatic relations, AI plan status, fleet counts, and system details with build queues -->
![Faction details panel](/images/projects/galaxy-sim/screenshot-2.png)

<!-- SCREENSHOT: Combat in progress - multiple fleet triangles converging on a contested star system with visible ownership change -->
![Fleet combat](/images/projects/galaxy-sim/screenshot-3.png)

## Problem

Most 4X game AI implementations are reactive and predictable - they follow scripted behaviors that players quickly learn to exploit. Real strategic depth requires AI that can:

- Assess threats dynamically and prioritize targets intelligently
- Form and break alliances based on shifting power dynamics
- Balance economic development against military expansion
- Recognize when they're dominant and press advantages, or when they're weak and need to consolidate

This project explores building AI systems that exhibit these emergent strategic behaviors without hardcoded decision trees.

## Approach

The simulation uses a layered architecture that separates concerns cleanly while allowing complex emergent behavior.

### Stack

- **Python 3.12** - Modern Python with type hints for cleaner AI logic and dataclasses
- **Pygame** - Real-time visualization of the galaxy, fleets, and faction territories
- **Entity Component System** - Custom ECS with spatial indexing for efficient queries across hundreds of entities
- **Event-driven Architecture** - Decoupled systems communicate via an event bus for fleet arrivals, combat resolution, and system captures

### Architecture

The AI operates through a multi-layer decision system:

```
AIOrchestrator
    |
    +-- EmpireAI (strategic planning)
    +-- MilitaryAI (fleet operations) 
    +-- EconomicAI (production/resources)
    +-- DiplomacyAI (alliances/threats)
```

Each layer proposes actions that the orchestrator merges, prioritizes by strategic context, and filters for resource feasibility.

### Challenges

- **Action Prioritization** - Solved by dynamic priority scoring based on the empire's current strategic plan. A faction in "expand" mode weights colony ship movements at 94 priority vs 80 for combat fleets, while an "invade_neighbor" faction inverts these.

- **Dominance Recognition** - Early versions had dominant factions stall because they saw no threats. Added strategic intelligence gathering that detects power ratios and triggers "overwhelming" or "dominant" modes with appropriately aggressive strategies.

- **Combat Balance** - Initial combat was too attritional, leading to endless stalemates. Implemented force ratio modifiers where 3:1 advantages grant 1.5x damage dealt and 0.5x damage received, making decisive victories possible.

- **Spatial Efficiency** - Naively iterating all entities for proximity checks scaled poorly. Implemented sector-based spatial bucketing that reduces fleet-to-system distance calculations from O(n*m) to O(bucket_size).

## Outcomes

The simulation successfully produces emergent strategic behavior:

- Factions form temporary alliances against dominant powers, then betray allies once the threat is eliminated
- Aggressive personalities like the "Imperium of Dominion" (aggressiveness: 1.0) consistently attempt military expansion while defensive factions like "Orion Confederacy" (defensiveness: 0.8) turtle and fortify
- Economic pressure from fleet maintenance forces factions to make strategic choices rather than building infinite armies
- Combat outcomes feel decisive - overwhelming force crushes defenders quickly, while evenly matched battles attrit both sides

The ECS architecture with spatial indexing handles 40+ star systems and 50+ fleets at 60 FPS without performance issues.

## Implementation Notes

### Strategic Intelligence Gathering

Each faction gathers comprehensive intelligence before making decisions:

```python
@dataclass
class IntelReport:
    our_strength: float = 0.0
    enemies: List[Tuple[str, float, int]] = field(default_factory=list)
    power_rank: int = 1  # 1 = strongest
    threatened_systems: List[int] = field(default_factory=list)
    weakly_defended_targets: List[Tuple[int, float, str]] = field(default_factory=list)
```

This enables nuanced decisions like "I'm rank 2 but my nearest enemy is weak - attack them before they ally with rank 1."

### Force Ratio Combat

Combat applies multipliers based on relative strength:

```python
def calculate_force_ratio_modifiers(attacker_strength, defender_strength):
    ratio = attacker_strength / max(1, defender_strength)
    if ratio > 3.0:
        return {"attacker_damage_mult": 1.5, "defender_damage_mult": 0.5}
    elif ratio > 2.0:
        return {"attacker_damage_mult": 1.3, "defender_damage_mult": 0.7}
    # ... graduated scale
```

### Faction Personality System

Ten factions with distinct strategic profiles defined in JSON:

```json
{
  "id": "imperium_of_dominion",
  "personality": {
    "aggressiveness": 1.0,
    "defensiveness": 0.2,
    "expansion_desire": 0.6
  }
}
```

These values directly influence AI decision weights, creating genuinely different playstyles across factions.
