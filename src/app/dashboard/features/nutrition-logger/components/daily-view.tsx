"use client";

import { NutritionMeal } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Sun, Moon } from "lucide-react";
import NutritionRow from "./nutrition-row";

interface DailyViewProps {
  meals: NutritionMeal[];
  nutritionTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onDeleteMeal: (mealId: string) => void;
}

export default function DailyView({
  meals,
  nutritionTotals,
  onDeleteMeal,
}: DailyViewProps) {
  const mealTypes = [
    { type: "breakfast", icon: Coffee, label: "Breakfast" },
    { type: "lunch", icon: Sun, label: "Lunch" },
    { type: "dinner", icon: Moon, label: "Dinner" },
    { type: "snack", icon: Utensils, label: "Snacks" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="bg-white/80 rounded-xl p-4">
        <h3 className="text-lg font-medium text-[#8B4513] mb-4">
          Daily Nutrition
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="text-sm text-[#8B4513]/60 mb-1">Calories</div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(nutritionTotals.calories)}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="text-sm text-[#8B4513]/60 mb-1">Protein</div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(nutritionTotals.protein)}g
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="text-sm text-[#8B4513]/60 mb-1">Carbs</div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(nutritionTotals.carbs)}g
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="text-sm text-[#8B4513]/60 mb-1">Fat</div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(nutritionTotals.fat)}g
            </div>
          </div>
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-4">
        {mealTypes.map(({ type, icon: Icon, label }) => {
          const mealsByType = meals.filter((meal) => meal.meal_type === type);

          return (
            <div key={type} className="bg-white/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-[#8B4513]" />
                <h3 className="text-lg font-medium text-[#8B4513]">{label}</h3>
              </div>

              <AnimatePresence>
                {mealsByType.length > 0 ? (
                  <div className="space-y-2">
                    {mealsByType.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NutritionRow meal={meal} onDeleteMeal={onDeleteMeal} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-[#8B4513]/40"
                  >
                    No {label.toLowerCase()} logged today
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
