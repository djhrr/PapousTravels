module.exports = function(eleventyConfig) {
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  
  // Create a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => {
        const aStr = a.data.date + (a.data.time ? 'T' + a.data.time : 'T00:00');
        const bStr = b.data.date + (b.data.time ? 'T' + b.data.time : 'T00:00');
        return new Date(bStr) - new Date(aStr);
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
