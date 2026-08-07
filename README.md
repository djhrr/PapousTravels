# Papou's Travels

A static travel blog built with [Eleventy (11ty)](https://www.11ty.dev/) and deployed to [papoustravels.com](https://papoustravels.com) via GitHub Pages.

---

## Work Completed

### Infrastructure & Deployment
- Converted site to Eleventy (11ty) with Nunjucks templates
- Added `package.json`, `.eleventy.js`, `src/` layouts and pages
- Set up GitHub Actions workflow (`.github/workflows/deploy.yml`) to auto-build and deploy `_site/` to GitHub Pages on every push to `main`
- Removed `_site/` from git tracking; it is now built and deployed exclusively by GitHub Actions
- Added `.nojekyll` to prevent GitHub Pages from running Jekyll on the output
- SSH key configured for `djhrr` on deployment machine

### Homepage (`src/index.njk`)
- Displays the 2 latest blog posts dynamically (first image, title, excerpt)
- "Latest from YouTube" section pulling live videos from the channel RSS feed at build time (`src/_data/youtube.js`)
- Sidebar calendar events from a private Google Calendar iCal feed, filtered to the next 7 days (`src/_data/calendar.js`)
- Random gallery image widget picking from `assets/blog-images/` on each page load (`src/_data/galleryImages.js`)
- Mission bar tagline: *"Leaving behind a trail of my life for those I love—travel tales, the gear that carried me, and the old familiar roads that shaped who I became."*

### Navigation
- Gallery link opens Google Photos album in a new tab
- Trips and Contact show a "Coming soon" toast notification when clicked

### Blog (`src/blog/index.njk`)
- Lists all posts — no pagination
- Defaults to **newest first** (sorted by date + time)
- Single toggle button switches between Newest first / Oldest first
- A–Z alphabetical sort also available
- Post dates and times displayed in listings

### Blog Posts
- Individual post template (`src/_layouts/post.njk`) shows date and optional time
- `time:` frontmatter field (format: `"HH:MM"` 24hr, must be quoted) enables ordering of multiple posts on the same date

### Admin (`/admin/`)
- Password-protected browser-based admin panel — no server required
- Uses GitHub Contents API directly from the browser (token stored in `localStorage`)
- **Dashboard** with two options: New Post and Edit Posts
- **New Post**: title, date, time, author, dynamic paragraph/image content blocks, publish commits directly to repo
- **Edit Posts**: lists all posts fetched from GitHub, click any to edit title/date/time/author/body, save commits back
- **Delete** post with confirmation
- No backend or hosting cost — runs entirely as a static page on GitHub Pages

### Bug Fixes (this session)
- Fixed blog collection sort — Eleventy parses YAML `date:` as a JS `Date` object, not a string; sort now uses `new Date()` correctly
- Fixed YAML sexagesimal issue — unquoted `time: 09:00` is parsed as the number `540` by YAML; all time values are now stored as quoted strings (`time: "09:00"`) and admin saves them quoted going forward
- Added `timeString` Eleventy filter to safely normalize time values (string or number) to `HH:MM` for display
- Fixed undefined CSS variable `--navy` on sort buttons; replaced with explicit `#1a3a5c`
- Fixed sort button default state — no button is highlighted on page load (newest-first is the natural default)

---

## How to Run Locally

```bash
npm install
npm start        # Eleventy dev server at http://localhost:8080
npm run build    # Build static site into _site/
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `GCAL_ICAL_URL` | Private Google Calendar iCal URL for sidebar events |

Set as a GitHub Actions secret (`GCAL_ICAL_URL`) for production builds.

---

## Deployment

Push to `main` — GitHub Actions builds the site and deploys automatically. No manual steps needed.

---

## Blog Post Frontmatter

```yaml
---
title: "Post Title"
date: 2026-07-01
time: "09:00"       # optional — orders same-day posts; must be quoted HH:MM
author: mrogers
layout: post
---
```

---

## Project Structure

```
src/
  _layouts/         # base.njk, post.njk
  _data/            # youtube.js, calendar.js, galleryImages.js
  blog/             # *.md blog posts
  admin/            # index.njk — hosted admin panel
  index.njk         # homepage
assets/
  css/styles.css
  blog-images/
.eleventy.js        # Eleventy config, filters, collections
.github/workflows/  # deploy.yml — build + deploy pipeline
```

