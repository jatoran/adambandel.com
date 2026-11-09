---
title: Predator-Prey Neural Net Simulation
summary: A simulation of predators and prey whose behavior comes from small neural networks that evolve over generations
started: 2025-05-19
updated: 2025-05-21
type: game
github: https://github.com/jatoran/predprey-neuralnet
stack:
  - Python
  - PyGame
  - ModernGL
  - NumPy
  - PyOpenGL
tags:
  - ai
  - simulation
  - game-dev
loc: 8455
files: 112
architecture:
  auth: none
  database: none
  api: none
  realtime: none
  background: none
  cache: in-memory
  search: none
---

## Overview

Predator-Prey Neural Net Simulation is a real-time ecosystem simulation in which every creature is driven by a small neural network.
Prey look for food and run from predators, predators hunt to survive, and both species evolve through inheritance and mutation.
The world has procedurally generated terrain, weather that shifts between sun, rain, drought and cold snaps, a day/night cycle, and an OpenGL renderer for hardware acceleration.

The rules are simple: creatures whose genes and networks suit their conditions live longer and reproduce more.
Population cycles and evolutionary pressure come out of that on their own.

## Screenshots

<!-- SCREENSHOT: Main simulation view showing prey (blue), predators (red), and plants (green) interacting on procedurally generated terrain with the HUD displaying population counts and weather state -->
![Simulation Overview](/images/projects/predprey-neuralnet/screenshot-1.png)

<!-- SCREENSHOT: Close-up of creatures with visible species coloring variations showing genetic drift, during active hunting/fleeing behavior -->
![Creature Interactions](/images/projects/predprey-neuralnet/screenshot-2.png)

<!-- SCREENSHOT: Night cycle view showing reduced visibility and the day/night lighting effect on the ecosystem -->
![Day/Night Cycle](/images/projects/predprey-neuralnet/screenshot-3.png)

## Problem

Artificial life simulations often rely on hand-coded behavior rules, which produce predictable outcomes.
I wanted to see whether meaningful survival strategies could come out of neural networks shaped by natural selection instead of training, and whether complex population dynamics could come out of simple genetic rules.

## Approach

Nothing is trained.
Each creature's network weights are part of its genome, so behavior is inherited, mutated and selected along with everything else.

### Stack

- PyGame and ModernGL: two rendering backends, PyGame for simplicity and quick prototyping, OpenGL for hardware-accelerated rendering with larger populations
- NumPy for vectorized terrain generation and genetic clustering
- Neural networks: small feed-forward networks written from scratch, with the weights stored in the genome so behavior is inherited
- Spatial indexing: quadtree and uniform grid implementations for O(log n) neighbor queries instead of O(n²)

### Challenges

- Neighbor lookups started out O(n²), which dropped frames past 200 entities. Two spatial indexes replaced them, a quadtree and a uniform grid, with configurable cell sizes and stack-based traversal for cache efficiency.
- Early runs ended in extinction cascades. Getting stable predator-prey cycles took a lot of tuning of energy costs, reproduction thresholds and perception radii.
- Telling when genetic drift has produced a distinct population takes hierarchical clustering of the genomes, with a configurable genetic distance threshold. It runs asynchronously so it doesn't cause frame stutters.

## Outcomes

Prey populations develop faster movement genes when predator pressure is high.
Predators evolve better perception when prey get harder to catch.
The networks are small, 4-5 inputs and 5 outputs, and evolution alone still gets them to survival strategies that work.

It holds 60 FPS with more than 300 active entities.
Entity classes use `__slots__` to save memory.
Simulation, rendering and AI are separate modules, and there are more than 30 test modules.

## Implementation Notes

### Neural Network Evolution

Each creature's brain is a simple feed-forward network where weights are encoded in its genome:

```python
# Prey brain inputs: [hunger, fear, light_level, food_distance]
# Outputs: [food_weight, flee_weight, mate_weight, wall_weight, wander_weight]

class FeedForwardNet:
    def forward(self, inputs: list[float]) -> list[float]:
        x = inputs
        for i, (weights, bias) in enumerate(self.layers):
            x = [max(0, sum(w * xi for w, xi in zip(row, x)) + b)
                 for row, b in zip(weights, bias)]  # ReLU activation
        return x
```

Offspring inherit the average of their parents' weights with a 10% mutation rate, so behavior that helps can spread through the population.

### Spatial Indexing Strategy

The uniform grid is the default index, and the quadtree is still available as an alternative:

```python
class UniformGrid(SpatialIndex):
    def query_circle(self, cx, cy, radius):
        # O(1) cell lookup + O(k) entity checks where k << n
        min_cell_x = int((cx - radius) / self.cell_size)
        max_cell_x = int((cx + radius) / self.cell_size)
        # ... check only cells that intersect the query circle
```

### Environmental Systems

Weather uses a Markov chain model where state transitions affect plant growth:

| State     | Sunny | Rain  | Drought | Cold Snap |
|-----------|-------|-------|---------|-----------|
| Sunny     | 0.7   | 0.2   | 0.05    | 0.05      |
| Rain      | 0.3   | 0.5   | 0.1     | 0.1       |
| Drought   | 0.4   | 0.1   | 0.4     | 0.1       |
| Cold Snap | 0.3   | 0.2   | 0.1     | 0.4       |

Rain increases plant spawn rates by 1.5x, creating seasonal abundance that drives population cycles.
