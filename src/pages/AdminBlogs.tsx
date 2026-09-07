import { useRef, useState } from 'react';
import NotebookArticle from '@/components/NotebookArticle';
import BlogAuthor from '@/components/BlogAuthor';
import { parseNotebook, downloadBlogFile, type Notebook, type BlogPost } from '@/lib/blogs';

export default function AdminBlogs() {
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [error, setError] = useState('');
  const uploadVersion = useRef(0);
  const [fields, setFields] = useState({ title: '', slug: '', description: '', author: '', handle: '', flag: '' });
  const valid = notebook && fields.title.trim() && fields.author.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug);
  async function upload(file?: File) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setError('');
    setNotebook(null);
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('Please use a notebook smaller than 20 MB. Remove unnecessary saved outputs first.');
      const parsed = parseNotebook(JSON.parse(await file.text()));
      if (version !== uploadVersion.current) return;
      setNotebook(parsed);
      const stem = file.name.replace(/\.ipynb$/i, '');
      setFields(current => ({ ...current, title: current.title || stem, slug: current.slug || stem.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
    } catch (e) { if (version === uploadVersion.current) setError(e instanceof SyntaxError ? 'This file is not valid notebook JSON.' : e instanceof Error ? e.message : 'Could not read this notebook.'); }
  }
  function download() {
    if (!valid) return;
    const post: BlogPost = { ...fields, title: fields.title.trim(), author: fields.author.trim(), notebook };
    downloadBlogFile(`${fields.slug}.json`, JSON.stringify(post, null, 2));
  }
  return <div className="p-6 sm:p-10 text-gray-900 dark:text-gray-100">
    <h1 className="text-3xl font-bold">Blogs editor</h1>
    <p className="mt-3 text-gray-600 dark:text-gray-400">Turn a Jupyter notebook into a blog. Markdown, equations, code, and saved plots are formatted automatically; code is never executed.</p>
    <div className="my-8 grid gap-5 max-w-3xl">
      <label className="grid gap-2 text-sm font-medium">Upload notebook (.ipynb)<input type="file" accept=".ipynb" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-purple-900" /></label>
      {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        {([['title', 'Title *'], ['slug', 'URL name * (lowercase words with hyphens)'], ['author', 'Author name *'], ['handle', 'Handle'], ['flag', 'Country flag (optional)'], ['description', 'Short description']] as const).map(([key, label]) => <label key={key} className="grid gap-2 text-sm font-medium">{label}<input value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 font-normal" /></label>)}
      </div>
      <p className="text-sm text-gray-500">{fields.slug ? `Page address: /blogs/${fields.slug}` : 'Fill in a title, URL name, and author to export.'}</p>
      <button disabled={!valid} onClick={download} className="justify-self-start rounded-md bg-purple-600 px-5 py-2.5 text-white font-medium disabled:opacity-40">Download blog JSON</button>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>To publish, download the blog JSON, then <a href="https://github.com/stefanasandei/ioai-community-contest/upload/main/src/data/blogs" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 underline">upload it to the blog folder on GitHub</a> and submit a pull request. After it is merged and the site deploys, the post appears automatically. Use a unique URL name for each post.</p>
        <p className="mt-2">Uploading here only previews the notebook in this browser. Download your file before leaving this page.</p>
      </div>
    </div>
    {notebook && <article className="max-w-4xl border-t border-gray-200 dark:border-gray-700 pt-8">
      <p className="text-sm text-purple-600 dark:text-purple-400 mb-6">Article preview</p>
      <h2 className="text-4xl font-bold tracking-tight">{fields.title}</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{fields.description}</p>
      <p className="mt-4 mb-10 text-sm flex items-center gap-2">By <BlogAuthor {...fields} author={fields.author || 'Author name'} /></p>
      <NotebookArticle notebook={notebook} />
    </article>}
  </div>;
}
