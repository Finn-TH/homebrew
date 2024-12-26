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
