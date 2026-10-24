---
title: I built a terminal multiplexer for coding agents that works on my phone
date: 2026-10-23
project: swe-mux
---

I run a lot of coding agents at once, mostly Claude Code and Codex, across several projects. Running them was never the problem. The problems were everything around them: too many windows, agents leaving hung processes behind, no way to tell which one was waiting on me, and having to remote into my desktop or SSH into a single shell to deal with any of it from my phone. Even then, a terminal on a phone couldn't show me the frontend I needed to check.

I tried Orca and herdr. Both were better than what I had. Neither had a real markdown notes editor, and neither had a phone interface I could actually work in. So I built swe-mux.

## What it is

A terminal multiplexer. It runs any shell or CLI in real terminals on your own machine and serves the same live sessions to your desktop and your phone. Claude Code, Codex, opencode, pi and oh-my-pi get a live status (working, done, or waiting on you), searchable history and resume. Anything else runs as an ordinary terminal with everything except the status.

It's the actual terminal, not a UI wrapped around the agent. You can use it as a plain terminal, or start `claude` in a shell and that pane becomes an agent session.

On the desktop it's tabs and panes of sessions, notes, files and dev-server previews. Shift+Enter, Ctrl+Backspace, paste and click-to-position behave the same in every agent, shortcuts come from tmux, VS Code, Vim or Emacs presets, and images paste straight from the clipboard.

## Status

Status comes from three places: the CLI's hooks, its transcript, and the terminal itself. No single one of them reliably tells "waiting on you" apart from "busy in the background", so it uses all three. You pick which events alert you and how, a sound on the desktop and a push notification on the phone, with quiet hours and separate desktop and mobile settings.

## The phone

The same sessions, over your own Tailscale network, installed as a PWA. The terminal with a usable keyboard and a key rail for the keys a phone keyboard doesn't have, git diff review, files, notes, and a push notification when an agent needs a decision.

A dev server bound to 127.0.0.1 on the host is proxied through swe-mux, so the phone opens it without another port being exposed. Being able to play-test and check a frontend on the phone is what closed the development loop there for a lot of my projects. I can work from anywhere now, and I do.

Your tailnet policy is the access control. There's no separate swe-mux login, so any device your tailnet admits gets a terminal on your machine. Treat it like SSH.

## Two things I use constantly

A prompt queue, so the thing I think of mid-turn waits until the agent is actually done instead of interrupting it.

Messages between sessions, so a Codex session can ask a Claude session something. I don't want my workflow tied to one provider.

## Notes

Notes, and any markdown file in a project, open in the same WYSIWYG editor on desktop and phone, and they autosave. No more notes scattered across different places.

## Sessions survive updates

A separate supervisor process owns the terminals, so the daemon can restart and the app can update underneath them without killing anything. I update it several times a day. My own daemon started 609 times across the 89 days its log covers, so this was never optional.

It has limits. A reboot, a power loss or the supervisor itself crashing still ends the live processes. What survives those is the transcript and enough state to resume each agent.

## Limits

It was built on Windows, which is where I use it every day and the only platform with a packaged desktop app. The installer is unsigned, so SmartScreen warns on first run; the PyPI install avoids that. macOS and Linux run the daemon and use a browser. CI runs all three, and I've tested Linux myself, but I haven't lived on macOS.

There's no swe-mux account, no server of mine in the path, and no telemetry. The agents still talk to their own providers, and there's a once-a-day update check you can turn off in Settings.

## Try it

The [demo](https://swemux.dev/demo/) is the real interface with simulated agents, nothing to install.

Install with `uv tool install swe-mux` (or `pipx install swe-mux`), then run `swe-mux` on Windows or `swemux start` elsewhere. It's Apache-2.0: [github.com/jatoran/swe-mux](https://github.com/jatoran/swe-mux).

I've put a lot of work into the first run. Where the install or the first hour goes wrong is the feedback I want most.
