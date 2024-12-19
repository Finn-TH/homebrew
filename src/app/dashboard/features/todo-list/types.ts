export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  user_id: string;
  created_at: string;
}

export type SortOption = "newest" | "oldest" | "priority" | "alphabetical";
export type FilterOption = "all" | "active" | "completed" | Priority;
