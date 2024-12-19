"use client";

import { useState } from "react";
import { Priority } from "../types";
import { addTodo } from "../actions";
import { TodoDatePicker } from "./date-picker";
import { Circle, X } from "lucide-react";

const priorities = [
  {
    value: "low",
    label: "Low",
    className: "text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    value: "medium",
    label: "Medium",
    className: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
  },
  {
    value: "high",
    label: "High",
    className: "text-red-600 bg-red-50 hover:bg-red-100",
  },
] as const;

export default function AddTodoForm() {
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (dueDate) {
      formData.append("due_date", dueDate.toISOString());
    }
    await addTodo(formData);
    setDueDate(null);
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          name="title"
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-[#8B4513]/10 px-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
          required
        />

        <TodoDatePicker selectedDate={dueDate} onDateChange={setDueDate} />

        {/* Existing priority buttons */}
        <div className="flex gap-2">
          {priorities.map(({ value, label, className }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPriority(value)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors
                        ${className}
                        ${
                          priority === value
                            ? "ring-1 ring-inset ring-current"
                            : "opacity-60 hover:opacity-100"
                        }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#FDF6EC] px-4 py-2 text-[#8B4513] font-medium
                   hover:bg-[#FFE4C4] border border-[#8B4513]/10
                   transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Show selected date if any */}
      {dueDate && (
        <div className="flex items-center gap-2 text-sm text-[#8B4513]/60">
          <span>
            {dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <button
            type="button"
            onClick={() => setDueDate(null)}
            className="hover:text-[#8B4513]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </form>
  );
}
