import { Suspense } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import JournalClient from "./components/journal-client";
import { getCurrentWeekEntries, getDailyMoods } from "./journal-actions";

export default async function MentalHealthPage() {
  const [entries, dailyMoods] = await Promise.all([
    getCurrentWeekEntries(),
    getDailyMoods(),
  ]);
  const weekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "MMMM d"
  );
  const weekEnd = format(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    "MMMM d, yyyy"
  );

  return (
    <div className="relative mx-auto max-w-7xl p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#8B4513]">
            Mental Health Journal
          </h1>
          <p className="text-[#8B4513]/70">
            Week of {weekStart} - {weekEnd}
          </p>
        </div>
      </header>

      <Suspense fallback={<div>Loading your journal...</div>}>
        <JournalClient initialEntries={entries} dailyMoods={dailyMoods} />
      </Suspense>
    </div>
  );
}
