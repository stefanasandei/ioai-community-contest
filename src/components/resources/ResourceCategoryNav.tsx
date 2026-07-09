import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Flame,
  Brain,
  MessageSquare,
  Eye,
  Volume2,
  Table,
  Trophy,
  GraduationCap,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSortedGeneralCategories, getSortedSyllabusSections } from '@/data/resources';

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Flame,
  Brain,
  MessageSquare,
  Eye,
  Volume2,
  Table,
  Trophy,
  GraduationCap,
  BookOpen,
};

const getIcon = (name?: string): LucideIcon => iconMap[name ?? ''] ?? BookOpen;

interface ResourceCategoryNavProps {
  className?: string;
}

export const ResourceCategoryNav = ({ className }: ResourceCategoryNavProps) => {
  const generalCategories = getSortedGeneralCategories();
  const syllabusSections = getSortedSyllabusSections();

  return (
    <div className={cn('space-y-10', className)}>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">General Resources</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Curated guides and resources organized by topic — from getting started to competition strategies.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generalCategories.map((category) => {
            const Icon = getIcon(category.icon);
            return (
              <Link
                key={category.id}
                to={`/resources/general/${category.id}`}
                className="group flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-aicc-purple/40 dark:hover:border-aicc-purple/40 transition-all"
              >
                <div
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-md flex items-center justify-center',
                    category.accent === 'purple' && 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light',
                    category.accent === 'orange' && 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300',
                    category.accent === 'pink' && 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300',
                    category.accent === 'teal' && 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
                    category.accent === 'blue' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
                    !category.accent && 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-aicc-purple dark:group-hover:text-aicc-purple-light transition-colors truncate">
                      {category.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">IOAI Syllabus</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">An explained, subsection-by-subsection walkthrough of the full IOAI syllabus, with curated resources for each topic.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {syllabusSections.map((section) => (
            <Link
              key={section.id}
              to={`/resources/syllabus/${section.id}`}
              className="group flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-aicc-purple/40 dark:hover:border-aicc-purple/40 transition-all"
            >
              <div className="shrink-0 w-8 h-8 rounded-md bg-aicc-purple/10 flex items-center justify-center">
                <span className="text-aicc-purple dark:text-aicc-purple-light font-bold text-xs">
                  {section.order}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-aicc-purple dark:group-hover:text-aicc-purple-light transition-colors truncate">
                    {section.title}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceCategoryNav;
