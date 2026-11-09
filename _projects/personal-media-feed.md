---
title: Personal Media Feed
summary: A self-hosted media library for videos, podcasts, books, shows, games and manga that identifies a pasted link and fills in its details
started: 2025-04-15
updated: 2026-01-15
type: web-app
stack:
  - Python
  - FastAPI
  - React
  - TypeScript
  - SQLite
  - ChromaDB
  - OpenAI
  - TailwindCSS
tags:
  - ai
  - data
  - automation
  - developer-tools
loc: 47000
files: 253
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: SSE
  background: in-memory
  cache: none
  search: ChromaDB
---

## Overview

Personal Media Feed (PMF) keeps YouTube channels, podcasts, RSS feeds, books, TV shows, games, manga, comics and more in one library.
An LLM reads each item and adds a summary, keywords, sentiment and named entities, and ChromaDB provides semantic search across the whole library.

Given a link, a resolver works out what the item is and fetches its details from more than 15 metadata services, including TMDB, IGDB, AniList, MangaDex, iTunes and PodcastIndex, picking the ones that fit the content type.
PMF also has saved filter views (Smart Views), content classes that keep some kinds of items out of the main feed, and a Sonarr and Radarr integration that checks whether a show or movie is already in the media library and adds it if not.

## Screenshots

<!-- SCREENSHOT: Main feed view showing media cards with thumbnails, AI-generated summaries, and facet filters in the left sidebar -->
![Feed View](/images/projects/personal-media-feed/screenshot-1.png)

<!-- SCREENSHOT: Collection detail page showing a YouTube channel or podcast with episode entries and consumption tracking -->
![Collection Detail](/images/projects/personal-media-feed/screenshot-2.png)

<!-- SCREENSHOT: Bulk import interface with preview mode showing URL resolution and metadata matching -->
![Bulk Import](/images/projects/personal-media-feed/screenshot-3.png)

## Problem

Media is spread across YouTube, Spotify, Goodreads, Steam, Crunchyroll and dozens of other platforms, each with its own interface, recommendations and tracking.
None of them gives one view of what to watch, read or play next based on everything you've already tracked.

The tools that pull some of it together either cover one medium, like Plex for video or Calibre for books, or need everything entered by hand.
I wanted something I could give a URL to that would work out what it is, fetch its details, and file it alongside everything else I'm tracking.

## Approach

The backend is split into modules by domain and talks to a React frontend over REST and Server-Sent Events.

### Stack

- FastAPI with SQLModel. The backend is async, so resolver calls run in parallel and enrichment progress streams to the browser as it happens.
- React 19 and TypeScript, with Zustand for UI state and TanStack Query for server data.
- ChromaDB for semantic search over embeddings, so a search like "find me something like that documentary about space" can find an item without its title.
- OpenAI and OpenRouter models to pull a title, summary, keywords, mood, complexity and named entities out of the raw content.
- SQLite with FTS5 for full-text search. Dev and prod use separate database files, so testing can't touch real data.

### Challenges

- The metadata services all have different rate limits, authentication and response formats. Each one gets a token-bucket rate limiter and implements one shared interface with common types, and the orchestrator routes each request to providers based on hints about the content type.
- Enrichment reads YouTube transcripts, PDFs and HTML articles. Trafilatura or BeautifulSoup extracts the text, it gets chunked, and the model receives a structured prompt that asks for a fixed JSON schema. Getting consistent output took careful prompt work, and the API cost needed tracking.
- Filter state lives in the sidebar, the filter panel, the URL and saved views at once. Keeping it consistent took one central Zustand store and care about which component owns which value. A saved view stores its filters as JSON whose keys match the store's.

## Outcomes

PMF tracks more than 1,000 media items across every category.
Adding a URL identifies the item, resolves its metadata and runs the LLM enrichment, usually in under 10 seconds for sources it already knows.

Adding a new source, like MangaDex or ComicVine, takes hours rather than days, because the resolver pattern is already in place.
Semantic search through the ChromaDB embeddings finds items from a loose description, like "that video about distributed systems with the funny presenter".
On first start the app creates a set of default saved views, such as Videos, Articles, Documentaries and Consumed.

## Implementation Notes

### Resolver Orchestrator

Metadata requests go through one orchestrator, which picks providers by content type:

```python
class ResolverOrchestrator:
    async def resolve(self, url: str, hints: ResolveHints) -> ResolvedMetadata:
        # Identity resolver determines content type from URL patterns
        identity = await self.identity_resolver.identify(url)
        
        # Route to appropriate providers based on type
        providers = self.routing_config.get_providers(identity.content_type)
        
        # Fan out requests with rate limiting
        results = await asyncio.gather(*[
            self.rate_limiters[p].execute(p.fetch, url)
            for p in providers
        ])
        
        # Adjudicator selects best metadata from multiple sources
        return self.adjudicator.merge(results)
```

### Collection Population

A YouTube channel's videos are paged through its uploads playlist, whose ID is the channel ID with the `UC` prefix swapped for `UU`:

```python
# Convert channel ID to uploads playlist for efficient fetching
# UC... (channel) -> UU... (uploads playlist)
uploads_playlist_id = "UU" + channel_id[2:]
```

### SSE Enrichment Updates

Enrichment progress streams to the frontend as it happens:

```python
@router.get("/stream")
async def event_stream():
    async def generate():
        async for event in sse_service.subscribe():
            yield {
                "event": event.type,
                "data": json.dumps(event.payload)
            }
    return EventSourceResponse(generate())
```
