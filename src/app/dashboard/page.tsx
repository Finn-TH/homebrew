import { createClient } from "@/utils/supabase/server";
import { FeatureGrid } from "./components/ui/feature-card";
import { ChatWidget } from "@/app/components/ai/chat-widget";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <FeatureGrid user={user} initialPreferences={preferences} />
      <ChatWidget />
    </div>
  );
}
