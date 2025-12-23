import { Trophy, ExternalLink, Code, Brain, Eye, Database } from 'lucide-react';

interface Task {
    name: string;
    type: string;
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
        case 'ML': return Brain;
        case 'CV': return Eye;
        case 'NLP': return Database;
        default: return Code;
    }
};

const getTaskColor = (type: string) => {
    switch (type.toUpperCase()) {
        case 'ML': return 'text-aicc-purple';
        case 'CV': return 'text-aicc-orange';
        case 'NLP': return 'text-aicc-teal';
        default: return 'text-aicc-purple';
    }
};

const ContestCard = ({ month, year, title, winner, tasks }: ContestCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-500">
            {/* Card background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.02]`} />

            <div className="relative p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {month} {year}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400">{title}</p>
                        </div>
                    </div>

                    {winner &&
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-aicc-orange" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">{winner}</span>
                            </span>
                        </div>
                    }
                </div>

                {/* Tasks with improved contrast */}
                <div className="space-y-3">
                    {tasks.map((task, idx) => {
                        const TaskIcon = getTaskIcon(task.type);
                        const iconColor = getTaskColor(task.type);
                        return (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
                                        <TaskIcon className={`w-5 h-5 ${iconColor}`} />
                                    </div>
                                    <div>
                                        <a
                                            href={task.kaggle}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-gray-900 dark:text-white hover:text-aicc-purple transition-colors flex items-center gap-1"
                                        >
                                            {task.name}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </a>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.type}</p>
                                    </div>
                                </div>

                                {/* Kaggle and Solution buttons */}
                                <div className="flex items-center gap-2">
                                    <a
                                        href={task.kaggle}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-aicc-purple text-white hover:bg-aicc-purple-light transition-colors flex items-center gap-1"
                                    >
                                        Kaggle
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <a
                                        href={task.solution}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors flex items-center gap-1"
                                    >
                                        Solution
                                    </a>
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
