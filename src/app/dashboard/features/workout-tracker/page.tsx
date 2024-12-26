import { createClient } from "@/utils/supabase/server";
import FeatureLayout from "../../components/layout/feature-layout";
import WorkoutContent from "./components/workout-content";
import { getWeekDates } from "./utils/date";

export default async function WorkoutTrackerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { start: startDate, end: endDate } = getWeekDates();

  const { data: workouts, error } = await supabase
    .from("workout_logs")
    .select(
      `
      *,
      workout_log_exercises (*)
    `
    )
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching workouts:", error);
  }

  return (
    <FeatureLayout user={user} title="Workout Tracker">
      <WorkoutContent initialWorkouts={workouts || []} />
    </FeatureLayout>
  );
}
