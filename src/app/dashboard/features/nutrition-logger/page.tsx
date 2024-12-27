import { createClient } from "@/utils/supabase/server";
import FeatureLayout from "../../components/layout/feature-layout";
import NutritionContent from "./components/nutrition-content";
import { getWeekDates } from "./utils/date";

export default async function NutritionLoggerPage() {
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

  return (
    <FeatureLayout user={user} title="Nutrition Logger">
      <NutritionContent initialMeals={nutritionMeals || []} />
    </FeatureLayout>
  );
}
