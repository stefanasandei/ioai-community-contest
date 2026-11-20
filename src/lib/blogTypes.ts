export type NotebookText = string | string[];
export interface NotebookOutput {
  output_type: string;
  text?: NotebookText;
  data?: Record<string, unknown>;
  traceback?: string[];
  imageUrls?: Record<string, string>;
}
export interface NotebookCell {
  cell_type: 'markdown' | 'code' | 'raw';
  source: NotebookText;
  outputs?: NotebookOutput[];
  attachments?: Record<string, Record<string, NotebookText>>;
  attachmentUrls?: Record<string, string>;
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
  publishedAt: string;
  notebook: Notebook;
  downloadUrl?: string;
}
export type BlogSummary = Omit<BlogPost, 'notebook'> & { file: string; cover: string | null };
