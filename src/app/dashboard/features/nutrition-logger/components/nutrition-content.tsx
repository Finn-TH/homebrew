"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { NutritionMeal } from "../types";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import AddNutritionModal from "./add-nutrition-modal";
import NutritionDisplay from "./nutrition-display";
import useKeyboardShortcut from "../utils/use-keyboard-shortcut";

interface NutritionContentProps {
  initialMeals: NutritionMeal[];
}

export default function NutritionContent({
  initialMeals,
}: NutritionContentProps) {
  const [meals, setMeals] = useState<NutritionMeal[]>(initialMeals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewType, setViewType] = useState<"daily" | "weekly">("daily");
  const router = useRouter();
  const supabase = createClient();

  // Keyboard shortcut for adding new meal
  useKeyboardShortcut("n", () => setIsAddModalOpen(true), { ctrlKey: true });

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("nutrition_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nutrition_meals",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-white/80 rounded-lg p-1">
          <button
            onClick={() => setViewType("daily")}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewType === "daily"
                ? "bg-[#8B4513] text-white"
                : "text-[#8B4513] hover:bg-[#8B4513]/5"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewType("weekly")}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewType === "weekly"
                ? "bg-[#8B4513] text-white"
                : "text-[#8B4513] hover:bg-[#8B4513]/5"
            }`}
          >
            Weekly
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Meal
          <span className="text-xs opacity-75 ml-2">Ctrl+N</span>
        </button>
      </div>

      {/* Main Content */}
      <NutritionDisplay meals={meals} viewType={viewType} />

      {/* Add Meal Modal */}
      <AddNutritionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
