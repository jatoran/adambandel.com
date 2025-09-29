# Project Corpus (subfolder Jekyll site)

Self-contained Jekyll content that lives entirely under `project-corpus/` without touching the root site.

What you get:

- `/project-corpus/` index with search, tag/status filters, and sorting.
- Project pages under `/project-corpus/projects/<slug>/` with a sidebar of facts.
- Optional update posts per project under `/project-corpus/projects/<slug>/updates/<date>-<title>/`.

Notes:

- This relies on GitHub Pages running Jekyll (default). If your repo has a `.nojekyll` file at the repository root, remove it for this to render.
- No root `_config.yml` or global layouts are required; everything is local to this folder and uses permalinks.

## Add a new project

1) Duplicate one of the sample project files at the root of this folder:

- `pixel-synth.html` (media‑oriented)
- `tidyops-cli.html` (tooling write‑up)
- `garden-monitor.html` (hardware + updates)

2) Update the front matter at the top:

```
---
title: My Project
summary: One‑line summary appears on the index
tags: [Tag1, Tag2]
status: Active
date: 2025-08-01
cover_image: /project-corpus/placeholder.svg
alt: Accessible alt text for the cover image
permalink: /project-corpus/projects/my-project/
---
```

3) Adjust the content sections as desired. Keep the CSS/JS links pointing to `/project-corpus/assets-styles.css`.

Tip: If you prefer Markdown, you can author content with simple HTML headings/paragraphs, or switch this site later to a full Jekyll layout at the repo root for proper Markdown layouts.

## Add updates to a project

Create a new file at the root of this folder with front matter like:

```
---
title: Your update title
date: 2025-08-20
permalink: /project-corpus/projects/my-project/updates/2025-08-20-your-update/
---
```

Then add the HTML content (you can keep it minimal). The update will auto‑appear in the project’s “Updates” section (sorted by date).

## Assets

- Global stylesheet: `/project-corpus/assets-styles.css`
- Global JS (filters/search): `/project-corpus/assets-app.js`
- Placeholder cover image: `/project-corpus/placeholder.svg`

You can point any project’s `cover_image` to an image in your repository (or a remote URL) to override the placeholder.

