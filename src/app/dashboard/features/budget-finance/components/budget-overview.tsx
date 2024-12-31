"use client";

import { Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Check, X } from "lucide-react";
import { useState } from "react";
import { updateMonthlyBudget } from "../actions";
import { useRouter } from "next/navigation";

interface BudgetOverviewProps {
  transactions: Transaction[];
  monthlyBudget: number;
}

export default function BudgetOverview({
  transactions,
  monthlyBudget,
}: BudgetOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const router = useRouter();

  const income = transactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0)
    .toFixed(2);

  const expenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0)
    .toFixed(2);

  const spendingPercentage = (Number(expenses) / monthlyBudget) * 100;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("monthly_budget", tempBudget);
    await updateMonthlyBudget(formData);
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-[#8B4513]">
          Monthly Overview
        </h2>
        <span className="text-[#8B4513]/40">•</span>
        <div className="relative">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleSubmit}
              >
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  onBlur={() => {
                    setTempBudget(monthlyBudget.toString());
                    setIsEditing(false);
                  }}
                  className="w-28 px-2 py-1 text-xl font-semibold text-[#8B4513] border-b-2 border-[#8B4513] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsEditing(true)}
                className="text-xl font-semibold text-[#8B4513] hover:text-[#8B4513]/80 transition-colors"
              >
                ${Number(monthlyBudget).toLocaleString()}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Monthly Budget Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-[#8B4513]/60">
          <span>Monthly Budget</span>
          <span>{Math.round(spendingPercentage)}% used</span>
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
          <span className="font-medium">${Number(expenses).toFixed(2)}</span>
          <span className="font-medium">${monthlyBudget.toFixed(2)}</span>
        </div>
      </div>

      {/* Income and Expenses Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50/50 rounded-xl p-6">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <ArrowUpCircle className="h-5 w-5" />
            <span>Income</span>
          </div>
          <div className="text-2xl font-semibold text-green-700">
            ${Number(income).toFixed(2)}
          </div>
        </div>

        <div className="bg-red-50/50 rounded-xl p-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <ArrowDownCircle className="h-5 w-5" />
            <span>Expenses</span>
          </div>
          <div className="text-2xl font-semibold text-red-700">
            ${Number(expenses).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
