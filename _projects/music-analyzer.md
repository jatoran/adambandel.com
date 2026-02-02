---
title: Music Analyzer
summary: Real-time audio analysis system extracting musical features for AI music generation
started: 2026-01-02
updated: 2026-01-07
type: desktop
stack:
  - Python
  - PyTorch
  - FastAPI
  - WebSocket
  - Transformers
  - librosa
  - Demucs
  - Chart.js
tags:
  - ai
  - audio
  - music
  - developer-tools
loc: 9979
files: 27
architecture:
  auth: none
  database: none
  api: WebSocket
  realtime: WebSocket
  background: none
  cache: in-memory
  search: none
---

## Overview

Music Analyzer is a sophisticated real-time audio analysis system that captures system audio and extracts comprehensive musical features using a combination of AI models and digital signal processing. It generates "Music Intelligence Profiles" optimized for AI music generation systems like Suno v5.

The system runs as a FastAPI web server with WebSocket streaming, providing live visualization of audio analysis at 10Hz refresh rate. It combines multiple specialized analyzers—from neural network classifiers to traditional DSP algorithms—and uses modal fusion to cross-validate signals between models for improved accuracy.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing real-time analysis with BPM/Key/Chord metrics, frequency balance bars, and AST predictions while music is playing -->
![Real-time Analysis Dashboard](/images/projects/music-analyzer/screenshot-1.png)

<!-- SCREENSHOT: Export modal showing generated Suno v5 prompts with Style Prompt, Lyrics Prompt sections, and Gemini audio analysis results -->
![AI Prompt Export Modal](/images/projects/music-analyzer/screenshot-2.png)

<!-- SCREENSHOT: Charts view showing temporal BPM, key detection, and pitch tracking graphs with 60-second history -->
![Temporal Analysis Charts](/images/projects/music-analyzer/screenshot-3.png)

## Problem

Creating effective prompts for AI music generation requires detailed understanding of a song's musical characteristics—genre, instrumentation, tempo, key, production style, and emotional arc. Manually describing these attributes is tedious and often inaccurate.

Existing audio analysis tools either focus on single aspects (just beat detection, just genre classification) or require offline processing. There was no unified system that could analyze music in real-time across multiple dimensions and output prompts specifically optimized for AI music generators.

## Approach

Built a multi-model analysis pipeline that combines the strengths of different approaches: fixed-taxonomy classification (AST), zero-shot classification (CLAP), neural pitch detection (CREPE), source separation (Demucs), and traditional DSP algorithms (librosa).

### Stack

- **Audio Capture** - PyAudioWPatch with WASAPI loopback for zero-config system audio capture on Windows
- **Neural Models** - PyTorch with CUDA for GPU-accelerated inference (AST, CLAP, CREPE, emotion2vec, Demucs)
- **DSP Analysis** - librosa for spectral features, beat tracking, chord detection, and key estimation
- **Web Server** - FastAPI with WebSocket streaming for real-time browser visualization
- **Frontend** - Vanilla JS with Chart.js for live metrics and temporal charts
- **LLM Integration** - httpx async client connecting to Generative Gateway for enhanced prompt generation

### Challenges

- **Model hallucinations** - Individual models often misclassify audio. Solved with modal fusion: cross-validating signals between AST, CLAP, and Demucs. If AST detects "singing" but Demucs shows no vocal stem energy, the vocal detection is suppressed.

- **VRAM pressure** - Running 5+ neural models simultaneously exhausts GPU memory. Implemented lazy loading where models only load when explicitly enabled, plus per-model toggles in the UI.

- **Real-time performance** - Needed consistent 10Hz analysis with GPU models. Precomputed CLAP text embeddings (eliminating encoder passes in hot loop) and batched multi-category inference achieve 10-50x speedup.

- **Song structure detection** - Detecting verse/chorus/bridge boundaries without beat grid information. Built multi-feature change detection tracking energy, brightness, warmth, and vocal presence with adaptive thresholding and fallback auto-splitting.

## Outcomes

The system successfully generates detailed Suno v5 prompts that capture a song's evolving characteristics—not just static tags, but per-section descriptions of dynamics, texture, production techniques, and instrumentation. The modal fusion approach measurably reduces model hallucinations compared to single-model classification.

Key learnings:
- Zero-shot models (CLAP) complement fixed-taxonomy models (AST) well—each catches what the other misses
- Precomputing static embeddings is essential for real-time neural network inference
- Cross-model validation is more robust than confidence thresholds for filtering false positives
- Frame-based session recording enables clean separation between real-time and offline processing

## Implementation Notes

### Multi-Model Architecture

```
┌──────────────────────────────────────────────────────┐
│         PARALLEL ANALYSIS MODULES (GPU)              │
├──────────────────────────────────────────────────────┤
│ AST (527 AudioSet classes) → Fixed taxonomy         │
│ CLAP (306 zero-shot labels) → Flexible detection    │
│ CREPE → Monophonic pitch                            │
│ Demucs → Vocals/drums/bass/other stems              │
│ librosa → Beat, chord, key, spectral features       │
│ emotion2vec → Vocal emotion (display only)          │
└──────────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────────┐
│              MODAL FUSION LAYER                       │
│  Cross-validate: AST + CLAP + Demucs signals         │
│  Gate unreliable detections, boost confirmed ones    │
└──────────────────────────────────────────────────────┘
```

### CLAP Multi-Category Batching

Rather than running CLAP 6 times (once per category), text embeddings for all 306 labels are precomputed once at startup:

```python
# Precompute embeddings for all labels
self.label_embeddings = {}
for category, labels in self.categories.items():
    with torch.no_grad():
        text_inputs = self.processor(text=labels, return_tensors="pt", padding=True)
        self.label_embeddings[category] = self.model.get_text_features(**text_inputs)

# In hot loop: only run audio encoder, then dot product with cached text embeddings
audio_features = self.model.get_audio_features(**audio_inputs)
for category, text_emb in self.label_embeddings.items():
    similarity = (audio_features @ text_emb.T).softmax(dim=-1)
```

### Session Frame Recording

Analysis runs at 10Hz, but session frames are recorded at 1Hz for manageable data:

```python
@dataclass
class SessionFrame:
    timestamp: float
    spectral: SpectralFeatures
    structure: MusicStructure
    production: ProductionMetrics
    stem_levels: dict[str, float]
    clap_results: dict[str, list[tuple[str, float]]]
    ast_predictions: list[tuple[str, float]]
```

Aggregation happens on session stop, with section detection using weighted multi-feature change scoring:
- Energy: 40%
- Brightness: 30%
- Vocal presence: 30%
