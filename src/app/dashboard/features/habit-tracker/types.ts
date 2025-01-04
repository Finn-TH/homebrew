export type HabitStatus = "completed" | "missed" | "pending";

export interface HabitRecord {
  id: string;
  habit_id: string;
  date: string;
  status: HabitStatus;
  created_at?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  user_id: string;
  created_at?: string;
}
