---
title: Gallery of Conceptual Lenses
summary: Diversity-maximizing engine that selects orthogonal analytical frameworks for multi-perspective problem analysis
started: 2025-05-18
updated: 2025-11-26
type: web-app
stack:
  - Python
  - Streamlit
  - OpenAI Embeddings
  - sentence-transformers
  - NumPy
  - scikit-learn
  - UMAP
  - Plotly
tags:
  - ai
  - developer-tools
  - data
loc: 2338
files: 3
architecture:
  auth: API key
  database: none
  api: REST
  realtime: none
  background: none
  cache: file
  search: none
---

## Overview

Gallery of Conceptual Lenses is a perspective engineering engine that goes beyond traditional semantic search to construct a "maximum entropy bounding box" of diverse analytical frameworks around any problem statement. Rather than finding similar concepts, it optimizes for *diversity within relevance*—forcing users to examine issues through distinct, non-obvious theoretical lenses from disciplines, philosophies, and cognitive frameworks they might never have considered.

The system maintains a curated taxonomy of 1000+ concepts across eight dimensions (disciplines, epistemic schools, rhetorical styles, value frameworks, formal structures, cognitive bias probes, temporal horizons, and scale granularities), then applies MaxMin greedy optimization to select a set of lenses that are both relevant to the problem and maximally distant from each other in semantic space.

## Screenshots

<!-- SCREENSHOT: Streamlit UI showing the main "Lens Discovery" tab with a problem statement entered and the diversity-relevance parameter sliders visible -->
![Lens Discovery Interface](/images/projects/gallery-of-conceptual-lenses/screenshot-1.png)

<!-- SCREENSHOT: UMAP 2D visualization showing the problem (pink), selected lenses (green), and candidate pool (blue/gray) with clear separation between chosen lenses -->
![UMAP Diversity Visualization](/images/projects/gallery-of-conceptual-lenses/screenshot-2.png)

<!-- SCREENSHOT: Pairwise similarity heatmap of the final selected lenses demonstrating low inter-lens correlation -->
![Lens Diversity Heatmap](/images/projects/gallery-of-conceptual-lenses/screenshot-3.png)

## Problem

When analyzing complex problems, humans default to familiar frameworks—an economist sees market failures, an engineer sees systems to optimize, a philosopher sees ethical dilemmas. This tunnel vision limits solution quality. Existing tools like semantic search only exacerbate this by returning *similar* content, reinforcing existing biases rather than challenging them.

The goal was to build a system that could systematically inject intellectual diversity into any analysis, surfacing perspectives from quantum physics, indigenous knowledge systems, game theory, deep ecology, or chaos mathematics—whichever combination maximizes the analytical coverage of the problem space.

## Approach

### Stack

- **Streamlit** - Interactive UI for real-time parameter tuning and visualization; same codebase supports CLI for batch processing
- **OpenAI text-embedding-3-large** - High-dimensional (1536d) semantic representations for taxonomy concepts and problem statements
- **sentence-transformers** - Local fallback embeddings for offline development and cost reduction
- **scikit-learn** - Cosine similarity calculations and candidate filtering
- **UMAP** - Dimensionality reduction for intuitive 2D visualization of the lens selection process
- **NumPy** - Vector operations including the composite lens averaging strategy

### Challenges

- **Combinatorial explosion** - With 8 taxonomy dimensions and hundreds of values each, full enumeration is intractable. Solved via Monte Carlo reservoir sampling that caps candidate pools at ~10,000 while maintaining statistical representativeness.

- **Composite lens semantics** - Multi-part lenses like "Game Theory × Deep Ecology" don't exist in embedding space. Implemented on-the-fly vector averaging with dynamic threshold adjustment (+0.025 per part beyond 2) to prevent noisy combinations from appearing falsely relevant.

- **Diversity vs relevance tension** - Pure diversity optimization ignores problem context; pure relevance optimization returns similar lenses. The MaxMin greedy algorithm with minimum separation constraints (0.15 cosine distance) achieves the optimal trade-off.

## Outcomes

The system successfully generates lens sets where every pair has low semantic overlap, verified visually via the pairwise heatmap. In practice, a problem like "impact of AI on employment" might yield lenses spanning behavioral economics, philosophy of mind, labor history, systems dynamics, and speculative fiction—none of which an unaided human would likely combine.

The architecture demonstrates that diversity optimization is a tractable alternative to similarity search for certain creative and analytical applications. The embedding cache strategy reduces API costs by 95%+ after initial taxonomy pre-computation.

## Implementation Notes

The core diversity selection uses a MaxMin greedy algorithm that anchors on the most relevant lens, then iteratively selects whichever remaining candidate maximizes the minimum distance to all already-selected lenses:

```python
def step4_pick_far_apart_lenses(relevant_lenses, n_lenses, min_separation):
    # Anchor: highest similarity to problem
    chosen = [max(relevant_lenses, key=lambda x: x.similarity)]

    while len(chosen) < n_lenses:
        best_candidate = None
        best_min_dist = -1

        for candidate in remaining:
            # MaxMin criterion: maximize the minimum distance
            min_dist = min(cosine_distance(candidate, c) for c in chosen)
            if min_dist > best_min_dist and min_dist >= min_separation:
                best_min_dist = min_dist
                best_candidate = candidate

        if best_candidate:
            chosen.append(best_candidate)
        else:
            break  # No candidates meet separation threshold

    return chosen
```

The dual CLI/Streamlit architecture detects runtime environment via `sys.streamlit_is_running`, enabling the same `main.py` to serve both headless batch processing and interactive exploration without code duplication.
