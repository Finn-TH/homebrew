import { createClient } from "@/utils/supabase/client";
import WorkoutContent from "../components/workout-content";

export default async function WorkoutContentServer() {
  const supabase = await createClient();
  const { data: workouts } = await supabase
    .from("workout_logs")
    .select(
      `
      *,
      workout_log_exercises (*)
    `
    )
    .order("created_at", { ascending: false });

  return <WorkoutContent initialWorkouts={workouts || []} />;
}
