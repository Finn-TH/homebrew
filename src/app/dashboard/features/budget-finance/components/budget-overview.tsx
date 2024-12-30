"use client";

import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

export default function BudgetOverview() {
  // This will be replaced with real data later
  const mockData = {
    monthlyBudget: 3000,
    currentSpending: 1750,
    income: 4000,
    expenses: 1750,
  };

  const spendingPercentage =
    (mockData.currentSpending / mockData.monthlyBudget) * 100;

  return (
    <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
        Monthly Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Progress */}
        <div className="col-span-1">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#8B4513]/60">
              <span>Monthly Budget</span>
              <span>{spendingPercentage.toFixed(0)}% used</span>
            </div>
            <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#8B4513]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[#8B4513]">
              <span className="font-medium">${mockData.currentSpending}</span>
              <span className="font-medium">${mockData.monthlyBudget}</span>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-[#8B4513]/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
              <ArrowUpCircle className="h-5 w-5" />
              <span>Income</span>
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              ${mockData.income}
            </div>
          </div>

          <div className="bg-[#8B4513]/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#8B4513]/60 mb-2">
              <ArrowDownCircle className="h-5 w-5" />
              <span>Expenses</span>
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              ${mockData.expenses}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
