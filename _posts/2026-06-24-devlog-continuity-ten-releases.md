---
title: "Devlog 2: Ten releases, and the bugs that were hiding"
date: 2026-06-24
project: continuity
---

Every one of the serious bugs this month was in something I'd already convinced myself worked. This covers 1 to 24 June, v0.2.0 through v0.4.2.

Eleven commits this period and ten published releases, which tells you the shape of it. This wasn't a month of building. It was a month of finding out what I'd built wrong, mostly by using it every day and occasionally by watching it eat something.

Four of those releases happened within two hours of each other on 1 June, which is what happens when you package a thing and immediately discover four problems.

Ten releases in twenty-five days. The clustering is not a cadence, it's a reaction:

| Release | Date |
|---|---|
| v0.1.0 | 31 May |
| v0.2.0 | 1 June |
| v0.2.5 | 3 June |
| v0.3.0 | 10 June |
| v0.4.0 | 17 June |
| v0.4.2 | 24 June |

v0.1.0 through v0.1.3 landed inside two hours on 31 May, and v0.2.0 through v0.2.5 across three days after that.

## Soft wrap was lying in three different ways

Long lines were overflowing the wrap width. Not by a little, and not consistently, which is the worst combination, because it means you can't reproduce it on demand and you start doubting the report.

There turned out to be three unrelated causes stacked on top of each other.

- **Stale worker fonts.** The layout worker was measuring with a font it had cached before a theme or scale change, so every measurement was subtly wrong in a way that only showed up at the wrap boundary.
- **A max-advance ceiling.** A clamp meant to bound pathological measurement was silently truncating legitimate ones.
- **Hanging-indent continuation budget.** Wrapped continuation lines under a list marker weren't accounting for the indent when computing remaining width.

Each one alone would have been findable. Together they masked each other: fix one and the symptom persists, so you conclude the fix was wrong and revert it.

What actually broke it open was adding a trace event that fired on every overflow with the measurement inputs attached. Three distinct signatures showed up immediately. That's the lesson worth keeping: when a bug won't reproduce, stop reasoning and make it announce itself.

## Ctrl+Z crashed the app

This one was mine, cleanly. Undo and redo advance the buffer revision, same as any edit. But unlike a normal edit, they weren't recording a delta into the rope's change history.

The UI uses that delta history to decide whether its cached display-map specs are still valid. No delta means no invalidation, so after an undo it happily reused a projection built against the *old* rope contents. That projection referenced byte ranges past the end of the new rope, and slicing out of bounds is an abort, not an error.

The fix is one line of principle: **every path that advances a revision must push a delta.** There is no such thing as a revision bump that nothing needs to know about. If it were free to skip, the revision wouldn't need to advance.

### A related one, later the same month

Saving a file left it reporting unsaved changes, permanently.

Two FNV-1a implementations in the codebase with different primes. One in the persistence layer, baked into every checksum already on disk. One I wrote later for content hashing with the canonical prime, because writing a four-line hash is faster than finding the existing one.

Save computed with A, dirty-check compared against B, and they were never going to agree. A checksum baked into persisted data is a wire format the moment you ship it. It's one named function now and nobody is allowed to write another.

## The file on disk was not the file you were looking at

The last real work of the month was external-change reconciliation, and it's the one I'd point at as the most under-appreciated part of a notes app.

Your notes folder is not yours alone. Cloud sync touches it. Antivirus touches it. Backup software touches it. You edit the same note on another machine. The naive behavior, which is what it did before, is to notice on save and either clobber or refuse.

The rule that came out of it:

- **Buffer clean, file changed:** reload silently. There's nothing to lose and a prompt is noise.
- **Buffer dirty, file changed:** banner with reload, keep mine, or show diff. Never a modal, never automatic.

The part that took the time wasn't the rule, it was applying it at *every* entry point. Opening, reopening, session restore, cross-window reveal, and the single-instance handoff where a second launch forwards its file to the running process. Miss one and you have a path where the app quietly disagrees with the disk, which is exactly the class of bug this project exists to not have.

## Versions I skipped

Somewhere in here I also learned that `git tag` in a local clone is not a list of published releases. I picked a "next" version off a stale local tag list, and the tag was already taken on the remote.

Now the release script does a preflight against the actual GitHub releases and warns loudly. Small thing, but it's the shape of most release tooling: every guard exists because something went wrong once.

Next: pulling the entire editing core out of the app, which went about as well as that sounds.
