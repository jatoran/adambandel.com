---
title: Generative Gateway
summary: Provider-agnostic HTTP gateway for LLM APIs with unified schemas, usage tracking, and cost management
started: 2025-11-07
updated: 2026-01-04
type: api
stack:
  - Python
  - FastAPI
  - TypeScript
  - Next.js
  - SQLite
  - OpenTelemetry
tags:
  - ai
  - developer-tools
  - api
loc: 7716
files: 49
architecture:
  auth: API key
  database: SQLite
  api: REST
  realtime: SSE
  background: none
  cache: in-memory
  search: none
---

## Overview

Generative Gateway is a provider-agnostic HTTP gateway that sits between client applications and multiple LLM providers (currently OpenRouter). It provides a unified API for chat completions, embeddings, and multi-modal interactions while adding enterprise-grade features like per-request cost tracking, session persistence, real-time streaming, and comprehensive observability.

The gateway abstracts away the complexity of different provider APIs, allowing applications to switch models or providers without code changes. It tracks every request with token counts, latency, and USD cost estimates, enabling teams to monitor and control their AI spending.

## Screenshots

<!-- SCREENSHOT: Main chat interface showing multi-turn conversation with streaming response, model selector dropdown, and system prompt field -->
![Chat Interface](/images/projects/generative-gateway/screenshot-1.png)

<!-- SCREENSHOT: Models catalog page with searchable/sortable table showing model names, pricing per million tokens, context windows, and capability badges -->
![Model Catalog](/images/projects/generative-gateway/screenshot-2.png)

<!-- SCREENSHOT: Usage dashboard with charts showing daily token consumption, cost breakdown by model, and request counts over time -->
![Usage Dashboard](/images/projects/generative-gateway/screenshot-3.png)

## Problem

Modern AI applications often need to:
- Use multiple LLM providers or switch between them based on cost, performance, or availability
- Track usage and costs at a granular level for billing and budgeting
- Maintain conversation history across sessions
- Handle streaming responses, tool calling, and multi-modal inputs (images, PDFs, audio)
- Support "thinking" models with extended reasoning capabilities

Building these features from scratch for each application is time-consuming and error-prone. Existing solutions either lock you into a single provider or lack the observability needed for production workloads.

## Approach

The gateway implements a layered architecture that cleanly separates concerns while maintaining flexibility.

### Stack

- **FastAPI** - Async Python framework chosen for its native async support, automatic OpenAPI documentation, and Pydantic integration for request validation
- **Next.js 16 + React 19** - Modern frontend stack with React Query for data fetching and server components for optimal performance
- **SQLite** - Embedded database for zero-config deployment; schema supports easy migration to PostgreSQL for scaling
- **OpenTelemetry** - Distributed tracing and metrics collection, exportable to any observability backend
- **httpx** - Async HTTP client for provider requests with streaming support
- **Server-Sent Events** - Real-time streaming of token deltas, reasoning output, and generated images

### Challenges

- **Unified Thinking Interface** - Different providers implement extended reasoning differently (DeepSeek uses `:thinking` suffix, Claude uses `budget_tokens`, Gemini uses `effort` levels). Solved by mapping a single `thinking` configuration to provider-specific implementations at the adapter layer.

- **Multi-Modal Message Handling** - Supporting text, images (base64/URL), PDFs, and audio in a single message format required careful schema design. Implemented a `ContentPart` union type that validates content based on message type and model capabilities.

- **Session Persistence with Images** - Storing generated images in conversation history for context continuity. Images are persisted as base64 in the session store and properly decoded when loading history for subsequent requests.

- **Real-Time Cost Tracking** - Computing accurate USD costs requires knowing per-model token pricing, which changes frequently. Implemented a pricing refresh system that pulls current rates from OpenRouter and caches them locally, with manual refresh endpoint for immediate updates.

## Outcomes

The gateway successfully provides:

- **Provider Abstraction** - Single API works across 100+ models from different providers
- **Cost Visibility** - Every request logged with input/output tokens and USD cost
- **Session Management** - Automatic conversation history with lazy loading
- **Resilience** - Retry with exponential backoff, hedged requests for latency-sensitive calls
- **Observability** - Prometheus metrics, OpenTelemetry traces, structured JSON logging

Key learning: The adapter pattern works well for provider abstraction, but the real complexity lives in normalizing response formats. Provider APIs return reasoning, tool calls, and multi-modal content in wildly different structures.

## Implementation Notes

### Streaming Architecture

The gateway uses Server-Sent Events with typed event payloads:

```python
# Event types for structured streaming
class SSEEvent:
    META = "meta"        # Session ID, model info
    TOKEN = "token"      # Text delta
    REASONING = "reasoning"  # Thinking output
    TOOL_CALLS = "tool_calls"  # Function calls
    IMAGES = "images"    # Generated image data
    DONE = "done"        # Final usage stats
```

### Model Resolution

Fuzzy matching with rapidfuzz allows users to reference models by partial names:

```python
# User can request "claude-3.5" instead of full ID
model = resolve_model("claude-3.5")
# Returns: "anthropic/claude-3.5-sonnet"
```

### Cost Calculation

Every request calculates cost using cached pricing:

```python
cost_usd = (
    (input_tokens / 1_000_000) * pricing.input_per_million +
    (output_tokens / 1_000_000) * pricing.output_per_million +
    (web_searches * 0.01)  # If web search enabled
)
```

### Rate Limiting

Token bucket algorithm with per-project-per-minute buckets:

```python
@dataclass
class TokenBucket:
    tokens: float
    last_refill: float
    capacity: int
    refill_rate: float  # tokens per second
```
