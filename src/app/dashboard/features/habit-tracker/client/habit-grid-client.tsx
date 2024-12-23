"use client";

import { useState } from "react";
import HabitRow from "./habit-row";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { Habit } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface HabitGridProps {
  initialHabits: Record<string, Habit[]>;
}

export default function HabitGrid({ initialHabits }: HabitGridProps) {
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

  // Update the getDayLabel function to start from Monday
  const getDayLabel = (index: number) => {
    const today = new Date();
    const monday = new Date(today);
    // Find the most recent Monday
    while (monday.getDay() !== 1) {
      // 1 represents Monday
      monday.setDate(monday.getDate() - 1);
    }
    // Add the index to get the correct day
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date,
    };
  };

  return (
    <div className="rounded-xl border border-[#8B4513]/10 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-[auto_1fr_repeat(7,_minmax(48px,_1fr))] items-center gap-4 border-b border-[#8B4513]/10 px-4 py-3">
        <span className="w-8" />
        <span className="text-sm font-medium text-[#8B4513]">Habit</span>
        {[...Array(7)].map((_, i) => {
          const { day, date } = getDayLabel(i);
          const isToday = new Date().getDate() === date;
          return (
            <div key={i} className="text-center">
              <div
                className={`text-xs ${
                  isToday ? "text-[#8B4513]" : "text-[#8B4513]/40"
                }`}
              >
                {day}
              </div>
              <div
                className={`text-sm font-medium ${
                  isToday
                    ? "text-[#8B4513] bg-[#8B4513]/10 rounded-full px-2"
                    : "text-[#8B4513]/60"
                }`}
              >
                {date}
              </div>
            </div>
          );
        })}
      </div>

      <div className="divide-y divide-[#8B4513]/5">
        <AnimatePresence initial={false}>
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
                aria-expanded={expandedCategories.has(category)}
              >
                <span
                  className="transition-transform duration-200"
                  style={{
                    transform: expandedCategories.has(category)
                      ? "rotate(0deg)"
                      : "rotate(-90deg)",
                  }}
                >
                  <ChevronDown className="h-4 w-4 text-[#8B4513]/60" />
                </span>
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
                      <HabitRow key={habit.id} habit={habit} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
