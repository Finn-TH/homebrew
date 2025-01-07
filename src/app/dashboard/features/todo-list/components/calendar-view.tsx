"use client";

import { Todo } from "../types";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { motion } from "framer-motion";

interface CalendarViewProps {
  todos: Todo[];
}

export function CalendarView({ todos }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const todosByDate = todos.reduce((acc, todo) => {
    if (!todo.due_date) return acc;
    const date = format(new Date(todo.due_date), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#8B4513]/10 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-[#8B4513]/60"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayTodos = todosByDate[dateKey] || [];

          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="aspect-square p-2 border border-[#8B4513]/10 rounded-lg hover:bg-[#8B4513]/5"
            >
              <div className="text-sm text-[#8B4513]/60">
                {format(day, "d")}
              </div>
              {dayTodos.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="text-xs truncate px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          todo.priority === "high"
                            ? "#FEE2E2"
                            : todo.priority === "medium"
                            ? "#FEF3C7"
                            : "#DCFCE7",
                        color:
                          todo.priority === "high"
                            ? "#DC2626"
                            : todo.priority === "medium"
                            ? "#D97706"
                            : "#16A34A",
                      }}
                    >
                      {todo.title}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
