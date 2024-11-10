import { Coffee } from "lucide-react";
import UserMenu from "@/app/components/ui/user-menu";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface FeatureLayoutProps {
  children: React.ReactNode;
  user: User | null;
  title: string;
}

export default function FeatureLayout({
  children,
  user,
  title,
}: FeatureLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Return to Dashboard"
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

      <div className="relative mx-auto max-w-7xl p-8">
        <h1 className="text-3xl font-bold text-[#8B4513] mb-6">{title}</h1>
        <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
