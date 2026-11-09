---
title: Generative Gateway
summary: An HTTP service that puts one API in front of LLM providers and logs the tokens and cost of every request
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

Generative Gateway is an HTTP service that sits between applications and the LLM providers they call.
The provider behind it is currently OpenRouter.
It gives applications one API for chat completions, embeddings, and messages that include images, PDFs or audio.
On top of that it records the cost of every request, keeps conversation sessions, streams responses, and exports metrics and traces.

Because apps call the gateway instead of a provider, switching models or providers doesn't need a code change in the app.
Every request is logged with its token counts, latency and estimated cost in USD.

## Screenshots

<!-- SCREENSHOT: Main chat interface showing multi-turn conversation with streaming response, model selector dropdown, and system prompt field -->
![Chat Interface](/images/projects/generative-gateway/screenshot-1.png)

<!-- SCREENSHOT: Models catalog page with searchable/sortable table showing model names, pricing per million tokens, context windows, and capability badges -->
![Model Catalog](/images/projects/generative-gateway/screenshot-2.png)

<!-- SCREENSHOT: Usage dashboard with charts showing daily token consumption, cost breakdown by model, and request counts over time -->
![Usage Dashboard](/images/projects/generative-gateway/screenshot-3.png)

## Problem

An app that calls LLMs usually needs to:

- Use more than one provider, or switch between them on cost, speed or availability
- Track usage and cost closely enough for billing and budgets
- Keep conversation history across sessions
- Handle streaming responses, tool calling, and images, PDFs and audio as input
- Support "thinking" models that do extended reasoning

Building all of that again for every app is slow and easy to get wrong.

## Approach

Requests come in through one schema, and an adapter layer translates them for each provider.

### Stack

- FastAPI, for its async support, automatic OpenAPI docs and Pydantic request validation
- Next.js 16 and React 19 for the web UI, with React Query for data fetching and server components
- SQLite, so there is no database server to deploy; the schema is written to move to PostgreSQL if it needs to scale
- OpenTelemetry for distributed tracing and metrics, which can export to any observability backend
- httpx as the async HTTP client for provider requests, including streaming
- Server-Sent Events to stream token deltas, reasoning output and generated images

### Challenges

- Providers each handle extended reasoning differently: DeepSeek uses a `:thinking` suffix, Claude uses `budget_tokens`, Gemini uses `effort` levels. The gateway takes one `thinking` setting, and the adapter layer maps it to each provider's version.

- Text, images (base64 or URL), PDFs and audio all fit in one message format through a `ContentPart` union type, which validates content against the message type and the model's capabilities.

- Generated images stay in the conversation history so later requests have them as context. They are stored as base64 in the session store and decoded when the history is loaded for the next request.

- Accurate USD costs need per-model token pricing, which changes often. The gateway pulls current rates from OpenRouter and caches them locally, and an endpoint refreshes them on demand.

## Outcomes

- One API across 100+ models from different providers
- Every request logged with its input and output tokens and its USD cost
- Conversation history kept automatically and loaded lazily
- Retries with exponential backoff, and hedged requests for calls where latency matters
- Prometheus metrics, OpenTelemetry traces and structured JSON logs

The adapters handled the differences between provider APIs well.
Most of the complexity was in normalizing responses, because providers return reasoning, tool calls and multi-modal content in wildly different structures.

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
