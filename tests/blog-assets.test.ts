import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { prepareBlog, imageTypes } from '../build/blogAssets.ts';
import type { BlogPost } from '../src/lib/blogTypes.ts';

for (const file of fs.readdirSync('src/data/blogs').filter(file => file.endsWith('.json'))) {
  test(`${file}: extracted images and downloaded notebook preserve the original content`, () => {
    const original = JSON.parse(fs.readFileSync(`src/data/blogs/${file}`, 'utf8')) as BlogPost;
    const snapshot = structuredClone(original);
    const assets = new Map<string, Buffer>();
    const view = prepareBlog(original, (name, bytes) => {
      const url = `/assets/${assets.size}-${name}`;
      assets.set(url, bytes);
      return url;
    });
    assert.deepEqual(original, snapshot, 'the source notebook must not be mutated');
    assert.deepEqual(JSON.parse(assets.get(view.downloadUrl!)!.toString()), original.notebook);
    for (const [i, cell] of original.notebook.cells.entries()) {
      assert.deepEqual(view.notebook.cells[i].source, cell.source);
      for (const [j, output] of (cell.outputs ?? []).entries()) {
        const rendered = view.notebook.cells[i].outputs![j];
        for (const [mime, value] of Object.entries(output.data ?? {})) {
          if (imageTypes.includes(mime) && value) {
            const encoded = Array.isArray(value) ? value.join('') : String(value);
            assert.deepEqual(assets.get(rendered.imageUrls![mime]), Buffer.from(encoded, 'base64'));
            assert.equal(rendered.data?.[mime], undefined);
          } else assert.deepEqual(rendered.data?.[mime], value);
        }
      }
    }
  });
}

test('inline attachments and multiple image formats remain available without embedded bytes', () => {
  const original = { slug: 'test', notebook: { nbformat: 4, cells: [
    { cell_type: 'markdown', source: '![plot](attachment:plot)', attachments: { plot: { 'image/png': ['aGVs', 'bG8='], 'text/plain': 'plot' } } },
    { cell_type: 'code', source: '', outputs: [{ output_type: 'display_data', data: { 'image/gif': 'aGk=', 'text/plain': 'fallback' } }] },
  ] } } as BlogPost;
  const assets = new Map<string, Buffer>();
  const view = prepareBlog(original, (name, bytes) => { assets.set(name, bytes); return name; });
  assert.equal(view.notebook.cells[0].attachmentUrls?.plot, 'test.png');
  assert.equal(assets.get('test.png')?.toString(), 'hello');
  assert.equal(assets.get('test.gif')?.toString(), 'hi');
  assert.equal(view.notebook.cells[1].outputs?.[0].data?.['text/plain'], 'fallback');
});
