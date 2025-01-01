"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MoreVertical,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Transaction, Category } from "../types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteTransaction } from "../actions";
import { useRouter } from "next/navigation";
import { formatMoney } from "../utils/money";
import { filterTransactionsByMonth } from "../utils/calculations";
import * as Dialog from "@radix-ui/react-dialog";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

const getTransactionDisplay = (transaction: Transaction) => {
  // Special handling for savings transactions
  if (transaction.is_savings_transaction) {
    return {
      title: "Savings",
      subtitle: transaction.description,
      icon:
        transaction.type === "income" ? (
          <ArrowUpCircle className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
        ),
      iconBg: transaction.type === "income" ? "bg-green-100" : "bg-red-100",
    };
  }

  // Default display for other transactions
  return {
    title: transaction.category?.name || "Uncategorized",
    subtitle: transaction.description,
    icon:
      transaction.type === "income" ? (
        <ArrowUpCircle className="h-5 w-5 text-green-500" />
      ) : (
        <ArrowDownCircle className="h-5 w-5 text-red-500" />
      ),
    iconBg: transaction.type === "income" ? "bg-green-100" : "bg-red-100",
  };
};

export default function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const currentDate = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions,
    currentDate
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#8B4513]">
          Transactions
          <span className="text-sm font-normal text-[#8B4513]/70 ml-2">
            ({format(currentDate, "MMMM yyyy")})
          </span>
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
        {currentMonthTransactions.map((transaction) => {
          const display = getTransactionDisplay(transaction);

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-4 px-6 rounded-lg hover:bg-[#8B4513]/[0.03] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${display.iconBg}`}>
                  {display.icon}
                </div>
                <div>
                  <div className="font-medium text-[#8B4513]">
                    {display.title}
                  </div>
                  <div className="text-sm text-[#8B4513]/60">
                    {display.subtitle}
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
                    {formatMoney(transaction.amount, { showSign: true })}
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
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        onSelect={() => {
                          setTransactionToDelete(transaction);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete Transaction
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          );
        })}

        {currentMonthTransactions.length === 0 && (
          <div className="text-center py-8 text-[#8B4513]/70">
            No transactions for {format(currentDate, "MMMM yyyy")}
          </div>
        )}
      </div>

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
                Delete Transaction
              </Dialog.Title>
            </div>

            <Dialog.Description className="text-[#8B4513]/70 mb-6">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <Dialog.Close className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={async () => {
                  if (transactionToDelete) {
                    await deleteTransaction(transactionToDelete.id);
                    setIsDeleteDialogOpen(false);
                    setTransactionToDelete(null);
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
    </div>
  );
}
