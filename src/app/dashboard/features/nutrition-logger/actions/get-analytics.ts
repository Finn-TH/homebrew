"use server";

import { createClient } from "@/utils/supabase/server";
import { NutritionMeal, NutritionFoodItem } from "../types";
import { getUserLocalDate } from "../utils/date";
import { subDays, format } from "date-fns";

interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AnalyticsData {
  dailyTotals: DailyTotal[];
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  };
  todaysMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export async function getAnalytics(days: number = 7): Promise<AnalyticsData> {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Generate array of dates
  const dates = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(getUserLocalDate()), i);
    return format(date, "yyyy-MM-dd");
  }).reverse();

  // Fetch meals for the date range
  const { data: meals, error } = await supabase
    .from("nutrition_meals")
    .select(`*, nutrition_food_items(*)`)
    .eq("user_id", user.id)
    .gte("date", dates[0])
    .lte("date", dates[dates.length - 1])
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }

  // Initialize daily totals with zeros for all dates
  const dailyTotals = dates.map((date) => ({
    date,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  }));

  // Calculate daily totals
  (meals || []).forEach((meal: NutritionMeal) => {
    const dayIndex = dailyTotals.findIndex((day) => day.date === meal.date);
    if (dayIndex !== -1) {
      meal.nutrition_food_items.forEach((item: NutritionFoodItem) => {
        dailyTotals[dayIndex].calories += item.calories;
        dailyTotals[dayIndex].protein += item.protein;
        dailyTotals[dayIndex].carbs += item.carbs;
        dailyTotals[dayIndex].fat += item.fat;
      });
    }
  });

  // Calculate today's macros
  const today = getUserLocalDate();
  const todaysMeals = (meals || []).filter((meal) => meal.date === today);
  const todaysMacros = todaysMeals.reduce(
    (totals, meal) => {
      meal.nutrition_food_items.forEach((item: NutritionFoodItem) => {
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      });
      return totals;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate macro percentages
  const totalGrams =
    todaysMacros.protein + todaysMacros.carbs + todaysMacros.fat;
  const macroPercentages = {
    protein: totalGrams
      ? Math.round((todaysMacros.protein / totalGrams) * 100)
      : 0,
    carbs: totalGrams ? Math.round((todaysMacros.carbs / totalGrams) * 100) : 0,
    fat: totalGrams ? Math.round((todaysMacros.fat / totalGrams) * 100) : 0,
  };

  // Round all numbers in daily totals
  dailyTotals.forEach((day) => {
    day.calories = Math.round(day.calories);
    day.protein = Math.round(day.protein);
    day.carbs = Math.round(day.carbs);
    day.fat = Math.round(day.fat);
  });

  return {
    dailyTotals,
    macroPercentages,
    todaysMacros: {
      protein: Math.round(todaysMacros.protein),
      carbs: Math.round(todaysMacros.carbs),
      fat: Math.round(todaysMacros.fat),
    },
  };
}
