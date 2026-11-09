---
title: Transformer Training Full Pipeline
summary: A small English language model built end to end, in two parts - a pipeline that curates public text, code and math into training data, and the code that pretrains and fine-tunes the model
started: 2025-06-11
updated: 2025-10-28
type: machine-learning
stack:
  - Python
  - DuckDB
  - PyTorch
  - Apache Parquet
  - Hugging Face Transformers
  - Accelerate
  - TRL
  - MosaicML Streaming
tags:
  - ai
  - data
  - machine-learning
loc: 28783
files: 232
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

This project builds a small English language model end to end, from raw public datasets to a model you can chat with.
It has two parts, kept as two repositories: a data-curation pipeline that turns public datasets into training data, and the training code that pretrains the model and then fine-tunes it.

The plan is a 1B-parameter model trained on 40 billion curated tokens of prose, code and math.
So far a 350M-parameter trial model has been pretrained and instruction-tuned on a single rented GPU, and the curation pipeline has passed an end-to-end smoke test but has not done its full run.

It's a learning project.
The model isn't meant for production; the point is to work through each stage of building one, from data curation to alignment, on modest hardware.
The target persona is what the project calls a "Clinical Assistant": direct, precise and truthful, with a special `[REFUSE]` token for saying it doesn't know instead of making something up.

## Screenshots

<!-- SCREENSHOT: Streamlit curation dashboard showing the pipeline funnel view with filter rates per stage -->
![Pipeline Funnel Dashboard](/images/projects/llm-curation-pipeline/screenshot-1.png)

<!-- SCREENSHOT: DuckDB manifest query showing document metadata with quality signals and validity flags -->
![Manifest Database Query](/images/projects/llm-curation-pipeline/screenshot-2.png)

<!-- SCREENSHOT: Sample of final MDS shard inspection showing tokenized ChatML-formatted training data -->
![MDS Shard Inspector](/images/projects/llm-curation-pipeline/screenshot-3.png)

## Problem

Raw volume isn't enough to train a good language model.
The data has to be consistent in quality, varied, and deduplicated.
Public datasets come in different formats and at different quality levels, with duplicates, personal information, benchmark test data and other problems that make a model worse.
One-off filtering scripts can't be reproduced or audited, and changing a curation decision with them means reprocessing whole datasets.

So the pipeline had to bring more than 20 datasets with different schemas into one format and apply over 30 quality signals and filters while keeping a record of every decision.
It also had to organize the output by content type for curriculum training, let a filter change without an expensive re-run, and produce the same result every time from its configuration.

Training then had to fit a budget: one rented GPU, a development setup on Windows, and no custom CUDA work, using the optimizations that ship with PyTorch and its libraries instead.

## Approach

### Data curation

All of the curation logic is in YAML files, and the stages run as a directed acyclic graph defined there.
A central DuckDB database tracks every document through 22 processing stages, from the raw files to tokenized MosaicML (MDS) shards ready for distributed training.
No stage deletes or overwrites a document; each one records what it decided, so the database holds the full history.

- DuckDB holds the central manifest. Each stage reads the state the previous one left and writes its own, which gives every document an unbroken chain of custody. Any stage's result can be queried without re-running anything. The manifest is about 48 GB.
- Apache Parquet with zstd compression holds the document text, small on disk and still open to random access from the manifest.
- PyTorch and Transformers run the model-based signals: perplexity scores from GPT-Neo and Phi-2, and toxicity classification. fastText does language detection.
- MosaicML Streaming is the output format, MDS shards organized by content type and category for curriculum training and distributed loading.
- PII redaction uses regex patterns for email addresses, phone numbers, credit card and Social Security numbers and similar, and replaces each match with a placeholder or a fake value from Faker.
- datasketch computes the MinHash signatures for near-deduplication. The LSH banding runs on disk in chunks, so memory use stays bounded.

### Training

The model is a Llama-style decoder built with Hugging Face Transformers, with configurations for a 350M and a 1B size.
Pretraining runs through Accelerate on a rented A40 with FlashAttention-2, torch.compile and an 8-bit paged AdamW from bitsandbytes, at a 4,096-token context.
The learning rate, betas and weight decay came out of an Optuna sweep rather than defaults.
Instruction tuning uses TRL with QLoRA: the base model is loaded in 4-bit and only small adapter weights are trained, then merged back into the model.
A preference-tuning (DPO) stage is planned, and its folder is still empty.

### Challenges

- Every dataset has its own schema. There's one canonical schema with more than 150 columns, and each dataset's entry in `datasets_manifest.yml` maps its raw fields to canonical ones and can add its own SQL filter clause.
- Runs have to be reproducible. Document IDs are UUIDv5s derived from a content hash, every parameter is in YAML, and changes are recorded as new state instead of overwriting the old.
- No single quality score works for everything, so there are several tiers of signals: surface metrics (token counts, readability), perplexity, topical scores (promotional density, academic indicators), and behavioral annotations. The final filter combines them with weights tuned per content type.
- For curriculum training, the output is physically split by `content_type` (prose, code, math), so training can move through them in stages (the macro-curriculum). Difficulty tags are there for in-batch loss reweighting (the micro-curriculum).

## Outcomes

The first 350M pretraining run failed partway; the second ran to its final step, 20,100 steps of about a million tokens each, and the model was then instruction-tuned with QLoRA and merged.
That was the trial run, in June and July 2025.
The 1B model has not been trained.

As of the October 2025 update, the curation pipeline is code complete and passes an end-to-end smoke test that runs the whole thing, through to the final MDS shards, on small samples of the datasets.
The full run over all of the data hasn't started, so the 40-billion-token figure is the target, not a measured result.

On those samples, every source (RedPajama, StarCoder, MegaMath, Open Orca, HelpSteer2 and the rest) ends up in one schema, and every document's path from raw input to final shard can be queried in the manifest, including which filter removed it and why.
Changing a filter threshold means editing YAML and re-running only the stages it affects, not the whole pipeline.
The output is MDS shards organized by category (pretrain, SFT, DPO) and content type, ready for staged training.

Because nothing is deleted, a bad filter can be traced back, and a different threshold can be tried as a what-if query before committing to it.
Keeping metadata in DuckDB and the text in Parquet keeps queries flexible and storage small.

## Implementation Notes

The curation stages run in order from cheapest to most expensive:

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

Each document has `is_valid` and `filter_reason` columns.
A stage only marks a document as filtered and never deletes it, so the audit trail is complete:

```sql
-- Find documents filtered by specific stage
SELECT source_dataset, filter_reason, COUNT(*)
FROM documents
WHERE NOT is_valid
GROUP BY source_dataset, filter_reason;
```

Answers start with a `[RESPOND]` or `[REFUSE]` token, to teach the model when to decline:

```
<|im_start|>assistant
[RESPOND] The capital of France is Paris.<|im_end|>

<|im_start|>assistant
[REFUSE] I cannot provide real-time stock prices.<|im_end|>
```

Both tokens are in the tokenizer's vocabulary from the start, so they mean the same thing from SFT through DPO, where the preference data favors a refusal over a made-up answer.
