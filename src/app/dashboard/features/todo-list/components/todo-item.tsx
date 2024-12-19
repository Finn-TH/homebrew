"use client";

import { useState, useTransition } from "react";
import { Todo, Priority } from "../types";
import { toggleTodo, deleteTodo } from "../actions";
import { Trash2 } from "lucide-react";

const priorityColors: Record<Priority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Immediately update the UI
    setIsCompleted(!isCompleted);

    // Update the server in the background
    startTransition(async () => {
      try {
        await toggleTodo(todo.id);
      } catch (error) {
        // Revert the UI if server update fails
        setIsCompleted(isCompleted);
        console.error("Failed to update todo:", error);
      }
    });
  };

  return (
    <li className="flex items-center justify-between rounded-lg border border-[#8B4513]/10 p-4 hover:bg-[#8B4513]/5">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="h-4 w-4 rounded border-[#8B4513]/20 transition-colors duration-200"
        />
        <span
          className={`transition-all duration-200 ${
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
        onClick={() => deleteTodo(todo.id)}
        disabled={isPending}
        className="text-[#8B4513]/40 hover:text-[#8B4513] disabled:opacity-50 transition-colors duration-200"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
