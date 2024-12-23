"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { HabitStatus } from "./types";

export async function addHabit(formData: FormData): Promise<void> {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;

    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("habits").insert([
      {
        title: title.trim(),
        user_id: user.id,
        category: category?.trim() || "Uncategorized",
      },
    ]);

    if (error) throw error;
    revalidatePath("/dashboard/features/habit-tracker");
  } catch (error) {
    console.error("Failed to add habit:", error);
    throw error;
  }
}

export async function updateHabitStatus(
  habitId: string,
  date: string,
  status: HabitStatus
): Promise<void> {
  const supabase = await createClient();

  // Start a transaction
  const { data: habit } = await supabase
    .from("habits")
    .select("current_streak, longest_streak, total_completions")
    .eq("id", habitId)
    .single();

  if (!habit) throw new Error("Habit not found");

  let { current_streak, longest_streak, total_completions } = habit;

  // Update streak based on new status
  if (status === "completed") {
    current_streak += 1;
    longest_streak = Math.max(longest_streak, current_streak);
    total_completions += 1;
  } else {
    current_streak = 0;
  }

  // Update habit record
  const { error: recordError } = await supabase.from("habit_records").upsert(
    {
      habit_id: habitId,
      date: date,
      status: status,
    },
    {
      onConflict: "habit_id,date",
    }
  );

  if (recordError) throw recordError;

  // Update habit streak data
  const { error: habitError } = await supabase
    .from("habits")
    .update({
      current_streak,
      longest_streak,
      total_completions,
    })
    .eq("id", habitId);

  if (habitError) throw habitError;

  revalidatePath("/dashboard/features/habit-tracker");
}

export async function updateHabit(
  habitId: string,
  updates: {
    title?: string;
    category?: string;
  }
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId);

  if (error) throw error;
  revalidatePath("/dashboard/features/habit-tracker");
}

export async function deleteHabit(habitId: string): Promise<void> {
  const supabase = await createClient();

  // Delete habit records first
  const { error: recordsError } = await supabase
    .from("habit_records")
    .delete()
    .eq("habit_id", habitId);

  if (recordsError) throw recordsError;

  // Then delete the habit
  const { error: habitError } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);

  if (habitError) throw habitError;

  revalidatePath("/dashboard/features/habit-tracker");
}
