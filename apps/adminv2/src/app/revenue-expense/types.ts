import type { Payment } from '../payments/types';

export type ExpenseType = 'project' | 'company';

export interface ExpenseProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface Expense {
  id: string;
  expenseCode: string;
  type: ExpenseType;
  projectId?: string;
  project?: ExpenseProjectSummary;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
  upcomingPayments: Payment[];
  recentExpenses: Expense[];
}

export type LedgerEntryType = 'revenue' | 'expense';

export interface LedgerEntry {
  id: string;
  entryCode: string;
  type: LedgerEntryType;
  title: string;
  amount: number;
  currency: string;
  projectLabel?: string;
  date: string;
  description?: string;
}

export interface AdminProjectOption {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}
