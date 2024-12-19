"use client";

import { useState, useEffect } from "react";
import { Priority } from "../../types";
import { addTodo } from "../../actions";
import { ArrowDownCircle, MinusCircle, ArrowUpCircle } from "lucide-react";
import { TodoDatePicker } from "../shared/date-picker";

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

interface CustomAddProps {
  onClose: () => void;
}

export default function CustomAdd({ onClose }: CustomAddProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (dueDate) {
      setFormattedDate(
        dueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  }, [dueDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("priority", priority);
      if (dueDate) {
        formData.append("due_date", dueDate.toISOString());
      }
      await addTodo(formData);
      onClose();
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Todo title"
        className="w-full px-4 py-3 text-lg rounded-lg border border-[#8B4513]/10 
                 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20
                 placeholder:text-[#8B4513]/40"
        required
        autoFocus
      />

      {/* Description */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-[#8B4513]">Description</h4>
        <textarea
          name="description"
          placeholder="Add more details..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-[#8B4513]/10 
                   focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20
                   placeholder:text-[#8B4513]/40 resize-none"
        />
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-[#8B4513]">Priority</h4>
          <div className="flex gap-2">
            {priorities.map(({ value, icon, className, ariaLabel }) => (
              <button
                key={value}
                type="button"
                aria-label={ariaLabel}
                onClick={() => setPriority(value)}
                className={`p-2 rounded-lg transition-colors
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
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-semibold text-[#8B4513]">Due Date</h4>
          <div className="flex items-center gap-2">
            <TodoDatePicker selectedDate={dueDate} onDateChange={setDueDate} />
            {dueDate && (
              <span className="text-sm text-[#8B4513]/60">{formattedDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[#8B4513]/60 
                   hover:text-[#8B4513] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#8B4513] 
                   rounded-lg hover:bg-[#8B4513]/90 transition-colors
                   disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Todo"}
        </button>
      </div>
    </form>
  );
}
