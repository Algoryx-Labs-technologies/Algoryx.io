import mongoose from 'mongoose';
import { AdminProject } from '@/models/admin-project.model';
import {
  IMeeting,
  MEETING_STATUSES,
  Meeting,
  MeetingStatus,
} from '@/models/meeting.model';
import { AppError } from '@/types';

export interface MeetingProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface MeetingListItem {
  id: string;
  meetingCode: string;
  title: string;
  status: MeetingStatus;
  scheduledAt: string;
  attendeeName?: string;
  notes?: string;
  projectId?: string;
  project?: MeetingProjectSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingInput {
  title: string;
  status?: MeetingStatus;
  scheduledAt: string;
  attendeeName?: string;
  notes?: string;
  projectId?: string;
}

export interface UpdateMeetingInput {
  title?: string;
  status?: MeetingStatus;
  scheduledAt?: string;
  attendeeName?: string;
  notes?: string;
  projectId?: string | null;
}

type MeetingRecord = IMeeting & {
  _id: { toString(): string };
  projectId?: { toString(): string };
  status: MeetingStatus | 'scheduled';
};

const parseScheduledAt = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Invalid scheduled date');
  }
  return date;
};

const normalizeStatus = (status: string): MeetingStatus => {
  if ((MEETING_STATUSES as readonly string[]).includes(status)) {
    return status as MeetingStatus;
  }
  if (status === 'scheduled') {
    return 'upcoming';
  }
  return 'upcoming';
};

const resolveProjectId = async (
  projectId?: string | null,
): Promise<mongoose.Types.ObjectId | undefined | null> => {
  if (projectId === null) {
    return null;
  }

  if (!projectId?.trim()) {
    return undefined;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError(400, 'Invalid project id');
  }

  const project = await AdminProject.findById(projectId).select('_id').lean();
  if (!project) {
    throw new AppError(400, 'Project not found');
  }

  return new mongoose.Types.ObjectId(projectId);
};

const loadProjectMap = async (
  records: MeetingRecord[],
): Promise<Map<string, MeetingProjectSummary>> => {
  const projectIds = [
    ...new Set(
      records
        .filter((record) => record.projectId)
        .map((record) => String(record.projectId)),
    ),
  ];

  if (!projectIds.length) {
    return new Map();
  }

  const projects = await AdminProject.find({ _id: { $in: projectIds } })
    .select('projectCode projectName clientName')
    .lean();

  return new Map(
    projects.map((project) => [
      String(project._id),
      {
        id: String(project._id),
        projectCode: project.projectCode,
        projectName: project.projectName,
        clientName: project.clientName,
      },
    ]),
  );
};

const toListItem = (
  record: MeetingRecord,
  projectMap: Map<string, MeetingProjectSummary>,
): MeetingListItem => {
  const projectId = record.projectId ? String(record.projectId) : undefined;
  const project = projectId ? projectMap.get(projectId) : undefined;

  return {
    id: String(record._id),
    meetingCode: record.meetingCode,
    title: record.title,
    status: normalizeStatus(record.status),
    scheduledAt: record.scheduledAt.toISOString(),
    attendeeName: record.attendeeName,
    notes: record.notes,
    projectId,
    project,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
};

const toListItems = async (records: MeetingRecord[]): Promise<MeetingListItem[]> => {
  const projectMap = await loadProjectMap(records);
  return records.map((record) => toListItem(record, projectMap));
};

const buildStatusFilter = (
  status: MeetingStatus,
): MeetingStatus | { $in: string[] } => {
  if (status === 'upcoming') {
    return { $in: ['upcoming', 'scheduled'] };
  }
  return status;
};

export const generateMeetingCode = async (): Promise<string> => {
  const count = await Meeting.countDocuments();
  return `MT${String(count + 1).padStart(3, '0')}`;
};

export const createMeeting = async (data: CreateMeetingInput): Promise<MeetingListItem> => {
  const status = data.status ?? 'upcoming';

  if (!MEETING_STATUSES.includes(status)) {
    throw new AppError(400, 'Invalid meeting status');
  }

  const projectId = await resolveProjectId(data.projectId);
  const meetingCode = await generateMeetingCode();

  const record = await Meeting.create({
    meetingCode,
    title: data.title,
    status,
    scheduledAt: parseScheduledAt(data.scheduledAt),
    attendeeName: data.attendeeName,
    notes: data.notes,
    projectId,
  });

  const [item] = await toListItems([record as unknown as MeetingRecord]);
  return item;
};

export interface ListMeetingsOptions {
  status?: MeetingStatus;
  search?: string;
}

export const listMeetings = async (
  options: ListMeetingsOptions = {},
): Promise<MeetingListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.status) {
    if (!MEETING_STATUSES.includes(options.status)) {
      throw new AppError(400, 'Invalid meeting status filter');
    }
    filter.status = buildStatusFilter(options.status);
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const matchingProjects = await AdminProject.find({
      $or: [{ projectName: regex }, { projectCode: regex }, { clientName: regex }],
    })
      .select('_id')
      .lean();

    const projectIds = matchingProjects.map((project) => project._id);

    filter.$or = [
      { meetingCode: regex },
      { title: regex },
      { attendeeName: regex },
      { notes: regex },
      ...(projectIds.length ? [{ projectId: { $in: projectIds } }] : []),
    ];
  }

  const records = await Meeting.find(filter).sort({ scheduledAt: 1 }).lean();
  const items = await toListItems(records as unknown as MeetingRecord[]);

  if (options.status) {
    return items.filter((item) => item.status === options.status);
  }

  return items;
};

export const updateMeeting = async (
  id: string,
  data: UpdateMeetingInput,
): Promise<MeetingListItem> => {
  if (data.status && !MEETING_STATUSES.includes(data.status)) {
    throw new AppError(400, 'Invalid meeting status');
  }

  const update: Record<string, unknown> = {};

  if (data.title !== undefined) update.title = data.title;
  if (data.status !== undefined) update.status = data.status;
  if (data.scheduledAt !== undefined) update.scheduledAt = parseScheduledAt(data.scheduledAt);
  if (data.attendeeName !== undefined) update.attendeeName = data.attendeeName;
  if (data.notes !== undefined) update.notes = data.notes;

  if (data.projectId !== undefined) {
    update.projectId = await resolveProjectId(data.projectId);
  }

  const record = await Meeting.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!record) {
    throw new AppError(404, 'Meeting not found');
  }

  const [item] = await toListItems([record as unknown as MeetingRecord]);
  return item;
};

export const deleteMeeting = async (id: string): Promise<void> => {
  const result = await Meeting.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Meeting not found');
  }
};
