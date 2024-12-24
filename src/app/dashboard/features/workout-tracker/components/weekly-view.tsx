"use client";

import { useState, useEffect } from "react";
import { Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { startOfWeek, addDays, format } from "date-fns";

interface WeeklyWorkout {
  id: number;
  name: string;
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

export default function WeeklyView() {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<
    Record<string, WeeklyWorkout>
  >({});
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const savedWorkouts: WeeklyWorkout[] = JSON.parse(
      localStorage.getItem("workouts") || "[]"
    );
    const workoutsByDay: Record<string, WeeklyWorkout> = {};
    savedWorkouts.forEach((workout) => {
      workoutsByDay[workout.date.split("T")[0]] = workout;
    });
    setWeeklyWorkouts(workoutsByDay);
  }, []);

  const toggleExpand = (dateStr: string) => {
    setExpandedWorkout(expandedWorkout === dateStr ? null : dateStr);
  };

  const weekStart = getWeekStart();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      date,
      dateStr: formatDate(date),
      workout: weeklyWorkouts[formatDate(date)],
      isToday: formatDate(new Date()) === formatDate(date),
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
    };
  });

  return (
    <div className="space-y-2">
      {weekDays.map(
        ({ date, dateStr, workout, isToday, dayName, dayNumber }) => (
          <div key={dateStr} className="space-y-2">
            <div
              className={`
              flex items-center gap-6 p-4 rounded-lg border
              ${
                workout
                  ? "bg-[#8B4513]/5 border-[#8B4513]/20"
                  : "border-[#8B4513]/10"
              }
              ${isToday ? "border-[#8B4513]" : ""}
            `}
            >
              {/* Day Column */}
              <div className="w-16 flex flex-col">
                <span className="text-sm text-[#8B4513]/60">{dayName}</span>
                <span
                  className={`text-lg ${
                    isToday ? "text-[#8B4513] font-medium" : "text-[#8B4513]/80"
                  }`}
                >
                  {dayNumber}
                </span>
              </div>

              {/* Workout Info */}
              {workout ? (
                <button
                  onClick={() => toggleExpand(dateStr)}
                  className="flex-1 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-[#8B4513]" />
                      <span className="font-medium text-[#8B4513]">
                        {workout.name}
                      </span>
                    </div>
                    <span className="text-sm text-[#8B4513]/60">
                      {workout.exercises.length} exercises
                    </span>
                  </div>
                  {expandedWorkout === dateStr ? (
                    <ChevronUp className="h-4 w-4 text-[#8B4513]/60" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#8B4513]/60" />
                  )}
                </button>
              ) : (
                <span className="flex-1 text-[#8B4513]/40 italic">
                  Rest Day
                </span>
              )}
            </div>

            {/* Expanded Exercises */}
            {expandedWorkout === dateStr && workout && (
              <div className="space-y-2 pl-20">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#8B4513]/5 p-3 rounded-lg"
                  >
                    <span className="text-[#8B4513]">{exercise.name}</span>
                    <span className="text-[#8B4513]/60">
                      {exercise.sets} x {exercise.reps}
                      {exercise.weight && ` @ ${exercise.weight}lbs`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
