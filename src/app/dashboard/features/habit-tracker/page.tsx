import { createClient } from "@/utils/supabase/server";
import FeatureLayout from "../../components/layout/feature-layout";
import HabitContent from "./components/habit-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habit Tracker | Homebrew",
  description: "Track and build better habits with Homebrew",
};

export default async function HabitTrackerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch habits and records for analytics
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id);

  const { data: records } = await supabase
    .from("habit_records")
    .select("*")
    .in("habit_id", habits?.map((h) => h.id) || []);

  return (
    <FeatureLayout user={user} title="Habit Tracker">
      <HabitContent habits={habits || []} records={records || []} />
    </FeatureLayout>
  );
}
