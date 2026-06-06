import { ExpenseListItem, listExpenses } from '@/services/expense.service';
import { PaymentListItem, listPayments } from '@/services/payment.service';

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
  upcomingPayments: PaymentListItem[];
  recentExpenses: ExpenseListItem[];
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

export const getFinanceSummary = async (): Promise<FinanceSummary> => {
  const [paidPayments, allExpenses, pendingPayments, delayedPayments, recentExpenses] =
    await Promise.all([
      listPayments({ status: 'paid' }),
      listExpenses(),
      listPayments({ status: 'pending' }),
      listPayments({ status: 'delayed' }),
      listExpenses({ limit: 8 }),
    ]);

  const upcomingPayments = [...pendingPayments, ...delayedPayments]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 10);

  const totalRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    totalRevenue,
    totalExpenses,
    netBalance: totalRevenue - totalExpenses,
    currency: 'INR',
    upcomingPayments,
    recentExpenses,
  };
};

export const getLedger = async (): Promise<LedgerEntry[]> => {
  const [paidPayments, expenses] = await Promise.all([
    listPayments({ status: 'paid' }),
    listExpenses(),
  ]);

  const revenueEntries: LedgerEntry[] = paidPayments.map((payment) => ({
    id: payment.id,
    entryCode: payment.paymentCode,
    type: 'revenue',
    title: `Payment received — ${payment.project.projectName}`,
    amount: payment.amount,
    currency: payment.currency,
    projectLabel: `${payment.project.projectCode} · ${payment.project.clientName}`,
    date: payment.updatedAt,
    description: payment.description,
  }));

  const expenseEntries: LedgerEntry[] = expenses.map((expense) => ({
    id: expense.id,
    entryCode: expense.expenseCode,
    type: 'expense',
    title: expense.title,
    amount: expense.amount,
    currency: expense.currency,
    projectLabel:
      expense.type === 'project' && expense.project
        ? `${expense.project.projectCode} · ${expense.project.projectName}`
        : 'Company expense',
    date: expense.expenseDate,
    description: expense.description,
  }));

  return [...revenueEntries, ...expenseEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
