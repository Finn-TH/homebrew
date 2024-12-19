"use client";

import { useState, useTransition } from "react";
import TodoItem from "./todo-item";
import TodoFilters from "./todo-filters";
import { Todo, FilterOption, SortOption, Priority } from "../types";
import { Trash2, Check, Square, CheckSquare, X } from "lucide-react";
import { deleteTodo, toggleTodo, updatePriority } from "../actions";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const priorities: {
  value: Priority;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "low",
    label: "Low",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    value: "high",
    label: "High",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(
    new Set(todos.filter((todo) => todo.completed).map((todo) => todo.id))
  );
  const [currentFilter, setCurrentFilter] = useState<FilterOption>("all");
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [isPending, startTransition] = useTransition();
  const [bulkPriorityOpen, setBulkPriorityOpen] = useState(false);

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

  const handleBulkPriorityChange = (newPriority: Priority) => {
    startTransition(async () => {
      try {
        await Promise.all(
          selectedTodos.map((id) => updatePriority(id, newPriority))
        );
        // Update local state if needed
        setSelectedTodos([]); // Clear selection after update
        setBulkPriorityOpen(false);
      } catch (error) {
        console.error("Failed to update priorities:", error);
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
      {/* Only show the options menu when no items are selected */}
      {selectedTodos.length === 0 && (
        <TodoFilters
          onFilterChange={setCurrentFilter}
          onSortChange={setCurrentSort}
          currentFilter={currentFilter}
          currentSort={currentSort}
        />
      )}

      {/* Show the multi-select toolbar when items are selected */}
      {selectedTodos.length > 0 && (
        <div className="flex items-center gap-3 bg-[#8B4513]/5 px-4 py-2.5 rounded-lg border border-[#8B4513]/10">
          {/* Simplified count with clear button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-[#8B4513] text-white font-medium text-sm">
              {selectedTodos.length}
            </div>
            <button
              onClick={() => setSelectedTodos([])}
              className="text-[#8B4513]/60 hover:text-[#8B4513] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Priority dropdown with better contrast */}
          <DropdownMenu.Root
            open={bulkPriorityOpen}
            onOpenChange={setBulkPriorityOpen}
          >
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md 
                         text-[#8B4513] bg-white/80 hover:bg-white transition-colors 
                         focus:outline-none border border-[#8B4513]/20"
              >
                <span>Set Priority</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border 
                         border-[#8B4513]/10 bg-white p-1 shadow-md"
                onMouseLeave={() => setBulkPriorityOpen(false)}
                sideOffset={5}
              >
                {priorities.map(({ value, label, color, bgColor }) => (
                  <DropdownMenu.Item
                    key={value}
                    onClick={() => handleBulkPriorityChange(value)}
                    className={`px-2 py-1.5 text-sm outline-none cursor-pointer 
                             ${color} hover:${bgColor} rounded-sm`}
                  >
                    {label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Complete button with matching style */}
          <button
            onClick={handleMassComplete}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md 
                     transition-colors disabled:opacity-50 border border-[#8B4513]/20
                     text-[#8B4513] bg-white/80 hover:bg-white"
          >
            <Check className="h-4 w-4" />
            {allSelectedCompleted
              ? `Uncomplete (${selectedTodos.length})`
              : `Complete (${selectedTodos.length})`}
          </button>

          {/* Delete button with consistent styling */}
          <button
            onClick={handleMassDelete}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md 
                     transition-colors disabled:opacity-50 border border-red-200
                     text-red-600 bg-white/80 hover:bg-white"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
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
