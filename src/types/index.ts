export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  categoryId: Category | string;
  date: string;
  description?: string;
  createdAt: string;
}

export interface RecurringPayment {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  categoryId: Category | string;
  dayOfMonth: number;
  excludedMonths: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ExpenseStats {
  total: number;
  byCategory: Array<{
    name: string;
    color: string;
    total: number;
  }>;
  expenses: Expense[];
}

