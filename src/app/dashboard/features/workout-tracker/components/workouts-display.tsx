"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import WorkoutRow from "../client/workout-row";
import { WorkoutLog } from "../types";
import { getUserLocalDate } from "../utils/date";

interface WorkoutsDisplayProps {
  initialWorkouts: WorkoutLog[];
  viewType?: "daily" | "weekly";
}

export default function WorkoutsDisplay({
  initialWorkouts,
  viewType = "daily",
}: WorkoutsDisplayProps) {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(initialWorkouts);
  const router = useRouter();

  useEffect(() => {
    // Update workouts when initialWorkouts or viewType changes
    setWorkouts(initialWorkouts);
  }, [initialWorkouts, viewType]);

  // Filter workouts based on view type
  const filteredWorkouts = workouts.filter((workout) => {
    if (viewType === "daily") {
      const today = getUserLocalDate();
      return workout.date === today;
    }
    // For weekly view, show all workouts (they're already filtered by week in the page component)
    return true;
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("workout-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_logs",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return filteredWorkouts.length > 0 ? (
    <div className="space-y-4">
      {filteredWorkouts.map((workout) => (
        <WorkoutRow key={workout.id} workout={workout} />
      ))}
    </div>
  ) : (
    <div className="text-[#8B4513]/60 text-center py-8">
      {viewType === "daily"
        ? 'No workouts logged today. Click "Add Workout" to get started!'
        : 'No workouts logged this week. Click "Add Workout" to get started!'}
    </div>
  );
}
