"use client";

import { useTransition } from "react";
import { addHabit } from "../actions";

interface HabitFormProps {
  onComplete: () => void;
}

export default function HabitForm({ onComplete }: HabitFormProps) {
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#8B4513] px-4 py-2 text-white hover:bg-[#8B4513]/90 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
}
