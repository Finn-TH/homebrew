"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { NutritionMeal } from "../types";
import AddMealButton from "./add-meal-button";
import NutritionDisplay from "./nutrition-display";

interface NutritionContentProps {
  initialMeals: NutritionMeal[];
}

export default function NutritionContent({
  initialMeals,
}: NutritionContentProps) {
  const [meals, setMeals] = useState<NutritionMeal[]>(initialMeals);
  const [viewType, setViewType] = useState<"daily" | "weekly">("daily");
  const router = useRouter();
  const supabase = createClient();

  const handleNewMeal = (meal: NutritionMeal) => {
    setMeals((prevMeals) => [...prevMeals, meal]);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
  };

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

        <AddMealButton onMealAdded={handleNewMeal} />
      </div>

      {/* Main Content */}
      <NutritionDisplay
        meals={meals}
        viewType={viewType}
        onDeleteMeal={handleDeleteMeal}
      />
    </div>
  );
}
