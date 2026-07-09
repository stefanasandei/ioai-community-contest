import { useEffect, useState, type ComponentType } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '@/components/solutions';

const mdxModules = import.meta.glob('@/resources/**/*.mdx');

interface MdxGuideProps {
  path: string;
}

const resolveImport = (path: string) => {
  const candidates = [
    `/src/resources/${path}`,
    `@/resources/${path}`,
    path,
  ];
  for (const candidate of candidates) {
    if (mdxModules[candidate]) return mdxModules[candidate];
  }
  return undefined;
};

export const MdxGuide = ({ path }: MdxGuideProps) => {
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      const importFn = resolveImport(path);
      if (!importFn) {
        if (!cancelled) {
          setMDXContent(null);
          setLoading(false);
        }
        return;
      }
      try {
        const mod = (await importFn()) as { default: ComponentType };
        if (!cancelled) {
          setMDXContent(() => mod.default);
        }
      } catch {
        if (!cancelled) {
          setMDXContent(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
      </div>
    );
  }

  if (!MDXContent) {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-500 dark:text-gray-400">
          Guidance content not found for <code>{path}</code>.
        </p>
      </div>
    );
  }

  return (
    <article className="prose text-justify dark:prose-invert max-w-none prose-headings:font-bold prose-headings:mb-2 prose-p:my-2 prose-li:my-0.5 prose-ul:my-3 prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl md:prose-h3:text-2xl prose-a:font-semibold dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline">
      <MDXProvider components={mdxComponents}>
        <MDXContent components={mdxComponents} />
      </MDXProvider>
    </article>
  );
};

export default MdxGuide;
