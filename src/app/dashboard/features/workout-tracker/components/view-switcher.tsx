"use client";

import { Calendar, Clock, BarChart2 } from "lucide-react";

interface ViewSwitcherProps {
  view: "daily" | "weekly" | "analytics";
  onChange: (view: "daily" | "weekly" | "analytics") => void;
}

export default function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="bg-[#8B4513]/5 p-1 rounded-lg inline-flex">
      <button
        onClick={() => onChange("daily")}
        className={`
          px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium
          transition-colors duration-200
          ${
            view === "daily"
              ? "bg-white text-[#8B4513] shadow-sm"
              : "text-[#8B4513]/60 hover:text-[#8B4513]"
          }
        `}
      >
        <Clock className="h-4 w-4" />
        Daily
      </button>
      <button
        onClick={() => onChange("weekly")}
        className={`
          px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium
          transition-colors duration-200
          ${
            view === "weekly"
              ? "bg-white text-[#8B4513] shadow-sm"
              : "text-[#8B4513]/60 hover:text-[#8B4513]"
          }
        `}
      >
        <Calendar className="h-4 w-4" />
        Weekly
      </button>
      <button
        onClick={() => onChange("analytics")}
        className={`
          px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium
          transition-colors duration-200
          ${
            view === "analytics"
              ? "bg-white text-[#8B4513] shadow-sm"
              : "text-[#8B4513]/60 hover:text-[#8B4513]"
          }
        `}
      >
        <BarChart2 className="h-4 w-4" />
        Analytics
      </button>
    </div>
  );
}
