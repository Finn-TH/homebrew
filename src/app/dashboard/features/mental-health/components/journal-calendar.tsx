"use client";

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JournalEntry, MOOD_EMOJIS } from "../types";

interface JournalCalendarProps {
  entries: JournalEntry[];
}

export default function JournalCalendar({ entries }: JournalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayEntries = (day: Date) =>
    entries?.filter((entry) => isSameDay(new Date(entry.created_at), day)) ||
    [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#8B4513]">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate((date) => subMonths(date, 1))}
            className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#8B4513]" />
          </button>
          <button
            onClick={() => setCurrentDate((date) => addMonths(date, 1))}
            className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#8B4513]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#8B4513]/10 rounded-lg overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-[#8B4513]/70 bg-white"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEntries = getDayEntries(day);
          const hasEntries = dayEntries.length > 0;

          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-4 bg-white ${
                !isSameMonth(day, currentDate) ? "opacity-50" : ""
              } ${hasEntries ? "cursor-pointer hover:bg-[#8B4513]/5" : ""}`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm ${
                    hasEntries
                      ? "font-medium text-[#8B4513]"
                      : "text-[#8B4513]/60"
                  }`}
                >
                  {format(day, "d")}
                </span>

                {hasEntries && (
                  <div className="mt-2 space-y-1">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-1 text-xs"
                      >
                        {entry.mood && (
                          <span title={entry.mood}>
                            {MOOD_EMOJIS[entry.mood]}
                          </span>
                        )}
                        <span className="text-[#8B4513] truncate">
                          {entry.title ||
                            format(new Date(entry.created_at), "h:mm a")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
