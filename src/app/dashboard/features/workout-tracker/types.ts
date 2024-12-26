// Base exercise types (for form inputs)
export interface BaseExercise {
  name: string;
  type: "strength" | "cardio";
}

export interface StrengthExercise extends BaseExercise {
  type: "strength";
  sets: number;
  reps: number;
  weight?: number;
}

export interface CardioExercise extends BaseExercise {
  type: "cardio";
  duration: number;
  distance?: number;
}

export type Exercise = StrengthExercise | CardioExercise;

// Database types (from Supabase)
export interface WorkoutLog {
  id: string;
  user_id: string;
  name: string;
  date: string;
  created_at: string;
  workout_log_exercises: WorkoutLogExercise[];
}

export interface WorkoutLogExercise {
  id: string;
  workout_id: string;
  name: string;
  type: "strength" | "cardio";
  sets: number | null;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  distance: number | null;
  created_at: string;
}

// Template types
export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_by_user_id: string | null;
  created_at: string;
  workout_template_exercises: WorkoutTemplateExercise[];
}

export interface WorkoutTemplateExercise {
  id: string;
  template_id: string;
  name: string;
  type: "strength" | "cardio";
  default_sets: number | null;
  default_reps: number | null;
  default_duration: number | null;
  created_at: string;
}
