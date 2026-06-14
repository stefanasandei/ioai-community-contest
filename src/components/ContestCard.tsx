import {
    ExternalLink,
    Code,
    Brain,
    Eye,
    AudioWaveform,
    CaseSensitive,
    Bot,
    Table,
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

interface ContestCardProps {
    month: string;
    year: string;
    title: string;
    tasks: Task[];
    roundId: number;
    highlightQuery?: string;
}

const TASK_CONFIG = {
    ML: { icon: Table, gradient: "from-blue-500 to-blue-600" },
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
            "bg-emerald-50 border-emerald-200/70 text-emerald-700 dark:bg-emerald-900/25 dark:border-emerald-800/50 dark:text-emerald-300",
    },
    medium: {
        icon: AlertTriangle,
        label: "Medium",
        className:
            "bg-amber-50 border-amber-200/70 text-amber-700 dark:bg-amber-900/25 dark:border-amber-800/50 dark:text-amber-300",
    },
    hard: {
        icon: Flame,
        label: "Hard",
        className:
            "bg-red-50 border-red-200/70 text-red-700 dark:bg-red-900/25 dark:border-red-800/50 dark:text-red-300",
    },
    legacy: {
        icon: XCircle,
        label: "Legacy",
        className:
            "bg-gray-100 border-gray-200/70 text-gray-500 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400",
    },
};

const TYPE_PILL_CLASS: Record<string, string> = {
    ML: "bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-900/25 dark:text-blue-300 dark:border-blue-800/50",
    CV: "bg-orange-50 text-orange-700 border-orange-200/70 dark:bg-orange-900/25 dark:text-orange-300 dark:border-orange-800/50",
    NLP: "bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-900/25 dark:text-teal-300 dark:border-teal-800/50",
    RL: "bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-900/25 dark:text-cyan-300 dark:border-cyan-800/50",
    AUDIO: "bg-pink-50 text-pink-700 border-pink-200/70 dark:bg-pink-900/25 dark:text-pink-300 dark:border-pink-800/50",
};

const getTaskConfig = (type: string) =>
    TASK_CONFIG[type.split(" & ")[0].toUpperCase() as keyof typeof TASK_CONFIG] ??
    TASK_CONFIG.DEFAULT;

const getTypePillClass = (type: string) =>
    TYPE_PILL_CLASS[type.toUpperCase()] ??
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

const getTaskSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

const isTaskMatch = (task: Task, query: string) => {
    const q = query.toLowerCase();
    return (
        task.name.toLowerCase().includes(q) ||
        task.type.toLowerCase().includes(q) ||
        (task.author?.toLowerCase().includes(q) ?? false)
    );
};

const PRIMARY_BTN =
    "flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm";

const ContestCard = ({
    month,
    year,
    title,
    tasks,
    roundId,
    highlightQuery,
}: ContestCardProps) => {
    const trimmedQuery = highlightQuery?.trim() ?? "";

    return (
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {month}
                    </h3>
                    <span className="text-base text-gray-500 dark:text-gray-400">
                        {year}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {title}
                </p>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-white/5">
                {tasks.map((task, idx) => {
                    const { icon: TaskIcon, gradient } = getTaskConfig(task.type);
                    const statusConfig = PRACTICE_STATUS_CONFIG[task.practiceStatus];
                    const StatusIcon = statusConfig?.icon;
                    const isMatch = trimmedQuery
                        ? isTaskMatch(task, trimmedQuery)
                        : false;

                    const competitionLabel = task.source
                        ? "Solve on Kilonova"
                        : task.nitroJudge
                            ? "View on Nitro Judge"
                            : "View on Kaggle";
                    const competitionHref = task.source ?? task.nitroJudge ?? task.kaggle!;

                    return (
                        <li
                            key={idx}
                            className={cn(
                                "px-5 py-4 transition-colors",
                                isMatch
                                    ? "bg-aicc-purple/5 dark:bg-aicc-purple/10"
                                    : "hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                            )}
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div
                                    className={cn(
                                        "shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center",
                                        gradient
                                    )}
                                >
                                    <TaskIcon className="w-4 h-4 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white truncate min-w-0">
                                            {task.name}
                                        </h4>
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
                                    <div className="flex items-center gap-1.5 mt-1 min-w-0 overflow-hidden">
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
                                            <span className="text-xs text-gray-500 dark:text-gray-500 truncate min-w-0">
                                                by{" "}
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {task.author}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3 pl-[46px] sm:pl-0">
                                <a
                                    href={competitionHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={PRIMARY_BTN}
                                >
                                    {competitionLabel}
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                {task.blog ? (
                                    <a
                                        href={`/solutions/round-${roundId - 1}/${getTaskSlug(task.name)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        View solution
                                    </a>
                                ) : task.solution === "todo" ? (
                                    <span className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Clock className="w-4 h-4" />
                                        Solution coming soon
                                    </span>
                                ) : (
                                    <a
                                        href={task.solution}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Github className="w-4 h-4" />
                                        View notebook
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ContestCard;
