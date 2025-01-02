import { createClient } from "@/utils/supabase/server";
import JournalClient from "./components/journal-client";
import { Suspense } from "react";

export default async function MentalHealthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Fetch initial data
  const { data: journals } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="relative mx-auto max-w-7xl p-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#8B4513]">
          Mental Health Journal
        </h1>
      </header>

      <Suspense fallback={<div>Loading your journal...</div>}>
        <JournalClient initialEntries={journals || []} />
      </Suspense>
    </div>
  );
}
