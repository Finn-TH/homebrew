"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Exercise } from "../types";
import { createClient } from "@/utils/supabase/client";

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

// Add this interface to match your database structure
interface DBExercise {
  id: string;
  name: string;
  category: string;
  type: "strength" | "cardio";
  default_sets?: number;
  default_reps?: number;
  default_duration?: number;
}

export default function ExerciseSelector({
  onSelect,
  onClose,
}: ExerciseSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [exercises, setExercises] = useState<DBExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("exercises")
          .select("*")
          .order("name");

        if (error) throw error;
        setExercises(data || []);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleSelect = (dbExercise: DBExercise) => {
    const newExercise: Exercise = {
      name: dbExercise.name,
      type: dbExercise.type,
      ...(dbExercise.type === "strength" && {
        sets: dbExercise.default_sets || 3,
        reps: dbExercise.default_reps || 10,
        weight: 0,
      }),
      ...(dbExercise.type === "cardio" && {
        duration: dbExercise.default_duration || 30,
        distance: 0,
      }),
    };
    onSelect(newExercise);
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      (!selectedCategory || exercise.category === selectedCategory) &&
      (!search || exercise.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#8B4513]">
            Select Exercise
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-[#8B4513]/60 hover:text-[#8B4513]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#8B4513]/10 
                     focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
            />
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8 text-[#8B4513]/60">
              Loading exercises...
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-[#8B4513]/60">
              No exercises found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className="flex items-start p-3 rounded-lg text-left 
                           hover:bg-[#8B4513]/5 transition-colors"
                >
                  <div>
                    <span className="font-medium text-[#8B4513]">
                      {exercise.name}
                    </span>
                    <div className="text-sm text-[#8B4513]/60 mt-1">
                      {exercise.category} • {exercise.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
