import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  resources,
  getSortedGeneralCategories,
  getSortedSyllabusSections,
  getSortedSubsections,
} from '@/data/resources';

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

interface ResourceSidebarProps {
  className?: string;
}

export const ResourceSidebar = ({ className }: ResourceSidebarProps) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initiallyExpanded = new Set<string>();
    resources.syllabus.forEach((s) => initiallyExpanded.add(s.id));
    return initiallyExpanded;
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generalCategories = getSortedGeneralCategories();
  const syllabusSections = getSortedSyllabusSections();

  return (
    <aside className={cn('w-full md:w-60 shrink-0', className)}>
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 pb-4 space-y-6">
        <div>
          <Link
            to="/resources"
            className={cn(
              'block px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors',
              location.pathname === '/resources'
                ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
            )}
          >
            Overview
          </Link>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 px-2.5 mb-2">
            General
          </div>
          <nav className="space-y-0.5">
            {generalCategories.map((category) => {
              const Icon = getIcon(category.icon);
              const to = `/resources/general/${category.id}`;
              const active = location.pathname === to;
              return (
                <Link
                  key={category.id}
                  to={`/resources/general/${category.id}`}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{category.shortTitle ?? category.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 px-2.5 mb-2">
            IOAI Syllabus
          </div>
          <nav className="space-y-1">
            {syllabusSections.map((section) => {
              const expanded = expandedSections.has(section.id);
              const sectionTo = `/resources/syllabus/${section.id}`;
              const sectionActive = location.pathname === sectionTo;
              const sectionHasActiveSub = location.pathname.startsWith(`${sectionTo}/`);
              const isOpen = expanded || sectionActive || sectionHasActiveSub;

              return (
                <div key={section.id}>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                      aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                    >
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <Link
                      to={sectionTo}
                      className={cn(
                        'flex-1 px-2 py-1.5 rounded-md text-sm transition-colors truncate',
                        sectionActive
                          ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                      )}
                    >
                      {section.shortTitle ?? section.title}
                    </Link>
                  </div>
                  {isOpen && (
                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-white/10">
                      {getSortedSubsections(section).map((subsection) => {
                        const subTo = `${sectionTo}/${subsection.id}`;
                        const subActive = location.pathname === subTo;
                        return (
                          <Link
                            key={subsection.id}
                            to={`${subTo}#resource-tabs`}
                            className={cn(
                              'block ml-2 px-2.5 py-1 rounded-md text-sm transition-colors truncate',
                              subActive
                                ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5',
                            )}
                          >
                            {subsection.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default ResourceSidebar;
