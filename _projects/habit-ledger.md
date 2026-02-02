---
title: Habit Ledger
summary: Privacy-first Android app for tracking habits, health metrics, and activities with home screen widgets
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

Habit Ledger is a comprehensive habit and activity tracking Android application built with modern Jetpack Compose. It allows users to track various types of quantitative and qualitative metrics—from daily water intake and exercise to mood, weight, and custom events—all stored locally on device for complete data privacy.

The app supports five distinct tracker types (quantity, counter, event, note, choice), flexible tagging, customizable home screen widgets for at-a-glance tracking, and an automated reminder system. Data can be exported to JSON or backed up incrementally via NDJSON mirroring.

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

Most habit tracking apps either require cloud accounts (privacy concern), lack flexibility for different data types, or don't provide quick-access widgets for frictionless logging. I needed an app that could track everything from binary events ("Did I take my vitamins?") to accumulating counters ("Calories today") to measurements ("Weight this morning")—all with minimal friction and complete local control.

## Approach

Built a flexible tracking system with five tracker types covering most personal data logging needs, combined with Glance-based widgets for instant access from the home screen.

### Stack

- **Jetpack Compose** - Modern declarative UI with Material Design 3 for a clean, responsive interface
- **Room Database** - Local SQLite storage with proper foreign keys, indices, and cascade deletes for data integrity
- **Glance AppWidget** - Compose-based home screen widgets with split-tap controls for counter manipulation
- **WorkManager** - Reliable background scheduling for reminders and incremental backups
- **Kotlinx Serialization** - Type-safe JSON handling for exports, widget state, and complex field storage
- **DataStore Preferences** - Modern key-value storage for user settings and widget configurations

### Challenges

- **Counter state consistency** - Handling edge cases where users backdate entries or set future timestamps required clamping logic that prevents future `lastResetAt` timestamps from breaking delta accumulation:

```kotlin
val effectiveMillis = minOf(atMillis, nowMillis)
val effectiveLastReset = minOf(latestReset ?: effectiveMillis, nowMillis)
val sum = entryDao.sumDeltasSince(trackerId, effectiveLastReset)
```

- **Widget interactivity within Glance constraints** - Glance widgets have limited interactivity compared to full Compose. Implemented ActionCallback patterns for widget actions (delta application, counter reset) and a split-tap layout approximating 30%/70% zones using weighted boxes for intuitive increment/decrement.

- **Timezone-aware entry timestamps** - Preserving user intent when entries cross timezone boundaries (travel, daylight saving) by capturing the local timezone offset at entry creation time and computing `dayKey` in local time.

## Outcomes

The app provides a flexible, privacy-respecting habit tracking solution with genuinely useful home screen widgets. The counter widget with split-tap controls enables logging meals or activities in seconds without opening the app.

Key technical learnings:
- Glance AppWidget framework is powerful but requires careful state management between the widget and app database
- Room's Flow-based reactive queries integrate seamlessly with Compose for live UI updates
- WorkManager's `ExistingWorkPolicy.APPEND` is ideal for incremental backup patterns
- Many-to-many relationships (entries-to-tags) need junction tables with proper indices for query performance

## Implementation Notes

The data model uses five entity types with a flexible schema:

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

Counter trackers maintain a separate `CounterState` entity for efficient total lookups, recomputed on delta entries and resets:

```kotlin
@Entity
data class CounterState(
    @PrimaryKey val trackerId: Long,
    val currentTotal: Double = 0.0,
    val lastResetAt: Long? = null
)
```

The reminder system uses bit masks for weekly day selection (`notifWeeklyDaysMask` where bits 0-6 = Sun-Sat) and supports skip-if-logged-today behavior for non-intrusive notifications.
