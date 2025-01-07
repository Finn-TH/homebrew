"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ViewSwitcher from "./view-switcher";
import WorkoutsDisplay from "./workouts-display";
import WorkoutAnalytics from "./workout-analytics";
import AddWorkoutButton from "../add-workout/add-workout-button";
import { WorkoutLog } from "../types";

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  duration: 0.2,
  ease: "easeInOut",
};

interface WorkoutContentProps {
  initialWorkouts: WorkoutLog[];
}

export default function WorkoutContent({
  initialWorkouts,
}: WorkoutContentProps) {
  const [view, setView] = useState<"daily" | "weekly" | "analytics">("daily");
  const [[page, direction], setPage] = useState([0, 0]);

  const handleViewChange = (newView: "daily" | "weekly" | "analytics") => {
    const viewOrder = ["daily", "weekly", "analytics"];
    const oldIndex = viewOrder.indexOf(view);
    const newIndex = viewOrder.indexOf(newView);
    const direction = newIndex > oldIndex ? 1 : -1;

    setPage([page + direction, direction]);
    setView(newView);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ViewSwitcher view={view} onChange={handleViewChange} />
        <AddWorkoutButton />
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={view}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full"
          >
            {view === "analytics" ? (
              <WorkoutAnalytics workouts={initialWorkouts} />
            ) : (
              <WorkoutsDisplay
                initialWorkouts={initialWorkouts}
                viewType={view}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
