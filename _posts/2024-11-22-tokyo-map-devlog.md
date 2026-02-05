---
title: "Devlog: Tokyo Map (Offline Interactive Travel Map)"
date: 2024-11-22
project: tokyo-map
---

*Note: the transcript auto-labeled multiple "speakers," but it's just me.*

## Context / Why I started it

I was planning a second trip to **Tokyo** (I'd already been once), and I wanted a simple interactive map I could carry around. Goal: see all my "places I want to hit" clustered by neighborhood so I can sanity-check routes and density at a glance.

## What I built (the idea)

- A locally saved, **single HTML file** I could keep on my phone.
- Pins for each point of interest, where each pin includes:
  - metadata
  - images
  - links (per location)

## Data / Inputs

- Pulled a lot of map **GeoJSON** data.
- Used APIs to pull location data + images/descriptions (I *think* it was Google Maps, but I need to confirm before I say that publicly).

## Result

It was a "nice little tool," and honestly pretty cool to see everything visualized like that--feels like it *should* be great for travel. There are probably better replacements already (maybe not free).

## What actually happened

I started it only a couple days before leaving, so I didn't have time to polish it...and I didn't end up using it. Yeah.

## If I revive it later (quick notes)

- Confirm/record exact data sources (especially the images/descriptions pipeline).
- Start earlier next time so it's not "cool concept, zero finish."
- Quick win: add a basic "near me / next stop" mode + offline-friendly caching so it's actually used in-motion (not just admired).
