import {
    Trophy,
    ExternalLink,
    Code,
    Brain,
    Eye,
    AudioWaveform,
    CaseSensitive,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Flame,
} from "lucide-react";

interface Task {
    name: string;
    type: string;
    author?: string;
    kaggle: string;
    solution: string;
    blog: string;
    practiceStatus: "easy" | "medium" | "hard" | "legacy";
}

interface ContestCardProps {
    month: string;
    year: string;
    title: string;
    winner?: string;
    tasks: Task[];
}

const TASK_CONFIG = {
    ML: { icon: Brain, gradient: "from-blue-500 to-blue-600" },
    CV: { icon: Eye, gradient: "from-orange-500 to-orange-600" },
    NLP: { icon: CaseSensitive, gradient: "from-teal-500 to-teal-600" },
    AUDIO: { icon: AudioWaveform, gradient: "from-pink-500 to-pink-600" },
    DEFAULT: { icon: Code, gradient: "from-yellow-500 to-yellow-600" },
} as const;

const PRACTICE_STATUS_CONFIG = {
    easy: {
        icon: CheckCircle2,
        label: "Easy",
        className:
            "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400",
    },
    medium: {
        icon: AlertTriangle,
        label: "Medium",
        className:
            "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400",
    },
    hard: {
        icon: Flame,
        label: "Hard",
        className:
            "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400",
    },
    legacy: {
        icon: XCircle,
        label: "Legacy",
        className:
            "bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400",
    },
} as const;

const getTaskConfig = (type: string) =>
    TASK_CONFIG[type.toUpperCase() as keyof typeof TASK_CONFIG] ??
    TASK_CONFIG.DEFAULT;

const ContestCard = ({ month, year, title, winner, tasks }: ContestCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="p-6 pb-2 border-b border-gray-100 dark:border-gray-800">
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

            <div className="p-6 space-y-3">
                {tasks.map((task, idx) => {
                    const { icon: TaskIcon, gradient } = getTaskConfig(task.type);
                    const statusConfig = PRACTICE_STATUS_CONFIG[task.practiceStatus];
                    const StatusIcon = statusConfig?.icon;

                    return (
                        <div
                            key={idx}
                            className="group/task rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
                                    >
                                        <TaskIcon className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={task.blog}
                                            className="group/link inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        >
                                            <span className="truncate">{task.name}</span>
                                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                                        </a>

                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {task.type}
                                            </span>

                                            {statusConfig && (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${statusConfig.className}`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConfig.label}
                                                </span>
                                            )}

                                            {task.author && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    by <span className="font-medium">{task.author}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

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
                                        href={task.blog}
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
    );
};

export default ContestCard;