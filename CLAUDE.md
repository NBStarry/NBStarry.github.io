# CLAUDE.md — Project Conventions

## Overview

Personal homepage for Starry Bei (NBStarry), hosted on GitHub Pages at `nbstarry.github.io`. Pure HTML/CSS/JS, zero build step, bilingual (EN/ZH).

## Architecture

- **No build tools, no frameworks.** All JS uses IIFE pattern on a global `App` namespace, loaded with `<script defer>`.
- **CSS design tokens** in `css/variables.css` — all colors, spacing, typography defined as custom properties.
- **i18n via `data-i18n` attributes** — `js/i18n.js` holds all translations. Text content should never be hardcoded in HTML without a `data-i18n` key (except tech names like "Python", "Unity").
- **Blog system**: Markdown files in `blog/posts/`, rendered client-side with `marked.js`. Index in `blog/posts.json`. Bilingual: `slug.md` (EN) + `slug.zh.md` (ZH), with automatic fallback.

## Key Files

| File | Purpose |
|------|---------|
| `js/i18n.js` | All translatable text (EN/ZH). Edit here for content changes. |
| `css/variables.css` | Theme tokens. Edit here for visual changes. |
| `blog/posts.json` | Blog post index. Add `title_zh`/`excerpt_zh` for bilingual. |
| `index.html` | Main page structure. Skill badges and SVG icons live here. |
| `js/projects.js` | GitHub API integration + static fallback data. |

## Conventions

- Mobile-first responsive: default styles for mobile, `@media (min-width: ...)` for larger screens.
- Hover effects wrapped in `@media (hover: hover)` to avoid sticky states on touch devices.
- Use `clamp()` for fluid typography — never fixed `px` or `rem` for text sizes.
- `sessionStorage` caches GitHub API responses to avoid rate limits during development.
- Blog post filenames: `slug.md` (EN), `slug.zh.md` (ZH). Both optional with fallback.

## Deployment

Push to `main` branch → GitHub Pages auto-deploys. No CI/CD configuration needed.
Legacy Hexo content preserved in `legacy` branch.
