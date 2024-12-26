"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Exercise } from "../types";

interface WorkoutRowProps {
  workout: {
    id: string;
    name: string;
    date: string;
    exercises: Exercise[];
  };
}

export default function WorkoutRow({ workout }: WorkoutRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      const existingWorkouts = JSON.parse(
        localStorage.getItem("workouts") || "[]"
      );
      const updatedWorkouts = existingWorkouts.filter(
        (w: any) => w.id !== workout.id
      );
      localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      window.dispatchEvent(new Event("workoutAdded"));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const renderExerciseDetails = (exercise: Exercise) => {
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center justify-between p-3 rounded-lg hover:bg-[#8B4513]/5 transition-colors"
        >
          <span className="text-[#8B4513] font-medium">{workout.name}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8B4513]/60">
              {new Date(workout.date).toLocaleDateString()}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-[#8B4513]/60" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#8B4513]/60" />
            )}
          </div>
        </button>

        <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Dialog.Trigger asChild>
            <button className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors ml-2">
              <Trash2 className="h-4 w-4 text-[#8B4513]/60" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/20" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg space-y-4">
              <Dialog.Title className="text-lg font-medium text-[#8B4513]">
                Delete Workout
              </Dialog.Title>
              <Dialog.Description className="text-[#8B4513]/60">
                Are you sure you want to delete this workout? This action cannot
                be undone.
              </Dialog.Description>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2 text-sm text-[#8B4513]/60 hover:text-[#8B4513] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {isExpanded && (
        <div className="space-y-2 pl-4">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#8B4513]/5 p-3 rounded-lg"
            >
              <span className="text-[#8B4513]">{exercise.name}</span>
              {renderExerciseDetails(exercise)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
