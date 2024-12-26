"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import WorkoutRow from "../client/workout-row";
import { WorkoutLog } from "../types";

interface WorkoutsDisplayProps {
  initialWorkouts: WorkoutLog[];
}

export default function WorkoutsDisplay({
  initialWorkouts,
}: WorkoutsDisplayProps) {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(initialWorkouts);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to both workout_logs and workout_log_exercises changes
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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_log_exercises",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    // Update workouts when initialWorkouts changes
    setWorkouts(initialWorkouts);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, initialWorkouts]);

  return workouts.length > 0 ? (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutRow key={workout.id} workout={workout} />
      ))}
    </div>
  ) : (
    <div className="text-[#8B4513]/60 text-center py-8">
      No workouts logged today. Click "Add Workout" to get started!
    </div>
  );
}
