---
title: Agent God Action Simulator
summary: An ECS-based autonomous agent sandbox where LLM-driven NPCs dynamically generate and learn new abilities at runtime
date: 2025-01-01
github: https://github.com/titanmind/agent-god-action-simulator
---

## Overview

Agent God Action Simulator is a Python-based sandbox environment where autonomous AI agents make decisions, interact with each other, and dynamically expand their capabilities through an "Angel" system that generates new abilities in real-time. The project combines a lightweight Entity-Component-System (ECS) architecture with LLM-powered decision-making to create emergent behaviors in a tile-based world.

The core innovation is the Angel System: when an agent encounters a situation requiring a new capability, it can request the Angel to either retrieve a pre-built ability from a curated vault or generate entirely new Python code via an LLM. This creates a simulation where agents genuinely evolve their skillsets based on environmental pressures.

## Screenshots

<!-- SCREENSHOT: Main simulation view showing the tile-based world with multiple agents (colored sprites) moving on a grid with resource nodes (ore/wood/herbs) visible -->
![Simulation World View](/images/projects/agent-god-action-simulator/screenshot-1.png)

<!-- SCREENSHOT: Terminal output showing an agent requesting ability generation from the Angel System, with the LLM prompt and generated ability code visible -->
![Angel System Ability Generation](/images/projects/agent-god-action-simulator/screenshot-2.png)

<!-- SCREENSHOT: CLI interface with debug overlay showing camera position, entity count, tick counter, and FPS metrics -->
![Debug Overlay and CLI](/images/projects/agent-god-action-simulator/screenshot-3.png)

## Problem

Traditional game AI relies on hand-crafted behavior trees and predefined abilities, limiting emergent gameplay. This project explores a fundamental question: **what happens when AI agents can request and receive new capabilities on-demand?**

The goal is to create a testbed for studying emergent behavior in LLM-powered agents, where the simulation remains deterministic for replay/debugging while still allowing genuine runtime code generation.

## Approach

The architecture separates concerns cleanly: an ECS core handles game state, multiple systems process different aspects of gameplay, and the LLM integration layer manages agent reasoning and ability generation.

### Stack

- **Python 3.12+** - Single-process monolith prioritizing simplicity over distributed complexity
- **Pygame** - Lightweight 2D rendering with procedurally generated sprites
- **Entity-Component-System** - Custom implementation with spatial indexing for efficient queries
- **OpenRouter/Gemini** - LLM integration for agent decision-making and code generation
- **YAML Configuration** - Declarative world setup, roles, and system parameters
- **asyncio + threading** - LLM worker pool runs async while game loop stays synchronous

### Challenges

- **World Pause Synchronization** - When the Angel generates abilities, the main tick loop pauses to prevent race conditions. Implemented timeout safeguards to auto-resume if generation stalls.

- **Dynamic Code Loading** - Generated ability files must be hot-loaded at runtime. Solved with importlib machinery and careful module registration in the AbilitySystem.

- **Deterministic Replay** - LLM responses are non-deterministic, so all prompts and responses are logged to a persistent event file, enabling replay of decision sequences for debugging.

- **Role-Based AI Gating** - Different NPC roles (creature, merchant, guard) have different LLM access levels. Some use behavior trees exclusively, others can request new abilities, creating a layered AI hierarchy.

## Outcomes

The simulation successfully demonstrates agents that:

- Make context-aware decisions using LLM reasoning about their perception and goals
- Request and receive new abilities when existing capabilities prove insufficient
- Learn from observing other agents use abilities (via PerceptionCache)
- Fall back to behavior trees when LLM access is disabled or unavailable

The architecture proves that runtime code generation for game entities is viable, though it requires careful sandboxing and validation. The conceptual testing step (where the Angel LLM reviews its own generated code) catches many issues before abilities are granted.

## Implementation Notes

The Angel System's code generation pipeline:

```python
def generate_and_grant(self, agent_id: int, description: str) -> dict:
    # 1. Check curated vault first
    vault_match = get_vault_index().lookup(description)
    if vault_match:
        self._grant_to_agent(agent_id, vault_match)
        return {"status": "success", "ability_class_name": vault_match}
    
    # 2. Build prompt with world constraints and scaffolds
    prompt = self._build_angel_code_generation_prompt(
        description,
        templates.get_world_constraints_for_angel(),
        templates.get_code_scaffolds_for_angel(),
    )
    
    # 3. LLM generates Python code
    stub_code = llm.request(prompt, self.world, model=llm.angel_generation_model)
    
    # 4. Conceptual testing - LLM reviews its own code
    if not self._conceptual_test_generated_code(stub_code, description):
        return {"status": "failure", "reason": "conceptual test failed"}
    
    # 5. Write to disk and grant
    path = angel_generator.generate_ability(description, stub_code=stub_code)
    self._grant_to_agent(agent_id, class_name)
```

Key ECS components that enable the AI layer:

- `KnownAbilitiesComponent` - Tracks which ability classes an agent can use
- `RoleComponent` - Defines LLM access (`uses_llm`), ability request permissions (`can_request_abilities`), and fixed starting abilities
- `AIStateComponent` - Holds goals, pending prompts, and the `needs_immediate_rethink` flag for post-Angel re-evaluation
- `PerceptionCacheComponent` - Caches visible entities and observed ability uses for prompt building
