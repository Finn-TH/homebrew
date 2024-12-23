"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cog, Flame, X, Circle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Habit, HabitRecord, HabitStatus } from "../types";
import { updateHabitStatus } from "../actions";

interface HabitRowProps {
  habit: Habit;
  weekStart: Date;
  records: HabitRecord[];
}

export default function HabitRow({ habit, weekStart, records }: HabitRowProps) {
  const [isPending, setIsPending] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group grid grid-cols-[auto_1fr_repeat(7,_minmax(48px,_1fr))] items-center gap-4 px-4 py-3 hover:bg-[#8B4513]/5 transition-colors"
    >
      <div className="w-8 flex items-center justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="text-[#8B4513]/40 hover:text-[#8B4513] transition-colors rounded-lg p-1 hover:bg-[#8B4513]/5">
              <Cog className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] rounded-lg bg-white p-1 shadow-xl"
              sideOffset={5}
            >
              <DropdownMenu.Item className="text-sm text-red-600 hover:bg-red-50 rounded-md px-2 py-1.5 cursor-pointer">
                Delete Habit
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8B4513]">{habit.title}</span>
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
  );
}
