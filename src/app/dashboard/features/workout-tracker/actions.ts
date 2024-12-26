"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Exercise } from "./types";

export async function addWorkout(
  name: string,
  exercises: Exercise[]
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // 1. Insert the workout
    const { data: workout, error: workoutError } = await supabase
      .from("workout_logs")
      .insert([
        {
          user_id: user.id,
          name: name,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (workoutError) throw workoutError;

    // 2. Insert all exercises for this workout
    const { error: exercisesError } = await supabase
      .from("workout_log_exercises")
      .insert(
        exercises.map((exercise) => ({
          workout_id: workout.id,
          name: exercise.name,
          type: exercise.type,
          sets: exercise.type === "strength" ? exercise.sets : null,
          reps: exercise.type === "strength" ? exercise.reps : null,
          weight: exercise.type === "strength" ? exercise.weight : null,
          duration: exercise.type === "cardio" ? exercise.duration : null,
          distance: exercise.type === "cardio" ? exercise.distance : null,
        }))
      );

    if (exercisesError) throw exercisesError;

    revalidatePath("/dashboard/features/workout-tracker");
  } catch (error) {
    console.error("Failed to add workout:", error);
    throw error;
  }
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const supabase = await createClient();

  // Delete exercises first (cascade should handle this, but being explicit)
  const { error: exercisesError } = await supabase
    .from("workout_log_exercises")
    .delete()
    .eq("workout_id", workoutId);

  if (exercisesError) throw exercisesError;

  // Then delete the workout
  const { error: workoutError } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", workoutId);

  if (workoutError) throw workoutError;

  revalidatePath("/dashboard/features/workout-tracker");
}
