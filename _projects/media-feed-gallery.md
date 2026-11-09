---
title: Media Feed Gallery
summary: A self-hosted gallery that syncs media from 4chan boards, subreddits and booru image boards on a schedule and keeps a local copy of all of it
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

Media Feed Gallery is a self-hosted web app that pulls media from 4chan boards, Reddit subreddits and booru image boards into one gallery.
It syncs each source on a schedule you set, caches the media locally, and shows everything in one responsive gallery.

It is built to be a polite client of the sites it pulls from, with rate limiting, exponential backoff, and daily scheduling so it doesn't flood them with requests.
Everything it syncs is stored locally, so browsing works offline and doesn't call the sources again.

## Screenshots

<!-- SCREENSHOT: Main catalog view showing a grid of media thumbnails from mixed sources (4chan, Reddit, Booru) with the sidebar showing available sources -->
![Catalog View](/images/projects/media-feed-gallery/screenshot-1.png)

<!-- SCREENSHOT: Lightbox/fullscreen viewer showing a single image with navigation controls and post metadata visible -->
![Lightbox Viewer](/images/projects/media-feed-gallery/screenshot-2.png)

<!-- SCREENSHOT: Overview/status page showing sync queue state, cache statistics, and system health metrics -->
![Overview Dashboard](/images/projects/media-feed-gallery/screenshot-3.png)

## Problem

Browsing media across 4chan, Reddit and various booru sites means switching between tabs and interfaces and losing track of things.
The sites have inconsistent APIs, aggressive rate limits, and no shared way to save or organize media.
Imageboard content also doesn't last: threads get pruned, and their media disappears with them.

This project keeps a local archive instead.
It syncs every source, caches all of the media, and shows it in one interface.

## Approach

Fetchers deal with each source's API quirks, a sync service runs the syncs, and a scheduler handles automatic refresh from a job queue that survives restarts.

### Stack

- Express and better-sqlite3: a small Node.js backend, using SQLite synchronously because it is simpler, with WAL mode for crash recovery.
- Preact and Vite: a small React-like frontend with fast hot reload in development, and virtual scrolling for large galleries.
- Python (asyncpraw): Reddit's API requires OAuth, so a Python subprocess handles the authentication.
- RequestGovernor: a custom rate limiter that combines a token bucket and semaphores, with limits per provider and per host.

### Challenges

- Rate limits across providers. The RequestGovernor combines token buckets, concurrency semaphores and automatic backoff that respects `Retry-After` headers, and each provider (4chan, Reddit, booru) has its own limits.
- Reddit. Reddit requires OAuth and paginates its own way, so the Node backend spawns a Python subprocess that uses asyncpraw and reads the JSON it prints.
- Delta sync for 4chan. Threads change constantly, so the sync tracks each thread's image count and only re-fetches threads that have new images, which cuts the number of API calls.
- Persistent job queue. Auto-refresh jobs live in a queue backed by SQLite, so they survive a server restart, and workers claim jobs atomically with `UPDATE...RETURNING`.

## Outcomes

It pulls from all three kinds of source.
Anything already synced loads from the local cache instead of the source.

## Implementation Notes

The RequestGovernor waits on a global semaphore, a per-host semaphore and a token bucket, then on any backoff in effect for the host:

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

The auto-refresh scheduler keeps its jobs in SQLite:

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

Views combine several sources with weighted interleaving, for example 60% Reddit and 40% booru content mixed together by weights you set.
