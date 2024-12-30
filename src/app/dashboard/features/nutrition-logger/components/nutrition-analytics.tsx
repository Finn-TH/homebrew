"use client";

import { NutritionMeal } from "../types";
import { getUserLocalDate } from "../utils/date";
import { subDays, format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface NutritionAnalyticsProps {
  meals: NutritionMeal[];
}

export default function NutritionAnalytics({ meals }: NutritionAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  // Get dates for either last 7 or 30 days based on selection
  const getDates = () => {
    const days = timeRange === "week" ? 7 : 30;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(getUserLocalDate()), i);
      return format(date, "yyyy-MM-dd");
    }).reverse();
  };

  const dates = getDates();
  const dailyTotals = dates.map((date) => {
    return meals
      .filter((meal) => meal.date === date)
      .reduce(
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
  });

  // Calculate macronutrient totals for today
  const todaysMacros = meals
    .filter((meal) => meal.date === getUserLocalDate())
    .reduce(
      (totals, meal) => {
        meal.nutrition_food_items.forEach((item) => {
          totals.protein += item.protein;
          totals.carbs += item.carbs;
          totals.fat += item.fat;
        });
        return totals;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

  // Calculate total grams and percentages
  const totalGrams =
    todaysMacros.protein + todaysMacros.carbs + todaysMacros.fat;
  const macroPercentages = {
    protein: totalGrams
      ? Math.round((todaysMacros.protein / totalGrams) * 100)
      : 0,
    carbs: totalGrams ? Math.round((todaysMacros.carbs / totalGrams) * 100) : 0,
    fat: totalGrams ? Math.round((todaysMacros.fat / totalGrams) * 100) : 0,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Define consistent colors for macronutrients using a triadic color harmony
  const macroColors = {
    protein: {
      main: "rgba(183, 156, 237, 0.8)", // Muted purple/periwinkle
      border: "rgba(183, 156, 237, 1)",
    },
    carbs: {
      main: "rgba(237, 191, 156, 0.8)", // Warm apricot
      border: "rgba(237, 191, 156, 1)",
    },
    fat: {
      main: "rgba(156, 237, 183, 0.8)", // Soft sage
      border: "rgba(156, 237, 183, 1)",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Macronutrient Trends */}
        <div className="bg-white/80 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-4">
            Macronutrient Trends
          </h3>
          <Bar
            data={{
              labels: dates
                .slice(-7)
                .map((date) => format(new Date(date), "MMM d")),
              datasets: [
                {
                  label: "Protein",
                  data: dailyTotals.slice(-7).map((day) => day.protein),
                  backgroundColor: macroColors.protein.main,
                },
                {
                  label: "Carbs",
                  data: dailyTotals.slice(-7).map((day) => day.carbs),
                  backgroundColor: macroColors.carbs.main,
                },
                {
                  label: "Fat",
                  data: dailyTotals.slice(-7).map((day) => day.fat),
                  backgroundColor: macroColors.fat.main,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        {/* Macronutrient Distribution */}
        <div className="bg-white/80 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-4">
            Today's Macronutrient Distribution
          </h3>
          <div className="max-w-[300px] mx-auto">
            <Pie
              data={{
                labels: [
                  `Protein (${macroPercentages.protein}%)`,
                  `Carbs (${macroPercentages.carbs}%)`,
                  `Fat (${macroPercentages.fat}%)`,
                ],
                datasets: [
                  {
                    data: [
                      todaysMacros.protein,
                      todaysMacros.carbs,
                      todaysMacros.fat,
                    ],
                    backgroundColor: [
                      macroColors.protein.main,
                      macroColors.carbs.main,
                      macroColors.fat.main,
                    ],
                    borderColor: [
                      macroColors.protein.border,
                      macroColors.carbs.border,
                      macroColors.fat.border,
                    ],
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = context.raw as number;
                        return `${label}: ${Math.round(value)}g`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-[#8B4513]/60">Protein</div>
              <div
                className="font-semibold"
                style={{ color: macroColors.protein.border }}
              >
                {Math.round(todaysMacros.protein)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-[#8B4513]/60">Carbs</div>
              <div
                className="font-semibold"
                style={{ color: macroColors.carbs.border }}
              >
                {Math.round(todaysMacros.carbs)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-[#8B4513]/60">Fat</div>
              <div
                className="font-semibold"
                style={{ color: macroColors.fat.border }}
              >
                {Math.round(todaysMacros.fat)}g
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Trends */}
      <div className="bg-white/80 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#8B4513]">
            {timeRange === "week" ? "7-Day" : "30-Day"} Nutrition Trends
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeRange === "week"
                  ? "bg-[#8B4513] text-white"
                  : "text-[#8B4513] hover:bg-[#8B4513]/5"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                timeRange === "month"
                  ? "bg-[#8B4513] text-white"
                  : "text-[#8B4513] hover:bg-[#8B4513]/5"
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <Line
          data={{
            labels: dates.map((date) => format(new Date(date), "MMM d")),
            datasets: [
              {
                label: "Calories",
                data: dailyTotals.map((day) => day.calories),
                borderColor: "#8B4513",
                backgroundColor: "rgba(139, 69, 19, 0.1)",
                tension: 0.3,
                fill: true,
              },
            ],
          }}
          options={{
            ...chartOptions,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(139, 69, 19, 0.1)",
                },
                ticks: {
                  color: "#8B4513",
                  font: {
                    size: 14,
                    weight: "normal",
                  },
                  padding: 8,
                },
              },
              x: {
                grid: {
                  color: "rgba(139, 69, 19, 0.1)",
                },
                ticks: {
                  color: "#8B4513",
                  font: {
                    size: 14,
                    weight: "normal",
                  },
                  maxRotation: 45,
                  minRotation: 45,
                  padding: 8,
                },
              },
            },
            plugins: {
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#8B4513",
                bodyColor: "#8B4513",
                titleFont: {
                  size: 16,
                  weight: "bold",
                },
                bodyFont: {
                  size: 14,
                  weight: "normal",
                },
                padding: 12,
                borderColor: "#8B4513",
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                  label: (context) => `${context.parsed.y} calories`,
                },
              },
              legend: {
                labels: {
                  font: {
                    size: 14,
                    weight: "normal",
                  },
                  padding: 16,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
