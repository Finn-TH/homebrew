"use client";

import { useState } from "react";
import { NutritionMeal } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteMeal } from "../actions/delete-meal";

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
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteMeal(meal.id);
      if (success) {
        onDeleteMeal(meal.id);
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalNutrition = meal.nutrition_food_items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Space") {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#8B4513]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#8B4513]" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-[#8B4513]">{meal.name}</h3>
              <p className="text-sm text-[#8B4513]/60 flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {meal.meal_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-medium text-[#8B4513]">
                {totalNutrition.calories} cal
              </div>
              <div className="text-sm text-[#8B4513]/60">
                P:{Math.round(totalNutrition.protein)}g C:
                {Math.round(totalNutrition.carbs)}g F:
                {Math.round(totalNutrition.fat)}g
              </div>
            </div>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row expansion when clicking delete
                  }}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <Dialog.Title className="text-lg font-medium text-[#8B4513]">
                    Delete Meal
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-[#8B4513]/60">
                    Are you sure you want to delete this meal? This action
                    cannot be undone.
                  </Dialog.Description>
                  <div className="mt-6 flex justify-end gap-3">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {meal.nutrition_food_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-[#8B4513]/5 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-[#8B4513]">
                      {item.name}
                    </div>
                    <div className="text-sm text-[#8B4513]/60">
                      {item.serving_size} {item.serving_unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#8B4513]">
                      {item.calories} cal
                    </div>
                    <div className="text-sm text-[#8B4513]/60">
                      P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                    </div>
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
