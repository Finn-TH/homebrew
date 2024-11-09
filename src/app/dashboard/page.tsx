import { createClient } from "@/utils/supabase/server";
import { FeatureGrid } from "./components/feature-card";
import { Coffee } from "lucide-react";
import UserMenu from "@/components/ui/user-menu";

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
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Background circles - optimized animation speeds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-[#8B4513]/5 blur-3xl animate-pulse-slow" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#D2691E]/5 blur-3xl animate-pulse-slow delay-300" />
        <div className="absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-[#A0522D]/5 blur-3xl animate-pulse-slow delay-500" />
      </div>

      {/* Header */}
      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8 text-[#8B4513] animate-spin-slow" />
            <span className="text-2xl font-bold text-[#8B4513]">
              Your Daily Brew
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm text-[#8B4513] backdrop-blur-sm transition-all hover:bg-white/60">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Brewing in progress ☕️
            </div>
            {user && <UserMenu user={user} />}
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl p-8">
        <FeatureGrid user={user} initialPreferences={preferences} />
      </div>
    </div>
  );
}
