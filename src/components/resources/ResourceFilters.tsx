import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ResourceType, Difficulty } from '@/data/resources';
import { resourceTypeLabel } from '@/data/resources';

const resourceTypes: ResourceType[] = [
  'article',
  'video',
  'course',
  'documentation',
  'book',
  'notebook',
  'interactive',
  'tool',
];

const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

interface ResourceFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedTypes: ResourceType[];
  onTypeToggle: (type: ResourceType) => void;
  selectedDifficulties: Difficulty[];
  onDifficultyToggle: (difficulty: Difficulty) => void;
  freeOnly: boolean;
  onFreeOnlyToggle: () => void;
  className?: string;
}

export const ResourceFilters = ({
  query,
  onQueryChange,
  selectedTypes,
  onTypeToggle,
  selectedDifficulties,
  onDifficultyToggle,
  freeOnly,
  onFreeOnlyToggle,
  className,
}: ResourceFiltersProps) => {
  const hasActiveFilters =
    query || selectedTypes.length > 0 || selectedDifficulties.length > 0 || freeOnly;

  const clearAll = () => {
    onQueryChange('');
    selectedTypes.forEach(onTypeToggle);
    selectedDifficulties.forEach(onDifficultyToggle);
    if (freeOnly) onFreeOnlyToggle();
  };

  return (
    <div className={cn('bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-5', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          placeholder="Search resources..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            Resource type
          </h4>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => onTypeToggle(type)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                  selectedTypes.includes(type)
                    ? 'bg-aicc-purple text-white border-aicc-purple'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-aicc-purple/40',
                )}
              >
                {resourceTypeLabel[type]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            Difficulty
          </h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onDifficultyToggle(difficulty)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors capitalize',
                  selectedDifficulties.includes(difficulty)
                    ? 'bg-aicc-purple text-white border-aicc-purple'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-aicc-purple/40',
                )}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-gray-500 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light w-full"
        >
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default ResourceFilters;
