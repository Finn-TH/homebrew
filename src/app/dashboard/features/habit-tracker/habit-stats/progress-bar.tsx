"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  // Get color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 60) return "bg-orange-500";
    if (percent >= 40) return "bg-yellow-500";
    if (percent >= 20) return "bg-orange-300";
    return "bg-red-400";
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1.5 w-24 rounded-full bg-[#8B4513]/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getProgressColor(percentage)}`}
        />
      </div>
      <span
        className={`text-xs ${
          percentage === 100
            ? "text-green-600 font-medium"
            : "text-[#8B4513]/60"
        }`}
      >
        {percentage}%
      </span>
    </div>
  );
}
