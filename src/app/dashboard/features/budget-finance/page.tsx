import { createClient } from "@/utils/supabase/server";
import { Category, Transaction, SavingsGoal } from "./types";
import BudgetOverview from "./components/budget-overview";
import RecentTransactions from "./components/recent-transactions";
import ExpenseCategories from "./components/expense-categories";
import SavingsGoals from "./components/savings-goals";
import QuickExpense from "./components/quick-expense";
import { startOfWeek, endOfWeek } from "date-fns";

export default async function BudgetFinancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch all required data
  const { data: settings } = await supabase
    .from("budget_user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const monthlyBudget = settings?.monthly_budget || 3000; // Default to 3000 if not set

  // Get start and end of current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Fetch only this week's transactions
  const { data: transactions } = await supabase
    .from("budget_transactions")
    .select("*, category:budget_categories(*)")
    .gte("date", weekStart.toISOString())
    .lte("date", weekEnd.toISOString())
    .order("date", { ascending: false });

  // Fetch all categories
  const { data: categories } = await supabase
    .from("budget_categories")
    .select("*");

  const { data: savingsGoals } = await supabase
    .from("budget_savings_goals")
    .select("*")
    .eq("user_id", user.id)
    .returns<SavingsGoal[]>();

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513]">Budget & Finance</h1>
        <QuickExpense categories={categories || []} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Monthly Overview & Recent Transactions */}
        <div className="col-span-8 space-y-8">
          <div className="bg-white/80 rounded-xl p-6">
            <BudgetOverview
              transactions={transactions || []}
              monthlyBudget={monthlyBudget}
            />
          </div>
          <div className="bg-white/80 rounded-xl p-6">
            <RecentTransactions
              transactions={transactions || []}
              categories={categories || []}
            />
          </div>
        </div>

        {/* Right Column - Savings Goals & Expense Categories */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white/80 rounded-xl p-6">
            <SavingsGoals goals={savingsGoals || []} />
          </div>
          <div className="bg-white/80 rounded-xl p-6">
            <ExpenseCategories
              categories={categories || []}
              transactions={transactions || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
