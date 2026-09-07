export type NotebookText = string | string[];
export interface NotebookOutput {
  output_type: string;
  text?: NotebookText;
  data?: Record<string, unknown>;
  traceback?: string[];
}
export interface NotebookCell {
  cell_type: 'markdown' | 'code' | 'raw';
  source: NotebookText;
  outputs?: NotebookOutput[];
  attachments?: Record<string, Record<string, NotebookText>>;
}
export interface Notebook {
  nbformat: number;
  cells: NotebookCell[];
  metadata?: { language_info?: { name?: string } };
}
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  handle: string;
  flag: string;
  notebook: Notebook;
}
export type BlogSummary = Omit<BlogPost, 'notebook'> & { file: string; cover: string | null };
export const notebookText = (value?: unknown): string => typeof value === 'string' ? value : Array.isArray(value) && value.every(item => typeof item === 'string') ? value.join('') : '';
const isText = (value: unknown) => typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
export function parseNotebook(value: unknown): Notebook {
  const nb = value as Notebook;
  if (!nb || nb.nbformat !== 4 || !Array.isArray(nb.cells) || !nb.cells.length) throw new Error('Choose a nonempty Jupyter notebook in version 4 format.');
  for (const cell of nb.cells) {
    if (!cell || !['markdown', 'code', 'raw'].includes(cell.cell_type) || !isText(cell.source)) throw new Error('The notebook contains an invalid cell.');
    if (cell.outputs !== undefined && (!Array.isArray(cell.outputs) || cell.outputs.some(output => !isRecord(output) || typeof output.output_type !== 'string' || (output.text !== undefined && !isText(output.text)) || (output.traceback !== undefined && !isText(output.traceback)) || (output.data !== undefined && (!isRecord(output.data) || Object.entries(output.data).some(([mime, value]) => /^(text\/|image\/)/.test(mime) && !isText(value))))))) throw new Error('The notebook contains invalid saved outputs.');
    if (cell.attachments && Object.values(cell.attachments).some(bundle => !bundle || Object.values(bundle).some(v => !isText(v)))) throw new Error('The notebook contains an invalid image attachment.');
  }
  return nb;
}
const files = import.meta.glob<{ default: BlogPost }>('/src/data/blogs/*.json');
export async function loadBlog(file: string): Promise<BlogPost> {
  const load = files[`/src/data/blogs/${file}`];
  if (!load) throw new Error('Blog file not found.');
  const { default: post } = await load();
  parseNotebook(post.notebook);
  return post;
}
export function downloadBlogFile(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
