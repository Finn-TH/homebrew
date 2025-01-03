import { createClient } from "@/utils/supabase/server";
import JournalClient from "./components/journal-client";
import { Suspense } from "react";
import { getJournalEntries } from "./journal-actions";

export default async function MentalHealthPage() {
  const entries = await getJournalEntries();

  return (
    <div className="relative mx-auto max-w-7xl p-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#8B4513]">
          Mental Health Journal
        </h1>
      </header>

      <Suspense fallback={<div>Loading your journal...</div>}>
        <JournalClient initialEntries={entries} />
      </Suspense>
    </div>
  );
}
