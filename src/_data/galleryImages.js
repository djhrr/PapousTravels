const fs   = require('fs');
const path = require('path');

module.exports = function() {
  const dir = path.join(__dirname, '..', '..', 'assets', 'blog-images');
  const exts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
  return fs.readdirSync(dir)
    .filter(f => exts.has(path.extname(f).toLowerCase()))
    .map(f => '/assets/blog-images/' + f);
};
