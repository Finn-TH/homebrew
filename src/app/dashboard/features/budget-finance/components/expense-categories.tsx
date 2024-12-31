"use client";

import { motion } from "framer-motion";

export default function ExpenseCategories() {
  const categories = [
    {
      name: "Groceries",
      spent: 400,
      budget: 500,
      gradient: "from-emerald-400 to-emerald-500",
    },
    {
      name: "Utilities",
      spent: 150,
      budget: 200,
      gradient: "from-blue-400 to-blue-500",
    },
    {
      name: "Entertainment",
      spent: 200,
      budget: 300,
      gradient: "from-purple-400 to-purple-500",
    },
    {
      name: "Transport",
      spent: 120,
      budget: 150,
      gradient: "from-orange-400 to-orange-500",
    },
    {
      name: "Other",
      spent: 80,
      budget: 100,
      gradient: "from-gray-400 to-gray-500",
    },
  ];

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-6">
        Expense Categories
      </h2>

      <div className="space-y-5">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;

          return (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B4513]">{category.name}</span>
                <span className="text-[#8B4513]/60 tabular-nums ml-8">
                  ${category.spent} / ${category.budget}
                </span>
              </div>
              <div className="h-2.5 bg-[#8B4513]/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${category.gradient}`}
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
