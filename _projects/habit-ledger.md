---
title: Habit Ledger
summary: An Android app for logging habits and activities from home screen widgets, stored on the phone and exported as JSON
started: 2025-08-14
updated: 2025-08-28
type: android
stack:
  - Kotlin
  - Jetpack Compose
  - Room (SQLite)
  - WorkManager
  - Glance AppWidget
tags:
  - productivity
  - health
  - mobile
  - personal-data
loc: 4213
files: 40
architecture:
  auth: none
  database: SQLite
  api: none
  realtime: none
  background: WorkManager
  cache: none
  search: none
---

## Overview

Habit Ledger is an Android app for tracking habits and activities, built with Jetpack Compose.
It tracks both numbers and qualitative entries, from daily water intake and exercise to mood, weight and custom events, all stored locally on the phone.
It isn't on the Play Store; it's a personal APK.

There are five tracker types: quantity, counter, event, note and choice.
Entries can be tagged, each tracker can have its own customizable home screen widget, and reminders run on a schedule.
Data exports to JSON, and an incremental backup mirrors it to NDJSON.

## Screenshots

<!-- SCREENSHOT: Main tracker list showing multiple habit trackers with different types (counter showing calories, quantity showing weight, event showing checkmarks) -->
![Main tracker list](/images/projects/habit-ledger/screenshot-1.png)

<!-- SCREENSHOT: Quick entry bottom sheet for logging a quantity entry with value input, note field, and tag selection chips -->
![Quick entry interface](/images/projects/habit-ledger/screenshot-2.png)

<!-- SCREENSHOT: Home screen widget showing a counter tracker with split-tap controls for adding/subtracting values -->
![Home screen widget](/images/projects/habit-ledger/screenshot-3.png)

<!-- SCREENSHOT: Tracker history view showing logged entries over time with timestamps, values, and tags -->
![Entry history](/images/projects/habit-ledger/screenshot-4.png)

## Problem

I've been part of the quantified self movement for over a decade, and I love tracking information about myself.
ActivityWatch tracks my computer history, sleep has gone through several trackers, Sleep as Android and currently Fitbit, and the rest I track by hand: habits, exercise, and point events like reading or meditation.
For a very long time I used KeepTrack for that, and its JSON, CSV and text exports are horribly formatted.
I need clean data I can put into my metrics dashboard and parse cleanly over time, tens of thousands of data points.
I also needed a very easy form of entry.

The app had to track everything from binary events ("Did I take my vitamins?") to accumulating counters ("Calories today") to measurements ("Weight this morning"), be quick to log, and keep the data on the phone.

## Approach

### Stack

- Jetpack Compose with Material Design 3 for the UI.
- Room: local SQLite storage with foreign keys, indices and cascade deletes.
- Glance AppWidget: the home screen widgets, written in Compose, with split-tap controls for counters.
- WorkManager: schedules the reminders and the incremental backups.
- Kotlinx Serialization: JSON for exports, widget state and the more complex stored fields.
- DataStore Preferences: user settings and widget configuration.

### Challenges

- Counter state consistency: an entry can be backdated or given a future timestamp. Both the entry time and the last reset are clamped to the current time, so a future `lastResetAt` can't break the sum of deltas:

```kotlin
val effectiveMillis = minOf(atMillis, nowMillis)
val effectiveLastReset = minOf(latestReset ?: effectiveMillis, nowMillis)
val sum = entryDao.sumDeltasSince(trackerId, effectiveLastReset)
```

- Widget interactivity within Glance's limits: Glance widgets are much less interactive than full Compose. Widget actions, applying a delta or resetting a counter, go through ActionCallback, and the split-tap layout is two equal halves, minus on the left and plus on the right.

- Time zones: an entry should stay on the day it was logged when travel or daylight saving changes the local time. Each entry stores the local time zone offset when it is created, and its `dayKey` is computed in local time.

## Outcomes

The counter widget's split-tap controls log a meal or an activity in seconds without opening the app.
It makes it very easy to track and export the habits and activities I log by hand, and the export goes straight into my metrics dashboard.

Glance needs careful state management between the widget and the app's database.
Room's Flow queries feed straight into Compose, so the UI updates live.
WorkManager's `ExistingWorkPolicy.APPEND` suits incremental backups.
The many-to-many link between entries and tags needs a junction table with indices to keep queries fast.

## Implementation Notes

The data model has five entity types:

```kotlin
enum class TrackerKind { QUANTITY, NOTE, EVENT, COUNTER, CHOICE }
enum class EntryAction { SET, DELTA, RESET }

@Entity
data class Entry(
    val trackerId: Long,
    val timestamp: Long,
    val tzOffsetMinutes: Int,
    val action: EntryAction,
    val valueDouble: Double? = null,  // For QUANTITY, COUNTER deltas
    val valueText: String? = null,    // For CHOICE selections
    val note: String? = null,
    val dayKey: String                // YYYY-MM-DD in local TZ
)
```

Counter trackers keep a separate `CounterState` entity so the current total is a quick lookup, recomputed on each delta entry and reset:

```kotlin
@Entity
data class CounterState(
    @PrimaryKey val trackerId: Long,
    val currentTotal: Double = 0.0,
    val lastResetAt: Long? = null
)
```

Reminders store their weekly days as a bit mask (`notifWeeklyDaysMask`, bits 0-6 for Sunday through Saturday), and a skip-if-logged-today option keeps a reminder from firing for something already logged that day.
