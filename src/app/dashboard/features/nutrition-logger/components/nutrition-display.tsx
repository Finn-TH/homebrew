"use client";

import { NutritionMeal } from "../types";
import { getUserLocalDate } from "../utils/date";
import DailyView from "./daily-view";
import WeeklyView from "./weekly-view";

interface NutritionDisplayProps {
  meals: NutritionMeal[];
  viewType: "daily" | "weekly";
}

export default function NutritionDisplay({
  meals,
  viewType,
}: NutritionDisplayProps) {
  const today = getUserLocalDate();

  // Filter meals for daily view
  const dailyMeals = meals.filter((meal) => meal.date === today);

  // Sort meals by meal type for better organization
  const sortByMealType = (meals: NutritionMeal[]) => {
    const mealTypeOrder = {
      breakfast: 0,
      lunch: 1,
      dinner: 2,
      snack: 3,
    };

    return [...meals].sort(
      (a, b) => mealTypeOrder[a.meal_type] - mealTypeOrder[b.meal_type]
    );
  };

  // Calculate daily nutrition totals
  const calculateDailyTotals = (meals: NutritionMeal[]) => {
    return meals.reduce(
      (totals, meal) => {
        meal.nutrition_food_items.forEach((item) => {
          totals.calories += item.calories;
          totals.protein += item.protein;
          totals.carbs += item.carbs;
          totals.fat += item.fat;
        });
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  if (viewType === "weekly") {
    return <WeeklyView meals={meals} />;
  }

  return (
    <DailyView
      meals={sortByMealType(dailyMeals)}
      nutritionTotals={calculateDailyTotals(dailyMeals)}
    />
  );
}
