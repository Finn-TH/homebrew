"use client";

import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { format } from "date-fns";

export default function RecentTransactions() {
  const transactions = [
    {
      id: "1",
      type: "expense",
      amount: 45.99,
      category: "Groceries",
      date: new Date(),
      note: "Weekly groceries",
    },
    {
      id: "2",
      type: "income",
      amount: 2500,
      category: "Salary",
      date: new Date(Date.now() - 86400000),
      note: "Monthly salary",
    },
    {
      id: "3",
      type: "expense",
      amount: 89.99,
      category: "Utilities",
      date: new Date(Date.now() - 172800000),
      note: "Electricity bill",
    },
  ];

  return (
    <div className="bg-white/80 rounded-xl p-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-[#8B4513] mb-6">
        Recent Transactions
      </h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
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
                  {transaction.category}
                </div>
                <div className="text-sm text-[#8B4513]/60">
                  {transaction.note}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-medium tabular-nums ${
                  transaction.type === "expense"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {transaction.type === "expense" ? "-" : "+"}$
                {transaction.amount.toFixed(2)}
              </div>
              <div className="text-sm text-[#8B4513]/60">
                {format(transaction.date, "MMM d, yyyy")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
