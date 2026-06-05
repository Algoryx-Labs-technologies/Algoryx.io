import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Calendar,
  CreditCard,
  Grid3X3,
  LayoutList,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import {
  PAYMENT_STATUSES,
  type AdminProjectOption,
  type Payment,
  type PaymentStatusId,
  type StatusFilter,
} from './types';

type ViewMode = 'board' | 'list';

interface AddPaymentForm {
  projectId: string;
  amount: string;
  currency: string;
  deadline: string;
  description: string;
}

const emptyForm: AddPaymentForm = {
  projectId: '',
  amount: '',
  currency: 'INR',
  deadline: '',
  description: '',
};

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

function formatDeadline(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'INR',
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const selectClass = cn(
  'dark:bg-slate-800 border-white/10 flex h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<AdminProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddPaymentForm>(emptyForm);
  const [draggedPaymentId, setDraggedPaymentId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }

    const query = params.toString();
    const endpoint = query ? `/payments?${query}` : '/payments';
    const response = await apiClient.get<Payment[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load payments');
      setPayments([]);
      setLoading(false);
      return;
    }

    setPayments(response.data);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPayments]);

  useEffect(() => {
    if (!showAddModal) {
      return;
    }

    const fetchProjects = async () => {
      setProjectsLoading(true);
      const response = await apiClient.get<AdminProjectOption[]>(
        '/admin-projects?excludeStage=delivered',
      );
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
      setProjectsLoading(false);
    };

    void fetchProjects();
  }, [showAddModal]);

  const paymentsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      PAYMENT_STATUSES.map((s) => [s.id, [] as Payment[]]),
    ) as Record<PaymentStatusId, Payment[]>;

    for (const payment of payments) {
      if (grouped[payment.status]) {
        grouped[payment.status].push(payment);
      }
    }

    return grouped;
  }, [payments]);

  const visibleStatuses = useMemo(
    () =>
      PAYMENT_STATUSES.filter(
        (status) => statusFilter === 'all' || statusFilter === status.id,
      ),
    [statusFilter],
  );

  const boardGridClass = cn(
    'grid gap-4 w-full min-h-[420px] pb-4',
    visibleStatuses.length === 1 && 'grid-cols-1',
    visibleStatuses.length === 2 && 'grid-cols-1 md:grid-cols-2',
    visibleStatuses.length === 3 && 'grid-cols-1 md:grid-cols-3',
  );

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const response = await apiClient.post<Payment>('/payments', {
      projectId: form.projectId,
      amount: parseFloat(form.amount),
      currency: form.currency.trim() || 'INR',
      deadline: form.deadline,
      description: form.description.trim() || undefined,
    });

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to create payment');
      return;
    }

    setShowAddModal(false);
    setForm(emptyForm);
    await fetchPayments();
  };

  const movePaymentToStatus = async (paymentId: string, status: PaymentStatusId) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment || payment.status === status) {
      return;
    }

    setPayments((prev) =>
      prev.map((item) => (item.id === paymentId ? { ...item, status } : item)),
    );

    const response = await apiClient.patch<Payment>(`/payments/${paymentId}`, { status });

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to move payment');
      await fetchPayments();
      return;
    }

    setPayments((prev) =>
      prev.map((item) => (item.id === paymentId ? response.data! : item)),
    );
  };

  const handleDeletePayment = async (paymentId: string) => {
    const response = await apiClient.delete(`/payments/${paymentId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete payment');
      return;
    }

    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  const handleDrop = (status: PaymentStatusId) => {
    if (draggedPaymentId) {
      void movePaymentToStatus(draggedPaymentId, status);
    }
    setDraggedPaymentId(null);
  };

  const renderPaymentCard = (payment: Payment) => (
    <div
      key={payment.id}
      draggable
      onDragStart={() => setDraggedPaymentId(payment.id)}
      onDragEnd={() => setDraggedPaymentId(null)}
      className={cn(
        'rounded-xl border border-white/10 bg-white dark:bg-slate-900 shadow-sm cursor-grab active:cursor-grabbing',
        'p-4',
        draggedPaymentId === payment.id && 'opacity-50 ring-2 ring-amber-400/50',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {payment.paymentCode}
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            void handleDeletePayment(payment.id);
          }}
          className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
          aria-label="Delete payment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white text-sm">
        {formatAmount(payment.amount, payment.currency)}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
        {payment.project.projectName}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
        {payment.project.clientName} · {payment.project.projectCode}
      </p>
      {payment.description && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{payment.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDeadline(payment.deadline)}
        </span>
        <span className="text-[10px] text-slate-400">{relativeTime(payment.updatedAt)}</span>
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Payments"
      description="Track project payments by status. Drag cards between columns or filter by state."
    >
      <div className="w-full max-w-none rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-orange-50/50 dark:from-amber-950/30 dark:to-slate-900/80 dark:border-amber-500/10 p-4 md:p-6 min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments or projects…"
              className="pl-9 bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-white/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden bg-white/60 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  viewMode === 'board'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <LayoutList className="h-4 w-4" />
                List
              </button>
            </div>

            <Button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-footer"
            >
              <Plus className="h-4 w-4" />
              Add payment
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={fetchPayments}
              disabled={loading}
              className="font-footer border-slate-200 dark:border-white/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              statusFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
            )}
          >
            All
          </button>
          {PAYMENT_STATUSES.map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setStatusFilter(status.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                statusFilter === status.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
              )}
            >
              {status.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : viewMode === 'board' ? (
          <div className={boardGridClass}>
            {visibleStatuses.map((status) => {
              const columnPayments = paymentsByStatus[status.id];

              return (
                <div
                  key={status.id}
                  className="flex min-w-0 flex-col h-full"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(status.id)}
                >
                  <div
                    className={cn(
                      'rounded-t-xl px-4 py-2.5 text-white text-sm font-semibold flex items-center justify-between',
                      status.headerClass,
                    )}
                  >
                    <span>{status.label}</span>
                    <span className="bg-black/20 rounded-full px-2 py-0.5 text-xs">
                      {columnPayments.length}
                    </span>
                  </div>
                  <div className="flex-1 rounded-b-xl bg-slate-100/80 dark:bg-slate-800/40 border border-t-0 border-slate-200 dark:border-white/10 p-3 space-y-3 min-h-[360px]">
                    {columnPayments.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-8 px-2">
                        No payments in this status
                      </p>
                    ) : (
                      columnPayments.map((payment) => renderPaymentCard(payment))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {payments.length === 0 ? (
              <p className="text-center text-slate-500 py-12 font-footer">No payments found</p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {payment.paymentCode}
                      </span>
                      <span className="text-xs text-slate-400">{relativeTime(payment.updatedAt)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {payment.project.projectName} · {payment.project.clientName}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Due {formatDeadline(payment.deadline)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {PAYMENT_STATUSES.map((status) => (
                      <Button
                        key={status.id}
                        type="button"
                        size="sm"
                        variant={payment.status === status.id ? 'default' : 'outline'}
                        disabled={payment.status === status.id || saving}
                        onClick={() => movePaymentToStatus(payment.id, status.id)}
                        className={cn(
                          'text-xs font-footer',
                          payment.status === status.id && 'bg-amber-600',
                        )}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  Add payment
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setForm(emptyForm);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleCreatePayment} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="payment-project" className="text-gray-300">
                    Project *
                  </Label>
                  {projectsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading projects…
                    </div>
                  ) : (
                    <select
                      id="payment-project"
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount" className="text-gray-300">
                      Amount *
                    </Label>
                    <Input
                      id="payment-amount"
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
                    <Label htmlFor="payment-currency" className="text-gray-300">
                      Currency
                    </Label>
                    <Input
                      id="payment-currency"
                      value={form.currency}
                      onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                      placeholder="INR"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-deadline" className="text-gray-300">
                    Deadline *
                  </Label>
                  <Input
                    id="payment-deadline"
                    type="date"
                    required
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-description" className="text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="payment-description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="Optional note"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setForm(emptyForm);
                    }}
                    className="font-footer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving || projectsLoading || !form.projectId}
                    className="bg-amber-600 hover:bg-amber-700 font-footer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Create payment'
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
