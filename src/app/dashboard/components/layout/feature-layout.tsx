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
    <div className="relative mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">{title}</h1>
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
