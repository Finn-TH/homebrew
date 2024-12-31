"use client";

import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { SavingsGoal } from "../types";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
}

export default function SavingsGoals({ goals }: SavingsGoalsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#8B4513]">Savings Goals</h2>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              <PlusCircle className="h-5 w-5 text-[#8B4513]" />
            </button>
          </Dialog.Trigger>
          {/* Dialog content remains the same */}
        </Dialog.Root>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = (goal.current_amount / goal.target_amount) * 100;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#8B4513]">{goal.name}</span>
                <span className="text-sm text-[#8B4513]/60">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 bg-[#8B4513]/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${goal.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-sm text-[#8B4513]/60">
                <span>${goal.current_amount.toFixed(2)}</span>
                <span>${goal.target_amount.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
