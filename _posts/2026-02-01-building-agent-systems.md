---
title: Building Agent Systems That Don't Collapse
date: 2026-02-01
project: agent-thunderdome
discussions:
  - name: "Lobsters"
    url: "https://lobste.rs/s/example"
  - name: "Hacker News"
    url: "https://news.ycombinator.com/item?id=87654321"
---

Lessons learned from building Agent Thunderdome: separating concerns, making state observable, and why testing LLM behavior is harder than it should be.

## The Problem with LLM Agent Systems

Most LLM agent demos look impressive but collapse under real usage. The core issue? They mix concerns, hide state, and make debugging nearly impossible.

## What I Learned

### 1. Separate Decision Making from Execution

Your LLM should produce structured decisions, not execute them directly. This makes testing possible and bugs reproducible.

```python
# Bad: LLM produces and executes
response = llm.call("What should the agent do?")
execute(response)  # Hope it works!

# Good: LLM produces structured output
action = llm.call_with_schema("What should the agent do?", ActionSchema)
execute(action)  # Validate first, execute second
```

### 2. Make State Observable

Stream everything. State changes, LLM calls, costs, errors. If you can't see it, you can't debug it.

In Agent Thunderdome, I used Server-Sent Events to stream every state change to the browser. This made debugging trivial - I could watch agents think in real-time.

### 3. Use Deterministic Core Logic

Your world simulation should be deterministic. Only the LLM should be non-deterministic. This lets you replay scenarios and write actual tests.

## The Architecture That Worked

- **Simulation Core:** Pure, deterministic state machine
- **Decision Layer:** LLM calls with structured schemas
- **Execution Layer:** Validates and applies actions
- **Observation Layer:** Streams everything to clients

This separation makes the system testable, debuggable, and maintainable.

## Next Steps

I'm working on making the battle system more sophisticated and adding better agent memory. The key is keeping the architecture clean while adding features.
