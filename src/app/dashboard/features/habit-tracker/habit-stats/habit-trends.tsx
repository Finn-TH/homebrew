"use client";

import { HabitRecord } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HabitTrendsProps {
  records: HabitRecord[];
}

export default function HabitTrends({ records }: HabitTrendsProps) {
  const getLastFourWeeks = () => {
    const weeks = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (21 - i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekRecords = records.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= weekStart && recordDate <= weekEnd;
      });

      const completedDays = weekRecords.filter(
        (r) => r.status === "completed"
      ).length;
      const completionRate = Math.round((completedDays / 7) * 100);

      weeks.push({
        week: `Week ${i + 1}`,
        completionRate,
      });
    }

    return weeks;
  };

  const data = getLastFourWeeks();

  return (
    <div className="mt-8">
      <h3 className="text-xl text-[#8B4513] mb-6">Completion Trends</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="week"
              stroke="#8B4513"
              fontSize={14}
              tickLine={false}
              axisLine={{ stroke: "#8B4513", strokeWidth: 0.5 }}
            />
            <YAxis
              stroke="#8B4513"
              fontSize={14}
              tickLine={false}
              axisLine={{ stroke: "#8B4513", strokeWidth: 0.5 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white rounded-lg shadow-lg p-3 border border-[#8B4513]/10">
                      <p className="text-[#8B4513] font-medium mb-1">
                        {payload[0].payload.week}
                      </p>
                      <p className="text-orange-500">
                        Completion Rate : {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="completionRate"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
