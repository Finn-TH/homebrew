"use client";

import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { SavingsGoal } from "../types";
import { formatMoney } from "../utils/money";
import { calculateGoalProgress } from "../utils/calculations";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
}

export default function SavingsGoals({ goals }: SavingsGoalsProps) {
  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-[#8B4513]">Savings Goals</h2>
        <button className="text-[#8B4513]">
          <PlusCircle className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-8">
        {goals.map((goal) => {
          const { percentage, isComplete } = calculateGoalProgress(
            goal.current_amount,
            goal.target_amount
          );

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg text-[#8B4513]">{goal.name}</span>
                <span
                  className={`${
                    isComplete ? "text-green-600" : "text-[#8B4513]/60"
                  }`}
                >
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-1 bg-[#8B4513]/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    isComplete ? "bg-green-500" : "bg-[#A0522D]"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-[#8B4513]/60">
                <span>
                  {formatMoney(goal.current_amount, { showSign: true })}
                </span>
                <span>
                  {formatMoney(goal.target_amount, { showSign: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
