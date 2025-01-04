"use client";

import { Todo } from "../types";
import { BarChart3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { priorities } from "./shared/todo-utils";

interface TodoAnalyticsProps {
  todos: Todo[];
}

export function TodoAnalytics({ todos }: TodoAnalyticsProps) {
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    overdue: todos.filter((t) => {
      const dueDate = t.due_date ? new Date(t.due_date) : null;
      return dueDate && dueDate < new Date() && !t.completed;
    }).length,
    byPriority: priorities.reduce(
      (acc, { value }) => ({
        ...acc,
        [value]: todos.filter((t) => t.priority === value).length,
      }),
      {} as Record<string, number>
    ),
  };

  const completionRate = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Tasks */}
      <div className="bg-white rounded-xl border border-[#8B4513]/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-[#8B4513]/60">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Total Tasks</span>
        </div>
        <p className="text-2xl font-semibold text-[#8B4513]">{stats.total}</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl border border-[#8B4513]/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Completion Rate</span>
        </div>
        <p className="text-2xl font-semibold text-green-600">
          {completionRate}%
        </p>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white rounded-xl border border-[#8B4513]/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Overdue</span>
        </div>
        <p className="text-2xl font-semibold text-red-600">{stats.overdue}</p>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-xl border border-[#8B4513]/10 p-4 space-y-3">
        <div className="flex items-center gap-2 text-[#8B4513]/60">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Priority Distribution</span>
        </div>
        <div className="space-y-2">
          {priorities.map(({ value, label, color }) => (
            <div key={value} className="flex items-center justify-between">
              <span className={`text-sm ${color}`}>{label}</span>
              <span className={`text-sm font-medium ${color}`}>
                {stats.byPriority[value]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
