import {
    ExternalLink,
    Code,
    Brain,
    Eye,
    AudioWaveform,
    CaseSensitive,
    Bot,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Flame,
    BookOpen,
    Clock,
    Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, PracticeStatus } from "@/data/types";

interface TaskCardProps {
    task: Task;
    roundId?: number;
    mode?: 'tasks' | 'reference';
    iconType?: string;
}

const TASK_CONFIG = {
    ML: { icon: Brain, gradient: "from-blue-500 to-blue-600" },
    CV: { icon: Eye, gradient: "from-orange-500 to-orange-600" },
    NLP: { icon: CaseSensitive, gradient: "from-teal-500 to-teal-600" },
    RL: { icon: Bot, gradient: "from-cyan-500 to-cyan-600" },
    AUDIO: { icon: AudioWaveform, gradient: "from-pink-500 to-pink-600" },
    DEFAULT: { icon: Code, gradient: "from-yellow-500 to-yellow-600" },
} as const;

const PRACTICE_STATUS_CONFIG: Record<
    PracticeStatus,
    { icon: typeof CheckCircle2; label: string; className: string }
> = {
    easy: {
        icon: CheckCircle2,
        label: "Easy",
        className:
            "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200",
    },
    medium: {
        icon: AlertTriangle,
        label: "Medium",
        className:
            "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-200",
    },
    hard: {
        icon: Flame,
        label: "Hard",
        className:
            "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
    },
    legacy: {
        icon: XCircle,
        label: "Legacy",
        className:
            "bg-gray-200 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300",
    },
};

const TYPE_PILL_CLASS: Record<string, string> = {
    ML: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
    CV: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700",
    NLP: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-700",
    RL: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700",
    AUDIO: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700",
};

const getTaskConfig = (type: string) =>
    TASK_CONFIG[type.split(" & ")[0].toUpperCase() as keyof typeof TASK_CONFIG] ??
    TASK_CONFIG.DEFAULT;

const getTypePillClass = (type: string) =>
    TYPE_PILL_CLASS[type.toUpperCase()] ??
    "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";

const getTaskSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

const TaskCard = ({ task, roundId, mode = 'tasks', iconType }: TaskCardProps) => {
    const { icon: TaskIcon, gradient } = getTaskConfig(iconType ?? task.type);
    const statusConfig = PRACTICE_STATUS_CONFIG[task.practiceStatus];
    const StatusIcon = statusConfig?.icon;

    const isReference = mode === 'reference';
    const competitionHref = task.source ?? task.nitroJudge ?? task.kaggle;
    const hasCompetition = !!competitionHref;
    const hasSolution =
        (task.blog && roundId !== undefined) ||
        (task.solution && task.solution !== "todo");
    const showActions =
        isReference || hasCompetition || hasSolution || task.solution === "todo";

    const competitionLabel = task.source
        ? "Solve on Kilonova"
        : task.nitroJudge
            ? "View on Nitro Judge"
            : "View on Kaggle";

    return (
        <div
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:border-aicc-purple/40 dark:hover:border-aicc-purple/50"
        >
            <div className="p-5">
                <div className="flex items-start gap-3.5">
                    <div
                        className={cn(
                            "shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            gradient
                        )}
                    >
                        <TaskIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate min-w-0">
                                {task.name}
                            </h3>
                            {statusConfig && (
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-semibold border shrink-0",
                                        statusConfig.className
                                    )}
                                >
                                    <StatusIcon className="w-3 h-3" />
                                    {statusConfig.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2.5 min-w-0 overflow-hidden flex-wrap">
                            {task.type.split(" & ").map((t, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border shrink-0",
                                        getTypePillClass(t)
                                    )}
                                >
                                    {t}
                                </span>
                            ))}
                            {task.author && (
                                <span className="text-xs text-gray-600 dark:text-gray-400 truncate min-w-0">
                                    {isReference ? 'from ' : 'by '}
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {task.author}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showActions && (
                <div className="px-5 pb-5 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex gap-2">
                        {hasCompetition ? (
                            <a
                                href={competitionHref}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                            >
                                {competitionLabel}
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        ) : (
                            <span className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
                                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                {task.author ?? 'Source unavailable'}
                            </span>
                        )}
                        {task.blog && roundId !== undefined ? (
                            <a
                                href={`/solutions/round-${roundId - 1}/${getTaskSlug(task.name)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <BookOpen className="w-4 h-4" />
                                View solution
                            </a>
                        ) : task.solution === "todo" ? (
                            <span className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center justify-center gap-2 cursor-not-allowed">
                                <Clock className="w-4 h-4" />
                                Solution coming soon
                            </span>
                        ) : task.solution ? (
                            <a
                                href={task.solution}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Github className="w-4 h-4" />
                                View notebook
                            </a>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
