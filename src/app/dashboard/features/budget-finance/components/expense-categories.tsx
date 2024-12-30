"use client";

import { motion } from "framer-motion";

export default function ExpenseCategories() {
  // Mock data - will be replaced with real data
  const categories = [
    { name: "Groceries", spent: 400, budget: 500, color: "bg-emerald-500" },
    { name: "Utilities", spent: 150, budget: 200, color: "bg-blue-500" },
    { name: "Entertainment", spent: 200, budget: 300, color: "bg-purple-500" },
    { name: "Transport", spent: 120, budget: 150, color: "bg-orange-500" },
    { name: "Other", spent: 80, budget: 100, color: "bg-gray-500" },
  ];

  return (
    <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
        Expense Categories
      </h2>

      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;

          return (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B4513]">{category.name}</span>
                <span className="text-[#8B4513]/60">
                  ${category.spent} / ${category.budget}
                </span>
              </div>
              <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
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
