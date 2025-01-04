"use client";

import { LayoutGrid, BarChart2 } from "lucide-react";

interface ViewSwitcherProps {
  view: "grid" | "analytics";
  onViewChange: (view: "grid" | "analytics") => void;
}

export default function ViewSwitcher({
  view,
  onViewChange,
}: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-[#8B4513]/10">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
          view === "grid"
            ? "bg-[#8B4513] text-white"
            : "text-[#8B4513] hover:bg-[#8B4513]/5"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="text-sm font-medium">Grid</span>
      </button>
      <button
        onClick={() => onViewChange("analytics")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
          view === "analytics"
            ? "bg-[#8B4513] text-white"
            : "text-[#8B4513] hover:bg-[#8B4513]/5"
        }`}
      >
        <BarChart2 className="h-4 w-4" />
        <span className="text-sm font-medium">Analytics</span>
      </button>
    </div>
  );
}
