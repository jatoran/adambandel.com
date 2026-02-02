---
title: Search Gateway
summary: Unified REST API aggregating 27+ search and content extraction providers with fallbacks, caching, and cost tracking
started: 2025-11-07
updated: 2025-12-15
type: api
stack:
  - Python
  - FastAPI
  - SQLite
  - Redis
  - Playwright
  - Prometheus
tags:
  - developer-tools
  - ai
  - data
  - automation
loc: 19941
files: 107
architecture:
  auth: API key
  database: SQLite
  api: REST
  realtime: none
  background: none
  cache: SQLite + Redis
  search: none
---

## Overview

Search Gateway is a unified REST API that aggregates 27+ search and content extraction providers behind a single endpoint. It enables applications to query Brave, Tavily, DuckDuckGo, arXiv, GitHub, Reddit, YouTube, Wikipedia, and many more through consistent request/response schemas, with automatic fallback chains when providers fail.

The gateway handles the complexity of managing multiple API keys, rate limits, cost tracking, and caching so consumers can focus on their search logic rather than provider integration. It is designed for AI agents, developer tools, and any application requiring reliable, cost-controlled access to diverse web search and content sources.

## Screenshots

<!-- SCREENSHOT: Swagger UI documentation page showing the /v1/search endpoint with request/response schemas -->
![API Documentation](/images/projects/search-gateway/screenshot-1.png)

<!-- SCREENSHOT: Prometheus metrics dashboard showing request rates, latencies, and cache hit ratios per provider -->
![Metrics Dashboard](/images/projects/search-gateway/screenshot-2.png)

## Problem

Modern applications often need to search the web, fetch articles, query academic papers, or extract content from URLs. Each provider (Brave, Tavily, DuckDuckGo, etc.) has different APIs, rate limits, pricing models, and capabilities. Managing 10+ provider integrations creates significant maintenance burden:

- Different authentication mechanisms and API schemas
- Varying rate limits requiring per-provider throttling
- No unified fallback when a provider fails or rate-limits
- Difficulty tracking costs across pay-per-use services
- Redundant caching logic in each integration

Search Gateway solves this by providing one API to rule them all, with intelligent routing, automatic retries, and comprehensive observability.

## Approach

### Stack

- **FastAPI** - High-performance async Python framework handling concurrent provider calls efficiently
- **SQLite** - Lightweight persistence for response caching, usage tracking, and idempotency without external dependencies
- **Redis** (optional) - Multi-replica rate limit coordination for horizontal scaling
- **Playwright** - Headless browser extraction for JavaScript-heavy pages that block traditional crawlers
- **Prometheus + OpenTelemetry** - Full observability with metrics export and distributed tracing

### Challenges

- **Provider abstraction** - Each of the 27+ providers has unique quirks. Created a `BaseAdapter` class with standardized retry logic, exponential backoff, and capability declarations. Adapters implement a consistent interface while handling provider-specific transformations internally.

- **Intelligent fallback routing** - Not all providers support all operations. Built a `ProviderSelector` that maps operations (search:web, search:news, extract:web, search:academic) to capable providers, respecting priority order and circuit breaker states.

- **Cost tracking accuracy** - Providers use different pricing models (per-request, per-credit, tiered plans). Implemented a cost estimation engine that reads provider catalog YAML and calculates real-time spend with tier awareness.

- **Stale-while-revalidate caching** - For high-availability, implemented cache modes that can serve stale data immediately while refreshing in the background, reducing perceived latency for non-critical freshness requirements.

## Outcomes

The gateway successfully abstracts provider complexity, reducing integration effort from weeks to hours for new applications. Key achievements:

- **27+ providers** integrated with consistent schemas
- **Sub-second** average response times with aggressive caching
- **Zero-config fallbacks** that automatically route around failures
- **Accurate cost tracking** enabling budget controls per client

Learned the importance of defensive coding when dealing with third-party APIs - providers change schemas, rate limits, and behaviors without notice. The circuit breaker pattern proved essential for graceful degradation.

## Implementation Notes

### Provider Adapter Pattern

Each provider extends `BaseAdapter` with standardized retry logic:

```python
class BraveAdapter(BaseAdapter):
    name = "brave"
    base_url = "https://api.search.brave.com/res/v1"
    
    def capabilities(self) -> Dict[str, Any]:
        return {
            "ops": ["search:web", "search:news", "ai:grounding"],
            "filters_supported": ["include_domains", "freshness_days"],
            "options_supported": ["max_results", "safesearch"],
        }
    
    async def search(self, req: SearchRequestModel) -> List[SearchResult]:
        response = await self._request_with_retry(
            "GET", f"{self.base_url}/web/search",
            params={"q": req.query, "count": req.options.max_results}
        )
        return self._transform_results(response.json())
```

### Operation-Based Routing

The selector routes by operation category, not just provider name:

```python
selection = selector.select(
    operation="search:academic",  # Routes to arXiv, Semantic Scholar, OpenAlex
    client_id=x_client_id,
    fallback=True,
)
# Returns prioritized list: ["arxiv", "semantic_scholar", "openalex"]
```

### Rate Limiting with Token Bucket

Per-client, per-provider rate limiting with burst allowance:

```python
class TokenBucket:
    def allow(self) -> bool:
        now = time.monotonic()
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

### Provider Catalog Configuration

All provider metadata lives in `provider-catalog.yaml`:

```yaml
providers:
  brave:
    ops: ["search:web", "search:news", "ai:grounding"]
    limits: { rps: 1, monthly_cap: 2000 }
    pricing_usd:
      "search:web": 0.003
    plans:
      free:
        limits: { rps: 1, monthly_cap: 2000 }
      pro_ai:
        limits: { rps: 50 }
        pricing_usd: { "search:web": 0.009 }
```
