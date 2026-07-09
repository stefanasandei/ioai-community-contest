import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  to?: string;
}

interface ResourceBreadcrumbProps {
  crumbs: Crumb[];
  className?: string;
}

export const ResourceBreadcrumb = ({ crumbs, className }: ResourceBreadcrumbProps) => {
  return (
    <nav className={cn('flex items-center gap-1.5 text-sm flex-wrap', className)}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
            {crumb.to && !isLast ? (
              <Link
                to={crumb.to}
                className="text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default ResourceBreadcrumb;
