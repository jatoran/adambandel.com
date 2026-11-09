---
title: Media Feed Gallery
summary: A self-hosted gallery that syncs 4chan, Reddit, booru and gallery-dl sources into one feed, hides reposts, and caches what you view or save
started: 2026-01-16
updated: 2026-08-02
type: web-app
stack:
  - JavaScript
  - Node.js / Express
  - SQLite (better-sqlite3, FTS5)
  - Preact
  - Vite
  - Sharp
  - ffmpeg
  - Docker
tags:
  - media
  - aggregation
  - self-hosted
loc: 31449
files: 100
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: polling
  background: custom scheduler + worker thread
  cache: filesystem + in-memory
  search: SQLite FTS5
---

## Overview

Media Feed Gallery is a self-hosted web app that pulls media from 4chan boards, Reddit subreddits, booru image boards and sites that gallery-dl can read into one gallery.
It syncs a source when asked, or once a day when automatic refresh is switched on, stores the thumbnails locally along with every full file that gets opened or saved, and hides reposts of images it already has.

It is built to be a polite client of the sites it pulls from, with rate limiting, exponential backoff, and by default at most one automatic refresh per source a day, so it doesn't flood them with requests.
Reddit and gallery-dl go through my [Search Gateway](/projects/search-gateway/), so this app holds no Reddit credentials and runs no Python.
Since July 2026 it runs in Docker on my home server, reachable only on my own network.

A separate Browse tab is a read-only explorer for an existing media library on the same server.
It shares the interface but none of the gallery's data.

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

This project keeps a local copy instead.
It syncs every source into one database, caches thumbnails at sync time and full files once they are opened or saved, and shows it all in one interface.

## Approach

Fetchers deal with each source's quirks, a sync service runs the syncs, and a scheduler handles automatic refresh from a job queue that survives restarts.
The gallery has feeds per source, views that mix several sources, full-text search, saved items, and a fullscreen carousel with shuffle and a slideshow.

### Stack

- Express and better-sqlite3: a small Node.js backend, using SQLite synchronously because it is simpler, with WAL mode so reads carry on during writes.
- Preact and Vite: a small React-like frontend with fast hot reload in development, and virtual scrolling for large galleries.
- Search Gateway: Reddit and gallery-dl requests go through it.
  It handles each provider's access, runs gallery-dl behind a VPN, and returns posts in the same shape for every provider.
- RequestGovernor: a custom rate limiter that combines token buckets and semaphores, with limits per provider and per host, for the requests that don't go through the gateway (4chan, booru, and the media proxy).
- Sharp and ffmpeg: image fingerprints for duplicate hiding, and the image and video thumbnails in Browse.

### Challenges

- Rate limits across providers.
  The RequestGovernor waits out any backoff, takes a token from the provider's bucket and the host's bucket, then takes a global and a per-host concurrency slot.
  A 429 or 503 sets a backoff that respects the `Retry-After` header.
  Gateway calls have a throttle of their own, one request a second by default, shared by Reddit and gallery-dl.
- Reddit.
  The first version spawned a Python subprocess that used asyncpraw with OAuth.
  In May 2026 Reddit's client-credentials login started returning 401 for script apps while its app-creation form was also broken, so the fetcher moved to Reddit's anonymous JSON endpoints, and by June it went through the Search Gateway instead.
  The app now runs no Python at all.
- Delta sync for 4chan.
  Threads change constantly, so the sync tracks each thread's image count and only re-fetches threads that have new images, which cuts the number of API calls.
  Threads that drop out of the catalog are marked archived.
- Persistent job queue.
  Auto-refresh jobs live in a queue backed by SQLite, so they survive a server restart, and each provider's worker claims jobs atomically with `UPDATE...RETURNING`.
  Each source gets its own time of day from a hash of its ID, so syncs spread across the day, and a failed sync backs off from 5 minutes up to 6 hours.
  A source that is plainly gone, such as a banned or private subreddit, is switched off instead of retried.
  After a restart it does not try to make up the days it missed.
- Reposts.
  Every thumbnail gets a perceptual fingerprint, and a new single-image post that matches an older one is hidden, keeping the earliest copy.
  On 4chan only exact matches count; for the other sources it also catches re-encodes, small edits and mirrored copies, through an in-memory index that only compares fingerprints that already share a section.
  Looser settings were tried and dropped after a side-by-side review, because one low-detail thumbnail matched about 20 unrelated images.
- Scale.
  At hundreds of thousands of posts, one slow query stalls every other request, because better-sqlite3 runs queries synchronously on the one Node thread.
  Search moved from a `LIKE` scan to SQLite full-text search, the viewed, saved and downloaded filters became counter columns kept current by triggers, and feeds stopped computing exact totals, which had cost 1.6 to 3.6 seconds a page.
  A view of about 114 subreddits went from 5.5 seconds to 1.1.
- Browse.
  The Browse tab indexes about 281,000 files into its own SQLite file from a worker thread, so a scan or a search never blocks the server, and a new scan only replaces the index once it finishes.
  Thumbnails are made the first time something is shown.

## Outcomes

It pulls from all four kinds of source.
Thumbnails, and anything already opened, load from local disk instead of the source.
Saved items download their full files automatically, and the saved list can be exported as a zip.
By June 2026 it held about 286,000 posts and 470,000 media items, and the first full duplicate pass hid 60,302 posts.

## Limits

- There is no login, so it is only reachable on my own network.
- Reddit and gallery-dl depend on the Search Gateway.
  When it is down, those syncs back off and retry until it is back.
- A sync stores thumbnails, not full files.
  A full file is cached the first time it is opened or saved, so a pruned 4chan thread loses the full images nobody opened.
- Search matches words and word beginnings, not any substring.
- Duplicate hiding only applies to single-image posts, and videos are compared by their thumbnail alone.
- Two gallery-dl sites are wired up so far.
  Adding one takes an entry in this app and an adapter in the gateway.

## Implementation Notes

The RequestGovernor waits on any backoff for the provider or host, then on the token buckets, then on the concurrency slots:

```javascript
// RequestGovernor.fetch (excerpt)
await this._waitForBackoff(providerKey, hostname);

// Token throttles occur before acquiring semaphores so waiting does not block concurrency slots.
await this._getProviderBucket(providerKey).take(1);
await this._getHostBucket(hostname).take(1);

const hostSem = this._getHostSemaphore(hostname);
await this.globalSemaphore.acquire();
await hostSem.acquire();

// ... the request, with a timeout, then:
if (res.status === 429 || res.status === 503) {
  // Respect server-provided backoff hints when available.
  const retryAfter = parseRetryAfterSeconds(res.headers.get('retry-after'));
  const backoffSec = retryAfter ?? this.config.defaultBackoffSec;
  this._applyBackoff(providerKey, hostname, backoffSec);
}
```

The auto-refresh scheduler keeps its jobs in SQLite, and a provider's worker claims the next due job in one statement:

```javascript
// Claim the next due job for a provider type (sources.type). Uses a single atomic UPDATE with RETURNING.
claimNextDueForProvider: db.prepare(`
  UPDATE refresh_jobs
  SET status = 'running',
      locked_at = strftime('%s', 'now'),
      locked_by = ?,
      last_started_at = strftime('%s', 'now'),
      updated_at = strftime('%s', 'now')
  WHERE id = (
    SELECT rj.id
    FROM refresh_jobs rj
    JOIN sources s ON s.id = rj.source_id
    WHERE rj.status = 'queued'
      AND rj.run_after <= strftime('%s', 'now')
      AND s.enabled = 1
      AND s.type = ?
    ORDER BY rj.run_after ASC, rj.id ASC
    LIMIT 1
  )
    AND status = 'queued'
  RETURNING *
`),
```

Views combine several sources.
Providers alternate one to one, and within a provider, sources take turns by weight, so a heavier source shows up more often.
The ranking runs in SQL over only the rows the current page can need, not the whole table.
