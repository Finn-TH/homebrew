"use client";

import { useState, useEffect } from "react";
import { Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { startOfWeek, addDays, format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { WorkoutLog } from "../types";

export default function WeeklyView() {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<
    Record<string, WorkoutLog>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the dates for this week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    const fetchWeeklyWorkouts = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        const startDate = format(weekStart, "yyyy-MM-dd");
        const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");

        const { data, error } = await supabase
          .from("workout_logs")
          .select(
            `
            *,
            workout_log_exercises (*)
          `
          )
          .gte("date", startDate)
          .lte("date", endDate);

        if (error) throw error;

        // Convert array to record keyed by date
        const workoutsByDay: Record<string, WorkoutLog> = {};
        data?.forEach((workout) => {
          workoutsByDay[workout.date] = workout;
        });

        setWeeklyWorkouts(workoutsByDay);
      } catch (err) {
        console.error("Error fetching weekly workouts:", err);
        setError("Failed to load weekly workouts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyWorkouts();
  }, [weekStart]);

  if (isLoading) {
    return (
      <div className="text-[#8B4513]/60 text-center py-8">
        Loading weekly workouts...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const workout = weeklyWorkouts[dateStr];
        const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

        return (
          <div
            key={dateStr}
            className={`p-4 rounded-xl ${
              isToday
                ? "bg-[#8B4513]/10 border-2 border-[#8B4513]"
                : "bg-white/80"
            }`}
          >
            <div className="text-sm font-medium text-[#8B4513]">
              {format(date, "EEE")}
            </div>
            <div className="text-lg font-bold text-[#8B4513]">
              {format(date, "d")}
            </div>
            {workout ? (
              <div className="mt-2">
                <div className="text-sm font-medium text-[#8B4513]">
                  {workout.name}
                </div>
                <div className="text-xs text-[#8B4513]/60">
                  {workout.workout_log_exercises.length} exercises
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-[#8B4513]/40">No workout</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
