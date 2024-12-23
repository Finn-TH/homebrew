"use client";

import { useState, useTransition } from "react";
import { Calendar } from "lucide-react";
import { addHabit } from "../../actions";
import { HabitDatePicker } from "./shared/date-picker";

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

interface HabitFormProps {
  onComplete: () => void;
}

export default function HabitForm({ onComplete }: HabitFormProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    startTransition(async () => {
      try {
        await addHabit(new FormData(form));
        form.reset();
        onComplete();
      } catch (error) {
        console.error("Failed to add habit:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Habit Name
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] placeholder-[#8B4513]/40 focus:border-[#8B4513]/20 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/20"
          placeholder="Enter habit name..."
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Frequency
        </label>
        <select
          id="frequency"
          name="frequency"
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] focus:border-[#8B4513]/20 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/20"
        >
          {frequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="target"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Target (times per frequency)
        </label>
        <input
          type="number"
          id="target"
          name="target"
          min="1"
          defaultValue="1"
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] focus:border-[#8B4513]/20 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Category (optional)
        </label>
        <input
          type="text"
          id="category"
          name="category"
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] placeholder-[#8B4513]/40 focus:border-[#8B4513]/20 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/20"
          placeholder="e.g., Health, Learning..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#8B4513]">
          Start Date
        </label>
        <div className="relative">
          <HabitDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date || new Date())}
            name="start_date"
          />
          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B4513]/40" />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#8B4513] px-4 py-2 text-sm text-white hover:bg-[#8B4513]/90 disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add Habit"}
        </button>
      </div>
    </form>
  );
}
