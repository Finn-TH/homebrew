"use client";

import { useState } from "react";
import { Priority } from "../../types";
import { addTodo } from "../../actions";
import { ArrowDownCircle, MinusCircle, ArrowUpCircle } from "lucide-react";

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

interface QuickAddProps {
  onClose: () => void;
}

export default function QuickAdd({ onClose }: QuickAddProps) {
  const [priority, setPriority] = useState<Priority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("priority", priority);
      await addTodo(formData);
      onClose();
    } catch (error) {
      console.error("Failed to add todo:", error);
      // Could add error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          name="title"
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 text-lg rounded-lg border border-[#8B4513]/10 
                   focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20
                   placeholder:text-[#8B4513]/40"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-semibold text-[#8B4513]">Priority</h4>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {priorities.map(({ value, icon, className, ariaLabel }) => (
              <button
                key={value}
                type="button"
                aria-label={ariaLabel}
                onClick={() => {
                  setPriority(value);
                  const formData = new FormData();
                  formData.append("priority", value);
                }}
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

          <div className="flex gap-2">
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
        </div>
      </div>
    </form>
  );
}
