---
title: Search Gateway
summary: One API for web search and fetching page content through many providers, with fallbacks, caching and cost tracking
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

Search Gateway is a REST API that puts 27+ search and content extraction providers behind one interface.
Applications query Brave, Tavily, DuckDuckGo, arXiv, GitHub, Reddit, YouTube, Wikipedia and the rest with the same request and response schemas, and when a provider fails, the request falls back along a chain to the next one.

The gateway holds the API keys and handles rate limits, cost tracking and caching, so the applications that call it only deal with their own search logic.
It is meant for AI agents, developer tools and other applications that need web search and page content with the costs kept under control.
My News Aggregator gets its Reddit posts and article text through it.

## Screenshots

<!-- SCREENSHOT: Swagger UI documentation page showing the /v1/search endpoint with request/response schemas -->
![API Documentation](/images/projects/search-gateway/screenshot-1.png)

<!-- SCREENSHOT: Prometheus metrics dashboard showing request rates, latencies, and cache hit ratios per provider -->
![Metrics Dashboard](/images/projects/search-gateway/screenshot-2.png)

## Problem

Applications that search the web, fetch articles, query academic papers or extract content from URLs end up integrating several providers, and each one (Brave, Tavily, DuckDuckGo and so on) has its own API, rate limits, pricing and capabilities.
Maintaining 10+ of those integrations is a lot of upkeep.
Each has its own authentication and schema and needs its own throttling, there is no common fallback when one fails or rate-limits, costs are hard to track across pay-per-use services, and every integration repeats the same caching logic.

Search Gateway handles all of that in one place, with routing by operation, automatic retries, metrics and tracing.

## Approach

### Stack

- FastAPI: async, so calls to several providers run concurrently.
- SQLite: response cache, usage tracking and idempotency, with no external database to run.
- Redis, optional: coordinates rate limits across replicas when the gateway runs more than one.
- Playwright: a headless browser for extracting JavaScript-heavy pages that block ordinary crawlers.
- Prometheus and OpenTelemetry: metrics export and distributed tracing.

### Challenges

- Provider abstraction: each of the 27+ providers has its own quirks. A `BaseAdapter` class holds the shared retry logic, exponential backoff and capability declarations, and each adapter implements the same interface while handling its provider's transformations internally.

- Fallback routing: not every provider supports every operation. A `ProviderSelector` maps each operation (search:web, search:news, extract:web, search:academic) to the providers that can do it, in priority order, and skips any provider whose circuit breaker is open.

- Cost tracking: providers charge per request, per credit or by tiered plan. A cost estimation engine reads the provider catalog YAML and calculates spend as requests happen, taking the plan tier into account.

- Stale-while-revalidate caching: some cache modes serve a stale result immediately and refresh it in the background, which cuts the wait for requests that don't need the freshest data.

## Outcomes

All 27+ providers answer through the same schemas, fallbacks route around failing providers automatically, and costs are tracked per client, so each client can have its own spending budget.

Providers change their schemas, rate limits and behavior without notice, so the adapters have to be written defensively.
The circuit breakers are what let the gateway keep working when a provider goes down.

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
