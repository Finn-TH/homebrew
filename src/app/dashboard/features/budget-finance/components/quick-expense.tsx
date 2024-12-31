"use client";

import { Category } from "../types";
import { Plus } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { addTransaction } from "../actions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface QuickExpenseProps {
  categories: Category[];
}

export default function QuickExpense({ categories }: QuickExpenseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense" as "expense" | "income",
    amount: "",
    description: "",
    category_id: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id || !formData.amount) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("type", formData.type);
      form.append("amount", formData.amount);
      form.append("description", formData.description);
      form.append("category_id", formData.category_id);
      form.append("date", formData.date);

      await addTransaction(form);
      setIsOpen(false);
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        category_id: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors">
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl p-8 space-y-6">
          <Dialog.Title className="text-xl font-semibold text-[#8B4513]">
            Add Transaction
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "expense" }))
                }
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === "expense"
                    ? "bg-red-100 text-red-700"
                    : "hover:bg-red-50 text-red-600"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "income" }))
                }
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "hover:bg-green-50 text-green-600"
                }`}
              >
                Income
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#8B4513]/70">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#8B4513]/70">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter((category) => category.type === formData.type)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#8B4513]/70">
                Description (Optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                placeholder="Enter description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#8B4513]/70">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
