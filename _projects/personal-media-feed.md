---
title: Personal Media Feed
summary: A self-hosted media library for videos, articles, podcasts, books, shows, movies, games, music and manga that works out what a pasted link or title is and fills in its details
started: 2025-04-15
updated: 2026-07-03
type: web-app
stack:
  - Python
  - FastAPI
  - React
  - TypeScript
  - SQLite
  - ChromaDB
  - TailwindCSS
  - Generative Gateway
  - Docker
tags:
  - ai
  - data
  - automation
  - developer-tools
loc: 63111
files: 302
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: SSE
  background: in-process asyncio
  cache: in-memory
  search: SQLite FTS5 + ChromaDB
---

## Overview

Personal Media Feed (PMF) keeps videos, articles, podcasts, books, TV shows, movies, games, music, manga and comics in one library.
Items are the single things to watch, read or play; collections are the channels, feeds, podcasts, shows, authors and artists they belong to.

Given a link or a title, PMF works out what the thing is and fetches its details from public metadata services such as TMDB, IGDB, Open Library, AniList, MangaDex, iTunes and PodcastIndex, picking the ones that fit the content type.
An LLM then reads each item and adds a summary, keywords, moods, sentiment and named entities, and ChromaDB holds an embedding of each one, so the library can be searched by meaning as well as by words.

It runs on my home server, and every model call goes through my [Generative Gateway](/projects/generative-gateway/).
A copy of its database from July 2026 held 915 items and 2,846 collection entries, such as a channel's videos or a show's episodes.

PMF also has saved filter views (Smart Views), content classes that keep some kinds of items out of the main feed, and a Sonarr and Radarr integration that checks whether a show or movie is already there and adds it if not.
Collections are checked for new entries on a schedule, weekly by default, unless I switch monitoring off for one.
A New Releases page lists the newest entries across all collections, and each one can be added to the library, marked as consumed or ignored.
A chat panel answers questions using the saved items, and a graph view links items by embedding similarity and shared tags.

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

### Adding things

Bulk add takes one link or title per line.
Rules that can be edited in Settings recognize links from YouTube, IMDb, Spotify, Goodreads, AniList, Steam, GitHub and Reddit.
A line can also carry a label like "Movie: Interstellar (2014)" or a hint like "(show)", and text after a pipe can add context for the LLM or say who recommended the item.
A plain title is searched on TMDB and Open Library and the candidates are ranked by title similarity and popularity; untyped titles also go to the LLM for a guess at what kind of thing they are.
By default each line goes straight in with its top candidate, and a preview mode shows what every line will become, with duplicates flagged, before anything is saved.

### Enrichment

Each new item is enriched by a background task.
YouTube videos use the YouTube Data API for the title, description and tags, plus the transcript when one exists.
Web pages go through trafilatura, and PDFs through pypdf.
The model fills a fixed JSON schema: summary, keywords, moods, sentiment, complexity, named entities, estimated length, and facets such as platform, genre and release year.
The prompts are editable in Settings.
After that the item gets an embedding and a duplicate check, and its status goes to the browser over Server-Sent Events.

### Stack

- FastAPI with SQLModel on SQLite, with FTS5 for keyword search. Enrichment runs as background tasks in the same process, and an hourly loop checks monitored collections.
- React 19 and TypeScript on Vite, with Tailwind and shadcn/ui components, Zustand for UI state and TanStack Query for server data.
- ChromaDB for embeddings, so a search like "find me something like that documentary about space" can find an item without its title. Related items and the duplicate check use the same index.
- Model calls go through my Generative Gateway, which knows PMF by a project ID instead of a provider key. Settings lists the gateway's models with their prices, and each task (enrichment, chat, embeddings, cover images) has its own model. Embeddings default to OpenAI's text-embedding-3-small. Without a gateway URL the code falls back to calling OpenRouter and OpenAI directly, except for cover images, which need the gateway.
- Model calls and metadata lookups are logged to the database, and a usage panel totals them by service and model.
- Docker Compose on my home server: the FastAPI backend, and nginx serving the built frontend and passing API requests through. Development on my PC uses its own database file, so testing can't touch real data.

### Challenges

- The metadata services all have different rate limits, authentication and response formats. Most requests go through one shared HTTP client that retries rate-limited and failed requests with backoff, honoring Retry-After. The collection resolver keeps a token-bucket rate limiter per service, from 40 requests a second for TMDB down to one a second for MusicBrainz and PodcastIndex, and picks providers by collection type: TMDB and TVMaze for shows, AniList for anime, Open Library for books, MusicBrainz for music, iTunes and PodcastIndex for podcasts, IGDB for games, MangaDex for manga and ComicVine for comics.
- Linking an item to the show or series it belongs to can match the wrong one. When the top two candidates are close, the LLM compares them, and if it still isn't sure, the top three are offered as suggestions instead. YouTube videos only ever get suggestions, because trailers and clips look too much like the shows they're about.
- A long video transcript is cut to about 6,000 characters by keeping its start, a slice of the middle and its end. Models don't always return valid JSON, so a response that fails to parse goes through three steps (parse it as is, strip markdown fences and cut it to the outer braces, then the json-repair library) before the model is asked again, once.
- Background enrichment and web requests write to the same SQLite file. The database runs in WAL mode with a 30-second lock timeout, and enrichment commits retry up to three times, waiting 1, 2 and then 4 seconds and re-applying their changes after each rollback.
- Duplicates are checked twice. Before an item is created, its exact URL, its normalized URL and any YouTube video ID are checked. After enrichment, its nearest neighbors in ChromaDB are scored on embedding similarity, title overlap, and matching site, author and date; clear matches are marked as duplicates of the earlier item, clear misses are kept, and the LLM decides the cases in between.
- Filters can be set from the sidebar, the filter panel and saved views. Keeping them consistent took one central Zustand store and care about which component owns which value. A saved view stores its filters as JSON whose keys match the store's.

## Outcomes

Since 19 July 2026 PMF has run on my home server instead of Docker Desktop on my PC.
A deploy script copies the code to the server and rebuilds the containers, and leaves the server's database, vector index and secrets alone.
On the PC, the backend reached Sonarr and Radarr through a Tailscale sidecar container that acted as its HTTP proxy.
On the server they are on the same local network, so the sidecar is switched off and the backend connects to them directly.

Model calls have gone through the Generative Gateway since January 2026.

On first start the app creates a set of default saved views, such as Videos, Articles, Documentaries and Consumed.

## Limits

- It is single-user, with no login, and only reachable on my own network.
- The model sees only the first 4,000 characters of an article, so a long piece is summarized from its opening.

## Implementation Notes

### Rate Limits

The collection resolver keeps one token bucket per service, sized in requests per second:

```python
LIMITERS = {
    "tmdb": TokenBucket(rate=40.0, capacity=40.0),
    "tvmaze": TokenBucket(rate=20.0, capacity=20.0),
    # ...
    "musicbrainz": TokenBucket(rate=1.0, capacity=1.0),
    # ...
    "podcastindex": TokenBucket(rate=1.0, capacity=1.0),
    # ...
}
```

### Collection Population

A YouTube channel's videos are paged through its uploads playlist, whose ID is the channel ID with the `UC` prefix swapped for `UU`.
A page of a playlist costs 1 unit of YouTube API quota, where a search costs 100.
Channels, podcasts and feeds fill up to 500 entries when they're added, and an admin action fetches more, up to 1,000.

```python
# The uploads playlist ID is the channel ID with 'UC' replaced by 'UU'
uploads_playlist_id = None
if channel_id.startswith('UC'):
    uploads_playlist_id = 'UU' + channel_id[2:]
```

### SSE Enrichment Updates

Each open browser connection gets its own asyncio queue on the SSE endpoint.
Enrichment and collection tasks broadcast `item_update` and `collection_update` events into every queue, and a ping every 15 seconds keeps the connection open:

```python
async def broadcast_update(self, event_data: Dict[str, Any]):
    """Puts an event message onto all active connection queues."""
    # ...
    # Put the event data onto each queue concurrently
    tasks = [queue.put(event_data) for queue in self.connections]
    await asyncio.gather(*tasks) # Wait for all puts to complete
```
