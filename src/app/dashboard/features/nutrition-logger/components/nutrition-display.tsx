"use client";

import { NutritionMeal } from "../types";
import { getUserLocalDate } from "../utils/date";
import DailyView from "./daily-view";
import WeeklyView from "./weekly-view";
import NutritionAnalytics from "./nutrition-analytics";
import { motion, AnimatePresence } from "framer-motion";

interface NutritionDisplayProps {
  meals: NutritionMeal[];
  viewType: "daily" | "weekly" | "analytics";
  onDeleteMeal: (mealId: string) => void;
}

export default function NutritionDisplay({
  meals,
  viewType,
  onDeleteMeal,
}: NutritionDisplayProps) {
  const today = getUserLocalDate();
  const dailyMeals = meals.filter((meal) => meal.date === today);

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

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: 20,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {viewType === "weekly" && (
        <motion.div
          key="weekly"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.2 }}
        >
          <WeeklyView meals={meals} onDeleteMeal={onDeleteMeal} />
        </motion.div>
      )}
      {viewType === "analytics" && (
        <motion.div
          key="analytics"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.2 }}
        >
          <NutritionAnalytics />
        </motion.div>
      )}
      {viewType === "daily" && (
        <motion.div
          key="daily"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.2 }}
        >
          <DailyView
            meals={sortByMealType(dailyMeals)}
            nutritionTotals={calculateDailyTotals(dailyMeals)}
            onDeleteMeal={onDeleteMeal}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
