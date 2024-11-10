import { Coffee } from "lucide-react";
import UserMenu from "@/app/components/ui/user-menu";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-[#8B4513]/5 blur-3xl animate-pulse-slow" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#D2691E]/5 blur-3xl animate-pulse-slow delay-300" />
        <div className="absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-[#A0522D]/5 blur-3xl animate-pulse-slow delay-500" />
      </div>

      {/* Header */}
      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Coffee className="h-8 w-8 text-[#8B4513] animate-spin-slow" />
            <span className="text-2xl font-bold text-[#8B4513]">
              Your Daily Brew
            </span>
          </Link>
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
      {children}
    </div>
  );
}
