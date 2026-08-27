---
title: The save button is a bug
date: 2026-08-27
project: continuity
---

Every keystroke goes to a local SQLite database. The database is the document, and writing a file is an export.

Every notes app has the same defect and it isn't in the code. It's the moment where you've typed three paragraphs and some background thread in your head is still tracking whether you hit Ctrl+S.

That tracking is cheap once and expensive forever. It's a process you can't kill, running in service of a technical limitation from 1975 that we decided was a UI paradigm.

So I wrote an editor that doesn't have one. Continuity writes every keystroke to a local SQLite database. The database is the document. Writing a `.md` file is an export, the same way you'd export a PDF. Close the app without "saving" and you lose nothing, because there was never an unsaved state to lose.

I've used it as my daily notes app for months. Here's how it works and what it actually cost.

## The file is not the document

The standard model: a file on disk is the document, the editor holds a copy in memory, the copy diverges, and you periodically reconcile. Every bit of save-button UX falls out of that. Dirty indicators. "Do you want to save changes?" Autosave timers. Recovery dialogs that offer you a version from 14 minutes ago and ask you to guess which one you want.

All of that is scaffolding around one decision nobody revisits.

Continuity inverts it. The rope in memory and the SQLite database are the document. Files are output.

The write path, from a key going down to the bytes being durable, is six steps and no step in it waits on a user decision:

1. **Keystroke.** `WM_CHAR` arrives on the UI thread.
2. **Rope.** One insert, delete, or replace op.
3. **Revision.** Buffer revision advances.
4. **Edit row.** Op plus `checksum_after` queued.
5. **WAL.** SQLite append, `synchronous=NORMAL`.
6. **Durable.** Survives power loss.

Every edit becomes a row:

```sql
buffer_edits: (buffer_id, revision, op, bytes, checksum_after, undo_group)
```

`op` is insert, delete, or replace. That's the complete set. One atomic mutation type in the entire system, which matters enormously once you get to recovery.

A row per keystroke sounds absurd until you remember SQLite in WAL mode is *extremely* good at small appends, and you can batch within a frame anyway. The budget: **400 ms from accepted edit to durable on disk, p99.**

400 ms is the number I care about, and not because it's fast. Because it's *bounded*. The promise isn't that your keystroke hits the platter instantly. It's that the window where it hasn't is small and known, instead of being "whenever you remember."

## Replaying 40,000 edits is stupid, so don't

Append-only logs have the obvious problem: opening a buffer means replaying its whole history.

Snapshots. Continuity writes a zstd-compressed snapshot when any of three thresholds trips, whichever comes first: 500 edits since the last snapshot, 256 KiB of accumulated change, or 60 seconds elapsed.

The consequence is that replay depth is bounded at 500 edits regardless of how long a buffer has existed. A note with 40,000 edits of history replays at most 500 of them, not 40,000. That's arithmetic from the policy, not a measurement.

The part I'd defend hardest is the checksum. Every edit row carries `checksum_after`: FNV-1a of the buffer contents after that edit applies. On replay the editor recomputes and compares.

Mismatch, and it stops. Right there, that revision. It does not skip the bad row. It does not attempt a partial reconstruction. It does not try to be helpful. It halts at the last known-good revision and shows you a banner saying exactly where it stopped.

I went back and forth on this for a while, because "recover as much as possible" is obviously the friendlier option. It's also worse, and it's worse in a way that doesn't show up until much later. An app that hands you a quietly corrupted document is far more dangerous than one that says "I got you to revision 8,412 and something after that is wrong." The second one you can act on. The first one you discover six months later when you notice a paragraph you don't remember writing, and now you don't trust any of it.

Fail loudly at a known point. Every time.

## A bug that cost me a day

Two FNV-1a implementations in the same codebase with different primes.

One lived in the persistence layer and was baked into every `checksum_after` value already written to disk. The other was a local copy I wrote later for content hashing, using the canonical prime, because obviously you'd just write the four-line function again rather than go look for the existing one.

Everything worked until they met. Save a file: hash computed with implementation A. Dirty check: compared against implementation B. Result: a file that saved successfully and immediately reported unsaved changes, forever.

The lesson isn't "be careful with hashes." It's that **a checksum baked into persisted data is a wire format the moment you ship it.** It stops being an implementation detail and becomes a contract with every database already out there. It needs to be one named function that nobody is permitted to reimplement, and that rule needs to be written down where the next person will hit it.

It's in the conventions doc now.

## Where the time goes

The entire premise is that this feels immediate, so I gate it in CI. These aren't targets on a dashboard someone glances at quarterly. They fail the build.

Everything a keystroke touches, upper bound at p99. These compose: the parse, paint, and apply gates all sit underneath the 8 ms keypress-to-pixel ceiling.

| Gate | p99 budget |
|---|---:|
| keypress to pixel | 8 ms |
| core apply edit | 4 ms |
| WM_PAINT to frame ready | 2 ms |
| buffer apply edit | 2 ms |
| incremental Markdown parse | 1 ms |

Durability and startup sit two orders of magnitude away, so they're their own set:

| Gate | Budget |
|---|---:|
| cold start, 200 buffers | 500 ms |
| edit to durable on disk | 400 ms |
| open a 100 MB file | 300 ms |
| cold start, empty | 120 ms |
| find across 200 buffers | 80 ms |

Two of those have a current measured value, from a release build on 2026-08-26. Everything else above is a budget, not a measurement.

| Gate | Measured | Budget |
|---|---:|---:|
| keypress to pixel | 3.4 ms | 8 ms |
| stripped binary | 8.55 MiB | 9 MiB |

There's also a dhat assertion of zero new heap allocations per keystroke in steady state. That one has caught more real regressions than every timing gate combined, because allocation creep is invisible right up until it isn't.

## What it's built on, and what it isn't

Native Win32. DirectWrite and Direct2D. ropey for the buffer, tree-sitter for Markdown, SQLite for storage.

No Electron. I don't need 200 MB and a browser engine to render text I typed. That's not a performance argument, or not only one. It's that I want a tool I can understand and repair, and "it's a Chromium" is the opposite of that.

No `async fn` anywhere in the workspace. Threads and `crossbeam_channel`, and a rule that every piece of mutable state names its owning thread in a doc comment. One writer of buffer state. One owner of the window handle. "Which thread owns this" is answerable by reading one line, and I've spent enough of my life on the version of that question you cannot answer.

What's in it, generated from source: 26 crates, 217k lines of Rust, 306 commands, 80 selection edits, 18 themes, 0 async fns.

The constraint I'd push on anyone building something similar: **the rope is canonical and the display map only projects.** Markdown rendering goes through a display map that can hide, replace, or wrap source ranges. It cannot invent content. Every WYSIWYG feature has to survive the display map being ripped out, or it's the wrong feature.

That rule killed several things I wanted. It also means what you see is always what's in the file, which is the whole reason to use a plain-text notes app instead of a rich-text one that lies to you about what it's storing.

What it isn't: Windows only. The engine is portable Rust and there's a WASM build, but the app is Win32 and staying Win32. Not a code editor. It highlights fenced blocks and it's fine for code notes, but if you want an IDE, several excellent ones exist. And it's 0.4.8, so I break things.

## Try it

```
winget install Continuity.Continuity
```

Or take the MSI, a portable zip, or a single standalone exe. Portable keeps everything beside the executable including the database, so it runs off a USB stick without touching AppData or the registry.

No account. No telemetry. No cloud. No sync service that gets acquired and shut down in three years.

[github.com/jatoran/continuity](https://github.com/jatoran/continuity), MIT.

The editing engine is published separately if you want it inside something you're building. Separate post.

---

Budgets read from the perf-gate tests in `crates/*/tests/perf_gates.rs` and `xtask/src/artifact_budget.rs`. Measured values from `cargo xtask bench-fast`, release build. Inventory from `cargo xtask docs`.
