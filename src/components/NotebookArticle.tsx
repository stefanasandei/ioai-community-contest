import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import { memo, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkMathDisplayDollars from '@/lib/remark-math-display-dollars.js';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { notebookText, type Notebook, type NotebookCell, type NotebookOutput } from '@/lib/blogs';
import 'katex/dist/katex.min.css';
import '@/styles/blogs.css';

const schema = {
  ...defaultSchema,
  protocols: { ...defaultSchema.protocols, src: [...(defaultSchema.protocols?.src ?? []), 'attachment'] },
  attributes: { ...defaultSchema.attributes, code: [['className', /^language-./, 'math-inline', 'math-display']] },
};
const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
function Markdown({ text, cell }: { text: string; cell?: NotebookCell }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkMathDisplayDollars]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeKatex]}
    urlTransform={(url, key) => {
      if (key === 'src' && url.startsWith('attachment:')) {
        const bundle = cell?.attachments?.[url.slice(11)];
        const mime = imageTypes.find(type => bundle?.[type]);
        return mime ? `data:${mime};base64,${notebookText(bundle[mime])}` : '';
      }
      return defaultUrlTransform(url);
    }}
    components={{ h1: ({ children }) => <h2>{children}</h2>, h2: ({ children }) => <h3>{children}</h3>, h3: ({ children }) => <h4>{children}</h4>, img: ({ alt, ...props }) => <img {...props} alt={alt ?? 'Notebook image'} loading="lazy" />, a: ({ children, ...props }) => <a {...props} rel="noreferrer">{children}</a> }}
  >{text}</ReactMarkdown>;
}
function Output({ output }: { output: NotebookOutput }) {
  const data = output.data;
  const mime = imageTypes.find(type => data?.[type]);
  if (mime) return <figure><img src={`data:${mime};base64,${notebookText(data[mime])}`} alt="Saved notebook plot" loading="lazy" /></figure>;
  if (data?.['text/html']) return <div className="notebook-html"><Markdown text={notebookText(data['text/html'])} /></div>;
  if (data?.['text/markdown']) return <Markdown text={notebookText(data['text/markdown'])} />;
  if (data?.['text/latex']) return <Markdown text={notebookText(data['text/latex'])} />;
  const text = notebookText(output.text ?? data?.['text/plain'] ?? output.traceback);
  return text ? <pre className="notebook-output"><code>{text}</code></pre> : <p className="text-sm text-muted-foreground">This interactive output is available in the original notebook.</p>;
}
const NotebookArticle = memo(function NotebookArticle({ notebook }: { notebook: Notebook }) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (/^notebook-section-\d+$/.test(id)) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, [notebook]);
  return <div className="notebook-article prose prose-lg dark:prose-invert max-w-none">
    {notebook.cells.map((cell, index) => {
      const source = notebookText(cell.source);
      if (cell.cell_type === 'markdown') return <section key={index} id={`notebook-section-${index}`}><Markdown text={source} cell={cell} /></section>;
      if (cell.cell_type === 'raw') return <pre key={index}>{source}</pre>;
      return <section key={index} className="notebook-code-cell">
        {source.trim() && <details open={source.split('\n').length <= 12} className="notebook-code"><summary>Code</summary><pre><code>{source}</code></pre></details>}
        {cell.outputs?.map((output, i) => <Output key={i} output={output} />)}
      </section>;
    })}
  </div>;
});
export default NotebookArticle;
