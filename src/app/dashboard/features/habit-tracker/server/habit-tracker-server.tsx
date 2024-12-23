import { createClient } from "@/utils/supabase/server";
import HabitGrid from "../client/habit-grid-client";
import { Habit } from "../types";

export default async function HabitTrackerServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: habits, error } = await supabase
    .from("habits")
    .select("*, habit_completions(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching habits:", error.message);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Failed to load habits. Please try again later.</p>
      </div>
    );
  }

  const groupedHabits = (habits || []).reduce((acc, habit) => {
    const category = habit.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  if (Object.keys(groupedHabits).length === 0) {
    return (
      <div className="rounded-lg border border-[#8B4513]/10 bg-white p-8 text-center text-[#8B4513]/60">
        <p>No habits yet. Click &quot;Add Habit&quot; to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HabitGrid initialHabits={groupedHabits} />
    </div>
  );
}
