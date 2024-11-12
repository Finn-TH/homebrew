"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase sign out error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }

  // Perform redirect outside of try-catch
  redirect("/");
}
