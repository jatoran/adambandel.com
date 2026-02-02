---
title: Inbox Processor
summary: Unified content ingestion hub with AI-powered deduplication and intelligent routing
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

Inbox Processor is a unified "second brain" entry point that aggregates content from multiple sources—Gmail and manual notes—into a single processing pipeline. It standardizes inputs, enforces context assignment, detects duplicates using both hash-based and semantic similarity matching, and intelligently routes items to their final destinations in external systems.

The system addresses a common knowledge management pain point: information arrives from multiple channels but lacks a unified system for organization, deduplication, and routing. Rather than manually sorting emails and notes into different apps, Inbox Processor provides a triage interface that ensures nothing falls through the cracks.

## Screenshots

<!-- SCREENSHOT: Main inbox view showing list of items with context badges (JAR, CMR, Personal), source indicators (Gmail/Manual), and bulk action toolbar -->
![Inbox View](/images/projects/inbox-processor/screenshot-1.png)

<!-- SCREENSHOT: Duplicates tab showing side-by-side comparison of two semantically similar items with similarity score and resolve actions -->
![Duplicate Detection](/images/projects/inbox-processor/screenshot-2.png)

<!-- SCREENSHOT: Item detail modal displaying full email content with clickable links, attachments list, and routing options (Archive, Send to PMF) -->
![Item Detail Modal](/images/projects/inbox-processor/screenshot-3.png)

## Problem

Information overload is real. Emails containing bookmarks, articles, media recommendations, and notes arrive constantly but end up scattered across inboxes without proper categorization. Manual triage is tedious, duplicates slip through, and items meant for specific systems (like a media feed or note-taking app) require manual copy-paste workflows.

The goal was to create a single intake point that:
- Pulls content from email automatically
- Allows quick manual note entry
- Requires context assignment upfront (no more "I'll organize this later")
- Catches duplicates before they clutter destination systems
- Routes items to the right place with one click

## Approach

The system uses a hybrid architecture combining traditional CRUD operations with vector embeddings for intelligent deduplication.

### Stack

- **FastAPI (Python)** - Async-first API framework with automatic OpenAPI documentation. Handles Gmail sync, CRUD operations, and external service integration.
- **React + TypeScript** - Modern frontend with hooks-based state management. Vite for fast development builds, Tailwind CSS for styling.
- **SQLite + SQLAlchemy** - Lightweight relational storage for inbox items with full ORM support. No separate database server needed.
- **ChromaDB** - Vector database for semantic similarity search. Uses `all-MiniLM-L6-v2` embeddings to detect near-duplicate content even when wording differs.
- **Docker Compose** - Containerized deployment with multi-stage builds for both frontend (Nginx) and backend (Uvicorn).

### Challenges

- **Semantic vs. Exact Deduplication** - Hash-based deduplication catches identical content but misses paraphrased duplicates. Solved by combining SHA256 hashes with vector similarity (cosine distance < 0.5). Added secondary attachment checks to prevent false positives when file attachments differ.

- **Bulk Operations with External Services** - Archiving items needs to sync state back to Gmail. Implemented async batch operations with semaphore-based throttling to avoid overwhelming the Gmail API while keeping the UI responsive.

- **Context Enforcement** - Users tend to defer organization. Made context selection mandatory on both manual entry and import, with clear visual indicators. Items can't be processed without a context.

## Outcomes

The system successfully consolidates the email-to-second-brain workflow into a single interface. Key wins:

- **Faster triage** - Bulk selection and one-click routing eliminates repetitive copy-paste
- **Fewer duplicates** - Semantic matching catches items that hash-based dedup misses
- **Forced organization** - Mandatory context prevents the "unsorted" pile from growing
- **Audit trail** - All items tracked through their lifecycle (inbox → processed → archived)

Vector embeddings proved surprisingly effective for catching "soft duplicates" like forwarded emails or slightly reworded bookmarks. The hybrid approach (hash + vector) provides both speed and accuracy.

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

Items flow through defined states with clear transitions:

```
inbox → processed → archived
          ↓
       duplicate (linked to original)
          ↓
       pmf_failed (routing error captured)
```

The `InboxItem` model tracks source (`gmail` or `manual`), `source_id` for Gmail idempotency, mandatory `context` assignment, and `attachments` as JSON for file metadata.

### Frontend Filtering

The sidebar provides multi-dimensional filtering:

- **Context**: JAR, CMR, Personal, Uncategorized
- **Type**: Web Links, Text Emails, Attachments, YouTube, IMDb
- **Status**: Processed, Failed, Archived

Filters combine with `useMemo` for client-side performance. Dark mode persists to localStorage with system preference detection on first load.
