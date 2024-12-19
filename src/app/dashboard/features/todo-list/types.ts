export type Priority = "low" | "medium" | "high";

export type FilterOption = "all" | "active" | "completed" | Priority;

export type SortOption = "newest" | "oldest" | "priority" | "alphabetical";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
}
