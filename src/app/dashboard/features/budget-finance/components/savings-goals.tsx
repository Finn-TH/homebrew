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
import AddSavingsGoalDialog from "./add-savings-goal-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, MoreVertical, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteSavingsGoal } from "../actions";
import EditSavingsGoalDialog from "./edit-savings-goal-dialog";

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
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-[#8B4513]">Savings Goals</h2>
        <AddSavingsGoalDialog />
      </div>
      <div className="space-y-4">
        {goals.map((goal) => {
          const { percentage, isComplete } = calculateGoalProgress(
            goal.current_amount,
            goal.target_amount
          );

          return (
            <div key={goal.id} className="relative">
              <div
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
                              {format(
                                new Date(goal.target_date),
                                "MMM d, yyyy"
                              )}
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
                  <div className="ml-auto flex items-center gap-2">
                    <span
                      className={`${
                        isComplete ? "text-green-600" : "text-[#8B4513]/60"
                      }`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          className="p-1 hover:bg-[#8B4513]/5 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreVertical className="h-4 w-4 text-[#8B4513]/60" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="w-48 bg-white rounded-lg shadow-lg border border-[#8B4513]/10 py-1"
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu.Item
                            className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              setGoalToEdit(goal);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit Goal
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                            onSelect={() => {
                              setGoalToDelete(goal);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete Goal
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
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

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <Dialog.Title className="text-lg font-semibold">
                Delete Savings Goal
              </Dialog.Title>
            </div>

            <Dialog.Description className="text-[#8B4513]/70 mb-6">
              Are you sure you want to delete this savings goal? This will also
              delete all related transactions. This action cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <Dialog.Close className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={async () => {
                  if (goalToDelete) {
                    await deleteSavingsGoal(goalToDelete.id);
                    setIsDeleteDialogOpen(false);
                    setGoalToDelete(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <EditSavingsGoalDialog
        goal={goalToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setGoalToEdit(null);
        }}
      />
    </div>
  );
}
