"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteMeal(mealId: string): Promise<boolean> {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) return false;

  // Delete associated food items first (they will be cascade deleted, but being explicit)
  const { error: foodError } = await supabase
    .from("nutrition_food_items")
    .delete()
    .eq("meal_id", mealId);

  if (foodError) {
    console.error("Error deleting food items:", foodError);
    return false;
  }

  // Delete the meal
  const { error: mealError } = await supabase
    .from("nutrition_meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", user.id); // Security: ensure user owns the meal

  if (mealError) {
    console.error("Error deleting meal:", mealError);
    return false;
  }

  revalidatePath("/dashboard/features/nutrition-logger");
  return true;
}
