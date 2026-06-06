import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { PrivacyMaskToggle } from '../components/PrivacyMaskToggle';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import { formatPrivateAmount } from '@/lib/privacy-mask';
import { usePrivacyMask } from '../contexts/PrivacyMaskContext';
import type {
  AdminProjectOption,
  Expense,
  ExpenseType,
  FinanceSummary,
  LedgerEntry,
} from './types';

interface AddExpenseForm {
  type: ExpenseType;
  projectId: string;
  title: string;
  description: string;
  amount: string;
  currency: string;
  expenseDate: string;
}

const emptyForm: AddExpenseForm = {
  type: 'project',
  projectId: '',
  title: '',
  description: '',
  amount: '',
  currency: 'INR',
  expenseDate: '',
};

const accentBtn = 'bg-violet-600 hover:bg-violet-700';

const selectClass = cn(
  'dark:bg-slate-800 border-white/10 flex h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export function RevenueExpensePage() {
  const { isMasked } = usePrivacyMask();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [projects, setProjects] = useState<AdminProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddExpenseForm>(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [summaryRes, ledgerRes] = await Promise.all([
      apiClient.get<FinanceSummary>('/finance/summary'),
      apiClient.get<LedgerEntry[]>('/finance/ledger'),
    ]);

    if (!summaryRes.success || !summaryRes.data) {
      setError(summaryRes.error || 'Failed to load finance summary');
      setSummary(null);
      setLedger([]);
      setLoading(false);
      return;
    }

    setSummary(summaryRes.data);
    setLedger(ledgerRes.success && ledgerRes.data ? ledgerRes.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!showAddModal) {
      return;
    }

    const fetchProjects = async () => {
      setProjectsLoading(true);
      const response = await apiClient.get<AdminProjectOption[]>(
        '/admin-projects?excludeStage=delivered',
      );
      setProjects(response.success && response.data ? response.data : []);
      setProjectsLoading(false);
    };

    void fetchProjects();
  }, [showAddModal]);

  const closeModal = () => {
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      type: form.type,
      projectId: form.type === 'project' ? form.projectId : undefined,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      amount: parseFloat(form.amount),
      currency: form.currency.trim() || 'INR',
      expenseDate: form.expenseDate,
    };

    const response = await apiClient.post<Expense>('/expenses', payload);
    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to add expense');
      return;
    }

    closeModal();
    await fetchData();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const response = await apiClient.delete(`/expenses/${expenseId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete expense');
      return;
    }

    await fetchData();
  };

  const currency = summary?.currency ?? 'INR';

  return (
    <AppLayout
      title="Revenue & Expense"
      description="Track revenue from paid payments, record expenses, and maintain the company ledger."
    >
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <p className="text-sm text-gray-400 font-footer">
          Revenue is calculated from paid payments. Expenses are recorded manually.
        </p>
        <div className="flex gap-2 shrink-0">
          <PrivacyMaskToggle />
          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="font-footer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button type="button" onClick={() => setShowAddModal(true)} className={cn(accentBtn, 'font-footer')}>
            <Plus className="h-4 w-4" />
            Add expense
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-800/50 border border-emerald-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">
                  {formatPrivateAmount(summary?.totalRevenue ?? 0, currency, isMasked)}
                </p>
                <CardDescription className="font-footer mt-1">From paid payments</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/30 to-slate-800/50 border border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Total Expenses</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">
                  {formatPrivateAmount(summary?.totalExpenses ?? 0, currency, isMasked)}
                </p>
                <CardDescription className="font-footer mt-1">Project + company expenses</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-900/40 to-slate-800/50 border border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Net Balance</CardTitle>
                <Wallet className="h-4 w-4 text-violet-400" />
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    'text-2xl font-bold font-hero',
                    (summary?.netBalance ?? 0) >= 0 ? 'text-emerald-300' : 'text-red-300',
                  )}
                >
                  {formatPrivateAmount(summary?.netBalance ?? 0, currency, isMasked)}
                </p>
                <CardDescription className="font-footer mt-1">Revenue minus expenses</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-hero flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  Upcoming Payments
                </CardTitle>
                <CardDescription className="font-footer">
                  Pending and delayed payments sorted by deadline
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!summary?.upcomingPayments.length ? (
                  <p className="text-center text-gray-400 py-8 font-footer text-sm">
                    No upcoming payments
                  </p>
                ) : (
                  <div className="space-y-3">
                    {summary.upcomingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-lg border border-white/10 bg-slate-800/40 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-sm font-footer">
                              {formatPrivateAmount(payment.amount, payment.currency, isMasked)}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {payment.project.projectName} · {payment.project.clientName}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'text-[10px] uppercase px-2 py-0.5 rounded shrink-0',
                              payment.status === 'delayed'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-amber-500/20 text-amber-300',
                            )}
                          >
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-footer">
                          Due {formatDate(payment.deadline)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-hero">Recent Expenses</CardTitle>
                <CardDescription className="font-footer">Latest recorded expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {!summary?.recentExpenses.length ? (
                  <p className="text-center text-gray-400 py-8 font-footer text-sm">
                    No expenses recorded yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {summary.recentExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-slate-800/40 p-3"
                      >
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm font-footer">{expense.title}</p>
                          <p className="text-xs text-gray-400">
                            {expense.type === 'project' && expense.project
                              ? `${expense.project.projectCode} · ${expense.project.projectName}`
                              : 'Company expense'}
                          </p>
                          <p className="text-xs text-red-300 mt-1 font-footer">
                            {formatPrivateAmount(expense.amount, expense.currency, isMasked, {
                              prefix: '-',
                            })}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-hero">Ledger</CardTitle>
              <CardDescription className="font-footer">
                Combined revenue and expense entries in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!ledger.length ? (
                <p className="text-center text-gray-400 py-12 font-footer">No ledger entries yet</p>
              ) : (
                <div className="space-y-2">
                  {ledger.map((entry) => (
                    <div
                      key={`${entry.type}-${entry.id}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-white/10 bg-slate-800/30 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {entry.type === 'revenue' ? (
                          <ArrowUpCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {entry.entryCode}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(entry.date)}</span>
                          </div>
                          <p className="text-white font-medium font-footer mt-1">{entry.title}</p>
                          {entry.projectLabel && (
                            <p className="text-xs text-gray-400">{entry.projectLabel}</p>
                          )}
                          {entry.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{entry.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p
                          className={cn(
                            'font-semibold font-footer',
                            entry.type === 'revenue' ? 'text-emerald-300' : 'text-red-300',
                          )}
                        >
                          {formatPrivateAmount(entry.amount, entry.currency, isMasked, {
                            prefix: entry.type === 'revenue' ? '+' : '-',
                          })}
                        </p>
                        {entry.type === 'expense' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(entry.id)}
                            className="text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">Add expense</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleAddExpense} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label className="text-gray-300">Expense type *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: 'project', projectId: '' }))}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm transition-colors',
                        form.type === 'project'
                          ? 'border-violet-500 bg-violet-500/20 text-white'
                          : 'border-white/10 text-gray-400 hover:bg-white/5',
                      )}
                    >
                      Project expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: 'company', projectId: '' }))}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm transition-colors',
                        form.type === 'company'
                          ? 'border-violet-500 bg-violet-500/20 text-white'
                          : 'border-white/10 text-gray-400 hover:bg-white/5',
                      )}
                    >
                      Company expense
                    </button>
                  </div>
                </div>

                {form.type === 'project' && (
                  <div className="space-y-2">
                    <Label htmlFor="expense-project" className="text-gray-300">
                      Project *
                    </Label>
                    {projectsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading projects…
                      </div>
                    ) : (
                      <select
                        id="expense-project"
                        required
                        value={form.projectId}
                        onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                        className={selectClass}
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.projectCode} — {project.projectName} ({project.clientName})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="expense-title" className="text-gray-300">
                    Title *
                  </Label>
                  <Input
                    id="expense-title"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="e.g. Server hosting, contractor fee"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount" className="text-gray-300">
                      Amount *
                    </Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-currency" className="text-gray-300">
                      Currency
                    </Label>
                    <Input
                      id="expense-currency"
                      value={form.currency}
                      onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                      placeholder="INR"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-date" className="text-gray-300">
                    Expense date *
                  </Label>
                  <Input
                    id="expense-date"
                    type="date"
                    required
                    value={form.expenseDate}
                    onChange={(e) => setForm((f) => ({ ...f, expenseDate: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-description" className="text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="expense-description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="Optional note"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeModal} className="font-footer">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving || (form.type === 'project' && !form.projectId)}
                    className={cn(accentBtn, 'font-footer')}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Record expense'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
