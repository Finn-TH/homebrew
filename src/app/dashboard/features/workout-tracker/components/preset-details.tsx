import { PresetWorkout } from "../data/preset-workouts";
import { Dumbbell, Timer } from "lucide-react";

interface PresetDetailsProps {
  preset: PresetWorkout;
}

export function PresetDetails({ preset }: PresetDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#8B4513]">{preset.name}</h3>
        <span className="text-sm text-[#8B4513]/60 capitalize">
          {preset.category}
        </span>
      </div>

      <p className="text-sm text-[#8B4513]/80">{preset.description}</p>

      <div className="space-y-2">
        {preset.exercises.map((exercise, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-[#8B4513]/5 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {exercise.type === "strength" ? (
                <Dumbbell className="h-4 w-4 text-[#8B4513]" />
              ) : (
                <Timer className="h-4 w-4 text-[#8B4513]" />
              )}
              <span className="text-[#8B4513]">{exercise.name}</span>
            </div>
            <span className="text-sm text-[#8B4513]/60">
              {exercise.type === "strength"
                ? `${exercise.defaultSets} × ${exercise.defaultReps}`
                : `${exercise.defaultDuration} min`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
