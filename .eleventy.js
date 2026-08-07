module.exports = function(eleventyConfig) {
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  
  // Create a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
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

  // Limit an array to N items
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
