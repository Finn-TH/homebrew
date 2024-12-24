"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

interface WorkoutRowProps {
  workout: {
    id: number;
    name: string;
    date: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
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

      // Dispatch custom event for immediate update
      window.dispatchEvent(new Event("workoutAdded"));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
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
            <button
              className="ml-2 p-2 text-[#8B4513]/40 hover:text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
              <Dialog.Title className="text-lg font-semibold text-[#8B4513] mb-2">
                Delete Workout
              </Dialog.Title>
              <Dialog.Description className="text-[#8B4513]/70 mb-6">
                Are you sure you want to delete this workout? This action cannot
                be undone.
              </Dialog.Description>
              <div className="flex gap-3 justify-end">
                <Dialog.Close className="px-4 py-2 rounded-lg text-[#8B4513] hover:bg-[#8B4513]/5">
                  Cancel
                </Dialog.Close>
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

      {isExpanded && (
        <div className="space-y-2 pl-4">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#8B4513]/5 p-3 rounded-lg"
            >
              <span className="text-[#8B4513]">{exercise.name}</span>
              <span className="text-[#8B4513]/60">
                {exercise.sets} x {exercise.reps}{" "}
                {exercise.weight && `@ ${exercise.weight}lbs`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
