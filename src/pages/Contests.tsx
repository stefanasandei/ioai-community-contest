import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    ArrowUpDown,
    X as XIcon,
    Inbox,
    SlidersHorizontal,
    ChevronDown,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { RatingsEntryPreview } from '@/components/RatingsEntryPreview';
import Footer from "@/components/Footer";
import ContestCard from "@/components/ContestCard";
import TaskCard from "@/components/TaskCard";
import { isTaskMatch } from "@/lib/taskUtils";
import { getContestLeaderboard } from "@/lib/leaderboard";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import contestsData from "@/data/contests.json";
import beginnerContestsData from "@/data/beginner-contests.json";
import popularityData from "@/data/popularity.json";
import type { Contest, Task } from "@/data/types";

const contestsBySeries: Record<"main" | "beginner", Contest[]> = {
    main: contestsData.contests as Contest[],
    beginner: beginnerContestsData.contests as Contest[],
};

type SortKey = "newest" | "oldest" | "popular" | "least-popular";

// Supplied ranking snapshot. Missing scores remain unranked in either direction.
const taskPopularity = new Map(popularityData.map(entry => [`${"series" in entry ? entry.series : "main"}:${entry.round + 1}:${entry.task}`, entry.popularity]));

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "popular", label: "Most popular" },
    { value: "least-popular", label: "Least popular" },
];

interface FilterOption {
    value: string;
    label: string;
    count: number;
    selectedClass: string;
    unselectedClass: string;
}

interface FilterSectionProps {
    title: string;
    options: FilterOption[];
    selected: string[];
    onToggle: (value: string) => void;
}

const FilterSection = ({
    title,
    options,
    selected,
    onToggle,
}: FilterSectionProps) => (
    <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
            {title}
        </h4>
        <div className="space-y-1">
            {options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                    <label
                        key={opt.value}
                        className={cn(
                            "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-sm border border-transparent",
                            isSelected
                                ? opt.selectedClass
                                : opt.unselectedClass
                        )}
                    >
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggle(opt.value)}
                            className="border-gray-300 dark:border-white/30 data-[state=checked]:bg-aicc-purple data-[state=checked]:border-aicc-purple data-[state=checked]:text-white"
                        />
                        <span className="flex-1 font-medium">{opt.label}</span>
                        <span className="text-xs tabular-nums opacity-60">
                            {opt.count}
                        </span>
                    </label>
                );
            })}
        </div>
    </div>
);

interface ActiveChip {
    key: string;
    label: string;
    onRemove: () => void;
}

const Contests = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ratingsPreview = import.meta.env.DEV;
    const series = searchParams.get("series") === "beginner" ? "beginner" : "main";
    const allContests = contestsBySeries[series];
    const allTasks: Task[] = useMemo(
        () => allContests.filter(contest => !contest.disabled).flatMap(contest => contest.tasks),
        [allContests]
    );

    const searchQuery = searchParams.get("q") ?? "";
    const selectedTypes = useMemo(
        () => searchParams.get("type")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );
    const selectedDifficulties = useMemo(
        () =>
            searchParams.get("difficulty")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );
    const selectedPlatforms = useMemo(
        () => searchParams.get("platform")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );
    const requestedSort = searchParams.get("sort");
    const sort: SortKey = SORT_OPTIONS.find(option => option.value === requestedSort)?.value ?? "newest";
    const sortByPopularity = sort === "popular" || sort === "least-popular";

    const setParam = useCallback(
        (key: string, value: string | null) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (value) next.set(key, value);
                    else next.delete(key);
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const toggleArrayParam = useCallback(
        (key: string, value: string) => {
            const current =
                searchParams.get(key)?.split(",").filter(Boolean) ?? [];
            const next = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            setParam(key, next.join(","));
        },
        [searchParams, setParam]
    );

    const clearAll = useCallback(() => {
        setSearchParams(series === "beginner" ? { series: "beginner" } : {}, { replace: true });
    }, [setSearchParams, series]);

    const clearFiltersOnly = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete("type");
                next.delete("difficulty");
                next.delete("platform");
                return next;
            },
            { replace: true }
        );
    }, [setSearchParams]);

    const filterCounts = useMemo(() => {
        const types: Record<string, number> = {
            ML: 0,
            CV: 0,
            NLP: 0,
            RL: 0,
            AUDIO: 0,
        };
        const difficulties: Record<string, number> = {
            easy: 0,
            medium: 0,
            hard: 0,
            legacy: 0,
        };
        const platforms: Record<string, number> = { kaggle: 0, nitroJudge: 0, sprawdzai: 0 };

        for (const task of allTasks) {
            for (const t of task.type.split(" & ")) {
                const key = t.toUpperCase();
                if (key in types) types[key]++;
            }
            if (task.practiceStatus in difficulties) {
                difficulties[task.practiceStatus]++;
            }
            if (task.kaggle) platforms.kaggle++;
            if (task.nitroJudge) platforms.nitroJudge++;
            if (task.sprawdzai) platforms.sprawdzai++;
        }

        return { types, difficulties, platforms };
    }, [allTasks]);

    const typeOptions: FilterOption[] = useMemo(
        () => [
            {
                value: "ML",
                label: "ML",
                count: filterCounts.types.ML,
                selectedClass:
                    "bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-100",
                unselectedClass:
                    "bg-blue-50/60 border-blue-200/40 text-blue-700 dark:bg-blue-900/10 dark:border-blue-800/30 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/25",
            },
            {
                value: "CV",
                label: "CV",
                count: filterCounts.types.CV,
                selectedClass:
                    "bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-100",
                unselectedClass:
                    "bg-orange-50/60 border-orange-200/40 text-orange-700 dark:bg-orange-900/10 dark:border-orange-800/30 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-orange-900/25",
            },
            {
                value: "NLP",
                label: "NLP",
                count: filterCounts.types.NLP,
                selectedClass:
                    "bg-teal-100 border-teal-300 text-teal-900 dark:bg-teal-900/40 dark:border-teal-700 dark:text-teal-100",
                unselectedClass:
                    "bg-teal-50/60 border-teal-200/40 text-teal-700 dark:bg-teal-900/10 dark:border-teal-800/30 dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-900/25",
            },
            {
                value: "RL",
                label: "RL",
                count: filterCounts.types.RL,
                selectedClass:
                    "bg-cyan-100 border-cyan-300 text-cyan-900 dark:bg-cyan-900/40 dark:border-cyan-700 dark:text-cyan-100",
                unselectedClass:
                    "bg-cyan-50/60 border-cyan-200/40 text-cyan-700 dark:bg-cyan-900/10 dark:border-cyan-800/30 dark:text-cyan-300 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/25",
            },
            {
                value: "AUDIO",
                label: "Audio",
                count: filterCounts.types.AUDIO,
                selectedClass:
                    "bg-pink-100 border-pink-300 text-pink-900 dark:bg-pink-900/40 dark:border-pink-700 dark:text-pink-100",
                unselectedClass:
                    "bg-pink-50/60 border-pink-200/40 text-pink-700 dark:bg-pink-900/10 dark:border-pink-800/30 dark:text-pink-300 hover:bg-pink-100/70 dark:hover:bg-pink-900/25",
            },
        ],
        [filterCounts]
    );

    const difficultyOptions: FilterOption[] = useMemo(
        () => [
            {
                value: "easy",
                label: "Easy",
                count: filterCounts.difficulties.easy,
                selectedClass:
                    "bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-100",
                unselectedClass:
                    "bg-emerald-50/60 border-emerald-200/40 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800/30 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/25",
            },
            {
                value: "medium",
                label: "Medium",
                count: filterCounts.difficulties.medium,
                selectedClass:
                    "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100",
                unselectedClass:
                    "bg-amber-50/60 border-amber-200/40 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800/30 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/25",
            },
            {
                value: "hard",
                label: "Hard",
                count: filterCounts.difficulties.hard,
                selectedClass:
                    "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/40 dark:border-red-700 dark:text-red-100",
                unselectedClass:
                    "bg-red-50/60 border-red-200/40 text-red-700 dark:bg-red-900/10 dark:border-red-800/30 dark:text-red-300 hover:bg-red-100/70 dark:hover:bg-red-900/25",
            },

        ],
        [filterCounts]
    );

    const platformOptions: FilterOption[] = useMemo(
        () => [
            {
                value: "sprawdzai",
                label: "SprawdzAI",
                count: filterCounts.platforms.sprawdzai,
                selectedClass:
                    "bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-100",
                unselectedClass:
                    "bg-purple-50/60 border-purple-200/40 text-purple-700 dark:bg-purple-900/10 dark:border-purple-800/30 dark:text-purple-300 hover:bg-purple-100/70 dark:hover:bg-purple-900/25",
            },
            {
                value: "kaggle",
                label: "Kaggle",
                count: filterCounts.platforms.kaggle,
                selectedClass:
                    "bg-sky-100 border-sky-300 text-sky-900 dark:bg-sky-900/40 dark:border-sky-700 dark:text-sky-100",
                unselectedClass:
                    "bg-sky-50/60 border-sky-200/40 text-sky-700 dark:bg-sky-900/10 dark:border-sky-800/30 dark:text-sky-300 hover:bg-sky-100/70 dark:hover:bg-sky-900/25",
            },
            {
                value: "nitroJudge",
                label: "Nitro Judge",
                count: filterCounts.platforms.nitroJudge,
                selectedClass:
                    "bg-violet-100 border-violet-300 text-violet-900 dark:bg-violet-900/40 dark:border-violet-700 dark:text-violet-100",
                unselectedClass:
                    "bg-violet-50/60 border-violet-200/40 text-violet-700 dark:bg-violet-900/10 dark:border-violet-800/30 dark:text-violet-300 hover:bg-violet-100/70 dark:hover:bg-violet-900/25",
            },
        ],
        [filterCounts]
    );

    const activeFilterCount =
        selectedTypes.length +
        selectedDifficulties.length +
        selectedPlatforms.length;

    const hasSearchOrFilter = searchQuery !== "" || activeFilterCount > 0;
    const hasActiveFilters = hasSearchOrFilter || sort !== "newest";

    const filteredContests = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        const sortFn = (a: Contest, b: Contest) =>
            sort === "oldest" ? a.id - b.id : b.id - a.id;

        if (!hasSearchOrFilter) {
            return allContests
                .filter((c) => !c.disabled)
                .sort(sortFn);
        }

        const matched = allContests.flatMap((contest) => {
            if (contest.disabled) return [];

            const contestMatches =
                !!query &&
                (contest.title.toLowerCase().includes(query) ||
                    `${contest.month} ${contest.year}`
                        .toLowerCase()
                        .includes(query));

            const matchingTasks = contest.tasks.filter((task) => {
                if (selectedTypes.length > 0) {
                    const taskTypes = task.type
                        .split(" & ")
                        .map((t) => t.toUpperCase());
                    if (!taskTypes.some((t) => selectedTypes.includes(t)))
                        return false;
                }

                if (selectedDifficulties.length > 0) {
                    if (
                        !task.practiceStatus ||
                        !selectedDifficulties.includes(task.practiceStatus)
                    )
                        return false;
                }

                if (selectedPlatforms.length > 0) {
                    const onKaggle =
                        selectedPlatforms.includes("kaggle") && task.kaggle;
                    const onNitro =
                        selectedPlatforms.includes("nitroJudge") &&
                        task.nitroJudge;
                    const onSprawdzai =
                        selectedPlatforms.includes("sprawdzai") && task.sprawdzai;
                    if (!onKaggle && !onNitro && !onSprawdzai) return false;
                }

                if (query) {
                    if (!isTaskMatch(task, query) && !contestMatches)
                        return false;
                }

                return true;
            });

            if (matchingTasks.length === 0) return [];
            return [{ ...contest, tasks: matchingTasks }];
        });

        return [...matched].sort(sortFn);
    }, [
        allContests,
        hasSearchOrFilter,
        searchQuery,
        selectedTypes,
        selectedDifficulties,
        selectedPlatforms,
        sort,
    ]);

    const totalTasksInResults = filteredContests.reduce(
        (acc, c) => acc + c.tasks.length,
        0
    );

    const popularityTasks = useMemo(() => filteredContests
        .flatMap(contest => contest.tasks.map(task => ({ contest, task, score: taskPopularity.get(`${series}:${contest.id}:${task.name}`) })))
        .sort((a, b) => {
            if (a.score === undefined && b.score === undefined) return a.task.name.localeCompare(b.task.name);
            if (a.score === undefined) return 1;
            if (b.score === undefined) return -1;
            return (sort === "least-popular" ? a.score - b.score : b.score - a.score)
                || a.task.name.localeCompare(b.task.name);
        }), [filteredContests, sort, series]);

    const activeChips: ActiveChip[] = useMemo(() => {
        const chips: ActiveChip[] = [];
        for (const t of selectedTypes) {
            const opt = typeOptions.find((o) => o.value === t);
            chips.push({
                key: `type-${t}`,
                label: opt?.label ?? t,
                onRemove: () => toggleArrayParam("type", t),
            });
        }
        for (const d of selectedDifficulties) {
            const opt = difficultyOptions.find((o) => o.value === d);
            chips.push({
                key: `difficulty-${d}`,
                label: opt?.label ?? d,
                onRemove: () => toggleArrayParam("difficulty", d),
            });
        }
        for (const p of selectedPlatforms) {
            const opt = platformOptions.find((o) => o.value === p);
            chips.push({
                key: `platform-${p}`,
                label: opt?.label ?? p,
                onRemove: () => toggleArrayParam("platform", p),
            });
        }
        return chips;
    }, [
        selectedTypes,
        selectedDifficulties,
        selectedPlatforms,
        typeOptions,
        difficultyOptions,
        platformOptions,
        toggleArrayParam,
    ]);

    const resultPrimaryCount = hasSearchOrFilter || sortByPopularity
        ? totalTasksInResults
        : filteredContests.length;
    const resultPrimaryLabel = hasSearchOrFilter || sortByPopularity ? "task" : "contest";
    const resultSecondaryCount = hasSearchOrFilter || sortByPopularity
        ? filteredContests.length
        : totalTasksInResults;
    const resultSecondaryLabel = hasSearchOrFilter || sortByPopularity ? "contest" : "task";

    return (
        <div className="min-h-screen pt-14 bg-gray-50 dark:bg-[#0a0a0f]">
            <Navigation />

            <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
                <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="text-gray-900 dark:text-white">Past Contest </span>
                        <span className="text-gradient">Editions</span>
                    </h1>
                    <p className="text-md text-gray-600 dark:text-gray-300 font-light">
                        Browse and practice tasks from past rounds.
                    </p>
                    <div role="group" aria-label="Round format" className="mt-5 inline-flex max-w-full gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-white/10 dark:bg-white/5">
                        {(["main", "beginner"] as const).map(value => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={series === value}
                                onClick={() => setSearchParams(prev => {
                                    const next = new URLSearchParams(prev);
                                    if (value === "beginner") next.set("series", value);
                                    else next.delete("series");
                                    next.delete("platform");
                                    next.delete("difficulty");
                                    return next;
                                })}
                                className={cn(
                                    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aicc-purple/50",
                                    series === value
                                        ? "bg-white text-aicc-purple shadow-sm dark:bg-white/10 dark:text-aicc-purple-light"
                                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                )}
                            >
                                {value === "main" ? "Main rounds" : "Beginner rounds"}
                            </button>
                        ))}
                    </div>
                    <p className="mb-3 mt-3 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        {series === "beginner"
                            ? "A separate series for beginners, hosted on SprawdzAI. Everyone is welcome to participate."
                            : "The main AICC series, hosted on Kaggle and Nitro Judge."}
                    </p>
                </div>
            </div>

            <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                    <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                        <div className="relative flex-1 min-w-0 basis-full sm:basis-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search tasks, types, authors…"
                                value={searchQuery}
                                onChange={(e) =>
                                    setParam("q", e.target.value || null)
                                }
                                className="w-full h-10 pl-10 pr-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aicc-purple/50 focus:border-aicc-purple/50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setParam("q", null)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <XIcon className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "h-10 inline-flex items-center gap-1.5 px-3 rounded-lg border text-sm font-medium transition-colors",
                                        activeFilterCount > 0
                                            ? "bg-aicc-purple/10 dark:bg-aicc-purple/20 border-aicc-purple/30 dark:border-aicc-purple/40 text-aicc-purple dark:text-aicc-purple-light"
                                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    <span>Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-aicc-purple text-white text-[10px] font-semibold">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-72 p-4"
                                align="end"
                                sideOffset={6}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Filters
                                    </h3>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearFiltersOnly}
                                            className="text-xs font-medium text-aicc-purple dark:text-aicc-purple-light hover:underline"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <FilterSection
                                        title="Type"
                                        options={typeOptions}
                                        selected={selectedTypes}
                                        onToggle={(v) =>
                                            toggleArrayParam("type", v)
                                        }
                                    />
                                    <FilterSection
                                        title="Difficulty"
                                        options={difficultyOptions}
                                        selected={selectedDifficulties}
                                        onToggle={(v) =>
                                            toggleArrayParam("difficulty", v)
                                        }
                                    />
                                    <FilterSection
                                        title="Platform"
                                        options={platformOptions}
                                        selected={selectedPlatforms}
                                        onToggle={(v) =>
                                            toggleArrayParam("platform", v)
                                        }
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            <select
                                aria-label="Sort tasks"
                                value={sort}
                                onChange={(e) =>
                                    setParam(
                                        "sort",
                                        e.target.value === "newest"
                                            ? null
                                            : e.target.value
                                    )
                                }
                                className="h-10 pl-9 pr-8 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-aicc-purple/50 focus:border-aicc-purple/50 transition-all min-w-[170px]"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        Showing{" "}
                        <span aria-live="polite" className="font-semibold text-gray-900 dark:text-white">
                            {resultPrimaryCount}
                        </span>{" "}
                        {resultPrimaryLabel}
                        {resultPrimaryCount !== 1 ? "s" : ""} and{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {resultSecondaryCount}
                        </span>{" "}
                        {resultSecondaryLabel}
                        {resultSecondaryCount !== 1 ? "s" : ""}
                    </span>
                    {activeChips.map((chip) => (
                        <button
                            key={chip.key}
                            onClick={chip.onRemove}
                            className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-aicc-purple/10 dark:bg-aicc-purple/20 text-aicc-purple dark:text-aicc-purple-light text-xs font-medium hover:bg-aicc-purple/20 dark:hover:bg-aicc-purple/30 transition-colors"
                        >
                            {chip.label}
                            <XIcon className="w-3 h-3" />
                        </button>
                    ))}
                </div>
                {ratingsPreview && <RatingsEntryPreview />}
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-aicc-purple dark:text-aicc-purple-light hover:underline"
                    >
                        <XIcon className="w-3.5 h-3.5" />
                        Clear all
                    </button>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                {sortByPopularity && (
                    <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        {series === "beginner"
                            ? "Beginner popularity estimates use SprawdzAI participation, including practice. The most-attempted task scores 100; the others are scaled relative to it. These estimates are provisional."
                            : "Popularity combines age-adjusted notebook upvotes and participation. New-round scores are provisional. Tasks without scores appear last."}
                    </p>
                )}
                {filteredContests.length > 0 ? (
                    sortByPopularity ? (
                        <ol aria-label="Tasks by popularity" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {popularityTasks.map(({ contest, task, score }) => (
                                <li key={`${contest.id}-${task.name}`}>
                                    {score !== undefined && <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Popularity: {score.toFixed(1)} / 100</p>}
                                    <TaskCard
                                        task={task}
                                        roundId={contest.id}
                                        contextLabel={`${contest.title} · ${contest.format === "beginner" ? "SprawdzAI · " : ""}${contest.dateLabel ?? `${contest.month} ${contest.year}`}`}
                                    />
                                </li>
                            ))}
                        </ol>
                    ) : hasSearchOrFilter && series !== "beginner" ? (
                        <div className="space-y-8">
                            {filteredContests.map((contest) => (
                                <section key={contest.id}>
                                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {contest.month}
                                                </h3>
                                                <span className="text-lg text-gray-500 dark:text-gray-400">
                                                    {contest.year}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {contest.title} · {contest.tasks.length} task
                                                {contest.tasks.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contest.tasks.map((task) => (
                                            <TaskCard
                                                key={task.name}
                                                task={task}
                                                roundId={contest.id}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredContests.map((contest) => (
                                <ContestCard
                                    key={contest.id}
                                    {...contest}
                                    roundId={contest.id}
                                    highlightQuery={searchQuery}
                                    showLeaderboard={contest.format !== "beginner" && !!getContestLeaderboard(contest.id - 1)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="max-w-md mx-auto text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-5">
                            <Inbox className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No tasks match
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchQuery
                                ? `Nothing matches "${searchQuery}" with the current filters.`
                                : "Try adjusting your filters."}
                        </p>
                        <button
                            onClick={clearAll}
                            className="px-5 h-10 rounded-lg bg-aicc-purple text-white text-sm font-medium hover:bg-aicc-purple-light transition-colors"
                        >
                            Reset all
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Contests;
