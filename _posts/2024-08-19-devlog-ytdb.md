---
title: "Devlog: YTDB (YouTube Database)"
date: 2024-08-19
project: ytdb
---

## Why I started it

I got tired of hunting for specific types of videos and always getting funneled into a blog post, a Reddit thread, or some forum comment pile where someone drops a totally subjective "top 10-100" list.

This started (at least in my head) with **documentaries**: IMDb can give you documentary lists and that's fine, but YouTube has a massive documentary ecosystem too--and YouTube search is, as everyone knows, absolute horseshit.

## The core thesis

YouTube is not designed for you to choose your own path. It's designed for a path to be chosen *for you*. So I wanted a tool where the "what should I watch?" answer comes from people--not the recommendation engine.

## The "ratings" motivation (and the petty rage that powered it)

Around the same era, YouTube removed dislikes (and I wasn't even sure if they added them back). Either way: I *hate hate hate* that basically **every** interaction benefits the creator and the video's distribution, even when it's negative. Downvotes, upvotes, angry comments--it's all "engagement," so it all helps.

What I wanted instead was a real, external rating system:

- Add a video link
- Pull metadata via the YouTube API
- Let users rate + review it
- Let users build their own playlists
- Then search curated lists like: "best science documentaries on YouTube" or "best fan-made anime fights" without being beholden to the algorithm

## The anti-abuse idea: weighted reviews

I tried to design the rating system to be weighted to avoid abuse:

- People who review often **and thoughtfully** get slightly more weight
- But not "absurdly higher" weight--just enough to help offset bad actors
- And I knew from day one this would require ongoing tuning and fine-tuning

## What I actually built

This wasn't just a napkin idea--I got it working:

- Hosted on Heroku
- Accounts fully working
- Solid filtering + search
- Integrated with the YouTube API
- Even got my YouTube API limits increased somehow (which honestly surprised me)

## Why it stalled (a.k.a. the part where I didn't let the rubber meet the road)

This became another project where I didn't fully push it through the real-world gauntlet. The blockers were pretty concrete:

**1) Platform/API risk**
It's not against YouTube's terms (as far as I knew), but I always assumed: if this gained traction, YouTube might decide they don't like it--especially because it competes with some of their interests while relying on their API/data. Losing API access would be a huge hit.

**2) Security anxiety**
I put real effort into security, but I wasn't confident enough in it--especially for accounts. There's only so much I know, and "LLMs now" + my fading interest did not help momentum.

**3) Friction + traction requirement**
This kind of site needs community participation to become valuable and stay afloat. I could feel the upcoming hurdles, and eventually I cancelled the small subscription because it was just sitting there.

## Where I'm at now

I'm still not 100% over it because nothing really fills the void this was meant to fill. I've seen similar sites, but not one that actually does what I was trying to do (and did do).

If I got real feedback or interest, I'd revive it. It's completely revivable--and I'd rebuild it better and *far* more secure. I've improved a lot as a developer since then, and I'm confident I could make it way stronger than the original.
