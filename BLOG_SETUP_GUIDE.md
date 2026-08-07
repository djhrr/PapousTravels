# Blog Setup Guide

## ✅ What's Been Added

Your blog has been successfully set up with 57 imported posts from your Blogger account! Here's what's included:

### Directory Structure
```
PapousTravels/
├── src/
│   ├── blog/                    # All 57 blog posts in Markdown
│   │   └── index.njk            # Blog listing page
│   ├── _layouts/                # Page templates
│   │   ├── base.njk             # Base layout (header, nav, footer)
│   │   └── post.njk             # Individual post layout
│   └── index.njk                # Home page
├── .eleventy.js                 # Eleventy configuration
├── package.json                 # Dependencies
└── _site/                       # Generated static site (auto-generated)
```

## 🚀 Running Locally

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start dev server** (runs at http://localhost:8080):
   ```bash
   npm start
   ```

3. **Build static site**:
   ```bash
   npm run build
   ```

## 📝 Adding New Blog Posts

1. Create a new `.md` file in `src/blog/` with the naming format:
   ```
   YYYY-MM-DD-slug-title.md
   ```

2. Add front matter at the top:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2026-08-07
   author: Your Name
   layout: post
   ---

   Your content here...
   ```

3. Save the file and rebuild with `npm run build`

## 🎨 Customizing the Blog

### Styling
- Edit `assets/css/styles.css` to modify:
  - Blog card appearance
  - Post styling
  - Colors and spacing

### Templates
- `src/_layouts/base.njk` - Main page template (header, nav, footer)
- `src/_layouts/post.njk` - Individual post template
- `src/blog/index.njk` - Blog listing page

### Eleventy Config
- `.eleventy.js` - Configure:
  - Passthrough copy for static files
  - Collections
  - Filters

## 🔗 Navigation

The blog is accessible via:
- **Home**: `/` - Shows latest 5 posts
- **Blog**: `/blog/` - Full blog listing (paginated)
- **Individual posts**: `/blog/YYYY-MM-DD-slug/`

## 📤 Deploying

The site generates to `_site/` directory. To deploy to GitHub Pages:

1. Build the site:
   ```bash
   npm run build
   ```

2. Push the `_site` contents to the `gh-pages` branch or use a GitHub Actions workflow

## 🛠️ Maintenance

- **Images in posts**: Currently reference external URLs from Blogger. To use local images, create `assets/blog-images/` and update references in posts.
- **Blog post images**: The imported posts contain HTML image tags - you may want to extract and optimize these.
- **CSS**: Blog styling is in the `assets/css/styles.css` file under the "Blog pages" section

## 📚 Resources

- [Eleventy Documentation](https://www.11ty.dev/)
- [Nunjucks Template Language](https://mozilla.github.io/nunjucks/)
- [Markdown Guide](https://www.markdownguide.org/)

---

Enjoy your new blog! 🎉
