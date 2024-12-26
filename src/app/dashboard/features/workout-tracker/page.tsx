import { createClient } from "@/utils/supabase/server";
import FeatureLayout from "../../components/layout/feature-layout";
import WorkoutContent from "./components/workout-content";

export default async function WorkoutTrackerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Add error handling for the query
  const { data: workouts, error } = await supabase
    .from("workout_logs")
    .select(
      `
      *,
      workout_log_exercises (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workouts:", error);
    // Handle error appropriately
  }

  return (
    <FeatureLayout user={user} title="Workout Tracker">
      <WorkoutContent initialWorkouts={workouts || []} />
    </FeatureLayout>
  );
}
