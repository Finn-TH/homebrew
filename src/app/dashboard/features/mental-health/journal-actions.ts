"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { JournalEntry, Activity, Mood } from "./types";

interface JournalEntryWithActivities extends JournalEntry {
  journal_entry_activities: {
    activity: Activity;
  }[];
}

export async function createJournalEntry(data: {
  content: string;
  mood: Mood | null;
  gratitude: string | null;
  activities: Activity[];
}) {
  const supabase = await createClient();

  // Start a transaction
  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .insert({
      content: data.content,
      mood: data.mood,
      gratitude: data.gratitude,
    })
    .select()
    .single();

  if (entryError) throw entryError;

  if (data.activities.length > 0) {
    const activities = data.activities.map((activity) => ({
      journal_entry_id: entry.id,
      activity,
    }));

    const { error: activitiesError } = await supabase
      .from("journal_entry_activities")
      .insert(activities);

    if (activitiesError) throw activitiesError;
  }

  revalidatePath("/dashboard/mental-health");
  return entry;
}

export async function updateDailyMood(mood: Mood) {
  const supabase = await createClient();

  const { error } = await supabase.from("journal_daily_moods").upsert({
    mood,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  revalidatePath("/dashboard/mental-health");
}

export async function getJournalEntries() {
  const supabase = await createClient();

  const { data: entries, error: entriesError } = await supabase
    .from("journal_entries")
    .select(
      `
      *,
      journal_entry_activities (
        activity
      )
    `
    )
    .order("created_at", { ascending: false })
    .returns<JournalEntryWithActivities[]>();

  if (entriesError) throw entriesError;

  return entries.map((entry: JournalEntryWithActivities) => ({
    ...entry,
    activities: entry.journal_entry_activities?.map((a) => a.activity) || [],
  }));
}
