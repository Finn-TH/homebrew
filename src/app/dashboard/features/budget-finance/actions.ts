"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Category, Transaction, SavingsGoal } from "./types";
import { getTransactionAmount } from "./utils/money";

export async function addTransaction(formData: FormData): Promise<void> {
  try {
    const rawAmount = parseFloat(formData.get("amount") as string);
    const category_id = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as "income" | "expense";
    const date = formData.get("date") as string;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const amount = getTransactionAmount(rawAmount, type);

    const { error } = await supabase.from("budget_transactions").insert({
      user_id: user.id,
      category_id,
      type,
      amount,
      description,
      date: date || new Date().toISOString(),
    });

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to add transaction:", error);
    throw error;
  }
}

export async function addSavingsGoal(formData: FormData): Promise<void> {
  try {
    const name = formData.get("name") as string;
    const target_amount = parseFloat(formData.get("target_amount") as string);
    const target_date = formData.get("target_date") as string;
    const color = formData.get("color") as string;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("budget_savings_goals").insert({
      user_id: user.id,
      name,
      target_amount,
      current_amount: 0,
      target_date,
      color,
    });

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to add savings goal:", error);
    throw error;
  }
}

export async function updateMonthlyBudget(formData: FormData): Promise<void> {
  try {
    const monthlyBudget = parseFloat(formData.get("monthly_budget") as string);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("budget_user_settings").upsert(
      {
        user_id: user.id,
        monthly_budget: monthlyBudget,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to update monthly budget:", error);
    throw error;
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("budget_transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Add this for security

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw error;
  }
}
