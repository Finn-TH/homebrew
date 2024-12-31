"use client";

import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Transaction, Category } from "../types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteTransaction } from "../actions";
import { useRouter } from "next/navigation";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function RecentTransactions({
  transactions,
  categories = [],
}: RecentTransactionsProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedType !== "all" && transaction.type !== selectedType)
      return false;
    if (selectedCategory && transaction.category_id !== selectedCategory)
      return false;
    return true;
  });

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#8B4513]">
          Recent Transactions
        </h2>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-1.5 rounded-lg border border-[#8B4513]/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex bg-[#8B4513]/5 p-1 rounded-lg">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                selectedType === "all"
                  ? "bg-white text-[#8B4513] shadow-sm"
                  : "text-[#8B4513]/70 hover:text-[#8B4513]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType("income")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                selectedType === "income"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-green-600/70 hover:text-green-600"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setSelectedType("expense")}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                selectedType === "expense"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-red-600/70 hover:text-red-600"
              }`}
            >
              Expense
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-4 px-6 rounded-lg hover:bg-[#8B4513]/[0.03] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  transaction.type === "expense" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {transaction.type === "expense" ? (
                  <ArrowDownCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <ArrowUpCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-[#8B4513]">
                  {transaction.category.name}
                </div>
                <div className="text-sm text-[#8B4513]/60">
                  {transaction.description}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div
                  className={`font-medium tabular-nums ${
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.type === "expense" ? "-" : "+"}$
                  {Number(transaction.amount).toFixed(2)}
                </div>
                <div className="text-sm text-[#8B4513]/60">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </div>
              </div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-[#8B4513]/70" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="w-48 bg-white rounded-lg shadow-lg border border-[#8B4513]/10 py-1"
                    align="end"
                  >
                    <DropdownMenu.Item
                      className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 cursor-pointer"
                      onSelect={() => {
                        // TODO: Implement edit
                      }}
                    >
                      Edit Transaction
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      onSelect={async () => {
                        if (
                          confirm(
                            "Are you sure you want to delete this transaction?"
                          )
                        ) {
                          await deleteTransaction(transaction.id);
                        }
                      }}
                    >
                      Delete Transaction
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-[#8B4513]/60">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
