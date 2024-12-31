"use client";

import { Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Check, X } from "lucide-react";
import { useState } from "react";
import { updateMonthlyBudget } from "../actions";
import { useRouter } from "next/navigation";

interface BudgetOverviewProps {
  transactions: Transaction[];
  monthlyBudget?: number;
}

export default function BudgetOverview({
  transactions,
  monthlyBudget = 3000,
}: BudgetOverviewProps) {
  // Calculate totals for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const baseMonthlyBudget = monthlyBudget;
  const totalBudget = baseMonthlyBudget + totalIncome;
  const budgetUsedPercentage = Math.min(
    (totalExpenses / totalBudget) * 100,
    100
  );

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[#8B4513]">
            Monthly Overview · ${totalBudget.toFixed(2)}
          </h2>
          {totalIncome > 0 && (
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              +${totalIncome.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-[#8B4513]/70 mb-2">
            <span>Monthly Budget</span>
            <span>{budgetUsedPercentage.toFixed(0)}% used</span>
          </div>
          <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B4513] rounded-full transition-all duration-500"
              style={{ width: `${budgetUsedPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[#8B4513]">
            <span>${totalExpenses.toFixed(2)}</span>
            <span>${totalBudget.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-green-600">
              <ArrowUpCircle className="h-5 w-5" />
              <span>Income</span>
            </div>
            <div className="text-2xl font-semibold text-green-700 mt-2">
              ${totalIncome.toFixed(2)}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <ArrowDownCircle className="h-5 w-5" />
              <span>Expenses</span>
            </div>
            <div className="text-2xl font-semibold text-red-700 mt-2">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
