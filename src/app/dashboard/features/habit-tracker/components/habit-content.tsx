"use client";

import { useState } from "react";
import { LayoutGrid, BarChart2, Layout } from "lucide-react";
import HabitAnalytics from "./habit-analytics";
import HabitGrid from "../client/habit-grid-client";
import HabitCard from "./habit-card";
import AddHabitButton from "../add-habit/add-habit-button";
import { Habit, HabitRecord } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface HabitContentProps {
  habits: Habit[];
  records: HabitRecord[];
}

export default function HabitContent({ habits, records }: HabitContentProps) {
  const [view, setView] = useState<"grid" | "cards" | "analytics">("grid");

  // Group habits by category
  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  // Format today's date
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(today);

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
            aria-label="Grid view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("cards")}
            className={`p-2 rounded-lg transition-colors ${
              view === "cards"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
            aria-label="Cards view"
          >
            <Layout className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`p-2 rounded-lg transition-colors ${
              view === "analytics"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
            aria-label="Analytics view"
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
          ) : view === "cards" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#8B4513]">
                  {formattedDate}
                </h2>
                <div className="text-sm text-[#8B4513]/60">
                  Track your habits for today
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={{
                      id: habit.id,
                      name: habit.title,
                      category: habit.category,
                      streak: habit.current_streak,
                      progress: (habit.total_completions / 30) * 100,
                    }}
                    records={records.filter((r) => r.habit_id === habit.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <HabitAnalytics habits={habits} records={records} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
