"use client";

import { useState, useTransition, useEffect } from "react";
import { Todo, Priority } from "../types";
import { toggleTodo, deleteTodo, updatePriority } from "../actions";
import {
  Trash2,
  Circle,
  CheckCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
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

interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect: () => void;
  onToggleComplete: (completed: boolean) => void;
  onPriorityChange?: (priority: Priority) => void;
}

export default function TodoItem({
  todo,
  isSelected,
  isCompleted,
  onSelect,
  onToggleComplete,
  onPriorityChange,
}: TodoItemProps) {
  const [isPending, startTransition] = useTransition();
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleTodo(todo.id);
        onToggleComplete(!isCompleted);
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    startTransition(async () => {
      try {
        await updatePriority(todo.id, newPriority);
        onPriorityChange?.(newPriority);
      } catch (error) {
        console.error("Failed to update priority:", error);
      }
    });
  };

  const currentPriority = priorities.find((p) => p.value === todo.priority);

  const getDueDateStyle = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "text-red-500"; // overdue
    if (diffDays <= 2) return "text-orange-500"; // due soon
    return "text-[#8B4513]/60"; // upcoming
  };

  return (
    <li
      className={`group flex items-center justify-between rounded-lg border p-4 
                 transition-colors duration-200 cursor-pointer
                 ${
                   isSelected
                     ? "bg-[#8B4513]/5 border-[#8B4513]/20"
                     : "border-[#8B4513]/10"
                 }
                 hover:bg-[#8B4513]/5`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="text-[#8B4513] hover:bg-[#8B4513]/10 rounded-full transition-colors p-1"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-[#8B4513]" />
          ) : isSelected ? (
            <CheckCircle className="h-5 w-5 text-[#8B4513]/70" />
          ) : (
            <Circle className="h-5 w-5 text-[#8B4513]/40" />
          )}
        </button>

        <span
          className={`transition-all duration-200 flex-1 ${
            isCompleted ? "line-through text-[#8B4513]/40" : "text-[#8B4513]"
          }`}
        >
          {todo.title}
        </span>

        {todo.due_date && (
          <span
            className={`flex items-center gap-1.5 text-sm ${getDueDateStyle(
              todo.due_date
            )}`}
          >
            <Calendar className="h-3.5 w-3.5" />
            {new Date(todo.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}

        <DropdownMenu.Root
          open={priorityMenuOpen}
          onOpenChange={setPriorityMenuOpen}
        >
          <DropdownMenu.Trigger asChild onClick={(e) => e.stopPropagation()}>
            <button
              className={`px-2 py-1 rounded-full text-xs transition-colors focus:outline-none
                       ${currentPriority?.color} ${currentPriority?.bgColor}`}
            >
              {currentPriority?.label}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[8rem] overflow-hidden rounded-md border 
                       border-[#8B4513]/10 bg-white p-1 shadow-md"
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={() => setPriorityMenuOpen(false)}
              sideOffset={5}
            >
              {priorities.map(({ value, label, color, bgColor }) => (
                <DropdownMenu.Item
                  key={value}
                  onClick={() => {
                    handlePriorityChange(value);
                    setPriorityMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-sm outline-none cursor-pointer 
                           ${color} hover:${bgColor} rounded-sm
                           ${todo.priority === value ? bgColor : ""}`}
                >
                  {label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTodo(todo.id);
        }}
        disabled={isPending}
        className="text-[#8B4513]/40 hover:text-[#8B4513] disabled:opacity-50 
                 transition-colors duration-200 p-1 rounded opacity-0 
                 group-hover:opacity-100 focus:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
