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
    source?: string;
    solution: string;
    blog?: string;
    practiceStatus: PracticeStatus;
}

export interface Contest {
    id: number;
    month: string;
    year: string;
    title: string;
    winner?: string;
    tasks: Task[];
    disabled?: boolean;
}

export interface ContestsData {
    contests: Contest[];
    standaloneTasks: Task[];
}
