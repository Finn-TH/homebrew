"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { SavingsGoal } from "../types";
import { formatMoney } from "../utils/money";

interface UpdateSavingsGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGoal: SavingsGoal | null;
}

export default function UpdateSavingsGoalDialog({
  isOpen,
  onOpenChange,
  selectedGoal,
}: UpdateSavingsGoalDialogProps) {
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<string>("");

  const percentage = selectedGoal
    ? Math.min(
        (selectedGoal.current_amount / selectedGoal.target_amount) * 100,
        100
      )
    : 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl p-6 shadow-xl">
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

          {/* Amount Form */}
          <div className="space-y-4">
            {/* Current Progress */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Current Amount</span>
                <span>Target Amount</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{formatMoney(selectedGoal?.current_amount ?? 0)}</span>
                <span>{formatMoney(selectedGoal?.target_amount ?? 0)}</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B4513] transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((selectedGoal?.current_amount ?? 0) /
                        (selectedGoal?.target_amount ?? 1)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={isWithdrawal ? selectedGoal?.current_amount : undefined}
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isWithdrawal
                    ? "border-red-200 focus:ring-red-100"
                    : "border-green-200 focus:ring-green-100"
                }`}
                placeholder="0.00"
              />
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
