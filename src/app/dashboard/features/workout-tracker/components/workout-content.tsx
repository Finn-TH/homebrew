"use client";

import { useState } from "react";
import ViewSwitcher from "./view-switcher";
import WorkoutsDisplay from "./workouts-display";
import WorkoutAnalytics from "./workout-analytics";
import AddWorkoutButton from "../add-workout/add-workout-button";
import { WorkoutLog } from "../types";

interface WorkoutContentProps {
  initialWorkouts: WorkoutLog[];
}

export default function WorkoutContent({
  initialWorkouts,
}: WorkoutContentProps) {
  const [view, setView] = useState<"daily" | "weekly" | "analytics">("daily");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ViewSwitcher
          view={view}
          onChange={(v) => setView(v as "daily" | "weekly" | "analytics")}
        />
        <AddWorkoutButton />
      </div>

      {view === "analytics" ? (
        <WorkoutAnalytics workouts={initialWorkouts} />
      ) : (
        <WorkoutsDisplay initialWorkouts={initialWorkouts} viewType={view} />
      )}
    </div>
  );
}
