---
title: Agent Thunderdome
summary: LLM-powered agents battle in a grid world through verbal "Battle of Wits" confrontations judged by AI referee
date: 2025-04-14
---

## Overview

Agent Thunderdome is an experimental multi-agent simulation where LLM-powered entities autonomously navigate a procedurally generated grid world and engage in verbal confrontations. When two agents occupy adjacent cells, they enter a "Battle of Wits" - a multi-round exchange of witty remarks, insults, and intimidation judged by a separate LLM referee. The last agent standing wins.

The project explores emergent behavior from combining autonomous navigation, personality-driven decision making, and competitive verbal sparring - all powered by large language models. It features real-time visualization through a web interface that streams simulation state via Server-Sent Events.

<!-- SCREENSHOT: Main simulation view showing multiple colored agents on the terrain grid, with at least one agent in BATTLING state (orange indicator ring) -->
![Simulation Grid](/images/projects/agent-thunderdome/screenshot-1.png)

<!-- SCREENSHOT: Agent configuration panel expanded showing 3+ agents with custom names and personality prompts, plus the battle theme input field -->
![Agent Configuration](/images/projects/agent-thunderdome/screenshot-2.png)

<!-- SCREENSHOT: Battle log panel showing a complete battle with multiple rounds, including agent remarks, referee rationales, and final winner -->
![Battle Log](/images/projects/agent-thunderdome/screenshot-3.png)

## Problem

Traditional agent simulations use hardcoded behavior trees or simple rule systems that produce predictable, repetitive outcomes. I wanted to explore what happens when agents have genuine autonomy - the ability to reason about their situation, form strategies, and compete through natural language rather than deterministic combat mechanics.

The "Battle of Wits" mechanic was designed to create engaging, unpredictable encounters where victory depends on creativity and personality rather than stats.

## Approach

The simulation runs as a turn-based system where each agent queries an LLM to decide their next action based on their personality (system prompt) and current observations. A modular architecture separates concerns between state management, LLM interaction, battle processing, and visualization.

### Stack

- **Backend Framework** - FastAPI with async support for concurrent LLM calls and non-blocking SSE streaming
- **LLM Integration** - OpenRouter API with configurable models for actions, battle remarks, and referee judgments
- **Real-time Streaming** - Server-Sent Events (SSE) push state updates to the frontend without polling
- **Rendering** - PixiJS 2D canvas rendering for smooth grid and agent visualization
- **State Validation** - Pydantic models enforce data contracts between backend, frontend, and LLM responses
- **Configuration** - pydantic-settings for environment-based configuration with .env file support

### Challenges

- **LLM Response Parsing** - Agents sometimes produce malformed actions. Implemented regex-based parsing with retry logic that feeds validation failures back to the LLM, plus a WAIT fallback to prevent deadlocks
- **Referee Bias Prevention** - Initial prompts showed bias toward the second speaker in battles. Redesigned prompts to explicitly identify speaking order and require evaluation of both opener and responder quality
- **Cost Tracking** - Some models report zero cost via API. Added manual cost fallback using configurable per-token rates for accurate budget monitoring
- **Turn Coordination** - Managing concurrent battles while advancing the main turn loop required careful state machine design with distinct BATTLING state to exclude agents from normal turn processing

## Outcomes

The system successfully produces emergent behavior - agents develop distinct personalities based on their prompts, form spatial strategies, and create entertaining verbal exchanges. Battle remarks often reference previous rounds and opponent weaknesses, demonstrating contextual awareness.

Key learnings: Prompt engineering for consistent structured output is harder than expected. The separation of system prompts (personality) from user prompts (situation) proved essential for coherent agent behavior. SSE streaming provides a great UX for long-running simulations compared to polling.

## Implementation Notes

The core simulation loop delegates to specialized modules for maintainability:

```python
async def run_simulation_step_async(self):
    # 1. Process ongoing Battle of Wits encounters
    await battle_processor.process_ongoing_battles_step(self)
    
    # 2. Get next active agent (skips DEAD/BATTLING)
    agent = turn_manager.get_next_active_agent(self)
    
    # 3. Query LLM for agent's action decision
    await self._process_agent_turn(agent)
    
    # 4. Advance turn counter
    turn_manager.advance_to_next_turn(self)
```

Battle remarks use a sequential prompting pattern where the second speaker receives the first speaker's remark:

```python
# First speaker sets the tone
remark_first = await self.decision_component.get_battle_remark(
    agent=first_speaker, opponent=second_speaker, battle_log=battle_log
)

# Second speaker responds with context
remark_second = await self.decision_component.get_battle_remark(
    agent=second_speaker, opponent=first_speaker, 
    battle_log=battle_log, 
    opponent_current_remark=remark_first  # Enables direct responses
)
```

The referee LLM receives both remarks with speaking order clearly marked, and must select a winner (draws are rejected and forced to random selection to keep battles decisive).
