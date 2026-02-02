---
title: Intelligent News Aggregator
summary: LLM-powered news aggregator that de-sensationalizes headlines and curates content from Reddit, RSS, Twitter, and custom sources
date: 2024-11-01
---

## Overview

An AI-enhanced news aggregation platform that solves information overload by collecting content from multiple sources (Reddit, RSS feeds, Twitter, and custom websites) and enriching it with LLM-powered analysis. The system generates unbiased summaries, extracts key concepts, categorizes content, and applies user-defined preference rules to surface what matters most.

Built as a personal tool to combat sensationalized news and filter low-quality content, this aggregator uses a microservices architecture with 8+ Python services communicating via HTTP, a React frontend with multiple view modes, and PostgreSQL for persistent storage with JSONB metadata.

## Screenshots

<!-- SCREENSHOT: Main feed view showing news items with LLM-generated titles and summaries, preference scores visible in the sidebar -->
![Main feed interface](/images/projects/news-aggregator/screenshot-1.png)

<!-- SCREENSHOT: Full article view modal displaying LLM analysis including key concepts, sentiment, categories, and extracted facts -->
![LLM analysis panel](/images/projects/news-aggregator/screenshot-2.png)

<!-- SCREENSHOT: Preference rules configuration modal showing rule builder with scope, match type, and score adjustment options -->
![Preference rules configuration](/images/projects/news-aggregator/screenshot-3.png)

<!-- SCREENSHOT: Sources management sidebar showing different source types (Reddit, RSS, Twitter, Custom) with status indicators -->
![Sources management](/images/projects/news-aggregator/screenshot-4.png)

## Problem

Modern news consumption is broken. Headlines are engineered for clicks rather than clarity, duplicate stories flood multiple sources, and separating signal from noise requires significant manual effort. Existing aggregators simply combine feeds without addressing the underlying quality issues.

Key pain points this project addresses:
- **Sensationalized headlines** that misrepresent content
- **No fact-checking** before investing time reading
- **Duplicate coverage** from multiple outlets
- **Irrelevant content** mixed with high-value information
- **Scattered sources** requiring multiple apps to monitor

## Approach

The solution combines automated scraping, LLM enrichment, and rule-based scoring to create a curated reading experience.

### Stack

- **Backend (Python/FastAPI)** - 8 microservices handling ingestion, fetching, scraping, scheduling, and LLM processing. FastAPI provides async performance with automatic OpenAPI documentation
- **Frontend (React/TypeScript)** - Material UI-based SPA with 5 view modes (grid, list, gallery, detailed, compact), infinite scroll, and dark mode support
- **Database (PostgreSQL)** - Stores news items, sources, feeds, and preference rules. Uses JSONB columns for flexible LLM metadata storage without schema migrations
- **Scheduler (APScheduler)** - Background job scheduling for source-specific refresh intervals with configurable per-source timing
- **LLM Integration** - Multi-prompt pipeline that generates summaries, extracts facts, detects promotional content, and categorizes articles
- **Docker Compose** - Full containerization with health checks, service dependencies, and Nginx reverse proxy

### Challenges

- **LLM Response Parsing** - Designed a two-stage prompt chain where the first call extracts content analysis (summary, facts, sentiment) and the second handles categorization. JSON-only responses with explicit schema enforcement reduced parsing failures
- **Preference Scoring at Scale** - Implemented a rule engine supporting global, feed-level, source-level, and source-type scopes with weighted attribute matching. Rules support exact, contains, not_contains, and concept match types
- **Database Memory Management** - Discovered SQLAlchemy identity map was accumulating objects across long-running services. Added explicit `db.expunge_all()` before `db.close()` across 21 session locations to clear references
- **Engagement Metrics Duplication** - Reddit refreshes were creating duplicate metrics per comment (3.98M records for 2.8K comments). Refactored to upsert pattern, reducing database from 1.5GB to 120MB
- **Multi-Source Scheduling** - Each source type has different optimal refresh intervals. Implemented per-source configurable intervals with staggered job starts to prevent API rate limiting

## Outcomes

The aggregator successfully transforms raw news feeds into a curated, de-sensationalized reading experience:

- **De-sensationalized Titles** - LLM-generated neutral headlines strip emotional language and hyperbole
- **Content Quality Scoring** - Preference rules automatically surface interesting content while deprioritizing noise
- **Promotional Content Detection** - Articles identified as primarily promotional are flagged and can be filtered
- **Time-Decay Trending** - Trending scores factor in recency, preventing stale viral content from dominating
- **Cross-Source Deduplication** - Content items are linked to multiple news items, enabling duplicate detection

Key metrics:
- Supports 4 source types with unified data model
- Processes images through vision models for context
- 5 frontend view modes for different reading preferences
- Full Docker deployment with health monitoring

## Implementation Notes

### LLM Analysis Pipeline

The LLM manager uses a two-stage prompt to extract structured metadata:

```python
# First prompt: Content analysis
response = await call_llm(f"""
    Given the following news item:
    Title: {req.title}
    Content: {req.content}
    
    Analyze and provide:
    1. A concise, factual summary (llm_summary)
    2. A neutral, desensationalized title (llm_title)
    3. Key concepts (llm_key_concepts)
    4. Facts (llm_facts)
    5. Tone (llm_tone)
    6. Sentiment (llm_sentiment)
    7. Keywords (llm_keywords)
    8. Promotional Content detection (llm_is_promotional)
    
    Return ONLY JSON...
""")

# Second prompt: Categorization based on first response
categories = await call_llm(f"""
    Given this analysis: {parsed_first['llm_summary']}
    Key Concepts: {parsed_first['llm_key_concepts']}
    
    Provide categories and subcategories...
""")
```

### Preference Rule Scoring

Rules are evaluated hierarchically with weighted attribute matching:

```python
def calculate_preference_score(item: NewsItem, db: Session):
    # Collect rules from all scopes
    all_rules = global_rules + feed_rules + source_rules + source_type_rules
    
    score = 0.0
    for rule in all_rules:
        if not rule_applies_to_scope(item, rule, db):
            continue
            
        attribute_value = get_item_attribute_value(item, rule.attribute)
        attr_weight = attribute_weights.get(rule.attribute, 1.0)
        
        if rule.match_type == 'contains':
            if matches_contains(attribute_value, rule.values):
                score += rule.score_adjustment * rule.weight * attr_weight
                
        elif rule.match_type == 'not_contains':
            if matches_not_contains(attribute_value, rule.values):
                score += rule.score_adjustment * rule.weight * attr_weight
    
    return score
```

### Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    Nginx Reverse Proxy :3883                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────────┐
    │                          │                              │
    ▼                          ▼                              ▼
┌─────────┐            ┌─────────────┐              ┌─────────────┐
│  Data   │◄──────────►│    Data     │◄────────────►│  Scheduler  │
│ Fetcher │            │  Ingestor   │              │   :5004     │
│  :5003  │            │   :5002     │              └──────┬──────┘
└─────────┘            └──────┬──────┘                     │
                              │                            │
         ┌────────────────────┼───────────────────────┬────┘
         │                    │                       │
         ▼                    ▼                       ▼
   ┌───────────┐      ┌─────────────┐        ┌─────────────┐
   │   Reddit  │      │   Gateway   │        │   Twitter   │
   │  Scraper  │      │   Scraper   │        │   Scraper   │
   │   :5000   │      │    :5005    │        │    :8394    │
   └───────────┘      └─────────────┘        └─────────────┘
                              │
                              ▼
                      ┌─────────────┐
                      │     LLM     │
                      │   Manager   │
                      │    :5010    │
                      └─────────────┘
```

All services expose `/health` and `/metrics` endpoints for monitoring, with standardized CORS, error handling, and correlation ID middleware.
