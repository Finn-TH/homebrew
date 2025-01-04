"use client";

import { useState, useTransition } from "react";
import TodoItem from "../components/todo-item";
import TodoFilters from "../components/filters/todo-filters";
import { Todo, FilterOption, SortOption, Priority } from "../types";
import { Trash2, Check } from "lucide-react";
import { deleteTodo, toggleTodo, updatePriority } from "../actions";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { QuickFilters } from "../components/filters/quick-filters";
import { ActiveView } from "../components/active-view";
import {
  filterTodos,
  sortTodos,
  priorities,
} from "../components/shared/todo-utils";
import { TodoAnalytics } from "../components/todo-analytics";
import { ViewSelector } from "../components/view-selector";
import { CalendarView } from "../components/calendar-view";

interface TodoListClientProps {
  initialTodos: Todo[];
  initialOverdueTasks: number;
  initialTodayTasks: number;
}
export default function TodoListClient({
  initialTodos,
  initialOverdueTasks,
  initialTodayTasks,
}: TodoListClientProps) {
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(
    new Set(
      initialTodos.filter((todo) => todo.completed).map((todo) => todo.id)
    )
  );
  const [currentFilter, setCurrentFilter] = useState<FilterOption>("all");
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [isPending, startTransition] = useTransition();
  const [bulkPriorityOpen, setBulkPriorityOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");

  const filteredTodos = filterTodos(initialTodos, currentFilter);
  const filteredAndSortedTodos = sortTodos(filteredTodos, currentSort);

  return (
    <div className="space-y-6">
      <TodoAnalytics todos={initialTodos} />

      <div className="flex items-center justify-between">
        <QuickFilters
          onFilterChange={setCurrentFilter}
          overdueTasks={initialOverdueTasks}
          todayTasks={initialTodayTasks}
        />
        <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {currentView === "list" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <TodoFilters
              onFilterChange={setCurrentFilter}
              onSortChange={setCurrentSort}
              currentFilter={currentFilter}
              currentSort={currentSort}
            />

            {selectedTodos.length > 0 && (
              <div className="flex items-center gap-2 mr-[55px]">
                <DropdownMenu.Root
                  open={bulkPriorityOpen}
                  onOpenChange={setBulkPriorityOpen}
                >
                  <DropdownMenu.Trigger asChild>
                    <button className="rounded-lg bg-[#8B4513]/10 px-3 py-1.5 text-sm text-[#8B4513] hover:bg-[#8B4513]/20">
                      Set Priority
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[8rem] overflow-hidden rounded-md border border-[#8B4513]/10 bg-white p-1 shadow-md"
                      sideOffset={5}
                    >
                      {priorities.map(({ value, label, color }) => (
                        <DropdownMenu.Item
                          key={value}
                          onClick={() => {
                            startTransition(async () => {
                              try {
                                await Promise.all(
                                  selectedTodos.map((id) =>
                                    updatePriority(id, value)
                                  )
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to update priorities:",
                                  error
                                );
                              }
                            });
                          }}
                          className={`px-2 py-1.5 text-sm outline-none cursor-pointer ${color} rounded-sm hover:bg-[#8B4513]/5`}
                        >
                          {label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <button
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await Promise.all(selectedTodos.map(deleteTodo));
                        setSelectedTodos([]);
                      } catch (error) {
                        console.error("Failed to delete todos:", error);
                      }
                    });
                  }}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <ActiveView
            currentFilter={currentFilter}
            onClear={() => setCurrentFilter("all")}
          />

          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_150px_100px] items-center gap-4 px-4 py-2 text-sm text-[#8B4513]/60">
            <span className="w-8" /> {/* Checkbox column */}
            <span>Task</span>
            <span className="text-right">Due Date</span>
            <span className="text-center">Priority</span>
          </div>

          {/* Todo list */}
          <ul className="space-y-2">
            {filteredAndSortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isSelected={selectedTodos.includes(todo.id)}
                isCompleted={completedTodos.has(todo.id)}
                onSelect={() => {
                  setSelectedTodos((prev) =>
                    prev.includes(todo.id)
                      ? prev.filter((id) => id !== todo.id)
                      : [...prev, todo.id]
                  );
                }}
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
      ) : (
        <CalendarView todos={filteredAndSortedTodos} />
      )}
    </div>
  );
}
