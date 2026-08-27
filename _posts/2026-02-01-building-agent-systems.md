---
title: Building Agent Systems That Don't Collapse
date: 2026-02-01
project: agent-thunderdome
---

Agent Thunderdome is a grid simulation where LLM-driven agents wander a procedurally generated map, run into each other, and fight verbal duels judged by a referee model. The premise is silly on purpose. The useful part is that it forced me to handle every way an LLM agent system falls apart, at a scale small enough that I could actually watch it happen.

## Almost every failure is the model returning something you didn't plan for

Not "the model gave a bad answer." The model gave an answer the code couldn't use.

Agent actions have to come back as parseable commands: MOVE, ATTACK, WAIT. Models do not reliably do this. So actions get parsed with regex, retried on failure, and fall back to WAIT if the retry also fails. WAIT is the important part. There has to be a legal default, because an unusable response is a normal occurrence, not an exception worth halting over.

The referee had the same problem in a different costume. It has to pick a winner. It is explicitly told that DRAW is not an option. It will still occasionally return a draw, or something unparseable. So there's a fallback that assigns the winner at random. That feels like cheating, and it isn't. The alternative is a simulation that stops because a language model got diplomatic.

The rule that came out of this: every LLM call needs a defined behavior for the case where the response is unusable, and you pick it in advance. If you don't pick one, you've picked "crash."

## Keep the non-LLM parts boring

Map generation is deterministic and validates itself. After generating terrain it runs a BFS reachability check to guarantee every floor tile belongs to one connected component, so nothing can spawn somewhere it can't leave.

That's not clever, and that's the point. The simulation core is a plain state machine, and the LLM is the only source of nondeterminism anywhere in the system. When something goes wrong you immediately know which half to look at, and you can replay a scenario without the world itself shifting underneath you.

The moment your world logic is also probabilistic, you don't have a system you can debug. You have a slot machine you can watch.

## If you can't see it, it isn't real

Everything streams to the browser over Server-Sent Events: state changes, agent decisions, battle rounds, referee rationale. The full simulation state gets serialized out, with change detection so it isn't repeating itself for no reason.

SSE instead of WebSockets because the traffic only goes one direction and I didn't need the complexity of the other option. This is the recurring thing with agent systems. You can't infer what happened from the final state, because the final state is the end of a chain of decisions, most of which looked reasonable in isolation. Watching the agents think in real time turned debugging from archaeology into observation.

## What it demonstrated

Personality is real, and it lives in the system prompt. Agents with different system prompts produce distinctly different combat styles, and the battle theme feature lets you push that hard: every remark must be a pirate insult, every agent speaks in haiku. It works better than it has any right to.

Sequential context matters more than I expected. A responder that knows what its opponent just said produces a coherent exchange. Generate both in parallel and you get two monologues that happen to be adjacent.

And simple validate-and-retry absorbs most LLM unpredictability. Most, never all, which is why the fallback exists at all.

## Next

Better agent memory, and a more sophisticated battle system. The constraint is keeping the architecture this clean while adding to it, because that separation is the only reason any of this was debuggable in the first place.
