"use client";

import { Category, Transaction } from "../types";
import { motion } from "framer-motion";

interface ExpenseCategoriesProps {
  categories: Category[];
  transactions: Transaction[];
}

export default function ExpenseCategories({
  categories,
  transactions,
}: ExpenseCategoriesProps) {
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-6">
        Expense Categories
      </h2>

      <div className="space-y-5">
        {expenseCategories.map((category) => {
          const categoryTransactions = transactions.filter(
            (t) => t.category_id === category.id && t.type === "expense"
          );

          const spent = categoryTransactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0
          );

          const percentage = (spent / category.monthly_limit) * 100;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B4513]">{category.name}</span>
                <span className="text-[#8B4513]/60 tabular-nums ml-8">
                  ${spent.toFixed(2)} / ${category.monthly_limit.toFixed(2)}
                </span>
              </div>
              <div className="h-2.5 bg-[#8B4513]/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${category.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
