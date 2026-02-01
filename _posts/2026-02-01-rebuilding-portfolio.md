---
title: Why I'm Rebuilding My Portfolio (Again)
date: 2026-02-01
---

From fancy templates to simple HTML. Sometimes the best design is the one that gets out of your way.

## The Problem with Template Sites

My old portfolio used an HTML5 UP template - lots of animations, scroll effects, image galleries. It looked professional but had problems:

- Hard to update (buried in nested divs)
- Slow to load (heavy assets)
- Didn't reflect how I actually work (minimal, text-focused)
- Not set up for blogging

## What I Wanted

- Dead simple to update
- Fast loading
- Text-focused, minimal design
- Easy to add projects AND blog posts
- Version controlled content (Jekyll + markdown)

## The Solution

Started with a single HTML prototype using Solarized Light colors. No frameworks, no build step for the prototype. Just clean HTML and CSS.

Then moved to Jekyll for the dynamic parts:
- Projects as markdown files in `_projects/`
- Blog posts in `_posts/`
- Simple Liquid templates to generate listings

## What I Learned

1. **Simplicity scales better than complexity**
   - Adding a new project = drop a markdown file
   - No database, no CMS, no complexity

2. **GitHub Pages + Jekyll is underrated**
   - Free hosting
   - Automatic builds
   - Version control built-in

3. **Design constraints help**
   - Limited myself to Solarized colors
   - No images (for now)
   - Pure text listings

The result is a site I can actually maintain and want to update. That's the real win.
