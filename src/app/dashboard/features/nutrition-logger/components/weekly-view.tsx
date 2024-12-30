"use client";

import { useState } from "react";
import { NutritionMeal } from "../types";
import { getUserLocalDate, getWeekDates } from "../utils/date";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Activity,
  Timer,
} from "lucide-react";
import NutritionRow from "./nutrition-row";

interface WeeklyViewProps {
  meals: NutritionMeal[];
  onDeleteMeal: (mealId: string) => void;
}

export default function WeeklyView({ meals, onDeleteMeal }: WeeklyViewProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const today = getUserLocalDate();

  // Get dates for the selected week
  const getOffsetWeekDates = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset * 7);
    return getWeekDates(date);
  };

  const { start, end } = getOffsetWeekDates(weekOffset);

  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
    })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  };

  // Generate week days with their meals
  const weekDays = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toLocaleDateString("en-CA");
    const dayMeals = meals.filter((meal) => meal.date === dateStr);

    // Calculate daily totals
    const dailyTotals = dayMeals.reduce(
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

    weekDays.push({
      date: dateStr,
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
      meals: dayMeals,
      totals: dailyTotals,
    });
  }

  // Calculate week totals
  const weekTotals = weekDays.reduce(
    (totals, day) => ({
      calories: totals.calories + day.totals.calories,
      protein: totals.protein + day.totals.protein,
      carbs: totals.carbs + day.totals.carbs,
      fat: totals.fat + day.totals.fat,
      mealCount: totals.mealCount + day.meals.length,
      activeDays: totals.activeDays + (day.meals.length > 0 ? 1 : 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0, activeDays: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5 text-[#8B4513]" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#8B4513]" />
          <h2 className="text-lg font-medium text-[#8B4513]">
            {formatDateRange(start, end)}
          </h2>
        </div>

        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5 text-[#8B4513]" />
        </button>
      </div>

      {/* Week Summary */}
      <div className="bg-white/80 rounded-xl p-4">
        <h3 className="text-lg font-medium text-[#8B4513] mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Week Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Utensils className="h-4 w-4" />
              Total Meals
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {weekTotals.mealCount}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Activity className="h-4 w-4" />
              Avg. Calories/Day
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(weekTotals.calories / 7)}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Calendar className="h-4 w-4" />
              Active Days
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {weekTotals.activeDays}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Timer className="h-4 w-4" />
              Avg. Protein/Day
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {Math.round(weekTotals.protein / 7)}g
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isToday = day.date === today;
          const hasMeals = day.meals.length > 0;

          return (
            <div key={day.date} className="relative">
              <div
                onClick={() =>
                  setExpandedDay(expandedDay === day.date ? null : day.date)
                }
                className={`
                  p-3 rounded-xl cursor-pointer transition-all
                  ${isToday ? "ring-2 ring-[#8B4513]" : ""}
                  ${hasMeals ? "bg-[#8B4513]/5" : "bg-white/80"}
                  hover:bg-[#8B4513]/10
                `}
              >
                <div className="text-sm font-medium text-[#8B4513]/60">
                  {day.name}
                </div>
                <div className="text-xl font-semibold text-[#8B4513]">
                  {day.number}
                </div>
                {hasMeals && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1 text-xs text-[#8B4513]/60">
                      <Utensils className="h-3 w-3" />
                      {day.meals.length} meals
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8B4513]/60">
                      <Activity className="h-3 w-3" />
                      {Math.round(day.totals.calories)} cal
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Day View */}
      <AnimatePresence>
        {expandedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/80 rounded-xl"
          >
            {weekDays
              .find((day) => day.date === expandedDay)
              ?.meals.map((meal) => (
                <NutritionRow
                  key={meal.id}
                  meal={meal}
                  onDeleteMeal={onDeleteMeal}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
