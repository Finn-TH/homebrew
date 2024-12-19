"use client";

import { useState } from "react";
import { Todo, Priority, SortOption, FilterOption } from "../types";
import TodoFilters from "./todo-filters";
import TodoItem from "./todo-item";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredAndSortedTodos = todos
    .filter((todo: Todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return todo.priority === filter;
    })
    .sort((a: Todo, b: Todo) => {
      switch (sort) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div>
      <TodoFilters
        onSortChange={setSort}
        onFilterChange={setFilter}
        currentSort={sort}
        currentFilter={filter}
      />

      <ul className="space-y-2">
        {filteredAndSortedTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
