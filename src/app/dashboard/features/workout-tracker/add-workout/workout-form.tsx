"use client";

import { useState } from "react";
import { Plus, Dumbbell, Timer } from "lucide-react";
import { CardioExercise, Exercise, StrengthExercise } from "../types";
import { StrengthExerciseForm, CardioExerciseForm } from "./exercise-forms";

interface WorkoutFormProps {
  onComplete: () => void;
}

export default function WorkoutForm({ onComplete }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const addStrengthExercise = () => {
    const newExercise: StrengthExercise = {
      name: "",
      type: "strength",
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newExercise]);
    setShowTypeMenu(false);
  };

  const addCardioExercise = () => {
    const newExercise: CardioExercise = {
      name: "",
      type: "cardio",
      duration: 30,
    };
    setExercises([...exercises, newExercise]);
    setShowTypeMenu(false);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workout = {
      id: Date.now().toString(),
      name: workoutName,
      exercises,
      date: new Date().toISOString(),
    };

    const existingWorkouts = JSON.parse(
      localStorage.getItem("workouts") || "[]"
    );
    localStorage.setItem(
      "workouts",
      JSON.stringify([workout, ...existingWorkouts])
    );

    window.dispatchEvent(new Event("workoutAdded"));
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] placeholder-[#8B4513]/40"
          placeholder="Enter workout name..."
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[#8B4513]">
            Exercises
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-1 text-sm text-[#8B4513]/60 hover:text-[#8B4513] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Exercise
            </button>

            {showTypeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-[#8B4513]/10 py-1 z-10">
                <button
                  type="button"
                  onClick={addStrengthExercise}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors"
                >
                  <Dumbbell className="h-4 w-4" />
                  Strength Training
                </button>
                <button
                  type="button"
                  onClick={addCardioExercise}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors"
                >
                  <Timer className="h-4 w-4" />
                  Cardio
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="p-4 rounded-lg bg-[#8B4513]/5">
              {exercise.type === "strength" ? (
                <StrengthExerciseForm
                  exercise={exercise}
                  onRemove={() => removeExercise(index)}
                />
              ) : (
                <CardioExerciseForm
                  exercise={exercise}
                  onRemove={() => removeExercise(index)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#8B4513] px-4 py-2.5 text-white font-medium hover:bg-[#8B4513]/90 transition-colors"
      >
        Add Workout
      </button>
    </form>
  );
}
