"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createSavingsGoal } from "../actions";
import { useRouter } from "next/navigation";

export default function AddSavingsGoalDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [color, setColor] = useState("#8B4513");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSavingsGoal({
        name,
        target_amount: Number(targetAmount),
        target_date: targetDate || null,
        color,
      });
      setIsOpen(false);
      setName("");
      setTargetAmount("");
      setTargetDate("");
      setColor("#8B4513");
      router.refresh();
    } catch (error) {
      console.error("Failed to create savings goal:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="w-full text-left space-y-2 p-4 rounded-xl border-2 border-dashed border-[#8B4513]/20 hover:border-[#8B4513]/40 hover:bg-[#8B4513]/5 transition-colors group">
          <div className="flex items-center gap-2 text-[#8B4513]/60 group-hover:text-[#8B4513]/80">
            <Plus className="h-5 w-5" />
            <span>Add New Goal</span>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
              Add New Savings Goal
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

            <div>
              <label
                htmlFor="color"
                className="block text-sm text-[#8B4513]/60 mb-2"
              >
                Goal Color
              </label>
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
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
                Create Goal
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
