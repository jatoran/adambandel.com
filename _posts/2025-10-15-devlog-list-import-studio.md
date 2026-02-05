---
title: Devlog - List Import Studio
date: 2025-10-15
project: list-import-studio
---

## What I'm building

**List Import Studio**: a node-based workflow builder for list cleaning + importing contacts/companies into our database, without accidentally **overriding** good data or **duplicating** records.

## The pain this is solving

A huge chunk of my work is taking messy lists and doing the unglamorous stuff:

* matching + de-duping
* normalization + formatting
* making sure the import doesn't stomp on something it shouldn't

There are plenty of tools for this (and yeah, there are probably "better" ones), but I specifically wanted a **node-based flow** so the logic is explicit and reusable.

## Core idea: "attach -> compare -> transform"

The workflow is basically:

1. **Attach a data source** (your incoming list)
2. **Compare it against existing/other attached sources**
3. **Normalize + run complex conditionals** (against existing data, or multiple inputs)
4. **Match / combine / join / break / transform** data as needed - extensively, elaborately, the whole deal.

## The "this is the point" feature: saveable patterns

On top of all the transforms, you can **save these patterns** and rerun them.
So if you have a workflow you do often, you just load that profile and run the same pipeline again instead of reinventing it every time.

## Why this matters in real life: trade show lead imports

Trade show lead imports are the perfect example of why this needs to exist:

* you do them repeatedly (sometimes multiple times a month)
* every event exports differently
* lead scanners vary
* sales reps' formats and notes vary
* sometimes the event gives you a ton of fields, sometimes basically nothing

So there's endless variation, but also tons of repeatable boilerplate. This system is meant to lock down the boilerplate so the variation doesn't wreck you.

## Current status / outcome

I use it consistently. It's **very robust**, and it saves me **hours** on every list I have to upload.
