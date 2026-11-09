---
title: Music Analyzer
summary: Analyzes whatever music is playing on a Windows PC as it plays, and turns a recorded song into a prompt for the AI music generator Suno
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

Music Analyzer captures whatever audio is playing on a Windows PC and analyzes it as it plays, with a mix of neural models and ordinary signal processing.
Record a song from start to finish and it builds a profile of the whole track, then turns that into a prompt for AI music generators like Suno v5.

It runs as a FastAPI server and streams results over a WebSocket to a browser page that updates 10 times a second.
Several analyzers run side by side, from neural network classifiers to plain DSP, and a fusion step checks them against each other: if one model hears singing but the separated vocal track is silent, the singing is dropped.

## Screenshots

<!-- SCREENSHOT: Main dashboard showing real-time analysis with BPM/Key/Chord metrics, frequency balance bars, and AST predictions while music is playing -->
![Real-time Analysis Dashboard](/images/projects/music-analyzer/screenshot-1.png)

<!-- SCREENSHOT: Export modal showing generated Suno v5 prompts with Style Prompt, Lyrics Prompt sections, and Gemini audio analysis results -->
![AI Prompt Export Modal](/images/projects/music-analyzer/screenshot-2.png)

<!-- SCREENSHOT: Charts view showing temporal BPM, key detection, and pitch tracking graphs with 60-second history -->
![Temporal Analysis Charts](/images/projects/music-analyzer/screenshot-3.png)

## Problem

A good prompt for an AI music generator has to describe a song's genre, instruments, tempo, key, production style and emotional arc.
Describing all of that by hand is tedious and often inaccurate.

Existing audio analysis tools either do one thing, like beat detection or genre classification, or only work offline.
None of them analyzed music live across all of these at once and wrote the result as a prompt for a music generator.

## Approach

Each part of the analysis uses a different kind of model: AST classifies against a fixed set of labels, CLAP matches audio to labels written in plain language without training on them (zero-shot), CREPE tracks pitch, Demucs separates the audio into stems, and librosa does the traditional signal processing.

### Stack

- Audio capture: PyAudioWPatch with WASAPI loopback, which records system audio on Windows with no setup
- Neural models: AST, CLAP, CREPE, emotion2vec and Demucs on PyTorch, running on the GPU through CUDA
- DSP: librosa for spectral features, beat tracking, chord detection and key estimation
- Web server: FastAPI, streaming to the browser over a WebSocket
- Frontend: vanilla JS with Chart.js for the live metrics and the charts over time
- LLM: an async httpx client that calls my Generative Gateway during prompt generation

### Challenges

- Each model on its own often misclassifies audio. AST, CLAP and Demucs are cross-checked against each other, so if AST detects "singing" but the Demucs vocal stem has no energy, the vocal detection is suppressed.

- Running five or more neural models at once runs out of GPU memory. Models only load when they are switched on, and each has its own toggle in the UI.

- Holding a steady 10 Hz with GPU models meant precomputing CLAP's text embeddings, so the text encoder never runs in the hot loop, and batching every category into one inference pass. Together those made it 10-50x faster.

- Song sections (verse, chorus, bridge) have to be found without a beat grid. Boundaries come from changes in energy, brightness, warmth and vocal presence, with an adaptive threshold and a fallback that splits flat songs automatically.

## Outcomes

The Suno v5 prompts it writes follow the song as it changes.
Instead of one set of tags for the whole track, each section gets its own description of dynamics, texture, production and instrumentation.

CLAP's zero-shot labels and AST's fixed ones work well together; each catches what the other misses.
Precomputing static embeddings is essential for real-time inference.
Checking one model against another filters false positives more reliably than confidence thresholds.
Recording sessions as frames keeps the real-time analysis cleanly separate from the offline processing afterwards.

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
