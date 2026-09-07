import BlogLayout from '@/components/BlogLayout';

export default function BlogLoading({ page = false, article = false }: { page?: boolean; article?: boolean }) {
  const indicator = <div role="status" aria-live="polite" className="min-h-[320px] flex flex-col items-center justify-center gap-5">
    <div className="flex gap-2" aria-hidden="true">
      {[0, 1, 2].map(dot => <span key={dot} className="h-2.5 w-2.5 rounded-full bg-aicc-purple motion-safe:animate-bounce" style={{ animationDelay: `${dot * 150}ms` }} />)}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{article ? 'Loading article…' : 'Loading blog posts…'}</p>
  </div>;
  return page ? <BlogLayout article={article}>{indicator}</BlogLayout> : indicator;
}
