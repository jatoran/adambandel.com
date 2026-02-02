---
title: Music Analyzer
summary: Real-time audio analysis system using AI and DSP to extract musical features from system audio and generate AI prompts
date: 2025-01-15
---

## Overview

Music Analyzer is a real-time audio intelligence system that captures any audio playing on Windows and extracts comprehensive musical features using a combination of AI models and digital signal processing. It streams analysis at 10Hz via WebSocket to a browser-based dashboard showing BPM, key, chords, source stems, genre classification, and more.

The primary use case is analyzing music to generate detailed "Music Intelligence Profiles" suitable for AI music generation tools like Suno v5. Rather than describing a song subjectively, the system produces objective, data-driven prompts with tempo, instrumentation, production characteristics, and song structure.

<!-- SCREENSHOT: Main dashboard showing real-time analysis with BPM/Key/Chord metrics, frequency balance bars, pitch class visualization, and AI detection panels all actively displaying data while music plays -->
![Real-time Dashboard](/images/projects/music-analyzer/screenshot-1.png)

<!-- SCREENSHOT: The CLAP multi-category panel showing simultaneous classification across synths, drums, vocals, genres, moods, and production categories with confidence scores -->
![CLAP Multi-Category Classification](/images/projects/music-analyzer/screenshot-2.png)

<!-- SCREENSHOT: Export modal displaying the generated Music Intelligence Profile with style prompt, section timeline, and AI-enhanced prompt synthesis -->
![Music Intelligence Profile Export](/images/projects/music-analyzer/screenshot-3.png)

## Problem

Creating prompts for AI music generation requires understanding a song's characteristics objectively. Manually describing tempo, key, instrumentation, production style, and song structure is tedious and often inaccurate. Additionally, most audio analysis tools work with files, not real-time audio streams, making it impossible to analyze music from streaming services or games.

This project needed to:
- Capture system audio without cables or "Stereo Mix" configuration
- Run multiple AI models simultaneously with acceptable latency
- Detect musical features that standard DSP misses (instrument types, genres, moods)
- Aggregate analysis over time into coherent song profiles
- Generate prompts optimized for specific AI tools (Suno v5)

## Approach

The architecture centers on a FastAPI server that coordinates multiple analysis pipelines running in parallel.

### Stack

- **Audio Capture (WASAPI)** - PyAudioWPatch provides low-latency loopback capture of any Windows audio output without configuration
- **AI Classification (AST)** - MIT's Audio Spectrogram Transformer classifies 527 AudioSet sound categories
- **Zero-Shot Classification (CLAP)** - LAION's Contrastive Language-Audio Pretraining enables classification against any natural language label
- **Source Separation (Demucs)** - Facebook's model isolates vocals, drums, bass, and other instruments in real-time
- **Pitch Detection (CREPE)** - Monophonic pitch extraction with confidence scoring
- **Emotion Detection (emotion2vec)** - Vocal emotion classification when singing is detected
- **DSP Analysis (librosa)** - Traditional spectral features, key detection, BPM estimation, and chroma extraction
- **Frontend (Chart.js)** - Real-time visualization at 10Hz with minimal overhead

### Challenges

- **GPU Memory Management** - Running 5+ transformer models simultaneously required lazy loading and VRAM tracking. Models load on-demand via toggle buttons, with a resource bar showing per-model memory usage.

- **Tempo Octave Errors** - Beat detection algorithms often report double or half the actual tempo. Implemented robust octave normalization that finds the most populated 30-BPM window and normalizes all values to that range.

- **Genre Misclassification** - CLAP's zero-shot classification sometimes confuses genres based on timbral similarity. Added heuristic corrections using stem analysis (e.g., suppressing "heavy metal" for tracks with low drum levels) and cross-validation with AST tags.

- **Section Detection** - Simple energy-based segmentation missed subtle transitions. Built a multi-feature change detector combining energy, brightness, and vocal presence with adaptive thresholds.

## Outcomes

The system successfully captures and analyzes music in real-time with sub-200ms latency on a mid-range GPU. The composite profile generation aggregates hundreds of analysis frames into coherent song descriptions with:

- Section-by-section breakdowns with per-section profiles
- Cross-validated classifications using modal fusion (AST + CLAP + Demucs agreement)
- Suno v5-optimized output with style prompts, negative styles, and lyrics bracket notation
- Optional LLM enhancement via Generative Gateway for more natural phrasing

The modular architecture makes it straightforward to add new analyzers. Each analyzer is a self-contained class that receives audio chunks and returns structured data, with the WebSocket loop handling aggregation and serialization.

## Implementation Notes

The core analysis loop processes 2-second audio chunks at 10Hz, running expensive analyzers (Demucs, Beat detection) less frequently:

```python
# Source separation runs every 5th frame
if separation_enabled and source_separator is not None:
    separation_counter += 1
    if separation_counter >= 5:
        separation_counter = 0
        stems = source_separator.separate(audio, timestamp)
```

CLAP's efficiency comes from precomputing text embeddings for label sets, then only computing audio embeddings at runtime:

```python
def precompute_text_embeddings(self, labels: List[str]) -> None:
    """Precompute embeddings for 10-50x faster classification."""
    for i in range(0, len(labels), batch_size):
        batch = labels[i:i + batch_size]
        inputs = self.processor(text=batch, return_tensors="pt", padding=True)
        with torch.no_grad():
            text_embeds = self.model.get_text_features(**inputs)
            all_embeddings.append(text_embeds)
    self._precomputed_text_embeds = torch.cat(all_embeddings, dim=0)
```

Modal fusion cross-validates signals to filter noise. For example, vocal detection requires agreement between AST singing tags, CLAP vocal classifications, and Demucs stem levels:

```python
def fuse_vocals(ast_tags, clap_results, vocal_stem_level):
    ast_has_singing = any(tag in SINGING_TAGS and score > 0.02 for tag, score in ast_tags)
    clap_vocals = clap_results.get("vocals", [])
    
    # Require 2+ signal agreement
    if ast_has_singing and vocal_stem_level > 0.15:
        return {"present": True, "style": clap_vocals}
    return {"present": False, "style": []}
```
