"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { SavingsGoal } from "../types";
import { formatMoney } from "../utils/money";
import { calculateAvailableToContribute } from "../utils/calculations";
import { updateSavingsGoal, updateSavingsGoalAmount } from "../actions";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate available amount
  const { availableAmount, hasAvailableFunds, percentage } =
    calculateAvailableToContribute(
      monthlyBudget,
      monthlyExpenses,
      monthlyIncome
    );

  const maxWithdrawal = selectedGoal?.current_amount ?? 0;
  const maxAmount = isWithdrawal ? maxWithdrawal : availableAmount;

  const handleSubmit = async () => {
    try {
      if (!selectedGoal) return;
      setIsSubmitting(true);
      setError(null);

      const amount = Number(contributionAmount);

      // Validate amount
      if (isWithdrawal && amount > maxWithdrawal) {
        throw new Error("Cannot withdraw more than available amount");
      }

      if (!isWithdrawal && amount > availableAmount) {
        throw new Error("Cannot contribute more than available budget");
      }

      await updateSavingsGoal(selectedGoal.id, amount, isWithdrawal);

      setContributionAmount("");
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-[#8B4513] mb-6">
            Update {selectedGoal?.name}
          </Dialog.Title>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setIsWithdrawal(false)}
              className={`flex-1 py-4 rounded-xl border-2 transition-colors ${
                !isWithdrawal
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-transparent text-gray-400"
              }`}
            >
              <span className="text-2xl mb-1">+</span>
              <div>Contribute</div>
            </button>
            <button
              onClick={() => setIsWithdrawal(true)}
              className={`flex-1 py-4 rounded-xl border-2 transition-colors ${
                isWithdrawal
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-transparent text-gray-400"
              }`}
            >
              <span className="text-2xl mb-1">-</span>
              <div>Withdraw</div>
            </button>
          </div>

          {!isWithdrawal ? (
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
          ) : (
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
          )}

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
                max={maxAmount}
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

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close className="px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || Number(contributionAmount) > maxAmount}
              className={`px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors ${
                isWithdrawal
                  ? "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
                  : "bg-green-500 hover:bg-green-600 disabled:bg-green-300"
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : isWithdrawal
                ? "Withdraw"
                : "Contribute"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
