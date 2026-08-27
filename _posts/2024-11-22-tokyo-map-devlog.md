---
title: "Devlog: Tokyo Map (Offline Interactive Travel Map)"
date: 2024-11-22
project: tokyo-map
---

I was planning a second trip to Tokyo and thought it would be nice to carry an interactive map of everywhere I wanted to go, with the locations clustered by area so I could see route and density at a glance.

## What it was

A single HTML file saved locally on my phone. Every pin carried its own metadata, images, and links for that point of interest. No app, no account, no connection required.

I pulled a lot of GeoJSON for the map itself, and used APIs to pull location data, images, and descriptions. I believe that was Google Maps, but I want to confirm it before I state it as fact.

## What happened

It was a nice little tool and genuinely cool to see everything laid out that way. It seems like it should be great for travel.

I started it a couple of days before I left, so I never had time to polish it, and I didn't end up using it on the trip. There are probably better alternatives out there already, though maybe not free ones.

## If I pick it up again

Confirm and record the actual data sources, especially the image and description pipeline. Start earlier than two days out. Add a "what's near me, what's next" mode plus offline caching, so it's usable while moving rather than just nice to look at while sitting still.
