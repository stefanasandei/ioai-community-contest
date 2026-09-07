import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    X as XIcon,
    Inbox,
    SlidersHorizontal,
    Gauge,
    Lightbulb,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TaskCard from "@/components/TaskCard";
import SheetTaskCard from "@/components/SheetTaskCard";
import { isTaskMatch } from "@/lib/taskUtils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import data from "@/data/contests.json";
import { getSheetTasks, getUniqueSheetCategories, type ParsedSheetTask } from "@/data/sheet/sheetUtils";
import type { Task, ContestsData } from "@/data/types";

const DATA = data as ContestsData;
const standaloneTasks: Task[] = DATA.standaloneTasks ?? [];
const sheetTasks: ParsedSheetTask[] = getSheetTasks();
const uniqueSheetCategories: string[] = getUniqueSheetCategories();

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

const Tasks = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("q") ?? "";

    const selectedCategories = useMemo(
        () => searchParams.get("category")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );

    const selectedDifficulties = useMemo(
        () => searchParams.get("difficulty")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );

    const selectedInsightfulness = useMemo(
        () => searchParams.get("insightfulness")?.split(",").filter(Boolean) ?? [],
        [searchParams]
    );

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
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    const clearFiltersOnly = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete("category");
                next.delete("difficulty");
                next.delete("insightfulness");
                return next;
            },
            { replace: true }
        );
    }, [setSearchParams]);

    // Build categories list dynamically from sheet.json and community tasks
    const allCategoriesList = useMemo(() => {
        const catSet = new Set<string>(uniqueSheetCategories);
        catSet.add("Computer Vision");
        catSet.add("Natural Language Processing");
        catSet.add("Classical ML");
        catSet.add("Deep Learning");
        catSet.add("Audio & Signal Processing");
        return Array.from(catSet).sort();
    }, []);

    // Filter counts across sheet tasks and community tasks
    const filterCounts = useMemo(() => {
        const categories: Record<string, number> = {};
        for (const cat of allCategoriesList) {
            categories[cat] = 0;
        }

        const difficulties: Record<string, number> = {
            easy: 0,
            medium: 0,
            hard: 0,
            expert: 0,
            unrated: 0,
        };

        const insightfulness: Record<string, number> = {
            "unrated": 0,
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
        };

        // Process sheet tasks
        for (const st of sheetTasks) {
            if (st.category in categories) {
                categories[st.category]++;
            } else {
                categories[st.category] = (categories[st.category] || 0) + 1;
            }

            if (st.difficulty !== null) {
                if (st.difficulty <= 3.4) difficulties.easy++;
                else if (st.difficulty <= 6.4) difficulties.medium++;
                else if (st.difficulty <= 8.4) difficulties.hard++;
                else difficulties.expert++;
            } else {
                difficulties.unrated++;
            }

            if (st.insightful === null) {
                insightfulness["unrated"]++;
            } else {
                const insKey = String(st.insightful);
                if (insKey in insightfulness) {
                    insightfulness[insKey]++;
                }
            }
        }

        // Process standalone community tasks
        for (const task of standaloneTasks) {
            for (const t of task.type.split(" & ")) {
                const upper = t.toUpperCase();
                let matchedCat = "Classical ML";
                if (upper === "CV") matchedCat = "Computer Vision";
                else if (upper === "NLP") matchedCat = "Natural Language Processing";
                else if (upper === "AUDIO") matchedCat = "Audio & Signal Processing";
                else if (upper === "RL") matchedCat = "Reinforcement Learning";
                categories[matchedCat] = (categories[matchedCat] || 0) + 1;
            }

            if (task.practiceStatus === "easy") difficulties.easy++;
            else if (task.practiceStatus === "medium") difficulties.medium++;
            else if (task.practiceStatus === "hard") difficulties.hard++;
            else difficulties.unrated++;

            insightfulness["unrated"]++;
        }

        return { categories, difficulties, insightfulness };
    }, [allCategoriesList]);

    const categoryOptions: FilterOption[] = useMemo(
        () =>
            allCategoriesList.map((cat) => ({
                value: cat,
                label: cat,
                count: filterCounts.categories[cat] || 0,
                selectedClass:
                    "bg-aicc-purple/10 border-aicc-purple/30 text-aicc-purple dark:bg-aicc-purple/20 dark:border-aicc-purple/40 dark:text-aicc-purple-light",
                unselectedClass:
                    "bg-gray-50 border-gray-200/50 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10",
            })),
        [allCategoriesList, filterCounts]
    );

    const difficultyOptions: FilterOption[] = useMemo(
        () => [
            {
                value: "easy",
                label: "Easy (0 - 3.4)",
                count: filterCounts.difficulties.easy,
                selectedClass:
                    "bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-100",
                unselectedClass:
                    "bg-emerald-50/60 border-emerald-200/40 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800/30 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/25",
            },
            {
                value: "medium",
                label: "Medium (3.5 - 6.4)",
                count: filterCounts.difficulties.medium,
                selectedClass:
                    "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100",
                unselectedClass:
                    "bg-amber-50/60 border-amber-200/40 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800/30 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/25",
            },
            {
                value: "hard",
                label: "Hard (6.5 - 8.4)",
                count: filterCounts.difficulties.hard,
                selectedClass:
                    "bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-100",
                unselectedClass:
                    "bg-orange-50/60 border-orange-200/40 text-orange-700 dark:bg-orange-900/10 dark:border-orange-800/30 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-orange-900/25",
            },
            {
                value: "expert",
                label: "Expert (8.5 - 10.0)",
                count: filterCounts.difficulties.expert,
                selectedClass:
                    "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/40 dark:border-red-700 dark:text-red-100",
                unselectedClass:
                    "bg-red-50/60 border-red-200/40 text-red-700 dark:bg-red-900/10 dark:border-red-800/30 dark:text-red-300 hover:bg-red-100/70 dark:hover:bg-red-900/25",
            },
            {
                value: "unrated",
                label: "Unrated",
                count: filterCounts.difficulties.unrated,
                selectedClass:
                    "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
                unselectedClass:
                    "bg-gray-100/60 border-gray-200/40 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-white/10",
            },
        ],
        [filterCounts]
    );

    const insightfulnessOptions: FilterOption[] = useMemo(
        () => [
            {
                value: "3",
                label: "Masterpiece (3★)",
                count: filterCounts.insightfulness["3"],
                selectedClass:
                    "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100 font-bold",
                unselectedClass:
                    "bg-amber-50/60 border-amber-200/40 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800/30 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/25",
            },
            {
                value: "2",
                label: "Very Insightful (2★)",
                count: filterCounts.insightfulness["2"],
                selectedClass:
                    "bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-100",
                unselectedClass:
                    "bg-purple-50/60 border-purple-200/40 text-purple-700 dark:bg-purple-900/10 dark:border-purple-800/30 dark:text-purple-300 hover:bg-purple-100/70 dark:hover:bg-purple-900/25",
            },
            {
                value: "1",
                label: "Insightful (1★)",
                count: filterCounts.insightfulness["1"],
                selectedClass:
                    "bg-indigo-100 border-indigo-300 text-indigo-900 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-100",
                unselectedClass:
                    "bg-indigo-50/60 border-indigo-200/40 text-indigo-700 dark:bg-indigo-900/10 dark:border-indigo-800/30 dark:text-indigo-300 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/25",
            },
            {
                value: "0",
                label: "Standard (0★)",
                count: filterCounts.insightfulness["0"],
                selectedClass:
                    "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
                unselectedClass:
                    "bg-gray-100/60 border-gray-200/40 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-white/10",
            },
            {
                value: "unrated",
                label: "Unrated",
                count: filterCounts.insightfulness["unrated"],
                selectedClass:
                    "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
                unselectedClass:
                    "bg-gray-100/60 border-gray-200/40 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-white/10",
            },
        ],
        [filterCounts]
    );

    const activeFilterCount =
        selectedCategories.length +
        selectedDifficulties.length +
        selectedInsightfulness.length;
    const hasSearchOrFilter = searchQuery !== "" || activeFilterCount > 0;

    // Filter Sheet Tasks
    const filteredSheetTasks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return sheetTasks.filter((task) => {
            if (selectedCategories.length > 0) {
                const catLower = task.category.toLowerCase();
                const matches = selectedCategories.some((c) =>
                    catLower.includes(c.toLowerCase())
                );
                if (!matches) return false;
            }

            if (selectedDifficulties.length > 0) {
                const diff = task.difficulty;
                const matchesDiff = selectedDifficulties.some((d) => {
                    if (d === "unrated") return diff === null;
                    if (diff === null) return false;
                    if (d === "easy") return diff <= 3.4;
                    if (d === "medium") return diff >= 3.5 && diff <= 6.4;
                    if (d === "hard") return diff >= 6.5 && diff <= 8.4;
                    if (d === "expert") return diff >= 8.5;
                    return true;
                });
                if (!matchesDiff) return false;
            }

            if (selectedInsightfulness.length > 0) {
                const insValue = task.insightful === null ? "unrated" : String(task.insightful);
                if (!selectedInsightfulness.includes(insValue)) return false;
            }

            if (query) {
                const text = `${task.problem} ${task.contest} ${task.category} ${task.topic}`.toLowerCase();
                if (!text.includes(query)) return false;
            }

            return true;
        });
    }, [searchQuery, selectedCategories, selectedDifficulties, selectedInsightfulness]);

    // Filter Standalone Community Tasks
    const filteredStandaloneTasks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return standaloneTasks.filter((task) => {
            if (selectedCategories.length > 0) {
                const taskTypes = task.type.toUpperCase().split(" & ");
                const matches = selectedCategories.some((c) =>
                    taskTypes.some((t) => c.toUpperCase().includes(t))
                );
                if (!matches) return false;
            }

            if (selectedDifficulties.length > 0 && task.practiceStatus) {
                const matchesDiff = selectedDifficulties.some((d) => {
                    if (d === "unrated") return !task.practiceStatus;
                    if (d === "easy") return task.practiceStatus === "easy";
                    if (d === "medium") return task.practiceStatus === "medium";
                    if (d === "hard") return task.practiceStatus === "hard";
                    return false;
                });
                if (!matchesDiff) return false;
            }

            if (selectedInsightfulness.length > 0) {
                if (!selectedInsightfulness.includes("unrated") && !selectedInsightfulness.includes("0"))
                    return false;
            }

            if (query) {
                if (!isTaskMatch(task, query)) return false;
            }

            return true;
        });
    }, [searchQuery, selectedCategories, selectedDifficulties, selectedInsightfulness]);

    // Combined active chips
    const activeChips: ActiveChip[] = useMemo(() => {
        const chips: ActiveChip[] = [];
        for (const cat of selectedCategories) {
            const opt = categoryOptions.find((o) => o.value === cat);
            chips.push({
                key: `category-${cat}`,
                label: opt?.label ?? cat,
                onRemove: () => toggleArrayParam("category", cat),
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
        for (const ins of selectedInsightfulness) {
            const opt = insightfulnessOptions.find((o) => o.value === ins);
            chips.push({
                key: `insightfulness-${ins}`,
                label: opt?.label ?? `Insight ${ins}`,
                onRemove: () => toggleArrayParam("insightfulness", ins),
            });
        }
        return chips;
    }, [
        selectedCategories,
        selectedDifficulties,
        selectedInsightfulness,
        categoryOptions,
        difficultyOptions,
        insightfulnessOptions,
        toggleArrayParam,
    ]);

    const totalTasksCount = filteredSheetTasks.length + filteredStandaloneTasks.length;

    return (
        <div className="min-h-screen pt-14 bg-gray-50 dark:bg-[#0a0a0f]">
            <Navigation />

            {/* Page Header */}
            <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="text-gray-900 dark:text-white">Problem </span>
                        <span className="text-gradient">Bank</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-light max-w-3xl mb-6">
                        Explore Olympiad & National AI contest problems along with standalone community practice tasks.
                    </p>

                    {/* Explanation Callout Banner for Difficulty & Insightfulness */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light shrink-0">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 flex items-center gap-1.5">
                                    Difficulty Rating (0.0 to 10.0)
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Measures technical and implementation complexity — ranging from Easy (0.0–3.4), Medium (3.5–6.4), Hard (6.5–8.4), to Expert (8.5–10.0). Unrated indicates tasks pending benchmark evaluation.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 flex items-center gap-1.5">
                                    Insightfulness Rating (0 to 3 Stars)
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Measures creative problem-solving and mathematical depth — from Standard (0★), Insightful (1★), Very Insightful (2★), to Masterpiece (3★).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Search and Filter Controls */}
            <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search problems, topics, contests, categories…"
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
                                        "h-10 inline-flex items-center gap-1.5 px-3.5 rounded-lg border text-sm font-medium transition-colors shrink-0",
                                        activeFilterCount > 0
                                            ? "bg-aicc-purple/10 dark:bg-aicc-purple/20 border-aicc-purple/30 dark:border-aicc-purple/40 text-aicc-purple dark:text-aicc-purple-light"
                                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-aicc-purple text-white text-[10px] font-semibold">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-72 p-4 max-h-[80vh] overflow-y-auto"
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
                                        title="Category"
                                        options={categoryOptions}
                                        selected={selectedCategories}
                                        onToggle={(v) =>
                                            toggleArrayParam("category", v)
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
                                        title="Insightfulness"
                                        options={insightfulnessOptions}
                                        selected={selectedInsightfulness}
                                        onToggle={(v) =>
                                            toggleArrayParam("insightfulness", v)
                                        }
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Active Chips & Result Summary */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-2 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {totalTasksCount}
                        </span>{" "}
                        task{totalTasksCount !== 1 ? "s" : ""}
                    </span>
                    {activeChips.map((chip) => (
                        <button
                            key={chip.key}
                            onClick={chip.onRemove}
                            className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-aicc-purple/10 dark:bg-aicc-purple/20 text-aicc-purple dark:text-aicc-purple-light text-xs font-medium hover:bg-aicc-purple/20 dark:hover:bg-aicc-purple/30 transition-colors"
                        >
                            {chip.label}
                            <XIcon className="w-3 h-3" />
                        </button>
                    ))}
                </div>
                {hasSearchOrFilter && (
                    <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-aicc-purple dark:text-aicc-purple-light hover:underline"
                    >
                        <XIcon className="w-3.5 h-3.5" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Task Grid Rendering - Innovative Masonry Columns Layout */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 pt-2">
                {totalTasksCount > 0 ? (
                    <div className="columns-1 md:columns-2 gap-4 space-y-4">
                        {/* Render Sheet Tasks first */}
                        {filteredSheetTasks.map((task, idx) => (
                            <div key={task.problem + idx} className="break-inside-avoid">
                                <SheetTaskCard task={task} />
                            </div>
                        ))}
                        {/* Render Standalone Community Tasks */}
                        {filteredStandaloneTasks.map((task) => (
                            <div key={task.name} className="break-inside-avoid">
                                <TaskCard task={task} />
                            </div>
                        ))}
                    </div>
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
                                : "No tasks available."}
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

export default Tasks;