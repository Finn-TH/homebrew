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
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#8B4513]">Savings Goals</h2>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              <Plus className="h-5 w-5 text-[#8B4513]" />
            </button>
          </Dialog.Trigger>
          {/* Dialog content remains the same */}
        </Dialog.Root>
      </div>

      <div className="space-y-5">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;

          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B4513]">{goal.name}</span>
                <span className="text-[#8B4513]/60 tabular-nums">
                  ${goal.current} / ${goal.target}
                </span>
              </div>
              <div className="h-1.5 bg-[#8B4513]/5 rounded-full overflow-hidden">
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
