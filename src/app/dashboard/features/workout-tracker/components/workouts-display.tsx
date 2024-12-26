"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import WorkoutRow from "../client/workout-row";
import { WorkoutLog } from "../types";

export default function WorkoutsDisplay() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("workout_logs")
          .select(
            `
            *,
            workout_log_exercises (*)
          `
          )
          .eq("date", today)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWorkouts(data || []);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError("Failed to load workouts");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchWorkouts();

    // Subscribe to changes
    const channel = supabase
      .channel("workout_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_logs",
        },
        async (payload) => {
          const today = new Date().toISOString().split("T")[0];

          if (payload.eventType === "INSERT" && payload.new.date === today) {
            // Fetch the complete workout with exercises
            const { data: newWorkout } = await supabase
              .from("workout_logs")
              .select(`*, workout_log_exercises (*)`)
              .eq("id", payload.new.id)
              .single();

            if (newWorkout) {
              setWorkouts((current) => [newWorkout, ...current]);
            }
          } else if (payload.eventType === "DELETE") {
            setWorkouts((current) =>
              current.filter((w) => w.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="text-[#8B4513]/60 text-center py-8">
        Loading workouts...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

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
