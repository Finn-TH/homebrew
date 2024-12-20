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
  const [dueDateStyle, setDueDateStyle] = useState("text-[#8B4513]/60");

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

  useEffect(() => {
    if (todo.due_date) {
      const today = new Date();
      const due = new Date(todo.due_date);
      const diffDays = Math.ceil(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 0) setDueDateStyle("text-red-500");
      else if (diffDays <= 2) setDueDateStyle("text-orange-500");
      else setDueDateStyle("text-[#8B4513]/60");
    }
  }, [todo.due_date]);

  return (
    <li
      className={`grid grid-cols-[auto_1fr_150px_100px] items-center gap-4 rounded-lg border p-4 
                 transition-colors duration-200 cursor-pointer
                 ${
                   isSelected
                     ? "bg-[#8B4513]/5 border-[#8B4513]/20"
                     : "border-[#8B4513]/10"
                 }
                 hover:bg-[#8B4513]/5`}
      onClick={onSelect}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className="w-8 text-[#8B4513] hover:bg-[#8B4513]/10 rounded-full transition-colors p-1"
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
        className={`transition-all duration-200 ${
          isCompleted ? "line-through text-[#8B4513]/40" : "text-[#8B4513]"
        }`}
      >
        {todo.title}
      </span>

      <span className="text-right">
        {todo.due_date && (
          <span
            className={`flex items-center justify-end gap-1.5 text-sm ${dueDateStyle}`}
          >
            <Calendar className="h-3.5 w-3.5" />
            {new Date(todo.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </span>

      <span className="text-center">
        <DropdownMenu.Root
          open={priorityMenuOpen}
          onOpenChange={setPriorityMenuOpen}
        >
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`rounded-full px-3 py-0.5 text-sm
                ${
                  todo.priority === "low"
                    ? "bg-green-100 text-green-600"
                    : todo.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }
              `}
            >
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    startTransition(async () => {
                      try {
                        await updatePriority(todo.id, value);
                      } catch (error) {
                        console.error("Failed to update priority:", error);
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
      </span>
    </li>
  );
}
