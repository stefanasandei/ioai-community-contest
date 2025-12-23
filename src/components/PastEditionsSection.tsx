import { useState, useEffect } from 'react';
import { Calendar, Trophy, ExternalLink, Code, Brain, Eye, Cpu, Database } from 'lucide-react';

interface Task {
  name: string;
  type: string;
  kaggle?: string;
  solution?: string;
}

interface Contest {
  id: number;
  month: string;
  year: string;
  title: string;
  subtitle?: string;
  winner: string;
  tasks: Task[];
  color: string;
}

const PastEditionsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('past-editions');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const pastContests: Contest[] = [
    {
      id: 1,
      month: 'October',
      year: '2025',
      title: 'Round 0',
      winner: 'Nikoloz Gegenava',
      tasks: [
        {
          name: 'Deceptive Points',
          type: 'ML',
          kaggle: 'https://www.kaggle.com/competitions/deceptive-points-aicc-round-0',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/deceptive_points.ipynb'
        },
        {
          name: 'Find Brain Tumors',
          type: 'CV',
          kaggle: 'https://www.kaggle.com/competitions/aicc-round-0-brain-tumor',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/brain_tumors_byol.ipynb'
        },
        {
          name: 'Latent Model Classification',
          type: 'NLP',
          kaggle: 'https://www.kaggle.com/competitions/latent-model-classification-aicc-round-0/',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/latent-model-classification.ipynb'
        }
      ],
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ML':
        return Brain;
      case 'CV':
        return Eye;
      case 'NLP':
        return Database;
      default:
        return Code;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ML':
        return 'text-aicc-purple';
      case 'CV':
        return 'text-aicc-orange';
      case 'NLP':
        return 'text-aicc-teal';
      default:
        return 'text-aicc-purple';
    }
  };

  return (
    <section id="past-editions" className="relative py-24 bg-gray-50 dark:bg-[#0a0a0f] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto">
          <div className="absolute top-20 left-20 w-72 h-72 bg-aicc-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-aicc-purple/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aicc-teal/10 border border-aicc-teal/20 mb-6">
            <Calendar className="w-4 h-4 text-aicc-teal" />
            <span className="text-sm font-medium text-aicc-teal">Archive</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Past Contest</span>{' '}
            <span className="text-gradient">Editions</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Explore previous challenges and see how our community has grown over time.
          </p>
        </div>

        {/* Contest Cards */}
        <div className="grid gap-6">
          {pastContests.map((contest, index) => (
            <div
              key={contest.id}
              className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card background gradient - lighter effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${contest.color} opacity-[0.02]`} />

              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${contest.color} flex items-center justify-center`}>
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {contest.month} {contest.year}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">{contest.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{contest.subtitle}</p>
                    </div>
                  </div>

                  {/* Winner info only - no tags pills */}
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-aicc-orange" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{contest.winner}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">Winner</span>
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Tasks</h4>
                  {contest.tasks.map((task, idx) => {
                    const TaskIcon = getTaskIcon(task.type);
                    const iconColor = getTaskColor(task.type);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-xl border-zinc-200 border-2 dark:bg-zinc-900/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
                            <TaskIcon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{task.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{task.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.kaggle && (
                            <a
                              href={task.kaggle}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-aicc-purple/10 text-aicc-purple hover:bg-aicc-purple/20 transition-colors flex items-center gap-1.5"
                            >
                              Kaggle
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {task.solution && (
                            <a
                              href={task.solution}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-1.5"
                            >
                              Solution
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More coming soon */}
        <div className={`mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-aicc-purple/5 to-aicc-orange/5 border border-aicc-purple/10 dark:border-aicc-purple/10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">More Contests Coming Soon!</h3>
          <p className="text-gray-600 dark:text-gray-300 font-light">
            Join our Discord to stay updated on upcoming challenges and be the first to know when new contests are announced.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PastEditionsSection;
