"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Habit, HabitRecord } from "../types";
import { motion } from "framer-motion";
import { Target, Trophy, Calendar, TrendingUp, Flame } from "lucide-react";

// Register ChartJS components
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

interface HabitAnalyticsProps {
  habits: Habit[];
  records: HabitRecord[];
}

export default function HabitAnalytics({
  habits,
  records,
}: HabitAnalyticsProps) {
  // Calculate overall statistics
  const calculateStats = () => {
    const totalHabits = habits.length;
    const activeHabits = habits.filter((h) => h.current_streak > 0).length;
    const totalCompletions = habits.reduce(
      (sum, h) => sum + h.total_completions,
      0
    );
    const bestStreak = Math.max(...habits.map((h) => h.longest_streak));

    return { totalHabits, activeHabits, totalCompletions, bestStreak };
  };

  // Calculate category distribution
  const getCategoryData = () => {
    const categories = habits.reduce((acc, habit) => {
      const category = habit.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(categories),
      data: Object.values(categories),
    };
  };

  // Calculate completion trends (last 7 days)
  const getCompletionTrends = () => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    const dailyCompletions = last7Days.map((date) => {
      return {
        date,
        completed: records.filter(
          (r) => r.date === date && r.status === "completed"
        ).length,
        total: habits.length,
      };
    });

    return dailyCompletions;
  };

  const stats = calculateStats();
  const categoryData = getCategoryData();
  const trendData = getCompletionTrends();

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-[#8B4513]" />
            <h3 className="text-sm font-medium text-[#8B4513]">Total Habits</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {stats.totalHabits}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h3 className="text-sm font-medium text-[#8B4513]">
              Active Habits
            </h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {stats.activeHabits}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-sm font-medium text-[#8B4513]">Best Streak</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {stats.bestStreak} days
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-medium text-[#8B4513]">
              Total Completions
            </h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {stats.totalCompletions}
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white/80 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#8B4513] mb-4">
            Habit Categories
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: categoryData.labels,
                datasets: [
                  {
                    data: categoryData.data,
                    backgroundColor: [
                      "rgba(139, 69, 19, 0.8)",
                      "rgba(245, 158, 11, 0.8)",
                      "rgba(16, 185, 129, 0.8)",
                      "rgba(59, 130, 246, 0.8)",
                      "rgba(139, 92, 246, 0.8)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Completion Trends */}
        <div className="bg-white/80 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#8B4513] mb-4">
            Weekly Completion Rate
          </h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: trendData.map((d) =>
                  new Date(d.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })
                ),
                datasets: [
                  {
                    label: "Completion Rate",
                    data: trendData.map((d) => (d.completed / d.total) * 100),
                    borderColor: "#8B4513",
                    backgroundColor: "rgba(139, 69, 19, 0.1)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
