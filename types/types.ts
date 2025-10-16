export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageExpense: number;
  categoryBreakdown: Record<string, number>;
}

export type Trend = "up" | "down" | "neutral";

export interface DataState {
  value: number;
  change: number;
  trend: Trend;
}

export interface CategoryExpense {
  name: string;
  amount: number;
}

export interface StatsData {
  total: number;
  monthly: number;
  average: number;
  budgetLeft: number;
  categories: CategoryExpense[];
}

export interface Suggestion {
  title: string;
  message: string;
}

export interface Suggestion {
  title: string;
  message: string;
}