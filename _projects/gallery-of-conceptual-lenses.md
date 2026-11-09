---
title: Gallery of Conceptual Lenses
summary: A brainstorming tool that picks perspectives for a problem, such as disciplines and philosophies, that are relevant but far apart from each other
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

Gallery of Conceptual Lenses takes a problem statement and picks a set of lenses for it, where a lens is a frame of thought: a discipline, a philosophy, a reasoning mode, a cognitive bias and so on.
Each lens has to be relevant to the problem, and together they have to be as far apart from each other in embedding space as possible.
That's the reverse of semantic search, which returns whatever is closest.
The chosen lenses go into a prompt template, so a model can work the problem from each of them.

The lenses come from a taxonomy of more than 1,000 concepts in 12 categories, among them disciplines, epistemic schools, rhetorical styles, value frameworks, formal structures, cognitive bias probes, time horizons and scales.
A greedy MaxMin selection then picks lenses that clear a relevance threshold and sit as far as possible from the ones already chosen.

## Screenshots

<!-- SCREENSHOT: Streamlit UI showing the main "Lens Discovery" tab with a problem statement entered and the diversity-relevance parameter sliders visible -->
![Lens Discovery Interface](/images/projects/gallery-of-conceptual-lenses/screenshot-1.png)

<!-- SCREENSHOT: UMAP 2D visualization showing the problem (pink), selected lenses (green), and candidate pool (blue/gray) with clear separation between chosen lenses -->
![UMAP Diversity Visualization](/images/projects/gallery-of-conceptual-lenses/screenshot-2.png)

<!-- SCREENSHOT: Pairwise similarity heatmap of the final selected lenses demonstrating low inter-lens correlation -->
![Lens Diversity Heatmap](/images/projects/gallery-of-conceptual-lenses/screenshot-3.png)

## Problem

One day I spent a long time researching prompt engineering and current work on latent space, and went down a side rabbit hole: how do you extend a model's horizon?

When you send a prompt to an LLM, it activates the neurons and connections in the hidden layers that relate to the prompt, and a lot of the latent space goes unused.
That's generally good, because it's efficient and gives you something related to what you asked.
But if you want the model to be more creative, you want it searching through things as different from the prompt as possible.

People have the same habit with familiar frameworks: an economist sees market failures, an engineer sees systems to optimize, a philosopher sees ethical dilemmas.
Semantic search makes it worse, because it returns content similar to what you already asked.
The goal was a way to pull in perspectives from anywhere (quantum physics, indigenous knowledge systems, game theory, deep ecology, chaos mathematics), in whatever combination covers the most ground around the problem.

## Approach

### Stack

- Streamlit for the UI, with controls for the parameters and the plots. The same `main.py` also runs from the command line for batch runs.
- OpenAI `text-embedding-3-large` for embedding the taxonomy and the problem statement, at 3,072 dimensions.
- sentence-transformers (`all-MiniLM-L6-v2`) as a local fallback, for offline work and to cut API cost.
- scikit-learn for cosine similarity and candidate filtering.
- UMAP for the original 2D plot of the selection. The current plot uses PCA instead, centered on the problem and fitted to the chosen lenses so they spread out on screen.
- NumPy for the vector math, including averaging parts into composite lenses.

### Challenges

- Crossing categories multiplies fast, and the biggest category has hundreds of values, so not every combination can be scored. Reservoir sampling caps the candidate pool at 10,000 by default, with every combination equally likely to make it in.
- A multi-part lens like "Game Theory × Deep Ecology" has no embedding of its own, so its vector is the average of its parts, computed on the fly. To keep noisy combinations from passing as relevant, the relevance threshold rises by 0.025 for each part beyond two.
- Optimizing only for diversity ignores the problem, and optimizing only for relevance returns lenses that all look alike. The relevance threshold takes care of the first, and the MaxMin selection, which keeps chosen lenses at least 0.15 cosine distance apart, takes care of the second.

## Outcomes

Every pair of chosen lenses is at least the minimum separation apart, and a pairwise similarity heatmap shows how much any two of them overlap.

The taxonomy is embedded once and cached to disk, and composite lenses are averaged from cached vectors instead of being embedded, so after that first pass a new problem needs one embedding call.
The cache cuts API cost by more than 95%.

The drawback is that working from lenses that far apart makes the model less focused.
But when I want it to think outside the box or take several approaches to something, I've found it a great tool for brainstorming and coming up with new ideas.

## Implementation Notes

The selection starts from the lens most similar to the problem, then keeps adding whichever remaining candidate is farthest from its nearest already-chosen lens:

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

`main.py` checks `sys.streamlit_is_running` to tell whether it's running under Streamlit, so the same file serves as the web UI and as a command-line tool for batch runs.
