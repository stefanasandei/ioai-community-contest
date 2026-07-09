import { Star, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ResourceHero from '@/components/resources/ResourceHero';
import ResourceCategoryNav from '@/components/resources/ResourceCategoryNav';
import ResourceCard from '@/components/resources/ResourceCard';
import {
  getFeaturedResources,
  getSortedGeneralCategories,
  getSortedSyllabusSections,
} from '@/data/resources';

const Resources = () => {
  const featuredResources = getFeaturedResources().slice(0, 6);
  const firstGeneralCategory = getSortedGeneralCategories()[0];
  const firstSyllabusSection = getSortedSyllabusSections()[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <ResourceHero
        title="Useful"
        titleAccent="Resources"
        subtitle="A curated set of links and guides to help you learn AI and prepare for the IOAI — from foundational concepts to an explained, subsection-by-subsection syllabus."
        className="pt-16"
      />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link
            to={firstGeneralCategory ? `/resources/general/${firstGeneralCategory.id}` : '/resources'}
            className="group flex items-center gap-4 px-5 py-4 bg-gradient-to-br from-aicc-purple to-aicc-violet text-white hover:brightness-110 transition-all"
          >
            <div className="w-10 h-10 bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-base font-semibold">New to AI?</div>
              <div className="text-sm text-white/70">Start with the basics</div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/60 ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to={firstSyllabusSection ? `/resources/syllabus/${firstSyllabusSection.id}` : '/resources'}
            className="group flex items-center gap-4 px-5 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-aicc-purple/40 transition-all"
          >
            <div className="w-10 h-10 bg-aicc-purple/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-aicc-purple dark:text-aicc-purple-light" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="text-base font-semibold">IOAI Syllabus</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">View explained syllabus</div>
            </div>
            <ArrowRight className="w-5 h-5 text-aicc-purple/60 ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-16">
          <ResourceCategoryNav />

          {featuredResources.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Star className="w-5 h-5 text-aicc-orange" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
