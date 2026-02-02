---
title: Transformer Training Full Pipeline
summary: Production-grade 22-stage pipeline for curating 40B tokens to train a 1B-parameter language model
started: 2025-06-11
updated: 2025-10-28
type: data-pipeline
stack:
  - Python
  - DuckDB
  - PyTorch
  - Apache Parquet
  - Hugging Face Transformers
  - MosaicML Streaming
tags:
  - ai
  - data
  - machine-learning
loc: 25312
files: 188
architecture:
  auth: none
  database: DuckDB
  api: none
  realtime: none
  background: none
  cache: none
  search: none
---

## Overview

A comprehensive, production-grade data curation system designed to transform 20+ heterogeneous datasets into a training-optimized 40-billion-token corpus for pre-training a 1B-parameter language model. The pipeline implements a declarative, manifest-driven architecture where a central DuckDB database serves as an immutable ledger tracking every document through 22 distinct processing stages—from raw ingestion to tokenized MDS shards ready for distributed training.

The project represents a complete, hands-on learning system for modern LLM engineering, demonstrating techniques from data curation through alignment. The target model persona is a "Clinical Assistant"—direct, precise, and truthful with calibrated uncertainty, using a special `[REFUSE]` token to admit ignorance rather than hallucinate.

## Screenshots

<!-- SCREENSHOT: Streamlit curation dashboard showing the pipeline funnel view with filter rates per stage -->
![Pipeline Funnel Dashboard](/images/projects/llm-curation-pipeline/screenshot-1.png)

<!-- SCREENSHOT: DuckDB manifest query showing document metadata with quality signals and validity flags -->
![Manifest Database Query](/images/projects/llm-curation-pipeline/screenshot-2.png)

<!-- SCREENSHOT: Sample of final MDS shard inspection showing tokenized ChatML-formatted training data -->
![MDS Shard Inspector](/images/projects/llm-curation-pipeline/screenshot-3.png)

## Problem

Training a high-quality language model requires more than raw data volume—it demands a carefully curated corpus with consistent quality, appropriate diversity, and proper deduplication. Public datasets arrive in heterogeneous formats with varying quality levels, duplicate content, PII, benchmark contamination, and other issues that can degrade model performance. Traditional ad-hoc filtering scripts lack reproducibility, auditability, and the ability to iterate on curation decisions without re-processing entire datasets.

The challenge was building a system that could:
- Process 20+ datasets with different schemas into a unified format
- Apply 30+ quality signals and filters while maintaining full traceability
- Support curriculum learning with physical data organization by content type
- Enable rapid iteration on filtering decisions without expensive re-runs
- Guarantee reproducibility through declarative configuration

## Approach

The solution is a declarative, manifest-driven pipeline where all curation logic is defined in YAML configuration files and executed as a directed acyclic graph of processing stages.

### Stack

- **DuckDB** - Embedded OLAP database serving as the central manifest/ledger. Each pipeline stage reads from the previous state and writes to the next, creating an unbroken chain of custody for every document. The ~48GB manifest enables zero-cost state inspection without re-running stages.

- **Apache Parquet** - Columnar storage format for document content with zstd compression. Provides efficient random access for the manifest-driven architecture while keeping storage costs low.

- **PyTorch + Transformers** - Powers ML-based quality signals including perplexity scoring (GPT-Neo, Phi-2), toxicity classification, and language detection (fastText).

- **MosaicML Streaming** - Final output format (MDS shards) organized by content type and category for curriculum-based training with efficient distributed loading.

- **Presidio** - Microsoft's PII detection framework for identifying and redacting personal information before training.

- **datasketch** - MinHash LSH implementation for scalable near-deduplication across billions of document pairs.

### Challenges

- **Heterogeneous data schemas** - Solved with a canonical schema (150+ columns) and per-dataset field mapping in `datasets_manifest.yml`. Each dataset declares how its raw fields map to canonical fields, with SQL filter clauses for custom filtering logic.

- **Reproducibility across runs** - Achieved through deterministic UUIDv5 document IDs based on content hashes, declarative YAML configuration for all parameters, and an immutable ledger pattern where modifications are recorded as new state rather than mutations.

- **Balancing quality vs. quantity** - Implemented multi-tier quality signals rather than a single score: surface-level metrics (token counts, readability), linguistic metrics (perplexity), topical scores (promotional density, academic indicators), and behavioral annotations. The final filter uses a weighted combination tuned per content type.

- **Curriculum learning support** - Data is physically packaged by `content_type` (prose, code, math) enabling macro-curriculum staged exposure during training. Micro-curriculum (in-batch loss reweighting) is supported through difficulty annotations.

## Outcomes

The pipeline successfully processes 20+ public datasets through all 22 stages, producing:

- **Unified corpus** with consistent schema and quality guarantees across diverse sources (RedPajama, StarCoder, MegaMath, Open Orca, HelpSteer2, etc.)

- **Full traceability** where every document's journey from raw input to final shard is queryable in the manifest, including which filter removed it and why

- **Rapid iteration** capability—changing a filter threshold requires editing YAML and re-running only affected stages, not the entire pipeline

- **Curriculum-ready output** organized into MDS shards by category (pretrain/sft/dpo) and content type for staged training exposure

Key learnings: the immutable ledger pattern dramatically simplifies debugging and enables "what-if" analysis on filtering decisions. Separating metadata (DuckDB) from content (Parquet) provides the right tradeoff between query flexibility and storage efficiency.

## Implementation Notes

The pipeline follows a strict ordering from cheapest to most expensive operations:

```
s00 Validation       → s01 Parquet Conversion → s02 HTML Cleaning
s03 Text Normalize   → s04 Heuristic Clean    → s04a PII Redaction
s05 Build Manifest   → s06 Assign Splits      → s07 Exact Dedup
s08 Language Filter  → s09 Quality Signals    → s09a Code Detection
s10 Metadata Filter  → s11 Decontamination    → s13 Heuristic Scoring
s14 Coarse Filter    → s15 Near Dedup (LSH)   → s16 PPL Tagging
s17 Toxicity Tag     → s18 Final Quality      → s19 Axis Tagging
s20 Control Tokens   → s21 Finalization (MDS)
```

Document validity is tracked via `is_valid` and `filter_reason` columns. Each stage only marks documents as filtered—nothing is deleted—enabling full audit trails:

```sql
-- Find documents filtered by specific stage
SELECT source_dataset, filter_reason, COUNT(*)
FROM documents
WHERE NOT is_valid
GROUP BY source_dataset, filter_reason;
```

The refusal token strategy uses `[REFUSE]` and `[RESPOND]` prefixes to teach calibrated uncertainty:

```
<|im_start|>assistant
[RESPOND] The capital of France is Paris.<|im_end|>

<|im_start|>assistant
[REFUSE] I cannot provide real-time stock prices.<|im_end|>
```

These tokens are embedded in the tokenizer vocabulary from day one, enabling consistent training from SFT through DPO alignment where refusal is explicitly preferred over hallucination.
