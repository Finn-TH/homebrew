"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AddNutritionModal from "./add-nutrition-modal";
import useKeyboardShortcut from "../utils/use-keyboard-shortcut";
import { NutritionMeal } from "../types";

interface AddMealButtonProps {
  onMealAdded: (meal: NutritionMeal) => void;
}

export default function AddMealButton({ onMealAdded }: AddMealButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useKeyboardShortcut("n", () => setIsModalOpen(true), { ctrlKey: true });

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-lg 
                 bg-[#8B4513] text-white hover:bg-[#8B4513]/90 
                 transition-colors shadow-sm"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Add Meal</span>
        <kbd
          className="hidden group-hover:inline-flex items-center gap-1 px-2 py-0.5 
                     text-xs text-[#8B4513] bg-white/90 rounded-md ml-2"
        >
          Ctrl+N
        </kbd>
      </button>

      <AddNutritionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMealAdded={onMealAdded}
      />
    </>
  );
}
