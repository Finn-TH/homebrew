"use client";

import { useState } from "react";
import { NutritionMeal } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Timer } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

interface NutritionRowProps {
  meal: NutritionMeal;
  onDeleteMeal: (mealId: string) => void;
}

export default function NutritionRow({
  meal,
  onDeleteMeal,
}: NutritionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
      // Delete food items first
      const { error: foodError } = await supabase
        .from("nutrition_food_items")
        .delete()
        .eq("meal_id", meal.id);

      if (foodError) throw foodError;

      // Then delete the meal
      const { error: mealError } = await supabase
        .from("nutrition_meals")
        .delete()
        .eq("id", meal.id);

      if (mealError) throw mealError;

      onDeleteMeal(meal.id);
      setDeleteOpen(false);
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
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                className="p-1.5 rounded-md hover:bg-red-50 group"
              >
                <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600" />
              </button>
              <div className="cursor-pointer">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-[#8B4513]/40" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#8B4513]/40" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[90vw] max-w-md">
            <Dialog.Title className="text-lg font-semibold text-[#8B4513] mb-2">
              Delete Meal
            </Dialog.Title>
            <Dialog.Description className="text-[#8B4513]/60 mb-4">
              Are you sure you want to delete this meal? This action cannot be
              undone.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 rounded-lg text-[#8B4513]/60 hover:text-[#8B4513] hover:bg-[#8B4513]/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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
