"use client";

import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";
import { useState } from "react";
import { logDailyHabit } from "../actions";
import { formatDateKey } from "../utils/date-utils";
import { Habit, HabitRecord, HabitStatus } from "../types";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    category: string;
    streak: number;
    progress: number;
  };
  records: HabitRecord[];
}

export default function HabitCard({ habit, records }: HabitCardProps) {
  const today = formatDateKey(new Date());
  const todayRecord = records.find((r) => r.date === today);
  const [isCompleted, setIsCompleted] = useState(
    todayRecord?.status === "completed"
  );
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      await logDailyHabit(
        habit.id,
        today,
        isCompleted ? "missed" : "completed"
      );
      setIsCompleted(!isCompleted);
    } catch (error) {
      console.error("Failed to update habit:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isPending}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left bg-white/80 rounded-xl p-6 shadow-sm border 
        transition-colors duration-200 
        ${
          isCompleted
            ? "border-green-500/20 bg-green-50/50"
            : "border-[#8B4513]/10 hover:border-[#8B4513]/20"
        }`}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-green-600 text-sm font-medium">
          <Check className="w-5 h-5" />
          <span>Done today!</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Habit Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-[#8B4513]">{habit.name}</h3>
          <div className="flex items-center gap-2 text-sm text-[#8B4513]/60">
            <span>{habit.category}</span>
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4" />
                <span>{habit.streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${habit.progress}%` }}
            className={`h-full ${
              isCompleted ? "bg-green-500" : "bg-[#8B4513]"
            }`}
          />
        </div>
      </div>
    </motion.button>
  );
}
