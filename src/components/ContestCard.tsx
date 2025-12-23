import { Trophy, ExternalLink, Code, Brain, Eye, Database, Waves, AudioWaveform, CaseSensitive } from 'lucide-react';

interface Task {
    name: string;
    type: string;
    author?: string;
    kaggle: string;
    solution: string;
}

interface ContestCardProps {
    month: string;
    year: string;
    title: string;
    winner?: string;
    tasks: Task[];
}

const getTaskIcon = (type: string) => {
    switch (type.toUpperCase()) {
        case 'ML':
            return Brain;
        case 'CV':
            return Eye;
        case 'NLP':
            return CaseSensitive;
        case 'AUDIO':
            return AudioWaveform;
        default:
            return Code;
    }
};

const getTaskColor = (type: string) => {
    switch (type.toUpperCase()) {
        case 'ML':
            return 'from-purple-500 to-purple-600';
        case 'CV':
            return 'from-orange-500 to-orange-600';
        case 'NLP':
            return 'from-teal-500 to-teal-600';
        default:
            return 'from-yellow-500 to-yellow-600';
    }
};

const ContestCard = ({
    month,
    year,
    title,
    winner,
    tasks,
}: ContestCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="p-6 pb-1 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {month}
                            </h3>
                            <span className="text-lg text-gray-500 dark:text-gray-400">
                                {year}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
                    </div>

                    {winner && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                                {winner}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tasks */}
            <div className="p-6">
                <div className="space-y-3">
                    {tasks.map((task, idx) => {
                        const TaskIcon = getTaskIcon(task.type);
                        const gradientColor = getTaskColor(task.type);

                        return (
                            <div
                                key={idx}
                                className="group/task relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-4">
                                    {/* Task header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
                                        >
                                            <TaskIcon className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <a
                                                href={task.kaggle}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            >
                                                <span className="truncate">{task.name}</span>
                                                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                                            </a>

                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {task.type}
                                                </span>
                                                {task.author && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        by <span className="font-medium">{task.author}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        <a
                                            href={task.kaggle}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            View on Kaggle
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                            href={task.solution}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            Solution
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ContestCard;