import { Transaction, Category, SavingsGoal } from "../types";
import { format, subMonths } from "date-fns";

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
  const availableBudget = Math.max(totalBudget - expenses, 0);

  return {
    totalBudget,
    usagePercentage,
    availableBudget,
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

// Goal time calculations
export const calculateMonthlyNeeded = (goal: SavingsGoal) => {
  if (!goal.target_date) return 0;
  const remaining = goal.target_amount - goal.current_amount;
  const monthsLeft = Math.max(
    1,
    (new Date(goal.target_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  return remaining / monthsLeft;
};

export const calculateTimeRemaining = (goal: SavingsGoal) => {
  if (!goal.target_date) return "No target date";
  const months = Math.ceil(
    (new Date(goal.target_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  return months <= 0 ? "Past due" : `${months} months left`;
};

export const calculateAvailableToContribute = (
  monthlyBudget: number,
  monthlyExpenses: number,
  monthlyIncome: number
) => {
  // Calculate total budget (monthly budget + income)
  const totalBudget = monthlyBudget + monthlyIncome;

  // Calculate how much is left after expenses
  const availableAmount = Math.max(totalBudget - monthlyExpenses, 0);

  return {
    availableAmount,
    hasAvailableFunds: availableAmount > 0,
    percentage: Math.min((availableAmount / totalBudget) * 100, 100),
  };
};

export function calculateCategoryTotals(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === "expense" && transaction.category) {
      const categoryName = transaction.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);
}

interface AnalyticsData {
  currentDate: Date;
  categoryTotals: Record<string, number>;
  trendData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export function prepareAnalyticsData(
  transactions: Transaction[]
): AnalyticsData {
  const currentDate = new Date();
  const currentMonthTransactions = filterTransactionsByMonth(
    transactions,
    currentDate
  );
  const categoryTotals = calculateCategoryTotals(currentMonthTransactions);

  const trendData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(currentDate, 5 - i);
    const monthTransactions = filterTransactionsByMonth(transactions, date);
    const totals = calculateMonthlyTotals(monthTransactions);
    return {
      month: format(date, "MMM"),
      income: totals.income,
      expenses: totals.expenses,
    };
  });

  return { currentDate, categoryTotals, trendData };
}
