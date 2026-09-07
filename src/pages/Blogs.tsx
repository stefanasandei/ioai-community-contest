import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import BlogAuthor from '@/components/BlogAuthor';
import NotebookArticle from '@/components/NotebookArticle';
import { loadBlogs, downloadBlogFile, notebookText, type BlogPost } from '@/lib/blogs';

function blogCover(post: BlogPost) {
  for (const cell of post.notebook.cells) {
    for (const output of cell.outputs ?? []) {
      for (const mime of ['image/png', 'image/jpeg', 'image/webp']) {
        if (output.data?.[mime]) return `data:${mime};base64,${notebookText(output.data[mime])}`;
      }
    }
  }
  return null;
}

export default function Blogs() {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; loadBlogs().then(data => { if (active) setPosts(data); }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, []);
  const post = posts?.find(item => item.slug === slug);
  useEffect(() => {
    const previous = document.title;
    document.title = `${post?.title ?? 'Blogs'} | AICC`;
    return () => { document.title = previous; };
  }, [post]);
  return <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0f] dark:text-gray-100">
    <Navigation />
    <main className={`mx-auto ${slug ? 'max-w-4xl' : 'max-w-6xl'} px-5 pt-32 pb-24 sm:px-10`}>
      {error ? <p role="alert">Blogs could not be loaded. Please refresh to try again.</p> : !posts ? <p role="status">Loading blogs…</p> : slug ? post ? <>
        <Link to="/blogs" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">Back to blogs</Link>
        <header className="mt-8 mb-12 border-b border-gray-200 dark:border-white/10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
            <p className="flex flex-wrap items-center gap-2">By <BlogAuthor {...post} /></p>
            <button onClick={() => downloadBlogFile(`${post.slug}.ipynb`, JSON.stringify(post.notebook, null, 2))} className="text-purple-600 dark:text-purple-400 hover:underline">Download notebook</button>
          </div>
        </header>
        <NotebookArticle notebook={post.notebook} />
      </> : <><h1 className="text-3xl font-bold">Blog not found</h1><Link to="/blogs" className="inline-block mt-5 text-purple-600">Back to blogs</Link></> : <>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Blogs</h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Ideas, experiments, and insights into machine learning from the AICC community.</p>
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 gap-8">
          {posts.map((item, index) => {
            const cover = blogCover(item);
            return <article key={item.slug} className={index === 0 ? 'sm:col-span-2' : ''}>
              <Link to={`/blogs/${item.slug}`} className={`group overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-4 ${index === 0 ? 'grid sm:grid-cols-2' : 'flex h-full flex-col'}`}>
                <div className="flex items-center justify-center bg-purple-50 dark:bg-purple-950/20 p-5 sm:p-8 aspect-[4/3] min-w-0">
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
    </main>
    <Footer />
  </div>;
}
