---
title: "Devlog: LCAV / Hellcats"
date: 2025-05-03
project: lcav
---

## TL;DR

I built a **"LLM code analysis + validation"** tool back when the workflow was basically: *copy/paste huge blocks of code (or whole files) and pray the model didn't quietly delete something important.*

## What this thing is

A system that ingests proposed changes (Python / TypeScript, etc.), parses the code, and produces a **dependency-impact view** so you can see what the change would break--or subtly mutate--across the codebase.

## Core idea

Instead of trusting vibes, it uses an **AST parser + supporting tooling** to build a **map of relations/dependencies**, then surfaces impacts as:

* a **heat map** (red = "this got affected," other colors = other kinds of effects),
* plus additional analysis so you can scan what's at risk.

## How the workflow works

1. You paste in a proposed change.
2. It **auto-detects which files / functions are being changed** based on what you pasted.
3. It generates:
   * a **graph** (impact/dependency view)
   * and **text analysis**, with configurable granularity.

## What it's good at catching (the "LLM betrayal" checklist)

It's basically a detector for the classic failure modes:

* dropped functions
* dropped comments
* missing variables/constants
* forgotten imports
* replacements that absolutely should not have happened

## The tradeoff (why it's not always on)

It adds friction: an extra step between "LLM generates code" and "you apply code," because you're pasting into this tool, reading the analysis, then going back. Cumbersome--but for **production / critical codebases**, it's a legit safety net against slow, silent degradation.

## Current status / honest usage

I barely use it now. Models are... honestly pretty good these days.
