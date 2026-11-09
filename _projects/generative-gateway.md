---
title: Generative Gateway
summary: An HTTP service that puts one API in front of every kind of model OpenRouter serves, from chat to video, and logs what each request actually cost
started: 2025-11-07
updated: 2026-11-07
type: api
stack:
  - Python
  - FastAPI
  - TypeScript
  - Next.js
  - SQLite
  - OpenRouter
  - OpenTelemetry
  - Docker
tags:
  - ai
  - developer-tools
  - api
loc: 16505
files: 74
architecture:
  auth: project ID, optional API key and HMAC signature
  database: SQLite
  api: REST, plus an OpenAI-compatible route
  realtime: SSE
  background: asyncio tasks
  cache: in-memory
  search: none
---

## Overview

Generative Gateway is an HTTP service that sits between my apps and the models they call.
Everything goes upstream through OpenRouter, and the gateway puts one API over all of it: chat with images, PDFs or audio as input, plus embeddings, reranking, speech, transcription, image and video generation, and structured decision models.
That came to about 600 models when the catalog sync was fixed in September 2026.
On top of that it records the cost of every request, keeps conversation sessions, streams responses, enforces per-project budgets and rate limits, and exports metrics and traces.

Because apps call the gateway instead of a provider, switching models or vendors is a change to the model name, not to how the app makes the call.
Every request is logged with its token counts, latency and the cost OpenRouter actually charged for it.
My own apps and the coding agents I run call models through it instead of calling a provider directly; [Music Analyzer](/projects/music-analyzer/) and [Personal Media Feed](/projects/personal-media-feed/) are two of them.
It has run on my home server as a Docker Compose stack, the API plus a Next.js dashboard, since July 2026.

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

Requests come in through one schema per route, and an adapter layer translates them for OpenRouter, which fronts the model vendors.
OpenRouter still leaves plenty of differences in place, and those are what the adapters handle: each vendor's reasoning settings, a different upstream endpoint for each kind of output, and usage reports in different shapes.

### Routes

- `POST /v1/chat` for text and image output, streamed or not, with sessions, tool calling, web search, structured output and reasoning
- `POST /v1/embeddings`, `/v1/rerank`, `/v1/audio/speech`, `/v1/audio/transcriptions`, `/v1/images` and `/v1/decisions`, one route per kind of output
- `POST /v1/videos`, which is asynchronous: submit the job, poll it, then download the video through the gateway
- `POST /openai/v1/chat/completions`, an OpenAI-compatible route for tools that only take a base URL, a key and a model name. It forwards the request untouched and returns what OpenRouter answered, and its one job is writing the usage row.
- `GET /v1/models`, the catalog with prices, capabilities and the route that serves each model. A model sent to the wrong route gets a 400 naming the right one, instead of an upstream error relayed as a retryable 502.

### Stack

- FastAPI, for its async support, automatic OpenAPI docs and Pydantic request validation
- Next.js 16 and React 19 for the dashboard, with React Query for data fetching and Recharts for the charts
- SQLite, so there is no database server to deploy; the live database holds about 2.3 GB of usage, pricing and session history
- httpx as the async HTTP client for upstream requests, including streaming
- Server-Sent Events to stream token deltas, reasoning output, tool calls and generated images
- Prometheus metrics, structured JSON logs rolled to files, and OpenTelemetry traces when an OTLP endpoint is configured
- Docker Compose on my home server, deployed from my PC

### Challenges

- Providers each handle extended reasoning differently: DeepSeek uses a `:thinking` suffix, Claude uses `budget_tokens`, Gemini uses `effort` levels. The gateway takes one `thinking` setting, and the adapter layer maps it to each provider's version. An effort level now resolves to a share of the request's output budget, and the output budget is raised when needed, because Anthropic rejects a thinking budget that is not smaller than `max_tokens`.

- Text, images (base64 or URL), PDFs and audio all fit in one message format through a `ContentPart` union type, and attachments are checked against what the model accepts before anything is sent upstream.

- Until June 2026 the logged cost was a price-table estimate, and it came out 1.5 to 3.7 times lower than what OpenRouter actually charged. The parser read a cost field that does not exist, so it always fell back to the estimate, and one model name can be served by several upstream providers at very different prices. The gateway now records the `usage.cost` OpenRouter returns with each response and estimates only when no cost comes back.

- The model sync asked OpenRouter for its default listing, which only has text models, so every image, embedding, speech, transcription and video model was missing from the catalog, and a call to one was logged at zero cost. The sync now asks for every output type.

- A reasoning model that spent its whole output budget thinking sent back no answer text, which crashed the gateway after the paid round trip: the caller was charged, got an error, and the spend never reached the ledger. That reply now comes back normally, flagged as truncated with the reason `reasoning_budget_exhausted`, so the caller can retry with a bigger budget.

## Outcomes

- One API across every kind of model OpenRouter serves
- Every request logged with its tokens, latency and cost in one ledger shared by all routes, including the unit behind the cost for images, audio and video
- Per-project budgets and a per-minute rate limit
- Retries with exponential backoff, optional hedged requests and fallback models, and a per-model circuit breaker that only counts provider faults, so one caller's bad requests cannot take a model offline for every other app
- A dashboard with cost by model, project or API key, daily or hourly in Central time, a page per project, the credit balance of each OpenRouter account, and an estimate of what those accounts spent outside the gateway

The adapters handled the differences between provider APIs well.
Most of the complexity was in normalizing responses, because providers return reasoning, tool calls and multi-modal content in wildly different structures.
Several of the fixes since January have been to the cost accounting, and those bugs logged a wrong number instead of failing loudly.

## Limits

- OpenRouter is the only upstream. There is no adapter that calls a model vendor directly.
- Sessions replay text only. Generated images and attachments are stored and shown in the session history, but a continued session does not send them back to the model.
- Rate limiting is a fixed one-minute window per project, kept in memory unless Redis is configured.
- The OpenAI-compatible route skips retries, budgets and the circuit breaker on purpose, because it forwards requests as they are.
- The realtime route is still a stub that returns 501.
- It runs on my own network, not the open internet.

## Implementation Notes

### Streaming

A streamed chat sends typed Server-Sent Events: `meta` with the request ID, model and session, then `token`, `reasoning`, `tool_calls` and `images` as they arrive, `error` if the upstream fails mid-stream, and `done` with the token counts, latency, the provider's `finish_reason`, and whether the reply was truncated and why.

### Cost Calculation

The cost comes from OpenRouter's own usage block:

```python
# Authoritative cost: OpenRouter returns the actual amount charged in
# usage.cost (credits == USD) because the adapter sends usage.include=true.
# This reflects the specific upstream provider that served the request,
# which varies per call for multi-provider model slugs (e.g. DeepSeek V4
# Pro served by Novita vs Alibaba vs GMICloud at different prices).
usd = float(usage.get("cost") or 0.0)
provider_returned_cost = usage.get("cost") is not None
```

Only when `provider_returned_cost` is false does it fall back to tokens times the cached per-token price, plus the model's web search price, or $0.01 a search when the catalog has none.

### Model Resolution

A request can name a model by its full ID, OpenRouter's bare slug, or an alias.
`POST /v1/models/resolve` fuzzy-matches a typed name against display names and aliases with rapidfuzz:

```python
best = process.extractOne(q_norm, names, scorer=fuzz.token_sort_ratio) if names else None
if best is None:
    return {"id": None, "confidence": 0.0, "matched_alias": None}
match_name, score, _ = best
return {"id": display_to_id.get(match_name), "confidence": float(score) / 100.0, "matched_alias": match_name}
```

### Hedged Requests

A request can opt into hedging: if the first call has not answered within a set number of milliseconds, an identical second call starts, and whichever finishes first wins.

```python
async def hedged_call(
    call_factory: Callable[[], Awaitable[Tuple[int, Dict[str, Any]]]],
    hedge_after_ms: int = 200,
) -> Tuple[int, Dict[str, Any]]:
    task1 = asyncio.create_task(call_factory())
    try:
        await asyncio.wait_for(asyncio.shield(task1), timeout=hedge_after_ms / 1000.0)
        return await task1
    except asyncio.TimeoutError:
        task2 = asyncio.create_task(call_factory())
        done, pending = await asyncio.wait({task1, task2}, return_when=asyncio.FIRST_COMPLETED)
        for t in pending:
            t.cancel()
        done_task = done.pop()
        return await done_task
```
