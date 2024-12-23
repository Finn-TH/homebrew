"use client";

import { Calendar, CalendarDays } from "lucide-react";

export default function ViewToggle({
  view,
  onViewChange,
}: {
  view: "week" | "month";
  onViewChange: (view: "week" | "month") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-[#8B4513]/10 p-1 bg-white">
      <button
        onClick={() => onViewChange("week")}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
          view === "week"
            ? "bg-[#8B4513] text-white"
            : "text-[#8B4513] hover:bg-[#8B4513]/5"
        }`}
      >
        <Calendar className="h-4 w-4" />
        Week
      </button>
      <button
        onClick={() => onViewChange("month")}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
          view === "month"
            ? "bg-[#8B4513] text-white"
            : "text-[#8B4513] hover:bg-[#8B4513]/5"
        }`}
      >
        <CalendarDays className="h-4 w-4" />
        Month
      </button>
    </div>
  );
}
