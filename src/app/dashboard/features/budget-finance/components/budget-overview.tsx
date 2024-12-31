"use client";

import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function BudgetOverview() {
  const mockData = {
    monthlyBudget: 3000,
    currentSpending: 1750,
    income: 4000,
    expenses: 1750,
  };

  const spendingPercentage =
    (mockData.currentSpending / mockData.monthlyBudget) * 100;

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-6">
        Monthly Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Budget Progress */}
        <div className="md:col-span-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#8B4513]/60">
              <span>Monthly Budget</span>
              <span>{spendingPercentage.toFixed(0)}% used</span>
            </div>
            <div className="h-2.5 bg-[#8B4513]/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B4513] to-[#A0522D]"
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

        {/* Spacer */}
        <div className="md:col-span-1" />

        {/* Monthly Stats */}
        <div className="md:col-span-7 grid grid-cols-2 gap-6">
          <div className="bg-[#FDF6EC] rounded-lg p-6">
            <div className="flex items-center gap-2 text-[#8B4513]/70 mb-2">
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
              <span>Income</span>
            </div>
            <div className="text-2xl font-semibold text-[#8B4513]">
              ${mockData.income}
            </div>
          </div>

          <div className="bg-[#FDF6EC] rounded-lg p-6">
            <div className="flex items-center gap-2 text-[#8B4513]/70 mb-2">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
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
