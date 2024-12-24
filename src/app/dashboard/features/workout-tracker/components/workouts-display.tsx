"use client";

import { useState, useEffect } from "react";
import WorkoutRow from "../client/workout-row";
import { useRouter } from "next/navigation";

export default function WorkoutsDisplay() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load workouts from localStorage when component mounts
    const loadWorkouts = () => {
      const savedWorkouts = JSON.parse(
        localStorage.getItem("workouts") || "[]"
      );
      setWorkouts(savedWorkouts);
    };

    // Subscribe to storage events to update UI when localStorage changes
    const handleStorageChange = () => {
      loadWorkouts();
      router.refresh();
    };

    loadWorkouts();
    window.addEventListener("storage", handleStorageChange);

    // Custom event for immediate updates
    window.addEventListener("workoutAdded", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("workoutAdded", handleStorageChange);
    };
  }, [router]);

  return workouts.length > 0 ? (
    workouts.map((workout) => <WorkoutRow key={workout.id} workout={workout} />)
  ) : (
    <div className="text-[#8B4513]/60 text-center py-8">
      No workouts logged today. Click "Add Workout" to get started!
    </div>
  );
}
