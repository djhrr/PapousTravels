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
- Mission bar tagline: *"A recorded trail of my life for those I love — down the roads that shaped who I became."*

### Navigation
- Gallery link opens Google Photos album in a new tab
- Trips and Contact show a "Coming soon" toast notification when clicked

### Blog (`src/blog/index.njk`)
- **Card grid layout** — 2 columns on desktop, 1 on mobile; each card shows thumbnail, date, title, excerpt
- Thumbnail fills a 16:9 aspect ratio, zooms subtly on hover; card lifts on hover
- Defaults to **newest first** (sorted by date + time)
- Single toggle button switches between Newest first / Oldest first
- A–Z alphabetical sort also available
- All links open in a new tab (`target="_blank"`)

### Blog Posts
- Individual post template (`src/_layouts/post.njk`) shows date and optional time
- `time:` frontmatter field (format: `"HH:MM"` 24hr, must be quoted) enables ordering of multiple posts on the same date
- All 454 blog images downloaded locally from Blogger CDN — no external image dependencies
- All links in posts open in new tab (HTML anchors and markdown links via `markdown-it-link-attributes`)

### Admin (`/admin/`)
- Password-protected browser-based admin panel — no server required
- Uses GitHub Contents API directly from the browser (token stored in `localStorage`)
- **Dashboard** with tiles: New Post, Edit Posts, Analytics
- **New Post**: title, date, time, author, dynamic paragraph/image content blocks, publish commits directly to repo
- **Edit Posts**: lists all posts fetched from GitHub, click any to edit title/date/time/author/body, save commits back
- **Delete** post with confirmation
- **Analytics tile** links directly to Google Analytics dashboard
- No backend or hosting cost — runs entirely as a static page on GitHub Pages

### Analytics
- Google Analytics 4 embedded on all pages (Measurement ID: `G-9ENW933NCQ`)
- Tracks: pages visited, session duration, countries, cities, browsers, devices, traffic sources
- Access via the Analytics tile in the admin dashboard

### Images
- All 454 blog images migrated from Blogger CDN to `assets/blog-images/` — fully self-hosted
- Large GIFs compressed: `Fontana_Dam.gif` 58MB→23MB, `ride_path.gif` 31MB→23MB
- GIFs resized to max 800px wide with 128-color palette

### Bug Fixes
- Fixed blog collection sort — Eleventy parses YAML `date:` as a JS `Date` object; sort now uses `new Date()` correctly
- Fixed YAML sexagesimal issue — unquoted `time: 09:00` is parsed as `540` by YAML; all time values stored as quoted strings
- Added `timeString` Eleventy filter to safely normalize time values (string or number) to `HH:MM`
- Fixed undefined CSS variable `--navy` on sort buttons
- Fixed sort button default state — no button highlighted on page load
- Fixed multiline HTML `<a>` tags missing `target="_blank"` (single-line regex didn't catch them)
- Fixed Blogger image download bug — URL parser had `imageID` and `size` fields swapped, causing all images to map to the same file; re-downloaded all 454 images with correct parsing

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
  blog-images/      # 454 self-hosted images
.eleventy.js        # Eleventy config, filters, collections
.github/workflows/  # deploy.yml — build + deploy pipeline
```

