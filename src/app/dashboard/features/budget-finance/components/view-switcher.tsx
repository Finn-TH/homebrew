"use client";

import { BarChart3, LayoutDashboard } from "lucide-react";

interface ViewSwitcherProps {
  currentView: "dashboard" | "analytics";
  onViewChange: (view: "dashboard" | "analytics") => void;
}

export default function ViewSwitcher({
  currentView,
  onViewChange,
}: ViewSwitcherProps) {
  return (
    <button
      onClick={() =>
        onViewChange(currentView === "dashboard" ? "analytics" : "dashboard")
      }
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#8B4513] hover:bg-[#8B4513]/10"
    >
      {currentView === "dashboard" ? (
        <>
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </>
      ) : (
        <>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </>
      )}
    </button>
  );
}
