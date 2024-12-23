"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cog, Flame, X, Circle, BarChart2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Habit, HabitRecord, HabitStatus } from "../types";
import { deleteHabit, updateHabitStatus } from "../actions";
import * as Dialog from "@radix-ui/react-dialog";
import EditHabitForm from "../edit-habit/edit-habit-form";
import ProgressBar from "../habit-stats/progress-bar";
import HabitStatsDialog from "../habit-stats/habit-stats-dialog";

interface HabitRowProps {
  habit: Habit;
  weekStart: Date;
  records: HabitRecord[];
}

export default function HabitRow({ habit, weekStart, records }: HabitRowProps) {
  const [isPending, setIsPending] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const getDayDate = (index: number) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getStatusForDate = (date: Date): HabitStatus => {
    const dateKey = formatDateKey(date);
    const record = records.find((r) => r.date === dateKey);
    return record?.status || "pending";
  };

  const handleToggle = async (date: Date) => {
    if (isPending) return;

    const dateKey = formatDateKey(date);
    const currentStatus = getStatusForDate(date);
    const newStatus: HabitStatus =
      currentStatus === "completed" ? "missed" : "completed";

    setIsPending(true);
    try {
      await updateHabitStatus(habit.id, dateKey, newStatus);
    } catch (error) {
      console.error("Failed to update habit status:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteHabit(habit.id);
    } catch (error) {
      console.error("Failed to delete habit:", error);
    } finally {
      setIsPending(false);
      setDeleteOpen(false);
    }
  };

  const getWeeklyProgress = () => {
    const completed = records.filter((r) => r.status === "completed").length;
    return { value: completed, max: 7 };
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group grid grid-cols-[auto_1fr_repeat(7,_minmax(48px,_1fr))] items-center gap-4 px-4 py-3 hover:bg-[#8B4513]/5 transition-colors"
      >
        <div className="w-8 flex items-center justify-center gap-1">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="text-[#8B4513]/40 hover:text-[#8B4513] transition-colors rounded-lg p-1 hover:bg-[#8B4513]/5"
                disabled={isPending}
              >
                <Cog className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[180px] rounded-lg bg-white p-1 shadow-xl"
                sideOffset={5}
              >
                <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
                  <Dialog.Trigger asChild>
                    <DropdownMenu.Item
                      className="text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-md px-2 py-1.5 cursor-pointer"
                      onSelect={(event) => {
                        event.preventDefault();
                        setEditOpen(true);
                      }}
                    >
                      Edit Habit
                    </DropdownMenu.Item>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
                          Edit Habit
                        </Dialog.Title>
                        <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
                          <X className="h-5 w-5" />
                        </Dialog.Close>
                      </div>
                      <EditHabitForm
                        habit={habit}
                        onComplete={() => setEditOpen(false)}
                      />
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <Dialog.Trigger asChild>
                    <DropdownMenu.Item
                      className="text-sm text-red-600 hover:bg-red-50 rounded-md px-2 py-1.5 cursor-pointer"
                      onSelect={(event) => {
                        event.preventDefault();
                        setDeleteOpen(true);
                      }}
                    >
                      Delete Habit
                    </DropdownMenu.Item>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
                      <Dialog.Title className="text-lg font-semibold text-[#8B4513] mb-2">
                        Delete Habit
                      </Dialog.Title>
                      <Dialog.Description className="text-[#8B4513]/70 mb-6">
                        Are you sure you want to delete "{habit.title}"? This
                        action cannot be undone.
                      </Dialog.Description>
                      <div className="flex gap-3 justify-end">
                        <Dialog.Close className="px-4 py-2 rounded-lg text-[#8B4513] hover:bg-[#8B4513]/5">
                          Cancel
                        </Dialog.Close>
                        <button
                          onClick={handleDelete}
                          disabled={isPending}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <button
            onClick={() => setStatsOpen(true)}
            className="text-[#8B4513]/40 hover:text-[#8B4513] transition-colors rounded-lg p-1 hover:bg-[#8B4513]/5"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8B4513] truncate">
                {habit.title}
              </span>
              {habit.current_streak > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Flame className="h-4 w-4 text-orange-500" fill="#f97316" />
                  <span className="text-sm font-medium text-orange-500">
                    {habit.current_streak}
                  </span>
                </div>
              )}
            </div>
            <ProgressBar {...getWeeklyProgress()} />
          </div>
        </div>

        {[...Array(7)].map((_, i) => {
          const date = getDayDate(i);
          const status = getStatusForDate(date);
          const isToday = formatDateKey(new Date()) === formatDateKey(date);
          const isPast = date < new Date();

          return (
            <button
              key={i}
              className="group/check flex items-center justify-center"
              onClick={() => isToday && handleToggle(date)}
              disabled={!isToday || isPending}
            >
              <motion.div
                whileTap={isToday ? { scale: 0.9 } : {}}
                className={`rounded-full p-1.5 transition-colors ${
                  status === "completed"
                    ? "bg-orange-100 ring-1 ring-orange-500/20"
                    : isToday
                    ? "group-hover/check:bg-[#8B4513]/5"
                    : ""
                }`}
              >
                {status === "completed" ? (
                  <Flame className="h-4 w-4 text-orange-500" fill="#f97316" />
                ) : status === "missed" || (isPast && status === "pending") ? (
                  <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
                ) : (
                  <Circle className="h-4 w-4 text-[#8B4513]/40" />
                )}
              </motion.div>
            </button>
          );
        })}
      </motion.div>

      <HabitStatsDialog
        habit={habit}
        records={records}
        open={statsOpen}
        onOpenChange={setStatsOpen}
      />
    </>
  );
}
