"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { editSavingsGoal } from "../actions";
import { useRouter } from "next/navigation";
import { SavingsGoal } from "../types";

interface EditSavingsGoalDialogProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSavingsGoalDialog({
  goal,
  isOpen,
  onOpenChange,
}: EditSavingsGoalDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(goal?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    goal?.target_amount?.toString() ?? "0"
  );
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? "");

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.target_amount.toString());
      setTargetDate(goal.target_date || "");
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    try {
      await editSavingsGoal({
        id: goal.id,
        name,
        target_amount: Number(targetAmount),
        target_date: targetDate || null,
      });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to edit savings goal:", error);
    }
  };

  if (!goal) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
              Edit Savings Goal
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              <X className="h-4 w-4 text-[#8B4513]/60" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-[#8B4513]/60 mb-2"
              >
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="targetAmount"
                className="block text-sm text-[#8B4513]/60 mb-2"
              >
                Target Amount
              </label>
              <input
                type="number"
                id="targetAmount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="targetDate"
                className="block text-sm text-[#8B4513]/60 mb-2"
              >
                Target Date (Optional)
              </label>
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
