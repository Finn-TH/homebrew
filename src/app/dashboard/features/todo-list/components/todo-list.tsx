"use client";

import { useState, useTransition } from "react";
import TodoItem from "./todo-item";
import TodoFilters from "./todo-filters";
import { Todo } from "../types";
import { Trash2, Check, Square, CheckSquare } from "lucide-react";
import { deleteTodo, toggleTodo } from "../actions";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(
    new Set(todos.filter((todo) => todo.completed).map((todo) => todo.id))
  );
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [currentSort, setCurrentSort] = useState<
    "newest" | "oldest" | "priority" | "alphabetical"
  >("newest");
  const [isPending, startTransition] = useTransition();

  const handleSelect = (id: string) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTodos((prev) =>
      prev.length === todos.length ? [] : todos.map((todo) => todo.id)
    );
  };

  const handleMassDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all(selectedTodos.map((id) => deleteTodo(id)));
        setSelectedTodos([]);
      } catch (error) {
        console.error("Failed to delete todos:", error);
      }
    });
  };

  const handleMassComplete = () => {
    startTransition(async () => {
      const selectedItems = todos.filter((todo) =>
        selectedTodos.includes(todo.id)
      );
      const allCompleted = selectedItems.every((todo) =>
        completedTodos.has(todo.id)
      );

      try {
        const itemsToUpdate = selectedItems.filter((todo) =>
          allCompleted
            ? completedTodos.has(todo.id)
            : !completedTodos.has(todo.id)
        );

        await Promise.all(
          itemsToUpdate.map(async (todo) => {
            await toggleTodo(todo.id);
            setCompletedTodos((prev) => {
              const next = new Set(prev);
              if (allCompleted) {
                next.delete(todo.id);
              } else {
                next.add(todo.id);
              }
              return next;
            });
          })
        );
        setSelectedTodos([]);
      } catch (error) {
        console.error("Failed to update todos:", error);
      }
    });
  };

  const filteredAndSortedTodos = todos
    .filter((todo) => {
      if (currentFilter === "active") return !completedTodos.has(todo.id);
      if (currentFilter === "completed") return completedTodos.has(todo.id);
      return true;
    })
    .sort((a, b) => {
      switch (currentSort) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "priority":
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default: // newest
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

  const selectedItems = todos.filter((todo) => selectedTodos.includes(todo.id));
  const allSelectedCompleted =
    selectedItems.length > 0 &&
    selectedItems.every((todo) => completedTodos.has(todo.id));
  const hasUncompletedItems = selectedItems.some(
    (todo) => !completedTodos.has(todo.id)
  );
  const hasCompletedItems = selectedItems.some((todo) =>
    completedTodos.has(todo.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TodoFilters
          onFilterChange={setCurrentFilter}
          onSortChange={setCurrentSort}
          currentFilter={currentFilter}
          currentSort={currentSort}
        />

        {selectedTodos.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMassComplete}
              disabled={isPending}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md 
                       transition-colors disabled:opacity-50
                       ${
                         allSelectedCompleted
                           ? "text-yellow-600 hover:bg-yellow-50"
                           : "text-[#8B4513] hover:bg-[#8B4513]/10"
                       }`}
            >
              <Check className="h-4 w-4" />
              {allSelectedCompleted
                ? `Uncomplete (${selectedItems.length})`
                : `Complete (${
                    hasUncompletedItems
                      ? selectedItems.filter(
                          (todo) => !completedTodos.has(todo.id)
                        ).length
                      : selectedItems.length
                  })`}
            </button>
            <button
              onClick={handleMassDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 
                       hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Selection bar */}
      {selectedTodos.length > 0 && (
        <div className="flex items-center gap-2 bg-[#8B4513]/5 px-4 py-2 rounded-lg">
          <button
            onClick={() =>
              setSelectedTodos(
                selectedTodos.length === todos.length
                  ? []
                  : todos.map((t) => t.id)
              )
            }
            className="text-[#8B4513] hover:bg-[#8B4513]/10 p-1 rounded transition-colors"
          >
            {selectedTodos.length === todos.length ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <span className="text-sm text-[#8B4513]">
            {selectedTodos.length} selected
          </span>
        </div>
      )}

      {/* Todo items */}
      <ul className="space-y-2">
        {filteredAndSortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedTodos.includes(todo.id)}
            isCompleted={completedTodos.has(todo.id)}
            onSelect={() => handleSelect(todo.id)}
            onToggleComplete={(completed) => {
              setCompletedTodos((prev) => {
                const next = new Set(prev);
                if (completed) {
                  next.add(todo.id);
                } else {
                  next.delete(todo.id);
                }
                return next;
              });
            }}
          />
        ))}
      </ul>
    </div>
  );
}
