---
title: Agent Thunderdome
summary: LLM-powered agents battle in verbal dueling matches judged by an AI referee in a real-time grid simulation
started: 2025-04-14
updated: 2025-04-15
type: web-app
stack:
  - Python
  - FastAPI
  - PixiJS
  - OpenRouter API
  - Server-Sent Events
tags:
  - ai
  - simulation
  - developer-tools
loc: 3924
files: 37
architecture:
  auth: none
  database: none
  api: REST
  realtime: SSE
  background: asyncio
  cache: in-memory
  search: none
---

## Overview

Agent Thunderdome is a real-time simulation platform where LLM-powered agents roam a procedurally generated grid, encounter each other, and engage in "Battles of Wits" - verbal dueling matches where agents trade witty remarks judged by an AI referee. Each agent has a customizable personality defined through system prompts, and an optional battle theme can influence all combat exchanges.

The application combines a FastAPI backend with a PixiJS-rendered frontend, streaming state updates via Server-Sent Events. It serves as both an entertaining demonstration of LLM agent interactions and a framework for exploring emergent AI behavior through competitive dialogue.

## Screenshots

<!-- SCREENSHOT: Main simulation view showing the grid with multiple colored agents, terrain tiles, and the agent legend panel on the right -->
![Simulation Grid](/images/projects/agent-thunderdome/screenshot-1.png)

<!-- SCREENSHOT: Battle history panel showing a complete wit battle with round-by-round remarks, winner indicators, and referee rationale -->
![Battle History](/images/projects/agent-thunderdome/screenshot-2.png)

<!-- SCREENSHOT: Agent configuration panel expanded, showing personality dropdowns, custom system prompts, and the battle theme input field -->
![Agent Configuration](/images/projects/agent-thunderdome/screenshot-3.png)

## Problem

Exploring LLM agent interactions typically requires complex multi-agent frameworks with steep learning curves. There was no simple, visual way to watch AI agents with distinct personalities interact dynamically, compete, and see how their system prompts translate into emergent behavior through structured verbal combat.

## Approach

The solution provides a lightweight simulation environment where agent behavior emerges from LLM responses to contextual prompts, with visual feedback through a browser-based grid interface.

### Stack

- **FastAPI** - Async Python backend handling simulation logic, LLM orchestration, and SSE streaming for real-time updates
- **PixiJS** - Hardware-accelerated 2D rendering for smooth grid visualization with colored agents and terrain
- **OpenRouter API** - Unified gateway to access various LLM models (defaults to Gemini Flash Lite) for agent decisions, battle remarks, and referee judgments
- **Pydantic** - Strict validation of agent configurations, battle payloads, and simulation state schemas
- **SSE (sse-starlette)** - Server-Sent Events for streaming continuous simulation updates without polling

### Challenges

- **Coordinated async LLM calls** - Battle remarks require sequential generation (first speaker, then responder with context). Solved using asyncio with proper state tracking to ensure conversation flow while maintaining UI responsiveness.

- **Ensuring LLM response validity** - Agent actions must be parseable commands (MOVE, ATTACK, WAIT). Implemented regex-based parsing with retry logic and fallback to WAIT action when LLMs produce invalid output.

- **Referee consistency** - The referee LLM must always choose a winner (no draws allowed). Added fallback logic that randomly assigns a winner if the LLM outputs invalid responses or explicitly says "DRAW".

- **Real-time state synchronization** - Frontend must reflect backend state changes immediately. Used SSE with JSON serialization of the complete simulation state, with change detection to avoid redundant updates.

## Outcomes

The simulation successfully demonstrates emergent personality-driven behavior where agents with different system prompts produce distinctly different combat styles. The battle theme feature allows creative experiments like "all remarks must be pirate insults" or "agents speak in haiku".

Key learnings:
- System prompts dramatically influence LLM output consistency and character
- Sequential context (knowing what opponent just said) produces more coherent exchanges
- Simple validation + retry patterns handle most LLM unpredictability
- SSE provides excellent real-time UX without WebSocket complexity

## Implementation Notes

Agent decisions are generated through a two-stage prompt system:

```python
# System prompt defines personality (from config)
system_context = agent.system_prompt

# User prompt provides situational context
user_context = self.observation_builder.build_observation_context(agent, failure_reason)

# LLM generates action response
llm_response_text, usage_data = await self.llm_interface.get_llm_response(
    user_prompt=user_context,
    system_prompt=system_context
)
```

Battle remarks incorporate the optional theme:

```python
if theme:
    user_prompt += f"\n**Overall Battle Theme:**\n{theme}\n"
```

The referee is explicitly instructed to never allow draws:

```python
prompt += """Based *only* on the remarks from *this round*, decide the winner. 
**You MUST choose one agent as the winner. DRAW is NOT an option.**"""
```

Terrain generation ensures connectivity through BFS reachability checks, guaranteeing all floor tiles form a single connected component.
