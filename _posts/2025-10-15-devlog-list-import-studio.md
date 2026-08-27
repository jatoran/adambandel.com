---
title: Devlog - List Import Studio
date: 2025-10-15
project: list-import-studio
---

A large part of my job is taking messy lists of contacts and companies and getting them into our database without breaking anything. That means matching, deduplication, normalization, and formatting, and it means being certain the import isn't overwriting something good or creating a second copy of a record that already exists.

There are plenty of tools for this and some of them are probably better than mine. I wanted a node-based flow specifically, because I wanted the logic visible and reusable instead of buried in a script I'd have to reread every time I ran it.

## How it works

Attach a data source. Compare it against existing data and against the other sources you've attached. Normalize, then run conditionals, which can get complex and can reference either the existing records or the other incoming ones. From there you match, combine, join, split, and transform as far as the data needs you to go.

## The feature that justifies the whole thing

You can save a pattern and rerun it. Once a workflow is something you do regularly, you load that profile and run the same pipeline instead of rebuilding the logic from memory.

Trade show leads are the case that makes this obvious. If your company does shows several times a month, you're repeating the import constantly, and every single one arrives differently. The lead scanner exports change. The sales reps' formats change, and so does the way each of them takes notes. The event might hand you a rich dataset or almost nothing at all.

So the variation is endless, but the boilerplate wrapped around it is identical every time. Locking down the boilerplate is the entire point, so the variation is the only thing left that needs thought.

## Status

I use it consistently. It's robust, and it saves me hours on every list I have to upload.
