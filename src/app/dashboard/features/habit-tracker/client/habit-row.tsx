"use client";

import { useState } from "react";
import { Circle, Flame, X, Cog } from "lucide-react";
import { Habit } from "../types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDayStatus = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) return "future";
    if (date.getTime() === today.getTime()) return "today";
    return "past";
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
              <DropdownMenu.Item className="text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-md px-2 py-1.5 cursor-pointer">
                Edit Habit
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-sm text-red-600 hover:bg-red-50 rounded-md px-2 py-1.5 cursor-pointer">
                Delete Habit
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#8B4513]">
          {habit.title}
        </span>
        {habit.streak > 0 && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600 flex items-center gap-1">
            <Flame className="h-3 w-3" fill="#f97316" />
            {habit.streak}d
          </span>
        )}
      </div>

      {[...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const status = getDayStatus(date);
        const isCompleted = completedDays.has(i);
        const isPast = isDatePast(new Date(date));

        return (
          <button
            key={i}
            className="group/check flex items-center justify-center"
            onClick={() => {
              if (status === "today") {
                setCompletedDays((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) {
                    next.delete(i);
                  } else {
                    next.add(i);
                  }
                  return next;
                });
              }
            }}
          >
            <motion.div
              whileTap={status === "today" ? { scale: 0.9 } : {}}
              className={`rounded-full p-1.5 transition-colors ${
                completedDays.has(i)
                  ? "bg-orange-100 ring-1 ring-orange-500/20"
                  : status === "today"
                  ? "group-hover/check:bg-[#8B4513]/5"
                  : ""
              }`}
            >
              {isCompleted ? (
                <Flame
                  className="h-4 w-4 text-orange-500 animate-in fade-in"
                  fill="#f97316"
                />
              ) : isPast ? (
                <X className="h-4 w-4 text-red-400" strokeWidth={2.5} />
              ) : status === "future" ? (
                <Circle className="h-4 w-4 text-[#8B4513]/10" />
              ) : (
                <Circle className="h-4 w-4 text-[#8B4513]/40 transition-colors group-hover/check:text-[#8B4513]/60" />
              )}
            </motion.div>
          </button>
        );
      })}
    </motion.div>
  );
}
