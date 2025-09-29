# Project Corpus (subfolder Jekyll site)

Self‑contained Jekyll content that lives entirely under `project-corpus/`. No root `_config.yml` or layouts are required, and there’s no external build step — GitHub Pages’ default Jekyll build handles it.

What you get:

- Index at `/project-corpus/` with search, tag + status filters, and sorting.
- Project pages at `/project-corpus/projects/<slug>/` with a clean case‑study layout.
- Optional update posts per project under `/project-corpus/projects/<slug>/updates/<date>-<title>/`.

Notes:

- Ensure Jekyll is enabled for the repo (default). If there’s a `.nojekyll` file at the repo root, remove it so Liquid/front matter render.
- Because this is subfolder‑only and we don’t define layouts, pages are authored as full HTML files with front matter (copy a sample and edit).

## View Locally

Open at: `http://localhost:4000/project-corpus/`

Option A — Docker (works on Windows/macOS/Linux)

- From the repo root (e.g., `D:\PROJECTS\adambandel.com`):
  - PowerShell: `docker run --rm -it -p 4000:4000 -v "${PWD}:/srv/jekyll" -w /srv/jekyll jekyll/jekyll sh -lc "gem install webrick && jekyll serve --host 0.0.0.0 --incremental --force_polling"`
- Visit: `http://localhost:4000/project-corpus/`

Option B — Docker (Jekyll 3 image, no webrick needed)

- PowerShell: `docker run --rm -it -p 4000:4000 -v "${PWD}:/srv/jekyll" -w /srv/jekyll jekyll/jekyll:3 jekyll serve --host 0.0.0.0 --incremental --force_polling`

Option C — Native Ruby/Jekyll

- Install Ruby + DevKit, then: `gem install jekyll webrick`
- From repo root: `jekyll serve --incremental --host 0.0.0.0`

Troubleshooting:

- “cannot load such file — webrick”: install it (`gem install webrick`) or use the Jekyll 3 image above.
- Windows file watching can be flaky; use `--force_polling`, or rebuild manually with `--no-watch`.
- If Docker can’t access your drive, enable drive sharing in Docker Desktop Settings.

## Live URLs (GitHub Pages)

- Index: `https://<your-domain>/project-corpus/`
- Projects:
  - `/project-corpus/projects/pixel-synth/`
  - `/project-corpus/projects/tidyops-cli/`
  - `/project-corpus/projects/garden-monitor/`

## File Map

- `index.html` — Listing page with search/filters.
- `assets-styles.css` — Global styles for index and project pages.
- `assets-app.js` — Client‑side search/filter/sort.
- `placeholder.svg` — Default cover image when `cover_image` isn’t set.
- `pixel-synth.html` — Sample project (media‑oriented case study).
- `tidyops-cli.html` — Sample project (CLI/tooling write‑up).
- `garden-monitor.html` — Sample project (hardware + updates).
- `pixelsynth-update-2025-07-23-first-prototype.html` — Sample update page.
- `garden-monitor-update-2025-06-01-prototype.html` — Sample update page.
- `garden-monitor-update-2025-07-10-solar-gateway.html` — Sample update page.

## Add a New Project

1) Duplicate any sample project file at the root of this folder:

- `pixel-synth.html` (media‑oriented)
- `tidyops-cli.html` (tooling)
- `garden-monitor.html` (hardware + updates)

2) Edit the front matter at the top:

```
---
title: My Project
summary: One‑line summary for the index
tags: [Tag1, Tag2]
status: Active # or Paused / Archived
date: 2025-08-01
cover_image: /project-corpus/placeholder.svg
alt: Accessible alt text for the cover image
permalink: /project-corpus/projects/my-project/
---
```

3) Update the content sections in the HTML body. Keep the `<head>` links to `/project-corpus/assets-styles.css` so styles apply.

Index behavior:

- Sorting uses the `date` field (most recent first).
- Search checks title, summary, and tags.
- Status filter expects values: `Active`, `Paused`, or `Archived`.

## Add Updates to a Project

Create a new HTML file at the root of this folder with front matter like:

```
---
title: Your update title
date: 2025-08-20
permalink: /project-corpus/projects/my-project/updates/2025-08-20-your-update/
---
```

Then include a minimal HTML page body. Example:

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ page.title }} — My Project Update</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/project-corpus/assets-styles.css">
  </head>
  <body>
    <main class="container" style="padding:24px 0 40px">
      <p><a href="/project-corpus/projects/my-project/">← My Project</a></p>
      <h1>{{ page.title }}</h1>
      <p><time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: '%b %d, %Y' }}</time></p>
      <p>Your update content here.</p>
    </main>
  </body>
  </html>
```

Any project page will automatically list its updates by scanning pages whose URLs are under its `/updates/` subpath and sorting by date.

## Customization Tips

- Cover images: set `cover_image` per project; the index uses it for the card thumbnail.
- Tags: add as many as you want; the index will auto‑build tag chips from all projects.
- Status badges: switch values to reflect the project’s lifecycle.
- Styling: tweak `assets-styles.css` to adjust colors/spacing.

## LLM Authoring Template (Copy/Paste)

Use this section verbatim to brief an LLM so it can create or update pages in this subfolder site without additional context.

System/context for the LLM:

- Only edit files under the `project-corpus/` folder.
- Do not add or modify any files outside `project-corpus/`.
- This site is Jekyll‑rendered by GitHub Pages. Pages are plain HTML files with a YAML front matter block.
- The index page auto‑discovers projects by URL prefix `/project-corpus/projects/` and excludes anything under `/updates/`.
- Keep the CSS/JS includes exactly as shown below so styling and filtering work.

When adding a new project page:

1) Create a new file at `project-corpus/<slug>.html`.
2) Use this exact template, substituting values inside angle brackets:

```html
---
title: <Project Title>
summary: <One‑line summary for the index>
tags: [<Tag1>, <Tag2>, <TagN>]
status: <Active|Paused|Archived>
date: <YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS>
cover_image: /project-corpus/placeholder.svg
alt: <Accessible alt text for the cover image>
permalink: /project-corpus/projects/<slug>/
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ page.title }} — Project</title>
    <meta name="description" content="{{ page.summary }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/project-corpus/assets-styles.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <a href="/project-corpus/" style="text-decoration:none;color:var(--muted)">← Back to all projects</a>
        <h1 class="project-title">{{ page.title }}</h1>
        <p class="project-subtitle">{{ page.summary }}</p>
      </div>
    </header>
    <main class="container project-main">
      <section class="project-content">
        <div class="hero">
          <!-- Replace image or embed a video/iframe if desired -->
          <img src="{{ page.cover_image }}" alt="{{ page.alt }}" />
        </div>

        <h2>Problem</h2>
        <p><Describe the problem or motivation></p>

        <h2>Approach</h2>
        <p><Explain your solution approach and key decisions></p>

        <h3>Architecture</h3>
        <ul>
          <li><High‑level component or service></li>
          <li><Data flow or API usage></li>
          <li><Performance/security/reliability choices></li>
        </ul>

        <h3>Stack</h3>
        <ul>
          <li><Tech or library> — <Why used></li>
          <li><Tooling> — <Role></li>
        </ul>

        <h3>Challenges</h3>
        <ul>
          <li><Challenge> — <How addressed></li>
          <li><Challenge> — <How addressed></li>
        </ul>

        <h2>Outcomes</h2>
        <p><Results, benchmarks, user feedback, impact></p>

        <section class="updates">
          <h2>Updates</h2>
          {% assign updates_base = page.url | append: 'updates/' %}
          {% assign updates = site.pages | where_exp: 'u', "u.url contains updates_base" | sort: 'date' | reverse %}
          {% if updates.size > 0 %}
            {% for u in updates limit: 5 %}
              <article class="update">
                <h3><a href="{{ u.url }}">{{ u.title }}</a></h3>
                {% if u.date %}<time datetime="{{ u.date | date_to_xmlschema }}">{{ u.date | date: '%b %d, %Y' }}</time>{% endif %}
                {% if u.excerpt %}<p>{{ u.excerpt }}</p>{% endif %}
              </article>
            {% endfor %}
          {% else %}
            <p>No updates yet.</p>
          {% endif %}
        </section>
      </section>
      <aside class="project-aside">
        <dl class="facts">
          <dt>Status</dt>
          <dd><span class="badge status {{ page.status | downcase }}">{{ page.status }}</span></dd>
          <dt>Tags</dt>
          <dd>{{ page.tags | join: ', ' }}</dd>
          <dt>Started</dt>
          <dd>{{ page.date | date: '%b %Y' }}</dd>
          <dt>Links</dt>
          <dd>
            <ul>
              <li><a href="#">Live demo</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </dd>
        </dl>
      </aside>
    </main>
    <footer class="site-footer">
      <div class="container">
        <small>© {{ "now" | date: "%Y" }} Adam Bandel</small>
      </div>
    </footer>
  </body>
  </html>
```

When adding an update to an existing project:

1) Create a file at `project-corpus/<slug>-update-<YYYY-MM-DD>-<short>.html` (filename format is flexible; the permalink controls the public path).
2) Use this exact template, substituting values inside angle brackets:

```html
---
title: <Update Title>
date: <YYYY-MM-DD>
permalink: /project-corpus/projects/<slug>/updates/<YYYY-MM-DD>-<kebab-title>/
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ page.title }} — <Project Name> Update</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/project-corpus/assets-styles.css" />
  </head>
  <body>
    <main class="container" style="padding:24px 0 40px">
      <p><a href="/project-corpus/projects/<slug>/">← <Project Name></a></p>
      <h1>{{ page.title }}</h1>
      <p><time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: '%b %d, %Y' }}</time></p>
      <p><Short update content here. Link to commits, demos, or screenshots as needed.></p>
    </main>
  </body>
  </html>
```

Constraints and checks for the LLM:

- Keep pages inside `project-corpus/` and do not alter other folders.
- Ensure the project’s `permalink` starts with `/project-corpus/projects/<slug>/` so it appears on the index.
- Ensure update permalinks start with `/project-corpus/projects/<slug>/updates/` so project pages pick them up.
- Keep the `<link rel="stylesheet" href="/project-corpus/assets-styles.css">` reference unchanged.
- Preserve Liquid tags like `{{ page.title }}` and `{% assign ... %}` exactly.
- Use semantic HTML: headings, paragraphs, lists; code with `<pre><code>...</code></pre>`.
- Provide descriptive `alt` text for images. Prefer Web‑friendly dimensions.
- If no image is available, keep `cover_image: /project-corpus/placeholder.svg`.
- Valid `status` values: `Active`, `Paused`, `Archived`.
- The `date` field should be valid ISO format; the index sorts by it.

Review checklist (LLM should self‑check before finishing):

- [ ] File path is under `project-corpus/`.
- [ ] Front matter keys match the template and have values.
- [ ] `permalink` uses the correct slug and prefixes.
- [ ] Head includes stylesheet at `/project-corpus/assets-styles.css`.
- [ ] Body contains clear sections and no TODO placeholders.
- [ ] Links are valid or marked as TBD.
- [ ] Rendering assumptions: no root Jekyll config required.

