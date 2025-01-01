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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("budget_savings_goals").insert({
      user_id: user.id,
      name: formData.get("name"),
      target_amount: parseFloat(formData.get("target_amount") as string),
      current_amount: parseFloat(formData.get("current_amount") as string) || 0,
      target_date: (formData.get("target_date") as string) || null,
      color: (formData.get("color") as string) || "bg-[#A0522D]", // Default to our theme color
    });

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to add savings goal:", error);
    throw error;
  }
}

export async function updateSavingsGoalAmount(
  goalId: string,
  amount: number,
  isContribution: boolean = true
): Promise<void> {
  const supabase = await createClient();

  // Start a transaction to update both savings and budget
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.rpc("update_savings_and_budget", {
    p_goal_id: goalId,
    p_amount: amount,
    p_is_contribution: isContribution,
    p_user_id: user.id,
  });

  if (error) throw error;
  revalidatePath("/dashboard/features/budget-finance");
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // First get the transaction details
    const { data: transaction } = await supabase
      .from("budget_transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (!transaction) throw new Error("Transaction not found");

    // If it's a savings transaction, update the savings goal
    if (transaction.is_savings_transaction) {
      // Extract goal name from description
      const goalName = transaction.description.includes("Withdrawal from")
        ? transaction.description.replace("Withdrawal from ", "")
        : transaction.description.replace("Contribution to ", "");

      // Get the savings goal
      const { data: goal } = await supabase
        .from("budget_savings_goals")
        .select("current_amount")
        .eq("name", goalName)
        .eq("user_id", user.id)
        .single();

      if (goal) {
        // If it was an expense (contribution), subtract from goal
        // If it was income (withdrawal), add back to goal
        const newAmount =
          transaction.type === "expense"
            ? goal.current_amount - transaction.amount
            : goal.current_amount + transaction.amount;

        // Update the savings goal
        await supabase
          .from("budget_savings_goals")
          .update({ current_amount: newAmount })
          .eq("name", goalName)
          .eq("user_id", user.id);
      }
    }

    // Delete the transaction
    const { error } = await supabase
      .from("budget_transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw error;
  }
}

export async function updateSavingsGoal(
  goalId: string,
  amount: number,
  isWithdrawal: boolean
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // Get the goal details
    const { data: goal } = await supabase
      .from("budget_savings_goals")
      .select("name, current_amount")
      .eq("id", goalId)
      .single();

    if (!goal) throw new Error("Goal not found");

    const newAmount = isWithdrawal
      ? Math.max(goal.current_amount - amount, 0)
      : goal.current_amount + amount;

    await supabase
      .from("budget_savings_goals")
      .update({
        current_amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId);

    // Create transaction record with savings flag
    await supabase.from("budget_transactions").insert({
      user_id: user.id,
      amount: amount,
      type: isWithdrawal ? "income" : "expense",
      description: `${isWithdrawal ? "Withdrawal from" : "Contribution to"} ${
        goal.name
      }`,
      date: new Date().toISOString(),
      is_savings_transaction: true,
    });

    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to update savings goal:", error);
    throw error;
  }
}

interface CreateSavingsGoalParams {
  name: string;
  target_amount: number;
  target_date: string | null;
}

export async function createSavingsGoal(
  params: CreateSavingsGoalParams
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("budget_savings_goals").insert({
      user_id: user.id,
      name: params.name,
      target_amount: params.target_amount,
      target_date: params.target_date,
      current_amount: 0,
      color: "#8B4513", // Default color matching our theme
    });

    if (error) throw error;
    revalidatePath("/dashboard/features/budget-finance");
  } catch (error) {
    console.error("Failed to create savings goal:", error);
    throw error;
  }
}
