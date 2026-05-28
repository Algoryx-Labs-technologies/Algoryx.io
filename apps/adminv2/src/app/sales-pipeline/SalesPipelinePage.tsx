import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Grid3X3,
  LayoutList,
  Loader2,
  MoreHorizontal,
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
  PIPELINE_STAGES,
  type PipelineStageId,
  type SalesLead,
  type StageFilter,
} from './types';

type ViewMode = 'board' | 'list';

interface AddLeadForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const emptyForm: AddLeadForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
};

function stageLabel(stage: PipelineStageId): string {
  return PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

export function SalesPipelinePage() {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddLeadForm>(emptyForm);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [menuLeadId, setMenuLeadId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (stageFilter !== 'all') {
      params.set('stage', stageFilter);
    }

    const query = params.toString();
    const endpoint = query ? `/sales-leads?${query}` : '/sales-leads';
    const response = await apiClient.get<SalesLead[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load leads');
      setLeads([]);
      setLoading(false);
      return;
    }

    setLeads(response.data);
    setLoading(false);
  }, [search, stageFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const leadsByStage = useMemo(() => {
    const grouped = Object.fromEntries(
      PIPELINE_STAGES.map((s) => [s.id, [] as SalesLead[]]),
    ) as Record<PipelineStageId, SalesLead[]>;

    for (const lead of leads) {
      if (grouped[lead.stage]) {
        grouped[lead.stage].push(lead);
      }
    }

    return grouped;
  }, [leads]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const response = await apiClient.post<SalesLead>('/sales-leads', {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to create lead');
      return;
    }

    setShowAddModal(false);
    setForm(emptyForm);
    await fetchLeads();
  };

  const moveLeadToStage = async (leadId: string, stage: PipelineStageId) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === stage) {
      return;
    }

    setLeads((prev) =>
      prev.map((item) => (item.id === leadId ? { ...item, stage } : item)),
    );

    const response = await apiClient.patch<SalesLead>(`/sales-leads/${leadId}`, {
      stage,
    });

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to move lead');
      await fetchLeads();
      return;
    }

    setLeads((prev) =>
      prev.map((item) => (item.id === leadId ? response.data! : item)),
    );
  };

  const handleDeleteLead = async (leadId: string) => {
    setMenuLeadId(null);
    const response = await apiClient.delete(`/sales-leads/${leadId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete lead');
      return;
    }

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleDrop = (stage: PipelineStageId) => {
    if (draggedLeadId) {
      void moveLeadToStage(draggedLeadId, stage);
    }
    setDraggedLeadId(null);
  };

  const renderLeadCard = (lead: SalesLead) => (
    <div
      key={lead.id}
      draggable
      onDragStart={() => setDraggedLeadId(lead.id)}
      onDragEnd={() => setDraggedLeadId(null)}
      className={cn(
        'rounded-xl border border-white/10 bg-white dark:bg-slate-900 shadow-sm cursor-grab active:cursor-grabbing',
        'p-4',
        draggedLeadId === lead.id && 'opacity-50 ring-2 ring-emerald-400/50',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {lead.leadCode}
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuLeadId(menuLeadId === lead.id ? null : lead.id)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            aria-label="Lead actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuLeadId === lead.id && (
            <div className="absolute right-0 top-7 z-20 min-w-[120px] rounded-lg border border-white/10 bg-slate-900 shadow-lg py-1">
              <button
                type="button"
                onClick={() => handleDeleteLead(lead.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white text-sm">{lead.name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{lead.email}</p>
      {lead.company && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{lead.company}</p>
      )}
      {lead.notes && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{lead.notes}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
        <span className="text-[10px] uppercase text-slate-400">{stageLabel(lead.stage)}</span>
        <span className="text-[10px] text-slate-400">{relativeTime(lead.updatedAt)}</span>
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Sales pipeline"
      description="Track leads from discovery through completion. Drag cards between stages or use filters."
    >
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 dark:from-emerald-950/30 dark:to-slate-900/80 dark:border-emerald-500/10 p-4 md:p-6 min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
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
                    ? 'bg-emerald-600 text-white'
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
                    ? 'bg-emerald-600 text-white'
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-footer"
            >
              <Plus className="h-4 w-4" />
              Add lead
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={fetchLeads}
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
            onClick={() => setStageFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              stageFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
            )}
          >
            All
          </button>
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStageFilter(stage.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                stageFilter === stage.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
              )}
            >
              {stage.label}
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
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : viewMode === 'board' ? (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[420px]">
            {PIPELINE_STAGES.map((stage) => {
              const columnLeads = leadsByStage[stage.id];
              const hidden =
                stageFilter !== 'all' && stageFilter !== stage.id;

              if (hidden) {
                return null;
              }

              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-[260px] md:w-[280px] flex flex-col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                >
                  <div
                    className={cn(
                      'rounded-t-xl px-3 py-2 text-white text-sm font-semibold flex items-center justify-between',
                      stage.headerClass,
                    )}
                  >
                    <span>{stage.label}</span>
                    <span className="bg-black/20 rounded-full px-2 py-0.5 text-xs">
                      {columnLeads.length}
                    </span>
                  </div>
                  <div className="flex-1 rounded-b-xl bg-slate-100/80 dark:bg-slate-800/40 border border-t-0 border-slate-200 dark:border-white/10 p-2 space-y-2 min-h-[320px]">
                    {columnLeads.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-8 px-2">
                        No leads in this stage
                      </p>
                    ) : (
                      columnLeads.map((lead) => renderLeadCard(lead))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {leads.length === 0 ? (
              <p className="text-center text-slate-500 py-12 font-footer">No leads found</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {lead.leadCode}
                      </span>
                      <span className="text-xs text-slate-400">{relativeTime(lead.updatedAt)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                    <p className="text-sm text-slate-500">{lead.email}</p>
                    {lead.company && (
                      <p className="text-sm text-slate-500">{lead.company}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {PIPELINE_STAGES.map((stage) => (
                      <Button
                        key={stage.id}
                        type="button"
                        size="sm"
                        variant={lead.stage === stage.id ? 'default' : 'outline'}
                        disabled={lead.stage === stage.id || saving}
                        onClick={() => moveLeadToStage(lead.id, stage.id)}
                        className={cn(
                          'text-xs font-footer',
                          lead.stage === stage.id && 'bg-emerald-600',
                        )}
                      >
                        {stage.label}
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
                <CardTitle className="text-white font-hero">Add lead</CardTitle>
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
              <form onSubmit={handleCreateLead} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="lead-name" className="text-gray-300">
                    Name *
                  </Label>
                  <Input
                    id="lead-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-email" className="text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-phone" className="text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="lead-phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-company" className="text-gray-300">
                    Company
                  </Label>
                  <Input
                    id="lead-company"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-notes" className="text-gray-300">
                    Notes
                  </Label>
                  <Input
                    id="lead-notes"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
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
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 font-footer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Create lead'
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
