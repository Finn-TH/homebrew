import { createClient } from "@/utils/supabase/server";
import BudgetOverview from "./components/budget-overview";
import RecentTransactions from "./components/recent-transactions";
import ExpenseCategories from "./components/expense-categories";
import SavingsGoals from "./components/savings-goals";
import QuickExpense from "./components/quick-expense";

export default async function BudgetFinancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative mx-auto max-w-7xl p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#8B4513]">Budget & Finance</h1>
        <QuickExpense />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Overview Card */}
        <div className="col-span-full">
          <BudgetOverview />
        </div>

        {/* Expense Categories */}
        <div className="md:col-span-1">
          <ExpenseCategories />
        </div>

        {/* Savings Goals */}
        <div className="md:col-span-1">
          <SavingsGoals />
        </div>

        {/* Recent Transactions */}
        <div className="col-span-full">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
