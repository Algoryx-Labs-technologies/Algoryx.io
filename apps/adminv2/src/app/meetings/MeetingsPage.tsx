import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  CalendarDays,
  Grid3X3,
  LayoutList,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
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
  MEETING_STAGES,
  type AdminProjectOption,
  type Meeting,
  type MeetingStageId,
  type StageFilter,
} from './types';

type ViewMode = 'board' | 'list';

interface MeetingForm {
  title: string;
  scheduledAt: string;
  attendeeName: string;
  notes: string;
  projectId: string;
}

const emptyForm: MeetingForm = {
  title: '',
  scheduledAt: '',
  attendeeName: '',
  notes: '',
  projectId: '',
};

const accentBtn = 'bg-indigo-600 hover:bg-indigo-700';

const selectClass = cn(
  'dark:bg-slate-800 border-white/10 flex h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatScheduledDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

function formatRelativeDate(iso: string): string {
  try {
    const date = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduled = new Date(date);
    scheduled.setHours(0, 0, 0, 0);
    const diffDays = Math.round((scheduled.getTime() - today.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '';
  }
}

function isMeetingOverdue(iso: string, status: MeetingStageId): boolean {
  if (status !== 'upcoming') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduled = new Date(iso);
  scheduled.setHours(0, 0, 0, 0);
  return scheduled < today;
}

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [projects, setProjects] = useState<AdminProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState<MeetingForm>(emptyForm);
  const [draggedMeetingId, setDraggedMeetingId] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (stageFilter !== 'all') params.set('status', stageFilter);

    const query = params.toString();
    const endpoint = query ? `/meetings?${query}` : '/meetings';
    const response = await apiClient.get<Meeting[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load meetings');
      setMeetings([]);
      setLoading(false);
      return;
    }

    setMeetings(response.data);
    setLoading(false);
  }, [search, stageFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMeetings();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMeetings]);

  useEffect(() => {
    if (!showModal) return;

    const fetchProjects = async () => {
      setProjectsLoading(true);
      const response = await apiClient.get<AdminProjectOption[]>(
        '/admin-projects?excludeStage=delivered',
      );
      setProjects(response.success && response.data ? response.data : []);
      setProjectsLoading(false);
    };

    void fetchProjects();
  }, [showModal]);

  const meetingsByStage = useMemo(() => {
    const grouped = Object.fromEntries(
      MEETING_STAGES.map((s) => [s.id, [] as Meeting[]]),
    ) as Record<MeetingStageId, Meeting[]>;

    for (const meeting of meetings) {
      if (grouped[meeting.status]) {
        grouped[meeting.status].push(meeting);
      }
    }

    return grouped;
  }, [meetings]);

  const visibleStages = useMemo(
    () =>
      MEETING_STAGES.filter(
        (stage) => stageFilter === 'all' || stageFilter === stage.id,
      ),
    [stageFilter],
  );

  const boardGridClass = cn(
    'grid gap-4 w-full min-h-[420px] pb-4',
    visibleStages.length === 1 && 'grid-cols-1',
    visibleStages.length === 2 && 'grid-cols-1 md:grid-cols-2',
    visibleStages.length === 3 && 'grid-cols-1 md:grid-cols-3',
    visibleStages.length >= 4 && 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  );

  const openCreateModal = () => {
    setEditingMeeting(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setForm({
      title: meeting.title,
      scheduledAt: toDateInputValue(meeting.scheduledAt),
      attendeeName: meeting.attendeeName ?? '',
      notes: meeting.notes ?? '',
      projectId: meeting.projectId ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMeeting(null);
    setForm(emptyForm);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      scheduledAt: new Date(`${form.scheduledAt}T12:00:00`).toISOString(),
      attendeeName: form.attendeeName.trim() || undefined,
      notes: form.notes.trim() || undefined,
      projectId: form.projectId || undefined,
    };

    const response = editingMeeting
      ? await apiClient.patch<Meeting>(`/meetings/${editingMeeting.id}`, payload)
      : await apiClient.post<Meeting>('/meetings', { ...payload, status: 'upcoming' });

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to save meeting');
      return;
    }

    closeModal();
    await fetchMeetings();
  };

  const moveMeetingToStage = async (meetingId: string, status: MeetingStageId) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting || meeting.status === status) return;

    setMeetings((prev) =>
      prev.map((item) => (item.id === meetingId ? { ...item, status } : item)),
    );

    const response = await apiClient.patch<Meeting>(`/meetings/${meetingId}`, { status });

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to move meeting');
      await fetchMeetings();
      return;
    }

    setMeetings((prev) =>
      prev.map((item) => (item.id === meetingId ? response.data! : item)),
    );
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    const response = await apiClient.delete(`/meetings/${meetingId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete meeting');
      return;
    }

    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
  };

  const handleDrop = (stage: MeetingStageId) => {
    if (draggedMeetingId) {
      void moveMeetingToStage(draggedMeetingId, stage);
    }
    setDraggedMeetingId(null);
  };

  const renderMeetingCard = (meeting: Meeting) => {
    const overdue = isMeetingOverdue(meeting.scheduledAt, meeting.status);

    return (
      <div
        key={meeting.id}
        draggable
        onDragStart={() => setDraggedMeetingId(meeting.id)}
        onDragEnd={() => setDraggedMeetingId(null)}
        className={cn(
          'rounded-xl border bg-white dark:bg-slate-900 shadow-sm cursor-grab active:cursor-grabbing p-4',
          overdue ? 'border-red-500/40' : 'border-white/10',
          draggedMeetingId === meeting.id && 'opacity-50 ring-2 ring-indigo-400/50',
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {meeting.meetingCode}
          </span>
          <div className="flex gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(meeting);
              }}
              className="p-1 rounded hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400"
              aria-label="Edit meeting"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                void handleDeleteMeeting(meeting.id);
              }}
              className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400"
              aria-label="Delete meeting"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="font-semibold text-slate-900 dark:text-white text-sm">{meeting.title}</p>

        <p className="text-xs text-indigo-300/90 mt-2 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 shrink-0" />
          {formatScheduledDate(meeting.scheduledAt)}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">{formatRelativeDate(meeting.scheduledAt)}</p>

        {overdue && (
          <span className="inline-block mt-2 text-[10px] uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
            Overdue
          </span>
        )}

        {meeting.attendeeName && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 truncate">
            <User className="h-3 w-3 shrink-0" />
            {meeting.attendeeName}
          </p>
        )}

        {meeting.project && (
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            {meeting.project.projectCode} · {meeting.project.projectName}
          </p>
        )}

        {meeting.notes && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{meeting.notes}</p>
        )}
      </div>
    );
  };

  return (
    <AppLayout
      title="Meetings"
      description="Track upcoming meetings and follow-ups. Drag cards between columns."
    >
      <div className="w-full max-w-none rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/90 to-violet-50/50 dark:from-indigo-950/30 dark:to-slate-900/80 dark:border-indigo-500/10 p-4 md:p-6 min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings, attendees, projects…"
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
                    ? 'bg-indigo-600 text-white'
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
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <LayoutList className="h-4 w-4" />
                List
              </button>
            </div>

            <Button
              type="button"
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-footer"
            >
              <Plus className="h-4 w-4" />
              Add meeting
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={fetchMeetings}
              disabled={loading}
              className="font-footer border-slate-200 dark:border-white/10"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
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
                ? 'bg-indigo-600 text-white'
                : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
            )}
          >
            All
          </button>
          {MEETING_STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStageFilter(stage.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                stageFilter === stage.id
                  ? 'bg-indigo-600 text-white'
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
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : viewMode === 'board' ? (
          <div className={boardGridClass}>
            {visibleStages.map((stage) => {
              const columnMeetings = meetingsByStage[stage.id];

              return (
                <div
                  key={stage.id}
                  className="flex min-w-0 flex-col h-full"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                >
                  <div
                    className={cn(
                      'rounded-t-xl px-4 py-2.5 text-white text-sm font-semibold flex items-center justify-between',
                      stage.headerClass,
                    )}
                  >
                    <span>{stage.label}</span>
                    <span className="bg-black/20 rounded-full px-2 py-0.5 text-xs">
                      {columnMeetings.length}
                    </span>
                  </div>
                  <div className="flex-1 rounded-b-xl bg-slate-100/80 dark:bg-slate-800/40 border border-t-0 border-slate-200 dark:border-white/10 p-3 space-y-3 min-h-[360px]">
                    {columnMeetings.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-8 px-2">
                        No meetings in this column
                      </p>
                    ) : (
                      columnMeetings.map((meeting) => renderMeetingCard(meeting))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {meetings.length === 0 ? (
              <p className="text-center text-slate-500 py-12 font-footer">No meetings found</p>
            ) : (
              meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {meeting.meetingCode}
                      </span>
                      <span className="text-xs text-slate-400">{formatRelativeDate(meeting.scheduledAt)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{meeting.title}</p>
                    <p className="text-sm text-slate-500">{formatScheduledDate(meeting.scheduledAt)}</p>
                    {meeting.attendeeName && (
                      <p className="text-sm text-slate-500">{meeting.attendeeName}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {MEETING_STAGES.map((stage) => (
                      <Button
                        key={stage.id}
                        type="button"
                        size="sm"
                        variant={meeting.status === stage.id ? 'default' : 'outline'}
                        disabled={meeting.status === stage.id || saving}
                        onClick={() => moveMeetingToStage(meeting.id, stage.id)}
                        className={cn(
                          'text-xs font-footer',
                          meeting.status === stage.id && 'bg-indigo-600',
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-white/10 sticky top-0 bg-slate-900/95 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">
                  {editingMeeting ? 'Edit meeting' : 'Add meeting'}
                </CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleSaveMeeting} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title" className="text-gray-300">Title *</Label>
                  <Input
                    id="meeting-title"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="e.g. Client follow-up"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-date" className="text-gray-300">Date *</Label>
                  <Input
                    id="meeting-date"
                    type="date"
                    required
                    value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-project" className="text-gray-300">
                    Related project <span className="text-gray-500">(optional)</span>
                  </Label>
                  {projectsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading projects…
                    </div>
                  ) : (
                    <select
                      id="meeting-project"
                      value={form.projectId}
                      onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                      className={selectClass}
                    >
                      <option value="">No project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.projectCode} — {project.projectName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-attendee" className="text-gray-300">
                    Attendee <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="meeting-attendee"
                    value={form.attendeeName}
                    onChange={(e) => setForm((f) => ({ ...f, attendeeName: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="Client or team member name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-notes" className="text-gray-300">
                    Notes <span className="text-gray-500">(optional)</span>
                  </Label>
                  <textarea
                    id="meeting-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className={cn(
                      'dark:bg-slate-800 border-white/10 flex w-full rounded-md border px-3 py-2 text-base md:text-sm outline-none resize-y min-h-[80px]',
                      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    )}
                    placeholder="Agenda or follow-up points…"
                  />
                </div>

                {!editingMeeting && (
                  <p className="text-xs text-gray-500">
                    New meetings are added to the <span className="text-sky-300">Upcoming</span> column.
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeModal} className="font-footer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className={cn(accentBtn, 'font-footer')}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : editingMeeting ? (
                      'Save changes'
                    ) : (
                      'Add meeting'
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
