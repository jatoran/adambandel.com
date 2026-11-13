---
title: How I rebuild and redeploy my agent runtime without killing a session
date: 2026-11-12
project: swe-mux
---

I build swe-mux inside swe-mux. The coding agents working on it run in it. Before the change this post is about, every backend change meant restarting the daemon, and restarting the daemon killed every terminal it owned, including the agents halfway through making the change.

So the process model now follows one rule: **the process that restarts often can't be the process that owns the sessions.**

## The split

There are two processes.

The PTY supervisor owns every terminal. It spawns PTYs, moves bytes, keeps scrollback, and answers a small message protocol. That's all it does, and it almost never changes, because replacing it is the one thing that ends every live session.

The daemon is everything else: the HTTP and WebSocket server, status detection, queues, automation. It connects to the supervisor and can go away and come back whenever it needs to.

`POST /api/daemon/restart` restarts the daemon in place, and the sessions don't notice. My daemon started 619 times across the 104 days its log covers, 29 times on the busiest day. That number is only tolerable because none of those restarts cost a session.

The price is an asymmetry I have to keep. The supervisor is the part I'm least willing to change, and the update path enforces it: a release that replaces the supervisor says it will end every live session and won't install until you agree. Everything that changes often lives on the daemon's side of the line.

## Redeploying the frozen app

The Windows desktop app is a PyInstaller bundle, so a redeploy replaces the executable, not just some Python files. It's staged so a bad build can't take down the app that's running:

1. Build the new bundle into a staging directory while the old app keeps running.
2. Stop the old app only after the build succeeds, then swap the directories.
3. Health-check the new one. If it never turns healthy, roll back to the previous bundle and keep the bad one for inspection.

The supervisor and every session it owns ride through all three steps. The redeploy is a menu item, it works from the phone, and it runs from an agent session inside the app it's replacing.

Frontend-only changes skip the rebuild entirely. They ship as a hash-verified overlay of about 11 MiB that the daemon prefers over its bundled copy: seconds and one daemon restart, against a rebuild that takes minutes and swaps around 370 MB.

## The Windows parts

Three things that cost me time.

Job objects inherit. If the daemon gets relaunched from inside a session's process tree, it joins that session's job object and dies when that session is killed. The relaunch has to break away from the job on purpose.

File locks make the swap fail late. A process that hasn't fully let go of a file in the old bundle makes the directory rename fail with WinError 5 or 32, right at the end, after a successful build. The swap retries, and if the retries run out it relaunches the old bundle rather than leaving nothing running.

A bound port isn't a ready daemon. Health has to report readiness, not reachability. Otherwise the tray, the redeploy script and the browser all decide the new daemon is up partway through startup and act on a runtime that isn't finished building itself.

## What it changed

I stopped hesitating before restarting anything, because restarting stopped costing anything. That did more for how fast I can work on this project than any single feature.

It doesn't cover everything. A reboot, a power loss or the supervisor crashing still ends the live processes. What survives those is the transcript and enough state to resume each agent where it was.

swe-mux is the terminal multiplexer I run my coding-agent sessions in, highly optimized for mobile use. It's open source (Apache-2.0): [github.com/jatoran/swe-mux](https://github.com/jatoran/swe-mux). The design doc for this mechanism is in the repo.
