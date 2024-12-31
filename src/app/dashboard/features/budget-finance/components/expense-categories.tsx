"use client";

import { Category, Transaction } from "../types";
import { motion } from "framer-motion";
import { ShoppingBag, Home, Car, Film, Package } from "lucide-react";
import { JSX } from "react";

interface ExpenseCategoriesProps {
  categories: Category[];
  transactions: Transaction[];
}

const categoryIcons: { [key: string]: JSX.Element } = {
  Groceries: <ShoppingBag className="h-4 w-4" />,
  Utilities: <Home className="h-4 w-4" />,
  Transport: <Car className="h-4 w-4" />,
  Entertainment: <Film className="h-4 w-4" />,
  Other: <Package className="h-4 w-4" />,
};

export default function ExpenseCategories({
  categories,
  transactions,
}: ExpenseCategoriesProps) {
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-8">
        Expense Categories
      </h2>

      <div className="space-y-6">
        {expenseCategories.map((category) => {
          const categoryTransactions = transactions.filter(
            (t) => t.category_id === category.id && t.type === "expense"
          );

          const spent = categoryTransactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0
          );

          const percentage = (spent / category.monthly_limit) * 100;
          const isOverLimit = percentage > 100;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-[#8B4513]/5">
                  {categoryIcons[category.name] || (
                    <Package className="h-5 w-5 text-[#8B4513]" />
                  )}
                </div>
                <span className="text-lg text-[#8B4513]">{category.name}</span>
                <span
                  className={`ml-auto ${
                    isOverLimit ? "text-red-600" : "text-[#8B4513]/60"
                  }`}
                >
                  ${spent.toFixed(2)} / ${category.monthly_limit.toFixed(2)}
                </span>
              </div>
              <div className="h-1 bg-[#8B4513]/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    isOverLimit ? "bg-red-500" : "bg-[#A0522D]"
                  }`}
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
