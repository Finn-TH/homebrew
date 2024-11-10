import { LucideIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  defaultVisible: boolean;
}

export interface UserPreferences {
  visibleCards: string[];
  cardColors: Record<string, string>;
  layout?: "grid" | "list";
}

export interface FeatureGridProps {
  user: User | null;
  initialPreferences: UserPreferences;
}
