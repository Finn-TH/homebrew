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
import { ChevronLeft, ChevronRight, Coffee } from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
}

interface JournalCalendarProps {
  entries: JournalEntry[];
}

export default function JournalCalendar({ entries }: JournalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayEntry = (day: Date) =>
    entries.find((entry) => isSameDay(new Date(entry.date), day));

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
        {days.map((day, dayIdx) => {
          const entry = getDayEntry(day);
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-4 bg-white ${
                !isSameMonth(day, currentDate) ? "opacity-50" : ""
              }`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm ${
                    entry ? "font-medium text-[#8B4513]" : "text-[#8B4513]/60"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {entry && (
                  <div className="flex mt-2">
                    {Array.from({ length: entry.mood }).map((_, i) => (
                      <span key={i} className="text-[#8B4513]">
                        ☕️
                      </span>
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
