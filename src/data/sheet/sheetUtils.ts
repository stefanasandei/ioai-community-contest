import rawSheetData from "./sheet.json";

export interface SheetTask {
  Contest?: string | null;
  Problem: string;
  Category?: string | null;
  Topic?: string | null;
  Insightful?: number | string | null;
  Difficulty?: number | string | null;
  Link?: string | null;
  Solution?: string | null;
  [key: string]: unknown;
}

export interface SolutionLink {
  label: string;
  url: string;
}

export interface ParsedSheetTask {
  contest: string;
  problem: string;
  category: string;
  topic: string;
  insightful: number | null; // 0 to 3 or null
  difficulty: number | null; // 0 to 10 or null
  link: string | null;
  solution: string | null;
  solutions: SolutionLink[];
  original: SheetTask;
}

export function parseSolutionLinks(solutionStr: string | null): SolutionLink[] {
  if (!solutionStr || typeof solutionStr !== "string") return [];

  // Find all http(s) URLs in string
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = solutionStr.match(urlRegex);
  if (!matches || matches.length === 0) return [];

  if (matches.length === 1) {
    return [{ label: "View Solution", url: matches[0] }];
  }

  return matches.map((url, index) => ({
    label: `Solution ${index + 1}`,
    url,
  }));
}

export function parseSheetTask(item: SheetTask): ParsedSheetTask {
  const contest = item.Contest ? String(item.Contest).trim() : "Olympiad Task";
  const problem = item.Problem ? String(item.Problem).trim() : "Untitled Problem";
  
  // Clean category (e.g. fix typo "Computer VIsion" -> "Computer Vision")
  let category = String(item.Category ?? "").trim() || "Unspecified";
  if (category.toLowerCase() === "computer vision") {
    category = "Computer Vision";
  }

  const topic = item.Topic && String(item.Topic).trim() !== "" ? String(item.Topic).trim() : "";

  let insightful: number | null = null;
  if (item.Insightful !== null && item.Insightful !== undefined && item.Insightful !== "") {
    const parsed = Number(item.Insightful);
    if (!isNaN(parsed)) {
      insightful = Math.max(0, Math.min(3, Math.round(parsed)));
    }
  }

  let difficulty: number | null = null;
  if (item.Difficulty !== null && item.Difficulty !== undefined && item.Difficulty !== "") {
    const parsed = Number(item.Difficulty);
    if (!isNaN(parsed)) {
      difficulty = Math.max(0, Math.min(10, Math.round(parsed * 10) / 10));
    }
  }

  const link = item.Link && String(item.Link).trim() !== "" ? String(item.Link).trim() : null;
  const solution = item.Solution && String(item.Solution).trim() !== "" ? String(item.Solution).trim() : null;
  const solutions = parseSolutionLinks(solution);

  return {
    contest,
    problem,
    category,
    topic,
    insightful,
    difficulty,
    link,
    solution,
    solutions,
    original: item,
  };
}

export function getSheetTasks(): ParsedSheetTask[] {
  if (!Array.isArray(rawSheetData)) return [];
  return (rawSheetData as SheetTask[])
    .filter((task) => task && typeof task === "object" && task.Problem)
    .map(parseSheetTask);
}

export function getUniqueSheetCategories(): string[] {
  const tasks = getSheetTasks();
  const catSet = new Set<string>();
  for (const t of tasks) {
    if (t.category) catSet.add(t.category);
  }
  return Array.from(catSet).sort();
}
