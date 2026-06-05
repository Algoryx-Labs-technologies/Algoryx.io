export const MEETING_STAGES = [
  {
    id: 'upcoming',
    label: 'Upcoming',
    headerClass: 'bg-sky-600',
  },
  {
    id: 'follow_up',
    label: 'Follow-up',
    headerClass: 'bg-violet-600',
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    headerClass: 'bg-slate-600',
  },
  {
    id: 'completed',
    label: 'Completed',
    headerClass: 'bg-emerald-600',
  },
] as const;

export type MeetingStageId = (typeof MEETING_STAGES)[number]['id'];

export type StageFilter = 'all' | MeetingStageId;

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
  status: MeetingStageId;
  scheduledAt: string;
  attendeeName?: string;
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
