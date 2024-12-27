"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import WorkoutRow from "../client/workout-row";
import WeeklyView from "./weekly-view";
import { WorkoutLog } from "../types";
import { getUserLocalDate } from "../utils/date";
import { motion } from "framer-motion";
import { Dumbbell, Timer, Activity, Trophy } from "lucide-react";

interface WorkoutsDisplayProps {
  initialWorkouts: WorkoutLog[];
  viewType: "daily" | "weekly";
}

export default function WorkoutsDisplay({
  initialWorkouts,
  viewType,
}: WorkoutsDisplayProps) {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(initialWorkouts);
  const router = useRouter();

  useEffect(() => {
    setWorkouts(initialWorkouts);
  }, [initialWorkouts]);

  // Filter daily workouts
  const dailyWorkouts = workouts.filter((workout) => {
    const today = getUserLocalDate();
    return workout.date === today;
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("workout-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_logs",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // Calculate daily statistics
  const getDailyStats = (workouts: WorkoutLog[]) => {
    const totalExercises = workouts.reduce(
      (sum, workout) => sum + workout.workout_log_exercises.length,
      0
    );

    const strengthExercises = workouts.flatMap((w) =>
      w.workout_log_exercises.filter((e) => e.type === "strength")
    );

    const cardioExercises = workouts.flatMap((w) =>
      w.workout_log_exercises.filter((e) => e.type === "cardio")
    );

    const totalCardioMinutes = cardioExercises.reduce(
      (sum, exercise) => sum + (exercise.duration || 0),
      0
    );

    return {
      totalWorkouts: workouts.length,
      totalExercises,
      strengthExercises: strengthExercises.length,
      cardioMinutes: totalCardioMinutes,
    };
  };

  if (viewType === "weekly") {
    return <WeeklyView workouts={workouts} />;
  }

  const dailyStats = getDailyStats(dailyWorkouts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Daily Summary */}
      {dailyWorkouts.length > 0 && (
        <div className="bg-white/80 rounded-xl p-4">
          <h3 className="text-lg font-medium text-[#8B4513] mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Today's Progress
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#8B4513]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
                <Dumbbell className="h-4 w-4" />
                Workouts
              </div>
              <div className="text-2xl font-semibold text-[#8B4513]">
                {dailyStats.totalWorkouts}
              </div>
            </div>
            <div className="bg-[#8B4513]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
                <Activity className="h-4 w-4" />
                Exercises
              </div>
              <div className="text-2xl font-semibold text-[#8B4513]">
                {dailyStats.totalExercises}
              </div>
            </div>
            <div className="bg-[#8B4513]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
                <Dumbbell className="h-4 w-4" />
                Strength
              </div>
              <div className="text-2xl font-semibold text-[#8B4513]">
                {dailyStats.strengthExercises}
              </div>
            </div>
            <div className="bg-[#8B4513]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-[#8B4513]/60 mb-1">
                <Timer className="h-4 w-4" />
                Cardio
              </div>
              <div className="text-2xl font-semibold text-[#8B4513]">
                {dailyStats.cardioMinutes}
                <span className="text-sm ml-1">min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Workouts List */}
      {dailyWorkouts.length > 0 ? (
        dailyWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WorkoutRow workout={workout} />
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4"
        >
          <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-[#8B4513]/5 flex items-center justify-center">
            <Dumbbell className="h-10 w-10 text-[#8B4513]/40" />
          </div>
          <p className="text-lg font-medium text-[#8B4513]/60">
            No workouts logged today
          </p>
          <p className="text-sm text-[#8B4513]/40 mt-1">
            Click "Add Workout" to get started!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
