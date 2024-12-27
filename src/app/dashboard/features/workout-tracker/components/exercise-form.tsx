"use client";

import { useState } from "react";
import { Dumbbell, Timer, X } from "lucide-react";
import { Exercise } from "../types";

interface ExerciseFormProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onRemove: () => void;
}

export function ExerciseForm({
  exercise,
  onUpdate,
  onRemove,
}: ExerciseFormProps) {
  const [showDetails, setShowDetails] = useState(true);

  const handleStrengthUpdate = (field: keyof Exercise, value: number) => {
    onUpdate({
      ...exercise,
      [field]: value,
    });
  };

  return (
    <div className="p-4 rounded-lg bg-[#8B4513]/5">
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {exercise.type === "strength" ? (
            <Dumbbell className="h-4 w-4 text-[#8B4513]" />
          ) : (
            <Timer className="h-4 w-4 text-[#8B4513]" />
          )}
          <span className="font-medium text-[#8B4513]">{exercise.name}</span>
        </div>
        <button onClick={onRemove}>
          <X className="h-4 w-4 text-[#8B4513]/40 hover:text-[#8B4513]" />
        </button>
      </div>

      {/* Exercise Details */}
      {showDetails && (
        <div className="space-y-3 mt-3">
          {exercise.type === "strength" ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-[#8B4513]/60 mb-1 block">
                  Sets
                </label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) =>
                    handleStrengthUpdate("sets", +e.target.value)
                  }
                  className="w-full rounded border border-[#8B4513]/10 px-2 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm text-[#8B4513]/60 mb-1 block">
                  Reps
                </label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) =>
                    handleStrengthUpdate("reps", +e.target.value)
                  }
                  className="w-full rounded border border-[#8B4513]/10 px-2 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm text-[#8B4513]/60 mb-1 block">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={exercise.weight || 0}
                  onChange={(e) =>
                    handleStrengthUpdate("weight", +e.target.value)
                  }
                  className="w-full rounded border border-[#8B4513]/10 px-2 py-1"
                  min="0"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[#8B4513]/60 mb-1 block">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={exercise.duration}
                  onChange={(e) =>
                    handleStrengthUpdate("duration", +e.target.value)
                  }
                  className="w-full rounded border border-[#8B4513]/10 px-2 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm text-[#8B4513]/60 mb-1 block">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={exercise.distance || 0}
                  onChange={(e) =>
                    handleStrengthUpdate("distance", +e.target.value)
                  }
                  className="w-full rounded border border-[#8B4513]/10 px-2 py-1"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
