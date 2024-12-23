export type Frequency = "daily" | "weekly" | "monthly";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  frequency: Frequency;
  target: number;
  current: number;
  streak: number;
  category?: string;
  color?: string;
  start_date: string;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  note?: string;
}
