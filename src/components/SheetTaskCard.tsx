import {
  ExternalLink,
  Github,
  Eye,
  Table,
  MessageSquare,
  AudioWaveform,
  Brain,
  TrendingUp,
  Sparkles,
  Trophy,
  Lightbulb,
  Gauge,
  Clock,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParsedSheetTask } from "@/data/sheet/sheetUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SheetTaskCardProps {
  task: ParsedSheetTask;
}

interface CategoryConfig {
  icon: LucideIcon;
  pillClass: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  "computer vision": {
    icon: Eye,
    pillClass:
      "bg-orange-50 text-orange-700 border-orange-200/70 dark:bg-orange-900/25 dark:text-orange-300 dark:border-orange-800/50",
  },
  "natural language processing": {
    icon: MessageSquare,
    pillClass:
      "bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-900/25 dark:text-teal-300 dark:border-teal-800/50",
  },
  "classical ml": {
    icon: Table,
    pillClass:
      "bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-900/25 dark:text-blue-300 dark:border-blue-800/50",
  },
  "deep learning": {
    icon: Brain,
    pillClass:
      "bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-900/25 dark:text-purple-300 dark:border-purple-800/50",
  },
  "time series": {
    icon: TrendingUp,
    pillClass:
      "bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-300 dark:border-indigo-800/50",
  },
  audio: {
    icon: AudioWaveform,
    pillClass:
      "bg-pink-50 text-pink-700 border-pink-200/70 dark:bg-pink-900/25 dark:text-pink-300 dark:border-pink-800/50",
  },
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  icon: Sparkles,
  pillClass:
    "bg-gray-50 text-gray-700 border-gray-200/70 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700",
};

function getCategoryConfig(categoryStr: string): CategoryConfig {
  const normalized = categoryStr.toLowerCase().trim();
  for (const key in CATEGORY_MAP) {
    if (normalized.includes(key)) {
      return CATEGORY_MAP[key];
    }
  }
  return DEFAULT_CATEGORY_CONFIG;
}

const SOLUTION_BTN_CLASS =
  "flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2";

export const SheetTaskCard = ({ task }: SheetTaskCardProps) => {
  const { category, contest, problem, topic, difficulty, insightful, link, solutions } = task;
  const categoryConfig = getCategoryConfig(category);
  const CategoryIcon = categoryConfig.icon;

  // Difficulty Pill Configuration
  let diffBadgeClass = "bg-gray-100 border-gray-200/70 text-gray-500 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400";
  let diffLabel = "Unrated";

  if (difficulty !== null) {
    if (difficulty < 4) {
      diffBadgeClass =
        "bg-emerald-50 border-emerald-200/70 text-emerald-700 dark:bg-emerald-900/25 dark:border-emerald-800/50 dark:text-emerald-300";
      diffLabel = "Easy";
    } else if (difficulty < 7) {
      diffBadgeClass =
        "bg-amber-50 border-amber-200/70 text-amber-700 dark:bg-amber-900/25 dark:border-amber-800/50 dark:text-amber-300";
      diffLabel = "Medium";
    } else {
      diffBadgeClass =
        "bg-orange-50 border-orange-200/70 text-orange-700 dark:bg-orange-900/25 dark:border-orange-800/50 dark:text-orange-300";
      diffLabel = "Hard";
    }
  }

  // Insightfulness Pill Configuration
  let insightBadgeClass = "bg-gray-100 border-gray-200/70 text-gray-500 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400";
  let insightLabel = insightful === 0 ? "Not Insightful" : "Unrated";
  const starsCount = insightful ?? 0;

  if (insightful === 0) {
    insightBadgeClass =
      "bg-rose-50 border-rose-200/70 text-rose-700 dark:bg-rose-900/25 dark:border-rose-800/50 dark:text-rose-300";
  } else if (insightful !== null && insightful > 0) {
    if (insightful === 1) {
      insightBadgeClass =
        "bg-indigo-50 border-indigo-200/70 text-indigo-700 dark:bg-indigo-900/25 dark:border-indigo-800/50 dark:text-indigo-300";
      insightLabel = "Slightly Insightful";
    } else if (insightful === 2) {
      insightBadgeClass =
        "bg-purple-50 border-purple-200/70 text-purple-700 dark:bg-purple-900/25 dark:border-purple-800/50 dark:text-purple-300";
      insightLabel = "Insightful";
    } else if (insightful === 3) {
      insightBadgeClass =
        "bg-amber-50 border-amber-200/70 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/60 dark:text-amber-300 font-bold";
      insightLabel = "Very Insightful";
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:border-aicc-purple/40 dark:hover:border-aicc-purple/50 transition-all flex flex-col justify-between">
      <div className="p-5">
        {/* Contest Header Badge */}
        {contest && (
          <div className="mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2.5 py-1 rounded-md border border-gray-200/60 dark:border-white/10">
              <Trophy className="w-3.5 h-3.5 text-aicc-purple dark:text-aicc-purple-light shrink-0" />
              <span className="truncate">{contest}</span>
            </span>
          </div>
        )}

        {/* Problem Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
          {topic ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`Show topics for ${problem}`}
                  title={`Topics: ${topic}`}
                  className="text-left cursor-help rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aicc-purple"
                >
                  {problem}
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-max max-w-[min(20rem,calc(100vw-2rem))] px-3 py-2 text-sm font-normal">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Topics</p>
                <p className="text-gray-600 dark:text-gray-300 break-words">{topic}</p>
              </PopoverContent>
            </Popover>
          ) : problem}
        </h3>

        {/* Bottom Metadata Row: Category Pill + Difficulty Pill + Insightfulness Pill */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {/* Category Pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shrink-0",
              categoryConfig.pillClass
            )}
          >
            <CategoryIcon className="w-3 h-3" />
            {category}
          </span>

          {/* Difficulty Pill */}
          {difficulty !== null ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  title={`Difficulty: ${difficulty.toFixed(1)} / 10`}
                  aria-label={`${diffLabel} difficulty: show exact rating`}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aicc-purple focus-visible:ring-offset-2",
                    diffBadgeClass
                  )}
                >
                  <Gauge className="w-3 h-3" />
                  {diffLabel}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto px-3 py-2 text-sm" side="top">
                Difficulty: {difficulty.toFixed(1)} / 10
              </PopoverContent>
            </Popover>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shrink-0",
                diffBadgeClass
              )}
            >
              <Gauge className="w-3 h-3" />
              {diffLabel}
            </span>
          )}

          {/* Insightfulness Pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shrink-0",
              insightBadgeClass
            )}
          >
            <Lightbulb
              className={cn(
                "w-3 h-3",
                starsCount > 0
                  ? "text-amber-500 fill-amber-400 dark:text-amber-400 dark:fill-amber-300"
                  : "opacity-60"
              )}
            />
            {insightful !== null && (
              <span aria-label={`${starsCount} out of 3 stars`} className="flex items-center gap-0.5">
                {[1, 2, 3].map((star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                    className={cn(
                      "text-[10px] leading-none",
                      starsCount >= star
                        ? "text-amber-500 dark:text-amber-400 font-bold"
                        : "opacity-60"
                    )}
                  >
                    {starsCount >= star ? "★" : "☆"}
                  </span>
                ))}
              </span>
            )}
            {insightLabel}
          </span>
        </div>
      </div>

      {/* Action Buttons: View Problem & View Solution */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex gap-2">
          {/* Problem Link Button */}
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              View Problem
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 cursor-not-allowed">
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              Link unavailable
            </span>
          )}

          {/* Solution Link(s) Button or Popover Dropdown */}
          {solutions.length === 0 ? (
            <span className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-2 cursor-not-allowed">
              <Clock className="w-4 h-4" />
              Solution coming soon
            </span>
          ) : solutions.length === 1 ? (
            <a
              href={solutions[0].url}
              target="_blank"
              rel="noreferrer"
              className={SOLUTION_BTN_CLASS}
            >
              <Github className="w-4 h-4" />
              View Solution
            </a>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button className={SOLUTION_BTN_CLASS}>
                  <Github className="w-4 h-4" />
                  <span>View Solution</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1.5 shadow-lg border border-gray-200 dark:border-white/10" align="end">
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider">
                  Available Solutions
                </div>
                <div className="space-y-1">
                  {solutions.map((sol, index) => (
                    <a
                      key={index}
                      href={sol.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span>{sol.label}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default SheetTaskCard;
