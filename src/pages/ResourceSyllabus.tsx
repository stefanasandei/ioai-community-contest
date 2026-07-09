import { useState, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ResourceSidebar from '@/components/resources/ResourceSidebar';
import ResourceBreadcrumb from '@/components/resources/ResourceBreadcrumb';
import MdxGuide from '@/components/resources/MdxGuide';
import ResourceCard from '@/components/resources/ResourceCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  getSyllabusSectionById,
  getSyllabusSubsection,
  getSortedSubsections,
} from '@/data/resources';

const ResourceSyllabus = () => {
  const { sectionId, subsectionId } = useParams<{
    sectionId: string;
    subsectionId?: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const section = sectionId ? getSyllabusSectionById(sectionId) : undefined;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const scrollPosRef = useRef(0);

  const subsection = section && subsectionId
    ? getSyllabusSubsection(section, subsectionId)
    : undefined;

  const sortedSubsections = section ? getSortedSubsections(section) : [];
  const firstSubsection = sortedSubsections[0];

  const resources = subsection?.resources ?? section?.subsections.flatMap((s) => s.resources) ?? [];

  // Tab clicks preserve scroll position
  useLayoutEffect(() => {
    const state = location.state as Record<string, unknown> | null;
    if (state?.tabNav === true && scrollPosRef.current > 0) {
      const saved = scrollPosRef.current;
      scrollPosRef.current = 0;
      window.scrollTo({ top: saved, left: 0, behavior: 'auto' });
      window.history.replaceState(null, '');
    }
  }, [sectionId, subsectionId]);

  // Hash-based scroll from sidebar links
  useLayoutEffect(() => {
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [location.hash, sectionId, subsectionId]);

  const hash = location.hash;

  if (!section) {
    return <Navigate to={`/resources${hash}`} replace />;
  }

  if (!subsectionId && firstSubsection) {
    return <Navigate to={`/resources/syllabus/${section.id}/${firstSubsection.id}${hash}`} replace />;
  }

  if (subsectionId && !subsection) {
    return <Navigate to={`/resources/syllabus/${section.id}${hash}`} replace />;
  }

  const subIndex = sortedSubsections.findIndex((s) => s.id === subsectionId);
  const prevSub = sortedSubsections[subIndex - 1];
  const nextSub = sortedSubsections[subIndex + 1];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="pt-16">
        <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 resource-header" id="resource-header">
            <ResourceBreadcrumb
              crumbs={[
                { label: 'Resources', to: '/resources' },
                { label: 'IOAI Syllabus', to: '/resources' },
                { label: section.shortTitle ?? section.title },
              ]}
              className="mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              {section.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">{section.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10 pb-24">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:hidden">
              <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Browse resources</span>
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Resources</span>
                  </div>
                  <div className="p-4">
                    <ResourceSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <ResourceSidebar className="hidden md:block" />

            <main className="flex-1 min-w-0">
              <div className="space-y-8">
                <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 md:p-8">
                  <MdxGuide path={section.guideMdxPath} />
                </section>

                <div className="sticky top-16 z-20 -mx-4 px-4 bg-gray-50/95 dark:bg-[#0a0a0f]/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-[#0a0a0f]/80 border-b border-gray-200 dark:border-white/10"
                  id="resource-tabs"
                  style={{ scrollMarginTop: 64 }}>
                  <nav className="flex gap-2 overflow-x-auto py-3" aria-label="Subsections">
                    {sortedSubsections.map((sub) => {
                      const to = `/resources/syllabus/${section.id}/${sub.id}`;
                      const active = sub.id === subsectionId;
                      return (
                        <a
                          key={sub.id}
                          href={to}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                            if (active) return;
                            e.preventDefault();
                            scrollPosRef.current = window.scrollY;
                            navigate(to, { state: { tabNav: true }, preventScrollReset: true });
                          }}
                          className={cn(
                            'shrink-0 whitespace-nowrap px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors border cursor-pointer',
                            active
                              ? 'bg-aicc-purple text-white border-aicc-purple'
                              : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-aicc-purple/40 hover:text-aicc-purple dark:hover:text-aicc-purple-light',
                          )}
                        >
                          {sub.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {subsection && (
                  <section className="relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 md:p-8">
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light">
                      {resources.length} resource links
                    </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                    {subsection.title}
                  </h2>
                    <MdxGuide path={subsection.guideMdxPath} />
                  </section>
                )}

                <section>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                    Resources for this topic
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.length === 0 ? (
                      <div className="text-center py-16 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 col-span-full">
                        <p className="text-gray-600 dark:text-gray-300">No resources for this topic yet.</p>
                      </div>
                    ) : (
                      resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))
                    )}
                  </div>
                </section>

                {(prevSub || nextSub) && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                    {prevSub ? (
                      <Link
                        to={`/resources/syllabus/${section.id}/${prevSub.id}`}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light"
                      >
                        ← {prevSub.title}
                      </Link>
                    ) : (
                      <span />
                    )}
                    {nextSub ? (
                      <Link
                        to={`/resources/syllabus/${section.id}/${nextSub.id}`}
                        className="text-sm text-aicc-purple dark:text-aicc-purple-light hover:underline"
                      >
                        {nextSub.title} →
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResourceSyllabus;
