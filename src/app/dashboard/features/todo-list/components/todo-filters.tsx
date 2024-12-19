"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, ChevronLeft, Settings2 } from "lucide-react";
import { useState } from "react";

type FilterOption = "all" | "active" | "completed";
type SortOption = "newest" | "oldest" | "priority" | "alphabetical";

interface TodoFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  currentSort: SortOption;
  currentFilter: FilterOption;
}

export default function TodoFilters({
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilter,
}: TodoFiltersProps) {
  const [subMenu, setSubMenu] = useState<"filter" | "sort" | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSubMenu(null);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger
        className="flex items-center gap-2 px-3 py-1.5 text-[#8B4513] 
                                    hover:bg-[#8B4513]/5 rounded-md transition-colors"
      >
        <Settings2 className="h-4 w-4" />
        <span>Options</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-[#4A4A4A] rounded-lg shadow-lg p-2 min-w-[220px] 
                   text-white text-sm animate-in fade-in-0 zoom-in-95"
          onMouseLeave={() => setOpen(false)}
        >
          {/* Back button for submenus */}
          {subMenu && (
            <button
              onClick={() => setSubMenu(null)}
              className="flex items-center gap-2 px-2 py-1.5 w-full text-white/70 
                       hover:text-white hover:bg-white/10 rounded-md mb-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Options
            </button>
          )}

          {/* Main Menu */}
          {!subMenu && (
            <>
              <div
                className="px-3 py-2 rounded-md flex items-center justify-between 
                         hover:bg-white/10 cursor-pointer mb-1"
                onClick={(e) => {
                  e.preventDefault();
                  setSubMenu("filter");
                }}
              >
                <span className="flex items-center gap-2">
                  Filter
                  <span className="text-xs text-white/50">
                    {currentFilter === "all"
                      ? "All Tasks"
                      : currentFilter === "active"
                      ? "Active Tasks"
                      : "Completed Tasks"}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>

              <div
                className="px-3 py-2 rounded-md flex items-center justify-between 
                         hover:bg-white/10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setSubMenu("sort");
                }}
              >
                <span className="flex items-center gap-2">
                  Sort
                  <span className="text-xs text-white/50">
                    {currentSort === "newest"
                      ? "Newest First"
                      : currentSort === "priority"
                      ? "By Priority"
                      : "Alphabetically"}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </>
          )}

          {/* Filter Submenu */}
          {subMenu === "filter" && (
            <div className="space-y-1">
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentFilter === "all"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterChange("all");
                }}
              >
                {currentFilter === "all" && <Check className="h-4 w-4" />}
                <span className="flex-1">All Tasks</span>
              </div>
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentFilter === "active"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterChange("active");
                }}
              >
                {currentFilter === "active" && <Check className="h-4 w-4" />}
                <span className="flex-1">Active Tasks</span>
              </div>
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentFilter === "completed"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterChange("completed");
                }}
              >
                {currentFilter === "completed" && <Check className="h-4 w-4" />}
                <span className="flex-1">Completed Tasks</span>
              </div>
            </div>
          )}

          {/* Sort Submenu */}
          {subMenu === "sort" && (
            <div className="space-y-1">
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentSort === "newest"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSortChange("newest");
                }}
              >
                {currentSort === "newest" && <Check className="h-4 w-4" />}
                <span className="flex-1">Newest First</span>
              </div>
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentSort === "priority"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSortChange("priority");
                }}
              >
                {currentSort === "priority" && <Check className="h-4 w-4" />}
                <span className="flex-1">Sort by Priority</span>
              </div>
              <div
                className={`px-3 py-2 rounded-md flex items-center gap-2 cursor-pointer
                          ${
                            currentSort === "alphabetical"
                              ? "bg-blue-600"
                              : "hover:bg-white/10"
                          }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSortChange("alphabetical");
                }}
              >
                {currentSort === "alphabetical" && (
                  <Check className="h-4 w-4" />
                )}
                <span className="flex-1">Sort Alphabetically</span>
              </div>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
