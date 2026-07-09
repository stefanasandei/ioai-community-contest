import {
  FileText,
  Play,
  GraduationCap,
  BookOpen,
  Book,
  FileCode,
  MousePointerClick,
  Wrench,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Resource, ResourceType, Difficulty } from '@/data/resources';

const typeConfig: Record<
  ResourceType,
  { icon: typeof LinkIcon; label: string; color: string }
> = {
  article: { icon: FileText, label: 'Article', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  video: { icon: Play, label: 'Video', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  course: { icon: GraduationCap, label: 'Course', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  documentation: { icon: BookOpen, label: 'Docs', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  book: { icon: Book, label: 'Book', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  notebook: { icon: FileCode, label: 'Notebook', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  interactive: { icon: MousePointerClick, label: 'Interactive', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  tool: { icon: Wrench, label: 'Tool', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  other: { icon: LinkIcon, label: 'Resource', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
};

const difficultyConfig: Record<Difficulty, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
  advanced: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40',
};

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export const ResourceCard = ({ resource, className }: ResourceCardProps) => {
  const typeInfo = typeConfig[resource.type];
  const TypeIcon = typeInfo.icon;

  return (
    <Card
      className={cn(
        'group flex flex-col h-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-aicc-purple/40 dark:hover:border-aicc-purple/40 transition-all',
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-row items-start justify-between">
          <div>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-start gap-2 "
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover/link:text-aicc-purple dark:group-hover/link:text-aicc-purple-light transition-colors">
                {resource.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mt-1 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          </div>
          <div className={cn('inline-flex h-min w-min items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium', typeInfo.color)}>
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </div>
        </div>

        {resource.source && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{resource.source}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        {resource.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
            {resource.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {resource.difficulty && (
            <span className={cn('text-xs px-2 py-0.5 rounded border font-medium', difficultyConfig[resource.difficulty])}>
              {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
            </span>
          )}
          {resource.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card >
  );
};

export default ResourceCard;
