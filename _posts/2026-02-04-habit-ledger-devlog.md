---
title: "Habit Ledger Devlog: Building a Quantified Self Tracking App"
date: 2025-08-28
project: habit-ledger
---

## Context: quantified-self brainrot (affectionate)

I've been part of the quantified self "track everything" world for **over a decade**, and I genuinely love tracking data about myself. Over time I've relied on a bunch of tools--**ActivityWatch** for computer history, sleep trackers like **Sleep as Android** (and currently **Fitbit**), plus habit/exercise/event tracking (reading, meditation, workouts, etc.).

## The problem: exports that make me want to walk into the ocean

For a long time, I used an app called "Keep Track." Then I finally bit the bullet and tried to export my data... and the exports were **horribly horribly formatted**. JSON, CSV, text--doesn't matter: it's a mess.

## Why that's unacceptable (for me)

I need **clean data** that can go straight into my metrics dashboard and be parsed cleanly over time--**tens of thousands of datapoints**, not "eh close enough." Also: I needed habit entry to be **stupid easy**, because if it's not frictionless, I won't keep up with it.

## The solution: Habit Ledger

So I built **Habit Ledger**--a very simple app (not on the App Store; just a personal APK).

**What it does:**

- Makes it easy to **track + export** the habits/activities I log manually.
- Adds **customizable home screen widgets** for each activity, so logging becomes quick-tap muscle memory.
- Stores entries in a simple database, then outputs a **reformatted export** that can go straight into my system without me writing a bunch of brittle cleanup scripts.

## Current state

It's intentionally minimal: quick entry, clean export, done. "It's really that simple."
