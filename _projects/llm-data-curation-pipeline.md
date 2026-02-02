---
title: LLM Data Curation Pipeline
summary: Production-grade 22-stage data curation system for training a 1B-parameter Transformer from scratch on 40B tokens
date: 2025-06-11
github: https://github.com/jatoran/transformer-learning
---

## Overview

A comprehensive, manifest-driven data curation pipeline designed to transform raw, heterogeneous text corpora into training-ready datasets for a custom 1B-parameter English-only Transformer. The system processes 40 billion tokens across 20+ datasets (RedPajama, StarCoder, MegaMath, HelpSteer, etc.) through 22 sequential stages—from raw validation through PII redaction, deduplication, quality filtering, and final tokenization into MosaicML's StreamingDataset format.

The architecture follows three core principles: **declarative control** via version-controlled YAML configurations, an **immutable ledger** using DuckDB for auditable state management, and **type-driven polymorphism** that dynamically prunes the processing DAG based on content type (prose, code, math) and schema (text-only, instruction-response, preference-pair).

## Screenshots

<!-- SCREENSHOT: Terminal output showing pipeline execution with progress bars for multiple datasets, displaying stage completion status -->
![Pipeline Execution](/images/projects/llm-data-curation/screenshot-1.png)

<!-- SCREENSHOT: DuckDB query results showing the manifest schema with document counts, quality signals, and filter statistics per dataset -->
![Manifest Database](/images/projects/llm-data-curation/screenshot-2.png)

<!-- SCREENSHOT: Streamlit dashboard showing quality signal distributions and filter impact visualization -->
![Curation Dashboard](/images/projects/llm-data-curation/screenshot-3.png)

## Problem

Training a high-quality language model requires far more than just collecting text. Raw datasets contain duplicate content, PII, benchmark contamination, non-English text, toxic content, and vast amounts of low-quality noise. Without rigorous curation, models memorize duplicates, leak private data, achieve artificially inflated benchmark scores, and learn from harmful or nonsensical content.

The challenge was building a system that could:
- Process 40B+ tokens across diverse sources (web crawls, code repos, academic papers, Q&A forums)
- Apply content-type-aware processing (HTML cleaning for web, whitespace preservation for code)
- Maintain complete auditability for every filtering decision
- Support both exact and fuzzy deduplication at scale
- Prepare data for a sophisticated training curriculum with macro/micro-level optimization

## Approach

The solution is a DAG-based pipeline where each stage reads from a DuckDB manifest, applies transformations or filters, and writes results back—creating an immutable chain of custody for every document.

### Stack

- **DuckDB** - Central manifest database storing metadata, quality signals, and filter decisions for millions of documents. Chosen for its blazing-fast analytical queries and zero-dependency deployment
- **Apache Parquet** - Columnar storage format for efficient random-access reads during multi-pass processing
- **FastText** - Language identification with >0.9 confidence threshold for English filtering
- **MinHash LSH (datasketch)** - Memory-efficient near-duplicate detection via locality-sensitive hashing on token n-grams
- **Presidio** - Microsoft's PII detection and redaction engine for emails, phone numbers, and named entities
- **SentencePiece** - BPE tokenizer training with byte-fallback and 28 reserved control tokens
- **MosaicML StreamingDataset** - Final output format enabling efficient distributed training with built-in shuffling
- **Rich + Streamlit** - CLI progress visualization and interactive dashboard for pipeline monitoring

### Challenges

- **Content-Type Polymorphism** - Different content types require different processing. HTML documents need structured cleaning and boilerplate removal; code must preserve significant whitespace and indentation. Solved via a `content_type` field that drives conditional stage activation through the DAG

- **Deduplication at Scale** - Exact deduplication uses SHA256 content hashes, but near-duplicates (paraphrased content, template variations) required MinHash LSH on 5-gram shingles. The on-disk approach processes millions of documents without memory exhaustion

- **Benchmark Decontamination** - Training data that overlaps with evaluation benchmarks (MMLU, GSM8K, HumanEval) causes artificially inflated scores. Pre-computed Bloom filters detect and remove contaminated documents

- **Refusal Token Strategy** - Teaching the model when to refuse answering required special `[REFUSE]` and `[RESPOND]` tokens, integrated into both SFT and DPO data to train graceful "I don't know" responses

## Outcomes

The pipeline successfully:
- Processes 20+ datasets across pretrain, SFT, and DPO categories
- Computes 50+ quality signals per document (perplexity, toxicity, lexical richness, compression ratio, etc.)
- Achieves deterministic, reproducible runs with full audit trails
- Reduces corpus size by 30-60% through quality filtering while maintaining diversity
- Outputs training-ready MDS shards organized by content type for macro-curriculum training

The modular architecture enables rapid iteration—new datasets are added via YAML configuration, and the orchestrator automatically determines which stages apply based on content type and schema.

## Implementation Notes

### Pipeline Architecture

The orchestrator uses `graphlib.TopologicalSorter` to build execution order from declared dependencies:

```python
class PipelineOrchestrator:
    def __init__(self):
        self.stages, self.stage_map = self._load_and_validate_global_config()
        self.execution_order = self._get_execution_order()

    def _get_execution_order(self) -> List[str]:
        ts = TopologicalSorter()
        for stage in self.stages:
            ts.add(stage['name'], *stage.get('depends_on', []))
        return list(ts.static_order())
```

### Quality Signal Computation

Over 50 quality signals are computed, from simple counts to complex heuristics:

```python
# Example signals computed in s09_compute_quality_signals
signals = {
    'quality_token_count': len(tokenizer.encode(text)),
    'quality_lexical_richness_ttr': len(set(words)) / len(words),
    'quality_flesch_kincaid': 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59,
    'quality_compression_ratio': len(gzip.compress(text.encode())) / len(text.encode()),
    'gzip_compression_ratio': compressed_size / original_size,
}
```

### Manifest-Driven Filtering

Each dataset defines SQL filter clauses that execute against the enriched manifest:

```yaml
# datasets_manifest.yml
- name: redpajama_v2_pretrain
  content_type: prose
  sql_filter_clause: |
    source_specific_source_partition = 'head_middle'
    AND (quality_readability_flesch_kincaid > 5.0 
         OR quality_lexical_richness_ttr > 0.6)
```

### Training Curriculum Integration

The finalization stage organizes outputs for a two-level curriculum:

```
output/
  run_20251028/
    pretrain/
      prose/       # Stage 1: foundational language
      web_html/    # Stage 1: filtered web content
      source_code/ # Stage 2: programming knowledge
      math/        # Stage 2: mathematical reasoning
    sft/
      dialogue/    # Instruction-following pairs
    dpo/
      preference/  # Chosen/rejected pairs for alignment
```
