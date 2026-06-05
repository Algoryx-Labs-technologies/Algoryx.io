import { useCallback, useEffect, useState } from 'react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import {
  CalendarDays,
  CheckCircle2,
  Link2,
  Loader2,
  MapPin,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import {
  MEETING_STATUSES,
  MEETING_TYPES,
  type AdminProjectOption,
  type Meeting,
  type MeetingFilter,
  type MeetingStatusId,
  type MeetingTypeId,
} from './types';

interface MeetingForm {
  title: string;
  type: MeetingTypeId;
  status: MeetingStatusId;
  scheduledAt: string;
  durationMinutes: string;
  attendeeName: string;
  attendeeEmail: string;
  locationOrLink: string;
  notes: string;
  projectId: string;
}

const emptyForm: MeetingForm = {
  title: '',
  type: 'meeting',
  status: 'scheduled',
  scheduledAt: '',
  durationMinutes: '30',
  attendeeName: '',
  attendeeEmail: '',
  locationOrLink: '',
  notes: '',
  projectId: '',
};

const accentBtn = 'bg-indigo-600 hover:bg-indigo-700';

const selectClass = cn(
  'dark:bg-slate-800 border-white/10 flex h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

function typeLabel(type: MeetingTypeId): string {
  return MEETING_TYPES.find((item) => item.id === type)?.label ?? type;
}

function statusMeta(status: MeetingStatusId) {
  return MEETING_STATUSES.find((item) => item.id === status);
}

function toLocalInputValue(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatScheduled(iso: string): string {
  try {
    return format(new Date(iso), 'EEE, MMM d, yyyy · h:mm a');
  } catch {
    return '';
  }
}

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({ scheduled: 0, completed: 0, followUps: 0 });
  const [projects, setProjects] = useState<AdminProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MeetingFilter>('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState<MeetingForm>(emptyForm);

  const fetchStats = useCallback(async () => {
    const response = await apiClient.get<Meeting[]>('/meetings');
    if (response.success && response.data) {
      setStats({
        scheduled: response.data.filter((m) => m.status === 'scheduled').length,
        completed: response.data.filter((m) => m.status === 'completed').length,
        followUps: response.data.filter((m) => m.type === 'follow_up').length,
      });
    }
  }, []);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (filter === 'upcoming') {
      params.set('upcoming', 'true');
    } else if (filter !== 'all') {
      params.set('status', filter);
    }

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
    await fetchStats();
  }, [search, filter, fetchStats]);

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

  const openCreateModal = () => {
    setEditingMeeting(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setForm({
      title: meeting.title,
      type: meeting.type,
      status: meeting.status,
      scheduledAt: toLocalInputValue(meeting.scheduledAt),
      durationMinutes: meeting.durationMinutes ? String(meeting.durationMinutes) : '',
      attendeeName: meeting.attendeeName ?? '',
      attendeeEmail: meeting.attendeeEmail ?? '',
      locationOrLink: meeting.locationOrLink ?? '',
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
      type: form.type,
      status: form.status,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes, 10) : undefined,
      attendeeName: form.attendeeName.trim() || undefined,
      attendeeEmail: form.attendeeEmail.trim() || undefined,
      locationOrLink: form.locationOrLink.trim() || undefined,
      notes: form.notes.trim() || undefined,
      projectId: form.projectId || undefined,
    };

    const response = editingMeeting
      ? await apiClient.patch<Meeting>(`/meetings/${editingMeeting.id}`, payload)
      : await apiClient.post<Meeting>('/meetings', payload);

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to save meeting');
      return;
    }

    closeModal();
    await fetchMeetings();
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    const response = await apiClient.delete(`/meetings/${meetingId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete meeting');
      return;
    }

    await fetchMeetings();
  };

  const handleMarkCompleted = async (meeting: Meeting) => {
    const response = await apiClient.patch<Meeting>(`/meetings/${meeting.id}`, {
      status: 'completed',
    });

    if (!response.success) {
      setError(response.error || 'Failed to update meeting');
      return;
    }

    await fetchMeetings();
  };

  const filterOptions: { id: MeetingFilter; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'all', label: 'All' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <AppLayout
      title="Meetings"
      description="Schedule client meetings, calls, and follow-ups in one place."
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-indigo-900/30 to-slate-800/50 border border-indigo-500/20">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 font-footer uppercase">Scheduled</p>
            <p className="text-2xl font-bold text-white font-hero">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-800/50 border border-emerald-500/20">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 font-footer uppercase">Completed</p>
            <p className="text-2xl font-bold text-white font-hero">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-900/20 to-slate-800/50 border border-violet-500/20">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 font-footer uppercase">Follow-ups</p>
            <p className="text-2xl font-bold text-white font-hero">{stats.followUps}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search meetings, attendees, projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 dark:bg-slate-800 border-white/10 font-footer"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button type="button" variant="outline" onClick={fetchMeetings} disabled={loading} className="font-footer">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button type="button" onClick={openCreateModal} className={cn(accentBtn, 'font-footer')}>
            <Plus className="h-4 w-4" />
            Add meeting
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors font-footer',
              filter === option.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/10',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <CalendarDays className="h-5 w-5 text-indigo-400" />
            Meeting tracker ({meetings.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Upcoming meetings, client calls, and follow-up reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No meetings found</p>
              <p className="text-sm mt-2 text-gray-500">Click Add meeting to schedule one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => {
                const status = statusMeta(meeting.status);
                const overdue =
                  meeting.status === 'scheduled' && isPast(new Date(meeting.scheduledAt));

                return (
                  <div
                    key={meeting.id}
                    className={cn(
                      'rounded-lg border bg-slate-800/40 p-4',
                      overdue ? 'border-red-500/30' : 'border-white/10',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {meeting.meetingCode}
                          </span>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                            {typeLabel(meeting.type)}
                          </span>
                          {status && (
                            <span
                              className={cn(
                                'text-[10px] uppercase px-2 py-0.5 rounded border',
                                status.badgeClass,
                              )}
                            >
                              {status.label}
                            </span>
                          )}
                          {overdue && (
                            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                              Overdue
                            </span>
                          )}
                        </div>

                        <p className="text-white font-semibold font-footer">{meeting.title}</p>

                        <p className="text-sm text-indigo-200/90 font-footer mt-2 flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          {formatScheduled(meeting.scheduledAt)}
                        </p>

                        <p className="text-xs text-gray-500 font-footer mt-1">
                          {formatDistanceToNow(new Date(meeting.scheduledAt), { addSuffix: true })}
                          {meeting.durationMinutes ? ` · ${meeting.durationMinutes} min` : ''}
                        </p>

                        {(meeting.attendeeName || meeting.attendeeEmail) && (
                          <p className="text-sm text-gray-400 font-footer mt-2 flex items-center gap-2">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {meeting.attendeeName}
                              {meeting.attendeeName && meeting.attendeeEmail ? ' · ' : ''}
                              {meeting.attendeeEmail}
                            </span>
                          </p>
                        )}

                        {meeting.project && (
                          <p className="text-xs text-gray-500 font-footer mt-1">
                            Project: {meeting.project.projectCode} — {meeting.project.projectName}
                          </p>
                        )}

                        {meeting.locationOrLink && (
                          <p className="text-xs text-gray-400 font-footer mt-2 flex items-center gap-2 truncate">
                            {meeting.locationOrLink.startsWith('http') ? (
                              <Link2 className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className="truncate">{meeting.locationOrLink}</span>
                          </p>
                        )}

                        {meeting.notes && (
                          <p className="text-sm text-gray-400 font-footer mt-2 line-clamp-2">
                            {meeting.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        {meeting.status === 'scheduled' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkCompleted(meeting)}
                            className="text-gray-500 hover:text-emerald-400"
                            title="Mark completed"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(meeting)}
                          className="text-gray-500 hover:text-indigo-400"
                          title="Edit meeting"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-gray-500 hover:text-red-400"
                          title="Delete meeting"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-white/10 sticky top-0 bg-slate-900/95 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">
                  {editingMeeting ? 'Edit meeting' : 'Schedule meeting'}
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
                    placeholder="e.g. Client kickoff call"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-type" className="text-gray-300">Type</Label>
                    <select
                      id="meeting-type"
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MeetingTypeId }))}
                      className={selectClass}
                    >
                      {MEETING_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-status" className="text-gray-300">Status</Label>
                    <select
                      id="meeting-status"
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as MeetingStatusId }))}
                      className={selectClass}
                    >
                      {MEETING_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-datetime" className="text-gray-300">Date & time *</Label>
                    <Input
                      id="meeting-datetime"
                      type="datetime-local"
                      required
                      value={form.scheduledAt}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-duration" className="text-gray-300">Duration (min)</Label>
                    <Input
                      id="meeting-duration"
                      type="number"
                      min="0"
                      value={form.durationMinutes}
                      onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-project" className="text-gray-300">Related project</Label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-attendee" className="text-gray-300">Attendee name</Label>
                    <Input
                      id="meeting-attendee"
                      value={form.attendeeName}
                      onChange={(e) => setForm((f) => ({ ...f, attendeeName: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-email" className="text-gray-300">Attendee email</Label>
                    <Input
                      id="meeting-email"
                      type="email"
                      value={form.attendeeEmail}
                      onChange={(e) => setForm((f) => ({ ...f, attendeeEmail: e.target.value }))}
                      className="dark:bg-slate-800 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-location" className="text-gray-300">Location or meeting link</Label>
                  <Input
                    id="meeting-location"
                    value={form.locationOrLink}
                    onChange={(e) => setForm((f) => ({ ...f, locationOrLink: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="Zoom link, office, Google Meet…"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-notes" className="text-gray-300">Notes</Label>
                  <textarea
                    id="meeting-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className={cn(
                      'dark:bg-slate-800 border-white/10 flex w-full rounded-md border px-3 py-2 text-base md:text-sm outline-none resize-y min-h-[80px]',
                      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    )}
                    placeholder="Agenda, follow-up points, prep notes…"
                  />
                </div>

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
                      'Schedule meeting'
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
