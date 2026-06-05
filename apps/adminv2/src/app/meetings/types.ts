export const MEETING_TYPES = [
  { id: 'meeting', label: 'Meeting' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'call', label: 'Call' },
  { id: 'internal', label: 'Internal' },
] as const;

export const MEETING_STATUSES = [
  { id: 'scheduled', label: 'Scheduled', badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  { id: 'completed', label: 'Completed', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'cancelled', label: 'Cancelled', badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
] as const;

export type MeetingTypeId = (typeof MEETING_TYPES)[number]['id'];
export type MeetingStatusId = (typeof MEETING_STATUSES)[number]['id'];

export type MeetingFilter = 'all' | 'upcoming' | MeetingStatusId;

export interface MeetingProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface Meeting {
  id: string;
  meetingCode: string;
  title: string;
  type: MeetingTypeId;
  status: MeetingStatusId;
  scheduledAt: string;
  durationMinutes?: number;
  attendeeName?: string;
  attendeeEmail?: string;
  locationOrLink?: string;
  notes?: string;
  projectId?: string;
  project?: MeetingProjectSummary;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProjectOption {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}
