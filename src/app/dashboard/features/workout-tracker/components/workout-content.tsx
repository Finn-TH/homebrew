"use client";

import { useState } from "react";
import AddWorkoutButton from "../add-workout/add-workout-button";
import WorkoutsDisplay from "./workouts-display";
import ViewSwitcher from "./view-switcher";
import { WorkoutLog } from "../types";

interface WorkoutContentProps {
  initialWorkouts: WorkoutLog[];
}

export default function WorkoutContent({
  initialWorkouts,
}: WorkoutContentProps) {
  const [view, setView] = useState<"daily" | "weekly">("daily");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <ViewSwitcher view={view} onChange={setView} />
        <AddWorkoutButton />
      </div>
      <WorkoutsDisplay initialWorkouts={initialWorkouts} viewType={view} />
    </div>
  );
}
