---
title: Media Feed Gallery
summary: Unified media browser aggregating 4chan, Reddit, and Booru sites with local caching and smart interleaving
date: 2025-01-15
---

## Overview

Media Feed Gallery is a self-hosted application that aggregates media content from multiple external providers—4chan boards, Reddit subreddits, and various Booru imageboards—into a single unified browsing interface. It caches all media locally, enabling offline access and providing a consistent experience across disparate sources.

The application solves the frustration of switching between multiple sites with different interfaces, rate limits, and authentication requirements. By centralizing content into a local SQLite database with intelligent sync scheduling, users get a fast, private, and customizable media browsing experience.

## Screenshots

<!-- SCREENSHOT: Main catalog view showing mixed posts from multiple sources (4chan thread, Reddit post, and Booru images visible in grid layout) -->
![Catalog view with multi-source content](/images/projects/media-feed-gallery/screenshot-1.png)

<!-- SCREENSHOT: Sidebar expanded showing source management with different provider types (4chan boards, subreddits, booru tags) and their sync status -->
![Source management sidebar](/images/projects/media-feed-gallery/screenshot-2.png)

<!-- SCREENSHOT: Lightbox open displaying a full-size image with navigation controls and source attribution visible -->
![Lightbox media viewer](/images/projects/media-feed-gallery/screenshot-3.png)

<!-- SCREENSHOT: View configuration panel showing interleaving options (weighted round robin settings, source weights) -->
![View interleaving configuration](/images/projects/media-feed-gallery/screenshot-4.png)

## Problem

Browsing media across 4chan, Reddit, and Booru sites means dealing with:
- **Fragmented interfaces**: Each site has different layouts, controls, and quirks
- **Rate limiting**: Aggressive throttling when browsing casually
- **No persistence**: Threads expire, posts get deleted, content disappears
- **Authentication complexity**: Reddit's API requires OAuth, Boorus have inconsistent APIs
- **No cross-source discovery**: Can't easily combine content from multiple sources into a single feed

The goal was to build a personal media aggregator that fetches once, caches forever, and presents everything through a consistent, fast interface.

## Approach

The architecture centers on a Node.js backend that orchestrates multiple provider-specific fetchers, stores everything in SQLite, and serves a lightweight Preact frontend.

### Stack

- **Backend Runtime** - Node.js 18+ with Express, chosen for async I/O and mature ecosystem
- **Database** - SQLite with better-sqlite3 for synchronous API simplicity and WAL mode for concurrent reads
- **Frontend** - Preact + Vite for a 3KB runtime (vs React's 40KB) with full React compatibility
- **Virtualization** - @tanstack/react-virtual for smooth scrolling through 1000+ posts
- **Reddit Integration** - Python subprocess with asyncpraw, necessary for Reddit's OAuth complexity
- **Containerization** - Docker with multi-stage builds for production deployment

### Challenges

- **Delta sync optimization** - 4chan threads are expensive to fetch fully. Solved by tracking image counts per thread and only refetching when the catalog shows new images, reducing API calls by 50-90% on subsequent syncs.

- **Dual-runtime orchestration** - Reddit's official API library (PRAW) is Python-only. Rather than reimplement OAuth flows, the backend spawns a Python subprocess with structured JSON communication via stdout, handling failures gracefully.

- **Provider rate limiting** - Each provider has different limits. Implemented a request governor with per-host concurrency control, automatic retry with exponential backoff, and configurable delays between requests.

- **Thundering herd prevention** - With many sources, naive scheduling causes API stampedes. Solved with stable jitter based on source ID and configurable start-gaps between jobs of the same provider type.

- **Booru API inconsistency** - Realbooru's DAPI went offline. Built an HTML fallback parser using regex to extract post data from the web interface, with tag-based file extension detection.

## Outcomes

The application handles my personal use case of aggregating ~50 sources across three providers, syncing daily, and maintaining a local cache of several hundred gigabytes of media. Key wins:

- **Offline-first works well**: Once synced, browsing is instant with no network dependency
- **Views with interleaving**: Combining a low-volume subreddit with a high-volume board using weighted round robin prevents the smaller source from being drowned out
- **Server-side settings**: Moving UI preferences from localStorage to SQLite enables settings sync across devices
- **Lightweight frontend**: The Preact bundle stays under 50KB, with virtual scrolling handling large catalogs smoothly

## Implementation Notes

The job scheduling system uses atomic SQLite operations to prevent race conditions:

```sql
UPDATE refresh_jobs
SET status = 'running', locked_by = ?
WHERE id = (SELECT id FROM refresh_jobs WHERE status = 'queued' LIMIT 1)
  AND status = 'queued'
RETURNING *
```

Provider-specific worker pools run independently, so a slow 4chan sync doesn't block Reddit jobs:

```javascript
// Separate queues with configurable concurrency
const workers = {
  chan: new WorkerPool({ concurrency: 1, startGap: 600 }),
  reddit: new WorkerPool({ concurrency: 2, startGap: 600 }),
  booru: new WorkerPool({ concurrency: 3, startGap: 300 })
};
```

The interleaving algorithm for Views uses weighted round robin with score normalization to balance content from sources with wildly different scoring scales (Reddit karma vs Booru favorites).
