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

  const { error } = await supabase.from("habit_records").upsert(
    {
      habit_id: habitId,
      date: date,
      status: status,
    },
    {
      onConflict: "habit_id,date",
    }
  );

  if (error) throw error;
  revalidatePath("/dashboard/features/habit-tracker");
}
