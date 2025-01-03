"use client";

import { useState, useEffect } from "react";
import { Check, Coffee } from "lucide-react";
import { format } from "date-fns";
import { saveDailyMood, getTodaysMood } from "../journal-actions";
import { useRouter } from "next/navigation";

const MOOD_LEVELS = [
  { value: 1, label: "Rough", emoji: "😔" },
  { value: 2, label: "Mild", emoji: "😐" },
  { value: 3, label: "Balanced", emoji: "🙂" },
  { value: 4, label: "Good", emoji: "😊" },
  { value: 5, label: "Excellent", emoji: "😄" },
];

export default function MoodTracker() {
  const router = useRouter();
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchTodaysMood = async () => {
      setIsLoading(true);
      try {
        const data = await getTodaysMood();
        if (data) {
          setMood(data.mood);
          setEnergy(data.energy);
          setLastUpdated(new Date(data.created_at));
        }
      } catch (error) {
        console.error("Error fetching today's mood:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodaysMood();
  }, []);

  const handleMoodClick = async (value: number) => {
    const newMood = mood === value ? null : value;
    setMood(newMood);

    if (newMood && energy) {
      await saveMoodAndEnergy(newMood, energy);
    }
  };

  const handleEnergyClick = async (value: number) => {
    const newEnergy = energy === value ? null : value;
    setEnergy(newEnergy);

    if (mood && newEnergy) {
      await saveMoodAndEnergy(mood, newEnergy);
    }
  };

  const saveMoodAndEnergy = async (moodValue: number, energyValue: number) => {
    setIsSaving(true);
    try {
      await saveDailyMood({ mood: moodValue, energy: energyValue });
      setLastUpdated(new Date());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      router.refresh();
    } catch (error) {
      console.error("Failed to save mood:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-[#8B4513]">Mood Level</h3>
            {mood && <Check className="w-3 h-3 text-green-600" />}
          </div>
          <div className="flex gap-1.5">
            {MOOD_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => handleMoodClick(level.value)}
                className={`p-3 rounded-lg transition-all ${
                  mood === level.value
                    ? "bg-[#8B4513] shadow-lg scale-105"
                    : "bg-[#8B4513]/10 hover:bg-[#8B4513]/20"
                }`}
                disabled={isSaving}
              >
                <span className="text-xl">{level.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-[#8B4513]">
              Energy Level
            </h3>
            {energy && <Check className="w-3 h-3 text-green-600" />}
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => handleEnergyClick(level)}
                className={`p-3 rounded-lg transition-all ${
                  energy && level <= energy
                    ? "bg-[#8B4513] shadow-lg"
                    : "bg-[#8B4513]/10 hover:bg-[#8B4513]/20"
                }`}
                disabled={isSaving}
              >
                <Coffee
                  className={`w-5 h-5 ${
                    energy && level <= energy ? "text-white" : "text-[#8B4513]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex justify-between items-center text-xs text-[#8B4513]/60">
        <div className="flex items-center gap-2">
          {showSuccess && (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved successfully
            </span>
          )}
        </div>
        {lastUpdated && (
          <span>Last updated: {format(lastUpdated, "h:mm a")}</span>
        )}
      </div>
    </div>
  );
}
