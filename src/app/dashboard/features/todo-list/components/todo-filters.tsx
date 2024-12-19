"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Check, Settings2 } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react";
import { FilterOption, SortOption, FilterOptionItem } from "../types";
import {
  ListIcon,
  CircleIcon,
  CheckCircleIcon,
  CalendarIcon,
  AlertCircleIcon,
  CalendarClockIcon,
  CalendarXIcon,
} from "lucide-react";

interface TodoFiltersProps {
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  currentFilter: FilterOption;
  currentSort: SortOption;
}

const filterOptions: FilterOptionItem[] = [
  { value: "all", label: "All Tasks", icon: <ListIcon className="h-4 w-4" /> },
  {
    group: "Status",
    options: [
      {
        value: "active",
        label: "Active",
        icon: <CircleIcon className="h-4 w-4" />,
      },
      {
        value: "completed",
        label: "Completed",
        icon: <CheckCircleIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    group: "Due Date",
    options: [
      {
        value: "overdue",
        label: "Overdue",
        icon: <AlertCircleIcon className="h-4 w-4 text-red-600" />,
      },
      {
        value: "due-today",
        label: "Due Today",
        icon: <CalendarIcon className="h-4 w-4 text-[#8B4513]" />,
      },
      {
        value: "upcoming",
        label: "Upcoming",
        icon: <CalendarClockIcon className="h-4 w-4 text-[#8B4513]" />,
      },
      {
        value: "no-date",
        label: "No Date",
        icon: <CalendarXIcon className="h-4 w-4 text-[#8B4513]/60" />,
      },
    ],
  },
  {
    group: "Priority",
    options: [
      { value: "high", label: "High Priority", className: "text-red-600" },
      {
        value: "medium",
        label: "Medium Priority",
        className: "text-yellow-600",
      },
      { value: "low", label: "Low Priority", className: "text-green-600" },
    ],
  },
];

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
          className="flex items-center gap-2 text-[#8B4513] bg-[#8B4513]/5 
                   hover:bg-[#8B4513]/10 rounded-full px-3 py-1.5 
                   transition-colors focus:outline-none"
        >
          <Settings2 className="h-4 w-4" />
          <span className="font-medium">Options</span>
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
                {filterOptions.map((option, index) => (
                  <Fragment
                    key={`filter-${index}-${
                      "group" in option ? option.group : option.value
                    }`}
                  >
                    {/* Add separator before groups, except the first item */}
                    {index > 0 && "group" in option && (
                      <DropdownMenu.Separator className="my-1 h-px bg-[#8B4513]/10" />
                    )}

                    {"group" in option ? (
                      <div>
                        <div className="px-2 py-1.5 text-xs text-[#8B4513]/40 font-medium">
                          {option.group}
                        </div>
                        {option.options.map((subOption) => (
                          <DropdownMenu.Item
                            key={subOption.value}
                            onClick={() => onFilterChange(subOption.value)}
                            className="flex items-center justify-between px-2 py-1.5 text-sm 
                                     outline-none cursor-pointer hover:bg-[#8B4513]/5 rounded-sm"
                          >
                            <span
                              className={`flex items-center gap-2 ${
                                subOption.className || "text-[#8B4513]"
                              }`}
                            >
                              {subOption.icon}
                              {subOption.label}
                            </span>
                            {currentFilter === subOption.value && (
                              <Check className="h-4 w-4" />
                            )}
                          </DropdownMenu.Item>
                        ))}
                      </div>
                    ) : (
                      <DropdownMenu.Item
                        key={option.value}
                        onClick={() => onFilterChange(option.value)}
                        className="flex items-center justify-between px-2 py-1.5 text-sm 
                                 outline-none cursor-pointer text-[#8B4513] 
                                 hover:bg-[#8B4513]/5 rounded-sm"
                      >
                        <span className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </span>
                        {currentFilter === option.value && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenu.Item>
                    )}
                  </Fragment>
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
