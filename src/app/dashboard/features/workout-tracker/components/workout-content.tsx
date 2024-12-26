"use client";

import { useState } from "react";
import AddWorkoutButton from "../add-workout/add-workout-button";
import WorkoutsDisplay from "./workouts-display";
import WeeklyView from "./weekly-view";
import { WorkoutLog } from "../types";

interface WorkoutContentProps {
  initialWorkouts: WorkoutLog[];
}

export default function WorkoutContent({
  initialWorkouts,
}: WorkoutContentProps) {
  const [viewType, setViewType] = useState<"daily" | "weekly">("daily");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AddWorkoutButton />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType("daily")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewType === "daily"
                ? "bg-[#8B4513] text-white"
                : "text-[#8B4513] hover:bg-[#8B4513]/5"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewType("weekly")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewType === "weekly"
                ? "bg-[#8B4513] text-white"
                : "text-[#8B4513] hover:bg-[#8B4513]/5"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {viewType === "daily" ? (
        <WorkoutsDisplay initialWorkouts={initialWorkouts} viewType="daily" />
      ) : (
        <WeeklyView workouts={initialWorkouts} />
      )}
    </div>
  );
}
