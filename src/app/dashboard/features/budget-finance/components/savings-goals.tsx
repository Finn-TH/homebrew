"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import * as HoverCard from "@radix-ui/react-hover-card";
import { format } from "date-fns";
import { SavingsGoal } from "../types";
import { formatMoney } from "../utils/money";
import {
  calculateGoalProgress,
  calculateMonthlyNeeded,
  calculateTimeRemaining,
} from "../utils/calculations";
import UpdateSavingsGoalDialog from "./update-savings-goal-dialog";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  monthlyBudget: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export default function SavingsGoals({
  goals,
  monthlyBudget,
  monthlyExpenses,
  monthlyIncome,
}: SavingsGoalsProps) {
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-8">
        Savings Goals
      </h2>

      <div className="space-y-8">
        {goals.map((goal) => {
          const { percentage, isComplete } = calculateGoalProgress(
            goal.current_amount,
            goal.target_amount
          );

          return (
            <div
              key={goal.id}
              onClick={() => {
                setSelectedGoal(goal);
                setIsContributeOpen(true);
              }}
              className="w-full text-left space-y-2 p-4 rounded-xl hover:bg-[#8B4513]/5 transition-colors group cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedGoal(goal);
                  setIsContributeOpen(true);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#8B4513]">{goal.name}</span>
                <HoverCard.Root openDelay={200} closeDelay={100}>
                  <HoverCard.Trigger asChild>
                    <button
                      className="p-1 hover:bg-[#8B4513]/10 rounded-full transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="h-4 w-4 text-[#8B4513]/60" />
                    </button>
                  </HoverCard.Trigger>

                  <HoverCard.Portal>
                    <HoverCard.Content
                      className="w-80 bg-white rounded-xl p-4 shadow-lg border border-[#8B4513]/10"
                      sideOffset={5}
                    >
                      {goal.description && (
                        <p className="text-sm text-[#8B4513]/70 mb-3">
                          {goal.description}
                        </p>
                      )}

                      {goal.target_date && (
                        <div className="flex items-center gap-2 text-sm text-[#8B4513]/70">
                          <span>
                            Target:{" "}
                            {format(new Date(goal.target_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-[#8B4513]/10">
                        <div className="text-sm text-[#8B4513]/70">
                          Monthly needed:{" "}
                          {formatMoney(calculateMonthlyNeeded(goal))}
                        </div>
                        <div className="text-sm text-[#8B4513]/70">
                          Time remaining: {calculateTimeRemaining(goal)}
                        </div>
                      </div>

                      <HoverCard.Arrow className="fill-white" />
                    </HoverCard.Content>
                  </HoverCard.Portal>
                </HoverCard.Root>
                <span
                  className={`ml-auto ${
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
                <span>{formatMoney(goal.current_amount)}</span>
                <span>{formatMoney(goal.target_amount)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <UpdateSavingsGoalDialog
        isOpen={isContributeOpen}
        onOpenChange={setIsContributeOpen}
        selectedGoal={selectedGoal}
        monthlyBudget={monthlyBudget}
        monthlyExpenses={monthlyExpenses}
        monthlyIncome={monthlyIncome}
      />
    </div>
  );
}
