import type { Task } from "@/data/types";

export const isTaskMatch = (task: Task, query: string) => {
    const q = query.toLowerCase();
    return (
        task.name.toLowerCase().includes(q) ||
        task.type.toLowerCase().includes(q) ||
        (task.author?.toLowerCase().includes(q) ?? false)
    );
};
