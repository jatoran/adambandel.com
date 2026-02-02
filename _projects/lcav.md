---
title: LCAV - LLM Code Analysis & Validation
summary: Developer tool that simulates, analyzes, and safely applies LLM-generated code changes to existing repositories
date: 2025-04-27
---

## Overview

LCAV is a developer tool designed to bridge the gap between AI-generated code and production codebases. When working with LLMs like Claude or GPT, developers often receive code suggestions spanning multiple files in various formats—full files, code snippets, or unified diffs. LCAV parses these outputs, simulates their application in memory, performs multi-layered analysis, and provides a controlled pathway to integrate changes safely.

The system addresses a real pain point in AI-assisted development: the uncertainty and risk involved in manually copying LLM outputs into existing projects. By providing textual diffs, semantic analysis, linting comparisons, and dependency impact visualization, LCAV gives developers confidence and transparency before any changes touch their actual codebase.

## Screenshots

<!-- SCREENSHOT: Main application view showing split-pane interface with LLM input on left and analysis results on right, with a project selected in the management panel -->
![Main Interface](/images/projects/lcav/screenshot-1.png)

<!-- SCREENSHOT: Dependency graph visualization modal showing rustworkx-generated graph with nodes representing functions/classes and edges showing data dependencies and control flow -->
![Dependency Graph View](/images/projects/lcav/screenshot-2.png)

<!-- SCREENSHOT: Diff viewer showing side-by-side comparison between original repository file and simulated changes, with Monaco editor highlighting additions/deletions -->
![Diff Comparison View](/images/projects/lcav/screenshot-3.png)

<!-- SCREENSHOT: Analysis details panel showing lint comparison results, changed entity list (functions/classes added/modified), and file statistics -->
![Analysis Details Panel](/images/projects/lcav/screenshot-4.png)

## Problem

Working with LLM-generated code presents several challenges:

- **Multi-format outputs**: LLMs produce code in inconsistent formats—sometimes full files, sometimes snippets, sometimes diffs with context
- **Blind copy-paste risk**: Manually integrating suggestions can introduce bugs, break existing functionality, or violate coding standards without visibility
- **No impact analysis**: Understanding which functions or dependencies are affected by a change requires manual code review
- **Validation overhead**: Developers must manually run linters, compare diffs, and verify correctness—slowing down the AI-assisted workflow

LCAV was built to automate this validation workflow and provide the "peace of mind" developers need when integrating AI-generated code.

## Approach

The system uses a simulation-first architecture where LLM changes are applied textually in memory before any analysis occurs. This allows comparison between the original repository state and a "Simulated Final State" without touching the actual filesystem.

### Stack

- **Backend Framework** - FastAPI with Python 3.12+ for async API endpoints and orchestration
- **Python Parsing** - LibCST for concrete syntax tree analysis with full formatting fidelity, enabling accurate semantic comparisons
- **Semantic Analysis** - Jedi for symbol resolution, type inference, and cross-file reference tracking
- **Graph Library** - rustworkx for high-performance Program Dependency Graph (PDG) construction and traversal
- **Diff Generation** - GumTree via subprocess for AST-based semantic diffing that detects moves and renames
- **Linting** - Ruff for Python and ESLint for TypeScript/JavaScript, with artifact cleaning to remove LLM comment markers
- **Database** - SQLite via SQLModel for project profiles and file artifact caching
- **Frontend Framework** - React 18+ with TypeScript, Vite, and Tailwind CSS
- **State Management** - Zustand for UI state, TanStack Query for server state with intelligent caching
- **UI Components** - shadcn/ui for consistent design, Monaco Editor for code/diff views, Cytoscape.js for graph visualization

### Challenges

- **Robust LLM parsing** - LLM outputs are wildly inconsistent. Built a multi-pass parser that handles code fences, marker-based blocks, unified diffs, and prose with heuristic filename detection
- **File matching cascade** - Implemented a prioritized matching strategy (Override → Exact → Fuzzy → Diff Header → Content Similarity via Jaccard) to reliably associate LLM blocks with repository files
- **LibCST complexity** - Debugging CST visitors required extensive logging; nested type hints and complex syntax required careful structure inspection rather than assuming direct mappings
- **Graph builder state management** - The PDG builder juggles CFG predecessors, control stacks, and definition maps. Qualified name consistency between initial structure passes and call resolution was critical
- **External tool parsing brittleness** - Relying on GumTree's text output required robust parsing against variations and incomplete output

## Outcomes

LCAV successfully provides:

- **Simulation-based analysis** that lets developers preview exactly what changes will occur before committing
- **Multi-layered insights** including textual diffs, changed entity lists, lint status comparisons, and file statistics
- **Dependency impact visualization** with rustworkx-backed graphs showing control flow, data dependencies, and call relationships
- **Safe Git workflow** with automatic branching, selective file staging, and rollback support
- **Cross-language support** with deep Python analysis and basic support for TypeScript/JavaScript files

The project reinforced that incremental progress and targeted logging are essential when building complex AST/CST-based analysis tools. Each layer of the analysis pipeline (parsing → matching → simulation → diffing → graphing) required isolated testing before integration.

## Implementation Notes

The core analysis pipeline demonstrates the simulation-first approach:

```python
# Orchestration flow (simplified)
parsed_blocks = parsing_service.parse_llm_dump(raw_dump)
match_results = matching_service.match_blocks(parsed_blocks, repo_files)

for matched_file in match_results.matched_files:
    simulated_content = simulation_service.simulate(
        original_content=matched_file.original,
        llm_blocks=matched_file.blocks
    )
    
    # All analysis compares original vs simulated
    text_diff = diff_service.textual_diff(original, simulated)
    semantic_diff = diff_service.semantic_diff(original, simulated)  # GumTree
    entities = changed_entity_service.compare_csts(original_cst, simulated_cst)
    lint_results = lint_service.compare(original, simulated)
```

The graph builder uses LibCST visitors in two passes—first building the structural skeleton (modules, classes, functions), then adding CFG/DD/call edges:

```python
# Pass 1: Structure
wrapper = cst.metadata.MetadataWrapper(file_cst)
visitor = _InitialStructureVisitor(graph, node_map, file_origin)
wrapper.visit(visitor)

# Pass 2: Dependencies
pdg_visitor = _PDGBuilderVisitor(graph, node_map, file_cst, file_origin, semantic_service)
wrapper.visit(pdg_visitor)
```

The frontend uses React Context to centralize complex actions that span multiple hooks and store updates, reducing prop drilling in the multi-panel layout.
