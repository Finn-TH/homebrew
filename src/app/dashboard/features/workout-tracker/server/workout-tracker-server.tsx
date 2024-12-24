import { createClient } from "@/utils/supabase/server";

export default async function WorkoutTrackerServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get today's workouts
  const today = new Date().toISOString().split("T")[0];
  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today);

  if (!workouts?.length) {
    return (
      <div className="text-[#8B4513]/60 text-center py-8">
        No workouts logged today. Click "Add Workout" to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* We'll implement the workout display here once we have the database schema */}
      <div className="text-[#8B4513]">Workouts will be displayed here...</div>
    </div>
  );
}
