export const formatMoney = (
  amount: number,
  options?: {
    showSign?: boolean;
    currency?: string;
  }
) => {
  const { showSign = false, currency = "$" } = options || {};
  const absAmount = Math.abs(amount);
  const formatted = `${currency}${absAmount.toFixed(2)}`;

  if (!showSign) return formatted;
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};

// Helper functions for transaction types
export const isExpense = (amount: number) => amount < 0;
export const isIncome = (amount: number) => amount >= 0;

// Helper for calculating transaction amount based on type
export const getTransactionAmount = (
  amount: number,
  type: "income" | "expense"
) => {
  const absAmount = Math.abs(amount);
  return type === "expense" ? -absAmount : absAmount;
};
