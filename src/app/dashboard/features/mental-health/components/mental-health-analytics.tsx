"use client";

import { useState } from "react";
import {
  format,
  subDays,
  differenceInDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { JournalEntry, MOOD_EMOJIS } from "../types";
import { Book, Flame, Calendar, TrendingUp } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MentalHealthAnalyticsProps {
  entries: JournalEntry[];
  dailyMoods?: {
    mood: number;
    energy: number;
    created_at: string;
  }[];
}

// Add these color constants at the top
const COLORS = {
  journalMood: {
    line: "#8B4513",
    fill: "rgba(139, 69, 19, 0.1)",
  },
  dailyMood: {
    line: "#A0522D", // Saddle Brown
    fill: "rgba(160, 82, 45, 0.1)",
  },
  energy: {
    line: "#6B8E23", // Olive Drab (greenish)
    fill: "rgba(107, 142, 35, 0.1)",
  },
  moods: {
    happy: "#FFB347", // Pastel Orange
    calm: "#98B4D4", // Pastel Blue
    neutral: "#D3D3D3", // Light Gray
    anxious: "#FFD1DC", // Pastel Pink
    sad: "#CBC3E3", // Pastel Purple
  },
  activities: {
    Exercise: "#8B4513", // Dark Brown
    Nature: "#6B8E23", // Olive Green
    Meditation: "#A0522D", // Saddle Brown
    Therapy: "#CD853F", // Peru
    Reading: "#DEB887", // Burlywood
  },
};

export default function MentalHealthAnalytics({
  entries,
  dailyMoods = [],
}: MentalHealthAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  // Calculate stats
  const totalEntries = entries.length;

  // Calculate streak
  const sortedDates = entries
    .map((entry) => new Date(entry.created_at))
    .sort((a, b) => b.getTime() - a.getTime())
    // Remove duplicate dates
    .filter(
      (date, index, array) => index === 0 || !isSameDay(date, array[index - 1])
    );

  let currentStreak = 0;
  let longestStreak = 0;
  let today = new Date();

  // Calculate current streak
  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const expectedDate = subDays(today, i);

    if (isSameDay(date, expectedDate)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = differenceInDays(sortedDates[i], sortedDates[i + 1]);
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak + 1, currentStreak);

  // Calculate average words per entry
  const averageWords = Math.round(
    entries.reduce((acc, entry) => acc + entry.content.split(" ").length, 0) /
      totalEntries
  );

  // Calculate date range and labels
  const dateRange = timeRange === "week" ? 7 : 30;
  const startDate =
    timeRange === "week" ? subDays(new Date(), 7) : startOfMonth(new Date());
  const endDate = timeRange === "week" ? new Date() : endOfMonth(new Date());

  // Get all days in the range for consistent labels
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Filter entries by date range
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    return entryDate >= startDate && entryDate <= endDate;
  });

  // Create a map of dates to entries for the mood trend
  const entryMap = new Map(
    filteredEntries.map((entry) => [
      format(new Date(entry.created_at), "yyyy-MM-dd"),
      entry,
    ])
  );

  // Prepare mood trend data with consistent dates
  const moodTrendData = daysInRange.map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const entry = entryMap.get(dateKey);
    const moodValues = {
      happy: 5,
      calm: 4,
      neutral: 3,
      anxious: 2,
      angry: 2,
      sad: 1,
    };
    return {
      date: format(date, "MMM d"),
      value: entry?.mood ? moodValues[entry.mood] : null,
    };
  });

  // Prepare data for mood distribution
  const moodCounts = filteredEntries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for activity frequency
  const activityCounts = filteredEntries.reduce((acc, entry) => {
    entry.activities?.forEach((activity) => {
      acc[activity] = (acc[activity] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Prepare daily mood logs data
  const dailyMoodTrendData = daysInRange.map((date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dailyLog = dailyMoods.find(
      (mood) => format(new Date(mood.created_at), "yyyy-MM-dd") === dateKey
    );
    return {
      date: format(date, "MMM d"),
      mood: dailyLog?.mood || null,
      energy: dailyLog?.energy || null,
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/80 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B4513]/10 rounded-lg">
              <Book className="w-5 h-5 text-[#8B4513]" />
            </div>
            <h3 className="text-lg font-medium text-[#8B4513]">
              Total Entries
            </h3>
          </div>
          <p className="text-3xl font-bold text-[#8B4513]">{totalEntries}</p>
        </div>

        <div className="bg-white/80 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B4513]/10 rounded-lg">
              <Flame className="w-5 h-5 text-[#8B4513]" />
            </div>
            <h3 className="text-lg font-medium text-[#8B4513]">
              Current Streak
            </h3>
          </div>
          <p className="text-3xl font-bold text-[#8B4513]">
            {currentStreak} days
          </p>
        </div>

        <div className="bg-white/80 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B4513]/10 rounded-lg">
              <Calendar className="w-5 h-5 text-[#8B4513]" />
            </div>
            <h3 className="text-lg font-medium text-[#8B4513]">
              Longest Streak
            </h3>
          </div>
          <p className="text-3xl font-bold text-[#8B4513]">
            {longestStreak} days
          </p>
        </div>

        <div className="bg-white/80 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8B4513]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#8B4513]" />
            </div>
            <h3 className="text-lg font-medium text-[#8B4513]">Avg. Words</h3>
          </div>
          <p className="text-3xl font-bold text-[#8B4513]">{averageWords}</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setTimeRange("week")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            timeRange === "week"
              ? "bg-[#8B4513] text-white"
              : "text-[#8B4513] hover:bg-[#8B4513]/5"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            timeRange === "month"
              ? "bg-[#8B4513] text-white"
              : "text-[#8B4513] hover:bg-[#8B4513]/5"
          }`}
        >
          Month
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-white/80 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-4">
            Mood Distribution
          </h3>
          <div className="h-[300px]">
            <Pie
              data={{
                labels: Object.keys(moodCounts).map(
                  (mood) =>
                    `${mood} ${MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]}`
                ),
                datasets: [
                  {
                    data: Object.values(moodCounts),
                    backgroundColor: Object.keys(moodCounts).map(
                      (mood) =>
                        COLORS.moods[
                          mood.toLowerCase() as keyof typeof COLORS.moods
                        ]
                    ),
                    borderColor: "white",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      color: "#8B4513",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Activity Frequency */}
        <div className="bg-white/80 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-4">
            Activity Frequency
          </h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: Object.keys(activityCounts),
                datasets: [
                  {
                    data: Object.values(activityCounts),
                    backgroundColor: Object.keys(activityCounts).map(
                      (activity) =>
                        COLORS.activities[
                          activity as keyof typeof COLORS.activities
                        ]
                    ),
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: "#8B4513",
                    },
                    grid: {
                      color: "rgba(139, 69, 19, 0.1)",
                    },
                  },
                  x: {
                    ticks: {
                      color: "#8B4513",
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mood Trends Section - Now side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Journal Entry Moods */}
        <div className="bg-white/80 p-4 rounded-xl">
          <h3 className="text-base font-semibold text-[#8B4513] mb-3">
            Journal Mood Trends
          </h3>
          <Line
            data={{
              labels: moodTrendData.map((d) => d.date),
              datasets: [
                {
                  label: "Journal Moods",
                  data: moodTrendData.map((d) => d.value),
                  borderColor: COLORS.journalMood.line,
                  backgroundColor: COLORS.journalMood.fill,
                  tension: 0.3,
                  fill: true,
                  spanGaps: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 5,
                  ticks: {
                    stepSize: 1,
                    callback: (value) => {
                      const labels = ["", "Low", "", "Neutral", "", "High"];
                      return labels[value as number];
                    },
                  },
                },
              },
            }}
          />
        </div>

        {/* Daily Mood Tracker Logs */}
        <div className="bg-white/80 p-4 rounded-xl">
          <h3 className="text-base font-semibold text-[#8B4513] mb-3">
            Daily Mood & Energy Levels
          </h3>
          <Line
            data={{
              labels: dailyMoodTrendData.map((d) => d.date),
              datasets: [
                {
                  label: "Mood",
                  data: dailyMoodTrendData.map((d) => d.mood),
                  borderColor: COLORS.dailyMood.line,
                  backgroundColor: COLORS.dailyMood.fill,
                  tension: 0.3,
                  fill: true,
                  spanGaps: true,
                },
                {
                  label: "Energy",
                  data: dailyMoodTrendData.map((d) => d.energy),
                  borderColor: COLORS.energy.line,
                  backgroundColor: COLORS.energy.fill,
                  tension: 0.3,
                  fill: true,
                  spanGaps: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    boxWidth: 12,
                    padding: 8,
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 5,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
