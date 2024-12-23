export type HabitStatus = "completed" | "missed" | "pending";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: string;
  created_at: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
}

export interface HabitRecord {
  id: string;
  habit_id: string;
  date: string;
  status: HabitStatus;
  created_at: string;
}
