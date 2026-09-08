import kaggleCsv from "@/leaderboard/leaderboard_kaggle.csv?raw";
import nitroCsv from "@/leaderboard/leaderboard_nitro.csv?raw";
import rawCsv from "@/leaderboard/leaderboard_raw.csv?raw";

export type LeaderboardPlatform = "Kaggle" | "Nitro Judge";
export type LeaderboardMode = "normalized" | "raw";
export type LeaderboardParticipantKind =
    | "participant"
    | "reference"
    | "baseline";

export interface LeaderboardTask {
    name: string;
    link: string;
    referenceScore: number | null;
    baselineScore: number | null;
}

export interface LeaderboardParticipant {
    username: string;
    scores: (number | null)[];
    totalPoints: number;
    kind: LeaderboardParticipantKind;
}

export interface ContestLeaderboard {
    roundNumber: number;
    platform: LeaderboardPlatform;
    mode: LeaderboardMode;
    tasks: LeaderboardTask[];
    participants: LeaderboardParticipant[];
}

const parseCsv = (csv: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let value = "";
    let insideQuotes = false;

    for (let index = 0; index < csv.length; index += 1) {
        const character = csv[index];
        const nextCharacter = csv[index + 1];

        if (character === '"') {
            if (insideQuotes && nextCharacter === '"') {
                value += '"';
                index += 1;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (character === "," && !insideQuotes) {
            row.push(value);
            value = "";
        } else if ((character === "\n" || character === "\r") && !insideQuotes) {
            if (character === "\r" && nextCharacter === "\n") index += 1;
            row.push(value);
            if (row.some((cell) => cell.trim() !== "")) rows.push(row);
            row = [];
            value = "";
        } else {
            value += character;
        }
    }

    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);

    return rows;
};

const parseScore = (value: string | undefined): number | null => {
    const normalized = value?.trim() ?? "";
    if (!normalized || normalized.toLowerCase() === "nan") return null;

    const score = Number(normalized);
    return Number.isFinite(score) ? score : null;
};

const sumScores = (scores: (number | null)[]) =>
    scores.reduce((total, score) => total + (score ?? 0), 0);

const parseLeaderboardCsv = (
    csv: string,
    platform: LeaderboardPlatform,
    mode: LeaderboardMode,
    includeBenchmarks = false,
    normalizedTotalsByRound?: Map<number, Map<string, number>>
): ContestLeaderboard[] => {
    const rows = parseCsv(csv);
    const header = rows[0] ?? [];
    const links = rows[1] ?? [];
    const referenceScores = rows[2] ?? [];
    const baselineScores = rows[3] ?? [];
    const taskColumns = new Map<
        number,
        { columnIndex: number; name: string }[]
    >();

    for (let columnIndex = 1; columnIndex < header.length; columnIndex += 1) {
        const match = header[columnIndex]?.match(/^Round\s+(\d+)\s*-\s*(.+)$/i);
        if (!match) continue;

        const roundNumber = Number(match[1]);
        const tasksForRound = taskColumns.get(roundNumber) ?? [];
        tasksForRound.push({
            columnIndex,
            name: match[2].trim(),
        });
        taskColumns.set(roundNumber, tasksForRound);
    }

    return Array.from(taskColumns.entries())
        .sort(([firstRound], [secondRound]) => firstRound - secondRound)
        .map(([roundNumber, columns]) => {
            const tasks = columns.map(({ columnIndex, name }) => ({
                name,
                link: links[columnIndex]?.trim() ?? "",
                referenceScore: parseScore(referenceScores[columnIndex]),
                baselineScore: parseScore(baselineScores[columnIndex]),
            }));

            const participants = rows
                .slice(4)
                .map((row) => {
                    const scores = columns.map(({ columnIndex }) =>
                        parseScore(row[columnIndex])
                    );

                    return {
                        username: row[0]?.trim() ?? "",
                        scores,
                        totalPoints: mode === "normalized" ? sumScores(scores) : 0,
                        kind: "participant" as const,
                    };
                })
                .filter(
                    (participant) =>
                        participant.username.length > 0 &&
                        participant.scores.some((score) => score !== null)
                )
                .sort((first, second) => {
                    const normalizedTotals = normalizedTotalsByRound?.get(roundNumber);
                    const firstTotal = normalizedTotals?.get(first.username);
                    const secondTotal = normalizedTotals?.get(second.username);

                    if (normalizedTotals) {
                        return (
                            (secondTotal ?? Number.NEGATIVE_INFINITY) -
                            (firstTotal ?? Number.NEGATIVE_INFINITY)
                        );
                    }

                    return second.totalPoints - first.totalPoints;
                });

            const benchmarkParticipants: LeaderboardParticipant[] = includeBenchmarks
                ? [
                      {
                          username: "Reference score",
                          scores: columns.map(({ columnIndex }) =>
                              parseScore(referenceScores[columnIndex])
                          ),
                          totalPoints:
                              mode === "normalized"
                                  ? sumScores(
                                        columns.map(({ columnIndex }) =>
                                            parseScore(referenceScores[columnIndex])
                                        )
                                    )
                                  : 0,
                          kind: "reference",
                      },
                      {
                          username: "Baseline score",
                          scores: columns.map(({ columnIndex }) =>
                              parseScore(baselineScores[columnIndex])
                          ),
                          totalPoints:
                              mode === "normalized"
                                  ? sumScores(
                                        columns.map(({ columnIndex }) =>
                                            parseScore(baselineScores[columnIndex])
                                        )
                                    )
                                  : 0,
                          kind: "baseline",
                      },
                  ]
                : [];

            return {
                roundNumber,
                platform,
                mode,
                tasks,
                participants: [...benchmarkParticipants, ...participants],
            };
        });
};

export const contestLeaderboards: ContestLeaderboard[] = [
    ...parseLeaderboardCsv(kaggleCsv, "Kaggle", "normalized"),
    ...parseLeaderboardCsv(nitroCsv, "Nitro Judge", "normalized"),
].sort((first, second) => first.roundNumber - second.roundNumber);

const normalizedTotalsByRound = new Map(
    contestLeaderboards.map((leaderboard) => [
        leaderboard.roundNumber,
        new Map(
            leaderboard.participants.map((participant) => [
                participant.username,
                participant.totalPoints,
            ])
        ),
    ])
);

export const rawContestLeaderboards: ContestLeaderboard[] = parseLeaderboardCsv(
    rawCsv,
    "Kaggle",
    "raw",
    true,
    normalizedTotalsByRound
).filter((leaderboard) => leaderboard.roundNumber !== 8);

export const getContestLeaderboard = (
    roundNumber: number,
    mode: LeaderboardMode = "normalized"
) =>
    (mode === "raw" ? rawContestLeaderboards : contestLeaderboards).find(
        (leaderboard) => leaderboard.roundNumber === roundNumber
    );

export const formatLeaderboardScore = (score: number | null) =>
    score === null ? "—" : score.toFixed(4);
