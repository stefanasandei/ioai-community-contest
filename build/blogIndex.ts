import fs from 'node:fs';
import path from 'node:path';
import { normalizePath, type Plugin } from 'vite';
import type { BlogPost } from '../src/lib/blogs';

// Keep notebook bodies out of the listing without requiring a second file from authors.
export default function blogIndex(): Plugin {
  const virtualId = 'virtual:blog-index';
  const resolvedId = '\0' + virtualId;
  let directory: string;
  let building = false;
  return {
    name: 'aicc-blog-index',
    configResolved(config) { directory = path.resolve(config.root, 'src/data/blogs'); building = config.command === 'build'; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) {
      if (id !== resolvedId) return;
      const slugs = new Set<string>();
      const summaries = fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort().map(file => {
        const filename = path.join(directory, file);
        if (building) this.addWatchFile(normalizePath(filename));
        const post = JSON.parse(fs.readFileSync(filename, 'utf8')) as BlogPost;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || slugs.has(post.slug)) throw new Error(`Invalid or duplicate blog URL name in ${file}`);
        slugs.add(post.slug);
        let cover: string | null = null;
        for (const cell of post.notebook.cells) {
          for (const output of cell.outputs ?? []) {
            const mime = ['image/png', 'image/jpeg', 'image/webp'].find(type => output.data?.[type]);
            if (mime) {
              const value = output.data![mime];
              cover = `data:${mime};base64,${Array.isArray(value) ? value.join('') : value}`;
              break;
            }
          }
          if (cover) break;
        }
        return { slug: post.slug, title: post.title, description: post.description, author: post.author, handle: post.handle, flag: post.flag, file, cover };
      });
      return `export default ${JSON.stringify(summaries)};`;
    },
    configureServer(server) {
      server.watcher.add(directory);
      const refresh = (filename: string) => {
        if (path.dirname(filename) !== directory || !filename.endsWith('.json')) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
      server.httpServer?.once('close', () => {
        server.watcher.off('add', refresh).off('change', refresh).off('unlink', refresh);
      });
    },
  };
}
