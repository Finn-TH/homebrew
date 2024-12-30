"use server";

import { createClient } from "@/utils/supabase/server";

export async function searchFood(query: string) {
  if (query.length < 2) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nutri_common_foods")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Error searching foods:", error);
    return [];
  }

  return data || [];
}
