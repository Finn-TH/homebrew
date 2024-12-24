"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ListTodo } from "lucide-react";
import WorkoutsDisplay from "./workouts-display";
import WeeklyView from "./weekly-view";
import AddWorkoutButton from "../add-workout/add-workout-button";

export default function WorkoutContent() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-3">
          <AddWorkoutButton />
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20 transition-colors">
            Full Body
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20 transition-colors">
            Upper Body
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20 transition-colors">
            Lower Body
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#8B4513]/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === "daily"
                ? "bg-white text-[#8B4513] shadow-sm"
                : "text-[#8B4513]/60 hover:text-[#8B4513]"
            }`}
          >
            <ListTodo className="h-4 w-4" />
            <span className="text-sm">Daily</span>
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === "weekly"
                ? "bg-white text-[#8B4513] shadow-sm"
                : "text-[#8B4513]/60 hover:text-[#8B4513]"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm">Weekly</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border border-[#8B4513]/10 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-[#8B4513] mb-4">
            {viewMode === "daily" ? "Today's Workout" : "This Week"}
          </h2>
          {viewMode === "daily" ? <WorkoutsDisplay /> : <WeeklyView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
