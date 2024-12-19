"use client";

import React from "react";
import { X } from "lucide-react";
import { FilterOption } from "../types";

interface ActiveViewProps {
  currentFilter: FilterOption;
  onClear: () => void;
}

const filterLabels: Record<FilterOption, string> = {
  all: "All Tasks",
  active: "Active",
  completed: "Completed",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
  overdue: "Overdue",
  "due-today": "Due Today",
  upcoming: "Upcoming",
  "no-date": "No Due Date",
};

export function ActiveView({ currentFilter, onClear }: ActiveViewProps) {
  if (currentFilter === "all") return null;

  return (
    <div className="flex items-center justify-between py-1.5 text-sm text-[#8B4513]/40">
      <span>
        Filter:{" "}
        <span className="text-[#8B4513]/60">{filterLabels[currentFilter]}</span>
      </span>

      <button
        onClick={onClear}
        className="hover:text-[#8B4513] transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
