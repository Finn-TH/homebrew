import { CalendarClock, AlertCircle } from "lucide-react";
import { FilterOption } from "../../types";

interface QuickFiltersProps {
  onFilterChange: (filter: FilterOption) => void;
  overdueTasks: number;
  todayTasks: number;
}

export function QuickFilters({
  onFilterChange,
  overdueTasks,
  todayTasks,
}: QuickFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      {overdueTasks > 0 && (
        <button
          onClick={() => onFilterChange("overdue")}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full 
                   bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
        >
          <AlertCircle className="h-4 w-4" />
          Overdue ({overdueTasks})
        </button>
      )}

      {todayTasks > 0 && (
        <button
          onClick={() => onFilterChange("due-today")}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full 
                   bg-[#8B4513]/5 hover:bg-[#8B4513]/10 text-[#8B4513] transition-colors"
        >
          <CalendarClock className="h-4 w-4" />
          Due Today ({todayTasks})
        </button>
      )}
    </div>
  );
}
