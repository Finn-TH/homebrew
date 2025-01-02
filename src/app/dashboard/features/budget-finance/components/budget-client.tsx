"use client";

import { useState } from "react";
import { BarChart3, LayoutDashboard } from "lucide-react";
import BudgetOverview from "./budget-overview";
import RecentTransactions from "./recent-transactions";
import ExpenseCategories from "./expense-categories";
import SavingsGoals from "./savings-goals";
import QuickExpense from "./quick-expense";
import AnalyticsWrapper from "../server/analytics-wrapper";
import { Category, Transaction, SavingsGoal } from "../types";

interface BudgetClientProps {
  transactions: Transaction[];
  categories: Category[];
  savingsGoals: SavingsGoal[];
  monthlyBudget: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export default function BudgetClient({
  transactions,
  categories,
  savingsGoals,
  monthlyBudget,
  monthlyExpenses,
  monthlyIncome,
}: BudgetClientProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "analytics">(
    "dashboard"
  );

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#8B4513]">
          Budget & Finance
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setCurrentView(
                currentView === "dashboard" ? "analytics" : "dashboard"
              )
            }
            className="flex items-center gap-2 px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/10 rounded-lg"
          >
            {currentView === "dashboard" ? (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </>
            )}
          </button>
          <QuickExpense categories={categories} />
        </div>
      </div>

      {currentView === "dashboard" ? (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
              <BudgetOverview
                transactions={transactions}
                monthlyBudget={monthlyBudget}
              />
            </div>
            <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
              <RecentTransactions
                transactions={transactions}
                categories={categories}
              />
            </div>
          </div>
          <div className="col-span-4 space-y-8">
            <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
              <SavingsGoals
                goals={savingsGoals}
                monthlyBudget={monthlyBudget}
                monthlyExpenses={monthlyExpenses}
                monthlyIncome={monthlyIncome}
              />
            </div>
            <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
              <ExpenseCategories
                categories={categories}
                transactions={transactions}
              />
            </div>
          </div>
        </div>
      ) : (
        <AnalyticsWrapper
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          goals={savingsGoals}
        />
      )}
    </div>
  );
}
