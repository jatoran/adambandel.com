---
title: swe-mux
summary: A terminal multiplexer for coding agents. Real terminals on your own machine, a status per session, and the same sessions on your phone.
status: Active
date: 2026-08-16
started: 2026-07-12
updated: 2026-10-23
github: https://github.com/jatoran/swe-mux
demo: https://swemux.dev/demo/
type: desktop + web
stack:
  - Python
  - aiohttp
  - Preact
  - TypeScript
  - xterm.js
  - SQLite
  - WebView2
  - Tailscale
tags:
  - developer-tools
  - coding-agents
  - terminal
loc: 356000
files: 787
discussions:
  - name: "Hacker News"
    url: "https://news.ycombinator.com/item?id=49867905"
---

## Overview

swe-mux runs coding agents in real terminals on your own machine and serves the same live sessions to the desktop and the phone.

Claude Code, Codex, opencode, pi and oh-my-pi get a live status (working, done, or waiting on you), searchable history and resume.
Anything else runs as an ordinary terminal with everything except the status.

It is the actual terminal, not a UI wrapped around an agent.
Start `claude` in a plain shell pane and that pane becomes an agent session.

## Problem

Running several agents at once was never the hard part.
Finding the one sitting on a question was, and so was answering it away from the desk.
SSH into one shell from a phone gets you a terminal, but not the frontend you need to check, not the diff, and not the other sessions.

## Approach

### Status from three signals

Status comes from the CLI's hooks, its transcript, and the terminal screen.
None of the three alone can tell "waiting on you" apart from "busy in the background", so they are arbitrated together.
The arbitration is pinned by 71 replay fixtures recorded from real sessions.

### A supervisor owns the terminals

A separate supervisor process owns the PTYs, so the daemon can restart and the app can update underneath them without ending a session.
My own daemon started 609 times in the 89 days its log covers.
A reboot, a power loss or the supervisor itself dying still ends the live processes; what survives those is the transcript and enough state to resume each agent.

### The phone is the same sessions

The phone gets the same live sessions over your own Tailscale network, installed as a PWA: the terminal with a key rail, git diff review, files, notes, and a push notification when an agent needs a decision.
A dev server bound to 127.0.0.1 on the host is proxied through swe-mux, so the phone opens it without another exposed port.
Tailscale Serve on 443 provides the HTTPS that the microphone, clipboard and push require.

There is no separate login.
The tailnet policy is the access control, so any device it admits gets a terminal on the machine.

### Agents land their own branches

Agents work in their own git worktrees.
A land queue merges trunk into a branch, runs the project's verification command, and fast-forwards trunk, one branch at a time.
A conflict or a failed check goes back to the agent that owns the branch; the queue never resolves anything itself.
Between Aug 21 and Sep 8 it landed 339 branches across three projects and handed 55 back.

### Stack

- Python and aiohttp for the daemon, SQLite for history, telemetry and the queues
- Preact and TypeScript for the frontend, xterm.js for the terminals
- pywebview over WebView2 for the Windows window; everywhere else it is a browser tab or a PWA
- PyInstaller and Inno Setup for the Windows app; the PyPI wheel ships the built frontend, so it needs no Node

## Limits

Windows is where I use it every day and the only platform with a packaged desktop app.
The installer is unsigned, so SmartScreen warns; `uv tool install swe-mux` avoids that.
macOS and Linux run the daemon and use a browser.
CI runs all three, and I've tested Linux myself, not macOS.

There is no swe-mux account, no server of mine in the path, and no telemetry.
The agents talk to their own providers, and there is a once-a-day update check that can be turned off.

## Outcomes

It was built largely with the agents it runs, working inside it.
The land queue's verification gate and CI on three platforms are what keep that honest.
Being able to play-test a frontend on the phone is what closed the development loop there for a lot of my projects.
