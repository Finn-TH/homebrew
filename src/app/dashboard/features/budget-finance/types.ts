export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
    color: string;
  };
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  monthly_limit: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetUserSettings {
  user_id: string;
  monthly_budget: number;
  created_at: string;
  updated_at: string;
}
