---
title: Music Analyzer
summary: Analyzes whatever music is playing on a Windows PC, or an uploaded file, and turns the whole song into a prompt for the AI music generator Suno
started: 2026-01-02
updated: 2026-06-20
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
  - Gemini
  - DeepSeek
tags:
  - ai
  - audio
  - music
  - developer-tools
loc: 11109
files: 26
architecture:
  auth: none
  database: none
  api: REST + WebSocket
  realtime: WebSocket
  background: asyncio analysis loop
  cache: in-memory, keyed by audio hash
  search: none
---

## Overview

Music Analyzer captures whatever audio is playing on a Windows PC and analyzes it as it plays, with a mix of neural models and ordinary signal processing.
Record a song from start to finish, or upload an audio file, and it builds a profile of the whole track, then turns that into a prompt for Suno v5: the Style field, the lyrics or, for an instrumental, a section-by-section arrangement, and a list of styles to avoid.

It runs as a FastAPI server on the same PC and streams the live results over a WebSocket to a browser page that updates up to 10 times a second.
The way it writes the prompt changed in June 2026.
Gemini now listens to every finished song and has the final say on genre, instruments, drums and vocals when it disagrees with the local models.
DeepSeek V4 Pro, which replaced Gemini as the writer, builds the prompt from Gemini's read plus the measured tempo, key and section timings.
Both calls go through my [Generative Gateway](/projects/generative-gateway/).

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

### Live analysis

Each part of the live analysis uses a different kind of model: AST classifies against the 527 AudioSet labels, CLAP matches audio to 306 labels written in plain language without training on them (zero-shot), CREPE tracks pitch, Demucs separates the audio into stems, emotion2vec reads the emotional tone, and librosa does the beat tracking, chords, key and spectral features.
AST and the spectral analysis always run.
CLAP, Demucs, CREPE, emotion2vec and the chord and beat trackers each have a toggle in the UI and load only when switched on.

Capture and analysis run in one long-lived loop on the server, separate from the browser connection, so closing or reloading the tab does not stop a recording.

### From a recording to a prompt

When a recording stops or an upload finishes, the rest runs without another click.

1. The recorded frames are aggregated into a profile of the track: tempo, key, chords as Roman numerals, sections, stem balance, moods, instruments and an intensity curve over time.
2. A whole-file pass measures the complete audio once: beat_this for tempo and downbeats, basic-pitch for the notes and the key they imply, the htdemucs_ft model for the stem balance, librosa for how percussive the track is, and pyloudnorm for loudness in LUFS.
3. Gemini 3 Flash listens to the audio: the whole track if it is 200 seconds or shorter, otherwise the first 90 seconds plus a minute from the middle and a minute from the end. It returns structured JSON with the genres, the instruments and their roles, whether there are real drums and roughly when they come in, the vocals, the atmosphere and the structural arc.
4. A fusion step settles the fields the sources disagree on (vocals, drums, tempo or free time, key and stem balance) in a fixed order of trust: the optional guidance given before the analysis, then Gemini, then the measured numbers, then the stem levels and CLAP. Every field records which source won, and the disagreements are listed with the results.
5. DeepSeek V4 Pro writes the prompt in two calls at once: the Style field and negative styles at a low temperature, and the lyrics or the instrumental arrangement at a high one, with a target line count taken from the track's length and sections.

The guidance is a short optional form shown after picking a file or pressing Record: instrumental or vocals, real drums or none, free time or a known BPM, and a genre hint.
After the analysis, one-click corrections (make it instrumental, no drums, free time) run it again with that correction as guidance.
Gemini's answer and the whole-file pass are cached by a hash of the audio, so regenerating the prompt or analyzing the same file again does not call Gemini a second time.

### Stack

- Audio capture: PyAudioWPatch with WASAPI loopback, which records system audio on Windows with no setup
- Neural models: AST, CLAP, CREPE, emotion2vec and Demucs on PyTorch, running on the GPU through CUDA, plus beat_this, basic-pitch and htdemucs_ft for the whole-file pass
- DSP: librosa for spectral features, beat tracking, chords and key, and pyloudnorm for loudness
- LLMs: Gemini 3 Flash to listen and DeepSeek V4 Pro to write, called with httpx through my Generative Gateway
- Web server: FastAPI, with REST endpoints for recording, uploads and analysis, and a WebSocket for the live stream
- Frontend: one HTML page with vanilla JS and Chart.js for the live metrics and the charts over time

Every library added in June had to install on Windows without a compiler or a build step.
essentia, madmom, allin1, BeatNet and MERT were all ruled out for that reason.

### Challenges

- The local models got the prompt wrong in the same few ways. Demucs heard synth bass as drums, a lead synth bleeding into the vocal stem read as singing, CLAP returned genres that contradict each other (ambient electronic, trap, heavy metal, grunge and punk for one track), and calm, dark tracks came out as EDM. Gemini, which actually listens to the track, is much better at those calls, so the local models are now a lower-trust cross-check and drive the live dashboard.

- Gemini still missed drums when the beat came in after an ambient intro. The first excerpt went from 60 to 90 seconds, and its instructions now count soft programmed drums as percussion, tell it to check every excerpt, and ask where the beat enters.

- Three one-minute excerpts at full-rate stereo came to about 46 MB, over the upstream request limit. Mono audio at 24 kHz brought that to about 8 MB. It now sends 32 kHz to keep the cymbal detail above 12 kHz, which with the longer first excerpt comes to about 18 MB.

- The first LLM version wrote the whole prompt in one 2,048-token call, and the lyrics came out short and generic because they ran out of room. Splitting it into a style call and a lyrics call, each with its own budget, fixed that. If either call fails three times, the rule-based prompt builder fills in, so the output is never blank.

- A nine-minute recording could come out about a minute long. Capture lived inside the WebSocket handler, so any disconnect, like a backgrounded tab, stopped it while the page timer kept counting. Capture now runs in its own loop, and the page timer comes from the server's recorded duration and frame count, so a stall is visible.

- Running five or more neural models at once runs out of GPU memory. Models load only when switched on, and the heavier ones run on every third or fifth frame instead of every frame.

- Song sections have to be found without a beat grid. Boundaries come from changes in energy, brightness and vocal presence, with an adaptive threshold and a fallback that splits flat songs automatically. Instrumental tracks get intro, build, groove, drop and breakdown instead of verse and chorus, and any section over 90 seconds is split into parts of about 75 seconds.

## Outcomes

The prompts follow the song as it changes.
Instead of one set of tags for the whole track, DeepSeek gets a numbered profile for every section, so a nine-minute track comes out as about nine parts, each with its own dynamics, instruments and arrangement cues.

The whole-file checks were verified on synthetic audio.
A 120 BPM click track reads as 120 BPM, an ambient drone reads as free time with no tempo, an A-C-E chord reads as A minor, and synth content lands in the "other" stem instead of drums.
An eval script scores tempo, key, vocals and drums against hand-labeled tracks, with Gemini optionally included, so a model swap can be measured instead of guessed.

## Limits

- No real tracks have been labeled for the eval script yet, so none of the June accuracy work has a measured score on real music.
- Windows only, because live capture uses WASAPI loopback, and the neural models are set up for an NVIDIA GPU with CUDA.
- The prompt needs my Generative Gateway running. Without it the rule-based builder still writes one, with no Gemini listening behind it.
- In the default all-categories mode, CLAP re-encodes its label text on every pass. Only the single-preset modes cache those embeddings.
- The audio kept from a recording is capped at about 12 minutes, and uploads at 50 MB.
- It is single-user and runs on localhost.

## Implementation Notes

### Pipeline

```
┌──────────────────────────────────────────────────────┐
│ LIVE, up to 10 times a second (GPU)                  │
├──────────────────────────────────────────────────────┤
│ AST → 527 AudioSet classes                           │
│ CLAP → 306 zero-shot labels                          │
│ CREPE → pitch            Demucs → 4 stems            │
│ librosa → beat, chord, key, spectral features        │
│ emotion2vec → emotion, used as a mood signal         │
└──────────────────────────────────────────────────────┘
                ↓ recorded frames, or an upload
┌──────────────────────────────────────────────────────┐
│ WHOLE TRACK, once per song (cached by audio hash)    │
├──────────────────────────────────────────────────────┤
│ Profile → sections, moods, stems, intensity curve    │
│ beat_this, basic-pitch, htdemucs_ft, HPSS, LUFS      │
│ Gemini 3 Flash → genre, instruments, drums, vocals   │
└──────────────────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ FUSION                                               │
│ guidance > Gemini > measured DSP > stems and CLAP    │
└──────────────────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────────────────┐
│ DeepSeek V4 Pro, two calls at once                   │
│ Style and negative styles, lyrics or arrangement     │
└──────────────────────────────────────────────────────┘
```

### Fusion

The drums verdict shows the order of trust.
The measured vote needs all three signals at once: a drum stem of at least 12%, a percussive share of at least 20%, and at least one onset a second.

```python
fp = priors.forced_percussion() if priors else None
gp = bool(gemini["percussion_present"]) if (gemini and "percussion_present" in gemini) else None
dp = None
if adv:
    drum = adv.stem_balance.get("drums", 0.0) if adv.stem_balance else 0.0
    dp = (drum >= 0.12 and adv.percussive_ratio >= 0.2 and adv.onset_rate >= 1.0)
if fp is not None:
    res.percussion_present = fp; prov["percussion"] = "user"
elif gp is not None:
    res.percussion_present = gp; prov["percussion"] = "gemini"
elif dp is not None:
    res.percussion_present = dp; prov["percussion"] = "dsp"
else:
    res.percussion_present = None; prov["percussion"] = "none"
```

### Session Frame Recording

A live recording adds a frame on every pass of the analysis loop.
An upload is cut into 2-second chunks, and each frame is stamped with its real position in the file.

```python
@dataclass
class SessionFrame:
    """Single frame of captured analysis data."""
    timestamp: float  # Relative to session start (seconds)
    spectral: SpectralFeatures
    structure: MusicStructure
    production: Optional[ProductionMetrics] = None
    stems: Optional[StemLevels] = None
    clap: Optional[dict] = None  # Multi-category CLAP results
    ast: Optional[list] = None   # AST top predictions
    # New analyzer data
    melody: Optional[dict] = None   # {pitch_hz, pitch_note, confidence, contour}
    chords: Optional[dict] = None   # {current, confidence, progression, roman}
    beats: Optional[dict] = None    # {tempo, downbeat, phase, time_sig}
    emotion: Optional[dict] = None  # {emotions, dominant, score}
```

Aggregation happens when the analysis runs, with section detection using weighted multi-feature change scoring:
- Energy: 40%
- Brightness: 30%
- Vocal presence: 30%
