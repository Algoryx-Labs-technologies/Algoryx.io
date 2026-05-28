import mongoose from 'mongoose';
import { ITeamMember, TeamMember } from '@/models/team.model';
import { AppError } from '@/types';

export interface TeamMemberListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  role: string;
}

const toListItem = (record: ITeamMember): TeamMemberListItem => ({
  id: String(record._id),
  name: record.name,
  email: record.email,
  role: record.role,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export interface ListTeamMembersOptions {
  search?: string;
}

export const listTeamMembers = async (
  options: ListTeamMembersOptions = {},
): Promise<TeamMemberListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { role: regex }];
  }

  const records = await TeamMember.find(filter).sort({ updatedAt: -1 }).lean();

  return records.map((record) => toListItem(record as unknown as ITeamMember));
};

export const createTeamMember = async (
  data: CreateTeamMemberInput,
): Promise<TeamMemberListItem> => {
  const record = await TeamMember.create({
    name: data.name,
    email: data.email,
    role: data.role,
  });

  return toListItem(record);
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const result = await TeamMember.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Member not found');
  }
};

export const resolveTeamMemberIds = async (
  ids: string[],
): Promise<mongoose.Types.ObjectId[]> => {
  if (!ids.length) {
    return [];
  }

  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];

  for (const id of uniqueIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid team member id');
    }
  }

  const count = await TeamMember.countDocuments({ _id: { $in: uniqueIds } });
  if (count !== uniqueIds.length) {
    throw new AppError(400, 'One or more team members not found');
  }

  return uniqueIds.map((id) => new mongoose.Types.ObjectId(id));
};
