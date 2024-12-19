"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Check, Settings2 } from "lucide-react";
import { useState } from "react";
import { FilterOption, SortOption } from "../types";

interface TodoFiltersProps {
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  currentFilter: FilterOption;
  currentSort: SortOption;
}

const filterOptions = [
  { value: "all", label: "All Tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
] as const;

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "Priority" },
  { value: "alphabetical", label: "Alphabetical" },
] as const;

export default function TodoFilters({
  onFilterChange,
  onSortChange,
  currentFilter,
  currentSort,
}: TodoFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 text-[#8B4513] hover:bg-[#8B4513]/10 
                         rounded-md px-3 py-1.5 transition-colors focus:outline-none"
        >
          <Settings2 className="h-4 w-4 text-[#8B4513]/60" />
          <span className="text-[#8B4513]/60">Options</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[12rem] overflow-hidden rounded-md border 
                   border-[#8B4513]/10 bg-white p-1.5 shadow-md"
          sideOffset={5}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Filter Sub-menu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className="flex w-full items-center justify-between 
                                            px-2 py-1.5 text-sm text-[#8B4513] outline-none 
                                            cursor-pointer hover:bg-[#8B4513]/5 rounded-sm"
            >
              <span>Filter</span>
              <ChevronRight className="h-4 w-4" />
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[8rem] overflow-hidden rounded-md border 
                         border-[#8B4513]/10 bg-white p-1 shadow-md"
              >
                {filterOptions.map((option) => (
                  <DropdownMenu.Item
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className="flex items-center justify-between px-2 py-1.5 text-sm 
                             outline-none cursor-pointer text-[#8B4513] 
                             hover:bg-[#8B4513]/5 rounded-sm"
                  >
                    {option.label}
                    {currentFilter === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          {/* Sort Sub-menu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className="flex w-full items-center justify-between 
                                            px-2 py-1.5 text-sm text-[#8B4513] outline-none 
                                            cursor-pointer hover:bg-[#8B4513]/5 rounded-sm"
            >
              <span>Sort</span>
              <ChevronRight className="h-4 w-4" />
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[8rem] overflow-hidden rounded-md border 
                         border-[#8B4513]/10 bg-white p-1 shadow-md"
              >
                {sortOptions.map((option) => (
                  <DropdownMenu.Item
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className="flex items-center justify-between px-2 py-1.5 text-sm 
                             outline-none cursor-pointer text-[#8B4513] 
                             hover:bg-[#8B4513]/5 rounded-sm"
                  >
                    {option.label}
                    {currentSort === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
