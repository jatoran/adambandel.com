---
title: Personal Media Feed
summary: Self-hosted media library with AI-powered enrichment, semantic search, and 15+ resolver integrations for organizing content across the web.
date: 2025-04-15
---

## Overview

Personal Media Feed (PMF) is a self-hosted, single-user media library aggregator that transforms raw URLs and links into a searchable, enriched personal knowledge base. It handles everything from YouTube videos and academic papers to podcasts, books, manga, and more—automatically extracting metadata, generating summaries, and organizing content with AI assistance.

The application takes a collections-first approach where channels, authors, and series are first-class entities that can be polled for new content. A sophisticated bulk import system with preview-commit workflow, platform-aware URL normalization, and content class routing makes it practical for managing hundreds of items at once while keeping sensitive content appropriately isolated.

## Screenshots

<!-- SCREENSHOT: Main feed view showing media item cards with thumbnails, enrichment status badges, and filter sidebar visible -->
![Main Feed View](/images/projects/personal-media-feed/screenshot-1.png)

<!-- SCREENSHOT: Item detail panel showing AI-generated summary, extracted metadata, tags, and facets for a YouTube video -->
![Item Detail Panel](/images/projects/personal-media-feed/screenshot-2.png)

<!-- SCREENSHOT: Bulk add interface in preview mode showing URL parsing, platform detection, and resolver candidates -->
![Bulk Import Preview](/images/projects/personal-media-feed/screenshot-3.png)

<!-- SCREENSHOT: Collections page showing YouTube channels, podcast feeds, or author collections with entry counts and polling status -->
![Collections Browser](/images/projects/personal-media-feed/screenshot-4.png)

## Problem

Saving interesting content from the web typically means scattered bookmarks, forgotten browser tabs, or notes in various apps. These solutions lack enrichment—you save a URL but lose the context of why it mattered. Finding that article about a specific topic weeks later becomes impossible without proper metadata, search, and organization.

I wanted a personal library that could ingest content from anywhere, automatically enrich it with summaries and structured metadata, provide both keyword and semantic search, and organize everything into collections that mirror how I actually think about content (by creator, series, or topic).

## Approach

The system uses a two-phase architecture: ingestion and enrichment. Content enters through a bulk import system that parses URLs, normalizes platform-specific quirks (AMP pages, tracking parameters, mobile variants), and routes items to appropriate resolvers for metadata hydration.

### Stack

- **Backend** - FastAPI with async/await throughout. SQLModel ORM with SQLite for persistence, ChromaDB for vector embeddings. Chosen for rapid development and self-hosting simplicity.
- **Frontend** - React 19 + TypeScript with Zustand for state management, TanStack Query for data fetching, and shadcn/ui components. Vite for fast development cycles.
- **LLM Integration** - OpenAI API (GPT-4o-mini) via OpenRouter for metadata extraction, summarization, and keyword generation. text-embedding-3-small for semantic search embeddings.
- **Search** - Dual-mode system with SQLite FTS5 for lexical search and ChromaDB k-NN for semantic search, user-toggleable per query.
- **Resolvers** - 15+ provider integrations (TMDB, MusicBrainz, OpenLibrary, AniList, PodcastIndex, IGDB, ArXiv, etc.) with parallel queries and token-bucket rate limiting.

### Challenges

- **URL normalization at scale** - Hundreds of platforms have different URL schemes, mobile variants, and tracking parameters. Built a heuristic-based normalizer that handles 30+ platforms with pattern matching and ID extraction, falling back to LLM classification for unknown formats.

- **Content class visibility routing** - Needed to isolate NSFW or sensitive content without deleting it. Implemented a pattern-based classification system where `content_class = NULL` means visible in main feed, while non-null classes require explicit opt-in. Patterns support both glob wildcards and regex, stored in database for runtime configuration.

- **Semantic search at personal scale** - ChromaDB works well locally but embedding generation is expensive. Solved by creating composite embeddings from title + summary + tags + facets + transcript snippets, generated once after enrichment completes rather than on every update.

- **Real-time updates without polling** - Used Server-Sent Events (SSE) for pushing `item_update` and `collection_update` events to the frontend, eliminating the need for constant API polling during enrichment.

## Outcomes

The system now manages thousands of items across dozens of collections with sub-second search. The bulk import flow handles hundreds of URLs at once with intelligent routing and deduplication. Smart Views provide instant context-switching between different content focuses (research papers, entertainment, reading list).

Key technical learnings include designing for async-first from the start (retrofitting is painful), the value of configurable heuristics stored in database rather than hardcoded, and how hybrid search (lexical + semantic) covers more use cases than either alone.

## Implementation Notes

The bulk add system uses a preview-commit pattern that's worth highlighting:

```python
# URL parsing extracts platform hints using pattern matching
def _infer_platform_kind_from_url(url: str) -> dict:
    # Detects 30+ platforms (ArXiv, GitHub, Reddit, Steam, etc.)
    # Extracts IDs (TMDB, IMDB, ArXiv paper IDs)
    # Returns medium classification (video/text/audio/interactive)
    ...

# Routing runs through candidates from multiple resolvers in parallel
async def generate_candidates(urls: list[str]) -> list[Candidate]:
    tasks = [resolver.query(url) for url in urls]
    return await asyncio.gather(*tasks)
```

Content class patterns use a dual-strategy matcher:

```python
def match_content_class(url: str, patterns: dict) -> str | None:
    for class_name, pattern_config in sorted(patterns.items(), key=lambda x: x[1].priority):
        if has_regex_tokens(pattern_config.pattern):
            if re.match(pattern_config.pattern, url):
                return class_name
        else:
            if fnmatch.fnmatch(url, pattern_config.pattern):
                return class_name
    return None  # Visible in main feed
```

The collection polling system uses APScheduler with per-collection intervals and daily caps:

```python
class CollectionPoller:
    async def poll(self, collection: Collection):
        if collection.promoted_today_count >= collection.caps_per_day:
            return  # Daily limit reached
        
        entries = await self.fetch_new_entries(collection, limit=collection.caps_per_poll)
        for entry in entries:
            await self.create_or_update_entry(entry)
```

YouTube channel integration optimizes API quota by using uploads playlists (`UC...` prefix becomes `UU...`) which costs 1 quota unit per page versus 100 for channel search—critical when monitoring many channels.
