"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AddNutritionModal from "./add-nutrition-modal";
import useKeyboardShortcut from "../utils/use-keyboard-shortcut";

export default function AddMealButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useKeyboardShortcut("n", () => setIsModalOpen(true), { ctrlKey: true });

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white 
                 rounded-lg hover:bg-[#8B4513]/90 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Add Meal</span>
        <span className="hidden group-hover:inline text-xs opacity-75 ml-2">
          Ctrl+N
        </span>
      </button>

      <AddNutritionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
