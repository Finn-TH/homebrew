"use client";

import { useState } from "react";
import { NutritionMeal } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Timer } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface NutritionRowProps {
  meal: NutritionMeal;
}

export default function NutritionRow({ meal }: NutritionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Calculate meal totals
  const mealTotals = meal.nutrition_food_items.reduce(
    (totals, item) => ({
      calories: totals.calories + item.calories,
      protein: totals.protein + item.protein,
      carbs: totals.carbs + item.carbs,
      fat: totals.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("nutrition_meals")
        .delete()
        .eq("id", meal.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white/80 rounded-lg overflow-hidden">
      {/* Meal Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-[#8B4513]/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-[#8B4513]">{meal.name}</h4>
            <div className="flex items-center gap-4 mt-1 text-sm text-[#8B4513]/60">
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {new Date(meal.created_at).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div>{meal.nutrition_food_items.length} items</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Macro Summary */}
            <div className="hidden sm:flex items-center gap-4 text-sm text-[#8B4513]/60">
              <div>{Math.round(mealTotals.calories)} cal</div>
              <div>{Math.round(mealTotals.protein)}g protein</div>
              <div>{Math.round(mealTotals.carbs)}g carbs</div>
              <div>{Math.round(mealTotals.fat)}g fat</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600" />
              </button>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#8B4513]/40" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#8B4513]/40" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Food Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-[#8B4513]/10"
          >
            <div className="p-4 space-y-2">
              {meal.nutrition_food_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <div className="font-medium text-[#8B4513]">
                      {item.name}
                    </div>
                    <div className="text-sm text-[#8B4513]/60">
                      {item.serving_size} {item.serving_unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#8B4513]/60">
                    <div>{item.calories} cal</div>
                    <div>{item.protein}g protein</div>
                    <div>{item.carbs}g carbs</div>
                    <div>{item.fat}g fat</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
