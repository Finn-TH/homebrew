"use client";

import { useState } from "react";
import { Priority } from "../types";
import { addTodo } from "../actions";
import { Circle } from "lucide-react";

const priorities: { value: Priority; label: string; color: string }[] = [
  {
    value: "low",
    label: "Low",
    color: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
  {
    value: "high",
    label: "High",
    color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
  },
];

export default function AddTodoForm() {
  const [priority, setPriority] = useState<Priority>("medium");

  return (
    <form action={addTodo} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-[#8B4513]/20 bg-white/50 px-4 py-2 
                   text-[#8B4513] placeholder-[#8B4513]/40"
          required
        />

        {/* Hidden input for form submission */}
        <input type="hidden" name="priority" value={priority} />

        {/* Priority selector buttons */}
        <div className="flex gap-1 items-center">
          {priorities.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPriority(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border 
                        transition-all duration-200 ${color}
                        ${priority === value ? "ring-2 ring-offset-1" : ""}`}
            >
              <Circle
                className={`h-3 w-3 ${
                  priority === value ? "fill-current" : ""
                }`}
              />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#8B4513] px-4 py-2 text-white hover:bg-[#A0522D]
                   transition-colors whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </form>
  );
}
