import { createClient } from "@/utils/supabase/server";
import HabitGrid from "../client/habit-grid-client";
import { Habit, HabitRecord } from "../types";

export default async function HabitTrackerServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get all habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (habitsError) {
    console.error("Error fetching habits:", habitsError.message);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Failed to load habits. Please try again later.</p>
      </div>
    );
  }

  // Get current week's records for all habits
  const monday = new Date();
  while (monday.getDay() !== 1) {
    monday.setDate(monday.getDate() - 1);
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const { data: records, error: recordsError } = await supabase
    .from("habit_records")
    .select("*")
    .in("habit_id", habits?.map((h) => h.id) || [])
    .gte("date", monday.toISOString().split("T")[0])
    .lte("date", sunday.toISOString().split("T")[0]);

  if (recordsError) {
    console.error("Error fetching habit records:", recordsError.message);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Failed to load habit records. Please try again later.</p>
      </div>
    );
  }

  // Group habits by category
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
      <HabitGrid initialHabits={groupedHabits} habitRecords={records || []} />
    </div>
  );
}
