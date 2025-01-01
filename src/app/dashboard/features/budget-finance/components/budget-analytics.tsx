"use client";

import { Transaction } from "../types";
import { format, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "../utils/money";
import {
  filterTransactionsByMonth,
  calculateMonthlyTotals,
  calculateSavings,
} from "../utils/calculations";

interface BudgetAnalyticsProps {
  transactions: Transaction[];
  monthlyBudget: number;
}

export default function BudgetAnalytics({
  transactions,
  monthlyBudget,
}: BudgetAnalyticsProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use centralized calculations
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions,
    currentDate
  );
  const monthlyTotals = calculateMonthlyTotals(currentMonthTransactions);
  const { netSavings, savingsRate } = calculateSavings(
    monthlyTotals.income,
    monthlyTotals.expenses
  );

  return (
    <div className="space-y-8">
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate((prev) => subMonths(prev, 1))}
            className="p-2 hover:bg-[#8B4513]/10 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-[#8B4513]" />
          </button>
          <h2 className="text-2xl font-semibold text-[#8B4513]">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
            className="p-2 hover:bg-[#8B4513]/10 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-[#8B4513]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-white/50">
            <h3 className="text-sm font-medium text-[#8B4513]/70 mb-1">
              Income
            </h3>
            <p className="text-3xl font-semibold text-[#4ade80]">
              {formatMoney(monthlyTotals.income)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/50">
            <h3 className="text-sm font-medium text-[#8B4513]/70 mb-1">
              Net Savings
            </h3>
            <p
              className={`text-3xl font-semibold ${
                netSavings >= 0 ? "text-[#4ade80]" : "text-[#f87171]"
              }`}
            >
              {formatMoney(netSavings, { showSign: true })}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/50">
            <h3 className="text-sm font-medium text-[#8B4513]/70 mb-1">
              Expenses
            </h3>
            <p className="text-3xl font-semibold text-[#f87171]">
              {formatMoney(monthlyTotals.expenses)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/50">
            <h3 className="text-sm font-medium text-[#8B4513]/70 mb-1">
              Savings Rate
            </h3>
            <p className="text-3xl font-semibold text-[#8B4513]">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
