---
title: "Devlog: LCAV / Hellcats"
date: 2025-05-03
project: lcav
---

LCAV stands for LLM Code Analysis and Validation. I built it during the era when applying a model's output meant copying a large block of code, or an entire file, over the top of your existing code and hoping nothing quietly disappeared in the process.

## What it does

It parses Python and TypeScript, walks the code with an AST parser and some supporting tooling, and builds a map of relations and dependencies. Then you paste in a proposed change and it tells you what that change actually touches.

It auto-detects which files and functions are being modified based on what you pasted, then produces two views: a dependency graph and a text analysis, both at configurable granularity. Impact renders as a heat map, where red means this code was affected and the other colors mark different kinds of effect.

## What it catches

The failure modes of that workflow were all the same shape. The model silently drops a function. It drops your comments. It leaves out a variable or a constant. It forgets an import. It replaces something it had no business replacing.

Every one of those is invisible in a diff you're skimming at speed, and obvious in a dependency map.

## The tradeoff

It adds a step between generating code and applying it. You paste into the tool, read the analysis, then go back. That's real friction and I felt it every single time.

For a production codebase, or any codebase you intend to keep for years, I still think it's worth paying. The damage from this failure mode isn't a broken build you notice immediately. It's slow, silent degradation you find out about much later.

## Honest current status

I hardly use it. Models are pretty good these days.
