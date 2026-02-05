---
title: "Devlog: Genesis of Code Context Builder"
date: 2025-08-15
project: code-context-builder
---

When I first got heavily into AI coding (around the early GPT-4 era), the models could already write competent little snippets. Then the tools/model context windows got bigger, and suddenly we weren't talking about "here's a function" — we were talking about "here are several hundred-line files" and multi-file edits. That's when the real problem showed up: if you want accurate multi-file output, you have to feed the model the *actual* context.

Back then, that meant the chat interface. No real CLI ecosystem yet. You either pasted context, or you suffered.

## Phase 0 — "Stop manually copy/pasting file-by-file"

At first, I wrote basic scripts to grab my codebase and concatenate it so I could paste it into a model without walking the repo file-by-file like a caveman.

That quickly evolved.

## Phase 1 — Code_Formatter (the first real tool)

This became a tool I called **Code_Formatter** — basically: "show me the code tree, let me filter it, and output clean context."

Key capabilities:

- Visualize the code file tree.
- Ignore patterns + allow patterns (so you don't ingest `node_modules` and 9,000 other useless files).
- Selectively include folders/files.
- Output the repo with **markdown headers** based on folder nesting so the model actually understands structure.
- Also generate a clean markdown "spiral/spial tree" of the project.

Result: I could iterate fast. On good runs, I'd get **3–7 full code files** back (sometimes thousands of lines total), slot them in, and the change was basically done. This was *the* way to leverage big context windows through chat — feed 50k–100k tokens and get real multi-file output.

I used this version for ~6 months. It was a basic Python/Tkinter UI with some nice bells and whistles (like token counting), but it wasn't exactly clean or polished.

## Phase 2 — PDK (Prompt Development Kit): ambitious, powerful… too cumbersome

Next I built **PDK** ("prompt and development kit"): a node-based prompt system where you could chain predefined prompts together with global/local variables, so you could reuse workflows by swapping values instead of rewriting prompts.

What it was good for:

- Managing a library of prompts I wanted to remember.
- Building hierarchical prompt chains (some legitimately complex).
- Supporting coding + documentation generation workflows.
- Feeding code context from Code_Formatter into tuned prompts that formatted everything nicely (XML/markdown structured for model comprehension).

Reality check:

- It was useful sometimes, but overall **too cumbersome**.
- I never released it (or Code_Formatter).
- I spent *months* refining it, adding hotkeys, note tools, and eventually embedding the formatter inside it.

PDK was also my first time working with **Tauri** because I wanted cross-platform + sharable — this was one of the first things I thought I might actually release. I didn't. I just kept iterating for myself.

The real issue: once you actually code a lot, you don't reuse the same prompts forever. Every project is different, every day is different, and models shift. Prompt workflows are cool in theory, but the *utility* I kept reaching for wasn't the node canvas — it was the context tooling.

So I extracted the part that mattered.

## Phase 3 — Code Context Builder (the thing that actually stuck)

I pulled the formatter out of PDK, modularized it, and renamed it: **Code Context Builder**. Standalone Tauri app. This became the tool I actually used for the next ~year and a half.

What it did (the "this is why I kept it" list):

- Fast scanning + token counting built-in.
- Folder collapse UI.
- Ignore patterns, plus pre/post prompts (prepend/append).
- Output formatted as markdown/XML (whatever the workflow needed).
- "Sophisticated traversal" (i.e., not dumb concatenation anymore).
- Auto-update behavior: it tracked when code changed, flagged when the scan was outdated, and pushed you to rescan before you copy/paste stale context.
- Efficient scanning using file hashes + modified times.
- The only "heavy" part was rendering absurdly large context panes (e.g., 300k tokens) because at that size, even showing it in a viewer takes a second.

Net effect: paired with hotkeys, I could iterate insanely fast and use top models in chat interfaces without needing Cursor or early CLI tools (which, at the time, weren't as good as they are now). I genuinely think a lot of people would have benefited from a tool like this, because I don't know how anyone was functioning without one.

## Where it sits now (post-CLI era)

I still use it — just not primarily for coding anymore.

Current use case:

- Copying personal/work notes and attaching *exactly* the right context to prompts/workflows.
- Because you can't always trust a CLI tool to discover the right context automatically, and sometimes manual selection is still the correct move.

Occasionally I'll still use it to feed code into non-CLI high-end tools, but the "core coding era" of it has mostly run its course. And yeah, eventually it probably gets eclipsed as CLI tooling becomes completely dominant.

## The meta take

Part of why I was so bullish on LLM coding early wasn't just "AI cool" — it was that I had a workflow that made it real. I could shove the right context in, get legitimate multi-file output back, and actually see the effect in minutes. The tool itself was built with LLMs — I barely hand-coded it — but I absolutely understood the architecture while I was deep in it.

And in that era: if you didn't have a way to paste big, curated context into the chat interface, you basically couldn't iterate properly. That was the whole game.
