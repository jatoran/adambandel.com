---
title: One editor engine, running natively and in a browser
date: 2026-08-27
project: continuity
---

Extracting a Win32 editor's core into a storage-neutral Rust crate, so the same edit planner runs on the desktop and in WASM.

I write a Windows Markdown notes editor. Last year I pulled its editing core into a standalone crate, and it now runs in four places off one codebase: the native Win32 app, a browser Web Component compiled to WASM, a Python module, and a C ABI.

Same text handling, same selections, same undo, same Markdown projection. Not four implementations that agree by convention and drift apart over eighteen months. One implementation.

Every one of these executes the same edit planner and the same Markdown projection:

| Surface | Package | What it brings |
|---|---|---|
| Native Win32 | `continuity.exe` | DirectWrite / Direct2D, HWND, UIA |
| Browser | `@continuity-editor/editor` | WASM, textarea, DOM, CSS |
| Rust | `continuity-engine` | Headless, host owns storage |
| Python / C | `continuity_engine.h` | abi3 wheel, DLL plus header |

Python, C, and the Rust crate are headless. They ship no widget.

Here's the split, and the three things I got wrong on the way.

## "Just extract the core" is wrong

The obvious plan is: take the editor, delete the platform-specific parts, ship what's left. That plan dies on the first thing you try to delete.

My buffer layer owned its own persistence. Edits went into a rope *and* into SQLite in the same call. Which is a completely reasonable design for a durable notes app, and completely wrong for an embedded editor, where the host owns storage and may not have a filesystem at all.

So the real first move wasn't extraction. It was making the engine **storage-neutral**: it owns buffers, selections, edit planning, undo, and revisions, and it owns *nothing else*. No SQLite. No filesystem. No background threads. No window.

The desktop app didn't lose durability. It stopped being the thing that has durability and became the thing that *projects* engine output into SQLite. The engine emits revisioned change batches; the Windows host writes them down. An embedded engine in someone's web app simply has no such host, and works fine, because nothing inside the engine ever assumed one existed.

That inversion is the whole trick. Everything else fell out of it.

## The layer graph

Above `display_map`, adapters. Below it, nothing knows what a pixel is. Nothing below the split imports anything above it.

| Layer | What it is |
|---|---|
| `text`, `win` | Leaves. No dependencies. |
| `buffer` | Rope, revisions, undo, selections |
| `engine` | Edit planning, change batches. Storage-neutral. |
| `host` | Portable intents and events |
| `decorate` | tree-sitter Markdown spans |
| `display_map` | Source to display projection |

Then the adapters sit on top: DirectWrite/Direct2D, HWND, and UIA on Windows; textarea, DOM, CSS, and browser AT in the web build.

The rule that keeps it honest: if a behavior can live in shared Rust, it must. The moment I catch myself writing an edit planner in JavaScript, the design is wrong and I stop.

**Shared Rust, written once:** text, selections, revisions, undo. Multi-cursor edit planning. Indentation and smart newline. List and task continuation. Markdown parsing and decoration. Source to display projection. Portable input intents.

**Adapter or host:** rendering and pixel measurement. Keyboard, IME, clipboard. Accessibility bridges. Scrolling, focus, window lifecycle. Files and persistence. Menus and application UI. Durability acknowledgements.

## 80 edit operations, one undo group

`SelectionEdit` has 80 variants. Word motions, line operations, Markdown block toggles, table operations, case transforms, the rest.

Every one goes through the same path. A planner takes the edit plus current selections and produces an ordered list of primitive ops, applied as a single undo group.

The detail that took two attempts: **the ops list is built in descending byte order.** Apply front-to-back across multiple cursors and every edit invalidates the offsets of the ones after it. Go backwards and earlier offsets stay valid. Obvious in hindsight, which is where all the good bugs live.

There's a behavior corpus every binding runs. Same inputs, same resulting text, same selections, same revision numbers, same deltas. When the Python binding and the browser disagree about what a block toggle does, that's a failing test, not a support ticket six months later.

## What WASM actually costs

480 KB packed npm package, 1.2 MB `.wasm` inside it. Unpacked it's 1.6 MB total: 1.2 MB of `continuity_wasm_bg.wasm` and 0.4 MB of JavaScript. The engine is most of it and that is the trade.

Bigger than a JavaScript-only editor. What it buys is that the browser runs the identical edit planner as the native app, which is the only reason a shared behavior corpus means anything.

The split: WASM owns editor state, operations, Markdown decoration, and display-map reports. JavaScript owns the semantic textarea, DOM projection, browser input, accessibility, scheduling, and host events. The package creates no database, no filesystem access, no worker, no Electron bridge. It's an editor, not a framework with opinions about your architecture.

React, Svelte, Vue, Preact, vanilla, Electron: all load the same `.wasm`. Adapters, not builds.

## Three things I got wrong

### A textarea and a projected DOM layout will never converge

I spent real time trying to make an invisible textarea's internal line wrapping match the rendered projection exactly so I could read caret position back out of it. It is not possible. Different layout engines, different rounding, different font metrics. You can get close enough to fool yourself for a week. The fix was to stop asking the textarea anything and treat the projection as authoritative, using the textarea purely as an input sink.

### `inputmode="none"` is not symmetric, and the docs will not tell you

On Android I used it to stop a long-press selection from raising the soft keyboard. Worked great. It also *dismisses* the keyboard when applied to an already-focused field, so grabbing a selection handle mid-sentence closed the keyboard you were typing on.

Keyboard visibility on Android is not a function of DOM focus. The back gesture hides the IME without blurring anything, so the field is still focused and Chrome will happily re-raise for any touch that resolves against it. You have to track typing intent plus visual-viewport occlusion, because occlusion is the only signal Android actually gives you.

### Teardown was eating in-progress IME compositions

A composing run is deliberately withheld from the engine until it commits, so until then it lives only in the textarea and no change event has fired. `destroy()` didn't fold it in first. Android keyboards hold compositions open across ordinary typing, so this routinely ate the last word typed on every unmount. Now teardown commits first and emits the change, and there's a method to do it on demand before a manual save.

None of those are Rust problems. All three are in the thin adapter layer, which is exactly where I'd expect them, and it's a decent argument for keeping that layer as thin as you can stand.

## The numbers

Workspace inventory, generated from source: 26 crates, 217k lines of Rust, 306 commands, 80 selection edits, 4 binding surfaces, 0 async fns.

Perf gates, which fail the build rather than a dashboard. Upper bound at p99:

| Gate | p99 budget |
|---|---:|
| keypress to pixel | 8 ms |
| core apply edit | 4 ms |
| WM_PAINT to frame ready | 2 ms |
| buffer apply edit | 2 ms |
| incremental Markdown parse | 1 ms |

Plus dhat asserting zero new heap allocations per keystroke in steady state, and a hard 9 MiB cap on the stripped desktop binary.

## Using it

```bash
npm install @continuity-editor/editor@next
cargo add continuity-engine
```

```html
<script type="module">
  import { initialize } from "@continuity-editor/editor";
  import wasmUrl from "@continuity-editor/editor/wasm?url";
  await initialize({ wasm: wasmUrl });
</script>

<continuity-editor value="# Hello"></continuity-editor>
```

The `@next` is load-bearing. It's a preview channel, publishes to the `next` dist-tag, and a bare install won't resolve.

Python and a C ABI ship in each GitHub release. PyPI is deliberately empty: the wheel is Windows-only with no sdist, and a `pip install` that explodes on Linux is worse than a package that doesn't exist. I'll publish it when there are wheels worth publishing.

[github.com/jatoran/continuity](https://github.com/jatoran/continuity), MIT. Integration docs in `EMBEDDING.md`.

---

Budgets read from the perf-gate tests in `crates/*/tests/perf_gates.rs` and `xtask/src/artifact_budget.rs`. Inventory from `cargo xtask docs`. Package sizes from the `sdk-v0.2.36` release bundle.
