"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Dumbbell, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { WorkoutLog, WorkoutLogExercise } from "../types";
import { deleteWorkout } from "../actions";
import { formatDateKey } from "../utils/date";

interface WorkoutRowProps {
  workout: WorkoutLog;
}

export default function WorkoutRow({ workout }: WorkoutRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkout(workout.id);
      router.refresh();
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete workout:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderExerciseDetails = (exercise: WorkoutLogExercise) => {
    if (exercise.type === "strength") {
      return (
        <span className="text-[#8B4513]/60">
          {exercise.sets} × {exercise.reps}
          {exercise.weight && ` @ ${exercise.weight}lbs`}
        </span>
      );
    } else {
      return (
        <span className="text-[#8B4513]/60">
          {exercise.duration} min
          {exercise.distance && ` • ${exercise.distance}km`}
        </span>
      );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center gap-4 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-lg bg-[#8B4513]/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-[#8B4513]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-[#8B4513]">
                {workout.name}
              </span>
              <span className="text-sm text-[#8B4513]/60">
                {workout.workout_log_exercises.length} exercises
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#8B4513]/70">
              {formatDateKey(new Date(workout.date))}
            </span>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 text-[#8B4513]/60" />
            </button>
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="cursor-pointer"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#8B4513]/60" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#8B4513]/60" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {workout.workout_log_exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#8B4513]/5 hover:bg-[#8B4513]/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {exercise.type === "strength" ? (
                    <Dumbbell className="h-4 w-4 text-[#8B4513]/60" />
                  ) : (
                    <Timer className="h-4 w-4 text-[#8B4513]/60" />
                  )}
                  <span className="text-[#8B4513] font-medium">
                    {exercise.name}
                  </span>
                </div>
                <span className="text-sm text-[#8B4513]/70 font-medium">
                  {renderExerciseDetails(exercise)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">
              Delete Workout
            </h3>
            <p className="text-[#8B4513]/70 mb-4">
              Are you sure you want to delete this workout? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 rounded-lg text-[#8B4513]/60 hover:text-[#8B4513] hover:bg-[#8B4513]/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
