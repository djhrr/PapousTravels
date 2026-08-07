module.exports = function(eleventyConfig) {
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  
  // Create a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => {
        const aDate = new Date(a.data.date);
        const bDate = new Date(b.data.date);
        // time may be a string "HH:MM" or a number (YAML sexagesimal, e.g. 09:00 = 540)
        const toMins = t => typeof t === 'number' ? Math.floor(t/60) * 60 + (t % 60)
          : (t ? t.split(':').reduce((h,m) => h*60 + +m, 0) : 0);
        aDate.setMinutes(aDate.getMinutes() + toMins(a.data.time));
        bDate.setMinutes(bDate.getMinutes() + toMins(b.data.time));
        return bDate - aDate;
      });
  });
  
  // Add useful filters
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  // Convert time value (string "HH:MM" or YAML sexagesimal number) to "HH:MM" string
  eleventyConfig.addFilter("timeString", t => {
    if (!t && t !== 0) return '';
    if (typeof t === 'number') {
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    }
    return t;
  });

  // Format a JS Date object for calendar display
  eleventyConfig.addFilter("calDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  });

  eleventyConfig.addFilter("calTime", dateObj => {
    const d = new Date(dateObj);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  });
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("firstImage", content => {
    const match = content && content.match(/<img[^>]+src="([^"]+)"/i);
    return match ? match[1] : null;
  });

  // Extract the first non-empty plain-text paragraph from HTML content
  eleventyConfig.addFilter("firstParagraph", content => {
    if (!content) return '';
    // Strip all tags, collapse whitespace, split on double newlines or </p>
    const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Return first ~180 characters, cut at last word boundary
    const chunk = plain.slice(0, 180);
    return chunk.length < plain.length ? chunk.slice(0, chunk.lastIndexOf(' ')) + '…' : chunk;
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"]
  };
};
