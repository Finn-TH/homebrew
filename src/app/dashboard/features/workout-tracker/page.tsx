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

  return (
    <FeatureLayout user={user} title="Workout Tracker">
      <WorkoutContent />
    </FeatureLayout>
  );
}
