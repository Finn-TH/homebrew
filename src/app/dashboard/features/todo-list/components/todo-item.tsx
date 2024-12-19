"use client";

import { useTransition } from "react";
import { Todo, Priority } from "../types";
import { toggleTodo, deleteTodo } from "../actions";
import { Trash2, Circle, CheckCircle, CheckCircle2 } from "lucide-react";

const priorityColors: Record<Priority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect: () => void;
  onToggleComplete: (completed: boolean) => void;
}

export default function TodoItem({
  todo,
  isSelected,
  isCompleted,
  onSelect,
  onToggleComplete,
}: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

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

        <span
          className={`px-2 py-1 rounded-full text-xs ${
            priorityColors[todo.priority]
          }`}
        >
          {todo.priority}
        </span>
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
