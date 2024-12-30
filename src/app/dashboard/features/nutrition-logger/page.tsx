import FeatureLayout from "../../components/layout/feature-layout";
import NutritionLoggerServer from "./server/nutrition-logger-server";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Nutrition Logger | Homebrew",
  description: "Track your nutrition with Homebrew",
};

export default async function NutritionLoggerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return (
    <FeatureLayout user={user} title="Nutrition Logger">
      <NutritionLoggerServer />
    </FeatureLayout>
  );
}
