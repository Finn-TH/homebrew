"use client";

import { useState } from "react";
import { WorkoutLog } from "../types";
import { getUserLocalDate, getWeekDates } from "../utils/date";
import { Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteWorkout } from "../actions";
import { useRouter } from "next/navigation";

interface WeeklyViewProps {
  workouts: WorkoutLog[];
}

export default function WeeklyView({ workouts }: WeeklyViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(
    null
  );

  const today = getUserLocalDate();
  const { start, end } = getWeekDates();

  // Generate week days
  const weekDays = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    weekDays.push({
      date: date.toLocaleDateString("en-CA"),
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
    });
  }

  const handleDelete = async (workoutId: string) => {
    setIsDeleting(true);
    try {
      await deleteWorkout(workoutId);
      router.refresh();
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete workout:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => {
        const isToday = day.date === today;
        const dayWorkouts = workouts.filter((w) => w.date === day.date);

        return (
          <div
            key={day.date}
            className={`p-4 rounded-lg ${
              isToday ? "ring-2 ring-[#8B4513] bg-[#8B4513]/5" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-[#8B4513]/60">{day.name}</span>
              <span className="font-medium text-[#8B4513]">{day.number}</span>
              {isToday && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B4513] text-white">
                  Today
                </span>
              )}
            </div>

            <div className="space-y-2">
              {dayWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-2 rounded bg-white/50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#8B4513]">
                      {workout.name}
                    </span>
                    <span className="text-xs text-[#8B4513]/60">
                      {workout.workout_log_exercises.length} exercises
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setDeleteOpen(true);
                    }}
                    className="p-1.5 hover:bg-[#8B4513]/5 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-[#8B4513]/60" />
                  </button>
                </div>
              ))}

              {dayWorkouts.length === 0 && (
                <span className="text-sm text-[#8B4513]/40">No workout</span>
              )}
            </div>
          </div>
        );
      })}

      <Dialog.Root
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedWorkout(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                   bg-white p-6 rounded-lg shadow-lg space-y-4"
          >
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
                className="px-4 py-2 text-sm text-[#8B4513]/60 
                         hover:text-[#8B4513] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  selectedWorkout && handleDelete(selectedWorkout.id)
                }
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg 
                         hover:bg-red-600 transition-colors disabled:opacity-50"
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
