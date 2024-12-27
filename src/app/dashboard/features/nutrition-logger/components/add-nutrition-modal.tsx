"use client";

import { useState, Fragment } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Plus, Minus, Loader2, X } from "lucide-react";
import { getUserLocalDate } from "../utils/date";

interface AddNutritionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: number;
  serving_unit: string;
}

export default function AddNutritionModal({
  open,
  onOpenChange,
}: AddNutritionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      serving_size: 0,
      serving_unit: "g",
    },
  ]);

  const router = useRouter();
  const supabase = createClient();

  const handleAddFoodItem = () => {
    setFoodItems([
      ...foodItems,
      {
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving_size: 0,
        serving_unit: "g",
      },
    ]);
  };

  const handleRemoveFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const handleFoodItemChange = (
    index: number,
    field: keyof FoodItem,
    value: string | number
  ) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index] = {
      ...newFoodItems[index],
      [field]:
        field === "name" || field === "serving_unit" ? value : Number(value),
    };
    setFoodItems(newFoodItems);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Insert meal
      const { data: meal, error: mealError } = await supabase
        .from("nutrition_meals")
        .insert({
          name: mealName,
          meal_type: mealType,
          date: getUserLocalDate(),
        })
        .select()
        .single();

      if (mealError) throw mealError;

      // Insert food items
      const { error: foodError } = await supabase
        .from("nutrition_food_items")
        .insert(
          foodItems.map((item) => ({
            ...item,
            meal_id: meal.id,
          }))
        );

      if (foodError) throw foodError;

      router.refresh();
      onOpenChange(false);

      // Reset form
      setMealName("");
      setMealType("breakfast");
      setFoodItems([
        {
          name: "",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          serving_size: 0,
          serving_unit: "g",
        },
      ]);
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => onOpenChange(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold text-[#8B4513]">
                  Add Meal
                </Dialog.Title>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg p-1 hover:bg-[#8B4513]/5"
                >
                  <X className="h-5 w-5 text-[#8B4513]/60" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Meal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#8B4513]">
                      Meal Name
                    </label>
                    <input
                      type="text"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      placeholder="Enter meal name"
                      className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#8B4513]">
                      Meal Type
                    </label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as any)}
                      className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>

                {/* Food Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-[#8B4513]">
                      Food Items
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFoodItem}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg border border-[#8B4513]/20 hover:bg-[#8B4513]/5"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </button>
                  </div>

                  {foodItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 gap-2 items-start"
                    >
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleFoodItemChange(index, "name", e.target.value)
                          }
                          placeholder="Food name"
                          className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.calories}
                          onChange={(e) =>
                            handleFoodItemChange(
                              index,
                              "calories",
                              e.target.value
                            )
                          }
                          placeholder="Calories"
                          className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.protein}
                          onChange={(e) =>
                            handleFoodItemChange(
                              index,
                              "protein",
                              e.target.value
                            )
                          }
                          placeholder="Protein"
                          className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.carbs}
                          onChange={(e) =>
                            handleFoodItemChange(index, "carbs", e.target.value)
                          }
                          placeholder="Carbs"
                          className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.fat}
                          onChange={(e) =>
                            handleFoodItemChange(index, "fat", e.target.value)
                          }
                          placeholder="Fat"
                          className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {foodItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFoodItem(index)}
                            className="p-2 rounded-lg hover:bg-[#8B4513]/5"
                          >
                            <Minus className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !mealName ||
                      foodItems.some((item) => !item.name)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B4513] text-white hover:bg-[#8B4513]/90 disabled:bg-[#8B4513]/50"
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Add Meal
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
