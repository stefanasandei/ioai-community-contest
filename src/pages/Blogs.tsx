import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogLayout from '@/components/BlogLayout';
import BlogLoading from '@/components/BlogLoading';
import { ArrowUpRight, ArrowLeft, BookOpen, Download, ChevronDown } from 'lucide-react';
import BlogAuthor from '@/components/BlogAuthor';
import { loadBlog, downloadBlogFile, notebookText, type BlogPost } from '@/lib/blogs';
import posts from 'virtual:blog-index';

const loadRenderer = () => import('@/components/NotebookArticle');
const NotebookArticle = lazy(loadRenderer);

const controlClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-4';

function BackToBlogs() {
  return <Link to="/blogs" className={`${controlClass} -ml-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-700 dark:hover:text-purple-300`}><ArrowLeft size={17} aria-hidden="true" />Back to blogs</Link>;
}

function ArticleContents({ post }: { post: BlogPost }) {
  const sections = post.notebook.cells.flatMap((cell, index) => {
    const heading = cell.cell_type === 'markdown' && notebookText(cell.source).match(/^# (.+)$/m);
    return heading ? [{ title: heading[1], id: `notebook-section-${index}` }] : [];
  });
  if (sections.length < 2) return null;
  return <details className="group mb-10 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 [&::-webkit-details-marker]:hidden">On this page<ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
    <nav aria-label="Article sections" className="grid gap-1 border-t border-gray-200 dark:border-white/10 p-3">
      {sections.map(section => <a key={section.id} href={`#${section.id}`} className="rounded-md px-2 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/5 hover:text-purple-700 dark:hover:text-purple-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600">{section.title}</a>)}
    </nav>
  </details>;
}

export default function Blogs() {
  const { slug } = useParams();
  const [loadedPost, setLoadedPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState(false);
  const summary = posts.find(item => item.slug === slug);
  useEffect(() => {
    let active = true;
    setError(false);
    if (summary) Promise.all([loadBlog(summary.file), loadRenderer()]).then(([data]) => { if (active) setLoadedPost(data); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [summary]);
  const post = loadedPost?.slug === slug ? loadedPost : null;
  useEffect(() => {
    const previous = document.title;
    document.title = `${post?.title ?? 'Blogs'} | AICC`;
    return () => { document.title = previous; };
  }, [post]);
  const articleHeader = slug && post ? <>
    <BackToBlogs />
    <div className="flex flex-col sm:flex-row items-start justify-between gap-5 mt-3 mb-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex-1 tracking-tight leading-tight">{post.title}</h1>
      <button onClick={() => downloadBlogFile(`${post.slug}.ipynb`, JSON.stringify(post.notebook, null, 2))} className="inline-flex min-h-11 shrink-0 items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-4">Download notebook<Download size={16} aria-hidden="true" /></button>
    </div>
    <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
    <p className="flex flex-wrap items-center gap-2 text-sm">By <BlogAuthor {...post} /></p>
  </> : undefined;
  return <BlogLayout article={Boolean(slug)} articleHeader={articleHeader}>
      {error ? <p role="alert">This article could not be loaded. Please refresh to try again.</p> : slug && summary && !post ? <BlogLoading article /> : slug ? post ? <>
        <ArticleContents post={post} />
        <article aria-label={post.title}><Suspense fallback={<BlogLoading article />}><NotebookArticle notebook={post.notebook} /></Suspense></article>
        <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-6"><BackToBlogs /></div>
      </> : <div className="py-16"><h1 className="text-3xl font-bold mb-3">Blog not found</h1><p className="text-gray-500 dark:text-gray-400 mb-5">This article is unavailable. Browse the blog for more posts.</p><BackToBlogs /></div> : <>
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((item, index) => {
            const cover = item.cover;
            return <article key={item.slug} className={index === 0 ? 'md:col-span-2' : ''}>
              <Link to={`/blogs/${item.slug}`} className={`group overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-4 ${index === 0 ? 'grid md:grid-cols-2' : 'flex h-full flex-col'}`}>
                <div className="flex items-center justify-center bg-purple-50 dark:bg-purple-950/20 p-5 sm:p-8 aspect-[16/11] min-w-0">
                  {cover ? <img src={cover} alt={`Plot from ${item.title}`} className="w-full max-h-full object-contain rounded-md bg-white" loading="lazy" /> : <BookOpen className="w-20 h-20 text-purple-400" strokeWidth={1} aria-hidden="true" />}
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center items-start">
                  <h2 className="text-3xl font-semibold tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400">{item.title}</h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                  <div className="mt-6 text-sm text-gray-700 dark:text-gray-300"><BlogAuthor {...item} /></div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">Read article <ArrowUpRight size={16} aria-hidden="true" /></span>
                </div>
              </Link>
            </article>;
          })}
        </div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Want to share your own blog? Contact an organizer on the <a href="https://discord.gg/7GfxrqRreY" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-purple-600 dark:hover:text-purple-400">AICC Discord</a>.
        </p>
      </>}
  </BlogLayout>;
}
