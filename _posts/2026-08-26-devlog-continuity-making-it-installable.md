---
title: "Devlog 4: Making it installable"
date: 2026-08-26
project: continuity
---

Publishing a package and making a package installable turn out to be different problems, and the second one is mostly account settings. This covers 10 to 26 August, v0.4.8 and registry activation.

Devlog 3 ended with an SDK that had a working release pipeline and thirteen tags of scar tissue. What it didn't have was a single command anyone could run to get it. `npm install` returned a 404. `cargo add` found nothing. The only real distribution channel was "download a tarball from a GitHub release," which is not distribution, it's a file share.

This period was closing that. It took eight commits and roughly a full day of hitting account gates that no amount of release tooling could have warned me about.

## The chicken-and-egg nobody mentions

Both npm and crates.io support trusted publishing: your CI authenticates over OIDC, no long-lived token sitting in a secret. Correct, and what the workflow was built for.

Neither of them lets you configure it for a package that doesn't exist yet.

So the first release of anything has to be published by hand, with a token, from a machine. You cannot OIDC your way to a first publish. My entire release pipeline was designed around a mechanism that structurally cannot produce the release it needs to bootstrap itself.

Fine once you know. Nothing in either registry's documentation leads with it.

## Four gates, none of them code

In the order I hit them. Total code changes required: two lines.

| Where | Gate | Detail |
|---|---|---|
| npm | Account had no 2FA | npm refuses publication without it. A security key satisfies it through a browser flow, not an `--otp` code. |
| npm | Scope did not exist | `@continuity-editor` is an organization. A scoped package cannot be published into a scope nobody created. |
| crates.io | Unverified email | Rejected with a 400 before any crate-level validation runs. |
| local publish | Provenance needs CI | `publishConfig.provenance` requires an OIDC provider, so a manual bootstrap must pass `--no-provenance`. |

Every one is an account or registry setting. None is discoverable from the release tooling, and each one surfaces only when you attempt the publish.

The 2FA one is worth expanding, because the error is misleading. npm says two-factor authentication is required and the CLI has an `--otp` flag, so you reasonably go looking for a six-digit code. I'd set up 2FA with a security key. Security keys don't produce codes. The right move is to drop the flag entirely and let the CLI hand you a browser URL, which is not what the error text suggests.

## Two real bugs, found by publishing

### npm read my file path as a GitHub repository

The publish step passed `sdk-bundle/continuity-editor-0.2.34.tgz`. npm parsed that as an `owner/repo` shorthand and went off to run `git ls-remote ssh://git@github.com/sdk-bundle/...tgz.git`, which failed on a missing SSH key.

There had already been one attempt at fixing this, replacing a wildcard with the exact path. It kept the same path *shape*, so it would have failed identically on the next release. The actual fix is a leading `./`, which forces npm to treat the argument as a file rather than a repository. I reproduced both forms locally to be sure rather than guessing.

### Two internal test crates blocked the entire Cargo closure

`cargo publish` refused, saying it couldn't find `continuity-test-support` on crates.io. Which is correct: it's internal test scaffolding and it's deliberately not published.

The cause is that the workspace declared it with both a `path` and a `version`. A dependency carrying a version is resolved from the registry even when it also has a path, and Cargo strips path-*only* dev-dependencies at package time. So the version key was quietly promoting an internal crate into a publication requirement.

Made it path-only, republished, and hit the identical error for `continuity-test-fixtures`. Same defect, second crate, surfaced one at a time because Cargo stops at the first.

In CI that pattern is a burnt tag per discovery. So rather than fix the second one and move on, I audited all 22 workspace path dependencies and added a gate to `sdk-release-check` that rejects any unpublished path dependency carrying a version, then verified the gate fires by reintroducing the defect.

That's the rule I'd extract from this whole period: **when a class of bug surfaces one instance at a time, the fix is a gate, not a patch.** Two occurrences is enough evidence.

## Where it can be installed from

As of 26 August:

| Surface | Command | State | Notes |
|---|---|---|---|
| Rust | `cargo add continuity-engine` | live | crates.io, 0.2.36 |
| Browser / Electron | `npm i @continuity-editor/editor@next` | live | npm, preview channel |
| Windows desktop | `winget install Continuity.Continuity` | pending | manifest PR in review |
| Windows desktop | MSI / portable / standalone | live | GitHub Releases, v0.4.8 |
| C / C++ | DLL plus header | live | release asset, not a registry |
| Python | `pip install continuity-editor` | withheld | Windows-only wheel, no sdist |

The `@next` is not optional. The SDK is a preview channel, so it publishes to the `next` dist-tag and has no `latest`; a bare install won't resolve until the channel flips to stable.

## Deliberately not shipping PyPI

The Python wheel builds for `cp310-abi3-win_amd64` and there's no source distribution. Publishing that means `pip install continuity-editor` fails on Linux and macOS with a resolver error that reads like a broken package rather than an unsupported platform.

An absent package is an honest "not yet." A present one that explodes generates issues and costs trust. It waits for cross-platform wheels.

## Six versions I never shipped

The desktop app had been sitting at 0.4.8 locally while the last published release was 0.4.2 from June. Six versions of real fixes, changelogged, tagged nowhere.

They stay skipped. An unpublished version bump is not a reservation, it was never a public identity, and backfilling would create tags nobody can install. v0.4.8 shipped with notes rolling up all six.

In the same pass I found `EMBEDDING.md` advertising 0.4.2 as the current desktop version, six versions stale, because that table was maintained by hand. It's checked by `docs-check` now and fails the build on drift. Same principle as the Cargo gate: the second time a class of mistake happens, automate the check.

## Where this leaves it

Installable through two registries and submitted to a third. The engine runs in four places. The desktop app is current. Release automation opens its own winget PR.

What's missing is that almost nobody knows it exists, and the honest blockers there aren't technical: there are no screenshots in the README, the builds are unsigned so every install shows a SmartScreen warning, and there's no hosted demo. For an editor, shipping without screenshots is close to shipping nothing.

Four months from an empty repository to this. Most of it was not the editor.
