import { LucideIcon } from "lucide-react";

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
