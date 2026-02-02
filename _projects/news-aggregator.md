---
title: News Aggregator
summary: AI-powered news aggregation platform that de-sensationalizes content from Reddit, Twitter, and RSS feeds
started: 2024-11-10
updated: 2026-01-30
type: web-app
stack:
  - Python
  - FastAPI
  - PostgreSQL
  - React
  - TypeScript
  - Docker
tags:
  - ai
  - data
  - automation
loc: 20754
files: 90
architecture:
  database: PostgreSQL
  api: REST
  background: APScheduler
  cache: in-memory
---

## Overview

News Aggregator is a self-hosted platform designed to combat information overload by intelligently collecting, filtering, and enriching content from multiple sources. It aggregates posts from Reddit, Twitter/X, RSS feeds, and custom websites into a unified interface, then applies LLM-powered analysis to de-sensationalize headlines, extract key concepts, and score content relevance.

The system follows a microservices architecture with specialized scrapers, a central data pipeline, and an LLM enrichment layer. Users can define preference rules to automatically boost or penalize content based on keywords, sentiment, categories, and engagement metrics.

## Screenshots

<!-- SCREENSHOT: Main feed view showing aggregated news items in masonry grid layout with source badges and engagement metrics visible -->
![Main feed view](/images/projects/news-aggregator/screenshot-1.png)

<!-- SCREENSHOT: Preference rules modal showing example rule configuration for boosting AI-related content -->
![Preference rules configuration](/images/projects/news-aggregator/screenshot-2.png)

<!-- SCREENSHOT: Article detail view showing LLM-generated summary, extracted concepts, and original vs de-sensationalized title -->
![Article detail with AI analysis](/images/projects/news-aggregator/screenshot-3.png)

## Problem

Modern news consumption involves checking multiple platforms (Reddit, Twitter, RSS readers) while being bombarded with sensationalized headlines, duplicate stories, and irrelevant content. There's no unified way to:
- Aggregate content across different source types
- Filter out low-quality or repetitive posts
- Get objective summaries without clickbait
- Personalize feeds based on actual preferences rather than engagement-maximizing algorithms

## Approach

The solution uses a distributed microservices architecture where each component has a single responsibility.

### Stack

- **Backend Framework** - FastAPI for async REST APIs across all services, enabling high-throughput scraping without blocking
- **Database** - PostgreSQL 16 with JSONB columns for flexible metadata storage (LLM outputs, engagement metrics, source-specific fields)
- **Task Scheduling** - APScheduler for periodic scrape jobs with configurable intervals per source
- **Reddit Integration** - asyncpraw for authenticated Reddit API access with rate limit handling
- **Twitter Scraping** - Nitter-based scraper to bypass API restrictions
- **LLM Integration** - OpenRouter API for model-agnostic summarization and analysis
- **Frontend** - React 18 with Material UI, featuring masonry layouts, infinite scroll, and drag-and-drop feed ordering
- **Deployment** - Docker Compose orchestrating 9 services with health checks and dependency ordering

### Challenges

- **Rate limiting across multiple APIs** - Implemented per-source semaphores, TTL-cached in-flight request tracking, and exponential backoff to prevent thundering herd problems while maximizing throughput
- **Memory leaks in long-running scrapers** - SQLAlchemy identity maps accumulated objects over time; solved by explicitly calling `expunge_all()` before closing sessions across 21 locations
- **Duplicate content detection** - Database constraints on URLs plus UPSERT patterns for engagement metrics reduced database size by 92% (1.5GB to 120MB)
- **Balancing recommendation relevance** - Reddit trending posts dominated feeds; implemented source fatigue penalties, type rotation boosts, and anti-consecutive algorithms to ensure diverse results

## Outcomes

The platform successfully aggregates thousands of posts daily while maintaining sub-second query times. The preference scoring system allows fine-grained control over content ranking, and the LLM integration provides genuinely useful summaries that cut through sensationalism.

Key technical wins:
- Microservices architecture enables independent scaling of scrapers vs. query layer
- JSONB columns eliminated schema migrations for evolving LLM output formats
- Health check cascade ensures services start in correct dependency order

## Implementation Notes

The recommendation engine normalizes scores across different source types since Reddit and Twitter have vastly different engagement scales:

```python
# From shared/recommendation_utils.py
def calculate_recommended_score(item, source_type, index_in_type):
    base = normalize_score(item.trending_score, source_type)

    # Apply source fatigue - recently seen sources get penalized
    fatigue_boost = math.log(max(1, index_diff)) * 3600

    # Anti-consecutive penalty prevents 5 Reddit posts in a row
    if consecutive_count > 2:
        base *= 0.7 ** (consecutive_count - 2)

    return base + recency_boost + preference_adjustment
```

Preference rules support complex boolean conditions stored as JSONB:

```python
# Example rule: Boost AI content from Twitter
{
    "conditions": {
        "AND": [
            {"field": "category", "op": "contains", "value": "AI"},
            {"field": "source_type", "op": "==", "value": "Twitter"}
        ]
    },
    "adjustments": {"score": 5}
}
```

The data flow follows a clear pipeline: Scheduler triggers Scraper -> Scraper POSTs to Ingestor -> Ingestor stores and queues LLM jobs -> LLM Manager enriches top items -> Fetcher serves filtered results to Frontend.
