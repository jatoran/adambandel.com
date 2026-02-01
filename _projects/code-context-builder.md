---
title: Code Context Builder
summary: CLI tool for building context-aware code snippets for LLM prompts. Analyzes dependencies and creates minimal, complete code contexts.
status: Active
date: 2025-08-15
github: https://github.com/jatoran/code-context-builder
---

## Overview

A CLI tool for building context-aware code snippets for LLM prompts. Analyzes dependencies and creates minimal, complete code contexts so you can give LLMs exactly what they need without dumping entire repositories.

## Problem

When working with LLMs on code, you often need to provide context about related files, dependencies, and imports. Manually gathering this context is tedious and error-prone. You either include too much (wasting tokens) or too little (missing important context).

## Solution

Code Context Builder analyzes your codebase, traces dependencies, and extracts only the relevant code needed for a given task. It understands import statements, function calls, and class hierarchies to build minimal but complete context.

## Features

- Dependency analysis and tracing
- Smart import resolution
- Minimal context extraction
- Multiple language support
- Token counting and optimization
- Export to various formats

## Technical Details

Built with Python using AST parsing for code analysis. Supports JavaScript, TypeScript, Python, and more. Uses graph algorithms to trace dependencies and minimize context while maintaining completeness.
