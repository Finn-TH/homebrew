"use client";

import { useState, useTransition } from "react";
import { Dumbbell, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkoutFormProps {
  onComplete: () => void;
}

// Temporary workout templates until we have the database
const WORKOUT_TEMPLATES = [
  {
    id: "full-body",
    name: "Full Body",
    exercises: [
      { name: "Squats", sets: 3, reps: 10 },
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "Deadlifts", sets: 3, reps: 8 },
      { name: "Pull-ups", sets: 3, reps: 8 },
      { name: "Planks", sets: 3, reps: 60 },
    ],
  },
  {
    id: "upper-body",
    name: "Upper Body",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10 },
      { name: "Rows", sets: 3, reps: 12 },
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Bicep Curls", sets: 3, reps: 12 },
      { name: "Tricep Extensions", sets: 3, reps: 12 },
    ],
  },
];

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export default function WorkoutForm({ onComplete }: WorkoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const router = useRouter();

  const handleTemplateSelect = (templateId: string) => {
    const template = WORKOUT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setWorkoutName(template.name);
      setExercises(template.exercises);
    }
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const workout = {
          id: Date.now(),
          name: workoutName,
          date: new Date().toISOString(),
          exercises: exercises,
        };

        const existingWorkouts = JSON.parse(
          localStorage.getItem("workouts") || "[]"
        );
        localStorage.setItem(
          "workouts",
          JSON.stringify([...existingWorkouts, workout])
        );

        // Dispatch custom event for immediate update
        window.dispatchEvent(new Event("workoutAdded"));

        router.refresh();
        onComplete();
      } catch (error) {
        console.error("Failed to add workout:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {/* Template Selection */}
      <div className="flex flex-wrap gap-2">
        {WORKOUT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplateSelect(template.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                     bg-[#8B4513]/10 text-sm text-[#8B4513] 
                     hover:bg-[#8B4513]/20 transition-colors"
          >
            <Dumbbell className="h-4 w-4" />
            {template.name}
          </button>
        ))}
      </div>

      {/* Workout Name */}
      <div className="space-y-2">
        <label
          htmlFor="workoutName"
          className="block text-sm font-medium text-[#8B4513]"
        >
          Workout Name
        </label>
        <input
          type="text"
          id="workoutName"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 
                   text-[#8B4513] placeholder-[#8B4513]/40"
          placeholder="Enter workout name..."
          required
        />
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[#8B4513]">
            Exercises
          </label>
          <button
            type="button"
            onClick={addExercise}
            className="flex items-center gap-1 text-sm text-[#8B4513]/60 
                     hover:text-[#8B4513] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Exercise
          </button>
        </div>

        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border 
                       border-[#8B4513]/10 p-3"
            >
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) =>
                    updateExercise(index, "name", e.target.value)
                  }
                  className="w-full rounded-md border border-[#8B4513]/10 
                           px-2 py-1 text-sm text-[#8B4513]"
                  placeholder="Exercise name"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) =>
                      updateExercise(index, "sets", parseInt(e.target.value))
                    }
                    className="w-20 rounded-md border border-[#8B4513]/10 
                             px-2 py-1 text-sm text-[#8B4513]"
                    placeholder="Sets"
                    required
                  />
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) =>
                      updateExercise(index, "reps", parseInt(e.target.value))
                    }
                    className="w-20 rounded-md border border-[#8B4513]/10 
                             px-2 py-1 text-sm text-[#8B4513]"
                    placeholder="Reps"
                    required
                  />
                  <input
                    type="number"
                    value={exercise.weight || ""}
                    onChange={(e) =>
                      updateExercise(
                        index,
                        "weight",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-20 rounded-md border border-[#8B4513]/10 
                             px-2 py-1 text-sm text-[#8B4513]"
                    placeholder="Weight"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="text-[#8B4513]/40 hover:text-[#8B4513] 
                         transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || exercises.length === 0}
        className="w-full rounded-lg bg-[#8B4513] px-4 py-2 text-white 
                 hover:bg-[#8B4513]/90 disabled:opacity-50"
      >
        {isPending ? "Adding Workout..." : "Add Workout"}
      </button>
    </form>
  );
}
