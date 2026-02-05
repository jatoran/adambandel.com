---
title: Devlog — Odyssos
date: 2026-02-01
project: odyssos
---

## Snapshot

**Odyssos** is one of the first games I've actually developed *and* released for real players. It's a browser incremental, so no Steam release circus—just get it in front of eyes and see what happens. 

It still needs balancing, but it took the better part of a year to build, using GPT-3.5 + GPT-4 plus a decent chunk of custom/manual coding. It's also one of the last projects where I did a lot of the manual coding myself, before AI got "good enough" that doing it all by hand stopped feeling necessary for something like this. 

## Timeline (how it actually happened)

* **~3 months**: initial build push
* **~6 months**: stepped away for other work/projects
* **~3 months**: came back to finish and get it publishable
* **~1 week**: final cleanup sprint, then release (because I could feel myself losing steam and I wanted to *finish something*) 

## Reception (the good + the annoying)

It got **mixed reviews**, and the negative ones were *almost entirely* about **balancing**. 
At the same time, it also got a lot of praise—people seemed to genuinely enjoy the gameplay, and I racked up a lot of logged playtime across a couple incremental game sites. 

## What I think I did right

### The "gently unfolding" UI

A ton of work went into the UI and tutorial pacing—specifically: **don't dump a thousand menus/options on players immediately**. I hate that, and I'm pretty sure most players do too, so the plan from day one was a UI that gradually unfolds instead of jumpscaring you with complexity. I think I pulled that off pretty well. 

### Actually finishing (rare event)

For my first game that I've released—hell, one of the first I've even pushed past the "20% done" zone—I'm legitimately proud of it. 

## What's still broken / unfinished

### Balancing (obvious) + math (worse)

The balancing problems aren't just curve tuning—some issues are in the **actual calculations**. And yeah, a modern model (Opus 4.5 / GPT-5.2) would probably annihilate the cleanup and balancing work if I sat down and did it properly. The limiting factor is just me setting aside the time. 

### Player feedback pattern

Most feedback threads were basically: "Hey, this game **explodes** after X level." I already knew about that, but it was still useful—and now I have real playtesting data to work from. 

## Architecture notes (or lack thereof)

I don't think there's anything especially notable architecturally here. This isn't the "clever systems engineering" project—it's the "make a real game and release it" project. 

## Next steps (when I stop procrastinating)

* Do the real balancing pass (curves **and** calculation fixes) 
* Finish/polish until it's actually "well received" across the board 
* Port/import it into an **Android app** and maybe monetize it a bit (not the core goal, but still nice) 

## Why I care (the real reason)

The best part isn't money. It's the proof: I can make something that other people actually enjoy, and I'm not insane for thinking my ideas are fun. 

You can play it at [odyssos.io](https://odyssos.io).
