"use client";

import { Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Check, X } from "lucide-react";
import { useState } from "react";
import { updateMonthlyBudget } from "../actions";
import { useRouter } from "next/navigation";
import { formatMoney } from "../utils/money";
import { calculateMonthlyTotals } from "../utils/calculations";
import { calculateBudgetUsage } from "../utils/calculations";
import { filterTransactionsByMonth } from "../utils/calculations";
import { format } from "date-fns";

interface BudgetOverviewProps {
  transactions: Transaction[];
  monthlyBudget?: number;
}

export default function BudgetOverview({
  transactions,
  monthlyBudget = 3000,
}: BudgetOverviewProps) {
  const currentDate = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions,
    currentDate
  );
  const monthlyTotals = calculateMonthlyTotals(currentMonthTransactions);
  const { totalBudget, usagePercentage } = calculateBudgetUsage(
    monthlyTotals.expenses,
    monthlyBudget,
    monthlyTotals.income
  );

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#8B4513]">
              Monthly Overview · {formatMoney(totalBudget)}
            </h2>
            {monthlyTotals.income > 0 && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {formatMoney(monthlyTotals.income, { showSign: true })}
              </span>
            )}
          </div>
          <span className="text-sm text-[#8B4513]/70">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-[#8B4513]/70 mb-2">
            <span>Monthly Budget</span>
            <span>{usagePercentage.toFixed(0)}% used</span>
          </div>
          <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B4513] rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[#8B4513]">
            <span>{formatMoney(monthlyTotals.expenses)}</span>
            <span>{formatMoney(totalBudget)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-green-600">
              <ArrowUpCircle className="h-5 w-5" />
              <span>Income</span>
            </div>
            <div className="text-2xl font-semibold text-green-700 mt-2">
              {formatMoney(monthlyTotals.income)}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <ArrowDownCircle className="h-5 w-5" />
              <span>Expenses</span>
            </div>
            <div className="text-2xl font-semibold text-red-700 mt-2">
              {formatMoney(monthlyTotals.expenses)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
