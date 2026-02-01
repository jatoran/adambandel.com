---
title: Making LLM Battles Deterministic
date: 2026-01-15
project: agent-thunderdome
---

How I made Agent Thunderdome's battle system reproducible despite using non-deterministic LLMs.

## The Challenge

LLM outputs are non-deterministic. Same prompt, different responses. This makes testing and debugging a nightmare:

- Can't reproduce bugs
- Can't write meaningful tests
- Can't compare changes

But I needed battles to be observable and debuggable.

## The Solution: Separate Concerns

### 1. Deterministic World State

The game world is a pure state machine:
- Grid positions
- Agent health
- Battle state
- Turn order

All deterministic. No randomness. Given the same actions, you get the same result every time.

### 2. Non-Deterministic Decisions

Only the LLM layer is non-deterministic:
- Agent movement choices
- Battle remarks
- Referee judgments

### 3. Record Everything

I log every LLM call with:
- Input prompt
- Output response
- Timestamp
- Model used
- Tokens and cost

This creates a paper trail. If something goes wrong, I can see exactly what the LLM said.

## Testing Strategy

Instead of trying to test LLM outputs directly, I test:

1. **Schema validation** - Does the LLM output match expected format?
2. **Fallback behavior** - What happens when LLM fails?
3. **State transitions** - Given action X, does state change correctly?

The world logic is fully tested. The LLM wrapper has schema tests. The integration is monitored, not tested.

## Replay System

I added a replay feature that can:
- Save entire battle sequences
- Replay them step-by-step
- Swap in different LLM responses to see outcomes

This lets me debug specific battles and compare different prompting strategies.

## Results

Battles are now:
- Observable (streamed state)
- Debuggable (full logs)
- Partially reproducible (deterministic world + logged LLM calls)

Not perfect, but way better than "pray and deploy."
