---
title: Inbox Processor
summary: AI-powered inbox aggregator that syncs Gmail and notes, deduplicates with vector search, and routes to destinations
date: 2025-11-27
---

## Overview

Inbox Processor is a unified "Second Brain" entry point that consolidates inputs from Gmail and manual notes into a single processing interface. It standardizes diverse content sources, enforces context categorization, and uses semantic vector search to identify and resolve duplicate entries before routing items to their final destinations.

The system acts as an intelligent triage layer between chaotic input streams (emails, quick thoughts, links) and organized knowledge bases like Obsidian vaults or personal media feeds. Every item must be tagged with a context (work projects, personal, etc.) before processing, ensuring nothing slips through unclassified.

## Screenshots

<!-- SCREENSHOT: Main inbox view showing list of items with sidebar filters for contexts (JAR, CMR, Personal) and content types (Web Links, YouTube, Attachments) -->
![Inbox view with context filters](/images/projects/inbox-processor/screenshot-1.png)

<!-- SCREENSHOT: Item detail modal open showing full content, attachment preview, and routing options (Archive, Send to PMF) -->
![Item detail modal with routing options](/images/projects/inbox-processor/screenshot-2.png)

<!-- SCREENSHOT: Duplicate detection tab showing side-by-side comparison of semantically similar items with distance scores -->
![Duplicate detection view](/images/projects/inbox-processor/screenshot-3.png)

## Problem

Email and quick notes scatter across apps with no unified processing workflow. Links saved "for later" pile up. The same content arrives through multiple channels. Without a forcing function for categorization, items disappear into an ever-growing backlog.

Traditional inbox management treats each source separately. Gmail has its own archive, notes apps have their own organization, and the mental overhead of context-switching between them compounds. What's needed is a single queue that normalizes everything, catches duplicates before they multiply, and enforces a decision on every item.

## Approach

The system pulls emails via a local Gmail Fetcher service and accepts manual notes through a dedicated input. Every item is normalized to a common `InboxItem` format with mandatory context assignment. Vector embeddings power semantic deduplication: items with cosine distance < 0.5 are flagged as potential duplicates for manual review.

The frontend provides smart filtering by content type (web links, YouTube, attachments, plain text) and context. Bulk operations enable batch processing: select 50 YouTube links and route them all to the Personal Media Feed in one action.

### Stack

- **Backend Framework** - FastAPI with async support for non-blocking Gmail sync and upstream archive operations
- **Relational Storage** - SQLite via SQLAlchemy for item persistence with soft-delete archiving
- **Vector Search** - ChromaDB with all-MiniLM-L6-v2 embeddings for semantic similarity detection
- **Frontend** - React 19 + Vite + Tailwind CSS 4 for a responsive SPA with dark mode support
- **Containerization** - Docker Compose for backend/frontend deployment with volume-mounted data persistence

### Challenges

- **Bidirectional Gmail sync** - Archiving locally must propagate upstream to Gmail. Implemented sequential throttled requests (100ms delay, semaphore=1) to avoid rate limits during bulk operations. The async flow handles failures gracefully, logging which messages failed without blocking the batch.

- **Attachment deduplication edge case** - Two emails with identical body text but different attachments are not duplicates. Added a secondary check that compares attachment filenames before flagging matches, preventing false positives on "No Content" placeholder emails.

- **Content-type filtering at scale** - Detecting YouTube/IMDB links, attachments, and plain text requires scanning every item. Implemented `useMemo` on filter state to avoid recalculating counts on every render, keeping the sidebar responsive with hundreds of items.

## Outcomes

The inbox becomes a true processing queue rather than a pile. The mandatory context requirement ensures every item gets categorized before it can be archived. Semantic deduplication catches the "I emailed this link to myself twice" problem automatically.

The bulk action pattern proved especially useful: selecting all items tagged as YouTube links and batch-sending them to the media feed turns a tedious one-by-one chore into a single operation. Dark mode and mobile-responsive design make quick triage possible from any device.

## Implementation Notes

The vector search integration uses ChromaDB's default embedding function:

```python
from chromadb.utils import embedding_functions

ef = embedding_functions.DefaultEmbeddingFunction()  # all-MiniLM-L6-v2

collection = chroma_client.get_or_create_collection(
    name="inbox_items",
    embedding_function=ef
)
```

Duplicate detection queries for the two nearest neighbors (self + closest match) and filters by distance threshold:

```python
results = vector.query_similar_items(content=item.content, n_results=2)

for nid, dist in zip(neighbor_ids, distances):
    if nid != item.id and dist < 0.5:
        # Flag as duplicate candidate
```

Bulk archive handles both local state and upstream Gmail operations concurrently with controlled throttling:

```python
semaphore = asyncio.Semaphore(1)  # Sequential to avoid rate limits

async def archive_upstream(gid, client):
    async with semaphore:
        await asyncio.sleep(0.1)  # 100ms throttle
        return await client.post(f"{settings.GMAIL_API_URL}/archive/{gid}")
```
