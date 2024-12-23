"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import HabitRow from "./habit-row";
import { Habit, HabitRecord } from "../types";

interface HabitGridProps {
  initialHabits: Record<string, Habit[]>;
  habitRecords: HabitRecord[];
}

export default function HabitGrid({
  initialHabits,
  habitRecords,
}: HabitGridProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(initialHabits))
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Get Monday of current week
  const getWeekStart = () => {
    const today = new Date();
    const monday = new Date(today);
    while (monday.getDay() !== 1) {
      monday.setDate(monday.getDate() - 1);
    }
    return monday;
  };

  const weekStart = getWeekStart();

  return (
    <div className="rounded-xl border border-[#8B4513]/10 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-[auto_1fr_repeat(7,_minmax(48px,_1fr))] items-center gap-4 border-b border-[#8B4513]/10 px-4 py-3">
        <span className="w-8" />
        <span className="text-sm font-medium text-[#8B4513]">Habit</span>
        {[...Array(7)].map((_, i) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          const isToday = new Date().getDate() === date.getDate();

          return (
            <div key={i} className="text-center">
              <div
                className={`text-xs ${
                  isToday ? "text-[#8B4513]" : "text-[#8B4513]/40"
                }`}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-sm ${
                  isToday ? "text-[#8B4513]" : "text-[#8B4513]/40"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {Object.entries(initialHabits).map(([category, habits]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => toggleCategory(category)}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 text-[#8B4513]/60 transition-transform duration-200 ${
                expandedCategories.has(category) ? "" : "-rotate-90"
              }`}
            />
            {category}
            <span className="ml-2 rounded-full bg-[#8B4513]/10 px-2 py-0.5 text-xs text-[#8B4513]/60">
              {habits.length}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {expandedCategories.has(category) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="divide-y divide-[#8B4513]/5 overflow-hidden"
              >
                {habits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    weekStart={weekStart}
                    records={habitRecords.filter(
                      (r) => r.habit_id === habit.id
                    )}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
