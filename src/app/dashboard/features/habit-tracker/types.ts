export type HabitStatus = "completed" | "missed" | "pending";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: string;
  created_at: string;
}

export interface HabitRecord {
  id: string;
  habit_id: string;
  date: string;
  status: HabitStatus;
  created_at: string;
}
