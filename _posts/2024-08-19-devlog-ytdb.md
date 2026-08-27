---
title: "Devlog: YTDB (YouTube Database)"
date: 2024-08-19
project: ytdb
---

I built YTDB because I got tired of searching for a type of video and being dumped into a blog post, a Reddit thread, or a forum pile where someone lists ten to a hundred things they personally liked.

It started with documentaries. IMDb will give you a documentary list and that's fine, but YouTube has an enormous documentary ecosystem and no way to navigate it, because YouTube search is, as everyone knows, absolute horseshit.

## The thesis

YouTube isn't designed for you to choose your own path. It's designed for the path to be chosen for you.

Around the same time they removed dislikes, and I'm still not sure whether they ever put them back. Either way, the thing I hate is that every interaction on a video helps the creator and helps distribution. Upvotes help. Downvotes help. Angry comments help. It's all engagement. There is no way to register that something is bad.

So I wanted a real external rating system. Add a video link, pull the metadata through the YouTube API, let people rate and review it, let them build their own playlists. Then you go find the best science documentaries on YouTube, or the best fan-made anime fights, or whatever your interest is, out of peer review instead of out of the algorithm.

## Weighted reviews

I tried to weight the rating system against abuse. People who review often and thoughtfully get somewhat more weight. Not dramatically more, just enough to offset bad actors. I knew from the start that this would need continuous tuning, and that the weighting itself would be the permanent ongoing problem rather than a thing you solve once.

## What I actually built

This wasn't a napkin sketch. It ran. Hosted on Heroku, accounts fully working, solid filtering and search, integrated with the YouTube API. I even got my API limits raised, which surprised me.

## Why it stalled

This is another project where I never let the rubber meet the road, and the reasons were concrete.

Platform risk. It isn't against YouTube's terms as far as I knew, but I always assumed that if it gained real traction they'd decide they didn't like it, since it competes with some of their interests while running on their API and their data. Losing API access kills the site outright.

Security. I put real work into it, but I wasn't confident, particularly around accounts. There's only so much I knew at the time, and this was before LLMs were any use for that kind of review.

Traction. A site like this only becomes valuable if people participate, and it only stays afloat if they keep participating. I could see the hurdles coming, my interest was fading, and eventually I cancelled the small subscription because it was just sitting there.

## Where it stands

I'm still not over it, because nothing fills the void it was meant to fill. I've seen a couple of similar sites since. None of them do what I was trying to do, and what I did do.

If there were real feedback or interest, I'd revive it. It's completely revivable, and I'd rebuild it far more secure. I've grown a lot as a developer since then and I'm confident I could make it much better than it was.
