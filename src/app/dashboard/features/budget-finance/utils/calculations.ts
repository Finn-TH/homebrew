import { Transaction, Category, SavingsGoal } from "../types";

// Monthly calculations
export const filterTransactionsByMonth = (
  transactions: Transaction[],
  date: Date
) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear()
    );
  });
};

export const calculateMonthlyTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = Math.abs(Number(transaction.amount));
      if (transaction.type === "income") {
        acc.income += amount;
      } else if (transaction.type === "expense") {
        acc.expenses += amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );
};

// Budget calculations
export const calculateBudgetUsage = (
  expenses: number,
  monthlyBudget: number,
  totalIncome: number
) => {
  const totalBudget = monthlyBudget + totalIncome;
  const usagePercentage = Math.min((expenses / totalBudget) * 100, 100);
  return {
    totalBudget,
    usagePercentage,
  };
};

// Category calculations
export const calculateCategorySpending = (
  transactions: Transaction[],
  categoryId: string,
  date: Date = new Date()
) => {
  const monthlyTransactions = filterTransactionsByMonth(transactions, date);
  return monthlyTransactions
    .filter((t) => t.category_id === categoryId && t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
};

export const calculateCategoryProgress = (spent: number, limit: number) => {
  const percentage = (spent / limit) * 100;
  const isOverLimit = percentage > 100;
  return {
    percentage,
    isOverLimit,
  };
};

// Savings calculations
export const calculateSavings = (income: number, expenses: number) => {
  const netSavings = income - expenses;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
  return {
    netSavings,
    savingsRate,
  };
};

export const calculateGoalProgress = (
  currentAmount: number,
  targetAmount: number
) => {
  const percentage = (currentAmount / targetAmount) * 100;
  const isComplete = percentage >= 100;
  return {
    percentage,
    isComplete,
  };
};
