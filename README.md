# Papou's Travels

Summary of work completed
- Converted the site to use Eleventy (11ty).
- Added files: package.json, .eleventy.js, src/ templates (Nunjucks layouts and pages).
- Installed Eleventy (dev dependency) and verified version 2.x.
- Fixed template inheritance and generated the static site into `_site/`.
- Started and tested the Eleventy dev server (http://localhost:8080).
- Published the generated site to the `gh-pages` branch so GitHub Pages serves the site.
- Shortened overly-long image filenames in `assets/blog-images/` (renamed to img-1, img-2, ...).
- Merged `gh-pages` content into `main` via a PR and synced local `main` to origin.

How to run locally
1. npm install
2. npm start        # Eleventy dev server (serves at http://localhost:8080)
3. npm run build    # Build static site into _site/

Deploy notes
- The generated site is published on the `gh-pages` branch. To republish manually:
  - Run `npm run build` then push the contents of `_site/` to `gh-pages` (use a temp repo or a deploy action).
- Consider adding a GitHub Action to build and deploy on push to `main` for automatic deployment.

Notes
- Remote origin was updated to `git@github.com:djhrr/papoustravels.git`.
- If you see missing images after cloning, the long filenames were shortened; check `assets/blog-images/` for renamed files.

If you want, I can add a GitHub Actions workflow to automate builds and deploys.
