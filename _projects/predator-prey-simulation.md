---
title: Predator-Prey Neural Net Simulation
summary: Evolutionary ecosystem simulation with neural network AI, real-time visualization, and emergent predator-prey dynamics
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

A real-time evolutionary ecosystem simulation where neural network-powered creatures compete for survival. Prey seek food and flee predators, predators hunt to survive, and both species evolve through genetic inheritance and mutation. The simulation features procedurally generated terrain, dynamic weather systems, day/night cycles, and hardware-accelerated rendering.

The project explores emergent behavior through simple rules: creatures with better-suited genes and neural networks survive longer and reproduce more, leading to population dynamics and evolutionary pressures that mirror real ecological systems.

## Screenshots

<!-- SCREENSHOT: Main simulation view showing prey (blue), predators (red), and plants (green) interacting on procedurally generated terrain with the HUD displaying population counts and weather state -->
![Simulation Overview](/images/projects/predprey-neuralnet/screenshot-1.png)

<!-- SCREENSHOT: Close-up of creatures with visible species coloring variations showing genetic drift, during active hunting/fleeing behavior -->
![Creature Interactions](/images/projects/predprey-neuralnet/screenshot-2.png)

<!-- SCREENSHOT: Night cycle view showing reduced visibility and the day/night lighting effect on the ecosystem -->
![Day/Night Cycle](/images/projects/predprey-neuralnet/screenshot-3.png)

## Problem

Traditional artificial life simulations often rely on hand-coded behavior rules that produce predictable outcomes. I wanted to explore whether meaningful survival strategies could emerge from neural networks that evolve through natural selection rather than explicit training, and whether complex population dynamics could arise from simple genetic rules.

## Approach

The simulation combines evolutionary algorithms with neural networks to create an ecosystem where behavior evolves organically.

### Stack

- **PyGame/ModernGL** - Dual rendering backends: PyGame for accessibility and rapid prototyping, OpenGL for hardware-accelerated performance at scale
- **NumPy** - Vectorized operations for terrain generation, genetic clustering, and neural network computations
- **Custom Neural Networks** - Lightweight feed-forward networks with weights encoded in the genome, enabling heritable AI behavior
- **Spatial Indexing** - Quadtree and uniform grid implementations for O(log n) neighbor queries instead of O(n²)

### Challenges

- **Performance at scale** - Initial O(n²) neighbor lookups caused frame drops with 200+ entities. Implemented a dual spatial index system (quadtree + uniform grid) with configurable cell sizes and stack-based traversal for cache efficiency
- **Balancing ecosystem stability** - Early simulations resulted in extinction cascades. Tuned energy costs, reproduction thresholds, and perception radii through extensive parameter exploration to achieve stable predator-prey cycles
- **Species emergence tracking** - Needed a way to identify when genetic drift created distinct populations. Implemented hierarchical clustering with configurable genetic distance thresholds and async processing to avoid frame stutters

## Outcomes

The simulation successfully demonstrates emergent evolutionary behavior. Prey populations develop faster movement genes when predator pressure is high. Predators evolve improved perception when prey become harder to catch. The neural networks, despite their simplicity (4-5 inputs, 5 outputs), learn effective survival strategies through evolution alone.

Key technical achievements:
- Maintains 60 FPS with 300+ active entities
- Memory-optimized entity classes using `__slots__`
- Comprehensive test suite with 30+ test modules
- Modular architecture separating simulation, rendering, and AI concerns

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

Offspring inherit averaged parent weights with 10% mutation rate, allowing beneficial behavioral adaptations to spread through the population.

### Spatial Indexing Strategy

The simulation uses a hybrid approach based on entity density:

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
