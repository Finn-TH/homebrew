"use client";

import { useState } from "react";
import { WorkoutLog } from "../types";
import { getUserLocalDate, getWeekDates } from "../utils/date";
import {
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Trophy,
  Calendar,
  Activity,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import WorkoutRow from "../client/workout-row";
import { motion, AnimatePresence } from "framer-motion";

interface WeeklyViewProps {
  workouts: WorkoutLog[];
}

export default function WeeklyView({ workouts }: WeeklyViewProps) {
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
    const isSameMonth = startDate.getMonth() === endDate.getMonth();
    const isSameYear = startDate.getFullYear() === endDate.getFullYear();

    if (isSameMonth && isSameYear) {
      return `${startDate.toLocaleDateString("en-US", {
        month: "long",
      })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else if (isSameYear) {
      return `${startDate.toLocaleDateString("en-US", {
        month: "short",
      })} ${startDate.getDate()} - ${endDate.toLocaleDateString("en-US", {
        month: "short",
      })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
      return `${startDate.toLocaleDateString("en-US", {
        month: "short",
      })} ${startDate.getDate()}, ${startDate.getFullYear()} - ${endDate.toLocaleDateString(
        "en-US",
        { month: "short" }
      )} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
  };

  // Filter workouts for current week
  const weekWorkouts = workouts.filter(
    (workout) => workout.date >= start && workout.date <= end
  );

  // Calculate statistics
  const totalWorkouts = weekWorkouts.length;
  const activeDays = new Set(weekWorkouts.map((w) => w.date)).size;
  const totalExercises = weekWorkouts.reduce(
    (sum, workout) => sum + workout.workout_log_exercises.length,
    0
  );

  // Calculate cardio statistics
  const cardioExercises = weekWorkouts.flatMap((w) =>
    w.workout_log_exercises.filter((e) => e.type === "cardio")
  );
  const totalCardioMinutes = cardioExercises.reduce(
    (sum, exercise) => sum + (exercise.duration || 0),
    0
  );
  const avgCardioPerDay = activeDays
    ? (totalCardioMinutes / activeDays).toFixed(0)
    : "0";

  // Generate week days
  const weekDays = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateStr = date.toLocaleDateString("en-CA");
    const dayWorkouts = weekWorkouts.filter((w) => w.date === dateStr);

    weekDays.push({
      date: dateStr,
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      workouts: dayWorkouts,
    });
  }

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
              <Dumbbell className="h-4 w-4" />
              Total Workouts
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {totalWorkouts}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Calendar className="h-4 w-4" />
              Active Days
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {activeDays}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Activity className="h-4 w-4" />
              Total Exercises
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {totalExercises}
            </div>
          </div>
          <div className="bg-[#8B4513]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
              <Timer className="h-4 w-4" />
              Avg. Cardio/Day
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              {avgCardioPerDay}
              <span className="text-sm ml-1">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isToday = day.date === today;
          const hasWorkouts = day.workouts.length > 0;

          // Calculate daily summary
          const exercises = day.workouts.flatMap(
            (w) => w.workout_log_exercises
          );
          const strengthCount = exercises.filter(
            (e) => e.type === "strength"
          ).length;
          const cardioMinutes = exercises
            .filter((e) => e.type === "cardio")
            .reduce((sum, e) => sum + (e.duration || 0), 0);

          return (
            <div key={day.date} className="relative">
              <div
                onClick={() =>
                  setExpandedDay(expandedDay === day.date ? null : day.date)
                }
                className={`
                  p-3 rounded-xl cursor-pointer transition-all
                  ${isToday ? "ring-2 ring-[#8B4513]" : ""}
                  ${hasWorkouts ? "bg-[#8B4513]/5" : "bg-white/80"}
                  hover:bg-[#8B4513]/10
                `}
              >
                <div className="text-sm font-medium text-[#8B4513]/60">
                  {day.name}
                </div>
                <div className="text-xl font-semibold text-[#8B4513]">
                  {day.number}
                </div>
                {hasWorkouts && (
                  <div className="mt-2 space-y-1">
                    {strengthCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-[#8B4513]/60">
                        <Dumbbell className="h-3 w-3" />
                        {strengthCount} exercises
                      </div>
                    )}
                    {cardioMinutes > 0 && (
                      <div className="flex items-center gap-1 text-xs text-[#8B4513]/60">
                        <Timer className="h-3 w-3" />
                        {cardioMinutes} min
                      </div>
                    )}
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
              ?.workouts.map((workout) => (
                <WorkoutRow key={workout.id} workout={workout} />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
