"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExerciseForm } from "../components/exercise-form";
import ExerciseSelector from "../components/exercise-selector";
import { Exercise } from "../types";
import { addWorkout } from "../actions";
import { getAllPresetWorkouts, PresetWorkout } from "../data/preset-workouts";

interface WorkoutFormProps {
  onComplete: () => void;
}

import {
  Dumbbell,
  Plus,
  Timer,
  ArrowDown,
  Users,
  Brain,
  Hammer,
  Zap,
  Heart,
  FlameKindling,
  Trash2,
} from "lucide-react";

// Add this helper function to get icon for preset
const getPresetIcon = (id: string) => {
  const icons = {
    "full-body": Users,
    "upper-body": Dumbbell,
    "lower-body": ArrowDown,
    calisthenics: Brain,
    push: Hammer,
    pull: Hammer,
    legs: ArrowDown,
    cardio: Heart,
    hiit: FlameKindling,
  };
  return icons[id as keyof typeof icons] || Dumbbell;
};

export default function WorkoutForm({ onComplete }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutType, setWorkoutType] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const router = useRouter();
  const presets = getAllPresetWorkouts();

  const applyPreset = (preset: PresetWorkout) => {
    setSelectedPreset(preset.id);
    setWorkoutName(preset.name);
    const presetExercises: Exercise[] = preset.exercises.map((ex) => ({
      name: ex.name,
      type: ex.type,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      duration: ex.defaultDuration,
    }));
    setExercises(presetExercises);
  };

  const handleModeSwitch = (mode: "preset" | "custom") => {
    setWorkoutType(mode);
    setExercises([]);
    setSelectedPreset(null);
    if (mode === "custom") {
      setWorkoutName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addWorkout(workoutName, exercises);
      router.refresh();
      onComplete();
    } catch (error) {
      console.error("Failed to add workout:", error);
      alert("Failed to add workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    setShowExerciseSelector(false);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col min-h-[600px]"
    >
      {/* Fixed height wrapper with centered content */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Toggle Buttons - Centered */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => handleModeSwitch("preset")}
            className={`px-6 py-2 rounded-lg transition-all ${
              workoutType === "preset"
                ? "bg-[#8B4513] text-white"
                : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
            }`}
          >
            Preset
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("custom")}
            className={`px-6 py-2 rounded-lg transition-all ${
              workoutType === "custom"
                ? "bg-[#8B4513] text-white"
                : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Content with fixed height container */}
        <div className="min-h-[400px]">
          {workoutType === "preset" ? (
            // Preset Grid with selection indicator
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {presets.map((preset) => {
                const Icon = getPresetIcon(preset.id);
                const isSelected = selectedPreset === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`group flex flex-col items-center justify-center h-36 p-4
                               rounded-lg transition-all ${
                                 isSelected
                                   ? "bg-[#8B4513]/10 ring-2 ring-[#8B4513]"
                                   : "bg-white hover:bg-[#8B4513]/5"
                               }`}
                  >
                    <Icon
                      className={`h-8 w-8 mb-2 ${
                        isSelected ? "text-[#8B4513]" : "text-[#8B4513]/80"
                      }`}
                    />
                    <span
                      className={`font-medium text-center mb-1 ${
                        isSelected ? "text-[#8B4513]" : "text-[#8B4513]/80"
                      }`}
                    >
                      {preset.name}
                    </span>
                    <span
                      className={`text-sm text-center ${
                        isSelected ? "text-[#8B4513]/80" : "text-[#8B4513]/60"
                      }`}
                    >
                      {preset.exercises.length} exercises
                    </span>
                  </button>
                );
              })}
            </div>
          ) : workoutType === "custom" ? (
            // Custom Form - Centered
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#8B4513]">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 
                           text-[#8B4513] placeholder-[#8B4513]/40"
                  placeholder="Enter workout name..."
                  required
                />
              </div>

              {/* Exercises Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B4513] font-medium">Exercises</span>
                  <button
                    type="button"
                    onClick={() => setShowExerciseSelector(true)}
                    className="flex items-center gap-2 text-[#8B4513]/80 hover:text-[#8B4513] 
                             transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Exercise</span>
                  </button>
                </div>

                {/* Exercise List */}
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <ExerciseForm
                      key={index}
                      exercise={exercise}
                      onUpdate={(updated) => {
                        const newExercises = [...exercises];
                        newExercises[index] = updated;
                        setExercises(newExercises);
                      }}
                      onRemove={() => removeExercise(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Exercise Selector Modal */}
              {showExerciseSelector && (
                <ExerciseSelector
                  onSelect={handleAddExercise}
                  onClose={() => setShowExerciseSelector(false)}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            (workoutType === "custom" &&
              (!workoutName || exercises.length === 0)) ||
            (workoutType === "preset" && !selectedPreset)
          }
          className="w-full rounded-lg bg-[#8B4513] px-4 py-2.5 text-white 
                   font-medium hover:bg-[#8B4513]/90 transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Add Workout"}
        </button>
      </div>
    </form>
  );
}
