import type { BlogPost } from '../src/lib/blogTypes';

export const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
type SaveAsset = (name: string, bytes: Buffer) => string;

// Preserve the authoring file and downloadable notebook. Only the browser's
// reading copy uses separately cached images instead of embedded base64.
export function prepareBlog(original: BlogPost, save: SaveAsset): BlogPost {
  const post = structuredClone(original);
  post.downloadUrl = save(`${post.slug}.ipynb`, Buffer.from(JSON.stringify(original.notebook, null, 2)));
  const saveImages = (data: Record<string, unknown>) => {
    const urls: Record<string, string> = {};
    for (const mime of imageTypes) {
      const value = data[mime];
      if (!value) continue;
      const encoded = Array.isArray(value) ? value.join('') : String(value);
      urls[mime] = save(`${post.slug}.${mime.slice(6)}`, Buffer.from(encoded, 'base64'));
      delete data[mime];
    }
    return urls;
  };
  for (const cell of post.notebook.cells) {
    for (const output of cell.outputs ?? []) {
      if (output.data) output.imageUrls = saveImages(output.data);
    }
    for (const [name, bundle] of Object.entries(cell.attachments ?? {})) {
      const urls = saveImages(bundle);
      const mime = imageTypes.find(type => urls[type]);
      if (mime) (cell.attachmentUrls ??= {})[name] = urls[mime];
    }
  }
  return post;
}
