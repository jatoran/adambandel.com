---
title: "Devlog: Gallery of Conceptual Lenses"
date: 2025-11-26
project: gallery-of-conceptual-lenses
---

I spent a chunk of a day digging into prompt engineering and modern research: basically, *how do you get better results from a model?*

That immediately turned into a side-quest: **how do you extend the model's "horizon"**—not by asking harder, but by getting it to explore *more of what it could plausibly access*.

## The "latent space" rabbit hole (and the problem)

When you send a prompt to an LLM, you're lighting up particular associations—neurons, connections, hidden-layer pathways—based on how your prompt relates to everything the model has learned.

That's usually great: it's efficient, it stays on-topic, it gives you the "reasonable" answer to the thing you asked.

But if you want the model to be **more creative**, the core question becomes:
**How do you get it to search wider—into regions it wouldn't normally touch?**

## The idea

I'm calling it a **Gallery of Conceptual Lenses**.

A "lens" is a frame of thought: a philosophy, a discipline, a language, an objective—basically a handle that forces the model to approach the same prompt from a different angle.

So instead of "one prompt -> one default trajectory," you do:

**one prompt -> many intentionally distant trajectories**.

## How it works (mechanics)

Here's the mental model / algorithm as I'm currently thinking about it:

1. **Embed the prompt** into an embedding space (i.e., locate it in the "sea" of meaning).
2. **Pick a set of lenses** (philosophies / frames).
3. **Generate combinations** of lenses (example in my notes: if you pick four lenses, you build a "4x4 matrix" of combinations).

   * Example vibe: *Buddhism x JavaScript x Gravel x Sky* (yes, that kind of weird).
4. From those combinations:

   * Find the combo **closest to the prompt** (to stay anchored).
   * Then find combos that are **as far away from the prompt and from each other as possible** (to maximize spread across the space).
5. Now you've got **a set of far-separated "approach points"**—multiple ways into the same problem, deliberately distributed.
6. You tell the model: **answer using these distinct approaches**—each one pushes activation into a different region, which (in practice) tends to pull in more novel material.

## Why it's useful (what I'm seeing)

Once you do this, each lens-combo "activates" farther regions of the embedding space, so you get:

* more creativity,
* more weird cross-links,
* more usable brainstorming output,
* more chances of stumbling into a novel angle.

This has been a legit tool for "think outside the box" tasks and idea generation.

## Tradeoffs / known drawbacks

This probably makes the model **less focused**. I'm basically forcing it to explore, so drift is part of the deal.

So: not ideal if you need a tight, single answer. Great if you need a *spread* of approaches.

## Current one-line thesis

**Creativity via distance:** deliberately choose conceptual lenses that are far apart (and far from the prompt) to widen the model's search, then harvest the best results back toward the original intent.
