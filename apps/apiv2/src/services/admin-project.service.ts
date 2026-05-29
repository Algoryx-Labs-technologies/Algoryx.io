import {
  ADMIN_PROJECT_STAGES,
  AdminProject,
  AdminProjectStage,
  IAdminProject,
} from '@/models/admin-project.model';
import { ITeamMember, TeamMember } from '@/models/team.model';
import { resolveTeamMemberIds } from '@/services/team.service';
import { AppError } from '@/types';

export interface AssignedTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateAdminProjectInput {
  projectName: string;
  clientName: string;
  clientEmail?: string;
  description?: string;
  budget?: string;
  deadline?: string;
  stage?: AdminProjectStage;
  teamMemberIds?: string[];
}

export interface UpdateAdminProjectInput {
  projectName?: string;
  clientName?: string;
  clientEmail?: string;
  description?: string;
  budget?: string;
  deadline?: string | null;
  stage?: AdminProjectStage;
  teamMemberIds?: string[];
}

export interface AdminProjectListItem {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  clientEmail?: string;
  description?: string;
  budget?: string;
  deadline?: string;
  stage: AdminProjectStage;
  assignedTeam: AssignedTeamMember[];
  createdAt: string;
  updatedAt: string;
}

type ProjectRecord = IAdminProject & {
  _id: { toString(): string };
  assignedTeamIds?: { toString(): string }[];
};

const parseDeadline = (value?: string | null): Date | undefined | null => {
  if (value === null) {
    return null;
  }
  if (!value?.trim()) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Invalid deadline date');
  }
  return date;
};

const mapTeamMember = (member: ITeamMember | Record<string, unknown>): AssignedTeamMember => {
  const doc = member as ITeamMember & { _id: { toString(): string } };
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
  };
};

const loadAssignedTeamMap = async (
  records: ProjectRecord[],
): Promise<Map<string, AssignedTeamMember>> => {
  const allIds = [
    ...new Set(
      records.flatMap((record) =>
        (record.assignedTeamIds ?? []).map((id) => String(id)),
      ),
    ),
  ];

  if (!allIds.length) {
    return new Map();
  }

  const members = await TeamMember.find({ _id: { $in: allIds } }).lean();
  return new Map(members.map((member) => [String(member._id), mapTeamMember(member)]));
};

const toListItem = (
  record: ProjectRecord,
  teamMap: Map<string, AssignedTeamMember>,
): AdminProjectListItem => ({
  id: String(record._id),
  projectCode: record.projectCode,
  projectName: record.projectName,
  clientName: record.clientName,
  clientEmail: record.clientEmail,
  description: record.description,
  budget: record.budget,
  deadline: record.deadline?.toISOString(),
  stage: record.stage,
  assignedTeam: (record.assignedTeamIds ?? [])
    .map((id) => teamMap.get(String(id)))
    .filter((member): member is AssignedTeamMember => Boolean(member)),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

const toListItems = async (records: ProjectRecord[]): Promise<AdminProjectListItem[]> => {
  const teamMap = await loadAssignedTeamMap(records);
  return records.map((record) => toListItem(record, teamMap));
};

export const generateProjectCode = async (): Promise<string> => {
  const count = await AdminProject.countDocuments();
  return `PR${String(count + 1).padStart(3, '0')}`;
};

export const createAdminProject = async (
  data: CreateAdminProjectInput,
): Promise<AdminProjectListItem> => {
  const stage = data.stage ?? 'not_started';

  if (!ADMIN_PROJECT_STAGES.includes(stage)) {
    throw new AppError(400, 'Invalid project stage');
  }

  const projectCode = await generateProjectCode();
  const deadline = parseDeadline(data.deadline);
  const assignedTeamIds = await resolveTeamMemberIds(data.teamMemberIds ?? []);

  const record = await AdminProject.create({
    projectCode,
    projectName: data.projectName,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    description: data.description,
    budget: data.budget,
    deadline,
    stage,
    assignedTeamIds,
  });

  const [item] = await toListItems([record as ProjectRecord]);
  return item;
};

export interface ListAdminProjectsOptions {
  stage?: AdminProjectStage;
  search?: string;
}

export const listAdminProjects = async (
  options: ListAdminProjectsOptions = {},
): Promise<AdminProjectListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.stage) {
    if (!ADMIN_PROJECT_STAGES.includes(options.stage)) {
      throw new AppError(400, 'Invalid project stage filter');
    }
    filter.stage = options.stage;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { projectName: regex },
      { clientName: regex },
      { clientEmail: regex },
      { projectCode: regex },
      { description: regex },
    ];
  }

  const records = await AdminProject.find(filter).sort({ updatedAt: -1 }).lean();

  return toListItems(records as unknown as ProjectRecord[]);
};

export const updateAdminProject = async (
  id: string,
  data: UpdateAdminProjectInput,
): Promise<AdminProjectListItem> => {
  if (data.stage && !ADMIN_PROJECT_STAGES.includes(data.stage)) {
    throw new AppError(400, 'Invalid project stage');
  }

  const { deadline, teamMemberIds, ...rest } = data;
  const update: Record<string, unknown> = { ...rest };

  if ('deadline' in data) {
    update.deadline = parseDeadline(deadline);
  }

  if (teamMemberIds !== undefined) {
    update.assignedTeamIds = await resolveTeamMemberIds(teamMemberIds);
  }

  const record = await AdminProject.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!record) {
    throw new AppError(404, 'Project not found');
  }

  const [item] = await toListItems([record as unknown as ProjectRecord]);
  return item;
};

export const deleteAdminProject = async (id: string): Promise<void> => {
  const result = await AdminProject.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Project not found');
  }
};
