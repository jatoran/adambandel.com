---
title: Inbox Processor
summary: A web app that collects emails and typed notes in one inbox to sort, flags duplicates, and passes links on to a media feed
started: 2025-11-27
updated: 2026-01-01
type: web-app
stack:
  - Python
  - FastAPI
  - React
  - TypeScript
  - SQLite
  - ChromaDB
  - Docker
tags:
  - ai
  - automation
  - productivity
loc: 1769
files: 23
architecture:
  auth: none
  database: SQLite
  api: REST
  realtime: none
  background: none
  cache: none
  search: ChromaDB
---

## Overview

Inbox Processor collects emails from Gmail and notes typed into it by hand, and puts them in one queue to sort.
Every item has to be given a context before it can be processed.
Duplicates are flagged two ways, by exact hash and by semantic similarity, and from there an item is archived or sent on to another app with one click.
Right now the one destination wired up is my Personal Media Feed (PMF) app.

## Screenshots

<!-- SCREENSHOT: Main inbox view showing list of items with context badges (JAR, CMR, Personal), source indicators (Gmail/Manual), and bulk action toolbar -->
![Inbox View](/images/projects/inbox-processor/screenshot-1.png)

<!-- SCREENSHOT: Duplicates tab showing side-by-side comparison of two semantically similar items with similarity score and resolve actions -->
![Duplicate Detection](/images/projects/inbox-processor/screenshot-2.png)

<!-- SCREENSHOT: Item detail modal displaying full email content with clickable links, attachments list, and routing options (Archive, Send to PMF) -->
![Item Detail Modal](/images/projects/inbox-processor/screenshot-3.png)

## Problem

Bookmarks, articles, media recommendations and notes arrive by email all the time and end up scattered across inboxes with no categories.
Sorting them by hand is tedious, duplicates slip through, and anything meant for another system, like a media feed or a notes app, has to be copied over by hand.

The goal was one intake point that pulls in email automatically, takes quick manual notes, makes you pick a context up front instead of leaving the sorting for later, catches duplicates before they reach the destination apps, and sends each item to the right place in one click.

## Approach

It is an ordinary CRUD app with a vector index added for finding duplicates.

### Stack

- FastAPI (Python) for the API, which handles Gmail sync, the CRUD operations and calls to other services, with automatic OpenAPI docs
- React and TypeScript for the frontend, with hooks for state, Vite for builds and Tailwind CSS for styling
- SQLite with SQLAlchemy for the inbox items, so there is no separate database server
- ChromaDB as the vector database, with `all-MiniLM-L6-v2` embeddings, to find near-duplicates even when the wording differs
- Docker Compose for deployment, with multi-stage builds for the frontend (served by Nginx) and the backend (Uvicorn)

### Challenges

- A hash catches identical content but misses a paraphrased duplicate. SHA256 hashes are combined with vector similarity (cosine distance under 0.5), plus a second check on attachments so that two items with different files aren't flagged as the same.

- Archiving an item has to sync back to Gmail. Bulk archives run as async batches throttled by a semaphore, so the Gmail API isn't flooded and the UI stays responsive.

- Sorting tends to get put off. A context is required on both manual entry and import, each item shows its context as a badge, and nothing can be processed without one.

## Outcomes

- Bulk selection and one-click routing replace the copy-paste
- Semantic matching catches duplicates the hash misses
- A required context keeps an unsorted pile from building up
- Every item is tracked through its lifecycle, from inbox to processed to archived

The embeddings catch near-duplicates like forwarded emails or slightly reworded bookmarks.
The hash check runs first, and the vector search only runs when there is no exact match.

## Implementation Notes

### Deduplication Pipeline

New items pass through a two-stage deduplication check:

```python
# Stage 1: Exact hash match
content_hash = hashlib.sha256(
    (content + "".join(sorted(attachment_names))).encode()
).hexdigest()

existing = db.query(InboxItem).filter(
    InboxItem.content_hash == content_hash
).first()

# Stage 2: Semantic similarity via ChromaDB
if not existing:
    results = collection.query(
        query_texts=[content],
        n_results=5,
        where={"context": context}
    )
    for distance in results["distances"][0]:
        if distance < 0.5:  # Similarity threshold
            # Flag as potential duplicate for manual review
```

### Data Model

Items move through these states:

```
inbox → processed → archived
          ↓
       duplicate (linked to original)
          ↓
       pmf_failed (routing error captured)
```

The `InboxItem` model tracks source (`gmail` or `manual`), `source_id` for Gmail idempotency, mandatory `context` assignment, and `attachments` as JSON for file metadata.

### Frontend Filtering

The sidebar filters by:

- Context: JAR, CMR, Personal, Uncategorized
- Type: Web Links, Text Emails, Attachments, YouTube, IMDb
- Status: Processed, Failed, Archived

Filters combine with `useMemo` for client-side performance. Dark mode persists to localStorage with system preference detection on first load.
