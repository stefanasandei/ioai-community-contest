import { ArrowLeft, ExternalLink, Trophy } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import contestsData from "@/data/contests.json";
import round0Banner from "@/leaderboard/banners/round-0.png";
import round1Banner from "@/leaderboard/banners/round-1.png";
import round2Banner from "@/leaderboard/banners/round-2.png";
import round3Banner from "@/leaderboard/banners/round-3.png";
import round4Banner from "@/leaderboard/banners/round-4.png";
import round5Banner from "@/leaderboard/banners/round-5.png";
import round6Banner from "@/leaderboard/banners/round-6.png";
import round7Banner from "@/leaderboard/banners/round-7.png";
import round8Banner from "@/leaderboard/banners/round-8.png";
import round9Banner from "@/leaderboard/banners/round-9.png";
import round10Banner from "@/leaderboard/banners/round-10.jpg";
import {
    formatLeaderboardScore,
    getContestLeaderboard,
    type LeaderboardMode,
} from "@/lib/leaderboard";

const leaderboardBanners: Record<number, string> = {
    0: round0Banner,
    1: round1Banner,
    2: round2Banner,
    3: round3Banner,
    4: round4Banner,
    5: round5Banner,
    6: round6Banner,
    7: round7Banner,
    8: round8Banner,
    9: round9Banner,
    10: round10Banner,
};

const Leaderboard = () => {
    const { roundPath } = useParams<{ roundPath: string }>();
    const roundParam = roundPath?.match(/^round-(\d+)$/)?.[1];
    const roundNumber = Number(roundParam);
    const normalizedLeaderboard = Number.isInteger(roundNumber)
        ? getContestLeaderboard(roundNumber)
        : undefined;
    const rawLeaderboard = Number.isInteger(roundNumber)
        ? getContestLeaderboard(roundNumber, "raw")
        : undefined;
    const [viewMode, setViewMode] = useState<LeaderboardMode>("normalized");
    const activeMode = viewMode === "raw" && rawLeaderboard ? "raw" : "normalized";
    const leaderboard =
        activeMode === "raw" ? rawLeaderboard : normalizedLeaderboard;
    const participantCount =
        leaderboard?.participants.filter(
            (participant) => participant.kind === "participant"
        ).length ?? 0;
    const contest = contestsData.contests.find(
        (item) => item.id === roundNumber + 1
    );
    const banner = leaderboardBanners[roundNumber];
    const isCompactBanner = roundNumber === 8;

    if (!normalizedLeaderboard || !leaderboard) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
                <Navigation />
                <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light">
                        <Trophy className="h-8 w-8" />
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                        Leaderboard unavailable
                    </h1>
                    <p className="mb-7 text-gray-600 dark:text-gray-400">
                        We could not find leaderboard data for this contest.
                    </p>
                    <Link
                        to="/contests"
                        className="inline-flex items-center gap-2 rounded-lg bg-aicc-purple px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aicc-purple-light"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to contests
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Navigation />

            <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-6">
                <Link
                    to="/contests"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-aicc-purple dark:text-gray-400 dark:hover:text-aicc-purple-light"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to contests
                </Link>

                <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
                        <div className="min-w-0 flex-1">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                                AI Community Contest
                            </p>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
                                {contest?.title ?? "Round " + roundNumber}
                            </h1>
                            <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
                                This competition is organized by the{" "}
                                <a
                                    href="https://aicc-official.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-aicc-purple underline decoration-aicc-purple/30 underline-offset-2 transition-colors hover:text-aicc-purple-light dark:text-aicc-purple-light"
                                >
                                    AI Community Contest group
                                </a>
                                . It is meant to prepare students for the{" "}
                                <a
                                    href="https://ioai-official.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-aicc-purple underline decoration-aicc-purple/30 underline-offset-2 transition-colors hover:text-aicc-purple-light dark:text-aicc-purple-light"
                                >
                                    IOAI (International Olympiad in Artificial Intelligence)
                                </a>
                                .
                            </p>
                            <span className="mt-5 inline-flex w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                                {participantCount} participants
                            </span>
                        </div>

                        <div
                            className={`relative order-first shrink-0 overflow-hidden rounded-xl bg-[#08080d] shadow-sm md:order-last ${
                                isCompactBanner
                                    ? "aspect-square w-28 self-center md:w-32 lg:w-36"
                                    : "aspect-[1.91] w-full md:w-56 lg:w-72"
                            }`}
                        >
                            {banner ? (
                                <img
                                    src={banner}
                                    alt={`AICC Round ${roundNumber} banner`}
                                    className="block h-full w-full object-contain"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-aicc-purple via-[#28204f] to-aicc-orange" />
                            )}
                        </div>
                    </div>
                </div>

                {rawLeaderboard && (
                    <div className="mb-5 flex justify-center sm:justify-start">
                        <div
                            className="relative inline-flex rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-white/10 dark:bg-white/[0.06]"
                            role="tablist"
                            aria-label="Leaderboard type"
                        >
                            <span
                                aria-hidden="true"
                                className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-aicc-purple shadow-md shadow-aicc-purple/20 transition-transform duration-300 ease-out ${
                                    activeMode === "raw" ? "translate-x-full" : "translate-x-0"
                                }`}
                            />
                            {(["normalized", "raw"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeMode === mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`relative z-10 min-w-32 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                                        activeMode === mode
                                            ? "text-white"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                >
                                    {mode === "normalized" ? "Normalized" : "Raw"}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div key={activeMode} className="animate-fade-in">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="overflow-x-auto">
                        <table
                            className={`${activeMode === "raw" ? "min-w-[900px]" : "min-w-[1100px]"} w-full table-fixed border-collapse text-left`}
                        >
                            <colgroup>
                                <col className={activeMode === "raw" ? "w-[25%]" : "w-[22%]"} />
                                {leaderboard.tasks.map((task) => (
                                    <col
                                        key={task.name}
                                        className={activeMode === "raw" ? "w-[25%]" : "w-[18%]"}
                                    />
                                ))}
                                {activeMode === "normalized" && <col className="w-[24%]" />}
                            </colgroup>
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/95 dark:border-white/10 dark:bg-[#12121a]/95">
                                    <th className="sticky left-0 z-10 px-5 py-5 text-center align-middle text-xs font-bold uppercase tracking-wider text-gray-500 dark:bg-[#12121a]/95 dark:text-gray-400">
                                        Participant
                                    </th>
                                    {leaderboard.tasks.map((task) => (
                                        <th
                                            key={task.name}
                                            className="px-5 py-5 text-center align-middle"
                                        >
                                            <a
                                                href={task.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex max-w-full items-center justify-center gap-1.5 text-center text-base font-bold leading-tight text-gray-900 transition-colors hover:text-aicc-purple dark:text-white dark:hover:text-aicc-purple-light"
                                            >
                                                <span>{task.name}</span>
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                                            </a>
                                        </th>
                                    ))}
                                    {activeMode === "normalized" && (
                                        <th className="px-5 py-5 text-center align-middle">
                                            <span className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                                                Total points
                                            </span>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {leaderboard.participants.map((participant, index) => {
                                    const participantRank =
                                        leaderboard.participants
                                            .slice(0, index)
                                            .filter(({ kind }) => kind === "participant")
                                            .length + 1;
                                    const isReference = participant.kind === "reference";
                                    const isBaseline = participant.kind === "baseline";
                                    const rowTone = isReference
                                        ? "bg-pink-50/80 dark:bg-pink-500/[0.10]"
                                        : isBaseline
                                            ? "bg-gray-50/80 dark:bg-white/[0.06]"
                                            : "hover:bg-aicc-purple/[0.03] dark:hover:bg-white/[0.03]";
                                    const stickyTone = isReference
                                        ? "bg-pink-50 dark:bg-[#291522]"
                                        : isBaseline
                                            ? "bg-gray-50 dark:bg-[#17171d]"
                                            : "bg-white dark:bg-[#111118] group-hover:bg-[#fbf9ff] dark:group-hover:bg-[#171522]";
                                    const badgeTone = isReference
                                        ? "bg-pink-100 text-pink-700 dark:bg-pink-400/20 dark:text-pink-200"
                                        : isBaseline
                                            ? "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                                            : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400";

                                    return (
                                    <tr
                                        key={participant.username + "-" + index}
                                        className={`group transition-colors ${rowTone}`}
                                    >
                                        <td className={`sticky left-0 z-[1] px-5 py-4 ${stickyTone}`}>
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-bold tabular-nums ${badgeTone}`}>
                                                    {isReference ? "R" : isBaseline ? "B" : participantRank}
                                                </span>
                                                <span className={`truncate text-sm font-semibold ${isReference ? "text-pink-800 dark:text-pink-100" : "text-gray-900 dark:text-white"}`}>
                                                    {participant.username}
                                                </span>
                                            </div>
                                        </td>
                                        {leaderboard.tasks.map((task, taskIndex) => {
                                            const score = participant.scores[taskIndex];
                                            return (
                                                <td
                                                    key={task.name}
                                                    className="px-5 py-4 text-center text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300"
                                                >
                                                    {score === null ? (
                                                        <span className="font-semibold text-gray-500 dark:text-gray-400">—</span>
                                                    ) : (
                                                        formatLeaderboardScore(score)
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {activeMode === "normalized" && (
                                            <td className={`border-l px-5 py-4 text-center text-sm font-bold tabular-nums ${
                                                isReference
                                                    ? "border-pink-200 bg-pink-100/70 text-pink-700 dark:border-pink-400/20 dark:bg-pink-400/15 dark:text-pink-200"
                                                    : isBaseline
                                                        ? "border-gray-200 bg-gray-100/70 text-gray-600 dark:border-white/10 dark:bg-white/[0.08] dark:text-gray-300"
                                                        : "border-aicc-purple/10 bg-aicc-purple/[0.03] text-aicc-purple dark:border-aicc-purple/20 dark:bg-aicc-purple/[0.08] dark:text-aicc-purple-light"
                                            }`}>
                                                {formatLeaderboardScore(participant.totalPoints)}
                                            </td>
                                        )}
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Leaderboard;
