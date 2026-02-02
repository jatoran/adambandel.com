---
title: Search Gateway
summary: Unified API layer aggregating 27+ search and extraction providers with intelligent routing, caching, and cost tracking
date: 2025-01-15
github: https://github.com/anomalyco/search-gateway
---

## Overview

Search Gateway is a production-ready API aggregation layer that unifies access to 27+ search and content extraction providers behind a single, consistent interface. Instead of integrating with Brave, Tavily, DuckDuckGo, arXiv, GitHub, and dozens of other APIs individually, applications make one call to Search Gateway and let it handle provider selection, rate limiting, caching, fallbacks, and cost tracking.

The system solves a common problem in AI and data applications: needing reliable, cost-effective access to multiple external APIs without building redundant infrastructure for each. It provides automatic failover when providers are down, transparent caching to reduce costs, and granular usage tracking across all providers.

## Screenshots

<!-- SCREENSHOT: Main dashboard Overview tab showing cache statistics (hit rate, entries), usage chart with provider breakdown, and recent requests table -->
![Dashboard Overview](/images/projects/search-gateway/screenshot-1.png)

<!-- SCREENSHOT: Providers tab showing grid of provider cards with status indicators, quota usage bars, and per-provider metrics -->
![Provider Status Grid](/images/projects/search-gateway/screenshot-2.png)

<!-- SCREENSHOT: Testing tab with operation selector dropdown, provider chooser, parameter form, and JSON response viewer showing search results -->
![API Testing Interface](/images/projects/search-gateway/screenshot-3.png)

## Problem

Modern applications often need data from multiple external APIs: web search for research, news feeds for monitoring, academic papers for citations, social media for sentiment analysis. Each provider has its own API design, authentication, rate limits, pricing model, and failure modes. Managing this complexity leads to:

- **Scattered integration code** duplicated across services
- **No unified rate limiting** causing accidental overages
- **Expensive cache misses** when the same query hits multiple providers
- **No fallback** when a provider has an outage
- **Opaque costs** spread across many billing dashboards

Search Gateway centralizes all of this into one deployable service.

## Approach

The gateway implements a layered architecture where each request flows through authentication, budget checks, rate limiting, cache lookup, provider selection, and finally the adapter layer.

### Stack

- **API Framework** - FastAPI (Python 3.11+) for async request handling with automatic OpenAPI documentation
- **Database** - SQLite for zero-config deployment with tables for cache, usage events, budgets, and idempotency keys
- **Provider Adapters** - 27+ adapter classes inheriting from BaseAdapter with standardized retry logic and error handling
- **Rate Limiting** - Token bucket algorithm for smooth traffic shaping with per-client, per-provider limits
- **Reliability** - Circuit breaker pattern to prevent cascading failures when providers degrade
- **Frontend** - Next.js dashboard with Recharts for usage visualization and interactive API testing
- **Observability** - Prometheus metrics, OpenTelemetry tracing, structured JSON logging

### Challenges

- **Heterogeneous provider APIs** - Each provider returns different response formats. Solved by normalizing all responses to a unified schema (`SearchResult`, `ExtractResult`) while preserving provider-specific metadata in `provider_meta` fields.

- **Intelligent provider selection** - Need to pick the best provider based on operation type, availability, cost, and rate limits. Implemented `ProviderSelector` that consults the catalog, circuit breaker state, and rate limiter before routing requests.

- **Cache key design** - Same logical query through different providers should share cache where semantically equivalent. Designed composite cache keys that factor in query, operation type, and relevant parameters while ignoring provider-specific options.

- **Cost estimation before execution** - Budget enforcement requires knowing cost upfront, but some providers charge based on response size. Added pre-flight cost estimation with conservative defaults, then record actual cost post-execution.

## Outcomes

The gateway handles production workloads with sub-10ms cache hits and configurable fallback chains that have successfully routed around provider outages. The provider catalog YAML format makes it easy to add new providers without code changes to the routing logic.

Key technical wins:
- **78%+ cache hit rate** for typical research workloads, dramatically reducing API costs
- **Zero-downtime provider additions** via hot-reload of YAML configuration
- **Unified cost dashboard** showing actual spend vs cached savings across all providers
- **Idempotency support** preventing duplicate charges on network retries

## Implementation Notes

The adapter pattern provides clean separation between routing logic and provider specifics:

```python
class BaseAdapter(ABC):
    """All adapters inherit retry logic and error handling."""
    
    async def _request_with_retry(
        self,
        method: str,
        url: str,
        *,
        max_retries: int = 2,
        non_retryable_codes: tuple = (400, 401, 403, 404),
    ) -> httpx.Response:
        # Exponential backoff with jitter
        # Automatic 429 handling with Retry-After
        # Circuit breaker integration
        ...
```

Provider configuration is declarative YAML:

```yaml
providers:
  brave:
    ops: [search:web, search:news, ai:grounding, suggest]
    limits: { rps: 1, monthly_cap: 2000 }
    pricing_usd:
      search:web: 0.003
      ai:grounding:query: 0.004
    plans:
      free: { limits: { monthly_cap: 2000 } }
      base_ai: { limits: { monthly_cap: 20000000 } }
```

The fallback system supports automatic rerouting on various failure conditions:

```yaml
fallbacks:
  search:web:
    brave: { order: [tavily], on: [429, timeout, 5xx, circuit_open] }
    tavily: { order: [brave], on: [429, timeout, 5xx, circuit_open] }
```
