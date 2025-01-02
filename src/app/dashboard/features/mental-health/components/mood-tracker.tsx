"use client";

import { useState } from "react";
import { Coffee } from "lucide-react";

const MOOD_LEVELS = [
  { value: 1, label: "Rough", emoji: "😔" },
  { value: 2, label: "Mild", emoji: "😐" },
  { value: 3, label: "Balanced", emoji: "🙂" },
  { value: 4, label: "Good", emoji: "😊" },
  { value: 5, label: "Excellent", emoji: "😄" },
];

export default function MoodTracker() {
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);

  const handleMoodClick = (value: number) => {
    setMood(mood === value ? null : value);
  };

  const handleEnergyClick = (value: number) => {
    setEnergy(energy === value ? null : value);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#8B4513]/70">Mood Level</h3>
        <div className="flex gap-2">
          {MOOD_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handleMoodClick(level.value)}
              className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                mood === level.value
                  ? "bg-[#8B4513] text-white"
                  : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
              }`}
              title={level.label}
            >
              <span className="text-xl">{level.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#8B4513]/70">Energy Level</h3>
        <div className="flex gap-2">
          {MOOD_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handleEnergyClick(level.value)}
              className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                energy && level.value <= energy
                  ? "bg-[#8B4513] text-white"
                  : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
              }`}
              title={`Energy Level ${level.value}`}
            >
              <Coffee
                className={`w-5 h-5 ${
                  energy && level.value <= energy
                    ? "fill-white"
                    : "fill-[#8B4513]/10"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
