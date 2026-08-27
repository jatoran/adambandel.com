---
title: "Habit Ledger Devlog: Building a Quantified Self Tracking App"
date: 2025-08-28
project: habit-ledger
---

I've been in the quantified self world for over a decade and I genuinely like tracking data about myself. ActivityWatch handles computer history. Sleep has been through a few trackers, Sleep as Android for a long time and Fitbit currently. The rest is manual: habits, exercise, and point events like reading or meditation.

The app I used for that last category for years was Keep Track. Then I finally bit the bullet and tried to get my data out of it, and the exports are horribly formatted. JSON, CSV, plain text, it doesn't matter which one you pick. All of them are a mess.

That's disqualifying for me. The data has to go into my metrics dashboard and parse cleanly over a long time horizon, tens of thousands of datapoints, and I'm not writing brittle cleanup scripts forever to compensate for someone else's export function.

The other half is entry. If logging something isn't effortless I will stop doing it, and then the dataset has a hole in it that no amount of later effort fills.

## What I built

Habit Ledger. It's not on the Play Store, it's just a personal APK.

It makes tracking and exporting my manually logged habits and activities easy. It adds a customizable home screen widget per activity, so logging is one tap of muscle memory rather than a decision. And it stores entries in a simple database that exports in a format which drops straight into my system.

It's really that simple. There isn't much else to it, and there isn't supposed to be.
