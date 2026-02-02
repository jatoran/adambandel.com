---
title: Generative Gateway
summary: A provider-agnostic API gateway for LLMs with usage tracking, budget enforcement, and unified reasoning APIs
date: 2026-01-04
---

## Overview

Generative Gateway is a production-ready API gateway that abstracts the complexity of working with multiple AI providers behind a single, OpenAI-compatible interface. It solves the common pain points of building AI-powered applications: provider lock-in, unpredictable costs, fragmented APIs, and lack of observability.

The gateway acts as a smart middleware layer, routing requests to upstream providers while adding enterprise features like per-project budgets, detailed cost tracking, session persistence, and unified support for advanced capabilities like reasoning models and multi-modal inputs.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing usage metrics, recent requests, and cost breakdown charts -->
![Dashboard Overview](/images/projects/generative-gateway/screenshot-1.png)

<!-- SCREENSHOT: Chat interface demonstrating streaming response with reasoning/thinking output visible -->
![Chat Interface with Reasoning](/images/projects/generative-gateway/screenshot-2.png)

<!-- SCREENSHOT: Models catalog page showing available models with capability badges (vision, PDF, reasoning) -->
![Model Catalog](/images/projects/generative-gateway/screenshot-3.png)

<!-- SCREENSHOT: Admin panel showing project configuration with budget limits and API key management -->
![Admin Project Settings](/images/projects/generative-gateway/screenshot-4.png)

## Problem

Building applications on top of LLMs presents several challenges that compound as projects scale:

**Cost blindness** - Without detailed usage tracking, AI costs can spiral unexpectedly. A single runaway loop or inefficient prompt can burn through budgets overnight.

**Provider fragmentation** - Each AI provider has different APIs, authentication methods, and feature sets. Switching providers or using multiple models requires significant code changes.

**Reasoning API chaos** - DeepSeek uses `:thinking` suffixes, Claude uses `thinking.budget_tokens`, Gemini uses `reasoning.effort`, and OpenAI's o-series has its own approach. Every model family invented their own way to expose chain-of-thought reasoning.

**Session management burden** - Managing conversation history client-side adds complexity and makes it harder to debug issues or analyze usage patterns.

## Approach

The gateway takes a unified abstraction approach, presenting a single OpenAI-compatible API while handling provider-specific translations internally.

### Stack

- **FastAPI** - Async Python framework for high-performance request handling with automatic OpenAPI documentation
- **Next.js 16** - React 19 frontend with TanStack Query for real-time dashboard updates
- **SQLite/PostgreSQL** - Flexible storage layer for usage logs, sessions, and model catalog
- **OpenTelemetry** - Distributed tracing and Prometheus metrics for production observability
- **Pydantic v2** - Schema validation ensuring type safety across the API boundary

### Challenges

- **Unified reasoning interface** - Built an adapter layer that translates a single `thinking` parameter into provider-specific formats. The gateway automatically appends `:thinking` suffixes for DeepSeek, sets `thinking.budget_tokens` for Claude, and configures `reasoning.effort` for Gemini—all from one consistent API.

- **Accurate cost tracking** - Token counting varies by provider and content type (text, audio, cached tokens). Implemented detailed breakdown tracking that captures input/output/reasoning tokens separately for precise cost attribution.

- **SSE streaming complexity** - Streaming responses require careful event ordering: reasoning chunks must arrive before content, tool calls need proper delta formatting, and image generation results arrive asynchronously. Built a streaming layer that handles all edge cases while maintaining a simple client interface.

- **Multi-modal content handling** - Supporting images, PDFs, and audio alongside text required a flexible content parts system. The gateway accepts mixed content arrays and routes them appropriately based on model capabilities.

## Outcomes

The gateway handles the full spectrum of LLM interactions through a single, consistent API:

```python
# Same endpoint works for any provider
response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4",  # or deepseek/deepseek-r1, google/gemini-2.0-flash-thinking
    messages=[{"role": "user", "content": "Analyze this data..."}],
    thinking={"enabled": True, "budget_tokens": 10000},  # Unified reasoning API
    session_id="user-123-session"  # Server-side conversation persistence
)
```

Key capabilities working in production:
- Real-time cost tracking with configurable daily budget caps
- Session persistence eliminating client-side history management  
- Streaming support with proper SSE event formatting for reasoning output
- Model catalog with capability detection (vision, PDF, audio, tool calling)
- Dry-run mode for cost estimation before execution

## Implementation Notes

The adapter pattern is central to the architecture. Each provider adapter translates the unified request format into provider-specific calls:

```python
# Simplified adapter interface
class ProviderAdapter:
    async def complete(self, request: ChatRequest) -> ChatResponse:
        # Transform request to provider format
        provider_request = self._transform_request(request)
        
        # Handle reasoning parameter translation
        if request.thinking and request.thinking.enabled:
            provider_request = self._apply_reasoning_config(provider_request)
        
        # Execute and normalize response
        raw_response = await self._call_provider(provider_request)
        return self._normalize_response(raw_response)
```

The session system stores conversation turns server-side, keyed by `session_id`. This enables features like conversation branching, replay for debugging, and cross-device continuity without requiring clients to manage message history.

Budget enforcement runs as middleware, checking accumulated daily spend before each request. When a project approaches its limit, requests are rejected with a clear error rather than incurring overage charges.
