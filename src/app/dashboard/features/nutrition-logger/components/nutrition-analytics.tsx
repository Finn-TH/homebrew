"use client";

import { useState, useEffect } from "react";
import { getAnalytics } from "../actions/get-analytics";
import { format } from "date-fns";
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

// Define consistent colors for macronutrients
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

interface AnalyticsData {
  dailyTotals: {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
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

export default function NutritionAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const days = timeRange === "week" ? 7 : 30;
        const data = await getAnalytics(days);
        setAnalyticsData(data);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error("Analytics error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-[#8B4513]/60">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-red-600">
          {error || "Failed to load analytics"}
        </div>
      </div>
    );
  }

  const { dailyTotals, macroPercentages } = analyticsData;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            weight: "normal" as const,
          },
          padding: 16,
        },
      },
    },
  } as const;

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
              labels: dailyTotals
                .slice(-7)
                .map((day: any) => format(new Date(day.date), "MMM d")),
              datasets: [
                {
                  label: "Protein",
                  data: dailyTotals.slice(-7).map((day: any) => day.protein),
                  backgroundColor: macroColors.protein.main,
                },
                {
                  label: "Carbs",
                  data: dailyTotals.slice(-7).map((day: any) => day.carbs),
                  backgroundColor: macroColors.carbs.main,
                },
                {
                  label: "Fat",
                  data: dailyTotals.slice(-7).map((day: any) => day.fat),
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
                      macroPercentages.protein,
                      macroPercentages.carbs,
                      macroPercentages.fat,
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
            labels: dailyTotals.map((day: any) =>
              format(new Date(day.date), "MMM d")
            ),
            datasets: [
              {
                label: "Calories",
                data: dailyTotals.map((day: any) => day.calories),
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
            },
          }}
        />
      </div>
    </div>
  );
}
