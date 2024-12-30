import { createClient } from "@/utils/supabase/server";
import { getWeekDates } from "../utils/date";
import NutritionLoggerClient from "../client/nutrition-logger-client";

export default async function NutritionLoggerServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { start: startDate, end: endDate } = getWeekDates();

  const { data: nutritionMeals, error } = await supabase
    .from("nutrition_meals")
    .select(
      `
      *,
      nutrition_food_items (*)
    `
    )
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching nutrition meals:", error);
  }

  return <NutritionLoggerClient initialMeals={nutritionMeals || []} />;
}
