---
title: "Devlog: Genesis of Code Context Builder"
date: 2025-08-15
project: code-context-builder
---

I got heavily into AI coding right when GPT-4 came out. It could already write competent small snippets. Then the tools and the context windows got bigger, and somewhere around GPT-4 Turbo and o3 medium-high, plus Gemini Pro, the models stopped handing back a function and started handing back several hundred-line files. Which meant you could replace whole sections of your own code with model output, if the model actually understood the code.

That "if" was the entire problem. Accurate multi-file output required feeding in the real context, and feeding in the real context meant walking your repo file by file, deciding what mattered, and pasting each one into a chat window. There was no CLI ecosystem yet. You pasted or you suffered.

## Phase 0: stop copying files one at a time

I wrote basic scripts to grab the codebase and concatenate it so I could paste it in without going through the tree by hand. That's the whole idea. It evolved fast.

## Phase 1: Code_Formatter

The scripts turned into a tool I called Code_Formatter. Show me the file tree, let me filter it, give me clean context out the other end.

It could:

- visualize the code file tree
- take ignore patterns and allow patterns, so I wasn't ingesting node_modules and nine thousand other useless files
- selectively include folders and files
- organize output with markdown headers matching folder nesting, so the model got the project structure and not just a wall of code
- generate a clean markdown tree of the project

With it I could feed 50k to 100k tokens at once and get back three to seven full code files, sometimes thousands of lines total, slot them in, and the change was done. Other times just a targeted fix. Either way I had a way to move fast against the best models available, through the chat interface, which was the only interface that mattered then.

I used it for about six months. Python and Tkinter, with some nice bells and whistles like live token counting. Nothing major, and not clean.

## Phase 2: PDK, which I loved and stopped using

Next was PDK, Prompt and Development Kit. A node-based system where you chain predefined prompts together with globally or locally scoped variables, so you can reuse a workflow by swapping values instead of rewriting the prompt.

It was good at a few things. Keeping a library of prompts I wanted to remember. Building hierarchical prompt chains, some of them genuinely complex. Coding and documentation-generation workflows. And feeding code context from Code_Formatter into tuned prompts that formatted everything into XML or markdown structured for model comprehension.

PDK was also my first time working with Tauri, because I wanted cross-platform and shareable. This was one of the first things I thought I'd actually release. I spent months on it: hotkeys, note tools, more windows, and eventually the formatter embedded directly inside it. I never released it. I never released Code_Formatter either.

One piece of PDK I'm still proud of and intend to reuse: progressive spaced-repetition tutorials that surfaced based on how often you actually used a given feature, so the app could be deep without feeling bloated on day one.

But I stopped using it, and not because I disliked it. I'll admit some attachment to that tool. The real reason is that once you actually code a lot, you find you don't reuse the same prompts. Every project is different, every day is different, and every model wants different prompting. Reusable prompt flows are nice in theory and the node canvas looked great. I never reached for it. The thing I reached for every single day was the context tooling.

So I pulled that part out.

## Phase 3: Code Context Builder

I extracted the formatter from PDK, modularized it, renamed it Code Context Builder, and made it a standalone Tauri app, which made it much faster than the Python version. This is the tool I used for the next year and a half. These are tools I used to build themselves.

What it did:

- fast scanning using file hashes and modified times, so scanning a large codebase cost almost nothing
- built-in token counting
- folder collapse
- ignore patterns, plus prepend and append prompts
- markdown or XML output, whichever the workflow wanted
- real traversal instead of dumb concatenation
- change tracking: it knew when the code had moved out from under a scan, flagged the scan as stale, and pushed you to rescan before you pasted something outdated

The only expensive part was rendering. Select a 300k-token codebase and the viewer takes a second, because at that size just displaying the thing is work.

Paired with hotkeys, I could iterate absurdly fast and use top models in chat interfaces without Cursor or the CLI tools of the day, none of which were as good as what exists now. I've since seen several variations of this idea. Some are perfectly good and do the same job with a slightly different feature set. Mine was perfect for me. If I'd released it early it would have helped a lot of people, and honestly I don't know how anyone was functioning without something like it.

## Where it sits now

I still use it, just not for code.

It's now how I attach exactly the right personal or work notes to a prompt. You can't fully trust a CLI tool to discover the correct context on its own, and when you already know what's in each file, manual selection is still the right move. Occasionally I'll use it to push code into high-end non-CLI tools like GPT-5 Pro or DeepThink. But the coding era of this tool has run its course, and eventually CLI tooling eclipses it completely. That's fine.

## The part that actually mattered

I was bullish on LLM coding early, and it wasn't only because I'm a developer who's naturally bullish on AI. It's that I had a workflow that made the promise real. I could get the right context in and see legitimate multi-file output come back in minutes. The tool itself was built with LLMs, I hand-coded almost none of it, and I understood the architecture completely because I lived in that codebase for eight months.

In that era there was no other way. Cursor wasn't good enough. Aider wasn't good enough. Codex and Gemini CLI didn't exist. If you couldn't paste big, curated context into a chat window, you couldn't iterate. That was the entire game.
