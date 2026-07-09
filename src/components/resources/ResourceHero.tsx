import { cn } from '@/lib/utils';

interface ResourceHeroProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  className?: string;
}

export const ResourceHero = ({
  title,
  titleAccent,
  subtitle,
  className,
}: ResourceHeroProps) => {
  return (
    <div className={cn('bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10', className)}>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="text-gray-900 dark:text-white">{title}</span>{' '}
          <span className="text-gradient">{titleAccent}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-light max-w-4xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ResourceHero;
