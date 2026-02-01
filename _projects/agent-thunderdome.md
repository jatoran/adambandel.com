---
title: Agent Thunderdome
summary: Real-time multi-agent LLM simulation with FastAPI + PixiJS, streaming state via SSE and LLM-judged battles.
status: Active
date: 2025-09-29
github: https://github.com/jatoran/agent-thunderdome
---

## Overview

A real-time multi-agent LLM simulation with FastAPI + PixiJS. Agents move around a grid world, engage in "Battles of Wits" judged by an LLM referee, and stream state via Server-Sent Events. Built to explore modular architecture for agent systems and make LLM behavior observable.

## Technical Stack

- **Backend:** FastAPI, Python, httpx
- **Frontend:** PixiJS, Vanilla JavaScript
- **LLM Integration:** OpenRouter API
- **Streaming:** Server-Sent Events (SSE)

## Key Features

- Grid-based world simulation
- LLM-driven agent decision making
- Real-time state streaming to browser
- Battle system with LLM referee
- Token usage and cost tracking
- Modular, testable architecture

## Implementation Details

The system uses a FastAPI backend that orchestrates a grid-world simulation and streams state updates via Server-Sent Events to a PixiJS frontend. Agents receive structured observation context and produce actions via an LLM. When adjacent, agents enter a "Battle of Wits" where each generates remarks and an impartial LLM referee selects a winner with rationale.

## Challenges

- Action parsing with verbose LLM outputs
- Cost accounting when APIs report $0
- Preventing agent movement loops
- Ensuring connected spawn locations
- Managing async LLM calls efficiently
