---
title: Personal Media Feed
summary: AI-powered content aggregator that enriches, organizes, and surfaces media from 15+ sources
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

Personal Media Feed (PMF) is a sophisticated content aggregation and management system that pulls media from diverse sources—YouTube channels, podcasts, RSS feeds, books, TV shows, games, manga, comics, and more—then enriches each item with AI-generated metadata. The system uses LLMs to extract summaries, keywords, sentiment, and named entities, while ChromaDB provides semantic search across the entire library.

What sets PMF apart is its resolver orchestrator: a unified abstraction over 15+ external APIs (TMDB, IGDB, AniList, MangaDex, iTunes, PodcastIndex, etc.) that automatically identifies content and fetches rich metadata. Combined with smart views, content classification, and Sonarr/Radarr integration, it creates a personalized media dashboard that grows smarter over time.

## Screenshots

<!-- SCREENSHOT: Main feed view showing media cards with thumbnails, AI-generated summaries, and facet filters in the left sidebar -->
![Feed View](/images/projects/personal-media-feed/screenshot-1.png)

<!-- SCREENSHOT: Collection detail page showing a YouTube channel or podcast with episode entries and consumption tracking -->
![Collection Detail](/images/projects/personal-media-feed/screenshot-2.png)

<!-- SCREENSHOT: Bulk import interface with preview mode showing URL resolution and metadata matching -->
![Bulk Import](/images/projects/personal-media-feed/screenshot-3.png)

## Problem

Modern content consumption is fragmented across dozens of platforms—YouTube, Spotify, Goodreads, Steam, Crunchyroll—each with its own interface, recommendations, and tracking. There's no unified view of "what should I consume next?" that respects personal context and history.

Existing solutions either focus on a single medium (Plex for video, Calibre for books) or require manual curation. I wanted a system that could ingest a URL, automatically identify what it is, fetch rich metadata, and organize it alongside everything else I'm tracking.

## Approach

The architecture separates concerns into a modular backend with specialized domains, connected to a React frontend via REST and Server-Sent Events.

### Stack

- **FastAPI + Python** - Async-first backend with SQLModel ORM for clean data modeling; enables parallel resolver calls and streaming enrichment updates
- **React 19 + TypeScript** - Modern frontend with Zustand for state management and TanStack Query for server state synchronization
- **ChromaDB** - Vector embeddings enable semantic search ("find me something like that documentary about space")
- **OpenAI/OpenRouter** - LLM interface for extracting titles, summaries, keywords, mood, complexity, and named entities from raw content
- **SQLite** - Simple, portable database with FTS5 for full-text search; separate dev/prod databases prevent accidents

### Challenges

- **Resolver orchestration** - Coordinating 15+ external APIs with different rate limits, authentication schemes, and response formats required building a token-bucket rate limiter and unified type system. Each resolver implements a common interface, and the orchestrator routes requests based on content type hints.

- **Enrichment pipeline** - Processing YouTube transcripts, PDF content, and HTML articles through LLMs needed careful prompt engineering and cost tracking. The system extracts content via Trafilatura/BeautifulSoup, chunks it appropriately, and sends structured prompts that return consistent JSON schemas.

- **Filter synchronization** - Keeping filter state consistent across sidebar, filter panel, URL parameters, and smart views required a centralized Zustand store with careful attention to which component owns what. Smart views store filter criteria as JSON that maps directly to store keys.

## Outcomes

The system now tracks 1000+ media items across all categories with minimal manual input. Adding a URL triggers automatic identification, metadata resolution, and AI enrichment—typically completing in under 10 seconds for known sources.

Key learnings:
- **Resolver abstraction pays off** - Adding new sources (MangaDex, ComicVine) takes hours, not days, because the orchestrator pattern is established
- **Semantic search changes discovery** - Finding "that video about distributed systems with the funny presenter" actually works via ChromaDB embeddings
- **Smart views reduce friction** - Pre-defined filters like "Unwatched Tech Videos" or "Books Added This Month" make the feed immediately useful

## Implementation Notes

### Resolver Orchestrator

The system routes metadata requests through a unified orchestrator that selects appropriate providers based on content type:

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

YouTube channels use an efficient upload playlist conversion for pagination:

```python
# Convert channel ID to uploads playlist for efficient fetching
# UC... (channel) -> UU... (uploads playlist)
uploads_playlist_id = "UU" + channel_id[2:]
```

### SSE Enrichment Updates

Real-time progress updates stream to the frontend during enrichment:

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
