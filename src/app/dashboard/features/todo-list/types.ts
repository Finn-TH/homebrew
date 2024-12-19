import { LucideIcon } from "lucide-react";

export type Priority = "low" | "medium" | "high";

export type FilterOption =
  | "all"
  | "active"
  | "completed"
  | "high"
  | "medium"
  | "low"
  | "overdue"
  | "due-today"
  | "upcoming"
  | "no-date";

// Add these new types
interface FilterItem {
  value: FilterOption;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

interface FilterGroup {
  group: string;
  options: FilterItem[];
}

export type FilterOptionItem = FilterItem | FilterGroup;

export type SortOption = "newest" | "priority" | "alphabetical" | "due-date";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  user_id: string;
  created_at: string;
  due_date: string | null;
}

export interface ActiveFilters {
  status?: ("active" | "completed")[];
  priority?: ("high" | "medium" | "low")[];
  time?: ("overdue" | "due-today" | "upcoming" | "no-date")[];
}

// Update the props interface
interface TodoFiltersProps {
  onFilterChange: (filters: ActiveFilters) => void;
  activeFilters: ActiveFilters;
  // ... other props
}
