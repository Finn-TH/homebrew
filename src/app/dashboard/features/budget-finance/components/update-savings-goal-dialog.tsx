"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { SavingsGoal } from "../types";
import { formatMoney } from "../utils/money";
import { calculateAvailableToContribute } from "../utils/calculations";

interface UpdateSavingsGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGoal: SavingsGoal | null;
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
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<string>("");

  // Calculate available amount
  const { availableAmount, hasAvailableFunds, percentage } =
    calculateAvailableToContribute(
      monthlyBudget,
      monthlyExpenses,
      monthlyIncome
    );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-[#8B4513] mb-6">
            Update {selectedGoal?.name}
          </Dialog.Title>

          {/* Action Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsWithdrawal(false)}
              className={`flex-1 p-3 rounded-lg border ${
                !isWithdrawal
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:bg-gray-50"
              } transition-colors`}
            >
              <Plus
                className={`h-5 w-5 mx-auto mb-1 ${
                  !isWithdrawal ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm ${
                  !isWithdrawal ? "text-green-600" : "text-gray-400"
                }`}
              >
                Contribute
              </span>
            </button>

            <button
              onClick={() => setIsWithdrawal(true)}
              className={`flex-1 p-3 rounded-lg border ${
                isWithdrawal
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 hover:bg-gray-50"
              } transition-colors`}
            >
              <Minus
                className={`h-5 w-5 mx-auto mb-1 ${
                  isWithdrawal ? "text-red-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm ${
                  isWithdrawal ? "text-red-600" : "text-gray-400"
                }`}
              >
                Withdraw
              </span>
            </button>
          </div>

          {/* Amount Input Section */}
          <div className="space-y-4">
            {/* Available to Contribute Card - Only show when not withdrawing */}
            {!isWithdrawal && (
              <div className="bg-green-50 rounded-xl p-4">
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

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={
                    isWithdrawal
                      ? selectedGoal?.current_amount
                      : availableAmount
                  }
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className={`w-full pl-7 pr-3 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                    isWithdrawal
                      ? "border-red-200 focus:border-red-500"
                      : "border-green-200 focus:border-green-500"
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                type="button"
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isWithdrawal
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isWithdrawal ? "Withdraw" : "Contribute"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
