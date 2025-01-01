import { createClient } from "@/utils/supabase/server";
import BudgetClient from "./components/budget-client";
import {
  calculateMonthlyTotals,
  filterTransactionsByMonth,
} from "./utils/calculations";

export default async function BudgetFinancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch settings
  const { data: settings } = await supabase
    .from("budget_user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch transactions
  const { data: transactions } = await supabase
    .from("budget_transactions")
    .select("*, category:budget_categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("user_id", user.id);

  // Fetch savings goals
  const { data: savingsGoals } = await supabase
    .from("budget_savings_goals")
    .select("*")
    .eq("user_id", user.id);

  const monthlyBudget = settings?.monthly_budget || 3000;

  // Calculate monthly totals
  const currentDate = new Date();
  const monthlyTransactions = filterTransactionsByMonth(
    transactions || [],
    currentDate
  );
  const { income: monthlyIncome, expenses: monthlyExpenses } =
    calculateMonthlyTotals(monthlyTransactions);

  return (
    <BudgetClient
      transactions={transactions || []}
      categories={categories || []}
      savingsGoals={savingsGoals || []}
      monthlyBudget={monthlyBudget}
      monthlyExpenses={monthlyExpenses}
      monthlyIncome={monthlyIncome}
    />
  );
}
