"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { JournalEntry, Mood } from "./types";
import { startOfWeek, endOfWeek } from "date-fns";

export async function createJournalEntry(data: {
  title: string | null;
  content: string;
  mood: Mood | null;
  gratitude: string | null;
  activities: string[];
}) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      title: data.title,
      content: data.content,
      mood: data.mood,
      gratitude: data.gratitude,
      activities: data.activities,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating journal entry:", error);
    throw error;
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

export async function deleteJournalEntry(entryId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId);

  if (error) {
    console.error("Error deleting journal entry:", error);
    throw error;
  }

  revalidatePath("/dashboard/mental-health");
}
