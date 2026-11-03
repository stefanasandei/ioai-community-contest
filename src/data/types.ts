export interface LearnItem {
  topic: string;
  seq?: number;
}

export type PracticeStatus = "easy" | "medium" | "hard" | "legacy";

export interface Task {
    name: string;
    type: string;
    author?: string;
    kaggle?: string;
    nitroJudge?: string;
    sprawdzai?: string;
    source?: string;
    solution: string;
    blog?: string;
    practiceStatus?: PracticeStatus;
}

export interface Contest {
    id: number;
    month: string;
    year: string;
    title: string;
    winner?: string;
    tasks: Task[];
    disabled?: boolean;
    format?: "main" | "beginner";
    dateLabel?: string;
    description?: string;
    contestUrl?: string;
    leaderboardUrl?: string;
}

export interface ContestsData {
    contests: Contest[];
    standaloneTasks: Task[];
}
