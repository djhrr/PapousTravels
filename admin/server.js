const express = require('express');
const session = require('express-session');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { execSync } = require('child_process');

const app  = express();
const ROOT = path.join(__dirname, '..');

// Image uploads go straight into assets/blog-images
const storage = multer.diskStorage({
  destination: path.join(ROOT, 'assets', 'blog-images'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, unique);
  }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'papou-admin', resave: false, saveUninitialized: false }));

// Serve uploaded images so preview works
app.use('/assets', express.static(path.join(ROOT, 'assets')));

/* ── helpers ─────────────────────────────────────────── */
function slugify(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function requireLogin(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/login');
}

/* ── login ───────────────────────────────────────────── */
app.get('/login', (req, res) => res.send(loginPage()));
app.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send(loginPage('Invalid username or password.'));
  }
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

/* ── image upload endpoint ───────────────────────────── */
app.post('/upload-image', requireLogin, upload.single('image'), (req, res) => {
  res.json({ path: '/assets/blog-images/' + req.file.filename });
});

/* ── main editor ─────────────────────────────────────── */
app.get('/', requireLogin, (req, res) => res.send(editorPage()));

/* ── save post ───────────────────────────────────────── */
app.post('/save', requireLogin, (req, res) => {
  const { title, date, blocks } = req.body;
  const parsedBlocks = JSON.parse(blocks);
  const slug = `${date}-${slugify(title)}`;
  const filename = path.join(ROOT, 'src', 'blog', `${slug}.md`);

  let md = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndate: ${date}\nlayout: post\n---\n\n`;
  for (const block of parsedBlocks) {
    if (block.type === 'paragraph') {
      md += block.content.trim() + '\n\n';
    } else if (block.type === 'image') {
      md += `![${block.alt || ''}](${block.src})\n\n`;
    }
  }

  fs.writeFileSync(filename, md, 'utf8');

  try {
    execSync(`git -C "${ROOT}" add -A && git -C "${ROOT}" commit -m "New post: ${title}" && git -C "${ROOT}" push`, { stdio: 'pipe' });
    res.send(successPage(title, slug));
  } catch (e) {
    res.send(successPage(title, slug, 'Post saved locally but Git push failed: ' + e.message));
  }
});

/* ── HTML templates ──────────────────────────────────── */
function layout(body) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Papou Admin</title>
<style>
  *{box-sizing:border-box}
  body{font-family:Poppins,sans-serif;margin:0;background:#f4f4f4;color:#222}
  header{background:#1a3a5c;color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header h1{margin:0;font-size:1.2rem}
  header a{color:#aed6f1;font-size:.85rem;text-decoration:none}
  .wrap{max-width:860px;margin:32px auto;padding:0 16px}
  .card{background:#fff;border-radius:8px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.08);margin-bottom:20px}
  label{display:block;font-weight:600;margin-bottom:6px;font-size:.9rem}
  input[type=text],input[type=date],textarea{width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;font-size:.95rem;font-family:inherit}
  textarea{min-height:120px;resize:vertical}
  .btn{display:inline-block;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-size:.95rem;font-weight:600}
  .btn-primary{background:#1a3a5c;color:#fff}
  .btn-secondary{background:#eee;color:#333}
  .btn-danger{background:#c0392b;color:#fff}
  .btn-green{background:#27ae60;color:#fff}
  .blocks{margin-top:12px}
  .block{background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:16px;margin-bottom:12px;position:relative}
  .block-label{font-size:.75rem;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:8px}
  .block-actions{display:flex;gap:8px;margin-top:10px}
  .add-buttons{display:flex;gap:10px;margin-top:8px}
  .image-preview{max-width:100%;max-height:200px;margin-top:8px;border-radius:4px;display:none}
  .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
</style>
</head><body>
<header><h1>📝 Papou's Travels — Admin</h1><a href="/logout">Log out</a></header>
<div class="wrap">${body}</div>
</body></html>`;
}

function loginPage(error = '') {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin Login</title>
<style>
  *{box-sizing:border-box}body{font-family:Poppins,sans-serif;background:#1a3a5c;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#fff;padding:40px;border-radius:10px;width:100%;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,.3)}
  h2{margin:0 0 24px;color:#1a3a5c;text-align:center}
  label{display:block;font-size:.85rem;font-weight:600;margin-bottom:4px}
  input{width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;margin-bottom:16px;font-size:.95rem}
  button{width:100%;padding:12px;background:#1a3a5c;color:#fff;border:none;border-radius:6px;font-size:1rem;font-weight:600;cursor:pointer}
  .error{color:#c0392b;text-align:center;margin-bottom:12px;font-size:.9rem}
</style></head><body>
<div class="card">
  <h2>Papou Admin</h2>
  ${error ? `<p class="error">${error}</p>` : ''}
  <form method="POST" action="/login">
    <label>Username</label><input name="username" type="text" autofocus>
    <label>Password</label><input name="password" type="password">
    <button type="submit">Log In</button>
  </form>
</div></body></html>`;
}

function editorPage() {
  return layout(`
<div class="card">
  <div class="toolbar"><h2 style="margin:0">New Blog Post</h2></div>

  <div style="margin-bottom:16px">
    <label for="title">Title</label>
    <input type="text" id="title" placeholder="Enter post title…">
  </div>

  <div style="margin-bottom:20px">
    <label for="postDate">Date</label>
    <input type="date" id="postDate" value="${new Date().toISOString().slice(0,10)}">
  </div>

  <label>Content Blocks</label>
  <div class="blocks" id="blocks"></div>

  <div class="add-buttons">
    <button class="btn btn-secondary" onclick="addParagraph()">+ Paragraph</button>
    <button class="btn btn-secondary" onclick="addImage()">+ Image</button>
  </div>
</div>

<button class="btn btn-green" onclick="savePost()" style="width:100%;padding:14px;font-size:1rem;margin-top:4px">
  Publish Post →
</button>

<script>
let blockCount = 0;

function addParagraph() {
  const id = ++blockCount;
  const div = document.createElement('div');
  div.className = 'block'; div.id = 'block-' + id;
  div.innerHTML = \`
    <div class="block-label">Paragraph</div>
    <textarea placeholder="Write your paragraph here…"></textarea>
    <div class="block-actions">
      <button class="btn btn-danger" onclick="removeBlock(\${id})">Remove</button>
    </div>\`;
  document.getElementById('blocks').appendChild(div);
}

function addImage() {
  const id = ++blockCount;
  const div = document.createElement('div');
  div.className = 'block'; div.id = 'block-' + id;
  div.innerHTML = \`
    <div class="block-label">Image</div>
    <input type="file" accept="image/*" onchange="uploadImage(this, \${id})">
    <img class="image-preview" id="preview-\${id}">
    <input type="text" placeholder="Alt text / caption (optional)" style="margin-top:8px" id="alt-\${id}">
    <input type="hidden" id="imgpath-\${id}">
    <div class="block-actions">
      <button class="btn btn-danger" onclick="removeBlock(\${id})">Remove</button>
    </div>\`;
  document.getElementById('blocks').appendChild(div);
}

function removeBlock(id) {
  document.getElementById('block-' + id).remove();
}

async function uploadImage(input, id) {
  const file = input.files[0];
  if (!file) return;
  const form = new FormData();
  form.append('image', file);
  const res  = await fetch('/upload-image', { method: 'POST', body: form });
  const data = await res.json();
  document.getElementById('imgpath-' + id).value = data.path;
  const preview = document.getElementById('preview-' + id);
  preview.src = data.path;
  preview.style.display = 'block';
}

async function savePost() {
  const title = document.getElementById('title').value.trim();
  const date  = document.getElementById('postDate').value;
  if (!title) { alert('Please enter a title.'); return; }

  const blockEls = document.querySelectorAll('#blocks .block');
  const blocks = [];
  blockEls.forEach(el => {
    const label = el.querySelector('.block-label').textContent.trim().toLowerCase();
    if (label === 'paragraph') {
      blocks.push({ type: 'paragraph', content: el.querySelector('textarea').value });
    } else if (label === 'image') {
      const src = el.querySelector('[id^=imgpath-]').value;
      const alt = el.querySelector('[id^=alt-]').value;
      if (src) blocks.push({ type: 'image', src, alt });
    }
  });

  const params = new URLSearchParams();
  params.append('title', title);
  params.append('date', date);
  params.append('blocks', JSON.stringify(blocks));

  const res = await fetch('/save', { method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: params });
  document.open(); document.write(await res.text()); document.close();
}
</script>`);
}

function successPage(title, slug, warn = '') {
  return layout(`
<div class="card">
  <h2 style="color:#27ae60">✅ Post Published!</h2>
  <p><strong>${title}</strong> has been saved and pushed to GitHub.</p>
  ${warn ? `<p style="color:#c0392b;font-size:.9rem">${warn}</p>` : ''}
  <p>GitHub Actions will rebuild the site in ~1 minute. Then visit:</p>
  <p><a href="https://papoustravels.com/blog/${slug}/" target="_blank">papoustravels.com/blog/${slug}/</a></p>
  <a href="/" class="btn btn-primary" style="margin-top:12px;display:inline-block">Write another post</a>
</div>`);
}

app.listen(3000, () => console.log('\n  Admin running at http://localhost:3000\n'));
