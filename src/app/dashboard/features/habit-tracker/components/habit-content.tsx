"use client";

import { useState } from "react";
import { Plus, LayoutGrid, BarChart2 } from "lucide-react";
import HabitAnalytics from "./habit-analytics";
import HabitGrid from "../client/habit-grid-client";
import AddHabitButton from "../add-habit/add-habit-button";
import { Habit, HabitRecord } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface HabitContentProps {
  habits: Habit[];
  records: HabitRecord[];
}

export default function HabitContent({ habits, records }: HabitContentProps) {
  const [view, setView] = useState<"grid" | "analytics">("grid");

  // Group habits by category
  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${
              view === "grid"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`p-2 rounded-lg transition-colors ${
              view === "analytics"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>

        <AddHabitButton />
      </div>

      {/* Main Content with Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {view === "grid" ? (
            <HabitGrid initialHabits={groupedHabits} habitRecords={records} />
          ) : (
            <HabitAnalytics habits={habits} records={records} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
