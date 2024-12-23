"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Flame, Calendar, TrendingUp } from "lucide-react";
import { Habit, HabitRecord } from "../types";
import { motion } from "framer-motion";
import HabitTrends from "./habit-trends";

interface HabitStatsDialogProps {
  habit: Habit;
  records: HabitRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HabitStatsDialog({
  habit,
  records,
  open,
  onOpenChange,
}: HabitStatsDialogProps) {
  const calculateStats = () => {
    const totalDays = records.length;
    const completedDays = records.filter(
      (r) => r.status === "completed"
    ).length;
    const completionRate = totalDays
      ? Math.round((completedDays / totalDays) * 100)
      : 0;

    return {
      completionRate,
      currentStreak: habit.current_streak,
      longestStreak: habit.longest_streak,
      totalCompletions: habit.total_completions,
    };
  };

  const stats = calculateStats();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[#8B4513]">
              {habit.title} Stats
            </Dialog.Title>
            <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-orange-50/50 p-4"
            >
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Flame className="h-5 w-5" />
                <h3 className="text-base">Current Streak</h3>
              </div>
              <p className="text-3xl font-semibold text-orange-700">
                {stats.currentStreak} days
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-green-50/50 p-4"
            >
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-base">Completion Rate</h3>
              </div>
              <p className="text-3xl font-semibold text-green-700">
                {stats.completionRate}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-blue-50/50 p-4"
            >
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Flame className="h-5 w-5" />
                <h3 className="text-base">Longest Streak</h3>
              </div>
              <p className="text-3xl font-semibold text-blue-700">
                {stats.longestStreak} days
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-purple-50/50 p-4"
            >
              <div className="flex items-center gap-2 text-purple-500 mb-2">
                <Calendar className="h-5 w-5" />
                <h3 className="text-base">Total Completions</h3>
              </div>
              <p className="text-3xl font-semibold text-purple-700">
                {stats.totalCompletions} days
              </p>
            </motion.div>
          </div>

          <HabitTrends records={records} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
