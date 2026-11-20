import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { normalizePath, type Plugin } from 'vite';
import type { BlogPost } from '../src/lib/blogTypes';
import { prepareBlog, imageTypes } from './blogAssets';

// Listing metadata and article text are small modules. Saved plots are normal
// cached assets; the original notebook is fetched only on Download notebook.
export default function blogIndex(): Plugin {
  const indexId = 'virtual:blog-index';
  const loadersId = 'virtual:blog-loaders';
  const postPrefix = 'virtual:blog-post/';
  let directory: string;
  let building = false;
  let base: string;
  const devAssets = new Map<string, { bytes: Buffer; mime: string }>();
  const filenames = () => fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort();
  return {
    name: 'aicc-blog-index',
    configResolved(config) {
      directory = path.resolve(config.root, 'src/data/blogs');
      building = config.command === 'build';
      base = config.base;
    },
    resolveId(id) {
      if (id === indexId || id === loadersId || id.startsWith(postPrefix)) return '\0' + id;
    },
    load(id) {
      if (!id.startsWith('\0virtual:blog-')) return;
      const files = filenames();
      if (id === '\0' + loadersId) {
        return `export default {${files.map(file => `${JSON.stringify(file)}: () => import(${JSON.stringify(postPrefix + file.replace(/\.json$/, '.js'))})`).join(',')}};`;
      }
      const references = new Map<string, string>();
      const save = (name: string, bytes: Buffer) => {
        if (building) {
          const reference = this.emitFile({ type: 'asset', name, source: bytes });
          const token = `__AICC_ASSET_${reference}__`;
          references.set(token, `import.meta.ROLLUP_FILE_URL_${reference}`);
          return token;
        }
        const ext = path.extname(name);
        const key = `/@aicc-blog-assets/${createHash('sha256').update(bytes).digest('hex')}${ext}`;
        const mime = ext === '.ipynb' ? 'application/json' : `image/${ext.slice(1)}`;
        devAssets.set(key, { bytes, mime });
        return `${base.replace(/\/$/, '')}${key}`;
      };
      const read = (file: string) => {
        const filename = path.join(directory, file);
        this.addWatchFile(normalizePath(filename));
        return JSON.parse(fs.readFileSync(filename, 'utf8')) as BlogPost;
      };
      let value: unknown;
      if (id.startsWith('\0' + postPrefix)) {
        const file = id.slice(postPrefix.length + 1).replace(/\.js$/, '.json');
        if (!files.includes(file)) throw new Error('Blog file not found.');
        value = prepareBlog(read(file), save);
      } else if (id === '\0' + indexId) {
        const slugs = new Set<string>();
        value = files.map(file => {
          const post = read(file);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt ?? '') ||
            !Number.isFinite(Date.parse(`${post.publishedAt}T00:00:00Z`)) ||
            new Date(`${post.publishedAt}T00:00:00Z`).toISOString().slice(0, 10) !== post.publishedAt) {
            throw new Error(`Set a valid publishedAt date (YYYY-MM-DD) in ${file}`);
          }
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) throw new Error(`Invalid or duplicate blog URL name in ${file}`);
          slugs.add(post.slug);
          let cover: string | null = null;
          for (const cell of post.notebook.cells) {
            for (const output of cell.outputs ?? []) {
              const mime = imageTypes.find(type => output.data?.[type]);
              if (mime) {
                const data = output.data![mime];
                cover = save(`${post.slug}.${mime.slice(6)}`, Buffer.from(Array.isArray(data) ? data.join('') : String(data), 'base64'));
                break;
              }
            }
            if (cover) break;
          }
          return { slug: post.slug, title: post.title, description: post.description, author: post.author, handle: post.handle, flag: post.flag, publishedAt: post.publishedAt, file, cover };
        }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
      } else return;
      let serialized = JSON.stringify(value);
      for (const [token, reference] of references) serialized = serialized.replaceAll(JSON.stringify(token), reference);
      return `export default ${serialized};`;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const asset = devAssets.get((req.url ?? '').split('?')[0]);
        if (!asset) return next();
        res.setHeader('Content-Type', asset.mime);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.end(asset.bytes);
      });
      server.watcher.add(directory);
      const refresh = (filename: string) => {
        if (path.dirname(filename) !== directory || !filename.endsWith('.json')) return;
        for (const [id, module] of server.moduleGraph.idToModuleMap) {
          if (id.startsWith('\0virtual:blog-')) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
      server.httpServer?.once('close', () => {
        server.watcher.off('add', refresh).off('change', refresh).off('unlink', refresh);
      });
    },
  };
}
