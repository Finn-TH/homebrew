"use client";

import { useState, useTransition } from "react";
import { updateHabit, deleteHabit } from "../actions";
import { Habit } from "../types";

interface EditHabitFormProps {
  habit: Habit;
  onComplete: () => void;
}

export default function EditHabitForm({
  habit,
  onComplete,
}: EditHabitFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(habit.title);
  const [category, setCategory] = useState(habit.category);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateHabit(habit.id, { title, category });
        onComplete();
      } catch (error) {
        console.error("Failed to update habit:", error);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    startTransition(async () => {
      try {
        await deleteHabit(habit.id);
        onComplete();
      } catch (error) {
        console.error("Failed to delete habit:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Habit Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513]"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513]"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-[#8B4513] px-4 py-2 text-white hover:bg-[#8B4513]/90"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
