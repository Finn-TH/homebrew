"use client";

import { Priority, SortOption, FilterOption } from "../types";

interface TodoFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  currentSort: SortOption;
  currentFilter: FilterOption;
}

export default function TodoFilters({
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilter,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value as FilterOption)}
        className="rounded-lg border border-[#8B4513]/20 bg-white/50 px-4 py-2 text-[#8B4513]"
      >
        <option value="all">All Tasks</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-lg border border-[#8B4513]/20 bg-white/50 px-4 py-2 text-[#8B4513]"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}
