---
title: Media Feed Gallery
summary: Self-hosted media aggregator for 4chan, Reddit, and Booru with local caching and unified browsing
started: 2026-01-16
updated: 2026-02-01
type: web-app
stack:
  - JavaScript
  - Node.js / Express
  - SQLite
  - Preact
  - Vite
  - Python (asyncpraw)
tags:
  - media
  - aggregation
  - self-hosted
loc: 16035
files: 46
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: polling
  background: custom scheduler
  cache: filesystem
  search: none
---

## Overview

Media Feed Gallery is a self-hosted web application that aggregates media content from multiple sources—4chan boards, Reddit subreddits, and Booru imageboards—into a single, unified interface. The system syncs content on configurable schedules, caches media locally, and provides a responsive gallery UI for browsing everything in one place.

The project emphasizes being a "polite" client to upstream APIs through sophisticated rate limiting, exponential backoff, and daily scheduling that prevents overwhelming external services. All synced content is stored locally, enabling offline browsing and fast access without repeated API calls.

## Screenshots

<!-- SCREENSHOT: Main catalog view showing a grid of media thumbnails from mixed sources (4chan, Reddit, Booru) with the sidebar showing available sources -->
![Catalog View](/images/projects/media-feed-gallery/screenshot-1.png)

<!-- SCREENSHOT: Lightbox/fullscreen viewer showing a single image with navigation controls and post metadata visible -->
![Lightbox Viewer](/images/projects/media-feed-gallery/screenshot-2.png)

<!-- SCREENSHOT: Overview/status page showing sync queue state, cache statistics, and system health metrics -->
![Overview Dashboard](/images/projects/media-feed-gallery/screenshot-3.png)

## Problem

Browsing media across 4chan, Reddit, and various Booru sites means constantly switching between tabs, dealing with different UIs, and losing track of content. These sites have inconsistent APIs, aggressive rate limits, and no unified way to save or organize media. Additionally, content on imageboards is ephemeral—threads get pruned and media disappears.

This project solves these problems by creating a local archive that syncs content from all sources, caches everything locally, and presents it through a single responsive interface.

## Approach

The architecture separates concerns cleanly: fetchers handle source-specific API quirks, a sync service orchestrates operations, and a scheduler manages automatic refresh with persistent job queues that survive restarts.

### Stack

- **Express + better-sqlite3** - Lightweight Node.js backend with synchronous SQLite for simplicity and reliability; WAL mode for crash recovery
- **Preact + Vite** - Minimal React-like frontend with fast HMR development; virtual scrolling for large galleries
- **Python (asyncpraw)** - Reddit's API requires OAuth; a subprocess handles authentication complexity
- **Custom RequestGovernor** - Token bucket + semaphore rate limiter with per-provider and per-host controls

### Challenges

- **Rate limiting across providers** - Built a RequestGovernor with token buckets, concurrency semaphores, and automatic backoff that respects `Retry-After` headers. Each provider (4chan, Reddit, Booru) has independent limits
- **Reddit API complexity** - Reddit requires OAuth and has unique pagination. Solved by spawning a Python subprocess using asyncpraw, capturing JSON output for the Node backend to process
- **Delta sync for 4chan** - Threads change constantly. Implemented image count tracking to only re-fetch threads with new content, drastically reducing API calls
- **Persistent job queues** - Auto-refresh jobs survive server restarts via SQLite-backed queue with atomic job claiming using `UPDATE...RETURNING`

## Outcomes

The system successfully aggregates content from all three source types with minimal API impact. The RequestGovernor prevents rate limit violations even under heavy sync loads. Local caching means previously-synced content loads instantly, and the unified UI makes browsing across sources seamless.

Key patterns developed here—the request governor, persistent job queue, and delta sync strategy—are reusable for any multi-source content aggregation system.

## Implementation Notes

The RequestGovernor implements a sophisticated rate limiting strategy:

```javascript
// Token bucket with per-host tracking
async acquire(provider, host) {
  await this.semaphore.acquire();           // Global concurrency
  await this.hostSemaphores[host].acquire(); // Per-host concurrency
  await this.tokenBucket.consume(provider);  // Rate limiting

  // Check backoff state
  const backoff = this.backoffState.get(host);
  if (backoff && Date.now() < backoff.until) {
    await sleep(backoff.until - Date.now());
  }
}
```

The auto-refresh scheduler uses SQLite for job persistence:

```javascript
// Atomic job claiming prevents race conditions
claimJob(workerId) {
  return db.prepare(`
    UPDATE refresh_jobs
    SET status = 'running', locked_by = ?, locked_at = ?
    WHERE id = (
      SELECT id FROM refresh_jobs
      WHERE status = 'queued' AND run_after <= ?
      ORDER BY run_after ASC LIMIT 1
    )
    RETURNING *
  `).get(workerId, Date.now(), Date.now());
}
```

Views allow combining multiple sources with weighted interleaving—for example, showing 60% Reddit and 40% Booru content mixed together based on configurable weights.
