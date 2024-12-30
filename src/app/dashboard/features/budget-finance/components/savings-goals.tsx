"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function SavingsGoals() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock data - will be replaced with real data
  const goals = [
    {
      name: "Emergency Fund",
      current: 3000,
      target: 5000,
      color: "bg-blue-500",
    },
    { name: "Vacation", current: 1200, target: 2000, color: "bg-emerald-500" },
    { name: "New Laptop", current: 800, target: 1500, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#8B4513]">Savings Goals</h2>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <button className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              <Plus className="h-5 w-5 text-[#8B4513]" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md">
              <Dialog.Title className="text-xl font-semibold text-[#8B4513] mb-4">
                Add Savings Goal
              </Dialog.Title>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8B4513]/60 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="e.g., Vacation Fund"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#8B4513]/60 mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;

          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B4513]">{goal.name}</span>
                <span className="text-[#8B4513]/60">
                  ${goal.current} / ${goal.target}
                </span>
              </div>
              <div className="h-2 bg-[#8B4513]/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${goal.color}`}
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
