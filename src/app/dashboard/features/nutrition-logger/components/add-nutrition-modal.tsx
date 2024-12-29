"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUserLocalDate } from "../utils/date";
import FoodSearch from "./food-search";
import { Minus, Plus, Trash2 } from "lucide-react";

interface AddNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedFood {
  id: string;
  name: string;
  servingSize: number;
  baseServingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function AddNutritionModal({
  isOpen,
  onClose,
}: AddNutritionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  const router = useRouter();
  const supabase = createClient();

  const handleFoodSelect = (food: any) => {
    setSelectedFoods([
      ...selectedFoods,
      {
        id: food.id,
        name: food.name,
        servingSize: food.serving_size,
        baseServingSize: food.serving_size,
        servingUnit: food.serving_unit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      },
    ]);
  };

  const updateServingSize = (index: number, increase: boolean) => {
    const newFoods = [...selectedFoods];
    const food = newFoods[index];
    const multiplier = increase ? 0.5 : -0.5; // Adjust by 0.5 servings

    // Don't allow less than 0.5 servings
    if (!increase && food.servingSize <= food.baseServingSize * 0.5) return;

    food.servingSize = food.servingSize + food.baseServingSize * multiplier;

    // Update nutrition values based on new serving size
    const ratio = food.servingSize / food.baseServingSize;
    food.calories = Math.round(food.calories * ratio);
    food.protein = Number((food.protein * ratio).toFixed(1));
    food.carbs = Number((food.carbs * ratio).toFixed(1));
    food.fat = Number((food.fat * ratio).toFixed(1));

    setSelectedFoods(newFoods);
  };

  const removeFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!mealName || selectedFoods.length === 0) return;

    setIsSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      setIsSubmitting(false);
      return;
    }

    // Create meal
    const { data: meal, error: mealError } = await supabase
      .from("nutrition_meals")
      .insert({
        user_id: user.id,
        name: mealName,
        date: getUserLocalDate(),
        meal_type: mealType,
      })
      .select()
      .single();

    if (mealError || !meal) {
      console.error("Error creating meal:", mealError);
      setIsSubmitting(false);
      return;
    }

    // Add food items
    const { error: foodError } = await supabase
      .from("nutrition_food_items")
      .insert(
        selectedFoods.map((food) => ({
          meal_id: meal.id,
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          serving_size: food.servingSize,
          serving_unit: food.servingUnit,
        }))
      );

    if (foodError) {
      console.error("Error adding food items:", foodError);
    }

    setIsSubmitting(false);
    onClose();
    router.refresh();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Content className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-2xl font-semibold text-[#8B4513]">
                  Add Meal
                </Dialog.Title>
                <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              <div className="space-y-6">
                {/* Meal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#8B4513]">
                      Meal Name
                    </label>
                    <input
                      type="text"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      placeholder="Enter meal name"
                      className="w-full mt-1 rounded-lg border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#8B4513]">
                      Meal Type
                    </label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as any)}
                      className="w-full mt-1 rounded-lg border px-3 py-2"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>

                {/* Food Search */}
                <div>
                  <label className="text-sm font-medium text-[#8B4513]">
                    Add Foods
                  </label>
                  <FoodSearch onSelect={handleFoodSelect} />
                </div>

                {/* Selected Foods */}
                {selectedFoods.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[#8B4513]">
                      Selected Foods
                    </label>
                    {selectedFoods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#8B4513]/5 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-[#8B4513]/60">
                            {food.calories} cal | P: {food.protein}g C:{" "}
                            {food.carbs}g F: {food.fat}g
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateServingSize(index, false)}
                              className="p-1 hover:bg-[#8B4513]/10 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span>
                              {food.servingSize} {food.servingUnit}
                            </span>
                            <button
                              onClick={() => updateServingSize(index, true)}
                              className="p-1 hover:bg-[#8B4513]/10 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFood(index)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || !mealName || selectedFoods.length === 0
                  }
                  className="w-full py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Meal"}
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
