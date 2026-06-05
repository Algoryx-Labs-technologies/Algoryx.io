import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CreditCard,
  FileText,
  FolderKanban,
  GitBranch,
  Loader2,
  MessageSquare,
  RefreshCw,
  StickyNote,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import type { DashboardSummary, StageCount } from './types';

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

function StageBar({ stages }: { stages: StageCount[] }) {
  const total = stages.reduce((sum, row) => sum + row.count, 0);

  if (!total) {
    return <p className="text-xs text-gray-500 font-footer">No data yet</p>;
  }

  return (
    <div className="space-y-2">
      {stages.map((row) => (
        <div key={row.stage}>
          <div className="flex justify-between text-xs font-footer mb-1">
            <span className="text-gray-400">{row.label}</span>
            <span className="text-gray-300">{row.count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500/80"
              style={{ width: `${Math.max((row.count / total) * 100, row.count ? 8 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface WidgetHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  onNavigate: (path: string) => void;
}

function WidgetHeader({ title, description, icon, path, onNavigate }: WidgetHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <CardTitle className="text-white font-hero flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          <CardDescription className="font-footer mt-1">{description}</CardDescription>
        </div>
        <button
          type="button"
          onClick={() => onNavigate(path)}
          className="text-gray-500 hover:text-blue-400 transition-colors shrink-0 p-1"
          aria-label={`Open ${title}`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </CardHeader>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.get<DashboardSummary>('/dashboard/summary');

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load dashboard');
      setData(null);
      setLoading(false);
      return;
    }

    setData(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const currency = data?.finance.currency ?? 'INR';

  return (
    <AppLayout
      title="Dashboard"
      description="Overview of sales, projects, payments, support, and finances."
    >
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={fetchDashboard}
          disabled={loading}
          className="font-footer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card
              className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 border border-emerald-500/20 cursor-pointer hover:border-emerald-500/40 transition-colors"
              onClick={() => navigate('/revenue-expense')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">
                  {formatAmount(data.finance.totalRevenue, currency)}
                </p>
                <CardDescription className="font-footer mt-1">From paid payments</CardDescription>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-violet-900/30 to-slate-800/50 border border-violet-500/20 cursor-pointer hover:border-violet-500/40 transition-colors"
              onClick={() => navigate('/revenue-expense')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Net Balance</CardTitle>
                <Wallet className="h-4 w-4 text-violet-400" />
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    'text-2xl font-bold font-hero',
                    data.finance.netBalance >= 0 ? 'text-emerald-300' : 'text-red-300',
                  )}
                >
                  {formatAmount(data.finance.netBalance, currency)}
                </p>
                <CardDescription className="font-footer mt-1">
                  Expenses: {formatAmount(data.finance.totalExpenses, currency)}
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-colors"
              onClick={() => navigate('/sales-pipeline')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Active Leads</CardTitle>
                <GitBranch className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">{data.salesPipeline.active}</p>
                <CardDescription className="font-footer mt-1">
                  {data.salesPipeline.total} total in pipeline
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-cyan-900/20 to-slate-800/50 border border-cyan-500/20 cursor-pointer hover:border-cyan-500/40 transition-colors"
              onClick={() => navigate('/current-projects')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Active Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">{data.projects.active}</p>
                <CardDescription className="font-footer mt-1">
                  {data.projects.total} total projects
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <WidgetHeader
                title="Payments"
                description="Payment status overview"
                icon={<CreditCard className="h-4 w-4 text-amber-400" />}
                path="/payments"
                onNavigate={navigate}
              />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-center">
                    <p className="text-lg font-bold text-amber-300">{data.payments.pending}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Pending</p>
                  </div>
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-center">
                    <p className="text-lg font-bold text-red-300">{data.payments.delayed}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Delayed</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-center">
                    <p className="text-lg font-bold text-emerald-300">{data.payments.paid}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Paid</p>
                  </div>
                </div>
                {data.payments.upcoming.length ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-footer uppercase tracking-wide">Upcoming</p>
                    {data.payments.upcoming.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-lg border border-white/10 bg-slate-800/40 px-3 py-2"
                      >
                        <p className="text-sm text-white font-footer">
                          {formatAmount(payment.amount, payment.currency)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{payment.projectName}</p>
                        <p className="text-[10px] text-gray-500">Due {formatDate(payment.deadline)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-footer">No upcoming payments</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <WidgetHeader
                title="Sales Pipeline"
                description="Leads by stage"
                icon={<GitBranch className="h-4 w-4 text-blue-400" />}
                path="/sales-pipeline"
                onNavigate={navigate}
              />
              <CardContent className="space-y-4">
                <StageBar stages={data.salesPipeline.byStage} />
                {data.salesPipeline.recent.length ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-500 font-footer uppercase tracking-wide">Recent</p>
                    {data.salesPipeline.recent.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <p className="text-white font-footer truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-500">{lead.leadCode}</p>
                        </div>
                        <span className="text-[10px] text-blue-300 shrink-0">{lead.stageLabel}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <WidgetHeader
                title="Current Projects"
                description="Projects by stage"
                icon={<FolderKanban className="h-4 w-4 text-cyan-400" />}
                path="/current-projects"
                onNavigate={navigate}
              />
              <CardContent className="space-y-4">
                <StageBar stages={data.projects.byStage} />
                {data.projects.recent.length ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-500 font-footer uppercase tracking-wide">Recent</p>
                    {data.projects.recent.map((project) => (
                      <div key={project.id} className="flex items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <p className="text-white font-footer truncate">{project.projectName}</p>
                          <p className="text-[10px] text-gray-500">{project.clientName}</p>
                        </div>
                        <span className="text-[10px] text-cyan-300 shrink-0">{project.stageLabel}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <WidgetHeader
                title="Support Tickets"
                description={`${data.support.urgent} urgent of ${data.support.total} total`}
                icon={<MessageSquare className="h-4 w-4 text-orange-400" />}
                path="/support-tickets"
                onNavigate={navigate}
              />
              <CardContent>
                {data.support.recent.length ? (
                  <div className="space-y-2">
                    {data.support.recent.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-lg border border-white/10 bg-slate-800/40 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-white font-footer truncate">{ticket.subject}</p>
                          <span
                            className={cn(
                              'text-[10px] uppercase px-2 py-0.5 rounded shrink-0',
                              ticket.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-slate-600/40 text-gray-300',
                            )}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{ticket.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-footer">No support tickets</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10">
              <WidgetHeader
                title="Requirements"
                description={`${data.requirements.total} landing submissions`}
                icon={<FileText className="h-4 w-4 text-indigo-400" />}
                path="/requirements"
                onNavigate={navigate}
              />
              <CardContent>
                {data.requirements.recent.length ? (
                  <div className="space-y-2">
                    {data.requirements.recent.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-lg border border-white/10 bg-slate-800/40 px-3 py-2"
                      >
                        <p className="text-sm text-white font-footer">{req.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{req.email}</p>
                        {req.companyOrg && (
                          <p className="text-[10px] text-gray-500 mt-1">{req.companyOrg}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-footer">No requirements yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10 cursor-pointer hover:border-blue-500/30 transition-colors"
              onClick={() => navigate('/teams')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Team Members</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">{data.teams.total}</p>
                <CardDescription className="font-footer mt-1">People on the team</CardDescription>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/10 cursor-pointer hover:border-blue-500/30 transition-colors"
              onClick={() => navigate('/notes')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-footer text-gray-300">Notes</CardTitle>
                <StickyNote className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-hero text-white">{data.notes.total}</p>
                <CardDescription className="font-footer mt-1">Admin reminders saved</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}
