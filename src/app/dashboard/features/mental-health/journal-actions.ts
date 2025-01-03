"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { JournalEntry, Mood } from "./types";
import { startOfWeek, endOfWeek } from "date-fns";

export async function createJournalEntry(data: {
  content: string;
  mood: Mood | null;
  gratitude: string | null;
  activities: string[];
}) {
  const supabase = await createClient();

  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .insert({
      content: data.content,
      mood: data.mood,
      gratitude: data.gratitude,
      activities: data.activities,
    })
    .select()
    .single();

  if (entryError) throw entryError;

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
    .select("*")
    .order("created_at", { ascending: false })
    .returns<JournalEntry[]>();

  if (entriesError) throw entriesError;
  return entries;
}

export async function getCurrentWeekEntries() {
  const supabase = await createClient();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .gte("created_at", weekStart.toISOString())
    .lte("created_at", weekEnd.toISOString())
    .order("created_at", { ascending: false })
    .returns<JournalEntry[]>();

  if (error) throw error;
  return entries;
}
