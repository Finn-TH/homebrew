import { Dumbbell, Timer, Trash2 } from "lucide-react";
import { Exercise, StrengthExercise, CardioExercise } from "../types";

interface ExerciseFormProps {
  exercise: Exercise;
  onRemove: () => void;
}

export function StrengthExerciseForm({
  exercise,
  onRemove,
}: ExerciseFormProps) {
  const ex = exercise as StrengthExercise;
  return (
    <div className="relative space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Dumbbell className="h-4 w-4 text-[#8B4513]" />
        <span className="text-sm font-medium text-[#8B4513]">
          Strength Exercise
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-0 top-0 text-[#8B4513]/40 hover:text-[#8B4513] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg">
        <span className="text-[#8B4513]">
          {ex.sets} sets × {ex.reps} reps
        </span>
      </div>
    </div>
  );
}

export function CardioExerciseForm({ exercise, onRemove }: ExerciseFormProps) {
  const ex = exercise as CardioExercise;
  return (
    <div className="relative space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="h-4 w-4 text-[#8B4513]" />
        <span className="text-sm font-medium text-[#8B4513]">
          Cardio Exercise
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-0 top-0 text-[#8B4513]/40 hover:text-[#8B4513] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg">
        <span className="text-[#8B4513]">{ex.duration} minutes</span>
      </div>
    </div>
  );
}
