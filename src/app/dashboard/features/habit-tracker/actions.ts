"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Frequency } from "./types";

export async function addHabit(formData: FormData): Promise<void> {
  try {
    const title = formData.get("title") as string;
    const frequency = formData.get("frequency") as Frequency;
    const target = parseInt(formData.get("target") as string);
    const category = formData.get("category") as string;
    const startDate = formData.get("start_date") as string;

    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("habits").insert([
      {
        title: title.trim(),
        user_id: user.id,
        frequency: frequency || "daily",
        target: target || 1,
        current: 0,
        streak: 0,
        category: category?.trim(),
        start_date: startDate || new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    revalidatePath("/dashboard/features/habit-tracker");
  } catch (error) {
    console.error("Failed to add habit:", error);
    throw error;
  }
}
