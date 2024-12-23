"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AddHabitModal from "./add-habit-modal";

export default function AddHabitButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[#8B4513] px-4 py-2 text-white hover:bg-[#8B4513]/90 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Add Habit
      </button>

      <AddHabitModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
