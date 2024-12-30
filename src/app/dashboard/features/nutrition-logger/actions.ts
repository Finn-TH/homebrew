"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NutritionMeal } from "./types";
import { getUserLocalDate } from "./utils/date";

export async function addMeal(
  name: string,
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  selectedFoods: any[]
): Promise<NutritionMeal | null> {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) return null;

  // Create meal
  const { data: meal, error: mealError } = await supabase
    .from("nutrition_meals")
    .insert({
      user_id: user.id,
      name: name,
      date: getUserLocalDate(),
      meal_type: mealType,
    })
    .select()
    .single();

  if (mealError || !meal) return null;

  // Add food items
  const { data: foodItems, error: foodError } = await supabase
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
    )
    .select();

  if (foodError) return null;

  revalidatePath("/dashboard/features/nutrition-logger");

  return {
    ...meal,
    nutrition_food_items: foodItems,
  };
}
