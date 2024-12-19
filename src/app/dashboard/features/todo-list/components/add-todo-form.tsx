"use client";

import { useState } from "react";
import { Priority } from "../types";
import { addTodo } from "../actions";
import { TodoDatePicker } from "./date-picker";
import { ArrowDownCircle, MinusCircle, ArrowUpCircle, X } from "lucide-react";

const priorities = [
  {
    value: "low",
    icon: <ArrowDownCircle className="h-4 w-4" />,
    className: "text-green-600 hover:bg-green-50",
    ariaLabel: "Low Priority",
  },
  {
    value: "medium",
    icon: <MinusCircle className="h-4 w-4" />,
    className: "text-yellow-600 hover:bg-yellow-50",
    ariaLabel: "Medium Priority",
  },
  {
    value: "high",
    icon: <ArrowUpCircle className="h-4 w-4" />,
    className: "text-red-600 hover:bg-red-50",
    ariaLabel: "High Priority",
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
        <div className="flex gap-1.5">
          {priorities.map(({ value, icon, className, ariaLabel }) => (
            <button
              key={value}
              type="button"
              aria-label={ariaLabel}
              onClick={() => setPriority(value)}
              className={`p-1.5 rounded-md transition-colors
                        ${className}
                        ${
                          priority === value
                            ? "bg-current/10 ring-1 ring-current"
                            : "opacity-40 hover:opacity-100"
                        }`}
            >
              {icon}
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
