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
import { Line, Bar, Pie } from "react-chartjs-2";
import { WorkoutLog } from "../types";
import { format, subDays } from "date-fns";
import { Activity, Dumbbell, Timer, TrendingUp } from "lucide-react";

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

interface WorkoutAnalyticsProps {
  workouts: WorkoutLog[];
}

export default function WorkoutAnalytics({ workouts }: WorkoutAnalyticsProps) {
  // Calculate analytics data
  const last30Days = [...Array(30)]
    .map((_, i) => {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      return {
        date,
        workouts: workouts.filter((w) => w.date === date).length,
        exercises: workouts
          .filter((w) => w.date === date)
          .reduce((sum, w) => sum + w.workout_log_exercises.length, 0),
      };
    })
    .reverse();

  // Exercise type distribution
  const exerciseTypes = workouts.reduce((acc, workout) => {
    workout.workout_log_exercises.forEach((exercise) => {
      acc[exercise.type] = (acc[exercise.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Most common exercises
  const exerciseFrequency = workouts.reduce((acc, workout) => {
    workout.workout_log_exercises.forEach((exercise) => {
      acc[exercise.name] = (acc[exercise.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topExercises = Object.entries(exerciseFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
            <Dumbbell className="h-5 w-5" />
            <h3 className="font-medium">Total Workouts</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {workouts.length}
          </p>
        </div>
        <div className="bg-white/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
            <Activity className="h-5 w-5" />
            <h3 className="font-medium">Total Exercises</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {workouts.reduce(
              (sum, w) => sum + w.workout_log_exercises.length,
              0
            )}
          </p>
        </div>
        <div className="bg-white/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
            <Timer className="h-5 w-5" />
            <h3 className="font-medium">Cardio Minutes</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {workouts.reduce(
              (sum, w) =>
                sum +
                w.workout_log_exercises
                  .filter((e) => e.type === "cardio")
                  .reduce((acc, e) => acc + (e.duration || 0), 0),
              0
            )}
          </p>
        </div>
        <div className="bg-white/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-medium">Avg. Exercises/Workout</h3>
          </div>
          <p className="text-2xl font-semibold text-[#8B4513]">
            {workouts.length
              ? Math.round(
                  workouts.reduce(
                    (sum, w) => sum + w.workout_log_exercises.length,
                    0
                  ) / workouts.length
                )
              : 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Activity Trend */}
        <div className="bg-white/80 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#8B4513] mb-6">
            Activity Trend
          </h3>
          <div className="h-[400px]">
            <Line
              data={{
                labels: last30Days.map((d) =>
                  format(new Date(d.date), "MMM d")
                ),
                datasets: [
                  {
                    label: "Workouts",
                    data: last30Days.map((d) => d.workouts),
                    borderColor: "#8B4513",
                    backgroundColor: "rgba(139, 69, 19, 0.1)",
                    tension: 0.3,
                    fill: true,
                  },
                  {
                    label: "Exercises",
                    data: last30Days.map((d) => d.exercises),
                    borderColor: "#6B8E23",
                    backgroundColor: "rgba(107, 142, 35, 0.1)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      padding: 10,
                    },
                    grid: {
                      color: "rgba(139, 69, 19, 0.1)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      padding: 10,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Exercise Type Distribution */}
        <div className="bg-white/80 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#8B4513] mb-6">
            Exercise Distribution
          </h3>
          <div className="h-[400px] flex items-center justify-center">
            <Pie
              data={{
                labels: Object.keys(exerciseTypes).map(
                  (type) => type.charAt(0).toUpperCase() + type.slice(1)
                ),
                datasets: [
                  {
                    data: Object.values(exerciseTypes),
                    backgroundColor: [
                      "rgba(139, 69, 19, 0.8)",
                      "rgba(107, 142, 35, 0.8)",
                    ],
                    borderColor: "white",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Exercises */}
        <div className="bg-white/80 rounded-xl p-6 col-span-full">
          <h3 className="text-lg font-medium text-[#8B4513] mb-6">
            Most Common Exercises
          </h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: topExercises.map(([name]) => name),
                datasets: [
                  {
                    data: topExercises.map(([, count]) => count),
                    backgroundColor: "rgba(139, 69, 19, 0.8)",
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      padding: 10,
                    },
                    grid: {
                      color: "rgba(139, 69, 19, 0.1)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      padding: 10,
                    },
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
