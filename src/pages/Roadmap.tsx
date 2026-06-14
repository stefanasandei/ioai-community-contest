import { useMemo, useState } from 'react';
import {
  Search,
  X,
  Table,
  MessageSquare,
  Eye,
  Volume2,
  Brain,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import TaskCard from '@/components/TaskCard';
import {
  referenceSections,
  referenceToTask,
  totalTaskCount,
  type SectionAccent,
} from '@/data/referenceTasks';
import type { PracticeStatus, LearnItem } from '@/data/types';

type Difficulty = 'easy' | 'medium' | 'hard';

const accentStyles: Record<
  SectionAccent,
  { bg: string; text: string; ring: string; soft: string; chip: string }
> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    text: 'text-blue-600 dark:text-blue-300',
    ring: 'group-hover:ring-blue-500/40',
    soft: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40',
    chip: 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-900/25 dark:text-blue-300 dark:border-blue-800/50',
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-500 to-teal-600',
    text: 'text-teal-600 dark:text-teal-300',
    ring: 'group-hover:ring-teal-500/40',
    soft: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40',
    chip: 'bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-900/25 dark:text-teal-300 dark:border-teal-800/50',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    text: 'text-orange-600 dark:text-orange-300',
    ring: 'group-hover:ring-orange-500/40',
    soft: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40',
    chip: 'bg-orange-50 text-orange-700 border-orange-200/70 dark:bg-orange-900/25 dark:text-orange-300 dark:border-orange-800/50',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-500 to-pink-600',
    text: 'text-pink-600 dark:text-pink-300',
    ring: 'group-hover:ring-pink-500/40',
    soft: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/40',
    chip: 'bg-pink-50 text-pink-700 border-pink-200/70 dark:bg-pink-900/25 dark:text-pink-300 dark:border-pink-800/50',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    text: 'text-purple-600 dark:text-purple-300',
    ring: 'group-hover:ring-purple-500/40',
    soft: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40',
    chip: 'bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-900/25 dark:text-purple-300 dark:border-purple-800/50',
  },
};

const sectionIcons: Record<string, LucideIcon> = {
  'tabular-ml': Table,
  nlp: MessageSquare,
  cv: Eye,
  audio: Volume2,
  'deep-learning': Brain,
};

type TopicGroup = { topic: string; count: number };

const getTopicGroups = (tasks: readonly { learn: readonly LearnItem[] }[]): TopicGroup[] => {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    for (const item of task.learn) {
      counts.set(item.topic, (counts.get(item.topic) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
};

const getDifficulty = (index: number, total: number): Difficulty => {
  if (total <= 1) return 'easy';
  const ratio = index / (total - 1);
  if (ratio < 0.34) return 'easy';
  if (ratio < 0.67) return 'medium';
  return 'hard';
};

const Roadmap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string | null>>(
    {},
  );

  const handleTopicClick = (sectionId: string, topic: string) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === topic ? null : topic,
    }));
  };

  const visibleSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return referenceSections.map((section) => {
      const selectedTopic = selectedTopics[section.id] ?? null;
      const tasks = section.tasks.filter((task) => {
        if (selectedTopic && !task.learn.some((i) => i.topic === selectedTopic)) return false;
        if (!q) return true;
        const matchesTask = task.task.toLowerCase().includes(q);
        const matchesCompetition = task.competition.toLowerCase().includes(q);
        const matchesLearn = task.learn.some((t) =>
          t.topic.toLowerCase().includes(q),
        );
        return matchesTask || matchesCompetition || matchesLearn;
      });
      return { section, tasks };
    });
  }, [searchQuery, selectedTopics]);

  const totalVisible = visibleSections.reduce(
    (sum, { tasks }) => sum + tasks.length,
    0,
  );

  return (
    <div className="min-h-screen py-14 bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="text-gray-900 dark:text-white">Reference </span>
            <span className="text-gradient">Tasks</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light mb-6">
            A learning roadmap for competitive AI.{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {totalTaskCount} tasks
            </span>{' '}
            across {referenceSections.length} tracks, ordered easy → hard. Take
            it as a path to learn the topics that show up most often.
          </p>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, competitions, topics…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aicc-purple/50 focus:border-aicc-purple/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Showing {totalVisible} of {totalTaskCount} tasks
            </p>
          )}
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mx-1 px-1">
            {referenceSections.map((section) => {
              const Icon = sectionIcons[section.id];
              const styles = accentStyles[section.accent];
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-aicc-purple hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{section.title}</span>
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${styles.chip}`}
                  >
                    {section.tasks.length}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {referenceSections.map((section) => {
            const Icon = sectionIcons[section.id];
            const styles = accentStyles[section.accent];
            const topTopics = getTopicGroups(section.tasks).slice(0, 4);
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 transition-all duration-200 hover:border-aicc-purple/50 dark:hover:border-aicc-purple/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-aicc-purple/5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`shrink-0 w-10 h-10 ${styles.bg} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-aicc-purple dark:group-hover:text-aicc-purple-light transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {section.tasks.length} tasks
                    </p>
                  </div>
                  <Compass
                    className="w-4 h-4 text-gray-300 group-hover:text-aicc-purple transition-colors"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topTopics.map((g) => (
                    <span
                      key={g.topic}
                      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded"
                    >
                      {g.topic}
                      <span className="ml-1 text-[10px] tabular-nums opacity-50">{g.count}</span>
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 space-y-16">
        {visibleSections.map(({ section, tasks }) => {
          const Icon = sectionIcons[section.id];
          const styles = accentStyles[section.accent];
          const selectedTopic = selectedTopics[section.id] ?? null;
          const topicGroups = getTopicGroups(section.tasks);

          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`shrink-0 w-10 h-10 ${styles.bg} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="flex-1 min-w-0 text-2xl font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  {tasks.length}
                  {tasks.length !== section.tasks.length && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' '}
                      of {section.tasks.length}
                    </span>
                  )}{' '}
                  {section.tasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>

              {section.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 font-light max-w-3xl mb-5">
                  {section.description}
                </p>
              )}

              {topicGroups.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {topicGroups.map((g) => {
                    const isSelected = selectedTopic === g.topic;
                    return (
                      <button
                        key={g.topic}
                        onClick={() => handleTopicClick(section.id, g.topic)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full transition-colors ${
                          isSelected
                            ? 'bg-aicc-purple text-white border-aicc-purple'
                            : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-aicc-purple/50 hover:text-aicc-purple'
                        }`}
                      >
                        {g.topic}
                        <span
                          className={`text-[10px] tabular-nums ${
                            isSelected ? 'text-white/80' : 'text-gray-400'
                          }`}
                        >
                          {g.count}
                        </span>
                      </button>
                    );
                  })}
                  {selectedTopic && (
                    <button
                      onClick={() => handleTopicClick(section.id, selectedTopic)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-aicc-purple transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              )}

              {tasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task, i) => {
                    const difficulty = getDifficulty(i, tasks.length);
                    return (
                      <TaskCard
                        key={task.id}
                        task={referenceToTask(task, section, difficulty)}
                        mode="reference"
                        iconType={section.id}
                        learnItems={task.learn}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 px-4 border border-dashed border-gray-200 dark:border-white/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tasks match the current filters.
                  </p>
                  {(selectedTopic || searchQuery) && (
                    <button
                      onClick={() => {
                        handleTopicClick(section.id, selectedTopic || '');
                        setSearchQuery('');
                      }}
                      className="mt-2 text-xs font-medium text-aicc-purple hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Roadmap;
