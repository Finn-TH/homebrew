"use client";

import { Category } from "../types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { addTransaction } from "../actions";
import { useRouter } from "next/navigation";

interface QuickExpenseProps {
  categories: Category[];
}

export default function QuickExpense({ categories }: QuickExpenseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addTransaction(formData);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#8B4513]/90 hover:bg-[#8B4513] text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="h-5 w-5" />
        Add Expense
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
              Add New Expense
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  required
                  className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2"
                >
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full rounded-lg border border-[#8B4513]/20 px-3 py-2"
                />
              </div>

              <input type="hidden" name="type" value="expense" />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
