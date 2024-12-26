import { createClient } from "@/utils/supabase/server";
import { WorkoutLog, WorkoutLogExercise } from "../types";

export default async function WorkoutTrackerServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get today's workouts with their exercises
  const today = new Date().toISOString().split("T")[0];
  const { data: workouts, error } = (await supabase
    .from("workout_logs")
    .select(
      `
      *,
      workout_log_exercises (*)
    `
    )
    .eq("user_id", user.id)
    .eq("date", today)) as { data: WorkoutLog[] | null; error: any };

  if (error) {
    console.error("Error fetching workouts:", error.message);
    return (
      <div className="text-red-600 text-center py-8">
        Failed to load workouts. Please try again later.
      </div>
    );
  }

  if (!workouts?.length) {
    return (
      <div className="text-[#8B4513]/60 text-center py-8">
        No workouts logged today. Click "Add Workout" to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="bg-white/80 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold text-[#8B4513]">
            {workout.name}
          </h3>
          <div className="mt-4 space-y-2">
            {workout.workout_log_exercises.map(
              (exercise: WorkoutLogExercise) => (
                <div
                  key={exercise.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-[#8B4513]">{exercise.name}</span>
                  <span className="text-[#8B4513]/60">
                    {exercise.type === "strength"
                      ? `${exercise.sets} × ${exercise.reps}${
                          exercise.weight ? ` @ ${exercise.weight}lbs` : ""
                        }`
                      : `${exercise.duration} min${
                          exercise.distance ? ` • ${exercise.distance}km` : ""
                        }`}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
