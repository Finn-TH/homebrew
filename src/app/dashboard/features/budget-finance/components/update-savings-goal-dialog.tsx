"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SavingsGoal } from "../types";
import { updateSavingsGoal } from "../actions";
import { formatMoney } from "../utils/money";
import { calculateAvailableToContribute } from "../utils/calculations";

interface UpdateSavingsGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGoal: SavingsGoal;
  monthlyBudget: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export default function UpdateSavingsGoalDialog({
  isOpen,
  onOpenChange,
  selectedGoal,
  monthlyBudget,
  monthlyExpenses,
  monthlyIncome,
}: UpdateSavingsGoalDialogProps) {
  const [amount, setAmount] = useState("");
  const [isContribution, setIsContribution] = useState(true);

  const { availableAmount, hasAvailableFunds, percentage } =
    calculateAvailableToContribute(
      monthlyBudget,
      monthlyExpenses,
      monthlyIncome
    );

  const maxWithdrawal = selectedGoal.current_amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSavingsGoal(
        selectedGoal.id.toString(),
        Number(amount),
        !isContribution
      );
      onOpenChange(false);
      setAmount("");
    } catch (error) {
      console.error("Failed to update goal amount:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-[#8B4513] mb-4">
            {isContribution ? "Contribute to" : "Withdraw from"}{" "}
            {selectedGoal.name}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setIsContribution(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isContribution
                    ? "bg-[#8B4513] text-white"
                    : "bg-[#8B4513]/5 text-[#8B4513]"
                }`}
              >
                Contribute
              </button>
              <button
                type="button"
                onClick={() => setIsContribution(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isContribution
                    ? "bg-[#8B4513] text-white"
                    : "bg-[#8B4513]/5 text-[#8B4513]"
                }`}
              >
                Withdraw
              </button>
            </div>

            {!isContribution ? (
              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-red-700">
                    Available to Withdraw
                  </span>
                  <span className="text-red-700 font-medium">
                    {formatMoney(maxWithdrawal)}
                  </span>
                </div>
                <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-full" />
                </div>
                <p className="text-xs text-red-600 mt-2">
                  You can withdraw up to {formatMoney(maxWithdrawal)} from this
                  goal
                </p>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-green-700">
                    Available to Contribute
                  </span>
                  <span className="text-green-700 font-medium">
                    {formatMoney(availableAmount)}
                  </span>
                </div>
                <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {hasAvailableFunds
                    ? `You have ${percentage.toFixed(
                        0
                      )}% of your budget available to contribute`
                    : "No funds available to contribute at this time"}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="amount"
                className="block text-sm text-[#8B4513]/60 mb-2"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
                min="0"
                max={isContribution ? availableAmount : maxWithdrawal}
                step="0.01"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Dialog.Close className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
              >
                {isContribution ? "Contribute" : "Withdraw"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
