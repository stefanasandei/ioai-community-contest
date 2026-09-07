import type { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BlogLayout({ children, article = false, articleHeader }: { children: ReactNode; article?: boolean; articleHeader?: ReactNode }) {
  return <div className={`min-h-screen ${article ? 'pt-20' : 'pt-14'} bg-gray-50 text-gray-900 dark:bg-[#0a0a0f] dark:text-gray-100`}>
    <Navigation />
    {articleHeader && <header className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10"><div className="max-w-6xl mx-auto px-6 pt-4 pb-6">{articleHeader}</div></header>}
    {!article && <header className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3"><span className="text-gray-900 dark:text-white">Featured </span><span className="text-gradient">Blogs</span></h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-light max-w-3xl">Ideas, experiments, and insights into machine learning from the AICC community.</p>
      </div>
    </header>}
    <main className={`mx-auto ${article ? 'max-w-6xl px-6 pt-4' : 'max-w-7xl px-4 md:px-6 pt-8'} pb-24`}>{children}</main>
    <Footer />
  </div>;
}
