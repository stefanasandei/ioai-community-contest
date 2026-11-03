import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';

const manifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'));
function dependencies(key, seen = new Set()) {
  if (seen.has(key)) return seen;
  assert.ok(manifest[key], `Missing manifest entry: ${key}`);
  seen.add(key);
  for (const entry of manifest[key].imports ?? []) dependencies(entry, seen);
  return seen;
}
const entryFiles = [...dependencies('index.html')].map(key => manifest[key].file);
const jsBytes = entryFiles.reduce((sum, file) => sum + fs.statSync(`dist/${file}`).size, 0);
const jsGzip = entryFiles.reduce((sum, file) => sum + gzipSync(fs.readFileSync(`dist/${file}`)).length, 0);
assert.ok(jsGzip < 170_000, `Initial JavaScript exceeds the 170 KB gzip budget: ${jsGzip}`);

const deferred = ['Contests', 'Tasks', 'Team', 'Resources', 'Roadmap', 'Solution', 'Leaderboard', 'AdminLogin', 'AdminLayout', 'AdminRounds', 'AdminRoadmap', 'AdminResources', 'AdminTasks', 'AdminBlogs', 'Blogs'];
for (const name of deferred) {
  const key = name === 'AdminLayout' ? `src/components/${name}.tsx` : `src/pages/${name}.tsx`;
  assert.ok(manifest[key]?.isDynamicEntry, `${name} must remain a separate page download`);
  assert.ok(!entryFiles.includes(manifest[key].file), `${name} was pulled into the homepage`);
}
const blogBytes = fs.statSync(`dist/${manifest['src/pages/Blogs.tsx'].file}`).size;
assert.ok(blogBytes < 20_000, `Blog listing exceeds the 20 KB budget: ${blogBytes}`);
for (const [key, chunk] of Object.entries(manifest)) {
  if (!key.startsWith('virtual:blog-post/')) continue;
  const text = fs.readFileSync(`dist/${chunk.file}`, 'utf8');
  assert.ok(text.length < 150_000, `${key} exceeds the 150 KB article-text budget`);
  assert.ok(!/data:image\/[^;]+;base64/.test(text), `${key} embeds images in JavaScript`);
}
// Downloaded notebooks must still contain the complete original saved outputs.
const notebooks = fs.readdirSync('dist/assets').filter(file => file.endsWith('.ipynb'));
for (const file of fs.readdirSync('src/data/blogs').filter(file => file.endsWith('.json'))) {
  const post = JSON.parse(fs.readFileSync(`src/data/blogs/${file}`, 'utf8'));
  const candidates = notebooks.filter(file => file.startsWith(`${post.slug}-`));
  assert.equal(candidates.length, 1, `Missing or ambiguous notebook download for ${post.slug}`);
  const downloaded = JSON.parse(fs.readFileSync(`dist/assets/${candidates[0]}`, 'utf8'));
  assert.deepEqual(downloaded, post.notebook, `Notebook changed during asset extraction: ${post.slug}`);
}
console.log(JSON.stringify({ initialJavaScript: { bytes: jsBytes, gzipBytes: jsGzip }, blogListingBytes: blogBytes, deferredPages: deferred.length, completeNotebooks: notebooks.length }, null, 2));
