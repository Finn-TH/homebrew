"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { JournalEntry, Mood, DailyMood } from "./types";
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

export async function saveDailyMood(data: { mood: number; energy: number }) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  // Convert numeric mood to text format
  const moodMap: Record<number, string> = {
    1: "sad",
    2: "anxious",
    3: "neutral",
    4: "calm",
    5: "happy",
  };

  const { error } = await supabase.from("journal_daily_moods").upsert(
    {
      user_id: user.id,
      mood: moodMap[data.mood], // Convert number to mood text
      energy: data.energy,
      created_at: new Date().toISOString().split("T")[0],
    },
    {
      onConflict: "user_id,created_at",
    }
  );

  if (error) {
    console.error("Error saving daily mood:", error);
    throw error;
  }

  revalidatePath("/dashboard/mental-health");
}

export async function getTodaysMood() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("journal_daily_moods")
    .select("*")
    .eq("created_at", today)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (data) {
    // Convert text mood back to number
    const moodToNumber: Record<string, number> = {
      sad: 1,
      anxious: 2,
      neutral: 3,
      calm: 4,
      happy: 5,
    };

    return {
      ...data,
      mood: moodToNumber[data.mood] || null,
    };
  }

  return data;
}

export async function getDailyMoods() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  const startDate = startOfWeek(new Date());
  const endDate = endOfWeek(new Date());

  const { data, error } = await supabase
    .from("journal_daily_moods")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching daily moods:", error);
    throw error;
  }

  // Map text moods to numbers
  const moodValues: Record<string, number> = {
    happy: 5,
    calm: 4,
    neutral: 3,
    anxious: 2,
    sad: 1,
  };

  return data.map((entry) => ({
    ...entry,
    mood: moodValues[entry.mood] || 3, // Default to neutral if unknown mood
    created_at: entry.created_at.split("T")[0], // Clean up timestamp
  }));
}

export async function getAllJournalEntries() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<JournalEntry[]>();

  if (error) throw error;
  return entries;
}
