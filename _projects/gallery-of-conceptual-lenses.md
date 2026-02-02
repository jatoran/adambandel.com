---
title: Gallery of Conceptual Lenses
summary: A perspective engineering tool that selects maximally diverse analytical frameworks for complex problems using embedding-space geometry.
date: 2025-01-15
---

## Overview

Gallery of Conceptual Lenses is a "perspective engineering" engine that inverts the typical semantic search paradigm. Rather than finding concepts *similar* to a problem, it finds concepts that are *relevantly different* - constructing a maximum-entropy bounding box of analytical frameworks around any complex question.

The tool addresses a fundamental limitation of LLM reasoning: the tendency toward premature convergence on familiar solutions. By forcing analysis through deliberately orthogonal lenses (e.g., "Quantum Metrology x Afro-Futurism x Red-Teaming"), it expands the cognitive search space before synthesis occurs.

## Screenshots

<!-- SCREENSHOT: Streamlit UI showing the Lens Discovery tab with a problem statement entered, knob selection panel visible, and the 2D PCA/UMAP visualization displaying chosen lenses (green circles) spread around the centered problem point (pink star) -->
![Lens Discovery Interface](/images/projects/gallery-of-conceptual-lenses/screenshot-1.png)

<!-- SCREENSHOT: The pairwise cosine similarity heatmap showing low correlation (dark colors) between selected lenses, demonstrating the MaxMin diversity algorithm's effectiveness -->
![Diversity Heatmap](/images/projects/gallery-of-conceptual-lenses/screenshot-2.png)

<!-- SCREENSHOT: The Synapse Orchestrator tab showing Phase 1 parallel lens analyses expanded, with multiple lens perspectives displayed side-by-side -->
![SynapseFlow Orchestrator](/images/projects/gallery-of-conceptual-lenses/screenshot-3.png)

## Problem

Complex problems require multiple perspectives, but humans and LLMs naturally gravitate toward familiar frameworks. Traditional semantic search exacerbates this by returning *similar* concepts when what's needed are *different-but-relevant* ones.

The challenge: How do you systematically discover analytical lenses that are semantically grounded in a problem while being maximally different from each other?

## Approach

The system treats perspective selection as a geometric optimization problem in embedding space.

### Stack

- **Embeddings** - OpenAI `text-embedding-3-large` (1536-dim) or local `sentence-transformers` for converting concepts and problems into vector space
- **Taxonomy Engine** - 11-category knowledge taxonomy (2000+ concepts across disciplines, epistemic schools, reasoning modes, cultural roots, etc.) stored in `lenses_config.py`
- **Diversity Algorithm** - Custom MaxMin greedy selection that maximizes the minimum distance between chosen lenses
- **Visualization** - Plotly for interactive 2D projections (PCA centered on problem), Seaborn for similarity heatmaps
- **Interface** - Streamlit for interactive exploration, argparse CLI for batch processing
- **Orchestration** - SynapseFlow multi-agent system for parallel LLM analysis through selected lenses

### Challenges

- **Combinatorial Explosion** - With 11 taxonomy categories and multi-part lens combinations (e.g., Discipline x Epistemic School x Reasoning Mode), the candidate space reaches billions. Solved with Monte Carlo sampling that generates up to 10,000 random candidates while maintaining uniform probability across the space.

- **Noise in Composite Lenses** - Multi-part lenses like "Quantum Optics x Afro-Pessimism x Haiku Sequence" can produce semantically incoherent embeddings. Addressed with dynamic relevance thresholds that increase proportionally with lens complexity (+0.025 per additional part).

- **Visualization of High-Dimensional Geometry** - Standard UMAP/t-SNE distorts the actual distance relationships we're optimizing for. Solved by centering PCA on the problem vector and fitting axes only on chosen lenses, making the selection geometry interpretable.

## Outcomes

The system reliably produces lens sets with low pairwise similarity (typically 0.2-0.4 cosine) while maintaining semantic relevance to the input problem. The SynapseFlow Orchestrator demonstrates that parallel, lens-segregated LLM analysis followed by friction-aware synthesis produces richer insights than single-pass reasoning.

Key learnings: Embedding space geometry is surprisingly effective for "diversity optimization" problems. The MaxMin algorithm, despite its simplicity, consistently outperforms random sampling for perspective coverage.

## Implementation Notes

The core selection algorithm is a greedy MaxMin approach:

```python
# Anchor: highest relevance to problem
first_lens = argmax(similarity_to_problem)

# Iterative: maximize minimum distance to already-selected set  
while len(selected) < max_lenses:
    next_lens = argmax(
        min(1 - cosine_sim(candidate, selected_lens) 
            for selected_lens in selected)
        for candidate in remaining_candidates
    )
    if min_distance < separation_threshold:
        break
    selected.append(next_lens)
```

The taxonomy spans 11 knowledge categories:
- `discipline` - 150+ scientific/technical fields
- `epistemic_school` - 160+ philosophical frameworks  
- `reasoning_mode` - 140+ analytical techniques
- `framework_or_theory` - 140+ formal theories
- `rhetoric_style` - 95+ output formats
- `cultural_root` - 90+ mythological/folkloric traditions
- `perspective_role` - 70+ stakeholder viewpoints
- `temporal_lens` - 90+ historical/future periods
- `scale_granularity` - 80+ measurement scales
- `value_framework` - 100+ ethical/value metrics
- `cognitive_bias_probe` - 65+ bias checks

Composite lenses are computed as the mean of constituent embeddings, enabling arbitrary cross-category combinations without additional API calls.
