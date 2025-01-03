"use client";

import { useState } from "react";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { JournalEntry, MOOD_EMOJIS } from "../types";

interface JournalHybridViewProps {
  entries: JournalEntry[];
}

export default function JournalHybridView({ entries }: JournalHybridViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayEntries = (day: Date) =>
    entries.filter((entry) => isSameDay(new Date(entry.created_at), day));

  const selectedDayEntries = getDayEntries(selectedDate);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Mini Calendar */}
      <div className="col-span-4 bg-white rounded-lg p-4 shadow-sm border border-[#8B4513]/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#8B4513]">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setSelectedDate(
                  (prev) => new Date(prev.setMonth(prev.getMonth() - 1))
                )
              }
              className="p-1.5 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#8B4513]" />
            </button>
            <button
              onClick={() =>
                setSelectedDate(
                  (prev) => new Date(prev.setMonth(prev.getMonth() + 1))
                )
              }
              className="p-1.5 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#8B4513]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={`day-header-${index}`}
                className="text-xs font-medium text-[#8B4513]/70"
              >
                {day[0]}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEntries = getDayEntries(day);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square p-1 rounded-lg text-sm
                  ${
                    isSelected
                      ? "bg-[#8B4513] text-white"
                      : "hover:bg-[#8B4513]/5"
                  }
                  ${dayEntries.length > 0 ? "font-medium" : "text-[#8B4513]/60"}
                `}
              >
                {format(day, "d")}
                {dayEntries.length > 0 && (
                  <div className="h-1 w-1 bg-current rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Entries List */}
      <motion.div
        className="col-span-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-[#8B4513]">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedDayEntries.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-[#8B4513]/60 border border-[#8B4513]/10">
                No entries for this day
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {selectedDayEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-6 shadow-sm border border-[#8B4513]/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          {entry.title && (
                            <h4 className="text-lg font-medium text-[#8B4513]">
                              {entry.title}
                            </h4>
                          )}
                          <div className="flex items-center gap-2">
                            {entry.mood && (
                              <span className="text-xl" title={entry.mood}>
                                {MOOD_EMOJIS[entry.mood]}
                              </span>
                            )}
                            <span className="text-sm text-[#8B4513]/70">
                              {format(new Date(entry.created_at), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div className="prose prose-brown max-w-none mb-4">
                          <div
                            dangerouslySetInnerHTML={{ __html: entry.content }}
                          />
                        </div>

                        {entry.gratitude && (
                          <div className="bg-[#8B4513]/5 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-[#8B4513] mb-2">
                              Gratitude
                            </h5>
                            <p className="text-[#8B4513]/70">
                              {entry.gratitude}
                            </p>
                          </div>
                        )}

                        {entry.activities && entry.activities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {entry.activities.map((activity) => (
                              <span
                                key={activity}
                                className="px-2 py-1 text-sm rounded-full bg-[#8B4513]/10 text-[#8B4513]"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
