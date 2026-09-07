export type NotebookText = string | string[];
export interface NotebookOutput {
  output_type: string;
  text?: NotebookText;
  data?: Record<string, NotebookText>;
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
export const notebookText = (value?: NotebookText) => Array.isArray(value) ? value.join('') : value ?? '';
const isText = (value: unknown) => typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
export function parseNotebook(value: unknown): Notebook {
  const nb = value as Notebook;
  if (!nb || nb.nbformat !== 4 || !Array.isArray(nb.cells) || !nb.cells.length) throw new Error('Choose a nonempty Jupyter notebook in version 4 format.');
  for (const cell of nb.cells) {
    if (!cell || !['markdown', 'code', 'raw'].includes(cell.cell_type) || !isText(cell.source)) throw new Error('The notebook contains an invalid cell.');
    if (cell.outputs !== undefined && (!Array.isArray(cell.outputs) || cell.outputs.some(output => !output || (output.text !== undefined && !isText(output.text)) || (output.data && Object.values(output.data).some(v => !isText(v)))))) throw new Error('The notebook contains invalid saved outputs.');
    if (cell.attachments && Object.values(cell.attachments).some(bundle => !bundle || Object.values(bundle).some(v => !isText(v)))) throw new Error('The notebook contains an invalid image attachment.');
  }
  return nb;
}
const files = import.meta.glob<{ default: BlogPost }>('/src/data/blogs/*.json');
export async function loadBlogs(): Promise<BlogPost[]> {
  return Promise.all(Object.values(files).map(async load => {
    const { default: post } = await load();
    parseNotebook(post.notebook);
    return post;
  }));
}
export function downloadBlogFile(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
