import { createClient } from "@/utils/supabase/server";
import FeatureLayout from "../../components/layout/feature-layout";
import HabitTrackerServer from "./server/habit-tracker-server";
import AddHabitButton from "./add-habit/add-habit-button";
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

  return (
    <FeatureLayout user={user} title="Habit Tracker">
      <div className="space-y-6">
        <AddHabitButton />
        <HabitTrackerServer />
      </div>
    </FeatureLayout>
  );
}
