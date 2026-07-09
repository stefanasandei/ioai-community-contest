import { useState, useMemo, useLayoutEffect } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ResourceSidebar from '@/components/resources/ResourceSidebar';
import ResourceBreadcrumb from '@/components/resources/ResourceBreadcrumb';
import MdxGuide from '@/components/resources/MdxGuide';
import ResourceCard from '@/components/resources/ResourceCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  getGeneralCategoryById,
  getSortedGeneralCategories,
  type Resource,
  type ResourceType,
  type Difficulty,
} from '@/data/resources';

const ResourceCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getGeneralCategoryById(categoryId) : undefined;
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const filteredResources = useMemo(() => {
    if (!category) return [];
    return category.resources.filter((resource: Resource) => {
      const matchesQuery =
        !query ||
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description?.toLowerCase().includes(query.toLowerCase()) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(resource.type);
      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        (resource.difficulty && selectedDifficulties.includes(resource.difficulty));
      return matchesQuery && matchesType && matchesDifficulty;
    });
  }, [category, query, selectedTypes, selectedDifficulties]);

  useLayoutEffect(() => {
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [location.hash, categoryId]);

  if (!category) {
    return <Navigate to={`/resources${location.hash}`} replace />;
  }

  const toggleType = (type: ResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty],
    );
  };

  const categories = getSortedGeneralCategories();
  const categoryIndex = categories.findIndex((c) => c.id === category.id);
  const prevCategory = categories[categoryIndex - 1];
  const nextCategory = categories[categoryIndex + 1];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="pt-16">
        <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 resource-header" id="resource-header">
            <ResourceBreadcrumb
              crumbs={[
                { label: 'Resources', to: '/resources' },
                { label: 'General', to: '/resources' },
                { label: category.title },
              ]}
              className="mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              {category.title}
              <span className="ml-3 px-2.5 py-0.5 text-sm font-semibold rounded-full bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light align-middle">
                {category.resources.length} resource links
              </span>
            </h1>
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
                  <MdxGuide path={category.guideMdxPath} />
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                    Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.length === 0 ? (
                      <div className="text-center py-16 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 col-span-full">
                        <p className="text-gray-600 dark:text-gray-300">No resources for this topic yet.</p>
                      </div>
                    ) : (
                      filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))
                    )}
                  </div>
                </section>

                {(prevCategory || nextCategory) && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                    {prevCategory ? (
                      <Link
                        to={`/resources/general/${prevCategory.id}`}

                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light"
                      >
                        ← {prevCategory.title}
                      </Link>
                    ) : (
                      <span />
                    )}
                    {nextCategory ? (
                      <Link
                        to={`/resources/general/${nextCategory.id}`}
                        className="text-sm text-aicc-purple dark:text-aicc-purple-light hover:underline"
                      >
                        {nextCategory.title} →
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

export default ResourceCategory;
